/**
 * Meeting Transcript Service
 * 
 * This service handles the processing and storage of meeting transcripts:
 * - Retrieves recordings and transcripts from Google Meet
 * - Processes and stores transcripts in the database
 * - Associates transcripts with clients/investors/partners
 */

import { db } from '../firebase-config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { getMeetingRecordings } from './googleIntegration';

/**
 * Process a meeting recording and extract transcript
 * @param {Object} meetingData - Meeting data including meetingId, title, date, etc.
 * @param {Object} tokens - Google OAuth tokens
 * @returns {Promise<Object>} - Processed transcript data
 */
export const processMeetingRecording = async (meetingData, tokens) => {
  try {
    // Get recordings for the meeting
    const recordings = await getMeetingRecordings(tokens, meetingData.meetingId);
    
    if (!recordings || recordings.length === 0) {
      console.log('No recordings found for meeting:', meetingData.meetingId);
      return null;
    }
    
    // In a real implementation, you would:
    // 1. Download the recording
    // 2. Use a transcription service (like Google Speech-to-Text) to transcribe the recording
    // 3. Process and format the transcript
    
    // For now, we'll create a placeholder transcript
    const transcriptData = {
      meetingId: meetingData.meetingId,
      title: meetingData.title,
      date: meetingData.date,
      participants: meetingData.attendees || [],
      recordingUrls: recordings.map(rec => rec.webViewLink),
      transcript: "This is a placeholder transcript. In a real implementation, this would be the actual transcript from the meeting recording.",
      summary: "This is a placeholder summary. In a real implementation, this would be an AI-generated summary of the meeting.",
      keyPoints: [
        "Key point 1",
        "Key point 2",
        "Key point 3"
      ],
      actionItems: [
        {
          description: "Action item 1",
          assignee: meetingData.attendees ? meetingData.attendees[0] : null,
          dueDate: null
        }
      ],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    return transcriptData;
  } catch (error) {
    console.error('Error processing meeting recording:', error);
    throw error;
  }
};

/**
 * Save transcript to database and associate with entity
 * @param {Object} transcriptData - Transcript data
 * @param {String} entityType - Type of entity (client, investor, partner)
 * @param {String} entityId - ID of the entity
 * @returns {Promise<String>} - ID of the saved transcript
 */
export const saveTranscript = async (transcriptData, entityType, entityId) => {
  try {
    // Add transcript to transcripts collection
    const transcriptRef = await addDoc(collection(db, 'transcripts'), {
      ...transcriptData,
      entityType,
      entityId
    });
    
    // Update the entity with reference to the transcript
    const entityRef = doc(db, entityType + 's', entityId);
    const entityDoc = await getDoc(entityRef);
    
    if (entityDoc.exists()) {
      const entityData = entityDoc.data();
      const transcripts = entityData.transcripts || [];
      
      await updateDoc(entityRef, {
        transcripts: [...transcripts, {
          id: transcriptRef.id,
          title: transcriptData.title,
          date: transcriptData.date,
          meetingId: transcriptData.meetingId
        }],
        updatedAt: serverTimestamp()
      });
    }
    
    // Create activity log entry
    await addDoc(collection(db, 'activity'), {
      type: 'transcript',
      action: 'created',
      transcriptId: transcriptRef.id,
      entityType,
      entityId,
      title: transcriptData.title,
      timestamp: serverTimestamp(),
      description: `New meeting transcript added: ${transcriptData.title}`
    });
    
    return transcriptRef.id;
  } catch (error) {
    console.error('Error saving transcript:', error);
    throw error;
  }
};

/**
 * Get transcripts for an entity
 * @param {String} entityType - Type of entity (client, investor, partner)
 * @param {String} entityId - ID of the entity
 * @returns {Promise<Array>} - Array of transcripts
 */
export const getTranscriptsForEntity = async (entityType, entityId) => {
  try {
    const q = query(
      collection(db, 'transcripts'),
      where('entityType', '==', entityType),
      where('entityId', '==', entityId)
    );
    
    const querySnapshot = await getDocs(q);
    const transcripts = [];
    
    querySnapshot.forEach((doc) => {
      transcripts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return transcripts;
  } catch (error) {
    console.error('Error getting transcripts:', error);
    throw error;
  }
};

/**
 * Get a single transcript by ID
 * @param {String} transcriptId - ID of the transcript
 * @returns {Promise<Object>} - Transcript data
 */
export const getTranscriptById = async (transcriptId) => {
  try {
    const transcriptDoc = await getDoc(doc(db, 'transcripts', transcriptId));
    
    if (!transcriptDoc.exists()) {
      throw new Error('Transcript not found');
    }
    
    return {
      id: transcriptDoc.id,
      ...transcriptDoc.data()
    };
  } catch (error) {
    console.error('Error getting transcript:', error);
    throw error;
  }
};

/**
 * Update a transcript
 * @param {String} transcriptId - ID of the transcript
 * @param {Object} updates - Updates to apply to the transcript
 * @returns {Promise<void>}
 */
export const updateTranscript = async (transcriptId, updates) => {
  try {
    const transcriptRef = doc(db, 'transcripts', transcriptId);
    
    await updateDoc(transcriptRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating transcript:', error);
    throw error;
  }
};
