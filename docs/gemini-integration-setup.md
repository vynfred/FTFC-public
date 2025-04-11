# Gemini Notes Integration Setup

This document provides instructions for setting up and testing the Gemini notes integration in the FTFC application.

## Overview

The Gemini notes integration automatically processes meeting notes created by Google Gemini, extracts participant information, determines which client/investor/partner the meeting was with, and associates the notes with the appropriate entity in the FTFC application.

## Prerequisites

1. Google Cloud project with the following APIs enabled:
   - Google Drive API
   - Google Docs API
   - Google Meet API

2. Service account with appropriate permissions:
   - Drive API: `https://www.googleapis.com/auth/drive.readonly`
   - Docs API: `https://www.googleapis.com/auth/documents.readonly`

3. Environment variables set up with service account credentials

## Environment Setup

1. Create a `.env` file in the root directory based on `.env.example`
2. Add your service account credentials to the `.env` file:
   ```
   GOOGLE_PROJECT_ID=your_project_id
   GOOGLE_PRIVATE_KEY_ID=your_private_key_id
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----\n"
   GOOGLE_CLIENT_EMAIL=your_service_account_email
   GOOGLE_CLIENT_ID=your_client_id
   ```

3. Set up Firebase Functions configuration:
   ```bash
   firebase functions:config:set google.project_id="your_project_id"
   firebase functions:config:set google.client_email="your_service_account_email"
   firebase functions:config:set google.private_key="your_private_key"
   firebase functions:config:set google.drive_folder_id="your_drive_folder_id"
   firebase functions:config:set google.meet_api_key="your_meet_api_key"
   firebase functions:config:set google.speech_to_text_api_key="your_speech_to_text_api_key"
   firebase functions:config:set google.drive_api_key="your_drive_api_key"
   firebase functions:config:set google.webhook_key="your_webhook_key"
   ```

## Testing the Integration

### 1. Add a Test Client

You can add a test client using the provided script:

```bash
node scripts/add-test-client.js
```

This will create a test client with the following details:
- Name: Vynfred Virst
- Email: hellovynfred@gmail.com
- Company: Vynfred Test Company

### 2. Set Up a Meeting with the Test Client

1. Log in to your Google account (the one associated with your FTFC team member account)
2. Create a new Google Meet meeting
3. Invite hellovynfred@gmail.com to the meeting
4. Conduct the meeting
5. Let Gemini generate meeting notes (this happens automatically in Google Meet)

### 3. Process the Gemini Notes

After the meeting, the Gemini notes should be automatically processed by the Cloud Functions. You can also manually trigger the processing:

```
https://us-central1-your-project-id.cloudfunctions.net/triggerGeminiNotesProcessing
```

### 4. Check the Client Portal

1. Log in to the FTFC application as Vynfred Virst (hellovynfred@gmail.com)
2. Navigate to the client portal
3. Look for the Meeting Transcripts section
4. The transcript from your meeting should appear there

## Troubleshooting

### Common Issues

1. **Notes not being processed**:
   - Check that the team member has connected their Google account
   - Check that the team member has enabled Google Drive access
   - Check that the note is in the expected format (Gemini meeting notes)

2. **Entity not being identified**:
   - Check that the email addresses in the note match those in the FTFC database
   - Check that the entity exists in the database

3. **Transcripts not appearing in portals**:
   - Check that the transcript was successfully created in the database
   - Check that the transcript was associated with the correct entity

### Checking Logs

You can check the Cloud Functions logs to see if the Gemini notes processing is working correctly:

```bash
firebase functions:log
```

## Security Considerations

1. **Service Account Credentials**:
   - Never commit service account credentials to version control
   - Always use environment variables or secure secret management
   - Restrict service account permissions to only what is needed

2. **Data Access**:
   - Ensure that transcripts are only accessible to authorized users
   - Implement proper security rules in Firestore
   - Validate user permissions before displaying sensitive data

## Production Deployment

Before deploying to production:

1. Test the integration thoroughly in a staging environment
2. Ensure all environment variables are properly set
3. Deploy the Cloud Functions:
   ```bash
   firebase deploy --only functions
   ```
4. Monitor the logs for any errors
5. Test the integration with real users
