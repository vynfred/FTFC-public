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
const calendlyWebhook = require('./src/calendlyWebhook');
const calendarTaskProcessor = require('./src/calendarTaskProcessor');

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

// Calendly Webhook Functions
exports.processCalendlyWebhook = onRequest((request, response) => {
  return calendlyWebhook.processCalendlyWebhook(request, response);
});

// Calendar Task Processor Functions
exports.processCalendarTasks = calendarTaskProcessor.processCalendarTasks;

// Google Meet Auto-Recording Configuration
exports.configureMeetRecording = onRequest((request, response) => {
  // Verify API key
  const apiKey = request.headers['x-api-key'];
  if (apiKey !== process.env.WEBHOOK_API_KEY) {
    return response.status(401).send('Unauthorized');
  }

  // Return success for now - this would be implemented with the Google Meet API
  return response.status(200).json({
    success: true,
    message: 'Auto-recording configured successfully',
    configId: request.body.configId
  });
});
