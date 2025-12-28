// WhatsApp utility functions

import { Platform, Linking } from 'react-native';
import { remoteConfigService } from '../services/remoteConfig.service';
import { logger } from './logger';

/**
 * Format phone number for WhatsApp URL
 * Ensures the number starts with country code (91 for India)
 */
const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove any + signs and spaces
  let cleaned = phoneNumber.replace(/[\s+-]/g, '');
  
  // If it already starts with country code, return as is
  if (cleaned.startsWith('91') && cleaned.length >= 12) {
    return cleaned;
  }
  
  // If it starts with +91, remove the +
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.substring(1);
  }
  
  // If it's a 10-digit number, add 91 country code
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  
  // Return as is if it's already formatted correctly
  return cleaned;
};

/**
 * Format phone number for display (with +91 prefix)
 */
export const formatPhoneForDisplay = (phoneNumber: string): string => {
  const formatted = formatPhoneNumber(phoneNumber);
  if (formatted.startsWith('91')) {
    return `+91 ${formatted.substring(2)}`;
  }
  return formatted;
};

/**
 * Build WhatsApp deep link URL
 */
export const buildWhatsAppDeepLink = (phoneNumber: string, message: string): string => {
  const formattedNumber = formatPhoneNumber(phoneNumber);
  return `whatsapp://send?phone=${formattedNumber}&text=${encodeURIComponent(message)}`;
};

/**
 * Build WhatsApp web URL
 */
export const buildWhatsAppWebUrl = (phoneNumber: string, message: string): string => {
  const formattedNumber = formatPhoneNumber(phoneNumber);
  return `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
};

/**
 * Build WhatsApp API URL (for web-based WhatsApp)
 */
export const buildWhatsAppApiUrl = (phoneNumber: string, message: string): string => {
  const formattedNumber = formatPhoneNumber(phoneNumber);
  return `https://api.whatsapp.com/send/?phone=${formattedNumber}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
};

/**
 * Get WhatsApp support configuration from Remote Config
 */
export const getWhatsAppSupportConfig = () => {
  return remoteConfigService.getWhatsAppSupportConfig();
};

/**
 * Open WhatsApp with support message
 * Tries deep link first, then falls back to web version
 */
export const openWhatsAppSupport = async (): Promise<void> => {
  try {
    const supportConfig = getWhatsAppSupportConfig();
    const deepLink = buildWhatsAppDeepLink(supportConfig.mobileNumber, supportConfig.message);
    const webUrl = buildWhatsAppWebUrl(supportConfig.mobileNumber, supportConfig.message);
    
    if (Platform.OS === 'ios') {
      try {
        const canOpen = await Linking.canOpenURL(deepLink);
        if (canOpen) {
          await Linking.openURL(deepLink);
          return;
        }
      } catch (iosError) {
        logger.warn('WhatsApp deep link failed on iOS, trying web version', iosError);
      }
      // Fallback to web
      await Linking.openURL(webUrl);
    } else {
      // Android
      const canOpen = await Linking.canOpenURL(deepLink);
      if (canOpen) {
        await Linking.openURL(deepLink);
      } else {
        // Fallback to web
        await Linking.openURL(webUrl);
      }
    }
  } catch (error) {
    logger.error('Failed to open WhatsApp support', error);
    // Final fallback: try web version
    try {
      const supportConfig = getWhatsAppSupportConfig();
      const webUrl = buildWhatsAppWebUrl(supportConfig.mobileNumber, supportConfig.message);
      await Linking.openURL(webUrl);
    } catch (webError) {
      logger.error('Failed to open WhatsApp web version', webError);
      throw webError;
    }
  }
};

