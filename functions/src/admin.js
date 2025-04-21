/**
 * Firebase Admin Initialization
 * 
 * This module initializes Firebase Admin and exports it for use in other modules.
 * It ensures that Firebase Admin is only initialized once.
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
  console.log('Firebase Admin initialized');
}

module.exports = admin;
