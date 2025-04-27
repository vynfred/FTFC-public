// firebase-auth.js - Clean implementation of Firebase authentication

import {
    createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut
} from 'firebase/auth';

// Import the existing Firebase auth instance
import { auth } from './firebase-config';

// Email/Password Authentication
export const signInWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const createAccount = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Google Authentication
export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

// Sign out
export const logOut = () => {
  return signOut(auth);
};

// Export auth instance
export { auth };
