/**
 * Firebase Cloud Functions for FTFC Application
 */

const {onRequest} = require("firebase-functions/v2/https");
const {onCall} = require("firebase-functions/v2/https");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const meetingTranscripts = require('./src/meetingTranscripts');
const geminiNotesProcessor = require('./src/geminiNotesProcessor');
const googleDriveProxy = require('./src/googleDriveProxy');
const emailFunctions = require('./src/emailFunctions');

// Initialize Firebase Admin
admin.initializeApp();

// Meeting Transcript Functions
exports.processMeetRecording = onRequest((request, response) => {
  return meetingTranscripts.processMeetRecording(request, response);
});

exports.processTranscriptionQueue = onSchedule({
  schedule: "every 5 minutes",
  timeZone: "America/New_York"
}, (context) => {
  return meetingTranscripts.processTranscriptionQueue(context);
});

// Gemini Notes Processing Functions
exports.processGeminiNotes = onSchedule({
  schedule: "every 2 minutes",
  timeZone: "America/New_York"
}, (context) => {
  return geminiNotesProcessor.processGeminiNotes(context);
});

exports.triggerGeminiNotesProcessing = onRequest((request, response) => {
  return geminiNotesProcessor.triggerGeminiNotesProcessing(request, response);
});

// Google Drive Proxy Functions
exports.connectGoogleDrive = onCall((data, context) => {
  return googleDriveProxy.connectGoogleDrive(data, context);
});

exports.disconnectGoogleDrive = onCall((data, context) => {
  return googleDriveProxy.disconnectGoogleDrive(data, context);
});

exports.getGoogleDriveStatus = onCall((data, context) => {
  return googleDriveProxy.getGoogleDriveStatus(data, context);
});

// Email Functions - Only export the callable function for now

// Callable Email Function
exports.sendCustomEmail = emailFunctions.sendCustomEmail;
