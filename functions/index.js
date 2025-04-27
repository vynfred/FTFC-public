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

// Import function modules
const googleApiFunctions = require("./googleApiFunctions");
const authFunctions = require("./authFunctions");
const googleOAuthFunctions = require("./googleOAuthFunctions");

// Simple test function to verify deployment
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase Functions!");
});

// Export Google API functions
exports.listDriveFiles = googleApiFunctions.listDriveFiles;
exports.getDriveFileMetadata = googleApiFunctions.getDriveFileMetadata;
exports.transcribeAudio = googleApiFunctions.transcribeAudio;
exports.createCalendarEvent = googleApiFunctions.createCalendarEvent;

// Export Auth functions
exports.refreshToken = authFunctions.refreshToken;
exports.logout = authFunctions.logout; // Replace the existing logout function

// Export Google OAuth functions
exports.getGoogleAuthUrl = googleOAuthFunctions.getGoogleAuthUrl;
exports.getTokensFromCode = googleOAuthFunctions.getTokensFromCode;
exports.connectGoogleDrive = googleOAuthFunctions.connectGoogleDrive;
exports.disconnectGoogleDrive = googleOAuthFunctions.disconnectGoogleDrive;
exports.getGoogleDriveStatus = googleOAuthFunctions.getGoogleDriveStatus;
