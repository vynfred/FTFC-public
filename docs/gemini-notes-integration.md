# Gemini Notes Integration

This document describes the integration between Google Gemini's meeting notes and the FTFC application.

## Overview

The system automatically processes meeting notes created by Google Gemini, extracts participant information, determines which client/investor/partner the meeting was with, and associates the notes with the appropriate entity in the FTFC application. The notes are then made available in the respective portals.

## Components

1. **Frontend Components**:
   - `MeetingTranscriptList`: Displays a list of meeting transcripts for an entity
   - `MeetingTranscript`: Displays a single meeting transcript

2. **Services**:
   - `geminiNotesMonitor.js`: Frontend service for monitoring and processing Gemini notes
   - `meetingTranscriptService.js`: Handles storage and retrieval of meeting transcripts

3. **Firebase Cloud Functions**:
   - `processGeminiNotes`: Background function that runs every 15 minutes to process new Gemini notes
   - `triggerGeminiNotesProcessing`: HTTP endpoint to manually trigger Gemini notes processing

4. **Database Collections**:
   - `transcripts`: Stores meeting transcripts
   - `processedNotes`: Tracks which Gemini notes have been processed
   - `activity`: Stores activity logs

## How It Works

### Automatic Processing

1. The `processGeminiNotes` Cloud Function runs every 15 minutes
2. It scans team members' Google Drive folders for new Gemini-generated meeting notes
3. For each note:
   - Extracts the content of the document
   - Identifies email addresses in the content to determine participants
   - Determines which entity (client/investor/partner) the meeting was with
   - Creates a transcript record in the database
   - Associates the transcript with the entity
   - Marks the note as processed

### Manual Processing

1. The `triggerGeminiNotesProcessing` HTTP endpoint can be called to manually trigger processing
2. This is useful for processing notes that were missed by the automatic processing

### Viewing Transcripts

1. Team members can view and edit transcripts in the dashboard
2. Clients/investors/partners can view (but not edit) transcripts in their portals

## Setup

1. Ensure team members have connected their Google accounts to the FTFC application
2. Ensure team members have enabled Google Drive access
3. Deploy the Cloud Functions to Firebase

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

## Future Enhancements

1. **AI-powered summary generation**: Use AI to generate summaries of meeting notes
2. **Action item extraction**: Automatically extract action items from meeting notes
3. **Integration with calendar**: Link meeting notes to calendar events
4. **Notification system**: Notify team members when new meeting notes are processed
