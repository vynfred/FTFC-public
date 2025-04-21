/**
 * Meeting Transcript Processing Functions
 *
 * These functions handle the processing of meeting recordings and generation of transcripts.
 * - processMeetRecording: Processes webhooks from Google Meet when recordings are available
 * - processTranscriptionQueue: Background function to process transcription jobs
 */

const functions = require('firebase-functions/v2');
const admin = require('../src/admin');
const { google } = require('googleapis');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const speech = require('@google-cloud/speech');
const { Storage } = require('@google-cloud/storage');
const axios = require('axios');

// Get Firestore instance
const db = admin.firestore();

// Initialize Storage
const storage = new Storage();

// Initialize Speech-to-Text client
const speechClient = new speech.SpeechClient();

/**
 * Process a Google Meet recording webhook
 *
 * This function is triggered by a webhook from Google Meet when a recording is available.
 * It verifies the webhook, downloads the recording, and creates a transcription job.
 */
exports.processMeetRecording = functions.https.onRequest({region: 'us-central1'}, async (req, res) => {
  // Verify the request is from Google Meet
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== functions.config().google.webhook_key) {
    console.error('Unauthorized webhook request');
    return res.status(401).send('Unauthorized');
  }

  try {
    const { meetingId, conferenceId, recordingUrl } = req.body;

    if (!meetingId) {
      console.error('Missing meetingId in webhook payload');
      return res.status(400).send('Missing meetingId');
    }

    console.log(`Processing recording webhook for meeting: ${meetingId}`);

    // Look up the meeting in Firestore
    const meetingsRef = db.collection('meetings');
    const meetingQuery = await meetingsRef.where('id', '==', meetingId).get();

    if (meetingQuery.empty) {
      console.error(`Meeting not found: ${meetingId}`);
      return res.status(404).send('Meeting not found');
    }

    const meetingDoc = meetingQuery.docs[0];
    const meetingData = meetingDoc.data();

    // Create a transcription job
    const jobRef = await db.collection('transcriptionJobs').add({
      meetingId,
      conferenceId: conferenceId || meetingData.conferenceId,
      recordingUrl: recordingUrl || null,
      status: 'pending',
      attempts: 0,
      entityType: meetingData.entityType || null,
      entityId: meetingData.entityId || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`Created transcription job: ${jobRef.id}`);

    // Update the meeting with the transcription job ID
    await meetingDoc.ref.update({
      transcriptionJobId: jobRef.id,
      recordingReceived: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Return success
    return res.status(200).send({
      success: true,
      message: 'Recording webhook processed successfully',
      jobId: jobRef.id
    });
  } catch (error) {
    console.error('Error processing recording webhook:', error);
    return res.status(500).send('Internal server error');
  }
});

/**
 * Process transcription queue
 *
 * This function runs on a schedule to process pending transcription jobs.
 * It fetches recordings, generates transcripts, and stores them in Firestore.
 */
// This function is triggered by a Pub/Sub message
exports.processTranscriptionQueue = functions.pubsub.onMessagePublished({
  topic: 'process-transcription-queue',
  region: 'us-central1'
}, async (event) => {
  try {
    console.log('Processing transcription queue');

    // Get pending transcription jobs
    const jobsRef = db.collection('transcriptionJobs');
    const pendingJobs = await jobsRef
      .where('status', '==', 'pending')
      .where('attempts', '<', 3)
      .orderBy('attempts')
      .limit(5)
      .get();

    if (pendingJobs.empty) {
      console.log('No pending transcription jobs');
      return null;
    }

    console.log(`Found ${pendingJobs.size} pending transcription jobs`);

    // Process each job
    const jobPromises = pendingJobs.docs.map(async (jobDoc) => {
      const jobId = jobDoc.id;
      const jobData = jobDoc.data();

      console.log(`Processing job ${jobId} for meeting ${jobData.meetingId}`);

      try {
        // Update job status to processing
        await jobDoc.ref.update({
          status: 'processing',
          attempts: admin.firestore.FieldValue.increment(1),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Get the meeting data
        const meetingsRef = db.collection('meetings');
        const meetingQuery = await meetingsRef.where('id', '==', jobData.meetingId).get();

        if (meetingQuery.empty) {
          throw new Error(`Meeting not found: ${jobData.meetingId}`);
        }

        const meetingDoc = meetingQuery.docs[0];
        const meetingData = meetingDoc.data();

        // Get the recording URL
        let recordingUrl = jobData.recordingUrl;

        // If no recording URL was provided in the webhook, try to find it
        if (!recordingUrl) {
          recordingUrl = await getRecordingUrl(jobData.meetingId, jobData.conferenceId);
        }

        if (!recordingUrl) {
          throw new Error(`Recording URL not found for meeting: ${jobData.meetingId}`);
        }

        // Download the recording
        const audioFilePath = await downloadRecording(recordingUrl);

        // Generate transcript
        const transcriptData = await generateTranscript(audioFilePath, meetingData);

        // Save transcript to Firestore
        const transcriptRef = await saveTranscript(transcriptData, jobData.entityType, jobData.entityId);

        // Update job status to completed
        await jobDoc.ref.update({
          status: 'completed',
          transcriptId: transcriptRef.id,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Update meeting with transcript ID
        await meetingDoc.ref.update({
          transcriptId: transcriptRef.id,
          transcriptionCompleted: true,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`Successfully processed job ${jobId}`);
        return { success: true, jobId };
      } catch (error) {
        console.error(`Error processing job ${jobId}:`, error);

        // Update job status to error
        await jobDoc.ref.update({
          status: 'error',
          error: error.message,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return { success: false, jobId, error: error.message };
      }
    });

    // Wait for all jobs to complete
    const results = await Promise.all(jobPromises);
    console.log('Transcription queue processing completed:', results);

    return results;
  } catch (error) {
    console.error('Error processing transcription queue:', error);
    return null;
  }
});

/**
 * Get recording URL from Google Drive
 * @param {string} meetingId - Meeting ID
 * @param {string} conferenceId - Conference ID
 * @returns {Promise<string|null>} - Recording URL or null if not found
 */
async function getRecordingUrl(meetingId, conferenceId) {
  try {
    // Get team members with Google Drive access
    const usersRef = db.collection('users');
    const teamMembers = await usersRef
      .where('role', '==', 'team_member')
      .where('googleDriveEnabled', '==', true)
      .get();

    if (teamMembers.empty) {
      console.log('No team members with Google Drive access');
      return null;
    }

    // Try each team member's tokens to find the recording
    for (const userDoc of teamMembers.docs) {
      const userData = userDoc.data();
      const tokens = userData.tokens;

      if (!tokens) {
        continue;
      }

      try {
        // Set up Google Drive API client
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials(tokens);

        const drive = google.drive({ version: 'v3', auth: oauth2Client });

        // Search for recordings with the meeting ID or conference ID
        const searchQuery = `(name contains '${meetingId}' or name contains '${conferenceId}') and mimeType contains 'audio/' or mimeType contains 'video/'`;

        const response = await drive.files.list({
          q: searchQuery,
          fields: 'files(id, name, webViewLink, webContentLink)',
          orderBy: 'createdTime desc',
          pageSize: 10
        });

        const files = response.data.files || [];

        if (files.length > 0) {
          // Get the download URL for the first file
          const file = files[0];

          // Get the direct download link
          const downloadResponse = await drive.files.get({
            fileId: file.id,
            fields: 'webContentLink',
            alt: 'media'
          });

          return downloadResponse.data.webContentLink || file.webContentLink;
        }
      } catch (error) {
        console.error(`Error searching Drive for user ${userData.email}:`, error);
        // Continue to the next user
      }
    }

    console.log(`No recording found for meeting: ${meetingId}`);
    return null;
  } catch (error) {
    console.error('Error getting recording URL:', error);
    return null;
  }
}

/**
 * Download recording from URL
 * @param {string} url - Recording URL
 * @returns {Promise<string>} - Path to downloaded file
 */
async function downloadRecording(url) {
  try {
    // Create a temporary file
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `recording-${uuidv4()}.mp3`);

    // Download the file
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    });

    // Save the file
    const writer = fs.createWriteStream(tempFilePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(tempFilePath));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Error downloading recording:', error);
    throw error;
  }
}

/**
 * Generate transcript from audio file
 * @param {string} audioFilePath - Path to audio file
 * @param {Object} meetingData - Meeting data
 * @returns {Promise<Object>} - Transcript data
 */
async function generateTranscript(audioFilePath, meetingData) {
  try {
    // Read the audio file
    const audioBytes = fs.readFileSync(audioFilePath).toString('base64');

    // Configure the request
    const audio = {
      content: audioBytes
    };

    const config = {
      encoding: 'MP3',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
      enableAutomaticPunctuation: true,
      enableSpeakerDiarization: true,
      diarizationSpeakerCount: 2, // Adjust based on expected number of speakers
      model: 'video'
    };

    // Detect speech
    const [response] = await speechClient.recognize({
      audio,
      config
    });

    // Process the response
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    // Extract key points and action items using simple heuristics
    const keyPoints = extractKeyPoints(transcription);
    const actionItems = extractActionItems(transcription);
    const summary = generateSummary(transcription);

    // Clean up temp file
    fs.unlinkSync(audioFilePath);

    // Prepare transcript data
    return {
      meetingId: meetingData.id,
      title: meetingData.title,
      date: meetingData.date,
      participants: meetingData.attendees || [],
      transcript: transcription,
      summary: summary,
      keyPoints: keyPoints,
      actionItems: actionItems.map(item => ({
        description: item,
        assignee: null,
        dueDate: null
      })),
      sourceType: 'speech-to-text',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
  } catch (error) {
    console.error('Error generating transcript:', error);
    throw error;
  }
}

/**
 * Extract key points from transcript
 * @param {string} transcript - Transcript text
 * @returns {Array<string>} - Key points
 */
function extractKeyPoints(transcript) {
  const keyPoints = [];
  const lines = transcript.split('\n');

  // Look for phrases that might indicate key points
  const keyPointIndicators = [
    'key point',
    'important',
    'highlight',
    'main point',
    'takeaway',
    'to summarize',
    'in summary'
  ];

  for (const line of lines) {
    for (const indicator of keyPointIndicators) {
      if (line.toLowerCase().includes(indicator)) {
        keyPoints.push(line.trim());
        break;
      }
    }
  }

  return keyPoints;
}

/**
 * Extract action items from transcript
 * @param {string} transcript - Transcript text
 * @returns {Array<string>} - Action items
 */
function extractActionItems(transcript) {
  const actionItems = [];
  const lines = transcript.split('\n');

  // Look for phrases that might indicate action items
  const actionItemIndicators = [
    'action item',
    'to do',
    'follow up',
    'will take care of',
    'will handle',
    'needs to',
    'should',
    'must',
    'have to',
    'going to'
  ];

  for (const line of lines) {
    for (const indicator of actionItemIndicators) {
      if (line.toLowerCase().includes(indicator)) {
        actionItems.push(line.trim());
        break;
      }
    }
  }

  return actionItems;
}

/**
 * Generate a summary from transcript
 * @param {string} transcript - Transcript text
 * @returns {string} - Summary
 */
function generateSummary(transcript) {
  // Simple summary generation - take the first few sentences
  const sentences = transcript.split(/[.!?]+/);
  const summaryLength = Math.min(3, sentences.length);

  return sentences.slice(0, summaryLength).join('. ') + '.';
}

/**
 * Save transcript to Firestore
 * @param {Object} transcriptData - Transcript data
 * @param {string} entityType - Entity type (client, investor, partner)
 * @param {string} entityId - Entity ID
 * @returns {Promise<FirebaseFirestore.DocumentReference>} - Transcript document reference
 */
async function saveTranscript(transcriptData, entityType, entityId) {
  try {
    // Add transcript to transcripts collection
    const transcriptRef = await db.collection('transcripts').add({
      ...transcriptData,
      entityType,
      entityId
    });

    // Add transcript to entity's transcripts collection
    if (entityType && entityId) {
      const entityRef = db.collection(entityType + 's').doc(entityId);
      const entityDoc = await entityRef.get();

      if (entityDoc.exists) {
        // Update entity with transcript reference
        await entityRef.update({
          transcripts: admin.firestore.FieldValue.arrayUnion(transcriptRef.id),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }

    // Create activity log
    await db.collection('activity').add({
      type: 'transcript',
      action: 'created',
      transcriptId: transcriptRef.id,
      meetingId: transcriptData.meetingId,
      entityType,
      entityId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      description: `New transcript created for meeting: ${transcriptData.title}`
    });

    return transcriptRef;
  } catch (error) {
    console.error('Error saving transcript:', error);
    throw error;
  }
}
