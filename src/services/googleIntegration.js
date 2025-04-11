/**
 * Google Integration Service
 *
 * This service handles integration with Google APIs:
 * - OAuth authentication
 * - Calendar/Meet integration
 * - Meeting recordings access
 *
 * It provides methods for:
 * - Initiating OAuth flow
 * - Handling OAuth callback
 * - Creating and managing Google Meet events
 * - Retrieving meeting recordings
 */

// Import the real Google API client library
import { google } from 'googleapis';

// Create OAuth2 client
const createOAuth2Client = () => {
  return new google.auth.OAuth2(
    process.env.REACT_APP_GOOGLE_CLIENT_ID,
    process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
    process.env.REACT_APP_GOOGLE_REDIRECT_URI
  );
};

/**
 * Get authorization URL for Google OAuth
 * @param {Array} scopes - Array of OAuth scopes to request
 * @returns {String} - Authorization URL
 */
export const getAuthUrl = (scopes = []) => {
  const oauth2Client = createOAuth2Client();

  // Default scopes if none provided
  const defaultScopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/documents.readonly'
  ];

  const authScopes = scopes.length > 0 ? scopes : defaultScopes;

  // Generate auth URL
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Get refresh token
    scope: authScopes,
    prompt: 'consent' // Force consent screen to always appear
  });

  return authUrl;
};

/**
 * Exchange authorization code for tokens
 * @param {String} code - Authorization code from OAuth callback
 * @returns {Object} - Tokens object with access_token, refresh_token, etc.
 */
export const getTokensFromCode = async (code) => {
  const oauth2Client = createOAuth2Client();

  try {
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  } catch (error) {
    console.error('Error getting tokens:', error);
    throw error;
  }
};

/**
 * Get authenticated Google API client
 * @param {Object} tokens - OAuth tokens
 * @returns {Object} - Authenticated Google API client
 */
export const getAuthenticatedClient = (tokens) => {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials(tokens);
  return oauth2Client;
};

/**
 * Get user profile information
 * @param {Object} tokens - OAuth tokens
 * @returns {Object} - User profile information
 */
export const getUserProfile = async (tokens) => {
  const auth = getAuthenticatedClient(tokens);
  const people = google.people({ version: 'v1', auth });

  try {
    const response = await people.people.get({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses,photos,userDefined,timeZone'
    });

    return response.data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    // Return empty object instead of throwing to prevent cascading errors
    return {};
  }
};

/**
 * Create a Google Calendar event with Google Meet
 * @param {Object} tokens - OAuth tokens
 * @param {Object} eventDetails - Event details (title, description, start, end, attendees)
 * @returns {Object} - Created event
 */
export const createMeetEvent = async (tokens, eventDetails) => {
  try {
    // Ensure tokens are valid
    const validTokens = await ensureValidTokens(tokens);
    const auth = getAuthenticatedClient(validTokens);
    const calendar = google.calendar({ version: 'v3', auth });

    // Get user timezone or use default
    const userInfo = await getUserProfile(validTokens);
    const userTimezone = userInfo.timeZone || 'America/New_York';

    // Create event object with proper naming convention for FTFC meetings
    // Format: FTFC-[EntityType]-[EntityID]-[Date]-[EntityName]
    const event = {
      summary: eventDetails.title,
      description: eventDetails.description || 'Meeting scheduled via FTFC platform',
      start: {
        dateTime: eventDetails.start,
        timeZone: userTimezone
      },
      end: {
        dateTime: eventDetails.end,
        timeZone: userTimezone
      },
      attendees: eventDetails.attendees.map(email => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: `ftfc-meet-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      },
      // Add reminders
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 } // 30 minutes before
        ]
      }
    };

    // Insert event with conference data
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all' // Send emails to attendees
    });

    // Store the event in Firestore for reference
    try {
      const { db } = await import('../firebase-config');
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');

      await addDoc(collection(db, 'meetings'), {
        googleEventId: response.data.id,
        title: response.data.summary,
        description: response.data.description,
        startTime: response.data.start.dateTime,
        endTime: response.data.end.dateTime,
        attendees: response.data.attendees?.map(a => a.email) || [],
        meetingLink: response.data.hangoutLink,
        conferenceData: response.data.conferenceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Add entity information if available
        entityType: eventDetails.entityType || null,
        entityId: eventDetails.entityId || null,
        entityName: eventDetails.entityName || null
      });
    } catch (dbError) {
      console.error('Error storing meeting in database:', dbError);
      // Continue even if database storage fails
    }

    return response.data;
  } catch (error) {
    console.error('Error creating Meet event:', error);
    throw error;
  }
};

/**
 * List upcoming calendar events
 * @param {Object} tokens - OAuth tokens
 * @param {Number} maxResults - Maximum number of events to return
 * @param {Boolean} includePast - Whether to include past events
 * @param {Boolean} companyWide - Whether to include all company events or just user's events
 * @param {String} entityType - Optional entity type filter (client, investor, partner)
 * @param {String} entityId - Optional entity ID filter
 * @returns {Array} - List of upcoming events
 */
export const listUpcomingEvents = async (tokens, maxResults = 10, includePast = false, companyWide = true, entityType = null, entityId = null) => {
  try {
    // Ensure tokens are valid
    const validTokens = await ensureValidTokens(tokens);
    const auth = getAuthenticatedClient(validTokens);
    const calendar = google.calendar({ version: 'v3', auth });

    // Set time range
    const timeMin = includePast ? new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString() : new Date().toISOString();

    // Get events from Google Calendar
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin,
      maxResults: maxResults * 2, // Get more events than needed to account for filtering
      singleEvents: true,
      orderBy: 'startTime'
    });

    let events = response.data.items || [];

    // Filter for Google Meet events
    events = events.filter(event =>
      event.conferenceData &&
      event.conferenceData.conferenceSolution &&
      event.conferenceData.conferenceSolution.key.type === 'hangoutsMeet'
    );

    // If not company-wide, filter for events created by the current user
    if (!companyWide) {
      const userInfo = await getUserProfile(validTokens);
      const userEmail = userInfo.emailAddresses?.[0]?.value;

      if (userEmail) {
        events = events.filter(event => {
          // Check if user is the creator or an attendee
          const isCreator = event.creator?.email === userEmail;
          const isAttendee = event.attendees?.some(attendee => attendee.email === userEmail);
          return isCreator || isAttendee;
        });
      }
    }

    // If entity filtering is requested, get events from Firestore
    if (entityType && entityId) {
      try {
        const { db } = await import('../firebase-config');
        const { collection, query, where, getDocs } = await import('firebase/firestore');

        // Query Firestore for meetings associated with this entity
        const meetingsQuery = query(
          collection(db, 'meetings'),
          where('entityType', '==', entityType),
          where('entityId', '==', entityId)
        );

        const meetingsSnapshot = await getDocs(meetingsQuery);
        const entityMeetingIds = meetingsSnapshot.docs.map(doc => doc.data().googleEventId);

        // Filter Google Calendar events to only those associated with this entity
        events = events.filter(event => entityMeetingIds.includes(event.id));
      } catch (dbError) {
        console.error('Error querying entity meetings:', dbError);
        // Continue with unfiltered events if database query fails
      }
    }

    // Limit to requested number of results
    events = events.slice(0, maxResults);

    return events;
  } catch (error) {
    console.error('Error listing events:', error);
    throw error;
  }
};

/**
 * Get meeting recordings from Google Drive
 * @param {Object} tokens - OAuth tokens
 * @param {String} meetingId - Google Meet meeting ID or meeting title
 * @returns {Array} - List of recording files with metadata
 */
export const getMeetingRecordings = async (tokens, meetingId) => {
  try {
    // Ensure tokens are valid
    const validTokens = await ensureValidTokens(tokens);
    const auth = getAuthenticatedClient(validTokens);
    const drive = google.drive({ version: 'v3', auth });

    // Extract meeting code from meetingId if it's a full URL
    let searchQuery = meetingId;
    if (meetingId.includes('meet.google.com')) {
      const meetCodeMatch = meetingId.match(/([a-z0-9-]{10,})/i);
      if (meetCodeMatch) {
        searchQuery = meetCodeMatch[1];
      }
    }

    // First, search for recordings in 'My recordings' folder
    // This is where Gemini stores recordings by default
    const folderResponse = await drive.files.list({
      q: "name = 'My recordings' and mimeType = 'application/vnd.google-apps.folder'",
      fields: 'files(id)'
    });

    let recordingFiles = [];

    // If we found the My recordings folder
    if (folderResponse.data.files && folderResponse.data.files.length > 0) {
      const recordingsFolderId = folderResponse.data.files[0].id;

      // Search for recordings in this folder
      const filesInFolderResponse = await drive.files.list({
        q: `'${recordingsFolderId}' in parents and (name contains '${searchQuery}' or fullText contains '${searchQuery}') and (mimeType contains 'video/' or mimeType = 'application/vnd.google-apps.document')`,
        fields: 'files(id, name, webViewLink, createdTime, mimeType, description, thumbnailLink)',
        orderBy: 'createdTime desc'
      });

      recordingFiles = filesInFolderResponse.data.files || [];
    }

    // If no recordings found in the folder, try a broader search
    if (recordingFiles.length === 0) {
      const broadSearchResponse = await drive.files.list({
        q: `(name contains '${searchQuery}' or fullText contains '${searchQuery}') and (mimeType contains 'video/' or mimeType = 'application/vnd.google-apps.document')`,
        fields: 'files(id, name, webViewLink, createdTime, mimeType, description, thumbnailLink)',
        orderBy: 'createdTime desc',
        pageSize: 10
      });

      recordingFiles = broadSearchResponse.data.files || [];
    }

    // For each Google Doc (which might be a transcript), get its content
    for (const file of recordingFiles) {
      if (file.mimeType === 'application/vnd.google-apps.document') {
        try {
          const docs = google.docs({ version: 'v1', auth });
          const docContent = await docs.documents.get({ documentId: file.id });

          // Extract text content from the document
          let textContent = '';
          if (docContent.data && docContent.data.body && docContent.data.body.content) {
            docContent.data.body.content.forEach(element => {
              if (element.paragraph && element.paragraph.elements) {
                element.paragraph.elements.forEach(paraElement => {
                  if (paraElement.textRun && paraElement.textRun.content) {
                    textContent += paraElement.textRun.content;
                  }
                });
              }
            });
          }

          file.textContent = textContent;
        } catch (docError) {
          console.error('Error getting document content:', docError);
          file.textContent = 'Error retrieving transcript content';
        }
      }
    }

    return recordingFiles;
  } catch (error) {
    console.error('Error getting meeting recordings:', error);
    return []; // Return empty array instead of throwing to prevent cascading errors
  }
};

/**
 * Store OAuth tokens in local storage
 * @param {Object} tokens - OAuth tokens
 */
export const storeTokens = (tokens) => {
  localStorage.setItem('googleTokens', JSON.stringify(tokens));
};

/**
 * Get OAuth tokens from local storage
 * @returns {Object|null} - OAuth tokens or null if not found
 */
export const getStoredTokens = () => {
  const tokensString = localStorage.getItem('googleTokens');
  return tokensString ? JSON.parse(tokensString) : null;
};

/**
 * Clear OAuth tokens from local storage
 */
export const clearTokens = () => {
  localStorage.removeItem('googleTokens');
};

/**
 * Check if tokens are valid and refresh if needed
 * @param {Object} tokens - OAuth tokens
 * @returns {Object} - Valid tokens
 */
export const ensureValidTokens = async (tokens) => {
  if (!tokens) {
    throw new Error('No tokens provided');
  }

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials(tokens);

  // Check if access token is expired or about to expire (within 5 minutes)
  const now = Date.now();
  const isExpired = tokens.expiry_date && tokens.expiry_date <= now + 5 * 60 * 1000;

  if (isExpired && tokens.refresh_token) {
    try {
      // Refresh token
      const { credentials } = await oauth2Client.refreshAccessToken();

      // Preserve the refresh_token if it's not in the new credentials
      if (!credentials.refresh_token && tokens.refresh_token) {
        credentials.refresh_token = tokens.refresh_token;
      }

      // Store the refreshed tokens
      storeTokens(credentials);

      // Also update in Firestore if user is logged in
      try {
        const { db } = await import('../firebase-config');
        const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
        const { getAuth } = await import('firebase/auth');

        const auth = getAuth();
        if (auth.currentUser) {
          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            'googleTokens.access_token': credentials.access_token,
            'googleTokens.expiry_date': credentials.expiry_date,
            'googleTokens.id_token': credentials.id_token || tokens.id_token,
            'googleTokens.token_type': credentials.token_type,
            'lastUpdated': serverTimestamp()
          });
        }
      } catch (dbError) {
        console.error('Error updating tokens in database:', dbError);
        // Continue even if database update fails
      }

      return credentials;
    } catch (error) {
      console.error('Error refreshing token:', error);

      // Only clear tokens if refresh token is invalid
      if (error.message.includes('invalid_grant')) {
        clearTokens();
      }

      throw error;
    }
  }

  return tokens;
};
