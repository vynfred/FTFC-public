/**
 * Firebase Cloud Functions for Authentication
 * These functions handle authentication-related operations securely on the server side.
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { google } = require("googleapis");
const axios = require("axios");

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// Helper function for retry logic with exponential backoff
const retryOperation = async (operation, maxRetries = 5, maxBackoff = 32) => {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      // Only retry on specific error codes as recommended by Google
      const retryableStatusCodes = [429, 500, 502, 503, 504];
      const statusCode = error.response?.status || error.code;
      
      if (retryableStatusCodes.includes(statusCode)) {
        retries++;

        if (retries >= maxRetries) {
          throw error; // Max retries reached, propagate the error
        }

        // Calculate backoff time with jitter: 2^n + random fraction
        const backoffTime = Math.min(Math.pow(2, retries) + Math.random(), maxBackoff);
        console.log(`Retry attempt ${retries}, waiting ${backoffTime} seconds`);

        // Wait for the backoff period
        await new Promise(resolve => setTimeout(resolve, backoffTime * 1000));
      } else {
        throw error; // Not a retryable error
      }
    }
  }
};

/**
 * Function to refresh an OAuth access token using a refresh token
 */
exports.refreshToken = functions.https.onCall(async (data, context) => {
  // Verify that the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be logged in to refresh token"
    );
  }

  try {
    const { refreshToken } = data;
    
    if (!refreshToken) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Refresh token is required"
      );
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Define the operation to retry
    const refreshTokenOperation = async () => {
      // Set the refresh token
      oauth2Client.setCredentials({
        refresh_token: refreshToken
      });

      // Refresh the access token
      const tokenResponse = await oauth2Client.refreshAccessToken();
      return tokenResponse.credentials;
    };

    // Execute with retry logic
    const credentials = await retryOperation(refreshTokenOperation);
    
    return {
      accessToken: credentials.access_token,
      refreshToken: credentials.refresh_token || refreshToken, // Use new refresh token if provided
      expiresIn: credentials.expiry_date ? 
        Math.floor((credentials.expiry_date - Date.now()) / 1000) : 
        3600 // Default to 1 hour if no expiry provided
    };
  } catch (error) {
    console.error("Error refreshing token:", error);
    
    throw new functions.https.HttpsError(
      "internal",
      "Error refreshing token",
      error.message
    );
  }
});

/**
 * Function to revoke a user's tokens (logout)
 */
exports.logout = functions.https.onCall(async (data, context) => {
  // Verify that the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be logged in to logout"
    );
  }

  try {
    // Define the operation to retry
    const revokeTokensOperation = async () => {
      // Revoke refresh tokens for the user
      await admin.auth().revokeRefreshTokens(context.auth.uid);
      
      // If a refresh token was provided, also revoke it with Google
      const { refreshToken } = data;
      if (refreshToken) {
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.GOOGLE_REDIRECT_URI
        );
        
        await oauth2Client.revokeToken(refreshToken);
      }
      
      return { success: true };
    };

    // Execute with retry logic
    const result = await retryOperation(revokeTokensOperation);
    
    return result;
  } catch (error) {
    console.error("Error logging out:", error);
    
    throw new functions.https.HttpsError(
      "internal",
      "Error logging out",
      error.message
    );
  }
});
