/**
 * Simple Google Drive Service
 *
 * This service handles integration with Google Drive without using Firebase Functions.
 */

/**
 * Get authorization URL for Google OAuth
 * @returns {String} - Authorization URL
 */
export const getGoogleAuthUrl = () => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI;

  // Define all required scopes
  const scopes = [
    // User info scopes
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid',

    // Drive scopes
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.meet.readonly',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.activity.readonly',

    // Calendar scopes
    'https://www.googleapis.com/auth/calendar.app.created',
    'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
    'https://www.googleapis.com/auth/calendar.events.readonly',

    // Meet scopes
    'https://www.googleapis.com/auth/meetings.space.readonly',

    // Activity scope
    'https://www.googleapis.com/auth/activity'
  ];

  // Build auth URL
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', scopes.join(' '));
  authUrl.searchParams.append('access_type', 'offline');
  authUrl.searchParams.append('prompt', 'consent');

  return authUrl.toString();
};

/**
 * Exchange authorization code for tokens
 * @param {String} code - Authorization code from OAuth callback
 * @returns {Promise<Object>} - Tokens object
 */
export const getTokensFromCode = async (code) => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI;

  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error_description || 'Failed to get tokens');
  }

  return response.json();
};

/**
 * Connect Google Drive
 * @param {Object} tokens - OAuth tokens
 * @returns {Promise<Object>} - Response
 */
export const connectGoogleDrive = async (tokens) => {
  try {
    // In a real implementation, this would call a Cloud Function
    // For now, we'll just store the tokens in localStorage
    localStorage.setItem('googleDriveTokens', JSON.stringify(tokens));
    return { success: true };
  } catch (error) {
    console.error('Error connecting Google Drive:', error);
    throw error;
  }
};

/**
 * Disconnect Google Drive
 * @returns {Promise<Object>} - Response
 */
export const disconnectGoogleDrive = async () => {
  try {
    // In a real implementation, this would call a Cloud Function
    // For now, we'll just remove the tokens from localStorage
    localStorage.removeItem('googleDriveTokens');
    return { success: true };
  } catch (error) {
    console.error('Error disconnecting Google Drive:', error);
    throw error;
  }
};

/**
 * Get Google Drive connection status
 * @returns {Promise<Object>} - Status object with connected flag
 */
export const getGoogleDriveStatus = async () => {
  try {
    // In a real implementation, this would call a Cloud Function
    // For now, we'll just check if tokens exist in localStorage
    const tokens = localStorage.getItem('googleDriveTokens');
    return {
      connected: !!tokens,
      email: tokens ? JSON.parse(tokens).email || 'user@example.com' : null
    };
  } catch (error) {
    console.error('Error getting Google Drive status:', error);
    return { connected: false };
  }
};
