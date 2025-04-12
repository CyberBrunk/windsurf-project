import { User as FirebaseUser } from 'firebase/auth';

/**
 * Extended User type that includes additional properties beyond Firebase User
 */
export interface User extends FirebaseUser {
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  providerId: string;
  uid: string;
  
  // Custom properties
  sunCards?: {
    innerChild: {
      card: string; // e.g., "Queen of Hearts"
      suit: string; // e.g., "Hearts"
      value: string; // e.g., "Queen"
      description: string;
      traits: string[];
    };
    chosenPurpose: {
      card: string;
      suit: string;
      value: string;
      description: string;
      traits: string[];
    };
    highestSelf: {
      card: string;
      suit: string;
      value: string;
      description: string;
      traits: string[];
    };
  };
}

/**
 * Authentication context state
 */
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}

/**
 * Authentication credentials
 */
export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * Registration credentials
 */
export interface RegisterCredentials extends AuthCredentials {
  displayName?: string;
}

/**
 * User profile data
 */
export interface UserProfile {
  displayName?: string;
  email?: string;
  photoURL?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  birthTime?: string;
  sunCards?: {
    innerChild: {
      card: string; // e.g., "Queen of Hearts"
      suit: string; // e.g., "Hearts"
      value: string; // e.g., "Queen"
      description: string;
      traits: string[];
    };
    chosenPurpose: {
      card: string;
      suit: string;
      value: string;
      description: string;
      traits: string[];
    };
    highestSelf: {
      card: string;
      suit: string;
      value: string;
      description: string;
      traits: string[];
    };
  };
}
