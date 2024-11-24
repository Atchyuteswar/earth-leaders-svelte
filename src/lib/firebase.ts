// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { browser } from '$app/environment';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaAF2eJvzANJKQEgM-R9GMawZLNU8U0Hw",
  authDomain: "earth-leaders.firebaseapp.com",
  projectId: "earth-leaders",
  storageBucket: "earth-leaders.appspot.com",
  messagingSenderId: "51302977410",
  appId: "1:51302977410:web:171cc5697d39555de8899b"
};

// Initialize Firebase
const app = browser ? initializeApp(firebaseConfig) : undefined;
const auth = browser ? getAuth(app) : undefined;
const googleProvider = browser ? new GoogleAuthProvider() : undefined;

if (googleProvider) {
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
}

export { app, auth, googleProvider };