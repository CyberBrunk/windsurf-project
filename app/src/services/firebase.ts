import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { FIREBASE_CONFIG } from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Initialize Firebase app
 */
const app = !getApps().length ? initializeApp(FIREBASE_CONFIG) : getApp();

/**
 * Initialize Firebase Auth
 * 
 * Note: For React Native persistence, we'll handle auth state in the AuthContext
 * using AsyncStorage to store the user's authentication state
 */
const auth: Auth = getAuth(app);

/**
 * Initialize Firestore
 */
const db = getFirestore(app);

/**
 * Initialize Storage
 */
const storage = getStorage(app);

/**
 * Initialize Cloud Functions
 */
const functions = getFunctions(app);

export { app, auth, db, storage, functions };
