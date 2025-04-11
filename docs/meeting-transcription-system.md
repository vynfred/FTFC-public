# Meeting Recording and Transcription System

This document describes the fully automated meeting recording and transcription system implemented in the FTFC application.

## Overview

The system automatically records Google Meet meetings, transcribes the recordings, and associates the transcripts with the relevant clients, investors, or partners. The transcripts are then made available in the respective portals.

## Components

1. **Frontend Components**:
   - `MeetingScheduler`: Schedules meetings and sets up recording and transcription
   - `MeetingTranscript`: Displays a single meeting transcript
   - `MeetingTranscriptList`: Displays a list of meeting transcripts for an entity
   - `MeetingHistory`: Displays meeting history and transcripts

2. **Services**:
   - `meetingTranscriptService.js`: Handles processing and storage of meeting transcripts
   - `meetingWebhookService.js`: Handles registration and management of Google Meet webhooks
   - `googleIntegration.js`: Handles Google OAuth, Calendar, and Meet functionality

3. **Firebase Cloud Functions**:
   - `processMeetRecording`: Processes a Google Meet recording webhook
   - `processTranscriptionQueue`: Background function to process transcription jobs

4. **Database Collections**:
   - `transcripts`: Stores meeting transcripts
   - `meetings`: Stores meeting metadata
   - `meetingWebhooks`: Stores webhook registrations
   - `recordingConfigs`: Stores recording configurations
   - `transcriptionJobs`: Stores transcription job status
   - `activity`: Stores activity logs

## Setup Instructions

### 1. Set Up Google Cloud Project

1. Create a Google Cloud Project
2. Enable the following APIs:
   - Google Calendar API
   - Google Meet API
   - Google Drive API
   - Google Speech-to-Text API
3. Create OAuth credentials
4. Create API keys for each service
5. Create a service account:
   - Go to the Google Cloud Console
   - Navigate to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Enter a name (e.g., "FTFC Meeting Transcription")
   - Click "Create and Continue"
   - Assign the following roles:
     - "Storage Object Admin" (for Google Drive access)
     - "Speech-to-Text Admin" (for transcription)
   - Click "Done"
   - Click on the service account you just created
   - Go to the "Keys" tab
   - Click "Add Key" > "Create new key"
   - Select "JSON" and click "Create"
   - Save the downloaded JSON file securely

### 2. Set Up Firebase Project

1. Create a Firebase project
2. Enable Firestore database
3. Enable Firebase Authentication
4. Enable Firebase Cloud Functions
5. Deploy Firestore security rules

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in the required environment variables:
   ```
   # Google OAuth credentials
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
   REACT_APP_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   REACT_APP_GOOGLE_REDIRECT_URI=your_google_redirect_uri_here

   # Google Meet API credentials
   REACT_APP_GOOGLE_MEET_API_KEY=your_google_meet_api_key_here
   REACT_APP_GOOGLE_MEET_WEBHOOK_SECRET=your_google_meet_webhook_secret_here

   # Google Speech-to-Text API credentials
   REACT_APP_GOOGLE_SPEECH_TO_TEXT_API_KEY=your_google_speech_to_text_api_key_here

   # Google Drive API credentials
   REACT_APP_GOOGLE_DRIVE_API_KEY=your_google_drive_api_key_here
   REACT_APP_GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id_for_recordings

   # Calendly API key
   REACT_APP_CALENDLY_API_KEY=your_calendly_api_key_here

   # Firebase Cloud Functions configuration
   REACT_APP_FUNCTIONS_REGION=us-central1
   REACT_APP_WEBHOOK_API_KEY=your_webhook_api_key_here
   ```

### 4. Configure Firebase Functions

1. Run the service account setup script:
   ```
   cd functions
   chmod +x setup-service-account.sh
   ./setup-service-account.sh
   ```

2. Run the webhook configuration setup script:
   ```
   cd functions
   chmod +x setup-config.sh
   ./setup-config.sh
   ```

3. Make sure both scripts have your actual API keys and service account details before running

### 5. Deploy Firebase Functions

1. Deploy the functions:
   ```
   firebase deploy --only functions
   ```

### 6. Set Up Google Meet Webhook

1. Configure a webhook in the Google Cloud Console
2. Set the webhook URL to your Firebase Function URL:
   ```
   https://us-central1-your-project-id.cloudfunctions.net/processMeetRecording
   ```
3. Set the webhook secret to match your `REACT_APP_GOOGLE_MEET_WEBHOOK_SECRET`

## Usage

### Scheduling a Meeting

1. Team members connect their Google Calendar
2. Team members schedule a meeting with a client/investor/partner
3. The system automatically registers a webhook and configures auto-recording

### During the Meeting

1. The meeting is automatically recorded
2. The recording is saved to Google Drive

### After the Meeting

1. The webhook is triggered when the recording is available
2. The system downloads the recording
3. The system transcribes the recording using Google Speech-to-Text
4. The transcript is processed and stored in Firestore
5. The transcript is associated with the client/investor/partner

### Viewing Transcripts

1. Team members can view and edit transcripts in the dashboard
2. Clients/investors/partners can view (but not edit) transcripts in their portals

## Troubleshooting

### Common Issues

1. **Webhook not triggered**:
   - Check the webhook configuration in Google Cloud Console
   - Verify the webhook URL is correct
   - Verify the webhook secret is correct

2. **Recording not available**:
   - Verify the Google Meet recording was started during the meeting
   - Check the Google Drive folder for the recording
   - Verify the Google Drive API key and folder ID are correct

3. **Transcription failed**:
   - Check the Firebase Functions logs for errors
   - Verify the Google Speech-to-Text API key is correct
   - Verify the audio format is supported

### Logs

- Check the Firebase Functions logs for detailed error messages:
  ```
  firebase functions:log
  ```

## Security Considerations

1. **API Keys**: Store API keys securely and never expose them in client-side code
2. **Webhook Authentication**: Verify webhook requests using the webhook secret
3. **Access Control**: Implement proper access control in Firestore security rules
4. **Data Privacy**: Ensure meeting recordings and transcripts are only accessible to authorized users
