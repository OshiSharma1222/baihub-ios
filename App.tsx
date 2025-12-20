// Main App component with providers

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { lightTheme } from './src/theme';
import RootNavigator from './src/navigation/RootNavigator';
import { remoteConfigService } from './src/services/remoteConfig.service';
import { analyticsService } from './src/services/analytics.service';
import { logger } from './src/utils/logger';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/components/common/ToastConfig';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Light': require('./assets/fonts/Inter-Light.ttf'),
    'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
  });

  useEffect(() => {
    // Log font loading status
    if (fontsLoaded) {
      logger.info('App: Fonts loaded successfully', {
        fonts: ['Inter-Regular', 'Inter-Light', 'Inter-Medium', 'Inter-Bold'],
      });
      console.log('✅ Fonts loaded: Inter-Regular, Inter-Light, Inter-Medium, Inter-Bold');
    } else {
      console.log('⏳ Loading fonts...');
    }
  }, [fontsLoaded]);

  useEffect(() => {
    // Initialize services on app startup
    const initializeServices = async () => {
      try {
        // Initialize Analytics first
        await analyticsService.initialize();
        
        // Initialize and fetch Remote Config
        await remoteConfigService.initialize();
        await remoteConfigService.fetchAndActivate();
        logger.info('App: Services initialized successfully');
      } catch (error) {
        logger.error('App: Failed to initialize services', error);
      }
    };

    if (fontsLoaded) {
      initializeServices();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Wait for fonts to load before rendering
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={lightTheme}>
          <RootNavigator />
          <StatusBar style="auto" />
          <Toast
            topOffset={60}
            config={toastConfig}
          />
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
