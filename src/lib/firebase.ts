// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, inMemoryPersistence, setPersistence } from "firebase/auth";
import { browser } from '$app/environment';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = browser ? initializeApp(firebaseConfig) : undefined;
const auth = browser ? getAuth(app) : undefined;
const googleProvider = browser ? new GoogleAuthProvider() : undefined;

if (auth) {
  // Use in-memory persistence to avoid issues with SSR
  setPersistence(auth, inMemoryPersistence);
}

if (googleProvider) {
  googleProvider.setCustomParameters({
    prompt: 'select_account',
    // Handle redirect properly in production
    redirect_uri: typeof window !== 'undefined' ? window.location.origin + '/__/auth/handler' : undefined
  });
}

export { app, auth, googleProvider };