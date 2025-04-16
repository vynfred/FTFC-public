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
  // Use environment variables if available, otherwise use hardcoded values
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '815708531852-scs6t2uph7ci2vkgpfvn7uq5q7406s20.apps.googleusercontent.com';

  // Use a redirect URI that's already registered in Google Cloud Console
  // This is one of the URIs you mentioned was already set up
  const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI || 'https://ftfc-start.web.app/api/google/oauth-callback';

  console.log('Creating OAuth2 client with:', { clientId, redirectUri });

  return new google.auth.OAuth2(
    clientId,
    null, // Client secret is not needed for client-side auth
    redirectUri
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

  // Generate a secure state parameter to prevent CSRF attacks
  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  // Store state in localStorage to verify when the redirect completes
  localStorage.setItem('googleApiAuthState', state);
  localStorage.setItem('googleApiAuthTimestamp', Date.now().toString());

  // Store the current path to return to after authentication
  const currentPath = window.location.pathname;
  localStorage.setItem('googleAuthReturnPath', currentPath);
  console.log('GoogleIntegration: Stored return path:', currentPath);

  // Generate auth URL with additional parameters to improve reliability
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Get refresh token
    scope: authScopes,
    prompt: 'consent', // Force consent screen to always appear
    include_granted_scopes: true, // Include previously granted scopes
    login_hint: localStorage.getItem('userEmail') || '', // Pre-fill user email if available
    state: state, // Add state parameter to prevent CSRF
  });

  return authUrl;
};

/**
 * Exchange authorization code for tokens
 * @param {String} code - Authorization code from OAuth callback
 * @returns {Object} - Tokens object with access_token, refresh_token, etc.
 */
export const exchangeCodeForTokens = async (code) => {
  const oauth2Client = createOAuth2Client();

  try {
    console.log('GoogleIntegration: Exchanging code for tokens');
    const { tokens } = await oauth2Client.getToken(code);
    console.log('GoogleIntegration: Received tokens successfully');

    // Store tokens in both localStorage and sessionStorage for redundancy
    localStorage.setItem('googleTokens', JSON.stringify(tokens));
    localStorage.setItem('googleDriveTokens', JSON.stringify(tokens)); // For Drive-specific functions

    // Set connection flags in both localStorage and sessionStorage
    localStorage.setItem('googleCalendarConnected', 'true');
    localStorage.setItem('googleDriveConnected', 'true');
    sessionStorage.setItem('googleCalendarConnected', 'true');
    sessionStorage.setItem('googleDriveConnected', 'true');

    // Store user email if available in the ID token
    if (tokens.id_token) {
      try {
        // Parse the ID token to get user info
        const base64Url = tokens.id_token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        if (payload.email) {
          localStorage.setItem('userEmail', payload.email);
          console.log('GoogleIntegration: Stored user email:', payload.email);
        }
      } catch (tokenError) {
        console.error('GoogleIntegration: Error parsing ID token:', tokenError);
      }
    }

    // Clear the state parameters
    localStorage.removeItem('googleApiAuthState');
    localStorage.removeItem('googleApiAuthTimestamp');

    return tokens;
  } catch (error) {
    console.error('Error getting tokens:', error);
    // Clean up in case of error
    localStorage.removeItem('googleApiAuthState');
    localStorage.removeItem('googleApiAuthTimestamp');
    throw error;
  }
};

/**
 * Store tokens in Firestore
 * @param {String} userId - User ID
 * @param {Object} tokens - OAuth tokens
 * @returns {Promise} - Promise that resolves when tokens are stored
 */
export const storeTokens = async (userId, tokens) => {
  try {
    // In a real app, you would store these tokens in your database
    console.log('Storing tokens for user:', userId);
    return { success: true };
  } catch (error) {
    console.error('Error storing tokens:', error);
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
 * @param {Boolean} meetOnly - Whether to only include Google Meet events
 * @returns {Array} - List of upcoming events
 */
export const listUpcomingEvents = async (tokens, maxResults = 10, includePast = false, companyWide = true, entityType = null, entityId = null, meetOnly = false) => {
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

    // Filter for Google Meet events if meetOnly is true
    if (meetOnly) {
      events = events.filter(event =>
        event.conferenceData &&
        event.conferenceData.conferenceSolution &&
        event.conferenceData.conferenceSolution.key.type === 'hangoutsMeet'
      );
    }

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
 * Get meeting transcripts from Google Drive (Gemini Notes)
 * @param {Object} tokens - OAuth tokens
 * @param {String} meetingId - Google Meet meeting ID or meeting title
 * @returns {Array} - List of transcript documents with metadata
 */
export const getMeetingTranscripts = async (tokens, meetingId) => {
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

    // Search for Gemini Notes documents
    // Gemini Notes typically have "Meeting notes" or "Meeting transcript" in the title
    const geminiNotesQuery = `(name contains 'Meeting notes' or name contains 'Meeting transcript') and mimeType='application/vnd.google-apps.document'`;

    // Add meeting-specific search if we have a meeting ID
    const meetingQuery = searchQuery ?
      `${geminiNotesQuery} and (name contains '${searchQuery}' or fullText contains '${searchQuery}')` :
      geminiNotesQuery;

    // Search for Gemini Notes documents
    const response = await drive.files.list({
      q: meetingQuery,
      fields: 'files(id, name, webViewLink, createdTime, mimeType, description, thumbnailLink)',
      orderBy: 'createdTime desc',
      pageSize: 10
    });

    const transcriptFiles = response.data.files || [];

    // For each Google Doc, extract the content
    for (const file of transcriptFiles) {
      try {
        const docs = google.docs({ version: 'v1', auth });
        const docContent = await docs.documents.get({ documentId: file.id });

        // Extract text content from the document
        let textContent = '';
        let summary = '';
        let keyPoints = [];
        let actionItems = [];
        let participants = [];

        if (docContent.data && docContent.data.body && docContent.data.body.content) {
          // Process document sections
          let currentSection = '';

          docContent.data.body.content.forEach(element => {
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
                summary += paragraphText;
              } else if (currentSection === 'keyPoints') {
                // Extract bullet points
                if (paragraphText.trim().startsWith('•') || paragraphText.trim().startsWith('-')) {
                  keyPoints.push(paragraphText.trim().replace(/^[•\-]\s*/, ''));
                }
              } else if (currentSection === 'actionItems') {
                // Extract bullet points
                if (paragraphText.trim().startsWith('•') || paragraphText.trim().startsWith('-')) {
                  actionItems.push(paragraphText.trim().replace(/^[•\-]\s*/, ''));
                }
              } else if (currentSection === 'participants') {
                // Extract email addresses
                const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
                const emails = paragraphText.match(emailRegex);
                if (emails) {
                  participants = participants.concat(emails);
                }
              }

              // Add to full text content
              textContent += paragraphText;
            }
          });
        }

        // Store extracted content
        file.textContent = textContent;
        file.summary = summary.trim();
        file.keyPoints = keyPoints;
        file.actionItems = actionItems;
        file.participants = [...new Set(participants)]; // Remove duplicates
        file.sourceType = 'gemini';
      } catch (docError) {
        console.error('Error getting document content:', docError);
        file.textContent = 'Error retrieving transcript content';
        file.sourceType = 'gemini';
      }
    }

    return transcriptFiles;
  } catch (error) {
    console.error('Error getting meeting transcripts:', error);
    return []; // Return empty array instead of throwing to prevent cascading errors
  }
};

/**
 * Get meeting recordings from Google Drive (legacy function, now redirects to getMeetingTranscripts)
 * @param {Object} tokens - OAuth tokens
 * @param {String} meetingId - Google Meet meeting ID or meeting title
 * @returns {Array} - List of transcript documents with metadata
 */
export const getMeetingRecordings = async (tokens, meetingId) => {
  // Redirect to the new function
  return getMeetingTranscripts(tokens, meetingId);
};

/**
 * List calendar events for a specific date range
 * @param {Object} tokens - OAuth tokens
 * @param {Date|string} startDate - Start date for the range
 * @param {Date|string} endDate - End date for the range
 * @param {Boolean} companyWide - Whether to include all company events or just user's events
 * @returns {Array} - List of events in the date range
 */
export const listCalendarEvents = async (tokens, startDate, endDate, companyWide = true) => {
  try {
    // Ensure tokens are valid
    const validTokens = await ensureValidTokens(tokens);
    const auth = getAuthenticatedClient(validTokens);
    const calendar = google.calendar({ version: 'v3', auth });

    // Convert dates to ISO strings if they're Date objects
    const timeMin = typeof startDate === 'string' ? startDate : startDate.toISOString();
    const timeMax = typeof endDate === 'string' ? endDate : endDate.toISOString();

    // Get events from Google Calendar
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin,
      timeMax: timeMax,
      maxResults: 2500, // Get a large number of events
      singleEvents: true,
      orderBy: 'startTime'
    });

    let events = response.data.items || [];

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

    return events;
  } catch (error) {
    console.error('Error listing calendar events:', error);
    throw error;
  }
};

/**
 * Store OAuth tokens in local storage
 * @param {Object} tokens - OAuth tokens
 */
export const storeTokensInLocalStorage = (tokens) => {
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
      storeTokensInLocalStorage(credentials);

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
