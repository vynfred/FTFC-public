/**
 * Secure Google Integration Service
 *
 * This service handles integration with Google APIs using Firebase v9+ authentication
 * and server-side token management for enhanced security.
 */

import { getFunctions, httpsCallable } from 'firebase/functions';
import { getValidAccessToken } from './tokenService';
import { GOOGLE_SCOPES } from '../utils/constants';

// Initialize Firebase Functions
const functions = getFunctions();

/**
 * Create a Google Calendar event with Google Meet
 * @param {Object} eventDetails - Event details (title, description, start, end, attendees)
 * @returns {Promise<Object>} - Created event
 */
export const createMeetEvent = async (eventDetails) => {
  try {
    // Call Firebase function to create event
    const createEventFunction = httpsCallable(functions, 'createCalendarEvent');
    
    const result = await createEventFunction({
      title: eventDetails.title,
      description: eventDetails.description || 'Meeting scheduled via FTFC platform',
      startDateTime: eventDetails.start,
      endDateTime: eventDetails.end,
      attendees: eventDetails.attendees,
      sendNotifications: true,
      addConferenceData: true,
      entityType: eventDetails.entityType || null,
      entityId: eventDetails.entityId || null,
      entityName: eventDetails.entityName || null
    });
    
    return result.data;
  } catch (error) {
    console.error('Error creating Meet event:', error);
    throw error;
  }
};

/**
 * List upcoming calendar events
 * @param {Object} options - Options for listing events
 * @param {Number} options.maxResults - Maximum number of events to return
 * @param {Boolean} options.includePast - Whether to include past events
 * @param {Boolean} options.companyWide - Whether to include all company events or just user's events
 * @param {String} options.entityType - Optional entity type filter (client, investor, partner)
 * @param {String} options.entityId - Optional entity ID filter
 * @param {Boolean} options.meetOnly - Whether to only include Google Meet events
 * @returns {Promise<Array>} - List of upcoming events
 */
export const listUpcomingEvents = async (options = {}) => {
  try {
    // Call Firebase function to list events
    const listEventsFunction = httpsCallable(functions, 'listCalendarEvents');
    
    const result = await listEventsFunction({
      maxResults: options.maxResults || 10,
      includePast: options.includePast || false,
      companyWide: options.companyWide || true,
      entityType: options.entityType || null,
      entityId: options.entityId || null,
      meetOnly: options.meetOnly || false
    });
    
    return result.data;
  } catch (error) {
    console.error('Error listing events:', error);
    throw error;
  }
};

/**
 * Get meeting transcripts from Google Drive (Gemini Notes)
 * @param {String} meetingId - Google Meet meeting ID or meeting title
 * @returns {Promise<Array>} - List of transcript documents with metadata
 */
export const getMeetingTranscripts = async (meetingId) => {
  try {
    // Call Firebase function to get transcripts
    const getTranscriptsFunction = httpsCallable(functions, 'getMeetingTranscripts');
    
    const result = await getTranscriptsFunction({
      meetingId
    });
    
    return result.data;
  } catch (error) {
    console.error('Error getting meeting transcripts:', error);
    return []; // Return empty array instead of throwing to prevent cascading errors
  }
};

/**
 * List calendar events for a specific date range
 * @param {Date|string} startDate - Start date for the range
 * @param {Date|string} endDate - End date for the range
 * @param {Boolean} companyWide - Whether to include all company events or just user's events
 * @returns {Promise<Array>} - List of events in the date range
 */
export const listCalendarEvents = async (startDate, endDate, companyWide = true) => {
  try {
    // Convert dates to ISO strings if they're Date objects
    const timeMin = typeof startDate === 'string' ? startDate : startDate.toISOString();
    const timeMax = typeof endDate === 'string' ? endDate : endDate.toISOString();
    
    // Call Firebase function to list events
    const listEventsFunction = httpsCallable(functions, 'listCalendarEvents');
    
    const result = await listEventsFunction({
      timeMin,
      timeMax,
      companyWide
    });
    
    return result.data;
  } catch (error) {
    console.error('Error listing calendar events:', error);
    throw error;
  }
};

/**
 * Check if user has connected their Google account
 * @returns {Promise<Boolean>} - Whether the user has connected their Google account
 */
export const isGoogleConnected = async () => {
  try {
    // Call Firebase function to check connection status
    const checkConnectionFunction = httpsCallable(functions, 'checkGoogleConnection');
    
    const result = await checkConnectionFunction();
    return result.data.connected;
  } catch (error) {
    console.error('Error checking Google connection:', error);
    return false;
  }
};

/**
 * Disconnect Google account
 * @returns {Promise<Boolean>} - Whether the disconnection was successful
 */
export const disconnectGoogle = async () => {
  try {
    // Call Firebase function to disconnect Google
    const disconnectFunction = httpsCallable(functions, 'disconnectGoogle');
    
    const result = await disconnectFunction();
    return result.data.success;
  } catch (error) {
    console.error('Error disconnecting Google:', error);
    throw error;
  }
};
