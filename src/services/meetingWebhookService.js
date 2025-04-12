/**
 * Meeting Webhook Service
 *
 * This service handles the registration and management of Google Meet webhooks
 * for automatic recording and transcription.
 */

import {
    addDoc, collection, doc,
    getDoc,
    serverTimestamp, updateDoc
} from 'firebase/firestore';
import { db } from '../firebase-config';
import { getStoredTokens } from './googleIntegration';

/**
 * Register a webhook for a Google Meet event
 * @param {Object} meetingData - Meeting data including meetingId, title, date, etc.
 * @param {String} entityType - Type of entity (client, investor, partner)
 * @param {String} entityId - ID of the entity
 * @returns {Promise<Object>} - Webhook registration data
 */
export const registerMeetingWebhook = async (meetingData, entityType, entityId) => {
  try {
    const tokens = getStoredTokens();

    if (!tokens) {
      throw new Error('Not connected to Google Calendar');
    }

    // Create webhook data for Firestore
    const webhookData = {
      meetingId: meetingData.id,
      conferenceId: meetingData.conferenceData?.conferenceId,
      title: meetingData.summary,
      date: meetingData.start.dateTime,
      entityType,
      entityId,
      status: 'registered',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Save webhook registration to Firestore
    const webhookRef = await addDoc(collection(db, 'meetingWebhooks'), webhookData);

    // Register the webhook with Firebase Functions
    // This will create a Cloud Function trigger for this specific meeting
    try {
      // Get the Firebase Functions URL from environment variables
      const functionsRegion = process.env.REACT_APP_FUNCTIONS_REGION || 'us-central1';
      const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
      const webhookApiKey = process.env.REACT_APP_WEBHOOK_API_KEY;

      if (!projectId || !webhookApiKey) {
        throw new Error('Missing Firebase configuration');
      }

      // Construct the webhook URL
      const webhookUrl = `https://${functionsRegion}-${projectId}.cloudfunctions.net/processMeetRecording`;

      // Register the webhook with Google Meet API
      // In a production environment, this would be a direct API call to Google Meet API
      // For now, we'll simulate this by calling our own Firebase Function
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': webhookApiKey
        },
        body: JSON.stringify({
          action: 'register',
          meetingId: meetingData.id,
          conferenceId: meetingData.conferenceData?.conferenceId,
          webhookId: webhookRef.id,
          entityType,
          entityId
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to register webhook: ${response.statusText}`);
      }

      // Update webhook status based on response
      await updateDoc(doc(db, 'meetingWebhooks', webhookRef.id), {
        status: 'active',
        webhookUrl,
        updatedAt: serverTimestamp()
      });
    } catch (webhookError) {
      console.error('Error registering webhook with API:', webhookError);
      // Continue even if API registration fails - we'll rely on the Firestore trigger
    }

    // Update the meeting with webhook reference
    const meetingRef = doc(db, 'meetings', meetingData.id);
    const meetingDoc = await getDoc(meetingRef);

    if (meetingDoc.exists()) {
      await updateDoc(meetingRef, {
        webhookId: webhookRef.id,
        updatedAt: serverTimestamp()
      });
    } else {
      // Create meeting document if it doesn't exist
      await addDoc(collection(db, 'meetings'), {
        id: meetingData.id,
        title: meetingData.summary,
        date: meetingData.start.dateTime,
        attendees: meetingData.attendees?.map(a => a.email) || [],
        entityType,
        entityId,
        webhookId: webhookRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    return {
      id: webhookRef.id,
      ...webhookData
    };
  } catch (error) {
    console.error('Error registering meeting webhook:', error);
    throw error;
  }
};

/**
 * Configure automatic recording for a Google Meet event
 * @param {Object} meetingData - Meeting data including meetingId, title, date, etc.
 * @returns {Promise<Object>} - Recording configuration data
 */
export const configureAutoRecording = async (meetingData) => {
  try {
    const tokens = getStoredTokens();

    if (!tokens) {
      throw new Error('Not connected to Google Calendar');
    }

    // Create recording configuration for Firestore
    const recordingConfig = {
      meetingId: meetingData.id,
      conferenceId: meetingData.conferenceData?.conferenceId,
      autoRecord: true,
      autoTranscribe: true,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Save recording configuration to Firestore
    const configRef = await addDoc(collection(db, 'recordingConfigs'), recordingConfig);

    // Configure auto-recording with Firebase Functions
    try {
      // Get the Firebase Functions URL from environment variables
      const functionsRegion = process.env.REACT_APP_FUNCTIONS_REGION || 'us-central1';
      const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
      const webhookApiKey = process.env.REACT_APP_WEBHOOK_API_KEY;

      if (!projectId || !webhookApiKey) {
        throw new Error('Missing Firebase configuration');
      }

      // Construct the function URL
      const functionUrl = `https://${functionsRegion}-${projectId}.cloudfunctions.net/configureMeetRecording`;

      // Call the Firebase Function to configure auto-recording
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': webhookApiKey
        },
        body: JSON.stringify({
          meetingId: meetingData.id,
          conferenceId: meetingData.conferenceData?.conferenceId,
          configId: configRef.id,
          autoRecord: true,
          autoTranscribe: true,
          entityType,
          entityId
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to configure auto-recording: ${response.statusText}`);
      }

      // Update configuration status based on response
      const responseData = await response.json();

      await updateDoc(doc(db, 'recordingConfigs', configRef.id), {
        status: 'configured',
        configDetails: responseData,
        updatedAt: serverTimestamp()
      });

      // Also update the meeting document with recording configuration
      const meetingRef = doc(db, 'meetings', meetingData.id);
      const meetingDoc = await getDoc(meetingRef);

      if (meetingDoc.exists()) {
        await updateDoc(meetingRef, {
          recordingConfigId: configRef.id,
          autoRecordEnabled: true,
          updatedAt: serverTimestamp()
        });
      }

      return {
        id: configRef.id,
        ...recordingConfig,
        status: 'configured',
        configDetails: responseData
      };
    } catch (configError) {
      console.error('Error configuring auto-recording with API:', configError);

      // Update status to reflect the error
      await updateDoc(doc(db, 'recordingConfigs', configRef.id), {
        status: 'error',
        errorMessage: configError.message,
        updatedAt: serverTimestamp()
      });

      // Return the configuration with error status
      return {
        id: configRef.id,
        ...recordingConfig,
        status: 'error',
        errorMessage: configError.message
      };
    }
  } catch (error) {
    console.error('Error configuring auto recording:', error);
    throw error;
  }
};
