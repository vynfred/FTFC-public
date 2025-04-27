/**
 * Authentication Service
 *
 * This service provides authentication functionality using Firebase Authentication
 * with secure token storage and refresh mechanisms.
 */

import {
    getAuth, getRedirectResult, GoogleAuthProvider,
    onAuthStateChanged, signInWithEmailAndPassword,
    signInWithRedirect,
    signOut
} from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { parseAuthError } from '../utils/authUtils';
import { GOOGLE_SCOPES } from '../utils/constants';
import { logAuthEvent, LOG_LEVELS } from '../utils/loggerService';
import { clearTokenExpiry, storeTokenExpiry } from './tokenService';

// Initialize Firebase Auth
const auth = getAuth();
const functions = getFunctions();

/**
 * Sign in with email and password
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {Promise<Object>} The user credentials
 */
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Log successful login
    await logAuthEvent('email_login_success', {
      email: userCredential.user.email,
      uid: userCredential.user.uid
    });

    return userCredential;
  } catch (error) {
    // Log failed login
    const parsedError = parseAuthError(error);
    await logAuthEvent('email_login_failure', {
      email,
      errorCode: parsedError.code,
      errorMessage: parsedError.message
    }, LOG_LEVELS.ERROR);

    console.error('Error signing in with email:', error);
    throw error;
  }
};

/**
 * Sign in with Google using redirect
 * @returns {Promise<void>}
 */
export const signInWithGoogle = async () => {
  try {
    // Create a Google provider
    const provider = new GoogleAuthProvider();

    // Add scopes
    GOOGLE_SCOPES.forEach(scope => {
      provider.addScope(scope);
    });

    // Set custom parameters
    provider.setCustomParameters({
      prompt: 'select_account',
      access_type: 'offline', // Get a refresh token
      include_granted_scopes: true // Include previously granted scopes
    });

    // Log Google sign-in attempt
    await logAuthEvent('google_login_attempt', {
      scopes: GOOGLE_SCOPES,
      method: 'redirect'
    });

    // Sign in with redirect
    await signInWithRedirect(auth, provider);
  } catch (error) {
    // Log failed Google sign-in
    const parsedError = parseAuthError(error);
    await logAuthEvent('google_login_failure', {
      errorCode: parsedError.code,
      errorMessage: parsedError.message,
      method: 'redirect'
    }, LOG_LEVELS.ERROR);

    console.error('Error signing in with Google:', error);
    throw error;
  }
};

/**
 * Get the result of the redirect sign-in
 * @returns {Promise<Object>} The user credentials
 */
export const getGoogleRedirectResult = async () => {
  try {
    // Log redirect result attempt
    await logAuthEvent('google_redirect_result_attempt', {
      url: window.location.href
    });

    const result = await getRedirectResult(auth);

    if (result) {
      // Get the Google OAuth tokens
      const credential = GoogleAuthProvider.credentialFromResult(result);

      if (credential && credential.accessToken) {
        // Store token expiry
        storeTokenExpiry(3600); // Default to 1 hour if not provided

        // Log successful redirect result
        await logAuthEvent('google_redirect_result_success', {
          email: result.user.email,
          uid: result.user.uid
        });
      }

      return result;
    }

    // Log no result from redirect
    await logAuthEvent('google_redirect_no_result', {
      url: window.location.href
    });

    return null;
  } catch (error) {
    // Log failed redirect result
    const parsedError = parseAuthError(error);
    await logAuthEvent('google_redirect_result_failure', {
      errorCode: parsedError.code,
      errorMessage: parsedError.message,
      url: window.location.href
    }, LOG_LEVELS.ERROR);

    console.error('Error getting redirect result:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export const signOutUser = async () => {
  try {
    // Get user info before signing out
    const currentUser = auth.currentUser;
    const uid = currentUser?.uid;
    const email = currentUser?.email;

    // Sign out from Firebase
    await signOut(auth);

    // Clear stored token expiry
    clearTokenExpiry();

    // Log successful sign-out
    await logAuthEvent('sign_out_success', {
      uid,
      email
    });
  } catch (error) {
    // Log failed sign-out
    const parsedError = parseAuthError(error);
    await logAuthEvent('sign_out_failure', {
      errorCode: parsedError.code,
      errorMessage: parsedError.message
    }, LOG_LEVELS.ERROR);

    console.error('Error signing out:', error);

    // Still clear token expiry even if there's an error
    clearTokenExpiry();

    throw error;
  }
};

/**
 * Set an auth state observer
 * @param {Function} callback - The callback function to call when auth state changes
 * @returns {Function} The unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get the current user
 * @returns {Object|null} The current user or null if not signed in
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};
