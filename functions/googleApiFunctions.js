/**
 * Firebase Cloud Functions for Google API Integration
 * These functions securely handle Google API requests on the server side
 * to avoid exposing API keys in client-side code.
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { google } = require("googleapis");
const axios = require("axios");

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// Helper function for retry logic with exponential backoff
const retryOperation = async (operation, maxRetries = 5, maxBackoff = 32) => {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      // Only retry on specific error codes as recommended by Google
      const retryableStatusCodes = [429, 500, 502, 503, 504];
      const statusCode = error.response?.status || error.code;
      
      if (retryableStatusCodes.includes(statusCode)) {
        retries++;

        if (retries >= maxRetries) {
          throw error; // Max retries reached, propagate the error
        }

        // Calculate backoff time with jitter: 2^n + random fraction
        const backoffTime = Math.min(Math.pow(2, retries) + Math.random(), maxBackoff);
        console.log(`Retry attempt ${retries}, waiting ${backoffTime} seconds`);

        // Wait for the backoff period
        await new Promise(resolve => setTimeout(resolve, backoffTime * 1000));
      } else {
        throw error; // Not a retryable error
      }
    }
  }
};

/**
 * Function to list files from Google Drive
 * Replaces client-side API key usage with server-side authentication
 */
exports.listDriveFiles = functions.https.onCall(async (data, context) => {
  // Verify that the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be logged in to access Drive files"
    );
  }

  try {
    // Get the folder ID from the request
    const { folderId, pageSize = 100, pageToken } = data;
    
    if (!folderId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Folder ID is required"
      );
    }

    // Create a JWT client using service account credentials
    const auth = new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/drive.readonly"]
    });
    
    const authClient = await auth.getClient();
    
    // Create Drive client
    const drive = google.drive({
      version: "v3",
      auth: authClient
    });

    // Define the operation to retry
    const listFilesOperation = async () => {
      const response = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        pageSize: pageSize,
        pageToken: pageToken || undefined,
        fields: "nextPageToken, files(id, name, mimeType, webViewLink, createdTime, modifiedTime, size, thumbnailLink)"
      });
      
      return response.data;
    };

    // Execute with retry logic
    const result = await retryOperation(listFilesOperation);
    
    return {
      files: result.files,
      nextPageToken: result.nextPageToken
    };
  } catch (error) {
    console.error("Error listing Drive files:", error);
    
    throw new functions.https.HttpsError(
      "internal",
      "Error retrieving files from Google Drive",
      error.message
    );
  }
});

/**
 * Function to get file metadata from Google Drive
 */
exports.getDriveFileMetadata = functions.https.onCall(async (data, context) => {
  // Verify that the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be logged in to access Drive files"
    );
  }

  try {
    // Get the file ID from the request
    const { fileId } = data;
    
    if (!fileId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "File ID is required"
      );
    }

    // Create a JWT client using service account credentials
    const auth = new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/drive.readonly"]
    });
    
    const authClient = await auth.getClient();
    
    // Create Drive client
    const drive = google.drive({
      version: "v3",
      auth: authClient
    });

    // Define the operation to retry
    const getFileOperation = async () => {
      const response = await drive.files.get({
        fileId: fileId,
        fields: "id, name, mimeType, webViewLink, createdTime, modifiedTime, size, thumbnailLink"
      });
      
      return response.data;
    };

    // Execute with retry logic
    const result = await retryOperation(getFileOperation);
    
    return result;
  } catch (error) {
    console.error("Error getting Drive file metadata:", error);
    
    throw new functions.https.HttpsError(
      "internal",
      "Error retrieving file metadata from Google Drive",
      error.message
    );
  }
});

/**
 * Function to transcribe audio from Google Drive using Speech-to-Text API
 */
exports.transcribeAudio = functions.https.onCall(async (data, context) => {
  // Verify that the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be logged in to transcribe audio"
    );
  }

  try {
    // Get the file ID from the request
    const { fileId, languageCode = "en-US" } = data;
    
    if (!fileId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "File ID is required"
      );
    }

    // Create a JWT client using service account credentials
    const auth = new google.auth.GoogleAuth({
      scopes: [
        "https://www.googleapis.com/auth/drive.readonly",
        "https://www.googleapis.com/auth/cloud-platform"
      ]
    });
    
    const authClient = await auth.getClient();
    
    // Create Drive client to get file
    const drive = google.drive({
      version: "v3",
      auth: authClient
    });

    // Get file metadata to check if it's an audio file
    const fileMetadata = await drive.files.get({
      fileId: fileId,
      fields: "id, name, mimeType"
    });

    // Check if it's an audio file
    const mimeType = fileMetadata.data.mimeType;
    if (!mimeType.startsWith("audio/") && !mimeType.includes("video/")) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "File must be an audio or video file"
      );
    }

    // Create Speech-to-Text client
    const speech = google.speech({
      version: "v1p1beta1",
      auth: authClient
    });

    // Get a download URL for the file
    const fileResponse = await drive.files.get({
      fileId: fileId,
      alt: "media"
    }, {
      responseType: "arraybuffer"
    });

    // Convert the file to base64
    const audioBytes = Buffer.from(fileResponse.data).toString("base64");

    // Define the operation to retry
    const transcribeOperation = async () => {
      const request = {
        audio: {
          content: audioBytes
        },
        config: {
          encoding: "LINEAR16",
          sampleRateHertz: 16000,
          languageCode: languageCode,
          enableAutomaticPunctuation: true,
          model: "default",
          useEnhanced: true
        }
      };

      const [response] = await speech.recognize(request);
      return response;
    };

    // Execute with retry logic
    const result = await retryOperation(transcribeOperation);
    
    // Format the transcription results
    const transcription = result.results
      .map(result => result.alternatives[0].transcript)
      .join("\n");
    
    return { transcription };
  } catch (error) {
    console.error("Error transcribing audio:", error);
    
    throw new functions.https.HttpsError(
      "internal",
      "Error transcribing audio file",
      error.message
    );
  }
});

/**
 * Function to create a Google Calendar event
 */
exports.createCalendarEvent = functions.https.onCall(async (data, context) => {
  // Verify that the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be logged in to create calendar events"
    );
  }

  try {
    // Get the event details from the request
    const { 
      summary, 
      description, 
      location, 
      startDateTime, 
      endDateTime, 
      attendees = [],
      sendNotifications = true
    } = data;
    
    if (!summary || !startDateTime || !endDateTime) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Event must include summary, start time, and end time"
      );
    }

    // Create a JWT client using service account credentials
    const auth = new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/calendar"]
    });
    
    const authClient = await auth.getClient();
    
    // Create Calendar client
    const calendar = google.calendar({
      version: "v3",
      auth: authClient
    });

    // Format attendees
    const formattedAttendees = attendees.map(email => ({ email }));

    // Define the operation to retry
    const createEventOperation = async () => {
      const event = {
        summary,
        location,
        description,
        start: {
          dateTime: startDateTime,
          timeZone: 'America/Los_Angeles',
        },
        end: {
          dateTime: endDateTime,
          timeZone: 'America/Los_Angeles',
        },
        attendees: formattedAttendees,
        reminders: {
          useDefault: true,
        },
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        sendUpdates: sendNotifications ? 'all' : 'none',
      });
      
      return response.data;
    };

    // Execute with retry logic
    const result = await retryOperation(createEventOperation);
    
    return { 
      eventId: result.id,
      htmlLink: result.htmlLink
    };
  } catch (error) {
    console.error("Error creating calendar event:", error);
    
    throw new functions.https.HttpsError(
      "internal",
      "Error creating calendar event",
      error.message
    );
  }
});
