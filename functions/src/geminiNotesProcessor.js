const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');

// Get configuration from environment variables
const config = functions.config();

// Initialize Google API credentials
const googleCredentials = {
  projectId: config.google.project_id,
  clientEmail: config.google.client_email,
  privateKey: config.google.private_key.replace(/\\n/g, '\n')
};

const db = admin.firestore();

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
 * Gemini Notes Processor class
 */
class GeminiNotesProcessor {
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
      const entityQuery = db.collection(entityType)
        .where('email', 'in', emails);

      let snapshot = await entityQuery.get();

      // If no direct match, check the contacts collection
      if (snapshot.empty) {
        const contactsQuery = db.collection('contacts')
          .where('email', 'in', emails);

        const contactsSnapshot = await contactsQuery.get();

        if (!contactsSnapshot.empty) {
          // Found a contact, now check their associations
          for (const contactDoc of contactsSnapshot.docs) {
            const contact = contactDoc.data();

            // Check if this contact is associated with any entity
            if (entityType === 'clients' && contact.associations?.companies?.length > 0) {
              // Get the primary company for this contact
              const primaryCompany = contact.associations.companies.find(c => c.isPrimary);
              if (primaryCompany) {
                const companyDoc = await db.collection('companies').doc(primaryCompany.companyId).get();
                if (companyDoc.exists) {
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
                const investorQuery = db.collection('investors')
                  .where('contactId', '==', contactDoc.id);

                const investorSnapshot = await investorQuery.get();
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
                const partnerQuery = db.collection('partners')
                  .where('contactId', '==', contactDoc.id);

                const partnerSnapshot = await partnerQuery.get();
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
}

/**
 * Cloud Function that runs periodically to process Gemini notes
 */
exports.processGeminiNotes = async (context) => {
  // Get all team members with Google Drive access
  const usersSnapshot = await db.collection('users')
    .where('role', '==', 'team_member')
    .where('googleDriveEnabled', '==', true)
    .get();

  if (usersSnapshot.empty) {
    console.log('No team members with Google Drive access found');
    return null;
  }

  const processor = new GeminiNotesProcessor();
  let processedCount = 0;

  for (const userDoc of usersSnapshot.docs) {
    const userData = userDoc.data();
    
    if (!userData.tokens) {
      console.log(`User ${userData.email} has no Google tokens`);
      continue;
    }
    
    try {
      // Scan for new Gemini notes
      const notes = await processor.scanForGeminiNotes(userData.tokens);
      
      if (notes.length === 0) {
        console.log(`No new Gemini notes found for user ${userData.email}`);
        continue;
      }
      
      console.log(`Found ${notes.length} Gemini notes for user ${userData.email}`);
      
      // Process each note
      for (const note of notes) {
        // Check if this note has already been processed
        const processedQuery = db.collection('processedNotes')
          .where('fileId', '==', note.id);
        
        const processedSnapshot = await processedQuery.get();
        if (!processedSnapshot.empty) {
          console.log(`Note ${note.id} has already been processed`);
          continue;
        }
        
        // Extract document content
        const content = await processor.extractDocContent(note.id);
        
        // Extract email addresses
        const emails = processor.extractEmailAddresses(content);
        
        if (emails.length === 0) {
          console.log(`No email addresses found in note ${note.id}`);
          continue;
        }
        
        // Determine entity
        const entity = await processor.determineEntity(emails);
        
        if (!entity) {
          console.log(`No matching entity found for emails in note ${note.id}`);
          continue;
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
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        
        // Save transcript to database
        const transcriptRef = await db.collection('transcripts').add(transcriptData);
        
        // Update entity with reference to transcript
        const entityRef = db.collection(`${entity.type}s`).doc(entity.id);
        const entityDoc = await entityRef.get();
        
        if (entityDoc.exists) {
          const entityData = entityDoc.data();
          const transcripts = entityData.transcripts || [];
          
          await entityRef.update({
            transcripts: [...transcripts, {
              id: transcriptRef.id,
              title: note.name,
              date: new Date(note.createdTime),
              sourceType: 'gemini',
              sourceId: note.id
            }],
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }
        
        // Create activity log entry
        await db.collection('activity').add({
          type: 'transcript',
          action: 'created',
          transcriptId: transcriptRef.id,
          entityType: entity.type,
          entityId: entity.id,
          title: note.name,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          description: `New meeting transcript added from Gemini: ${note.name}`
        });
        
        // Mark note as processed
        await db.collection('processedNotes').add({
          fileId: note.id,
          processedAt: admin.firestore.FieldValue.serverTimestamp(),
          entityType: entity.type,
          entityId: entity.id,
          transcriptId: transcriptRef.id
        });
        
        processedCount++;
        console.log(`Processed note ${note.id} for entity ${entity.type}/${entity.id}`);
      }
    } catch (error) {
      console.error(`Error processing notes for user ${userData.email}:`, error);
    }
  }

  console.log(`Processed ${processedCount} Gemini notes`);
  return null;
};

/**
 * HTTP endpoint to manually trigger Gemini notes processing
 */
exports.triggerGeminiNotesProcessing = functions.https.onRequest(async (req, res) => {
  try {
    // Get all team members with Google Drive access
    const usersSnapshot = await db.collection('users')
      .where('role', '==', 'team_member')
      .where('googleDriveEnabled', '==', true)
      .get();

    if (usersSnapshot.empty) {
      return res.status(200).json({ message: 'No team members with Google Drive access found' });
    }

    const processor = new GeminiNotesProcessor();
    let processedCount = 0;

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      
      if (!userData.tokens) {
        console.log(`User ${userData.email} has no Google tokens`);
        continue;
      }
      
      try {
        // Scan for new Gemini notes
        const notes = await processor.scanForGeminiNotes(userData.tokens);
        
        if (notes.length === 0) {
          console.log(`No new Gemini notes found for user ${userData.email}`);
          continue;
        }
        
        console.log(`Found ${notes.length} Gemini notes for user ${userData.email}`);
        
        // Process each note (same logic as in the scheduled function)
        for (const note of notes) {
          // Check if this note has already been processed
          const processedQuery = db.collection('processedNotes')
            .where('fileId', '==', note.id);
          
          const processedSnapshot = await processedQuery.get();
          if (!processedSnapshot.empty) {
            console.log(`Note ${note.id} has already been processed`);
            continue;
          }
          
          // Extract document content
          const content = await processor.extractDocContent(note.id);
          
          // Extract email addresses
          const emails = processor.extractEmailAddresses(content);
          
          if (emails.length === 0) {
            console.log(`No email addresses found in note ${note.id}`);
            continue;
          }
          
          // Determine entity
          const entity = await processor.determineEntity(emails);
          
          if (!entity) {
            console.log(`No matching entity found for emails in note ${note.id}`);
            continue;
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
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          };
          
          // Save transcript to database
          const transcriptRef = await db.collection('transcripts').add(transcriptData);
          
          // Update entity with reference to transcript
          const entityRef = db.collection(`${entity.type}s`).doc(entity.id);
          const entityDoc = await entityRef.get();
          
          if (entityDoc.exists) {
            const entityData = entityDoc.data();
            const transcripts = entityData.transcripts || [];
            
            await entityRef.update({
              transcripts: [...transcripts, {
                id: transcriptRef.id,
                title: note.name,
                date: new Date(note.createdTime),
                sourceType: 'gemini',
                sourceId: note.id
              }],
              updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
          }
          
          // Create activity log entry
          await db.collection('activity').add({
            type: 'transcript',
            action: 'created',
            transcriptId: transcriptRef.id,
            entityType: entity.type,
            entityId: entity.id,
            title: note.name,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            description: `New meeting transcript added from Gemini: ${note.name}`
          });
          
          // Mark note as processed
          await db.collection('processedNotes').add({
            fileId: note.id,
            processedAt: admin.firestore.FieldValue.serverTimestamp(),
            entityType: entity.type,
            entityId: entity.id,
            transcriptId: transcriptRef.id
          });
          
          processedCount++;
          console.log(`Processed note ${note.id} for entity ${entity.type}/${entity.id}`);
        }
      } catch (error) {
        console.error(`Error processing notes for user ${userData.email}:`, error);
      }
    }

    return res.status(200).json({ 
      message: `Processed ${processedCount} Gemini notes`,
      processedCount
    });
  } catch (error) {
    console.error('Error processing Gemini notes:', error);
    return res.status(500).json({ error: 'Error processing Gemini notes' });
  }
});
