import { useColorScheme } from 'react-native';
import { getData, storeData, STORAGE_KEYS } from './storage';

/**
 * Theme utilities for handling app themes
 */

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';

// Theme colors
export const COLORS = {
  light: {
    primary: '#4a69bd',
    secondary: '#1e3799',
    background: '#f8f9fa',
    card: '#ffffff',
    text: '#212529',
    textLight: '#6c757d',
    border: '#dee2e6',
    notification: '#fa5252',
    success: '#40c057',
    warning: '#fd7e14',
    error: '#fa5252',
    disabled: '#adb5bd',
  },
  dark: {
    primary: '#748ffc',
    secondary: '#91a7ff',
    background: '#212529',
    card: '#343a40',
    text: '#f8f9fa',
    textLight: '#adb5bd',
    border: '#495057',
    notification: '#ff6b6b',
    success: '#51cf66',
    warning: '#fcc419',
    error: '#ff6b6b',
    disabled: '#868e96',
  },
};

// Font sizes
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

/**
 * Get the current theme mode from storage
 */
export const getThemeMode = async (): Promise<ThemeMode> => {
  const storedTheme = await getData<ThemeMode>(STORAGE_KEYS.THEME_PREFERENCE);
  return storedTheme || 'system';
};

/**
 * Set the theme mode in storage
 */
export const setThemeMode = async (mode: ThemeMode): Promise<void> => {
  await storeData(STORAGE_KEYS.THEME_PREFERENCE, mode);
};

/**
 * Hook to get the current theme colors
 */
export const useThemeColors = () => {
  const colorScheme = useColorScheme();
  const systemTheme = colorScheme === 'dark' ? 'dark' : 'light';
  
  // In a real app, we would use a state to store the user's theme preference
  // For now, we'll just use the system theme
  const themeMode: ThemeMode = 'system';
  
  const actualTheme = themeMode === 'system' ? systemTheme : themeMode;
  
  return COLORS[actualTheme];
};
