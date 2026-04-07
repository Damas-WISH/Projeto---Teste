import { type FirebaseOptions, getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const REQUIRED_FIREBASE_ENV_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

function getFirebaseConfig(): FirebaseOptions {
  const missingKeys = REQUIRED_FIREBASE_ENV_KEYS.filter((key) => {
    const value = import.meta.env[key];
    return typeof value !== 'string' || value.trim() === '';
  });

  if (missingKeys.length > 0) {
    throw new Error(
      `Firebase config is missing the following environment variables: ${missingKeys.join(', ')}. ` +
        `Add them to your environment or to the .env.${import.meta.env.MODE} file.`
    );
  }

  const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID?.trim();

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    ...(measurementId ? { measurementId } : {}),
  };
}

const firebaseConfig = getFirebaseConfig();

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
