/**
 * Cross-Account Protection Event Receiver
 *
 * This function receives and processes security event tokens from Google's
 * Cross-Account Protection service. It validates the tokens, extracts the
 * security event information, and takes appropriate action based on the
 * event type.
 */

const functions = require('firebase-functions/v2');
const admin = require('./src/admin');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const jwksClient = require('jwks-rsa');

// Create a JWKS client to fetch Google's public keys
const client = jwksClient({
  jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
  cache: true,
  cacheMaxAge: 86400000 // 1 day
});

// Get the signing key from the JWKS
const getSigningKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
};

// Validate the security event token
const validateSecurityEventToken = async (token) => {
  return new Promise((resolve, reject) => {
    // First decode the token without verification to get the key ID
    const unverifiedToken = jwt.decode(token, { complete: true });
    if (!unverifiedToken) {
      reject(new Error('Invalid token format'));
      return;
    }

    // Get the signing key and verify the token
    getSigningKey(unverifiedToken.header, (err, signingKey) => {
      if (err) {
        reject(new Error(`Failed to get signing key: ${err.message}`));
        return;
      }

      // Verify the token
      jwt.verify(
        token,
        signingKey,
        {
          issuer: 'https://accounts.google.com/',
          // Your Google OAuth client IDs
          audience: [
            process.env.REACT_APP_GOOGLE_CLIENT_ID || '815708531852-scs6t2uph7ci2vkgpfvn7uq5q7406s20.apps.googleusercontent.com'
          ],
          // Don't check expiration for security event tokens
          ignoreExpiration: true
        },
        (err, decoded) => {
          if (err) {
            reject(new Error(`Token verification failed: ${err.message}`));
            return;
          }
          resolve(decoded);
        }
      );
    });
  });
};

// Handle different types of security events
const handleSecurityEvent = async (eventType, subject, attributes) => {
  const userId = subject.sub;
  console.log(`Handling security event ${eventType} for user ${userId}`);

  // Get user record from Firebase Auth
  try {
    // First try to find the user by their Google UID
    const userRecord = await admin.auth().getUser(userId)
      .catch(() => null);

    if (!userRecord) {
      // If not found by UID, the user might be using email/password auth
      // with the same email as their Google account
      if (subject.email) {
        const userByEmail = await admin.auth().getUserByEmail(subject.email)
          .catch(() => null);
        if (!userByEmail) {
          console.log(`No user found for subject ${userId} or email ${subject.email}`);
          return;
        }
        return handleEventForUser(eventType, userByEmail, attributes);
      }
      console.log(`No user found for subject ${userId}`);
      return;
    }

    return handleEventForUser(eventType, userRecord, attributes);
  } catch (error) {
    console.error(`Error handling security event: ${error.message}`);
    throw error;
  }
};

// Take appropriate action based on the event type and user
const handleEventForUser = async (eventType, user, attributes) => {
  const uid = user.uid;

  switch (eventType) {
    case 'https://schemas.openid.net/secevent/risc/event-type/sessions-revoked':
      // Revoke all sessions for the user
      await admin.auth().revokeRefreshTokens(uid);
      console.log(`Revoked all sessions for user ${uid}`);

      // Add a flag in Firestore to show a warning on next login
      await admin.firestore().collection('users').doc(uid).set({
        securityAlert: {
          type: 'sessions-revoked',
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          message: 'Your Google Account sessions were revoked. For security, we\'ve signed you out of all devices.'
        }
      }, { merge: true });
      break;

    case 'https://schemas.openid.net/secevent/oauth/event-type/tokens-revoked':
      // Revoke all sessions for the user
      await admin.auth().revokeRefreshTokens(uid);
      console.log(`Revoked all sessions for user ${uid} due to tokens-revoked event`);

      // Add a flag in Firestore to show a warning on next login
      await admin.firestore().collection('users').doc(uid).set({
        securityAlert: {
          type: 'tokens-revoked',
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          message: 'Your Google Account tokens were revoked. For security, we\'ve signed you out of all devices.'
        }
      }, { merge: true });
      break;

    case 'https://schemas.openid.net/secevent/risc/event-type/account-disabled':
      // Disable the user's account if Google account was disabled due to hijacking
      if (attributes && attributes.reason === 'hijacking') {
        await admin.auth().updateUser(uid, { disabled: true });
        console.log(`Disabled user ${uid} due to Google account hijacking`);

        // Add a record in Firestore
        await admin.firestore().collection('users').doc(uid).set({
          securityAlert: {
            type: 'account-disabled',
            reason: 'hijacking',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            message: 'Your account has been temporarily disabled due to suspicious activity on your Google Account.'
          }
        }, { merge: true });
      } else {
        // For other reasons, just log it
        console.log(`Google account disabled for user ${uid}, reason: ${attributes?.reason || 'unknown'}`);

        // Add a flag in Firestore
        await admin.firestore().collection('users').doc(uid).set({
          securityAlert: {
            type: 'account-disabled',
            reason: attributes?.reason || 'unknown',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            message: 'Your Google Account was disabled. Please contact support if you need assistance.'
          }
        }, { merge: true });
      }
      break;

    case 'https://schemas.openid.net/secevent/risc/event-type/account-enabled':
      // Re-enable the user's account if it was previously disabled
      const userDoc = await admin.firestore().collection('users').doc(uid).get();
      const userData = userDoc.data() || {};

      if (userData.securityAlert &&
          userData.securityAlert.type === 'account-disabled' &&
          userData.securityAlert.reason === 'hijacking') {
        // Only re-enable if it was disabled due to hijacking
        await admin.auth().updateUser(uid, { disabled: false });
        console.log(`Re-enabled user ${uid} after Google account was re-enabled`);

        // Update the security alert
        await admin.firestore().collection('users').doc(uid).set({
          securityAlert: {
            type: 'account-enabled',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            message: 'Your account has been re-enabled after your Google Account was restored.'
          }
        }, { merge: true });
      }
      break;

    case 'https://schemas.openid.net/secevent/risc/event-type/account-credential-change-required':
      // Add a flag in Firestore to prompt the user to change their password
      await admin.firestore().collection('users').doc(uid).set({
        securityAlert: {
          type: 'credential-change-required',
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          message: 'For security reasons, please update your password or review your account security.'
        }
      }, { merge: true });
      console.log(`Flagged user ${uid} to change credentials`);
      break;

    case 'https://schemas.openid.net/secevent/risc/event-type/verification':
      // This is just a test event, log it
      console.log(`Received verification event for user ${uid}, state: ${attributes?.state || 'none'}`);
      break;

    default:
      console.log(`Unhandled event type: ${eventType} for user ${uid}`);
  }
};

// The main function that receives security event tokens
exports.securityEventReceiver = functions.https.onRequest({region: 'us-central1'}, async (req, res) => {
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // Get the security event token from the request
  const token = req.body.token || req.body;
  if (!token) {
    console.error('No token provided in request');
    res.status(400).send('Bad Request: No token provided');
    return;
  }

  try {
    // Validate the token
    const decodedToken = await validateSecurityEventToken(
      typeof token === 'string' ? token : JSON.stringify(token)
    );

    // Process each event in the token
    const events = decodedToken.events || {};
    for (const [eventType, eventData] of Object.entries(events)) {
      const subject = eventData.subject || {};
      const attributes = eventData;
      delete attributes.subject; // Remove subject from attributes

      // Handle the security event
      await handleSecurityEvent(eventType, subject, attributes);
    }

    // Return success
    res.status(202).send('Accepted');
  } catch (error) {
    console.error(`Error processing security event token: ${error.message}`);
    res.status(400).send(`Bad Request: ${error.message}`);
  }
});

// Export a function to create a service account token for RISC API calls
exports.createRiscServiceAccountToken = functions.https.onCall({region: 'us-central1'}, async (data, context) => {
  // Only allow admin users to call this function
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admin users can create RISC service account tokens'
    );
  }

  try {
    // Get the service account key from environment variables
    // First try functions.config(), then fall back to process.env
    const config = functions.config() || {};
    const env = config.env || {};

    const clientEmail = env.google_risc_client_email || process.env.GOOGLE_RISC_CLIENT_EMAIL;
    const privateKeyId = env.google_risc_private_key_id || process.env.GOOGLE_RISC_PRIVATE_KEY_ID;
    const privateKey = env.google_risc_private_key || process.env.GOOGLE_RISC_PRIVATE_KEY;

    if (!clientEmail || !privateKeyId || !privateKey) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Missing RISC service account credentials in environment variables'
      );
    }

    // Create the JWT payload
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: clientEmail,
      sub: clientEmail,
      aud: 'https://risc.googleapis.com/google.identity.risc.v1beta.RiscManagementService',
      iat: now,
      exp: now + 3600 // 1 hour expiration
    };

    // Sign the JWT with the service account private key
    const token = jwt.sign(payload, privateKey.replace(/\\n/g, '\n'), {
      algorithm: 'RS256',
      keyid: privateKeyId
    });

    return { token };
  } catch (error) {
    console.error(`Error creating RISC service account token: ${error.message}`);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to create token: ${error.message}`
    );
  }
});

// Function to register the event receiver endpoint with Google
exports.registerRiscEndpoint = functions.https.onCall({region: 'us-central1'}, async (data, context) => {
  // Only allow admin users to call this function
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admin users can register RISC endpoints'
    );
  }

  try {
    // Get the service account key from environment variables
    // First try functions.config(), then fall back to process.env
    const config = functions.config() || {};
    const env = config.env || {};

    const clientEmail = env.google_risc_client_email || process.env.GOOGLE_RISC_CLIENT_EMAIL;
    const privateKeyId = env.google_risc_private_key_id || process.env.GOOGLE_RISC_PRIVATE_KEY_ID;
    const privateKey = env.google_risc_private_key || process.env.GOOGLE_RISC_PRIVATE_KEY;

    if (!clientEmail || !privateKeyId || !privateKey) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Missing RISC service account credentials in environment variables'
      );
    }

    // Create the JWT payload
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: clientEmail,
      sub: clientEmail,
      aud: 'https://risc.googleapis.com/google.identity.risc.v1beta.RiscManagementService',
      iat: now,
      exp: now + 3600 // 1 hour expiration
    };

    // Sign the JWT with the service account private key
    const token = jwt.sign(payload, privateKey.replace(/\\n/g, '\n'), {
      algorithm: 'RS256',
      keyid: privateKeyId
    });

    // Construct the endpoint URL
    const projectId = process.env.GCLOUD_PROJECT || 'ftfc-start';
    const region = 'us-central1'; // Change if your functions are in a different region
    const receiverEndpoint = `https://${region}-${projectId}.cloudfunctions.net/securityEventReceiver`;

    // Define the event types we want to receive
    const eventsRequested = [
      'https://schemas.openid.net/secevent/risc/event-type/sessions-revoked',
      'https://schemas.openid.net/secevent/oauth/event-type/tokens-revoked',
      'https://schemas.openid.net/secevent/oauth/event-type/token-revoked',
      'https://schemas.openid.net/secevent/risc/event-type/account-disabled',
      'https://schemas.openid.net/secevent/risc/event-type/account-enabled',
      'https://schemas.openid.net/secevent/risc/event-type/account-credential-change-required',
      'https://schemas.openid.net/secevent/risc/event-type/verification'
    ];

    // Register the endpoint with Google
    const response = await axios.post(
      'https://risc.googleapis.com/v1beta/stream:update',
      {
        delivery: {
          delivery_method: 'https://schemas.openid.net/secevent/risc/delivery-method/push',
          url: receiverEndpoint
        },
        events_requested: eventsRequested
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return {
      success: true,
      endpoint: receiverEndpoint,
      response: response.data
    };
  } catch (error) {
    console.error(`Error registering RISC endpoint: ${error.message}`);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to register endpoint: ${error.message}`
    );
  }
});

// Function to test the RISC event stream
exports.testRiscEventStream = functions.https.onCall({region: 'us-central1'}, async (data, context) => {
  // Only allow admin users to call this function
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admin users can test the RISC event stream'
    );
  }

  try {
    // Get the service account key from environment variables
    // First try functions.config(), then fall back to process.env
    const config = functions.config() || {};
    const env = config.env || {};

    const clientEmail = env.google_risc_client_email || process.env.GOOGLE_RISC_CLIENT_EMAIL;
    const privateKeyId = env.google_risc_private_key_id || process.env.GOOGLE_RISC_PRIVATE_KEY_ID;
    const privateKey = env.google_risc_private_key || process.env.GOOGLE_RISC_PRIVATE_KEY;

    if (!clientEmail || !privateKeyId || !privateKey) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Missing RISC service account credentials in environment variables'
      );
    }

    // Create the JWT payload
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: clientEmail,
      sub: clientEmail,
      aud: 'https://risc.googleapis.com/google.identity.risc.v1beta.RiscManagementService',
      iat: now,
      exp: now + 3600 // 1 hour expiration
    };

    // Sign the JWT with the service account private key
    const token = jwt.sign(payload, privateKey.replace(/\\n/g, '\n'), {
      algorithm: 'RS256',
      keyid: privateKeyId
    });

    // Send a verification request
    const state = `Test verification at ${new Date().toISOString()}`;
    const response = await axios.post(
      'https://risc.googleapis.com/v1beta/stream:verify',
      { state },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return {
      success: true,
      state,
      response: response.data
    };
  } catch (error) {
    console.error(`Error testing RISC event stream: ${error.message}`);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to test event stream: ${error.message}`
    );
  }
});
