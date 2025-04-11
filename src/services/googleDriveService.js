/**
 * Google Drive Service
 *
 * This service handles integration with Google Drive through Firebase Cloud Functions.
 */

/**
 * Get authorization URL for Google OAuth
 * @returns {String} - Authorization URL
 */
export const getGoogleAuthUrl = () => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI;

  // Define scopes
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/documents.readonly'
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
 * @returns {Promise<Object>} - Response from Cloud Function
 */
export const connectGoogleDrive = async (tokens) => {
  try {
    const result = await connectGoogleDriveFunction({ tokens });
    return result.data;
  } catch (error) {
    console.error('Error connecting Google Drive:', error);
    throw error;
  }
};

/**
 * Disconnect Google Drive
 * @returns {Promise<Object>} - Response from Cloud Function
 */
export const disconnectGoogleDrive = async () => {
  try {
    const result = await disconnectGoogleDriveFunction();
    return result.data;
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
    const result = await getGoogleDriveStatusFunction();
    return result.data;
  } catch (error) {
    console.error('Error getting Google Drive status:', error);
    return { connected: false };
  }
};
