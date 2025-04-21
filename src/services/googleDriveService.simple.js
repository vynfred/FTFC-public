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
  // Always use environment variables for security and consistency
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  if (!clientId) {
    console.error('REACT_APP_GOOGLE_CLIENT_ID is not defined in environment variables');
  }

  // Use a consistent redirect URI for all Google authentication flows
  const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
  if (!redirectUri) {
    console.error('REACT_APP_GOOGLE_REDIRECT_URI is not defined in environment variables');
  }

  console.log('Creating Google Drive OAuth URL with:', { clientId, redirectUri });

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
    'https://www.googleapis.com/auth/drive.activity.readonly'
  ];

  // Build auth URL with additional parameters to improve reliability
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', scopes.join(' '));
  authUrl.searchParams.append('access_type', 'offline');
  authUrl.searchParams.append('prompt', 'consent');
  authUrl.searchParams.append('include_granted_scopes', 'true');
  authUrl.searchParams.append('login_hint', localStorage.getItem('userEmail') || '');
  authUrl.searchParams.append('state', Date.now().toString());

  return authUrl.toString();
};

/**
 * Exchange authorization code for tokens
 * @param {String} code - Authorization code from OAuth callback
 * @returns {Promise<Object>} - Tokens object
 */
export const getTokensFromCode = async (code) => {
  // Always use environment variables for security and consistency
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  if (!clientId) {
    console.error('REACT_APP_GOOGLE_CLIENT_ID is not defined in environment variables');
  }

  const clientSecret = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
  if (!clientSecret) {
    console.error('REACT_APP_GOOGLE_CLIENT_SECRET is not defined in environment variables');
  }

  const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
  if (!redirectUri) {
    console.error('REACT_APP_GOOGLE_REDIRECT_URI is not defined in environment variables');
  }

  console.log('Exchanging code for tokens with:', { clientId, redirectUri });

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

  const tokens = await response.json();

  // Also store the tokens for Google Calendar and set the connection flags
  localStorage.setItem('googleTokens', JSON.stringify(tokens));
  localStorage.setItem('googleCalendarConnected', 'true');
  localStorage.setItem('googleDriveConnected', 'true');

  return tokens;
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
    localStorage.setItem('googleDriveConnected', 'true');
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
    localStorage.removeItem('googleDriveConnected');
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
    const driveConnected = localStorage.getItem('googleDriveConnected');
    console.log('getGoogleDriveStatus: Checking tokens in localStorage:', tokens ? 'Found' : 'Not found');
    console.log('getGoogleDriveStatus: Drive connected flag:', driveConnected);

    if (tokens && driveConnected === 'true') {
      // Try to parse the tokens to make sure they're valid
      const parsedTokens = JSON.parse(tokens);
      console.log('getGoogleDriveStatus: Parsed tokens successfully');

      return {
        connected: true,
        email: parsedTokens.email || localStorage.getItem('userEmail') || 'user@example.com'
      };
    }

    // If we have tokens but no connection flag, clear the tokens
    if (tokens && driveConnected !== 'true') {
      console.log('getGoogleDriveStatus: Found tokens but no connection flag, clearing tokens');
      localStorage.removeItem('googleDriveTokens');
    }

    return { connected: false, email: null };
  } catch (error) {
    console.error('Error getting Google Drive status:', error);
    // Clear invalid tokens and connection flag
    localStorage.removeItem('googleDriveTokens');
    localStorage.removeItem('googleDriveConnected');
    return { connected: false };
  }
};
