/**
 * Gemini Notes Monitor Service
 *
 * This service monitors team members' Google Drive folders for Gemini-generated meeting notes,
 * processes them, and associates them with the appropriate entities.
 */

import {
    addDoc, collection, doc,
    getDoc, getDocs, query, serverTimestamp, updateDoc, where
} from 'firebase/firestore';
import googleapis from 'googleapis';
import { db } from '../firebase-config';

const { google } = googleapis;

/**
 * Get yesterday's date in ISO format for Google Drive query
 * @returns {string} - Yesterday's date in ISO format
 */
const getYesterdayDate = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString();
};

/**
 * Gemini Notes Monitor class
 */
export class GeminiNotesMonitor {
  constructor() {
    this.drive = null;
    this.docs = null;
  }

  /**
   * Initialize Google API clients with user's tokens
   * @param {Object} tokens - Google OAuth tokens
   */
  initializeClients(tokens) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials(tokens);

    this.drive = google.drive({ version: 'v3', auth });
    this.docs = google.docs({ version: 'v1', auth });
  }

  /**
   * Scan for Gemini-generated notes in user's Drive
   * @param {Object} tokens - Google OAuth tokens
   * @returns {Promise<Array>} - List of Gemini notes
   */
  async scanForGeminiNotes(tokens) {
    this.initializeClients(tokens);

    try {
      // Search for Gemini-generated notes in the last 24 hours
      // Gemini notes typically have "Meeting notes" or "Meeting transcript" in the title
      const response = await this.drive.files.list({
        q: `(name contains 'Meeting notes' or name contains 'Meeting transcript') and mimeType='application/vnd.google-apps.document' and modifiedTime > '${getYesterdayDate()}'`,
        fields: 'files(id, name, createdTime, webViewLink)',
        spaces: 'drive'
      });

      return response.data.files || [];
    } catch (error) {
      console.error('Error scanning Drive for Gemini notes:', error);
      throw error;
    }
  }

  /**
   * Extract content from a Google Doc
   * @param {string} fileId - Google Doc ID
   * @returns {Promise<string>} - Document content
   */
  async extractDocContent(fileId) {
    try {
      const response = await this.docs.documents.get({
        documentId: fileId
      });

      // Extract text content from the document
      let content = '';
      const document = response.data;

      if (document.body && document.body.content) {
        document.body.content.forEach(element => {
          if (element.paragraph) {
            element.paragraph.elements.forEach(paraElement => {
              if (paraElement.textRun && paraElement.textRun.content) {
                content += paraElement.textRun.content;
              }
            });
          }
        });
      }

      return content;
    } catch (error) {
      console.error('Error extracting document content:', error);
      throw error;
    }
  }

  /**
   * Extract email addresses from document content
   * @param {string} content - Document content
   * @returns {Array<string>} - List of email addresses
   */
  extractEmailAddresses(content) {
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = content.match(emailPattern) || [];
    return [...new Set(emails)]; // Remove duplicates
  }

  /**
   * Determine entity type and ID from participants
   * @param {Array<string>} emails - List of participant email addresses
   * @returns {Promise<Object|null>} - Entity information or null if not found
   */
  async determineEntity(emails) {
    // Check if any of the emails belong to a client, investor, or partner
    const entityTypes = ['clients', 'investors', 'partners'];

    for (const entityType of entityTypes) {
      // First try to find a direct match in the entity collection
      const entityQuery = query(
        collection(db, entityType),
        where('email', 'in', emails)
      );

      let snapshot = await getDocs(entityQuery);

      // If no direct match, check the contacts collection
      if (snapshot.empty) {
        const contactsQuery = query(
          collection(db, 'contacts'),
          where('email', 'in', emails)
        );

        const contactsSnapshot = await getDocs(contactsQuery);

        if (!contactsSnapshot.empty) {
          // Found a contact, now check their associations
          for (const contactDoc of contactsSnapshot.docs) {
            const contact = contactDoc.data();

            // Check if this contact is associated with any entity
            if (entityType === 'clients' && contact.associations?.companies?.length > 0) {
              // Get the primary company for this contact
              const primaryCompany = contact.associations.companies.find(c => c.isPrimary);
              if (primaryCompany) {
                const companyDoc = await getDoc(doc(db, 'companies', primaryCompany.companyId));
                if (companyDoc.exists()) {
                  return {
                    type: 'client',
                    id: companyDoc.id,
                    data: companyDoc.data()
                  };
                }
              }
            } else if (entityType === 'investors' && contact.associations?.investmentFirms?.length > 0) {
              // Get the primary investment firm for this contact
              const primaryFirm = contact.associations.investmentFirms.find(f => f.isPrimary);
              if (primaryFirm) {
                const investorQuery = query(
                  collection(db, 'investors'),
                  where('contactId', '==', contactDoc.id)
                );

                const investorSnapshot = await getDocs(investorQuery);
                if (!investorSnapshot.empty) {
                  return {
                    type: 'investor',
                    id: investorSnapshot.docs[0].id,
                    data: investorSnapshot.docs[0].data()
                  };
                }
              }
            } else if (entityType === 'partners' && contact.associations?.partnerFirms?.length > 0) {
              // Get the primary partner firm for this contact
              const primaryFirm = contact.associations.partnerFirms.find(f => f.isPrimary);
              if (primaryFirm) {
                const partnerQuery = query(
                  collection(db, 'partners'),
                  where('contactId', '==', contactDoc.id)
                );

                const partnerSnapshot = await getDocs(partnerQuery);
                if (!partnerSnapshot.empty) {
                  return {
                    type: 'partner',
                    id: partnerSnapshot.docs[0].id,
                    data: partnerSnapshot.docs[0].data()
                  };
                }
              }
            }
          }
        }
      } else {
        // Found a direct match in the entity collection
        return {
          type: entityType.slice(0, -1), // Remove 's' to get singular form
          id: snapshot.docs[0].id,
          data: snapshot.docs[0].data()
        };
      }
    }

    return null;
  }

  /**
   * Process a Gemini note and associate it with the appropriate entity
   * @param {Object} note - Gemini note metadata
   * @param {Object} tokens - Google OAuth tokens
   * @returns {Promise<Object|null>} - Processing result or null if already processed
   */
  async processGeminiNote(note, tokens) {
    try {
      this.initializeClients(tokens);

      // Check if this note has already been processed
      const processedQuery = query(
        collection(db, 'processedNotes'),
        where('fileId', '==', note.id)
      );

      const processedSnapshot = await getDocs(processedQuery);
      if (!processedSnapshot.empty) {
        console.log(`Note ${note.id} has already been processed`);
        return null;
      }

      // Extract document content
      const content = await this.extractDocContent(note.id);

      // Extract email addresses
      const emails = this.extractEmailAddresses(content);

      if (emails.length === 0) {
        console.log(`No email addresses found in note ${note.id}`);
        return null;
      }

      // Determine entity
      const entity = await this.determineEntity(emails);

      if (!entity) {
        console.log(`No matching entity found for emails in note ${note.id}`);
        return null;
      }

      // Create transcript record
      const transcriptData = {
        title: note.name,
        date: new Date(note.createdTime),
        participants: emails,
        transcript: content,
        summary: "Generated from Gemini meeting notes",
        keyPoints: [],
        actionItems: [],
        entityType: entity.type,
        entityId: entity.id,
        sourceType: 'gemini',
        sourceId: note.id,
        sourceLink: note.webViewLink,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Save transcript to database
      const transcriptRef = await addDoc(collection(db, 'transcripts'), transcriptData);

      // Update entity with reference to transcript
      const entityRef = doc(db, `${entity.type}s`, entity.id);
      const entityDoc = await getDoc(entityRef);

      if (entityDoc.exists()) {
        const entityData = entityDoc.data();
        const transcripts = entityData.transcripts || [];

        await updateDoc(entityRef, {
          transcripts: [...transcripts, {
            id: transcriptRef.id,
            title: note.name,
            date: new Date(note.createdTime),
            sourceType: 'gemini',
            sourceId: note.id
          }],
          updatedAt: serverTimestamp()
        });
      }

      // Create activity log entry
      await addDoc(collection(db, 'activity'), {
        type: 'transcript',
        action: 'created',
        transcriptId: transcriptRef.id,
        entityType: entity.type,
        entityId: entity.id,
        title: note.name,
        timestamp: serverTimestamp(),
        description: `New meeting transcript added from Gemini: ${note.name}`
      });

      // Mark note as processed
      await addDoc(collection(db, 'processedNotes'), {
        fileId: note.id,
        processedAt: serverTimestamp(),
        entityType: entity.type,
        entityId: entity.id,
        transcriptId: transcriptRef.id
      });

      return {
        success: true,
        entity,
        transcriptId: transcriptRef.id
      };
    } catch (error) {
      console.error(`Error processing Gemini note ${note.id}:`, error);
      throw error;
    }
  }
}

export default new GeminiNotesMonitor();
