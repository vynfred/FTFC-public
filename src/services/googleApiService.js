/**
 * Google API Service
 * 
 * This service provides a secure interface to Google APIs by using Firebase Functions
 * instead of direct API calls with client-side API keys.
 */

import { getFunctions, httpsCallable } from 'firebase/functions';

// Initialize Firebase Functions
const functions = getFunctions();

/**
 * List files from a Google Drive folder
 * @param {string} folderId - The ID of the folder to list files from
 * @param {number} pageSize - The number of files to return (default: 100)
 * @param {string} pageToken - The page token for pagination
 * @returns {Promise<Object>} - The list of files and next page token
 */
export const listDriveFiles = async (folderId, pageSize = 100, pageToken = null) => {
  try {
    const listFiles = httpsCallable(functions, 'listDriveFiles');
    const result = await listFiles({ folderId, pageSize, pageToken });
    return result.data;
  } catch (error) {
    console.error('Error listing Drive files:', error);
    throw error;
  }
};

/**
 * Get metadata for a Google Drive file
 * @param {string} fileId - The ID of the file to get metadata for
 * @returns {Promise<Object>} - The file metadata
 */
export const getDriveFileMetadata = async (fileId) => {
  try {
    const getFileMetadata = httpsCallable(functions, 'getDriveFileMetadata');
    const result = await getFileMetadata({ fileId });
    return result.data;
  } catch (error) {
    console.error('Error getting Drive file metadata:', error);
    throw error;
  }
};

/**
 * Transcribe an audio file from Google Drive
 * @param {string} fileId - The ID of the audio file to transcribe
 * @param {string} languageCode - The language code (default: en-US)
 * @returns {Promise<Object>} - The transcription result
 */
export const transcribeAudio = async (fileId, languageCode = 'en-US') => {
  try {
    const transcribe = httpsCallable(functions, 'transcribeAudio');
    const result = await transcribe({ fileId, languageCode });
    return result.data;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};

/**
 * Create a Google Calendar event
 * @param {Object} eventData - The event data
 * @param {string} eventData.summary - The event summary/title
 * @param {string} eventData.description - The event description
 * @param {string} eventData.location - The event location
 * @param {string} eventData.startDateTime - The start date and time (ISO format)
 * @param {string} eventData.endDateTime - The end date and time (ISO format)
 * @param {Array<string>} eventData.attendees - The list of attendee email addresses
 * @param {boolean} eventData.sendNotifications - Whether to send notifications to attendees
 * @returns {Promise<Object>} - The created event data
 */
export const createCalendarEvent = async (eventData) => {
  try {
    const createEvent = httpsCallable(functions, 'createCalendarEvent');
    const result = await createEvent(eventData);
    return result.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};
