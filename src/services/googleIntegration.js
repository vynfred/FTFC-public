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

// Import only the specific Google APIs we need
import { OAuth2Client } from 'googleapis-common';
import { calendar_v3 } from 'googleapis/build/src/apis/calendar';
import { drive_v3 } from 'googleapis/build/src/apis/drive';
import { people_v1 } from 'googleapis/build/src/apis/people';

// Create a minimal google object with just what we need
const google = {
  auth: {
    OAuth2: OAuth2Client
  },
  calendar: ({ version, auth }) => new calendar_v3.Calendar({ version, auth }),
  drive: ({ version, auth }) => new drive_v3.Drive({ version, auth }),
  people: ({ version, auth }) => new people_v1.People({ version, auth })
};

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
      personFields: 'names,emailAddresses,photos'
    });

    return response.data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Create a Google Calendar event with Google Meet
 * @param {Object} tokens - OAuth tokens
 * @param {Object} eventDetails - Event details (title, description, start, end, attendees)
 * @returns {Object} - Created event
 */
export const createMeetEvent = async (tokens, eventDetails) => {
  const auth = getAuthenticatedClient(tokens);
  const calendar = google.calendar({ version: 'v3', auth });

  const event = {
    summary: eventDetails.title,
    description: eventDetails.description,
    start: {
      dateTime: eventDetails.start,
      timeZone: 'America/Los_Angeles' // Default timezone, can be made configurable
    },
    end: {
      dateTime: eventDetails.end,
      timeZone: 'America/Los_Angeles'
    },
    attendees: eventDetails.attendees.map(email => ({ email })),
    conferenceData: {
      createRequest: {
        requestId: `ftfc-meet-${Date.now()}`,
        conferenceSolutionKey: {
          type: 'hangoutsMeet'
        }
      }
    }
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1
    });

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
 * @returns {Array} - List of upcoming events
 */
export const listUpcomingEvents = async (tokens, maxResults = 10) => {
  const auth = getAuthenticatedClient(tokens);
  const calendar = google.calendar({ version: 'v3', auth });

  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: maxResults,
      singleEvents: true,
      orderBy: 'startTime'
    });

    return response.data.items;
  } catch (error) {
    console.error('Error listing events:', error);
    throw error;
  }
};

/**
 * Get meeting recordings from Google Drive
 * @param {Object} tokens - OAuth tokens
 * @param {String} meetingId - Google Meet meeting ID
 * @returns {Array} - List of recording files
 */
export const getMeetingRecordings = async (tokens, meetingId) => {
  const auth = getAuthenticatedClient(tokens);
  const drive = google.drive({ version: 'v3', auth });

  try {
    // Search for files with the meeting ID in the name
    const response = await drive.files.list({
      q: `name contains '${meetingId}' and mimeType contains 'video/'`,
      fields: 'files(id, name, webViewLink, createdTime, mimeType)'
    });

    return response.data.files;
  } catch (error) {
    console.error('Error getting meeting recordings:', error);
    throw error;
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

  // Check if access token is expired
  const now = Date.now();
  if (tokens.expiry_date && tokens.expiry_date <= now) {
    try {
      // Refresh token
      const { credentials } = await oauth2Client.refreshAccessToken();
      storeTokens(credentials);
      return credentials;
    } catch (error) {
      console.error('Error refreshing token:', error);
      clearTokens();
      throw error;
    }
  }

  return tokens;
};
