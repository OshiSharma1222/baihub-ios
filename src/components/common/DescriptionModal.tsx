// Description Modal Component - Shows service/category description in a popup

import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Text as RNText,
  useWindowDimensions,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RenderHTML from 'react-native-render-html';

interface DescriptionModalProps {
  visible: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  onContinue: () => void;
}

export const DescriptionModal: React.FC<DescriptionModalProps> = ({
  visible,
  title,
  description,
  onClose,
  onContinue,
}) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  console.log('DescriptionModal - description:', description);
  console.log('DescriptionModal - description type:', typeof description);
  console.log('DescriptionModal - description length:', description?.length);
  console.log('DescriptionModal - visible:', visible);

  if (!description || description.trim() === '') {
    // If no description, just continue without showing modal
    if (visible) {
      // Small delay to ensure state is updated
      setTimeout(() => {
        onContinue();
      }, 0);
    }
    return null;
  }

  // Check if description contains HTML tags
  const hasHtmlTags = /<[^>]+>/g.test(description);
  const contentWidth = width - 40; // Subtract padding

  // Process description to handle newlines
  // Convert literal \n (newline) characters to <br /> tags for HTML rendering
  // This handles cases where description has escaped newlines (\\n) or actual newlines
  const processedDescription = React.useMemo(() => {
    if (!description) return '';
    
    let processed = description;
    
    // Replace escaped newlines (\\n) with actual newlines
    // Handle both double-escaped (\\n in string) and single escaped (\n)
    processed = processed.replace(/\\n/g, '\n');
    
    // If HTML tags are present, convert newlines to <br /> tags for proper HTML rendering
    if (hasHtmlTags) {
      // Use a regex to replace newlines, but avoid replacing newlines inside HTML tags
      // This is a simple approach: replace all newlines that aren't preceded by > or <
      // For better accuracy, we'll split by newlines and reconstruct
      processed = processed.replace(/\n/g, '<br />');
      
      // Clean up: multiple consecutive <br /> tags should be preserved for paragraph breaks
      // But normalize excessive breaks (more than 2 consecutive) to 2
      processed = processed.replace(/(<br \/>){3,}/g, '<br /><br />');
    }
    // For plain text without HTML, newlines will render naturally in React Native Text component
    // No additional processing needed
    
    return processed;
  }, [description, hasHtmlTags]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View
          style={[
            styles.modalContainer,
            {
              paddingBottom: Math.max(insets.bottom, 24),
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text variant="titleLarge" style={styles.title}>
              {title}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Description Content */}
          <View style={styles.descriptionContainer}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {hasHtmlTags ? (
                <RenderHTML
                  contentWidth={contentWidth}
                  source={{ html: processedDescription }}
                  tagsStyles={{
                    body: styles.htmlBody,
                    p: styles.htmlParagraph,
                    strong: styles.htmlBold,
                    b: styles.htmlBold,
                    u: styles.htmlUnderline,
                    span: styles.htmlSpan,
                    br: styles.htmlBreak,
                  }}
                  baseStyle={styles.htmlBase}
                  defaultTextProps={{
                    selectable: true,
                  }}
                />
              ) : (
                <RNText style={styles.description} selectable>
                  {String(processedDescription || 'No description available')}
                </RNText>
              )}
            </ScrollView>
          </View>

          {/* Continue Button */}
          <View style={styles.footer}>
            <Button
              mode="contained"
              onPress={onContinue}
              style={styles.continueButton}
              contentStyle={styles.continueButtonContent}
              labelStyle={styles.continueButtonLabel}
            >
              Continue
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    maxHeight: '80%',
    minHeight: 300,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
    color: '#000000',
    marginRight: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionContainer: {
    minHeight: 300,
    maxHeight: 350,
    marginBottom: 20,
    marginTop: 8,
    width: '100%',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 16,
    paddingTop: 8,
    flexGrow: 1,
  },
  description: {
    color: '#333333',
    lineHeight: 24,
    fontSize: 16,
    flexWrap: 'wrap',
    width: '100%',
  },
  htmlBase: {
    color: '#333333',
    lineHeight: 24,
    fontSize: 16,
  },
  htmlBody: {
    margin: 0,
    padding: 0,
  },
  htmlParagraph: {
    marginBottom: 12,
    marginTop: 0,
  },
  htmlBold: {
    fontWeight: 'bold',
    color: '#000000',
  },
  htmlUnderline: {
    textDecorationLine: 'underline',
  },
  htmlSpan: {
    color: '#333333',
  },
  htmlBreak: {
    marginBottom: 8,
  },
  footer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  continueButton: {
    backgroundColor: '#f9cb00',
    borderRadius: 8,
  },
  continueButtonContent: {
    paddingVertical: 8,
  },
  continueButtonLabel: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
