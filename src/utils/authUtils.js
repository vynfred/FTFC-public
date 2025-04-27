import { EmailAuthProvider, getAuth, getRedirectResult, GoogleAuthProvider, linkWithCredential, linkWithPopup, linkWithRedirect, signOut, unlink } from 'firebase/auth';
import { getValidAccessToken } from '../services/tokenService';

/**
 * Links a Google account to the currently signed-in user using a popup
 * @returns {Promise} A promise that resolves when the linking is complete
 */
export const linkGoogleAccountWithPopup = async () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  // Add scopes if needed
  provider.addScope('https://www.googleapis.com/auth/userinfo.email');
  provider.addScope('https://www.googleapis.com/auth/userinfo.profile');

  try {
    const result = await linkWithPopup(auth.currentUser, provider);
    // Get the Google OAuth access token
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    console.log('Account successfully linked with Google');
    return {
      success: true,
      user: result.user,
      token
    };
  } catch (error) {
    console.error('Error linking account with Google:', error);

    // Handle the special case where the credential is already linked to another account
    if (error.code === 'auth/account-exists-with-different-credential') {
      console.error('The account already exists with a different credential');
      return {
        success: false,
        error: {
          code: error.code,
          message: 'This Google account is already linked to another user account. Please sign in with that account first.',
          credential: error.credential
        }
      };
    }

    return {
      success: false,
      error: {
        code: error.code,
        message: error.message
      }
    };
  }
};

/**
 * Links a Google account to the currently signed-in user using a redirect
 * @returns {Promise} A promise that resolves when the redirect is initiated
 */
export const linkGoogleAccountWithRedirect = async () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  // Add scopes if needed
  provider.addScope('https://www.googleapis.com/auth/userinfo.email');
  provider.addScope('https://www.googleapis.com/auth/userinfo.profile');

  try {
    await linkWithRedirect(auth.currentUser, provider);
    return { success: true };
  } catch (error) {
    console.error('Error initiating Google account linking with redirect:', error);
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message
      }
    };
  }
};

/**
 * Gets the result of a redirect-based linking operation
 * @returns {Promise} A promise that resolves with the linking result
 */
export const getLinkWithRedirectResult = async () => {
  const auth = getAuth();

  try {
    const result = await getRedirectResult(auth);

    if (result) {
      // Get the Google OAuth access token
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      console.log('Account successfully linked with Google via redirect');
      return {
        success: true,
        user: result.user,
        token
      };
    }

    return { success: false, result: null };
  } catch (error) {
    console.error('Error completing Google account linking with redirect:', error);

    // Handle the special case where the credential is already linked to another account
    if (error.code === 'auth/account-exists-with-different-credential') {
      console.error('The account already exists with a different credential');
      return {
        success: false,
        error: {
          code: error.code,
          message: 'This Google account is already linked to another user account. Please sign in with that account first.',
          credential: error.credential
        }
      };
    }

    return {
      success: false,
      error: {
        code: error.code,
        message: error.message
      }
    };
  }
};

/**
 * Links an email/password to the currently signed-in user
 * @param {string} email The email to link
 * @param {string} password The password to link
 * @returns {Promise} A promise that resolves when the linking is complete
 */
export const linkEmailPassword = async (email, password) => {
  const auth = getAuth();

  try {
    // Create the email/password credential
    const credential = EmailAuthProvider.credential(email, password);

    // Link the credential to the current user
    const result = await linkWithCredential(auth.currentUser, credential);

    console.log('Email/password successfully linked to account');
    return {
      success: true,
      user: result.user
    };
  } catch (error) {
    console.error('Error linking email/password to account:', error);
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message
      }
    };
  }
};

/**
 * Unlinks a provider from the currently signed-in user
 * @param {string} providerId The provider ID to unlink (e.g., 'google.com')
 * @returns {Promise} A promise that resolves when the unlinking is complete
 */
export const unlinkProvider = async (providerId) => {
  const auth = getAuth();

  try {
    const user = await unlink(auth.currentUser, providerId);
    console.log(`Provider ${providerId} successfully unlinked`);
    return {
      success: true,
      user
    };
  } catch (error) {
    console.error(`Error unlinking provider ${providerId}:`, error);
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message
      }
    };
  }
};

/**
 * Signs in a user with a custom token from your authentication server
 * @param {string} token The custom token from your authentication server
 * @returns {Promise} A promise that resolves when the sign-in is complete
 */
export const signInWithCustomAuthToken = async (token) => {
  const auth = getAuth();

  try {
    const userCredential = await signInWithCustomToken(auth, token);
    console.log('Successfully signed in with custom token');
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    console.error('Error signing in with custom token:', error);
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message
      }
    };
  }
};

/**
 * Refresh token with exponential backoff
 * @param {number} maxAttempts - Maximum number of retry attempts
 * @returns {Promise<string>} - Valid access token
 */
export const refreshTokenWithBackoff = async (maxAttempts = 3) => {
  let attempt = 0;
  let delay = 1000; // Start with 1 second delay
  let lastError = null;

  while (attempt < maxAttempts) {
    try {
      const token = await getValidAccessToken();
      return token;
    } catch (error) {
      console.warn(`Token refresh attempt ${attempt + 1} failed:`, error);
      lastError = error;
      attempt++;

      if (attempt >= maxAttempts) {
        console.error('Token refresh failed after maximum attempts');
        break;
      }

      // Exponential backoff with jitter
      const jitter = Math.random() * 0.3 + 0.85; // Random value between 0.85 and 1.15
      delay = Math.min(delay * 2 * jitter, 10000); // Cap at 10 seconds

      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // All attempts failed
  throw new Error(
    lastError?.message ||
    'Token refresh failed after multiple attempts. Please sign in again.'
  );
};

/**
 * Force re-authentication
 * @param {string} redirectUrl - URL to redirect to after sign-out
 * @returns {Promise<void>}
 */
export const forceReauthentication = async (redirectUrl = '/login') => {
  try {
    const auth = getAuth();

    // Store the current URL to redirect back after login
    if (window.location.pathname !== '/login') {
      sessionStorage.setItem('authRedirectUrl', window.location.pathname);
    }

    // Sign out the user
    await signOut(auth);

    // Redirect to login page
    window.location.href = `${redirectUrl}?reason=session_expired`;
  } catch (error) {
    console.error('Error during forced re-authentication:', error);
    // Fallback to simple redirect if sign-out fails
    window.location.href = `${redirectUrl}?reason=error`;
  }
};

/**
 * Check if the current session is active
 * @param {number} maxInactivityMinutes - Maximum inactivity time in minutes
 * @returns {boolean} - Whether the session is active
 */
export const isSessionActive = (maxInactivityMinutes = 30) => {
  const lastActivity = sessionStorage.getItem('lastActivityTimestamp');

  if (!lastActivity) {
    return false;
  }

  const inactivityTime = Date.now() - parseInt(lastActivity, 10);
  const maxInactivityTime = maxInactivityMinutes * 60 * 1000;

  return inactivityTime < maxInactivityTime;
};

/**
 * Update the last activity timestamp
 */
export const updateActivityTimestamp = () => {
  sessionStorage.setItem('lastActivityTimestamp', Date.now().toString());
};

/**
 * Set up activity tracking
 */
export const setupActivityTracking = () => {
  // Initialize last activity timestamp
  updateActivityTimestamp();

  // Track user activity
  const resetInactivityTimer = () => {
    updateActivityTimestamp();
  };

  // Add event listeners for user activity
  window.addEventListener('mousemove', resetInactivityTimer);
  window.addEventListener('keypress', resetInactivityTimer);
  window.addEventListener('click', resetInactivityTimer);
  window.addEventListener('scroll', resetInactivityTimer);
  window.addEventListener('touchstart', resetInactivityTimer);

  // Return a cleanup function
  return () => {
    window.removeEventListener('mousemove', resetInactivityTimer);
    window.removeEventListener('keypress', resetInactivityTimer);
    window.removeEventListener('click', resetInactivityTimer);
    window.removeEventListener('scroll', resetInactivityTimer);
    window.removeEventListener('touchstart', resetInactivityTimer);
  };
};

/**
 * Parse and handle authentication errors
 * @param {Error} error - The error object
 * @returns {Object} - Parsed error with code and user-friendly message
 */
export const parseAuthError = (error) => {
  // Map Firebase error codes to user-friendly messages
  const errorMap = {
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password is too weak. Please use a stronger password.',
    'auth/invalid-email': 'Invalid email address format.',
    'auth/account-exists-with-different-credential': 'An account already exists with the same email but different sign-in credentials.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed before completing the sign-in process.',
    'auth/cancelled-popup-request': 'The sign-in popup was cancelled.',
    'auth/popup-blocked': 'The sign-in popup was blocked by the browser.',
    'auth/network-request-failed': 'A network error occurred. Please check your connection and try again.',
    'auth/too-many-requests': 'Too many unsuccessful login attempts. Please try again later.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/requires-recent-login': 'This operation requires a more recent login. Please sign in again.',
    'auth/operation-not-allowed': 'This operation is not allowed. Please contact support.',
    'auth/invalid-credential': 'The authentication credential is invalid. Please try again.',
    'auth/invalid-verification-code': 'The verification code is invalid. Please try again.',
    'auth/invalid-verification-id': 'The verification ID is invalid. Please try again.',
    'auth/missing-verification-code': 'The verification code is missing. Please try again.',
    'auth/missing-verification-id': 'The verification ID is missing. Please try again.',
    'auth/credential-already-in-use': 'This credential is already associated with a different user account.',
    'auth/provider-already-linked': 'This provider is already linked to your account.',
    'auth/redirect-cancelled-by-user': 'The redirect operation was cancelled by the user.',
    'auth/redirect-operation-pending': 'A redirect sign-in operation is already pending.',
    'auth/timeout': 'The operation has timed out.',
    'auth/user-token-expired': 'Your session has expired. Please sign in again.',
    'auth/web-storage-unsupported': 'Web storage is not supported or is disabled in this browser.',
    'auth/invalid-oauth-provider': 'The specified OAuth provider is invalid.',
    'auth/invalid-oauth-client-id': 'The OAuth client ID is invalid.',
    'auth/unauthorized-domain': 'This domain is not authorized for OAuth operations.',
    'auth/invalid-action-code': 'The action code is invalid. This can happen if the code is malformed, expired, or has already been used.',
    'auth/expired-action-code': 'The action code has expired.',
    'auth/invalid-tenant-id': 'The tenant ID is invalid.',
    'auth/tenant-id-mismatch': 'The tenant ID does not match the current user.',
    'token-expired': 'Your session has expired. Please sign in again.',
    'network-error': 'A network error occurred. Please check your connection and try again.'
  };

  const code = error.code || 'unknown-error';
  const message = errorMap[code] || error.message || 'An unknown error occurred.';

  return {
    code,
    message,
    originalError: error
  };
};
