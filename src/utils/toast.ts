// Toast utility for consistent toast messages across the app

import Toast from 'react-native-toast-message';

export const toast = {
  success: (message: string, title?: string) => {
    Toast.show({
      type: 'success',
      text1: title || 'Success',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  },

  error: (message: string, title?: string) => {
    Toast.show({
      type: 'error',
      text1: title || 'Error',
      text2: message,
      position: 'top',
      visibilityTime: 4000,
    });
  },

  info: (message: string, title?: string) => {
    Toast.show({
      type: 'info',
      text1: title || 'Info',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  },

  warning: (message: string, title?: string) => {
    Toast.show({
      type: 'error', // Using error type for warning (yellow/orange color)
      text1: title || 'Warning',
      text2: message,
      position: 'top',
      visibilityTime: 3500,
    });
  },
};

