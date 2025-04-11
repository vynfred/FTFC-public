const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Process Gemini notes
exports.processGeminiNotes = async (context) => {
  console.log("Processing Gemini notes");
  return null;
};

// Trigger Gemini notes processing
exports.triggerGeminiNotesProcessing = functions.https.onRequest(async (req, res) => {
  console.log("Manually triggered Gemini notes processing");
  return res.status(200).json({ message: "Processing started" });
});
