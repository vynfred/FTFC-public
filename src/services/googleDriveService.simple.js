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
  // Use a direct approach without relying on environment variables
  // This ensures consistent client ID and redirect URI across environments
  // Using the FTFC Client ID from Google Cloud Console
  const clientId = '815708531852-scs6t2uph7ci2vkgpfvn7uq5q7406s20.apps.googleusercontent.com';
  const redirectUri = 'https://ftfc-start.web.app/api/google/oauth-callback';

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
  // Use the same client ID and redirect URI as in getGoogleAuthUrl
  const clientId = '815708531852-scs6t2uph7ci2vkgpfvn7uq5q7406s20.apps.googleusercontent.com';
  const clientSecret = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
  const redirectUri = 'https://ftfc-start.web.app/api/google/oauth-callback';

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
