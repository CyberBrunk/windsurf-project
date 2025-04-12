import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '../types';
import { auth } from '../services/firebase';
import { subscribeToAuthChanges, getCurrentUser } from '../services/auth';
import { storeData, getData, removeData, STORAGE_KEYS } from '../utils/storage';

// Define the shape of our auth context
interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  clearError: () => void;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
  signOut: async () => {},
  clearError: () => {},
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component to wrap the app and provide auth context
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Clear any auth errors
  const clearError = () => setError(null);

  // Sign out the user
  const signOut = async () => {
    try {
      await auth.signOut();
      await removeData(STORAGE_KEYS.USER_DATA);
      setUser(null);
    } catch (error) {
      setError('Failed to sign out');
      console.error('Error signing out:', error);
    }
  };

  // Effect to subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      setIsLoading(true);
      setFirebaseUser(firebaseUser);
      
      try {
        if (firebaseUser) {
          // User is signed in
          const userData = await getCurrentUser();
          
          if (userData) {
            setUser(userData);
            await storeData(STORAGE_KEYS.USER_DATA, userData);
          }
        } else {
          // User is signed out
          setUser(null);
          await removeData(STORAGE_KEYS.USER_DATA);
        }
      } catch (error) {
        console.error('Error getting user data:', error);
        setError('Failed to get user data');
      } finally {
        setIsLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Try to restore user from storage on initial load
  useEffect(() => {
    const restoreUser = async () => {
      try {
        const userData = await getData<User>(STORAGE_KEYS.USER_DATA);
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error restoring user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreUser();
  }, []);

  // Value to be provided by the context
  const value: AuthContextType = {
    user,
    firebaseUser,
    isLoading,
    error,
    isAuthenticated: !!user,
    signOut,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
