/**
 * Meeting Webhook Service
 * 
 * This service handles the registration and management of Google Meet webhooks
 * for automatic recording and transcription.
 */

import { db } from '../firebase-config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
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
    
    // In a real implementation, you would call the Google Meet API to register a webhook
    // For now, we'll create a placeholder webhook registration in Firestore
    
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
    
    // In a real implementation, you would call the Google Meet API to configure auto-recording
    // For now, we'll create a placeholder recording configuration
    
    const recordingConfig = {
      meetingId: meetingData.id,
      conferenceId: meetingData.conferenceData?.conferenceId,
      autoRecord: true,
      autoTranscribe: true,
      status: 'configured',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Save recording configuration to Firestore
    const configRef = await addDoc(collection(db, 'recordingConfigs'), recordingConfig);
    
    return {
      id: configRef.id,
      ...recordingConfig
    };
  } catch (error) {
    console.error('Error configuring auto recording:', error);
    throw error;
  }
};
