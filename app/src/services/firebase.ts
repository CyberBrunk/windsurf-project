import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
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

// Note: For React Native persistence, you would typically use:
// const auth = initializeAuth(app, {
//   persistence: indexedDBLocalPersistence
// });
// But we're using the default persistence for now

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
