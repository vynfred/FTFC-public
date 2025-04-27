/**
 * Google Drive Service
 *
 * This service handles integration with Google Drive through Firebase Cloud Functions.
 */

import { getFunctions, httpsCallable } from 'firebase/functions';
import { GOOGLE_SCOPES } from '../utils/constants';

// Initialize Firebase Functions
const functions = getFunctions();
const getGoogleAuthUrlFunction = httpsCallable(functions, 'getGoogleAuthUrl');
const getTokensFromCodeFunction = httpsCallable(functions, 'getTokensFromCode');
const connectGoogleDriveFunction = httpsCallable(functions, 'connectGoogleDrive');
const disconnectGoogleDriveFunction = httpsCallable(functions, 'disconnectGoogleDrive');
const getGoogleDriveStatusFunction = httpsCallable(functions, 'getGoogleDriveStatus');

/**
 * Get authorization URL for Google OAuth
 * @returns {Promise<String>} - Authorization URL
 */
export const getGoogleAuthUrl = async () => {
  try {
    const result = await getGoogleAuthUrlFunction({
      scopes: [
        ...GOOGLE_SCOPES,
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/drive.metadata.readonly',
        'https://www.googleapis.com/auth/documents.readonly'
      ]
    });
    return result.data.url;
  } catch (error) {
    console.error('Error getting Google Auth URL:', error);
    throw error;
  }
};

/**
 * Exchange authorization code for tokens
 * @param {String} code - Authorization code from OAuth callback
 * @returns {Promise<Object>} - Tokens object
 */
export const getTokensFromCode = async (code) => {
  try {
    const result = await getTokensFromCodeFunction({ code });
    return result.data;
  } catch (error) {
    console.error('Error getting tokens from code:', error);
    throw error;
  }
};

/**
 * Connect Google Drive
 * @param {Object} tokens - OAuth tokens
 * @returns {Promise<Object>} - Response from Cloud Function
 */
export const connectGoogleDrive = async (tokens) => {
  try {
    const result = await connectGoogleDriveFunction({ tokens });
    return result.data;
  } catch (error) {
    console.error('Error connecting Google Drive:', error);
    throw error;
  }
};

/**
 * Disconnect Google Drive
 * @returns {Promise<Object>} - Response from Cloud Function
 */
export const disconnectGoogleDrive = async () => {
  try {
    const result = await disconnectGoogleDriveFunction();
    return result.data;
  } catch (error) {
    console.error('Error disconnecting Google Drive:', error);
    throw error;
  }
};

/**
 * Get Google Drive connection status
 * @returns {Promise<Object>} - Status object with connected flag
 */
export const getGoogleDriveStatus = async () => {
  try {
    const result = await getGoogleDriveStatusFunction();
    return result.data;
  } catch (error) {
    console.error('Error getting Google Drive status:', error);
    return { connected: false };
  }
};
