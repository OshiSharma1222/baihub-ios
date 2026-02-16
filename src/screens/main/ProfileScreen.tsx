// Profile screen

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Card, Divider, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRootNavigation } from '../../navigation/RootNavigationContext';
import { useAuthStore } from '../../store';
import { formatPhoneForDisplay, getWhatsAppSupportConfig, openWhatsAppSupport } from '../../utils/whatsapp';

const TERMS_URL = 'https://www.baihub.co.in/terms-and-conditions';
const PRIVACY_URL = 'https://www.baihub.co.in/privacy-policy';
const ABOUT_URL = 'https://www.baihub.co.in/about';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { setShowMainApp } = useRootNavigation();
  const navigation = useNavigation();

  const handleLogout = async () => {
    await logout();
    setShowMainApp(false);
  };

  const handleHelpSupport = async () => {
    try {
      await openWhatsAppSupport();
    } catch (error) {
      const supportConfig = getWhatsAppSupportConfig();
      console.log('supportConfig', supportConfig);
      const displayNumber = formatPhoneForDisplay(supportConfig.mobileNumber);
      Alert.alert(
        'Unable to open WhatsApp',
        `Please make sure WhatsApp is installed on your device or check your internet connection. You can contact us at ${displayNumber}.`,
        [{ text: 'OK' }]
      );
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
            onPress={handleLogout}
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

