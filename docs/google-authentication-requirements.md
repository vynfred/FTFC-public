# Google Authentication Requirements

This document outlines the requirements for implementing Google authentication in the FTFC application.

## Overview

The FTFC application requires Google authentication for team members to access the dashboard and to integrate with Google services like Calendar and Drive for meeting management and document storage.

## Authentication Flow

1. **User Authentication**: Team members should be able to sign in with their Google accounts.
2. **Authorization Scopes**: The authentication should request the following scopes:
   - `email` - For user identification
   - `profile` - For user profile information
   - `https://www.googleapis.com/auth/calendar` - For Google Calendar integration
   - `https://www.googleapis.com/auth/drive` - For Google Drive integration

## Technical Requirements

### Firebase Configuration

- The application uses Firebase Authentication for user management
- The Firebase project ID is `ftfc-start`
- The correct authDomain to use is `ftfc-start.firebaseapp.com`

### Google Cloud Console Setup

1. **OAuth Client ID**: 
   - The application needs a properly configured OAuth client ID in Google Cloud Console
   - The client ID should be added to the Firebase Authentication settings

2. **Authorized Redirect URIs**:
   - `https://ftfc-start.firebaseapp.com/__/auth/handler`
   - `https://ftfc-start.web.app/__/auth/handler`
   - `https://ftfc.co/__/auth/handler`
   - `http://localhost:3000/__/auth/handler`
   - `postmessage`

### Implementation Details

1. **Authentication Method**:
   - Use Firebase's `signInWithPopup` method with a Google provider
   - Handle authentication errors properly
   - Redirect to the dashboard upon successful authentication

2. **Token Storage**:
   - Store authentication tokens securely
   - Implement token refresh mechanism
   - Handle token expiration gracefully

3. **User Experience**:
   - Provide clear feedback during the authentication process
   - Handle authentication errors with user-friendly messages
   - Implement loading states during authentication

## Integration Points

### Google Calendar Integration

- After authentication, the application should be able to:
  - Fetch the user's calendar events
  - Create new calendar events
  - Update existing calendar events
  - Send meeting invitations

### Google Drive Integration

- After authentication, the application should be able to:
  - Access the team's shared Google Drive folder
  - Upload files to Google Drive
  - Download files from Google Drive
  - Create folders in Google Drive

## Testing Requirements

1. **Authentication Testing**:
   - Test with various Google accounts
   - Test error scenarios (network issues, permission denied, etc.)
   - Test token refresh

2. **Integration Testing**:
   - Test Calendar API integration
   - Test Drive API integration
   - Test with real data

## Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)
- [Google Calendar API Documentation](https://developers.google.com/calendar)
- [Google Drive API Documentation](https://developers.google.com/drive)
