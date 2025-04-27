// firebase-auth-clean.js - A clean implementation of Firebase authentication

import {
    getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword,
    signInWithPopup, signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase-config';

// Initialize Firebase auth
const auth = getAuth();

// User roles
export const USER_ROLES = {
  TEAM: 'team',
  CLIENT: 'client',
  INVESTOR: 'investor',
  PARTNER: 'partner'
};

// Email/Password Authentication
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Email sign-in error:', error);
    throw error;
  }
};

// Google Authentication - Using popup for better cross-browser compatibility
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();

    // Add scopes
    provider.addScope('email');
    provider.addScope('profile');

    // Use popup method for better cross-browser compatibility
    const result = await signInWithPopup(auth, provider);

    // This gives you a Google Access Token
    const credential = GoogleAuthProvider.credentialFromResult(result);

    // Ensure we return a valid object with user property
    if (result && result.user) {
      return {
        user: result.user,
        credential
      };
    } else {
      console.warn('Google sign-in successful but no user data returned');
      return { user: null, credential: null };
    }
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// Get current user from Firestore
export const getCurrentUserData = async (userId) => {
  if (!userId) {
    console.error('getCurrentUserData called with invalid userId');
    return null;
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', userId));

    if (userDoc.exists()) {
      return userDoc.data();
    }

    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null; // Return null instead of throwing to prevent cascading errors
  }
};

// Create or update user in Firestore
export const createOrUpdateUser = async (user, additionalData = {}) => {
  if (!user || !user.uid || !user.email) {
    console.error('createOrUpdateUser called with invalid user object');
    return null;
  }

  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create new user
      const userData = {
        name: user.displayName || 'User',
        email: user.email,
        role: additionalData.role || USER_ROLES.TEAM,
        permissions: additionalData.permissions || ['view_all', 'edit_all', 'admin'],
        createdAt: new Date().toISOString(),
        photoURL: user.photoURL || '',
        ...additionalData
      };

      await setDoc(userRef, userData);
      return userData;
    } else {
      // User exists, return existing data
      return userDoc.data();
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return null; // Return null instead of throwing to prevent cascading errors
  }
};

// Listen for auth state changes
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Export auth instance
export { auth };
