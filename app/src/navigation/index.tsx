import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

// Import navigators
import AuthNavigator from './AuthNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import TabNavigator from './TabNavigator';

// Import auth context
import { useAuth } from '../contexts/AuthContext';

// Import storage utilities
import { getData, STORAGE_KEYS } from '../utils/storage';

// Define the root stack parameter list
export type RootStackParamList = {
  Tabs: undefined;
  Onboarding: undefined;
  UserDataCollection: undefined;
  SunCardGeneration: undefined;
  // We'll add more screens here as we implement them
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Main navigation component for the app
 */
export const Navigation = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [initializing, setInitializing] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  // Check if onboarding is completed
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user) {
        // If we have user data, check if onboarding is completed
        const completed = await getData<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETED);
        setOnboardingCompleted(completed || false);
      }
    };

    if (isAuthenticated) {
      checkOnboardingStatus();
    }
  }, [isAuthenticated, user]);

  // Handle initial loading state
  useEffect(() => {
    if (!isLoading && (onboardingCompleted !== null || !isAuthenticated)) {
      // Delay a bit to prevent flashing screens
      const timer = setTimeout(() => {
        setInitializing(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, onboardingCompleted, isAuthenticated]);

  // Show loading screen while initializing
  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a69bd" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        // User is authenticated
        onboardingCompleted ? (
          // Main app screens when authenticated and onboarding completed
          <Stack.Navigator
            initialRouteName="Tabs"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Tabs" component={TabNavigator} />
            {/* We'll add more screens here as we implement them */}
          </Stack.Navigator>
        ) : (
          // Onboarding screens when authenticated but onboarding not completed
          <OnboardingNavigator />
        )
      ) : (
        // Auth screens when not authenticated
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});

export default Navigation;
