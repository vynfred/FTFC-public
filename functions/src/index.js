/**
 * Firebase Cloud Functions for FTFC Application
 * 
 * This file exports all the Cloud Functions for the application.
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// Import function modules
const authFunctions = require('./auth');
const calendarFunctions = require('./calendar');

// Simple test function to verify deployment
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase Functions v2!");
});

// Export Auth functions
exports.storeGoogleTokens = authFunctions.storeGoogleTokens;
exports.getGoogleAccessToken = authFunctions.getGoogleAccessToken;
exports.revokeGoogleTokens = authFunctions.revokeGoogleTokens;

// Export Calendar functions
exports.createCalendarEvent = calendarFunctions.createCalendarEvent;
exports.listCalendarEvents = calendarFunctions.listCalendarEvents;
exports.getMeetingTranscripts = calendarFunctions.getMeetingTranscripts;
exports.checkGoogleConnection = calendarFunctions.checkGoogleConnection;
exports.disconnectGoogle = calendarFunctions.disconnectGoogle;
