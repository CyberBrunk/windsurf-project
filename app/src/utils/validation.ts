/**
 * Form validation utilities
 */

/**
 * Validate email format
 * @param email Email to validate
 * @returns Whether the email is valid
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param password Password to validate
 * @returns Whether the password is valid
 */
export const validatePassword = (password: string): boolean => {
  // Password must be at least 8 characters long
  return password.length >= 8;
};

/**
 * Validate name
 * @param name Name to validate
 * @returns Whether the name is valid
 */
export const validateName = (name: string): boolean => {
  // Name must be at least 2 characters long
  return name.trim().length >= 2;
};

/**
 * Validate date of birth
 * @param dateOfBirth Date of birth to validate
 * @returns Whether the date of birth is valid
 */
export const validateDateOfBirth = (dateOfBirth: Date | null): boolean => {
  if (!dateOfBirth) return false;
  
  const now = new Date();
  const minDate = new Date();
  minDate.setFullYear(now.getFullYear() - 120); // Maximum age 120 years
  
  // Date of birth must be in the past and not too far in the past
  return dateOfBirth <= now && dateOfBirth >= minDate;
};

/**
 * Validate birth time
 * @param birthTime Birth time to validate
 * @returns Whether the birth time is valid
 */
export const validateBirthTime = (birthTime: Date | null): boolean => {
  // Birth time is optional, so null is valid
  if (!birthTime) return true;
  
  // Birth time must be a valid time
  return !isNaN(birthTime.getTime());
};

/**
 * Get validation error message for email
 * @param email Email to validate
 * @returns Error message or empty string if valid
 */
export const getEmailErrorMessage = (email: string): string => {
  if (!email) return 'Email is required';
  if (!validateEmail(email)) return 'Please enter a valid email address';
  return '';
};

/**
 * Get validation error message for password
 * @param password Password to validate
 * @returns Error message or empty string if valid
 */
export const getPasswordErrorMessage = (password: string): string => {
  if (!password) return 'Password is required';
  if (!validatePassword(password)) return 'Password must be at least 8 characters long';
  return '';
};

/**
 * Get validation error message for name
 * @param name Name to validate
 * @returns Error message or empty string if valid
 */
export const getNameErrorMessage = (name: string): string => {
  if (!name) return 'Name is required';
  if (!validateName(name)) return 'Name must be at least 2 characters long';
  return '';
};

/**
 * Get validation error message for date of birth
 * @param dateOfBirth Date of birth to validate
 * @returns Error message or empty string if valid
 */
export const getDateOfBirthErrorMessage = (dateOfBirth: Date | null): string => {
  if (!dateOfBirth) return 'Date of birth is required';
  if (!validateDateOfBirth(dateOfBirth)) return 'Please enter a valid date of birth';
  return '';
};

/**
 * Get validation error message for birth time
 * @param birthTime Birth time to validate
 * @returns Error message or empty string if valid
 */
export const getBirthTimeErrorMessage = (birthTime: Date | null): string => {
  if (birthTime && !validateBirthTime(birthTime)) return 'Please enter a valid birth time';
  return '';
};
