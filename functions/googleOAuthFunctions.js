/**
 * Firebase Cloud Functions for Google OAuth
 * These functions handle Google OAuth operations securely on the server side.
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
 * Function to get Google OAuth URL
 */
exports.getGoogleAuthUrl = functions.https.onCall(async (data, context) => {
  // Verify that the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be logged in to get auth URL"
    );
  }

  try {
    const { scopes = [] } = data;
    
    if (!Array.isArray(scopes) || scopes.length === 0) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Scopes must be a non-empty array"
      );
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Generate auth URL
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent', // Force to get refresh token
      include_granted_scopes: true
    });
    
    return { url };
  } catch (error) {
    console.error("Error generating auth URL:", error);
    
    throw new functions.https.HttpsError(
      "internal",
      "Error generating auth URL",
      error.message
    );
  }
});

/**
 * Function to exchange authorization code for tokens
 */
exports.getTokensFromCode = functions.https.onCall(async (data, context) => {
  // Verify that the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be logged in to exchange code for tokens"
    );
  }

  try {
    const { code } = data;
    
    if (!code) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Authorization code is required"
      );
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Define the operation to retry
    const getTokensOperation = async () => {
      const { tokens } = await oauth2Client.getToken(code);
      return tokens;
    };

    // Execute with retry logic
    const tokens = await retryOperation(getTokensOperation);
    
    // Store tokens in Firestore for the user
    await admin.firestore().collection('users').doc(context.auth.uid).update({
      googleTokens: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiryDate: tokens.expiry_date,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    });
    
    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expiry_date ? 
        Math.floor((tokens.expiry_date - Date.now()) / 1000) : 
        3600 // Default to 1 hour if no expiry provided
    };
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    
    throw new functions.https.HttpsError(
      "internal",
      "Error exchanging code for tokens",
      error.message
    );
  }
});

/**
 * Function to connect Google Drive
 */
exports.connectGoogleDrive = functions.https.onCall(async (data, context) => {
  // Verify that the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be logged in to connect Google Drive"
    );
  }

  try {
    const { tokens } = data;
    
    if (!tokens || !tokens.accessToken) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Valid tokens are required"
      );
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Set credentials
    oauth2Client.setCredentials({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      expiry_date: Date.now() + (tokens.expiresIn || 3600) * 1000
    });

    // Create Drive client
    const drive = google.drive({
      version: "v3",
      auth: oauth2Client
    });

    // Define the operation to retry
    const testDriveOperation = async () => {
      // Test the connection by listing files
      const response = await drive.files.list({
        pageSize: 1,
        fields: "files(id, name)"
      });
      
      return response.data;
    };

    // Execute with retry logic
    await retryOperation(testDriveOperation);
    
    // Store connection status in Firestore
    await admin.firestore().collection('users').doc(context.auth.uid).update({
      googleDriveConnected: true,
      googleDriveConnectedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error connecting Google Drive:", error);
    
    throw new functions.https.HttpsError(
      "internal",
      "Error connecting Google Drive",
      error.message
    );
  }
});

/**
 * Function to disconnect Google Drive
 */
exports.disconnectGoogleDrive = functions.https.onCall(async (data, context) => {
  // Verify that the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be logged in to disconnect Google Drive"
    );
  }

  try {
    // Get user document
    const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    
    if (!userDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "User document not found"
      );
    }
    
    const userData = userDoc.data();
    
    // If user has refresh token, revoke it
    if (userData.googleTokens && userData.googleTokens.refreshToken) {
      // Create OAuth2 client
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );
      
      // Define the operation to retry
      const revokeTokenOperation = async () => {
        await oauth2Client.revokeToken(userData.googleTokens.refreshToken);
      };
      
      // Execute with retry logic
      await retryOperation(revokeTokenOperation);
    }
    
    // Update user document
    await admin.firestore().collection('users').doc(context.auth.uid).update({
      googleDriveConnected: false,
      googleTokens: admin.firestore.FieldValue.delete()
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error disconnecting Google Drive:", error);
    
    throw new functions.https.HttpsError(
      "internal",
      "Error disconnecting Google Drive",
      error.message
    );
  }
});

/**
 * Function to get Google Drive connection status
 */
exports.getGoogleDriveStatus = functions.https.onCall(async (data, context) => {
  // Verify that the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be logged in to get Google Drive status"
    );
  }

  try {
    // Get user document
    const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    
    if (!userDoc.exists) {
      return { connected: false };
    }
    
    const userData = userDoc.data();
    
    return { 
      connected: userData.googleDriveConnected === true,
      connectedAt: userData.googleDriveConnectedAt ? userData.googleDriveConnectedAt.toDate() : null
    };
  } catch (error) {
    console.error("Error getting Google Drive status:", error);
    
    throw new functions.https.HttpsError(
      "internal",
      "Error getting Google Drive status",
      error.message
    );
  }
});
