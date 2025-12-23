// Profile screen

import React from 'react';
import { View, StyleSheet, ScrollView, Linking, Alert, TouchableOpacity, Platform } from 'react-native';
import { Text, Card, Avatar, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '../../store';
import { useNavigation } from '@react-navigation/native';

const SUPPORT_WHATSAPP_NUMBER = '919810468183';
const SUPPORT_MESSAGE = 'Hello! I need help';
const TERMS_URL = 'https://www.baihub.co.in/terms-and-conditions';
const PRIVACY_URL = 'https://www.baihub.co.in/privacy-policy';
const ABOUT_URL = 'https://www.baihub.co.in/about';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const navigation = useNavigation();

  const handleHelpSupport = async () => {
    const whatsappUrl = `whatsapp://send?phone=${SUPPORT_WHATSAPP_NUMBER}&text=${encodeURIComponent(SUPPORT_MESSAGE)}`;
    const webUrl = `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(SUPPORT_MESSAGE)}`;
    
    try {
      if (Platform.OS === 'ios') {
        // On iOS, try to open WhatsApp directly first
        // If it fails, it will throw an error and we'll fallback to web
        try {
          const canOpen = await Linking.canOpenURL(whatsappUrl);
          if (canOpen) {
            await Linking.openURL(whatsappUrl);
          } else {
            // Fallback to web WhatsApp
            await Linking.openURL(webUrl);
          }
        } catch (iosError) {
          // If canOpenURL fails or openURL fails, try web version
          await Linking.openURL(webUrl);
        }
      } else {
        // Android: check if WhatsApp is installed first
        const canOpen = await Linking.canOpenURL(whatsappUrl);
        if (canOpen) {
          await Linking.openURL(whatsappUrl);
        } else {
          // Fallback to web WhatsApp
          await Linking.openURL(webUrl);
        }
      }
    } catch (error) {
      // Final fallback: try web version if everything else fails
      try {
        await Linking.openURL(webUrl);
      } catch (webError) {
        Alert.alert(
          'Unable to open WhatsApp',
          'Please make sure WhatsApp is installed on your device or check your internet connection.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const openUrl = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', 'Unable to open the link.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text
            size={80}
            label={(user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase()}
            style={styles.avatar}
          />
          <Text variant="headlineSmall" style={styles.name}>
            {user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : user?.firstName || user?.email || 'User'}
          </Text>
          <Text variant="bodyMedium" style={styles.email}>
            {user?.phoneNumber?.substring(0, 3) + " " + user?.phoneNumber?.substring(3, 14)}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <TouchableOpacity
            onPress={() => navigation.navigate('Orders' as never)}
            style={styles.menuItem}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              <Icon name="clipboard-list" size={24} color="#000000" />
              <Text style={styles.menuItemText}>My Orders</Text>
            </View>
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity
            onPress={handleHelpSupport}
            style={styles.menuItem}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              <Icon name="help-circle" size={24} color="#000000" />
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity
            onPress={() => openUrl(ABOUT_URL)}
            style={styles.menuItem}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              <Icon name="information" size={24} color="#000000" />
              <Text style={styles.menuItemText}>About</Text>
            </View>
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity
            onPress={() => openUrl(TERMS_URL)}
            style={styles.menuItem}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              <Icon name="file-document-outline" size={24} color="#000000" />
              <Text style={styles.menuItemText}>Terms & Conditions</Text>
            </View>
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity
            onPress={() => openUrl(PRIVACY_URL)}
            style={styles.menuItem}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              <Icon name="shield-lock-outline" size={24} color="#000000" />
              <Text style={styles.menuItemText}>Privacy Policy</Text>
            </View>
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity
            onPress={logout}
            style={styles.menuItem}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              <Icon name="logout" size={24} color="#000000" />
              <Text style={styles.menuItemText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    marginBottom: 8,
  },
  email: {
    opacity: 0.7,
  },
  menuItem: {
    width: '100%',
    paddingVertical: 4,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  menuItemText: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
    marginLeft: 12,
  },
});

