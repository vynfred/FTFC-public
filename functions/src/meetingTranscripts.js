const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Process a meeting recording
exports.processMeetRecording = functions.https.onRequest(async (req, res) => {
  return res.status(200).send("Processing queued");
});

// Process transcription queue
exports.processTranscriptionQueue = async (context) => {
  console.log("Processing transcription queue");
  return null;
};
