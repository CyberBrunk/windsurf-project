import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
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
 */
const auth = getAuth(app);

// Note: For React Native, we'll need to set up persistence manually in the AuthContext
// This will be done by implementing onAuthStateChanged and storing the user in AsyncStorage

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
