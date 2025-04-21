import { EmailAuthProvider, getAuth, getRedirectResult, GoogleAuthProvider, linkWithCredential, linkWithPopup, linkWithRedirect, unlink } from 'firebase/auth';

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
