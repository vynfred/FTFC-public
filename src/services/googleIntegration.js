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
export const getAuthUrl = (scopes = [], options = {}) => {
  const oauth2Client = createOAuth2Client();

  // Default scopes if none provided - using the most common scopes needed
  const defaultScopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ];

  // Add Calendar scopes if requested
  if (options.calendar) {
    defaultScopes.push('https://www.googleapis.com/auth/calendar');
    defaultScopes.push('https://www.googleapis.com/auth/calendar.events');
  }

  // Add Drive scopes if requested
  if (options.drive) {
    defaultScopes.push('https://www.googleapis.com/auth/drive.readonly');
    defaultScopes.push('https://www.googleapis.com/auth/drive.metadata.readonly');
    defaultScopes.push('https://www.googleapis.com/auth/documents.readonly');
  }

  // Use provided scopes or defaults
  const authScopes = scopes.length > 0 ? scopes : defaultScopes;

  // Generate a secure state parameter to prevent CSRF attacks
  // Using crypto API if available for better randomness
  let state;
  if (window.crypto && window.crypto.getRandomValues) {
    const randomBytes = new Uint8Array(16);
    window.crypto.getRandomValues(randomBytes);
    state = Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
  } else {
    // Fallback to less secure but still acceptable method
    state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Store state in localStorage to verify when the redirect completes
  localStorage.setItem('googleApiAuthState', state);
  localStorage.setItem('googleApiAuthTimestamp', Date.now().toString());

  // Store requested scopes for verification later
  localStorage.setItem('googleApiRequestedScopes', JSON.stringify(authScopes));

  // Store the current path to return to after authentication
  const currentPath = window.location.pathname;
  localStorage.setItem('googleAuthReturnPath', currentPath);
  console.log('GoogleIntegration: Stored return path:', currentPath);

  // Store any additional options
  if (options.calendar) localStorage.setItem('googleAuthCalendarRequested', 'true');
  if (options.drive) localStorage.setItem('googleAuthDriveRequested', 'true');

  // Generate auth URL with additional parameters to improve reliability
  const authUrl = oauth2Client.generateAuthUrl({
    // Request offline access to get a refresh token
    access_type: 'offline',

    // Specify the scopes we need
    scope: authScopes,

    // Force consent screen to always appear to ensure we get refresh token
    // This is recommended by Google for web applications
    prompt: 'consent',

    // Include previously granted scopes
    include_granted_scopes: true,

    // Pre-fill user email if available
    login_hint: localStorage.getItem('userEmail') || '',

    // Add state parameter to prevent CSRF attacks
    state: state,
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

    // Check if we received all expected tokens
    if (!tokens.access_token) {
      console.error('GoogleIntegration: No access token received');
      throw new Error('No access token received from Google');
    }

    // Log token information (without exposing the actual tokens)
    console.log('GoogleIntegration: Token information:', {
      access_token: tokens.access_token ? 'Present' : 'Missing',
      refresh_token: tokens.refresh_token ? 'Present' : 'Missing',
      id_token: tokens.id_token ? 'Present' : 'Missing',
      expiry_date: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : 'Missing'
    });

    // Check if we got a refresh token - this is critical for long-term access
    if (!tokens.refresh_token) {
      console.warn('GoogleIntegration: No refresh token received. This may cause issues with long-term access.');
      // We'll continue anyway, as we might have a refresh token stored from a previous authentication
    }

    // Get the requested features from localStorage
    const calendarRequested = localStorage.getItem('googleAuthCalendarRequested') === 'true';
    const driveRequested = localStorage.getItem('googleAuthDriveRequested') === 'true';

    // Get the requested scopes from localStorage
    const requestedScopesJson = localStorage.getItem('googleApiRequestedScopes');
    let requestedScopes = [];
    if (requestedScopesJson) {
      try {
        requestedScopes = JSON.parse(requestedScopesJson);
      } catch (e) {
        console.error('GoogleIntegration: Error parsing requested scopes:', e);
      }
    }

    // Check if we got all the scopes we requested
    if (tokens.scope) {
      const grantedScopes = tokens.scope.split(' ');
      console.log('GoogleIntegration: Granted scopes:', grantedScopes);

      // Check for calendar scopes
      const hasCalendarScope = grantedScopes.some(scope =>
        scope.includes('calendar') || scope.includes('https://www.googleapis.com/auth/calendar'));

      // Check for drive scopes
      const hasDriveScope = grantedScopes.some(scope =>
        scope.includes('drive') || scope.includes('https://www.googleapis.com/auth/drive'));

      // Set connection flags based on granted scopes
      if (hasCalendarScope || calendarRequested) {
        localStorage.setItem('googleCalendarConnected', 'true');
        sessionStorage.setItem('googleCalendarConnected', 'true');
        console.log('GoogleIntegration: Calendar connection enabled');
      }

      if (hasDriveScope || driveRequested) {
        localStorage.setItem('googleDriveConnected', 'true');
        sessionStorage.setItem('googleDriveConnected', 'true');
        console.log('GoogleIntegration: Drive connection enabled');
      }
    } else {
      // If we don't have scope information, set flags based on what was requested
      if (calendarRequested) {
        localStorage.setItem('googleCalendarConnected', 'true');
        sessionStorage.setItem('googleCalendarConnected', 'true');
      }

      if (driveRequested) {
        localStorage.setItem('googleDriveConnected', 'true');
        sessionStorage.setItem('googleDriveConnected', 'true');
      }
    }

    // Store tokens in localStorage with expiration information
    const tokenData = {
      ...tokens,
      // Add a timestamp for when we received the tokens
      timestamp: Date.now(),
      // Make sure we have an expiry_date
      expiry_date: tokens.expiry_date || (Date.now() + 3600 * 1000) // Default to 1 hour if not provided
    };

    // Store tokens in both localStorage and sessionStorage for redundancy
    localStorage.setItem('googleTokens', JSON.stringify(tokenData));
    localStorage.setItem('googleDriveTokens', JSON.stringify(tokenData)); // For Drive-specific functions

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
    localStorage.removeItem('googleApiRequestedScopes');
    localStorage.removeItem('googleAuthCalendarRequested');
    localStorage.removeItem('googleAuthDriveRequested');

    return tokens;
  } catch (error) {
    console.error('Error getting tokens:', error);
    // Clean up in case of error
    localStorage.removeItem('googleApiAuthState');
    localStorage.removeItem('googleApiAuthTimestamp');
    localStorage.removeItem('googleApiRequestedScopes');
    localStorage.removeItem('googleAuthCalendarRequested');
    localStorage.removeItem('googleAuthDriveRequested');
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
 * Clear all Google OAuth tokens and connection flags
 */
export const clearTokens = () => {
  console.log('Clearing all Google OAuth tokens and connection flags');

  // Clear tokens
  localStorage.removeItem('googleTokens');
  localStorage.removeItem('googleDriveTokens');
  sessionStorage.removeItem('googleTokens');
  sessionStorage.removeItem('googleDriveTokens');

  // Clear connection flags
  localStorage.removeItem('googleCalendarConnected');
  localStorage.removeItem('googleDriveConnected');
  sessionStorage.removeItem('googleCalendarConnected');
  sessionStorage.removeItem('googleDriveConnected');

  // Clear any auth state
  localStorage.removeItem('googleApiAuthState');
  localStorage.removeItem('googleApiAuthTimestamp');
  localStorage.removeItem('googleApiRequestedScopes');
  localStorage.removeItem('googleAuthCalendarRequested');
  localStorage.removeItem('googleAuthDriveRequested');
  localStorage.removeItem('googleAuthReturnPath');

  // Clear any legacy items
  localStorage.removeItem('googleRedirectInProgress');
  localStorage.removeItem('googleRedirectTimestamp');
  localStorage.removeItem('intendedUserRole');
  localStorage.removeItem('googleClientId');
};

/**
 * Check if tokens are valid and refresh if needed
 * @param {Object} tokens - OAuth tokens
 * @returns {Object} - Valid tokens
 */
export const ensureValidTokens = async (tokens) => {
  if (!tokens) {
    console.error('No tokens provided to ensureValidTokens');
    throw new Error('No tokens provided');
  }

  // Log token information (without exposing the actual tokens)
  console.log('ensureValidTokens: Token information:', {
    access_token: tokens.access_token ? 'Present' : 'Missing',
    refresh_token: tokens.refresh_token ? 'Present' : 'Missing',
    id_token: tokens.id_token ? 'Present' : 'Missing',
    expiry_date: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : 'Missing'
  });

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials(tokens);

  // Check if access token is expired or about to expire (within 5 minutes)
  const now = Date.now();
  const isExpired = tokens.expiry_date && tokens.expiry_date <= now + 5 * 60 * 1000;

  console.log('ensureValidTokens: Token expiry check:', {
    now: new Date(now).toISOString(),
    expiry_date: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : 'Missing',
    isExpired: isExpired ? 'Yes' : 'No'
  });

  // If token is expired and we have a refresh token, try to refresh
  if (isExpired) {
    if (tokens.refresh_token) {
      console.log('ensureValidTokens: Token is expired, attempting to refresh');
      try {
        // Refresh token
        const { credentials } = await oauth2Client.refreshAccessToken();
        console.log('ensureValidTokens: Token refresh successful');

        // Preserve the refresh_token if it's not in the new credentials
        if (!credentials.refresh_token && tokens.refresh_token) {
          console.log('ensureValidTokens: Preserving refresh token from original credentials');
          credentials.refresh_token = tokens.refresh_token;
        }

        // Add timestamp and ensure expiry_date
        const tokenData = {
          ...credentials,
          timestamp: Date.now(),
          expiry_date: credentials.expiry_date || (Date.now() + 3600 * 1000) // Default to 1 hour if not provided
        };

        // Store the refreshed tokens in both localStorage and sessionStorage
        localStorage.setItem('googleTokens', JSON.stringify(tokenData));
        localStorage.setItem('googleDriveTokens', JSON.stringify(tokenData)); // For Drive-specific functions

        // Also update in Firestore if user is logged in
        try {
          const { db } = await import('../firebase-config');
          const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
          const { getAuth } = await import('firebase/auth');

          const auth = getAuth();
          if (auth.currentUser) {
            console.log('ensureValidTokens: Updating tokens in Firestore');
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

        return tokenData;
      } catch (error) {
        console.error('Error refreshing token:', error);

        // Handle specific error cases
        if (error.message.includes('invalid_grant')) {
          console.log('ensureValidTokens: Invalid grant error, clearing tokens');
          // Clear tokens from both localStorage and sessionStorage
          localStorage.removeItem('googleTokens');
          localStorage.removeItem('googleDriveTokens');
          localStorage.removeItem('googleCalendarConnected');
          localStorage.removeItem('googleDriveConnected');
          sessionStorage.removeItem('googleCalendarConnected');
          sessionStorage.removeItem('googleDriveConnected');

          // Throw a more specific error
          throw new Error('Your Google authorization has expired. Please reconnect your Google account.');
        } else if (error.message.includes('network')) {
          // Network error - might be temporary
          throw new Error('Network error while refreshing Google token. Please check your internet connection.');
        } else {
          // Other errors
          throw error;
        }
      }
    } else {
      console.error('ensureValidTokens: Token is expired but no refresh token available');
      throw new Error('Your Google session has expired and cannot be refreshed. Please reconnect your Google account.');
    }
  }

  // If we get here, the token is still valid
  return tokens;
};
