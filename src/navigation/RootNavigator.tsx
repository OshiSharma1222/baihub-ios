// Root navigation setup.
// When showMainApp is false: only LoginV2 (onboarding slides → Get Started → Auth). When true: Main app.
// Main/Home only after setShowMainApp(true) (Continue to Home from onboarding or after login).

import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import AfterPaymentScreen from '../screens/main/AfterPaymentScreen';
import AreaSelectionScreen from '../screens/main/AreaSelectionScreen';
import CheckoutScreen from '../screens/main/CheckoutScreen';
import PlansSelectionScreen from '../screens/main/PlansSelectionScreen';
import ServicesListingScreen from '../screens/main/ServicesListingScreen';
import TimeSlotSelectionScreen from '../screens/main/TimeSlotSelectionScreen';
import { analyticsService } from '../services/analytics.service';
import { useAuthStore } from '../store';
import LoginV2Navigator from './LoginV2Navigator';
import MainNavigator from './MainNavigator';
import { RootNavigationProvider, useRootNavigation } from './RootNavigationContext';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigatorInner() {
  const { showMainApp } = useRootNavigation();
  const { initialize } = useAuthStore();
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList> | null>(null);
  const routeNameRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    initialize();
    const timer = setTimeout(() => {
      analyticsService.logAppOpen().catch(() => {});
    }, 1000);
    return () => clearTimeout(timer);
  }, [initialize]);

  const onReady = () => {
    routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
  };

  const onStateChange = async () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;
    if (previousRouteName !== currentRouteName && currentRouteName) {
      try {
        await analyticsService.logScreenView(currentRouteName);
      } catch {
        // ignore
      }
    }
    routeNameRef.current = currentRouteName;
  };

  if (showMainApp) {
    return (
      <NavigationContainer
        ref={navigationRef as React.RefObject<NavigationContainerRef<RootStackParamList>>}
        onReady={onReady}
        onStateChange={onStateChange}
      >
        <Stack.Navigator
          initialRouteName="Main"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen
            name="AreaSelection"
            component={AreaSelectionScreen}
            options={{ presentation: 'card' }}
          />
          <Stack.Screen
            name="ServicesListing"
            component={ServicesListingScreen}
            options={{ presentation: 'card' }}
          />
          <Stack.Screen
            name="TimeSlotSelection"
            component={TimeSlotSelectionScreen}
            options={{ presentation: 'card' }}
          />
          <Stack.Screen
            name="PlansSelection"
            component={PlansSelectionScreen}
            options={{ presentation: 'card' }}
          />
          <Stack.Screen
            name="Checkout"
            component={CheckoutScreen}
            options={{ presentation: 'card' }}
          />
          <Stack.Screen
            name="AfterPayment"
            component={AfterPaymentScreen}
            options={{ presentation: 'card', headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef as React.RefObject<NavigationContainerRef<RootStackParamList>>}
      onReady={onReady}
      onStateChange={onStateChange}
    >
      <Stack.Navigator
        initialRouteName="LoginV2"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="LoginV2" component={LoginV2Navigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function RootNavigator() {
  return (
    <RootNavigationProvider>
      <RootNavigatorInner />
    </RootNavigationProvider>
  );
}
