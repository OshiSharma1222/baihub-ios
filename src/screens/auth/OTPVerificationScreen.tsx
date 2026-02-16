// OTP Verification screen

import { CommonActions } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Text as RNText,
    TextInput as RNTextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRootNavigation } from '../../navigation/RootNavigationContext';
import { baihubAnalytics } from '../../services/baihub-analytics.service';
import { useAuthStore } from '../../store';
import { logger } from '../../utils/logger';

export default function OTPVerificationScreen({ navigation, route }: any) {
  const { setShowMainApp } = useRootNavigation();
  const { verifyOtp, phoneNumber, isLoading, error, requestOtp } = useAuthStore();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(RNTextInput | null)[]>([]);

  const phone = phoneNumber || route?.params?.phoneNumber || '';

  useEffect(() => {
    // Start countdown timer
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Handle paste - distribute digits across all OTP fields
  const handlePaste = (pastedValue: string) => {
    // Extract all digits from the pasted value
    const digits = pastedValue.replace(/\D/g, '').slice(0, 4);
    
    if (digits.length > 0) {
      const newOtp = ['', '', '', ''];
      
      // Fill OTP fields with pasted digits
      for (let i = 0; i < digits.length && i < 4; i++) {
        newOtp[i] = digits[i];
      }
      
      setOtp(newOtp);
      
      // Clear the first input (where paste happened) after a brief moment
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].setNativeProps({ text: newOtp[0] || '' });
        }
      }, 0);
      
      // Focus on the next empty field or the last field if all are filled
      const nextEmptyIndex = newOtp.findIndex((digit) => digit === '');
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 3;
      
      setTimeout(() => {
        inputRefs.current[focusIndex]?.focus();
      }, 50);

      // Auto-submit when all fields are filled
      if (newOtp.every((digit) => digit !== '') && newOtp.length === 4) {
        setTimeout(() => {
          handleVerifyOtp(newOtp.join(''));
        }, 150);
      }
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d+$/.test(value)) return;

    // Check if this is a paste event (value length > 1)
    // This happens when user pastes into any OTP input
    if (value.length > 1) {
      handlePaste(value);
      return;
    }
    
    // Single character input (normal typing)
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every((digit) => digit !== '') && newOtp.length === 4) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (otpValue?: string) => {
    const otpCode = otpValue || otp.join('');
    
    if (otpCode.length !== 4) {
      return;
    }

    try {
      const result = await verifyOtp({
        phoneNumber: phone,
        otp: otpCode,
      });
      
      logger.info('OTP verified successfully', { isNewUser: result.isNewUser });
      
      // Log analytics event
      const { isNewUser } = useAuthStore.getState();
      await baihubAnalytics.logVerifyOtpClicked({
        phone_number: phone,
        user_type: isNewUser ? 'new' : 'old',
        screen: 'otp_screen',
      });
      
      // Navigate based on isNewUser flag (from requestOtp response)
      if (result.isNewUser) {
        navigation.navigate('UserDetails');
      } else {
        // Always show onboarding slides before home: go to Onboarding, then user taps "Continue to Home"
        const root = navigation.getParent();
        if (root) {
          root.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            })
          );
        } else {
          setShowMainApp(true);
        }
      }
    } catch (err: any) {
      logger.error('OTP verification failed:', err);
      // Error is already set in store
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || !phone) return;

    try {
      const response = await requestOtp({ phoneNumber: phone });
      // Log analytics event
      const { isNewUser } = useAuthStore.getState();
      await baihubAnalytics.logResendOtpClicked({
        phone_number: phone,
        user_type: isNewUser ? 'new' : 'old',
        screen: 'otp_screen',
      });
      setTimer(30);
      setCanResend(false);
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      logger.error('Resend OTP failed:', err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text variant="headlineMedium" style={styles.title}>
            Enter OTP
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            We've sent a 4-digit code to{'\n'}
            <Text style={styles.phoneText}>{phone}</Text>
          </Text>
        </View>

        {/* OTP Input Fields */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <RNTextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[styles.otpInput, error && styles.otpInputError]}
              value={digit}
              onChangeText={(value) => handleOtpChange(index, value)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={1} // Visual limit, but paste events will pass full value to onChangeText
              selectTextOnFocus
              autoFocus={index === 0}
            />
          ))}
        </View>

        {error && (
          <RNText style={styles.errorText}>{error}</RNText>
        )}

        {/* Verify Button */}
        <Button
          mode="contained"
          onPress={() => handleVerifyOtp()}
          loading={isLoading}
          disabled={isLoading || otp.join('').length !== 4}
          style={styles.verifyButton}
          contentStyle={styles.verifyButtonContent}
          labelStyle={styles.verifyButtonLabel}
        >
          Verify OTP
        </Button>

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          <RNText style={styles.resendText}>Didn't receive the code? </RNText>
          {canResend ? (
            <TouchableOpacity onPress={handleResendOtp} activeOpacity={0.7}>
              <RNText style={styles.resendLink}>Resend OTP</RNText>
            </TouchableOpacity>
          ) : (
            <RNText style={styles.timerText}>Resend in {timer}s</RNText>
          )}
        </View>


      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 32,
    padding: 8,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  phoneText: {
    fontWeight: '600',
    color: '#000000',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  otpInput: {
    width: 64,
    height: 64,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    backgroundColor: '#ffffff',
  },
  otpInputError: {
    borderColor: '#b00020',
  },
  errorText: {
    color: '#b00020',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  verifyButton: {
    borderRadius: 8,
    backgroundColor: '#f9cb00',
    marginBottom: 24,
  },
  verifyButtonContent: {
    paddingVertical: 12,
  },
  verifyButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontSize: 14,
    color: '#666666',
  },
  resendLink: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  timerText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  helpContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  helpText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  helpCode: {
    fontWeight: 'bold',
    color: '#000000',
    fontSize: 14,
  },
});

