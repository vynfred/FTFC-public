import { collection, getDocs, query, where } from 'firebase/firestore';
import { OAuth2Client } from 'googleapis-common';
import { docs_v1 } from 'googleapis/build/src/apis/docs';
import { drive_v3 } from 'googleapis/build/src/apis/drive';
import { db } from '../firebase-config';

// Create a minimal google object with just what we need
const google = {
  auth: {
    OAuth2: OAuth2Client
  },
  drive: ({ version, auth }) => new drive_v3.Drive({ version, auth }),
  docs: ({ version, auth }) => new docs_v1.Docs({ version, auth })
};

export class GeminiNotesProcessor {
  constructor() {
    this.drive = google.drive({ version: 'v3' });
  }

  /**
   * Scan team member's Drive for Gemini notes
   */
  async scanForGeminiNotes(userEmail, tokens) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials(tokens);

    try {
      // Search for Gemini-generated notes in the last 24 hours
      const response = await this.drive.files.list({
        auth,
        q: "mimeType='application/vnd.google-apps.document' and modifiedTime > '${getYesterdayDate()}'",
        fields: 'files(id, name, createdTime, webViewLink)',
        spaces: 'drive'
      });

      return response.data.files;
    } catch (error) {
      console.error('Error scanning Drive:', error);
      throw error;
    }
  }

  /**
   * Extract meeting participants from notes content
   */
  async extractParticipants(fileId, auth) {
    const docs = google.docs({ version: 'v1', auth });

    try {
      const response = await docs.documents.get({
        documentId: fileId
      });

      // Extract email addresses from the document content
      const content = response.data.body.content;
      const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const emails = content.match(emailPattern) || [];

      return [...new Set(emails)]; // Remove duplicates
    } catch (error) {
      console.error('Error extracting participants:', error);
      throw error;
    }
  }

  /**
   * Determine entity type and ID from participants
   */
  async determineEntity(participants) {
    const entityTypes = ['clients', 'investors', 'partners'];

    for (const entityType of entityTypes) {
      const entityQuery = query(
        collection(db, entityType),
        where('email', 'in', participants)
      );

      const snapshot = await getDocs(entityQuery);
      if (!snapshot.empty) {
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