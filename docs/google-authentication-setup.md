# Google Authentication Setup Guide

This document provides instructions for setting up Google authentication in the FTFC application.

## Overview

The FTFC application uses Google authentication for:
1. Team member sign-in
2. Google Calendar integration
3. Google Drive integration for meeting recordings

## Environment Variables

The following environment variables must be set in the `.env` file:

```
# Google OAuth credentials
REACT_APP_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
REACT_APP_GOOGLE_CLIENT_SECRET=your-client-secret
REACT_APP_GOOGLE_REDIRECT_URI=https://your-domain.com/api/google/oauth-callback
```

## Google Cloud Console Configuration

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" > "Credentials"
4. Create or edit an OAuth 2.0 Client ID
5. Set the following:
   - Application type: Web application
   - Name: FTFC Application
   - Authorized JavaScript origins:
     - https://ftfc.co
     - https://ftfc-start.web.app
   - Authorized redirect URIs:
     - https://ftfc.co/api/google/oauth-callback
     - https://ftfc-start.web.app/api/google/oauth-callback
     - https://ftfc.co/__/auth/handler
     - https://ftfc-start.web.app/__/auth/handler

## Required OAuth Scopes

The application requests the following OAuth scopes:

- `https://www.googleapis.com/auth/userinfo.email`
- `https://www.googleapis.com/auth/userinfo.profile`
- `https://www.googleapis.com/auth/calendar` (for Calendar integration)
- `https://www.googleapis.com/auth/calendar.events` (for Calendar integration)
- `https://www.googleapis.com/auth/drive.readonly` (for Drive integration)
- `https://www.googleapis.com/auth/drive.metadata.readonly` (for Drive integration)
- `https://www.googleapis.com/auth/documents.readonly` (for Drive integration)

## Authentication Flow

The application uses the OAuth 2.0 Authorization Code flow with PKCE:

1. User clicks "Sign in with Google" or connects a Google service
2. Application redirects to Google's authorization page
3. User grants permissions
4. Google redirects back to the application with an authorization code
5. Application exchanges the code for access and refresh tokens
6. Tokens are stored in localStorage and used for API calls

## Implementation Details

### Key Files

- `src/firebase-config.js`: Contains the Google authentication implementation
- `src/services/googleIntegration.js`: Handles Google API integration
- `src/components/integrations/GoogleOAuthCallback.js`: Processes OAuth callbacks
- `src/components/integrations/GoogleCalendarConnect.js`: Calendar connection component
- `src/components/integrations/GoogleDriveConnect.js`: Drive connection component

### Best Practices

1. Always use environment variables for client IDs and secrets
2. Use a consistent redirect URI for all Google authentication flows
3. Store tokens securely and refresh them when needed
4. Implement proper error handling for authentication failures
5. Use state parameters to prevent CSRF attacks

## Troubleshooting

### Common Issues

1. **Redirect URI mismatch**: Ensure the redirect URI in your code matches exactly what's configured in Google Cloud Console
2. **Missing scopes**: If you're getting permission errors, check that you're requesting all required scopes
3. **Token storage issues**: Check localStorage to ensure tokens are being stored correctly
4. **CORS errors**: Ensure your domain is listed in the authorized JavaScript origins

### Debugging

The application includes extensive logging for authentication flows. Check the browser console for detailed logs that can help identify issues.

## Security Considerations

1. Never hardcode client IDs or secrets in your code
2. Always validate state parameters to prevent CSRF attacks
3. Use HTTPS for all redirect URIs
4. Request only the scopes you need
5. Implement proper token refresh logic to maintain user sessions securely
