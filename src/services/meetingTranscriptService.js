/**
 * Meeting Transcript Service
 *
 * This service handles the processing and storage of meeting transcripts:
 * - Retrieves recordings and transcripts from Google Meet
 * - Processes and stores transcripts in the database
 * - Associates transcripts with clients/investors/partners
 */

import {
    addDoc, collection, doc,
    getDoc,
    getDocs,
    query, serverTimestamp, updateDoc, where, orderBy
} from 'firebase/firestore';
import { db } from '../firebase-config';
import { getMeetingTranscripts, getStoredTokens } from './googleIntegration';

/**
 * Process a meeting transcript from Gemini Notes
 * @param {Object} meetingData - Meeting data including meetingId, title, date, etc.
 * @param {Object} tokens - Google OAuth tokens (optional, will use stored tokens if not provided)
 * @returns {Promise<Object>} - Processed transcript data
 */
export const processMeetingTranscript = async (meetingData, tokens = null) => {
  // Use provided tokens or get stored tokens
  const authTokens = tokens || getStoredTokens();
  try {
    // Get transcripts for the meeting
    const transcripts = await getMeetingTranscripts(authTokens, meetingData.meetingId);

    if (!transcripts || transcripts.length === 0) {
      console.log('No transcripts found for meeting:', meetingData.meetingId);
      return null;
    }

    // Use the first transcript (most recent)
    const transcript = transcripts[0];

    // Extract data from the Gemini Notes transcript
    const transcriptData = {
      meetingId: meetingData.meetingId,
      title: transcript.name || meetingData.title,
      date: meetingData.date || new Date(transcript.createdTime),
      participants: transcript.participants || meetingData.attendees || [],
      transcriptUrl: transcript.webViewLink,
      transcript: transcript.textContent || '',
      summary: transcript.summary || '',
      keyPoints: transcript.keyPoints || [],
      actionItems: transcript.actionItems?.map(item => ({
        description: item,
        assignee: null,
        dueDate: null
      })) || [],
      sourceType: 'gemini',
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
    // Query transcripts for this entity with ordering by date (newest first)
    const q = query(
      collection(db, 'transcripts'),
      where('entityType', '==', entityType),
      where('entityId', '==', entityId),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const transcripts = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      transcripts.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamps to JavaScript Date objects
        date: data.date?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      });
    });

    return transcripts;
  } catch (error) {
    console.error('Error getting transcripts:', error);
    return []; // Return empty array instead of throwing
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

    const data = transcriptDoc.data();
    return {
      id: transcriptDoc.id,
      ...data,
      // Convert Firestore timestamps to JavaScript Date objects
      date: data.date?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    };
  } catch (error) {
    console.error('Error getting transcript:', error);
    return null; // Return null instead of throwing
  }
};

/**
 * Process Gemini Notes transcripts for a specific entity
 * @param {String} entityType - Type of entity (client, investor, partner)
 * @param {String} entityId - ID of the entity
 * @param {Object} tokens - Google OAuth tokens (optional, will use stored tokens if not provided)
 * @returns {Promise<Array>} - Array of processed transcripts
 */
export const processGeminiNotesForEntity = async (entityType, entityId, tokens = null) => {
  // Use provided tokens or get stored tokens
  const authTokens = tokens || getStoredTokens();
  try {
    // Get all Gemini Notes transcripts (without specific meeting ID)
    const transcripts = await getMeetingTranscripts(authTokens);

    if (!transcripts || transcripts.length === 0) {
      console.log('No Gemini Notes transcripts found');
      return [];
    }

    // Filter transcripts that might be related to this entity
    // We'll check for entity ID or name in the transcript content
    const entityTranscripts = transcripts.filter(transcript => {
      // Check if this entity's ID or emails are mentioned in the transcript
      const textContent = transcript.textContent?.toLowerCase() || '';
      const participants = transcript.participants || [];

      // If we have entity ID, check if it's mentioned in the transcript
      if (entityId && textContent.includes(entityId.toLowerCase())) {
        return true;
      }

      // If we have entity emails, check if any are in the participants
      if (participants.length > 0) {
        // Get entity emails from database
        return getEntityEmails(entityType, entityId).then(entityEmails => {
          // Check if any entity emails are in the participants
          return participants.some(participant =>
            entityEmails.includes(participant.toLowerCase())
          );
        });
      }

      return false;
    });

    // Process each transcript and save to database
    const savedTranscripts = [];

    for (const transcript of entityTranscripts) {
      // Create transcript data
      const transcriptData = {
        meetingId: extractMeetingIdFromTitle(transcript.name) || 'unknown',
        title: transcript.name || 'Gemini Notes Transcript',
        date: new Date(transcript.createdTime),
        participants: transcript.participants || [],
        transcriptUrl: transcript.webViewLink,
        transcript: transcript.textContent || '',
        summary: transcript.summary || '',
        keyPoints: transcript.keyPoints || [],
        actionItems: transcript.actionItems?.map(item => ({
          description: item,
          assignee: null,
          dueDate: null
        })) || [],
        sourceType: 'gemini',
        entityType,
        entityId
      };

      // Save transcript to database
      const savedTranscript = await saveTranscript(transcriptData, entityType, entityId);
      savedTranscripts.push(savedTranscript);
    }

    return savedTranscripts;
  } catch (error) {
    console.error('Error processing Gemini Notes for entity:', error);
    return [];
  }
};

/**
 * Extract meeting ID from transcript title
 * @param {String} title - Transcript title
 * @returns {String|null} - Meeting ID if found, null otherwise
 */
const extractMeetingIdFromTitle = (title) => {
  if (!title) return null;

  // Pattern for Google Meet IDs in titles
  const meetPattern = /(?:meet_|meeting_|recording_)([-a-z0-9]{10,})/i;

  // Try to extract from title
  const match = title.match(meetPattern);
  if (match && match[1]) {
    return match[1];
  }

  return null;
};

/**
 * Get entity emails
 * @param {String} entityType - Type of entity
 * @param {String} entityId - ID of the entity
 * @returns {Promise<Array>} - Array of email addresses
 */
const getEntityEmails = async (entityType, entityId) => {
  try {
    // Get the entity document
    const entityRef = doc(db, entityType + 's', entityId);
    const entityDoc = await getDoc(entityRef);

    if (!entityDoc.exists()) {
      return [];
    }

    const entityData = entityDoc.data();
    const emails = [];

    // Add the entity's primary email if it exists
    if (entityData.email) {
      emails.push(entityData.email.toLowerCase());
    }

    // Add emails from contacts if they exist
    if (entityData.contacts && Array.isArray(entityData.contacts)) {
      for (const contactRef of entityData.contacts) {
        try {
          // If it's a reference, get the contact document
          if (contactRef.id) {
            const contactDoc = await getDoc(doc(db, 'contacts', contactRef.id));
            if (contactDoc.exists() && contactDoc.data().email) {
              emails.push(contactDoc.data().email.toLowerCase());
            }
          }
          // If it's an embedded contact object
          else if (contactRef.email) {
            emails.push(contactRef.email.toLowerCase());
          }
        } catch (contactError) {
          console.error('Error getting contact:', contactError);
        }
      }
    }

    return [...new Set(emails)]; // Remove duplicates
  } catch (error) {
    console.error('Error getting entity emails:', error);
    return [];
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
    // Remove any undefined or null values from updates
    Object.keys(updates).forEach(key => {
      if (updates[key] === undefined || updates[key] === null) {
        delete updates[key];
      }
    });
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
