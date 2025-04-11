const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');

// Get Firestore instance
const getDb = () => admin.firestore();

/**
 * Connect Google Drive
 *
 * This function stores the user's Google OAuth tokens in Firestore
 * and enables Google Drive integration for the user.
 */
exports.connectGoogleDrive = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to connect Google Drive.'
    );
  }

  const { tokens } = data;
  const uid = context.auth.uid;

  try {
    // Verify tokens by making a test API call
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials(tokens);

    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    await drive.files.list({ pageSize: 1 });

    // Store tokens in Firestore
    const db = getDb();
    await db.collection('users').doc(uid).update({
      googleDriveEnabled: true,
      tokens: tokens,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error connecting Google Drive:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Error connecting Google Drive',
      error.message
    );
  }
});

/**
 * Disconnect Google Drive
 *
 * This function removes the user's Google OAuth tokens from Firestore
 * and disables Google Drive integration for the user.
 */
exports.disconnectGoogleDrive = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to disconnect Google Drive.'
    );
  }

  const uid = context.auth.uid;

  try {
    // Remove tokens from Firestore
    const db = getDb();
    await db.collection('users').doc(uid).update({
      googleDriveEnabled: false,
      tokens: admin.firestore.FieldValue.delete(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error disconnecting Google Drive:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Error disconnecting Google Drive',
      error.message
    );
  }
});

/**
 * Get Google Drive Connection Status
 *
 * This function checks if the user has Google Drive integration enabled.
 */
exports.getGoogleDriveStatus = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to check Google Drive status.'
    );
  }

  const uid = context.auth.uid;

  try {
    // Get user document from Firestore
    const db = getDb();
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return { connected: false };
    }

    const userData = userDoc.data();

    return {
      connected: userData.googleDriveEnabled === true && userData.tokens !== null,
      email: userData.email || context.auth.token.email
    };
  } catch (error) {
    console.error('Error checking Google Drive status:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Error checking Google Drive status',
      error.message
    );
  }
});
