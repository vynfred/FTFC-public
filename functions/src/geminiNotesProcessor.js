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
   * @param {String} docId - Google Doc ID
   * @returns {Promise<String>} - Document content
   */
  async extractDocContent(docId) {
    try {
      const response = await this.docs.documents.get({
        documentId: docId
      });

      let content = '';
      const document = response.data;

      if (document && document.body && document.body.content) {
        document.body.content.forEach(element => {
          if (element.paragraph && element.paragraph.elements) {
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
      console.error(`Error extracting content from doc ${docId}:`, error);
      return '';
    }
  }

  /**
   * Extract structured data from a Google Doc
   * @param {String} docId - Google Doc ID
   * @returns {Promise<Object>} - Structured document data
   */
  async extractStructuredContent(docId) {
    try {
      const response = await this.docs.documents.get({
        documentId: docId
      });

      const document = response.data;
      const result = {
        textContent: '',
        summary: '',
        keyPoints: [],
        actionItems: [],
        participants: []
      };

      if (document && document.body && document.body.content) {
        // Process document sections
        let currentSection = '';

        document.body.content.forEach(element => {
          // Check for headings to identify sections
          if (element.paragraph && element.paragraph.paragraphStyle && 
              element.paragraph.paragraphStyle.namedStyleType && 
              element.paragraph.paragraphStyle.namedStyleType.includes('HEADING')) {
            
            // Extract heading text
            let headingText = '';
            if (element.paragraph.elements) {
              element.paragraph.elements.forEach(el => {
                if (el.textRun && el.textRun.content) {
                  headingText += el.textRun.content.trim();
                }
              });
            }
            
            // Set current section based on heading
            if (headingText.toLowerCase().includes('summary')) {
              currentSection = 'summary';
            } else if (headingText.toLowerCase().includes('key point') || 
                       headingText.toLowerCase().includes('main point')) {
              currentSection = 'keyPoints';
            } else if (headingText.toLowerCase().includes('action item') || 
                       headingText.toLowerCase().includes('next step')) {
              currentSection = 'actionItems';
            } else if (headingText.toLowerCase().includes('participant') || 
                       headingText.toLowerCase().includes('attendee')) {
              currentSection = 'participants';
            } else if (headingText.toLowerCase().includes('transcript')) {
              currentSection = 'transcript';
            } else {
              currentSection = 'other';
            }
          }
          
          // Extract text content based on current section
          if (element.paragraph && element.paragraph.elements) {
            let paragraphText = '';
            
            element.paragraph.elements.forEach(paraElement => {
              if (paraElement.textRun && paraElement.textRun.content) {
                paragraphText += paraElement.textRun.content;
              }
            });
            
            // Add to appropriate section
            if (currentSection === 'summary') {
              result.summary += paragraphText;
            } else if (currentSection === 'keyPoints') {
              // Extract bullet points
              if (paragraphText.trim().startsWith('•') || paragraphText.trim().startsWith('-')) {
                result.keyPoints.push(paragraphText.trim().replace(/^[•\-]\s*/, ''));
              }
            } else if (currentSection === 'actionItems') {
              // Extract bullet points
              if (paragraphText.trim().startsWith('•') || paragraphText.trim().startsWith('-')) {
                result.actionItems.push(paragraphText.trim().replace(/^[•\-]\s*/, ''));
              }
            } else if (currentSection === 'participants') {
              // Extract email addresses
              const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
              const emails = paragraphText.match(emailRegex);
              if (emails) {
                result.participants = result.participants.concat(emails);
              }
            }
            
            // Add to full text content
            result.textContent += paragraphText;
          }
        });
      }

      // Remove duplicates from participants
      result.participants = [...new Set(result.participants)];

      return result;
    } catch (error) {
      console.error(`Error extracting structured content from doc ${docId}:`, error);
      return {
        textContent: '',
        summary: '',
        keyPoints: [],
        actionItems: [],
        participants: []
      };
    }
  }

  /**
   * Extract email addresses from text
   * @param {String} text - Text to extract emails from
   * @returns {Array} - List of email addresses
   */
  extractEmailAddresses(text) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    return text.match(emailRegex) || [];
  }

  /**
   * Find entity associated with emails
   * @param {Array} emails - List of email addresses
   * @returns {Promise<Object|null>} - Entity information or null if not found
   */
  async findEntityByEmails(emails) {
    if (!emails || emails.length === 0) {
      return null;
    }

    try {
      // Check clients
      const clientsQuery = db.collection('clients')
        .where('email', 'in', emails.slice(0, 10)); // Firestore 'in' query limited to 10 values
      
      const clientsSnapshot = await clientsQuery.get();
      if (!clientsSnapshot.empty) {
        const client = clientsSnapshot.docs[0];
        return {
          type: 'client',
          id: client.id,
          name: client.data().name
        };
      }

      // Check investors
      const investorsQuery = db.collection('investors')
        .where('email', 'in', emails.slice(0, 10));
      
      const investorsSnapshot = await investorsQuery.get();
      if (!investorsSnapshot.empty) {
        const investor = investorsSnapshot.docs[0];
        return {
          type: 'investor',
          id: investor.id,
          name: investor.data().name
        };
      }

      // Check partners
      const partnersQuery = db.collection('partners')
        .where('email', 'in', emails.slice(0, 10));
      
      const partnersSnapshot = await partnersQuery.get();
      if (!partnersSnapshot.empty) {
        const partner = partnersSnapshot.docs[0];
        return {
          type: 'partner',
          id: partner.id,
          name: partner.data().name
        };
      }

      // No entity found
      return null;
    } catch (error) {
      console.error('Error finding entity by emails:', error);
      return null;
    }
  }

  /**
   * Save transcript to database
   * @param {Object} transcriptData - Transcript data
   * @param {String} entityType - Entity type
   * @param {String} entityId - Entity ID
   * @returns {Promise<String>} - Transcript ID
   */
  async saveTranscript(transcriptData, entityType, entityId) {
    try {
      // Add entity information
      const transcriptWithEntity = {
        ...transcriptData,
        entityType,
        entityId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      // Save to Firestore
      const transcriptRef = await db.collection('transcripts').add(transcriptWithEntity);
      
      // Update the transcript with its ID
      await transcriptRef.update({
        id: transcriptRef.id
      });
      
      // Update the entity with reference to the transcript
      const entityRef = db.collection(`${entityType}s`).doc(entityId);
      const entityDoc = await entityRef.get();
      
      if (entityDoc.exists) {
        const entityData = entityDoc.data();
        const transcripts = entityData.transcripts || [];
        
        await entityRef.update({
          transcripts: [...transcripts, {
            id: transcriptRef.id,
            title: transcriptData.title,
            date: transcriptData.date,
            meetingId: transcriptData.meetingId
          }],
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
      
      // Create activity log entry
      await db.collection('activity').add({
        type: 'transcript',
        action: 'created',
        transcriptId: transcriptRef.id,
        entityType,
        entityId,
        title: transcriptData.title,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        description: `New meeting transcript added: ${transcriptData.title}`
      });
      
      return transcriptRef.id;
    } catch (error) {
      console.error('Error saving transcript:', error);
      throw error;
    }
  }

  /**
   * Check if a note has already been processed
   * @param {String} fileId - Google Drive file ID
   * @returns {Promise<Boolean>} - Whether the note has been processed
   */
  async isNoteProcessed(fileId) {
    try {
      const processedQuery = db.collection('processedNotes')
        .where('fileId', '==', fileId);
      
      const processedSnapshot = await processedQuery.get();
      return !processedSnapshot.empty;
    } catch (error) {
      console.error('Error checking if note is processed:', error);
      return false;
    }
  }

  /**
   * Mark a note as processed
   * @param {String} fileId - Google Drive file ID
   * @param {String} transcriptId - Transcript ID
   * @returns {Promise<void>}
   */
  async markNoteAsProcessed(fileId, transcriptId) {
    try {
      await db.collection('processedNotes').add({
        fileId,
        transcriptId,
        processedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking note as processed:', error);
      throw error;
    }
  }
}

/**
 * Process Gemini Notes
 * This function runs on a schedule to process Gemini Notes from team members' Google Drive
 */
exports.processGeminiNotes = async (context) => {
  try {
    console.log('Processing Gemini Notes...');
    
    // Get team members with Google Drive connected
    const usersSnapshot = await db.collection('users')
      .where('googleDriveConnected', '==', true)
      .get();
    
    if (usersSnapshot.empty) {
      console.log('No team members with Google Drive connected');
      return null;
    }
    
    const processor = new GeminiNotesProcessor();
    let processedCount = 0;
    
    // Process each team member's Drive
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      
      if (!userData.googleTokens) {
        console.log(`User ${userDoc.id} has no Google tokens`);
        continue;
      }
      
      try {
        console.log(`Processing Drive for user ${userData.email}`);
        
        // Scan for Gemini notes
        const notes = await processor.scanForGeminiNotes(userData.googleTokens);
        
        if (notes.length === 0) {
          console.log(`No Gemini notes found for user ${userData.email}`);
          continue;
        }
        
        console.log(`Found ${notes.length} Gemini notes for user ${userData.email}`);
        
        // Process each note
        for (const note of notes) {
          // Check if this note has already been processed
          const isProcessed = await processor.isNoteProcessed(note.id);
          
          if (isProcessed) {
            console.log(`Note ${note.id} has already been processed`);
            continue;
          }
          
          // Extract structured content from the document
          const content = await processor.extractStructuredContent(note.id);
          
          // Extract email addresses from participants
          const emails = content.participants;
          
          if (emails.length === 0) {
            console.log(`No email addresses found in note ${note.id}`);
            continue;
          }
          
          // Find entity associated with emails
          const entity = await processor.findEntityByEmails(emails);
          
          if (!entity) {
            console.log(`No entity found for emails in note ${note.id}`);
            continue;
          }
          
          console.log(`Found entity ${entity.type}/${entity.id} for note ${note.id}`);
          
          // Create transcript data
          const transcriptData = {
            meetingId: note.id, // Use note ID as meeting ID
            title: note.name,
            date: new Date(note.createdTime),
            participants: emails,
            transcriptUrl: note.webViewLink,
            transcript: content.textContent,
            summary: content.summary,
            keyPoints: content.keyPoints,
            actionItems: content.actionItems.map(item => ({
              description: item,
              assignee: null,
              dueDate: null
            })),
            sourceType: 'gemini'
          };
          
          // Save transcript to database
          const transcriptId = await processor.saveTranscript(
            transcriptData,
            entity.type,
            entity.id
          );
          
          // Mark note as processed
          await processor.markNoteAsProcessed(note.id, transcriptId);
          
          processedCount++;
          console.log(`Processed note ${note.id} as transcript ${transcriptId}`);
        }
      } catch (userError) {
        console.error(`Error processing Drive for user ${userData.email}:`, userError);
        // Continue with next user
      }
    }
    
    console.log(`Processed ${processedCount} Gemini notes`);
    return null;
  } catch (error) {
    console.error('Error processing Gemini Notes:', error);
    return null;
  }
};

/**
 * Trigger Gemini Notes Processing
 * This function can be called via HTTP to trigger processing of Gemini Notes
 */
exports.triggerGeminiNotesProcessing = async (req, res) => {
  try {
    // Verify API key
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== config.google.webhook_key) {
      return res.status(401).send('Unauthorized');
    }
    
    // Process Gemini Notes
    await exports.processGeminiNotes({});
    
    return res.status(200).send('Processing triggered');
  } catch (error) {
    console.error('Error triggering Gemini Notes processing:', error);
    return res.status(500).send('Internal server error');
  }
};
