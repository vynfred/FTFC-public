/**
 * Firebase Cloud Functions for Authentication
 * 
 * These functions handle secure token storage, refresh, and revocation
 * for Google OAuth authentication.
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');
const axios = require('axios');

// Initialize admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// Google OAuth2 configuration
const oauth2Client = new google.auth.OAuth2(
  functions.config().google.client_id,
  functions.config().google.client_secret,
  functions.config().google.redirect_uri
);

/**
 * Store Google OAuth tokens securely in Firestore
 */
exports.storeGoogleTokens = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to store tokens'
    );
  }

  try {
    const { accessToken, refreshToken } = data;
    
    if (!accessToken) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Access token is required'
      );
    }

    // Get token info to determine expiry
    const tokenInfoResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
    );

    const expiresIn = tokenInfoResponse.data.expires_in || 3600;
    const expiryDate = Date.now() + expiresIn * 1000;

    // Store tokens in Firestore
    await admin.firestore().collection('users').doc(context.auth.uid).update({
      'googleTokens': {
        accessToken,
        refreshToken: refreshToken || null,
        expiryDate,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error storing Google tokens:', error);
    
    throw new functions.https.HttpsError(
      'internal',
      'Error storing tokens',
      error.message
    );
  }
});

/**
 * Get a valid Google access token
 */
exports.getGoogleAccessToken = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to get access token'
    );
  }

  try {
    // Get user document with tokens
    const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    
    if (!userDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'User document not found'
      );
    }
    
    const userData = userDoc.data();
    
    // Check if tokens exist
    if (!userData.googleTokens || !userData.googleTokens.accessToken) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'No Google tokens found for user'
      );
    }
    
    // Check if token is expired
    const expiryDate = userData.googleTokens.expiryDate;
    const isExpired = !expiryDate || Date.now() >= expiryDate;
    
    if (isExpired && userData.googleTokens.refreshToken) {
      // Token is expired, refresh it
      oauth2Client.setCredentials({
        refresh_token: userData.googleTokens.refreshToken
      });
      
      // Refresh token
      const { credentials } = await oauth2Client.refreshAccessToken();
      
      // Update tokens in Firestore
      await admin.firestore().collection('users').doc(context.auth.uid).update({
        'googleTokens.accessToken': credentials.access_token,
        'googleTokens.expiryDate': Date.now() + credentials.expires_in * 1000,
        'googleTokens.updatedAt': admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Return new access token and expiry
      return {
        accessToken: credentials.access_token,
        expiresIn: credentials.expires_in
      };
    }
    
    // Token is still valid
    return {
      accessToken: userData.googleTokens.accessToken,
      expiresIn: expiryDate ? Math.floor((expiryDate - Date.now()) / 1000) : 3600
    };
  } catch (error) {
    console.error('Error getting access token:', error);
    
    throw new functions.https.HttpsError(
      'internal',
      'Error getting access token',
      error.message
    );
  }
});

/**
 * Revoke Google OAuth tokens and sign out
 */
exports.revokeGoogleTokens = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to revoke tokens'
    );
  }

  try {
    // Get user document with tokens
    const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    
    if (!userDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'User document not found'
      );
    }
    
    const userData = userDoc.data();
    
    // Check if tokens exist
    if (!userData.googleTokens || !userData.googleTokens.accessToken) {
      // No tokens to revoke
      return { success: true };
    }
    
    // Revoke access token
    if (userData.googleTokens.accessToken) {
      try {
        await axios.get(
          `https://accounts.google.com/o/oauth2/revoke?token=${userData.googleTokens.accessToken}`
        );
      } catch (revokeError) {
        console.error('Error revoking access token:', revokeError);
        // Continue even if revocation fails
      }
    }
    
    // Remove tokens from Firestore
    await admin.firestore().collection('users').doc(context.auth.uid).update({
      googleTokens: admin.firestore.FieldValue.delete()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error revoking tokens:', error);
    
    throw new functions.https.HttpsError(
      'internal',
      'Error revoking tokens',
      error.message
    );
  }
});
