/**
 * Application configuration constants
 */

// Import environment variables directly from Expo's constants
import Constants from 'expo-constants';

export const APP_CONFIG = {
  name: 'Cardy',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
};

// Hardcoded Firebase configuration for development
// In a production app, you would use environment variables
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCT3rkCzkGDvYE5ipdlFM115HhhFrJVE6E",
  authDomain: "cardy-19378.firebaseapp.com",
  projectId: "cardy-19378",
  storageBucket: "cardy-19378.appspot.com", // Note: Fixed from .firebasestorage.app to .appspot.com
  messagingSenderId: "808292748917",
  appId: "1:808292748917:web:65af40b9cf4ee5fcacb23c",
  measurementId: "G-X0FSY9TCQP"
};
