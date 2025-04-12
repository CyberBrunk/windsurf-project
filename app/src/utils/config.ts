import { FIREBASE_CONFIG, APP_CONFIG } from '../constants/config';
import { environmentConfig, getEnvironment } from './environment';

/**
 * Configuration utilities for handling app configuration
 */

/**
 * Get the Firebase configuration for the current environment
 */
export const getFirebaseConfig = () => {
  return FIREBASE_CONFIG;
};

/**
 * Get the app configuration for the current environment
 */
export const getAppConfig = () => {
  return {
    ...APP_CONFIG,
    apiUrl: environmentConfig({
      development: 'http://localhost:5001',
      staging: 'https://api-staging.cardy-app.com',
      production: 'https://api.cardy-app.com',
      default: 'http://localhost:5001',
    }),
    environment: getEnvironment(),
  };
};

/**
 * Get the app version
 */
export const getAppVersion = () => {
  return APP_CONFIG.version;
};

/**
 * Get the app name
 */
export const getAppName = () => {
  return APP_CONFIG.name;
};
