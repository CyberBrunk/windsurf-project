/**
 * Environment utilities for handling environment-specific configuration
 */

// Environment types
export type Environment = 'development' | 'staging' | 'production';

// Get current environment
export const getEnvironment = (): Environment => {
  const env = process.env.EXPO_PUBLIC_APP_ENV;
  
  if (env === 'production') return 'production';
  if (env === 'staging') return 'staging';
  return 'development';
};

// Environment constants
export const IS_DEV = getEnvironment() === 'development';
export const IS_STAGING = getEnvironment() === 'staging';
export const IS_PROD = getEnvironment() === 'production';

/**
 * Select a value based on the environment
 * @param development Value for development environment
 * @param staging Value for staging environment
 * @param production Value for production environment
 * @returns The value for the current environment
 */
export const selectByEnvironment = <T>(
  development: T,
  staging: T,
  production: T
): T => {
  if (IS_PROD) return production;
  if (IS_STAGING) return staging;
  return development;
};

/**
 * Log a message only in development environment
 * @param message Message to log
 * @param args Additional arguments to log
 */
export const devLog = (message: string, ...args: any[]): void => {
  if (IS_DEV) {
    console.log(`[DEV] ${message}`, ...args);
  }
};

/**
 * Get environment-specific configuration
 * @param config Object containing environment-specific configuration
 * @returns The configuration for the current environment
 */
export const environmentConfig = <T>(config: {
  development?: T;
  staging?: T;
  production?: T;
  default: T;
}): T => {
  if (IS_PROD && config.production) return config.production;
  if (IS_STAGING && config.staging) return config.staging;
  if (IS_DEV && config.development) return config.development;
  return config.default;
};
