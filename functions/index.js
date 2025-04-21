/**
 * Firebase Cloud Functions for FTFC Application
 */

// Use Firebase Functions v1 for compatibility
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

// Import other modules
const axios = require("axios");

// Simple test function to verify deployment
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase Functions!");
});

// Logout function with retry logic using exponential backoff
exports.logout = functions.https.onCall((data, context) => {
  // Verify that the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in to logout');
  }

  // Implement retry with exponential backoff
  const retryOperation = async (operation, maxRetries = 5, maxBackoff = 32) => {
    let retries = 0;

    while (retries < maxRetries) {
      try {
        return await operation();
      } catch (error) {
        // Only retry on specific error codes as recommended by Google
        if (error.code === 500 || error.code === 502 || error.code === 503 || error.code === 504 || error.code === 404) {
          retries++;

          if (retries >= maxRetries) {
            throw error; // Max retries reached, propagate the error
          }

          // Calculate backoff time with jitter: 2^n + random fraction
          const backoffTime = Math.min(Math.pow(2, retries) + Math.random(), maxBackoff);
          console.log(`Retry attempt ${retries} for user ${context.auth.uid}, waiting ${backoffTime} seconds`);

          // Wait for the backoff period
          await new Promise(resolve => setTimeout(resolve, backoffTime * 1000));
        } else {
          throw error; // Not a retryable error
        }
      }
    }
  };

  // Define the operation to retry
  const revokeTokensOperation = async () => {
    return admin.auth().revokeRefreshTokens(context.auth.uid)
      .then(() => {
        return { success: true, message: 'Successfully logged out' };
      });
  };

  try {
    // Execute the operation with retry logic
    return retryOperation(revokeTokensOperation);
  } catch (error) {
    console.error('Error logging out:', error);
    throw new functions.https.HttpsError('internal', 'Error logging out');
  }
});
