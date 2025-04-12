import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import onboarding screens
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import UserDataCollectionScreen from '../screens/onboarding/UserDataCollectionScreen';
import SunCardGenerationScreen from '../screens/onboarding/SunCardGenerationScreen';

// Define the onboarding stack parameter list
export type OnboardingStackParamList = {
  Onboarding: undefined;
  UserDataCollection: undefined;
  SunCardGeneration: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

/**
 * Onboarding navigator component
 * Manages navigation between onboarding screens
 */
const OnboardingNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f8f9fa' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="UserDataCollection" component={UserDataCollectionScreen} />
      <Stack.Screen name="SunCardGeneration" component={SunCardGenerationScreen} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
