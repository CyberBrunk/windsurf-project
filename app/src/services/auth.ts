import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithCredential,
  User as FirebaseUser,
  UserCredential,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '../types';

/**
 * Register a new user with email and password
 */
export const registerWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Try to create user document in Firestore, but don't fail if it doesn't work
    try {
      await createUserProfile(user);
    } catch (firestoreError) {
      console.warn('Could not create user profile in Firestore:', firestoreError);
      // Continue with authentication even if Firestore fails
    }
    
    return {
      id: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPremium: false,
    };
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Reset password for a given email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (idToken: string): Promise<UserCredential> => {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    return await signInWithCredential(auth, credential);
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

/**
 * Generate sun cards based on birth date
 * Returns three playing cards: inner child, chosen purpose, and highest self
 */
export const generateSunCards = (dateOfBirth?: string, birthTime?: string) => {
  // If no birth date is provided, return null
  if (!dateOfBirth) return null;
  
  // This is a simplified algorithm for demonstration purposes
  // In a real app, this would use a more sophisticated algorithm based on astrology
  const birthDate = new Date(dateOfBirth);
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1; // JavaScript months are 0-indexed
  const year = birthDate.getFullYear();
  
  // Card suits
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  
  // Card values
  const values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
  
  // Determine inner child card based on birth day
  const innerChildSuitIndex = day % 4;
  const innerChildValueIndex = day % 13;
  const innerChildSuit = suits[innerChildSuitIndex];
  const innerChildValue = values[innerChildValueIndex];
  const innerChildCard = `${innerChildValue} of ${innerChildSuit}`;
  
  // Determine chosen purpose card based on birth month
  const chosenPurposeSuitIndex = month % 4;
  const chosenPurposeValueIndex = month % 13;
  const chosenPurposeSuit = suits[chosenPurposeSuitIndex];
  const chosenPurposeValue = values[chosenPurposeValueIndex];
  const chosenPurposeCard = `${chosenPurposeValue} of ${chosenPurposeSuit}`;
  
  // Determine highest self card based on birth year
  const highestSelfSuitIndex = year % 4;
  const highestSelfValueIndex = year % 13;
  const highestSelfSuit = suits[highestSelfSuitIndex];
  const highestSelfValue = values[highestSelfValueIndex];
  const highestSelfCard = `${highestSelfValue} of ${highestSelfSuit}`;
  
  // Generate descriptions and traits based on the cards
  const sunCards = {
    innerChild: {
      card: innerChildCard,
      suit: innerChildSuit,
      value: innerChildValue,
      description: getCardDescription(innerChildSuit, innerChildValue, 'innerChild'),
      traits: getCardTraits(innerChildSuit, innerChildValue),
    },
    chosenPurpose: {
      card: chosenPurposeCard,
      suit: chosenPurposeSuit,
      value: chosenPurposeValue,
      description: getCardDescription(chosenPurposeSuit, chosenPurposeValue, 'chosenPurpose'),
      traits: getCardTraits(chosenPurposeSuit, chosenPurposeValue),
    },
    highestSelf: {
      card: highestSelfCard,
      suit: highestSelfSuit,
      value: highestSelfValue,
      description: getCardDescription(highestSelfSuit, highestSelfValue, 'highestSelf'),
      traits: getCardTraits(highestSelfSuit, highestSelfValue),
    },
  };
  
  return sunCards;
};

/**
 * Get card description based on suit and value
 */
const getCardDescription = (suit: string, value: string, cardType: 'innerChild' | 'chosenPurpose' | 'highestSelf'): string => {
  // This is a simplified implementation
  // In a real app, this would have unique descriptions for each card and type
  
  const suitDescriptions = {
    Hearts: {
      innerChild: 'Your inner child is emotional, loving, and deeply connected to others.',
      chosenPurpose: 'Your chosen purpose involves nurturing relationships and creating emotional connections.',
      highestSelf: 'Your highest self embodies compassion, empathy, and unconditional love.',
    },
    Diamonds: {
      innerChild: 'Your inner child is creative, resourceful, and values material security.',
      chosenPurpose: 'Your chosen purpose involves creating abundance and manifesting ideas into reality.',
      highestSelf: 'Your highest self embodies prosperity, clarity, and practical wisdom.',
    },
    Clubs: {
      innerChild: 'Your inner child is curious, intellectual, and seeks knowledge.',
      chosenPurpose: 'Your chosen purpose involves growth, learning, and expanding consciousness.',
      highestSelf: 'Your highest self embodies wisdom, spiritual growth, and inner knowledge.',
    },
    Spades: {
      innerChild: 'Your inner child is introspective, transformative, and seeks truth.',
      chosenPurpose: 'Your chosen purpose involves transformation, healing, and overcoming challenges.',
      highestSelf: 'Your highest self embodies mastery, transcendence, and profound insight.',
    },
  };
  
  const valueModifier = {
    Ace: 'powerful and pure ',
    '2': 'balanced and cooperative ',
    '3': 'creative and expressive ',
    '4': 'stable and structured ',
    '5': 'adaptable and freedom-loving ',
    '6': 'harmonious and responsible ',
    '7': 'analytical and spiritual ',
    '8': 'ambitious and authoritative ',
    '9': 'compassionate and humanitarian ',
    '10': 'complete and fulfilling ',
    Jack: 'energetic and innovative ',
    Queen: 'nurturing and intuitive ',
    King: 'masterful and authoritative ',
  };
  
  // Use type assertion to tell TypeScript these properties exist
  const baseDescription = suitDescriptions[suit as keyof typeof suitDescriptions][cardType];
  const modifier = valueModifier[value as keyof typeof valueModifier];
  
  return `With a ${value} of ${suit}, you have a ${modifier}nature. ${baseDescription}`;
};

/**
 * Get card traits based on suit and value
 */
const getCardTraits = (suit: string, value: string): string[] => {
  // This is a simplified implementation
  // In a real app, this would have unique traits for each card
  
  const suitTraits = {
    Hearts: ['Emotional', 'Loving', 'Compassionate', 'Intuitive', 'Sensitive'],
    Diamonds: ['Creative', 'Abundant', 'Practical', 'Valuable', 'Resourceful'],
    Clubs: ['Intellectual', 'Curious', 'Communicative', 'Logical', 'Knowledgeable'],
    Spades: ['Transformative', 'Introspective', 'Truthful', 'Powerful', 'Insightful'],
  };
  
  const valueTraits = {
    Ace: ['Powerful', 'Pure', 'Potential', 'Focused', 'Singular'],
    '2': ['Balanced', 'Cooperative', 'Diplomatic', 'Patient', 'Adaptable'],
    '3': ['Creative', 'Expressive', 'Joyful', 'Social', 'Optimistic'],
    '4': ['Stable', 'Structured', 'Reliable', 'Disciplined', 'Practical'],
    '5': ['Adventurous', 'Freedom-loving', 'Versatile', 'Curious', 'Resourceful'],
    '6': ['Harmonious', 'Responsible', 'Nurturing', 'Supportive', 'Balanced'],
    '7': ['Analytical', 'Spiritual', 'Introspective', 'Perfectionistic', 'Wise'],
    '8': ['Ambitious', 'Authoritative', 'Abundant', 'Successful', 'Influential'],
    '9': ['Compassionate', 'Humanitarian', 'Wise', 'Generous', 'Idealistic'],
    '10': ['Complete', 'Fulfilling', 'Accomplished', 'Masterful', 'Comprehensive'],
    Jack: ['Energetic', 'Innovative', 'Youthful', 'Adventurous', 'Clever'],
    Queen: ['Nurturing', 'Intuitive', 'Expressive', 'Influential', 'Supportive'],
    King: ['Masterful', 'Authoritative', 'Confident', 'Accomplished', 'Wise'],
  };
  
  // Use type assertion to tell TypeScript these properties exist
  const baseSuitTraits = suitTraits[suit as keyof typeof suitTraits];
  // Use type assertion to tell TypeScript these properties exist
  const baseValueTraits = valueTraits[value as keyof typeof valueTraits];
  
  // Combine traits from both suit and value, but limit to 5 total
  const combinedTraits = [...new Set([...baseSuitTraits, ...baseValueTraits])].slice(0, 5);
  
  return combinedTraits;
};

/**
 * Create a user profile in Firestore
 * Note: This function will fail gracefully if Firestore is not available
 */
export const createUserProfile = async (user: FirebaseUser, dateOfBirth?: string, birthTime?: string): Promise<void> => {
  try {
    // Check if db is initialized properly
    if (!db) {
      console.warn('Firestore not initialized, skipping profile creation');
      return;
    }
    
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    // Generate sun cards if birth date is provided
    const sunCards = dateOfBirth ? generateSunCards(dateOfBirth, birthTime) : null;
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        dateOfBirth,
        birthTime,
        sunCards,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isPremium: false,
      });
    }
  } catch (error) {
    console.warn('Error creating user profile in Firestore:', error);
    // Don't throw the error, allow the app to continue without Firestore
  }
};

/**
 * Get the current user from Firestore or fallback to Firebase Auth user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const user = auth.currentUser;
    
    if (!user) return null;
    
    // Create a basic user object from Firebase Auth
    const basicUser: User = {
      id: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPremium: false,
    };
    
    // Try to get additional user data from Firestore if available
    try {
      if (!db) {
        console.warn('Firestore not initialized, using basic user data');
        return basicUser;
      }
      
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        return {
          ...basicUser,
          displayName: userData.displayName || basicUser.displayName,
          photoURL: userData.photoURL || basicUser.photoURL,
          createdAt: userData.createdAt?.toDate?.().toISOString() || basicUser.createdAt,
          updatedAt: userData.updatedAt?.toDate?.().toISOString() || basicUser.updatedAt,
          isPremium: userData.isPremium || basicUser.isPremium,
          // Include any additional Firestore fields here
          sunCard: userData.sunCard,
        };
      }
    } catch (firestoreError) {
      console.warn('Error getting user data from Firestore, using basic user data:', firestoreError);
    }
    
    // Return the basic user if Firestore is not available or has no data
    return basicUser;
  } catch (error) {
    console.error('Error getting current user:', error);
    // Return null instead of throwing to prevent app crashes
    return null;
  }
};

/**
 * Subscribe to auth state changes
 */
export const subscribeToAuthChanges = (
  callback: (user: FirebaseUser | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};
