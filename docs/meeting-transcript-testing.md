# Meeting Transcript Generation Testing Guide

This guide provides instructions for testing the meeting transcript generation functionality in the FTFC application.

## Prerequisites

1. Firebase CLI installed
2. Node.js and npm installed
3. Access to the FTFC Firebase project
4. Google Cloud Platform API keys and credentials

## Setup

### 1. Install Dependencies

Make sure all required dependencies are installed:

```bash
cd functions
npm install
```

### 2. Configure Firebase Functions

Set up the required configuration values:

```bash
firebase functions:config:set google.webhook_key="your-webhook-key"
firebase functions:config:set google.drive_folder_id="your-drive-folder-id"
```

### 3. Prepare a Test Recording

For testing purposes, you'll need an audio file (MP3 format) to simulate a meeting recording. Place this file at:

```
scripts/test-recording.mp3
```

## Testing the Flow

### 1. Start the Firebase Emulators

```bash
firebase emulators:start
```

### 2. Run the Test Script

```bash
node scripts/test-transcript-flow.js
```

This script will:
1. Create a test meeting in Firestore
2. Create a test client entity in Firestore
3. Upload the test recording to Firebase Storage
4. Simulate a webhook from Google Meet
5. Create and process a transcription job
6. Check the results

### 3. Clean Up Test Data

To clean up the test data after testing:

```bash
node scripts/test-transcript-flow.js --cleanup
```

## Manual Testing

### 1. Testing the Webhook

You can manually test the webhook by sending a POST request to the `processMeetRecording` endpoint:

```bash
curl -X POST https://us-central1-ftfc-start.cloudfunctions.net/processMeetRecording \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-webhook-key" \
  -d '{
    "meetingId": "test-meeting-id",
    "conferenceId": "test-conference-id",
    "recordingUrl": "https://example.com/test-recording.mp3"
  }'
```

### 2. Testing the Transcription Queue

You can manually trigger the transcription queue processing:

```bash
curl -X POST https://us-central1-ftfc-start.cloudfunctions.net/processTranscriptionQueue \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-webhook-key"
```

## Troubleshooting

### Common Issues

1. **Missing Dependencies**
   - Make sure all required npm packages are installed
   - Check for any errors in the Firebase Functions logs

2. **Authentication Issues**
   - Verify that the webhook API key is correctly set in the Firebase Functions config
   - Check that the service account has the necessary permissions

3. **Google Drive Integration Issues**
   - Ensure that the Google Drive API is enabled in the Google Cloud Console
   - Verify that the service account has access to the Google Drive folder

4. **Speech-to-Text Issues**
   - Check that the Google Speech-to-Text API is enabled
   - Verify that the audio file format is supported (MP3, WAV, FLAC)

### Checking Logs

To view the Firebase Functions logs:

```bash
firebase functions:log
```

## Production Deployment

When deploying to production, make sure to:

1. Set up proper webhook registration with Google Meet
2. Configure the Google Drive folder for storing recordings
3. Set up the necessary API keys and credentials
4. Test the flow with real meetings

## Additional Resources

- [Google Meet API Documentation](https://developers.google.com/meet)
- [Google Drive API Documentation](https://developers.google.com/drive)
- [Google Speech-to-Text API Documentation](https://cloud.google.com/speech-to-text)
- [Firebase Cloud Functions Documentation](https://firebase.google.com/docs/functions)
