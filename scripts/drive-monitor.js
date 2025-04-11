/**
 * Google Drive Monitoring Script
 * 
 * This script monitors team members' Drive folders for new meeting recordings,
 * moves them to a shared folder, and triggers the transcript processing workflow.
 */

const { google } = require('googleapis');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Configuration
const TEAM_MEMBERS = [
  // Add team members' email addresses here
  // These should match the emails used for Google Meet recordings
];

const SHARED_FOLDER_ID = process.env.GOOGLE_DRIVE_SHARED_FOLDER_ID;

/**
 * Authenticate with Google Drive API using service account
 * @returns {google.auth.JWT} Authenticated client
 */
function getAuthClient() {
  return new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    ['https://www.googleapis.com/auth/drive']
  );
}

/**
 * Find meeting ID in filename or metadata
 * @param {Object} file - Google Drive file object
 * @returns {String|null} Meeting ID if found, null otherwise
 */
function extractMeetingId(file) {
  // Pattern for Google Meet IDs in filenames
  const meetPattern = /(?:meet_|meeting_|recording_)([\w-]{10,})/i;
  
  // Try to extract from filename
  const nameMatch = file.name.match(meetPattern);
  if (nameMatch && nameMatch[1]) {
    return nameMatch[1];
  }
  
  // If not in filename, could be in description or other metadata
  // This is a simplified approach - you may need to adjust based on actual file naming
  return null;
}

/**
 * Look up meeting details from meeting ID
 * @param {String} meetingId - Google Meet meeting ID
 * @returns {Promise<Object|null>} Meeting details if found, null otherwise
 */
async function lookupMeetingDetails(meetingId) {
  try {
    // Query Firestore for meeting with this ID
    const meetingsRef = db.collection('meetings');
    const query = meetingsRef.where('conferenceId', '==', meetingId);
    const snapshot = await query.get();
    
    if (snapshot.empty) {
      console.log(`No meeting found with ID: ${meetingId}`);
      return null;
    }
    
    // Return the first matching meeting
    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    };
  } catch (error) {
    console.error('Error looking up meeting details:', error);
    return null;
  }
}

/**
 * Move file to shared folder and update metadata
 * @param {Object} drive - Google Drive API client
 * @param {String} fileId - ID of the file to move
 * @param {Object} meetingDetails - Meeting details from database
 * @returns {Promise<Object>} Updated file
 */
async function moveFileToSharedFolder(drive, fileId, meetingDetails) {
  try {
    // Get current parents
    const file = await drive.files.get({
      fileId: fileId,
      fields: 'parents'
    });
    
    // Move file to shared folder
    const previousParents = file.data.parents.join(',');
    const updatedFile = await drive.files.update({
      fileId: fileId,
      addParents: SHARED_FOLDER_ID,
      removeParents: previousParents,
      fields: 'id, name, webViewLink',
      resource: {
        // Update file metadata with meeting details
        description: `Meeting: ${meetingDetails.title || 'Unknown'}\nDate: ${meetingDetails.date || 'Unknown'}\nEntity: ${meetingDetails.entityType || 'Unknown'}/${meetingDetails.entityId || 'Unknown'}`
      }
    });
    
    console.log(`Moved file ${updatedFile.data.name} to shared folder`);
    return updatedFile.data;
  } catch (error) {
    console.error('Error moving file to shared folder:', error);
    throw error;
  }
}

/**
 * Create a transcript job in Firestore
 * @param {Object} fileData - Google Drive file data
 * @param {Object} meetingDetails - Meeting details from database
 * @returns {Promise<String>} ID of created job
 */
async function createTranscriptJob(fileData, meetingDetails) {
  try {
    const jobData = {
      fileId: fileData.id,
      fileName: fileData.name,
      fileUrl: fileData.webViewLink,
      meetingId: meetingDetails.id,
      conferenceId: meetingDetails.conferenceId,
      entityType: meetingDetails.entityType,
      entityId: meetingDetails.entityId,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const jobRef = await db.collection('transcriptionJobs').add(jobData);
    console.log(`Created transcript job: ${jobRef.id}`);
    return jobRef.id;
  } catch (error) {
    console.error('Error creating transcript job:', error);
    throw error;
  }
}

/**
 * Process a single recording file
 * @param {Object} drive - Google Drive API client
 * @param {Object} file - Google Drive file object
 * @returns {Promise<boolean>} Success status
 */
async function processRecordingFile(drive, file) {
  try {
    // Extract meeting ID from filename or metadata
    const meetingId = extractMeetingId(file);
    if (!meetingId) {
      console.log(`Could not extract meeting ID from file: ${file.name}`);
      return false;
    }
    
    // Look up meeting details in database
    const meetingDetails = await lookupMeetingDetails(meetingId);
    if (!meetingDetails) {
      console.log(`No meeting details found for ID: ${meetingId}`);
      return false;
    }
    
    // Move file to shared folder
    const updatedFile = await moveFileToSharedFolder(drive, file.id, meetingDetails);
    
    // Create transcript job
    await createTranscriptJob(updatedFile, meetingDetails);
    
    return true;
  } catch (error) {
    console.error(`Error processing file ${file.name}:`, error);
    return false;
  }
}

/**
 * Check team member's Drive for new recordings
 * @param {Object} drive - Google Drive API client
 * @param {String} userEmail - Team member's email
 * @returns {Promise<number>} Number of files processed
 */
async function checkUserDriveForRecordings(drive, userEmail) {
  try {
    console.log(`Checking Drive for user: ${userEmail}`);
    
    // Query for video files created in the last day
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const response = await drive.files.list({
      q: `mimeType contains 'video/' and createdTime > '${yesterday.toISOString()}' and '${userEmail}' in owners`,
      fields: 'files(id, name, mimeType, createdTime, description)',
      spaces: 'drive'
    });
    
    const files = response.data.files;
    console.log(`Found ${files.length} recent video files for ${userEmail}`);
    
    let processedCount = 0;
    for (const file of files) {
      const success = await processRecordingFile(drive, file);
      if (success) {
        processedCount++;
      }
    }
    
    return processedCount;
  } catch (error) {
    console.error(`Error checking drive for ${userEmail}:`, error);
    return 0;
  }
}

/**
 * Main function to run the script
 */
async function main() {
  try {
    const auth = getAuthClient();
    const drive = google.drive({ version: 'v3', auth });
    
    let totalProcessed = 0;
    
    for (const userEmail of TEAM_MEMBERS) {
      const processed = await checkUserDriveForRecordings(drive, userEmail);
      totalProcessed += processed;
    }
    
    console.log(`Total files processed: ${totalProcessed}`);
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

// Run the script
main();
