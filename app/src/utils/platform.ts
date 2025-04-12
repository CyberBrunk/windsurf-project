import { Platform, Dimensions } from 'react-native';

/**
 * Platform utilities for handling platform-specific code
 */

// Platform constants
export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';
export const IS_WEB = Platform.OS === 'web';

// Screen dimensions
const { width, height } = Dimensions.get('window');
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
export const IS_SMALL_DEVICE = width < 375;

/**
 * Select a value based on the platform
 * @param ios Value for iOS
 * @param android Value for Android
 * @param web Value for Web
 * @returns The value for the current platform
 */
export const selectByPlatform = <T>(ios: T, android: T, web: T): T => {
  if (IS_IOS) return ios;
  if (IS_ANDROID) return android;
  return web;
};

/**
 * Get platform-specific styles
 * @param styles Object containing platform-specific styles
 * @returns The styles for the current platform
 */
export const platformStyles = <T>(styles: {
  ios?: T;
  android?: T;
  web?: T;
  default: T;
}): T => {
  if (IS_IOS && styles.ios) return styles.ios;
  if (IS_ANDROID && styles.android) return styles.android;
  if (IS_WEB && styles.web) return styles.web;
  return styles.default;
};
