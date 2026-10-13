// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Firebase throws (auth/invalid-api-key) as soon as getAuth() runs without a key,
// which would crash the whole app. Only create Auth when the key is configured.
let auth = null;
export const getFirebaseAuth = () => {
  if (!firebaseConfig.apiKey) {
    console.error("Firebase is not configured: REACT_APP_FIREBASE_API_KEY is missing.");
    return null;
  }
  if (!auth) auth = getAuth(firebaseApp);
  return auth;
};
