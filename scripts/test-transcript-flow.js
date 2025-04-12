/**
 * Test Script for Meeting Transcript Generation Flow
 * 
 * This script tests the entire flow of meeting transcript generation:
 * 1. Simulates a webhook from Google Meet
 * 2. Processes the recording
 * 3. Generates a transcript
 * 4. Stores the transcript in Firestore
 * 
 * Usage:
 * node test-transcript-flow.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Initialize Firebase Admin with service account
const serviceAccount = require('../service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get Firestore instance
const db = admin.firestore();

// Configuration
const config = {
  functionsUrl: 'http://localhost:5001/ftfc-start/us-central1', // Change to your project and region
  webhookApiKey: 'ftfc-meeting-webhook-key', // Should match the key in Firebase Functions config
  testMeetingId: 'test-meeting-' + Date.now(),
  testEntityType: 'client',
  testEntityId: 'test-client-id',
  testRecordingPath: path.join(__dirname, 'test-recording.mp3') // Path to a test audio file
};

/**
 * Create a test meeting in Firestore
 */
async function createTestMeeting() {
  console.log('Creating test meeting...');
  
  const meetingRef = await db.collection('meetings').add({
    id: config.testMeetingId,
    title: 'Test Meeting for Transcript Generation',
    date: new Date().toISOString(),
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    attendees: ['test@example.com', 'client@example.com'],
    entityType: config.testEntityType,
    entityId: config.testEntityId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  console.log(`Test meeting created with ID: ${meetingRef.id}`);
  return meetingRef;
}

/**
 * Create a test entity in Firestore
 */
async function createTestEntity() {
  console.log('Creating test entity...');
  
  const entityRef = await db.collection(`${config.testEntityType}s`).doc(config.testEntityId);
  const entityDoc = await entityRef.get();
  
  if (!entityDoc.exists) {
    await entityRef.set({
      id: config.testEntityId,
      name: 'Test Client',
      email: 'client@example.com',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      transcripts: []
    });
    console.log(`Test ${config.testEntityType} created with ID: ${config.testEntityId}`);
  } else {
    console.log(`Test ${config.testEntityType} already exists with ID: ${config.testEntityId}`);
  }
  
  return entityRef;
}

/**
 * Simulate a webhook from Google Meet
 */
async function simulateWebhook(meetingRef) {
  console.log('Simulating webhook from Google Meet...');
  
  try {
    // Call the processMeetRecording function
    const response = await axios({
      method: 'POST',
      url: `${config.functionsUrl}/processMeetRecording`,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.webhookApiKey
      },
      data: {
        meetingId: config.testMeetingId,
        conferenceId: 'test-conference-id',
        recordingUrl: 'https://example.com/test-recording.mp3' // This won't be used in our test
      }
    });
    
    console.log('Webhook simulation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error simulating webhook:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Upload a test recording to Firebase Storage
 */
async function uploadTestRecording() {
  console.log('Uploading test recording...');
  
  // Check if test recording exists
  if (!fs.existsSync(config.testRecordingPath)) {
    console.error(`Test recording not found at ${config.testRecordingPath}`);
    console.log('Please provide a test MP3 file for transcription testing.');
    return null;
  }
  
  // Upload to Firebase Storage
  const bucket = admin.storage().bucket();
  const destination = `test-recordings/${path.basename(config.testRecordingPath)}`;
  
  await bucket.upload(config.testRecordingPath, {
    destination: destination,
    metadata: {
      contentType: 'audio/mp3',
      metadata: {
        meetingId: config.testMeetingId,
        testFile: 'true'
      }
    }
  });
  
  const file = bucket.file(destination);
  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  });
  
  console.log(`Test recording uploaded to: ${url}`);
  return url;
}

/**
 * Create a test transcription job
 */
async function createTestTranscriptionJob(recordingUrl) {
  console.log('Creating test transcription job...');
  
  const jobRef = await db.collection('transcriptionJobs').add({
    meetingId: config.testMeetingId,
    conferenceId: 'test-conference-id',
    recordingUrl: recordingUrl,
    status: 'pending',
    attempts: 0,
    entityType: config.testEntityType,
    entityId: config.testEntityId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  console.log(`Test transcription job created with ID: ${jobRef.id}`);
  return jobRef;
}

/**
 * Manually process a transcription job
 */
async function processTranscriptionJob(jobRef) {
  console.log('Processing transcription job...');
  
  try {
    // Call the processTranscriptionQueue function
    const response = await axios({
      method: 'POST',
      url: `${config.functionsUrl}/processTranscriptionQueue`,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.webhookApiKey
      }
    });
    
    console.log('Transcription job processing response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error processing transcription job:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Check the results of the transcript generation
 */
async function checkResults() {
  console.log('Checking results...');
  
  // Check for transcripts
  const transcriptsQuery = await db.collection('transcripts')
    .where('meetingId', '==', config.testMeetingId)
    .get();
  
  if (transcriptsQuery.empty) {
    console.log('No transcripts found for the test meeting.');
    return false;
  }
  
  console.log(`Found ${transcriptsQuery.size} transcript(s) for the test meeting.`);
  
  // Print transcript details
  transcriptsQuery.forEach(doc => {
    const transcript = doc.data();
    console.log('Transcript ID:', doc.id);
    console.log('Title:', transcript.title);
    console.log('Date:', transcript.date);
    console.log('Source Type:', transcript.sourceType);
    console.log('Summary:', transcript.summary);
    console.log('Key Points:', transcript.keyPoints);
    console.log('Action Items:', transcript.actionItems.map(item => item.description));
    console.log('Transcript Length:', transcript.transcript?.length || 0, 'characters');
    console.log('---');
  });
  
  // Check if entity was updated with transcript reference
  const entityRef = db.collection(`${config.testEntityType}s`).doc(config.testEntityId);
  const entityDoc = await entityRef.get();
  
  if (entityDoc.exists) {
    const entityData = entityDoc.data();
    console.log(`Entity ${config.testEntityType} transcripts:`, entityData.transcripts || []);
  }
  
  return true;
}

/**
 * Clean up test data
 */
async function cleanUp() {
  console.log('Cleaning up test data...');
  
  // Delete test transcripts
  const transcriptsQuery = await db.collection('transcripts')
    .where('meetingId', '==', config.testMeetingId)
    .get();
  
  const deletePromises = [];
  transcriptsQuery.forEach(doc => {
    deletePromises.push(doc.ref.delete());
  });
  
  // Delete test transcription jobs
  const jobsQuery = await db.collection('transcriptionJobs')
    .where('meetingId', '==', config.testMeetingId)
    .get();
  
  jobsQuery.forEach(doc => {
    deletePromises.push(doc.ref.delete());
  });
  
  // Delete test meetings
  const meetingsQuery = await db.collection('meetings')
    .where('id', '==', config.testMeetingId)
    .get();
  
  meetingsQuery.forEach(doc => {
    deletePromises.push(doc.ref.delete());
  });
  
  // Delete test recording from storage
  try {
    const bucket = admin.storage().bucket();
    const file = bucket.file(`test-recordings/${path.basename(config.testRecordingPath)}`);
    await file.delete();
  } catch (error) {
    console.error('Error deleting test recording:', error);
  }
  
  await Promise.all(deletePromises);
  console.log('Test data cleaned up.');
}

/**
 * Run the test
 */
async function runTest() {
  try {
    // Create test entity and meeting
    await createTestEntity();
    const meetingRef = await createTestMeeting();
    
    // Upload test recording
    const recordingUrl = await uploadTestRecording();
    
    if (!recordingUrl) {
      console.log('Skipping test due to missing test recording.');
      return;
    }
    
    // Simulate webhook
    await simulateWebhook(meetingRef);
    
    // Create and process transcription job
    const jobRef = await createTestTranscriptionJob(recordingUrl);
    await processTranscriptionJob(jobRef);
    
    // Wait for processing to complete
    console.log('Waiting for transcript processing to complete...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check results
    const success = await checkResults();
    
    if (success) {
      console.log('Test completed successfully!');
    } else {
      console.log('Test completed with issues.');
    }
    
    // Clean up
    const shouldCleanUp = process.argv.includes('--cleanup');
    if (shouldCleanUp) {
      await cleanUp();
    } else {
      console.log('Skipping cleanup. Use --cleanup flag to clean up test data.');
    }
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Exit
    process.exit();
  }
}

// Run the test
runTest();
