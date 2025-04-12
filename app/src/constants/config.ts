/**
 * Application configuration constants
 */

// Import environment variables from Expo's constants
import Constants from 'expo-constants';

// Access environment variables
const expoConstants = Constants.expoConfig?.extra || {};

export const APP_CONFIG = {
  name: 'Cardy',
  version: '1.0.0',
  environment: process.env.EXPO_PUBLIC_APP_ENV || 'development',
};

// Firebase configuration using environment variables
export const FIREBASE_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || ''
};
