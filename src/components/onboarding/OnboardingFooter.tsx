import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

let LOGO_SOURCE: number | null = null;
try {
  LOGO_SOURCE = require('../../../assets/onboarding/logo.png');
} catch {
  LOGO_SOURCE = null;
}

interface OnboardingFooterProps {
  phoneDisplayValue: string;
  onPhoneChange: (value: string) => void;
  isValid: boolean;
  error: string | null;
  isLoading: boolean;
  onGetStarted: () => void;
  showContinueToHome?: boolean;
  onContinueToHome?: () => void;
  termsUrl?: string;
  privacyUrl?: string;
}

export function OnboardingFooter({
  phoneDisplayValue,
  onPhoneChange,
  isValid,
  error,
  isLoading,
  onGetStarted,
  showContinueToHome,
  onContinueToHome,
  termsUrl,
  privacyUrl,
}: OnboardingFooterProps) {
  const handlePhoneChange = (text: string) => {
    const digits = text.replace(/\D/g, '');
    onPhoneChange(digits);
  };

  const openTerms = () => {
    if (termsUrl) Linking.openURL(termsUrl);
  };

  const openPrivacy = () => {
    if (privacyUrl) Linking.openURL(privacyUrl);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.wrapper}
    >
      <View style={styles.container}>
        <View style={styles.logoRow}>
          {LOGO_SOURCE ? (
            <Image source={LOGO_SOURCE} style={styles.logo} resizeMode="contain" />
          ) : (
            <Text style={styles.logoPlaceholder}>baihub</Text>
          )}
        </View>
        <View style={styles.separator} />
        <Text style={styles.ctaText}>Login or signup to continue</Text>

        <View style={styles.inputRow}>
          <Text style={styles.prefix}>+91-</Text>
          <TextInput
            value={phoneDisplayValue}
            onChangeText={handlePhoneChange}
            placeholder="Enter your phone no"
            placeholderTextColor="#9E9E9E"
            keyboardType="phone-pad"
            maxLength={15}
            style={styles.input}
          />
          {isValid ? (
            <Icon
              name="check-circle"
              size={22}
              color="#22C55E"
              style={styles.checkIcon}
            />
          ) : null}
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={onGetStarted}
          activeOpacity={0.85}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Icon name="sparkles" size={20} color="#1A1A1A" />
        </TouchableOpacity>

        {showContinueToHome && onContinueToHome ? (
          <TouchableOpacity
            onPress={onContinueToHome}
            style={styles.continueToHomeWrap}
            activeOpacity={0.7}
          >
            <Text style={styles.continueToHomeText}>Continue to Home</Text>
          </TouchableOpacity>
        ) : null}

        <Text style={styles.legal}>
          By proceeding ahead you agree to our{' '}
          <Text style={styles.link} onPress={openTerms}>
            Terms of use
          </Text>
          {' & '}
          <Text style={styles.link} onPress={openPrivacy}>
            Privacy Policy
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  logoRow: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 160,
    height: 56,
  },
  logoPlaceholder: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1A1A1A',
  },
  separator: {
    height: 1,
    backgroundColor: '#424242',
    width: 48,
    alignSelf: 'center',
    marginBottom: 16,
  },
  ctaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#424242',
    textAlign: 'center',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  prefix: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1A1A1A',
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1A1A1A',
    paddingVertical: 14,
    paddingRight: 8,
  },
  checkIcon: {
    marginLeft: 8,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#B00020',
    marginBottom: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFCC00',
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  continueToHomeWrap: {
    marginBottom: 12,
    alignItems: 'center',
  },
  continueToHomeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#424242',
    textDecorationLine: 'underline',
  },
  buttonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  legal: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: '#1A1A1A',
    textDecorationLine: 'underline',
  },
});
