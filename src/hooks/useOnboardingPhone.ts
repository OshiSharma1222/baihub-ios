import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import {
    PHONE_COUNTRY_PREFIX,
    PHONE_MAX_DIGITS,
    PHONE_MIN_DIGITS,
} from '../constants/onboarding';
import type { LoginV2StackParamList } from '../navigation/types';
import { baihubAnalytics } from '../services/baihub-analytics.service';
import { useAuthStore } from '../store';
import { logger } from '../utils/logger';

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

function formatDisplay(phone: string): string {
  const d = digitsOnly(phone);
  if (d.length <= 5) return d;
  if (d.length <= 8) return `${d.slice(0, 4)} ${d.slice(4)}`;
  return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
}

interface UseOnboardingPhoneParams {
  navigation: NativeStackNavigationProp<LoginV2StackParamList, 'Onboarding'>;
}

interface UseOnboardingPhoneReturn {
  phone: string;
  setPhone: (value: string) => void;
  error: string | null;
  isValid: boolean;
  isLoading: boolean;
  displayValue: string;
  handleGetStarted: () => Promise<void>;
  clearError: () => void;
}

export function useOnboardingPhone({
  navigation,
}: UseOnboardingPhoneParams): UseOnboardingPhoneReturn {
  const { requestOtp } = useAuthStore();
  const [phone, setPhoneState] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const digits = digitsOnly(phone);
  const isValid =
    digits.length >= PHONE_MIN_DIGITS && digits.length <= PHONE_MAX_DIGITS;
  const displayValue = formatDisplay(phone);

  const setPhone = useCallback((value: string) => {
    setPhoneState(value);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const handleGetStarted = useCallback(async () => {
    setError(null);

    if (digits.length < PHONE_MIN_DIGITS) {
      setError('Please enter a valid phone number');
      return;
    }

    if (digits.length > PHONE_MAX_DIGITS) {
      setError('Phone number is too long');
      return;
    }

    const fullNumber = `${PHONE_COUNTRY_PREFIX}${digits}`;
    setIsLoading(true);

    try {
      await baihubAnalytics.logGetStartedClicked();
      const response = await requestOtp({ phoneNumber: fullNumber });
      logger.info('OTP requested from onboarding', { isNewUser: response.isNewUser });

      await baihubAnalytics.logOtpRequested({
        phone_number: fullNumber,
        user_type: response.isNewUser ? 'new' : 'old',
        screen: 'onboarding',
      });

      navigation.navigate('Auth', {
        screen: 'OTPVerification',
        params: { phoneNumber: digits },
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to send OTP. Please try again.';
      logger.error('Onboarding request OTP failed:', err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [digits, navigation, requestOtp]);

  return {
    phone,
    setPhone,
    error,
    isValid,
    isLoading,
    displayValue,
    handleGetStarted,
    clearError,
  };
}
