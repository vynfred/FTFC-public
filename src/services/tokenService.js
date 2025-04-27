/**
 * Token Service
 *
 * This service provides secure token management using server-side storage.
 * Only token expiry information is stored client-side for performance.
 */

import { getFunctions, httpsCallable } from 'firebase/functions';

// Constants for token storage
const TOKEN_EXPIRY_KEY = 'token_expiry';

/**
 * Store token expiry time in sessionStorage
 * Access and refresh tokens are stored server-side only
 * @param {number} expiresIn - Token expiration time in seconds
 */
export const storeTokenExpiry = (expiresIn) => {
  try {
    // Calculate expiry time
    const expiryTime = Date.now() + (expiresIn || 3600) * 1000;

    // Store only expiry time in sessionStorage
    sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  } catch (error) {
    console.error('Error storing token expiry:', error);
  }
};

/**
 * Check if the access token is expired
 * @returns {boolean} True if the token is expired, false otherwise
 */
export const isTokenExpired = () => {
  try {
    const expiryTime = sessionStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiryTime) return true;

    // Add a 5-minute buffer to ensure we refresh before expiration
    return Date.now() > (parseInt(expiryTime) - 5 * 60 * 1000);
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Clear token expiry information
 */
export const clearTokenExpiry = () => {
  try {
    sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
  } catch (error) {
    console.error('Error clearing token expiry:', error);
  }
};

/**
 * Get a valid access token from the server
 * @returns {Promise<string>} A valid access token
 */
export const getValidAccessToken = async () => {
  try {
    // Call the Firebase Function to get a valid token
    const functions = getFunctions();
    const getTokenFunction = httpsCallable(functions, 'getGoogleAccessToken');

    const result = await getTokenFunction();
    const { accessToken, expiresIn } = result.data;

    // Store only the expiry time
    storeTokenExpiry(expiresIn);

    return accessToken;
  } catch (error) {
    console.error('Error getting valid access token:', error);
    clearTokenExpiry(); // Clear expiry on error
    throw error;
  }
};

/**
 * Revoke Google tokens
 * @returns {Promise<void>}
 */
export const revokeTokens = async () => {
  try {
    // Call the Firebase Function to revoke tokens
    const functions = getFunctions();
    const revokeTokensFunction = httpsCallable(functions, 'revokeGoogleTokens');

    await revokeTokensFunction();

    // Clear token expiry
    clearTokenExpiry();
  } catch (error) {
    console.error('Error revoking tokens:', error);
    clearTokenExpiry(); // Clear expiry on error
    throw error;
  }
};
