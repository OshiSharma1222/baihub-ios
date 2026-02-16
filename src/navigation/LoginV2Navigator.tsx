// V2 login: onboarding slides (existing screen) first, then Auth. No extra page.

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import OnboardingSplashScreen from '../screens/auth/OnboardingSplashScreen';
import AuthNavigator from './AuthNavigator';
import { LoginV2StackParamList } from './types';

const Stack = createNativeStackNavigator<LoginV2StackParamList>();

export default function LoginV2Navigator() {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Onboarding"
        component={OnboardingSplashScreen}
        initialParams={{ useSlidesOnlyFlow: true }}
      />
      <Stack.Screen name="Auth" component={AuthNavigator} />
    </Stack.Navigator>
  );
}
