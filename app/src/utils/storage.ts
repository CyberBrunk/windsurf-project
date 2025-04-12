import AsyncStorage from '@react-native-async-storage/async-storage';
import { devLog } from './environment';

/**
 * Storage utilities for handling device storage
 */

/**
 * Save data to device storage
 * @param key Storage key
 * @param value Data to store
 */
export const storeData = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    devLog('Error storing data:', error);
    throw error;
  }
};

/**
 * Get data from device storage
 * @param key Storage key
 * @returns Stored data or null if not found
 */
export const getData = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    devLog('Error getting data:', error);
    throw error;
  }
};

/**
 * Remove data from device storage
 * @param key Storage key
 */
export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    devLog('Error removing data:', error);
    throw error;
  }
};

/**
 * Clear all data from device storage
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    devLog('Error clearing data:', error);
    throw error;
  }
};

/**
 * Get all storage keys
 * @returns Array of storage keys
 */
export const getAllKeys = async (): Promise<string[]> => {
  try {
    // Convert readonly string[] to mutable string[] with Array.from
    return Array.from(await AsyncStorage.getAllKeys());
  } catch (error) {
    devLog('Error getting all keys:', error);
    throw error;
  }
};

// Storage keys
export const STORAGE_KEYS = {
  USER_DATA: 'user_data',
  AUTH_TOKEN: 'auth_token',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  THEME_PREFERENCE: 'theme_preference',
  LAST_SYNC_TIME: 'last_sync_time',
} as const;
