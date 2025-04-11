#!/bin/bash

# This script sets up the Firebase Functions configuration for the meeting recording and transcription system

# Set Google Meet API key
firebase functions:config:set google.meet_api_key="YOUR_GOOGLE_MEET_API_KEY"

# Set Google Meet webhook secret
firebase functions:config:set google.webhook_key="YOUR_WEBHOOK_API_KEY"

# Set Google Speech-to-Text API key
firebase functions:config:set google.speech_to_text_api_key="YOUR_GOOGLE_SPEECH_TO_TEXT_API_KEY"

# Set Google Drive API key
firebase functions:config:set google.drive_api_key="YOUR_GOOGLE_DRIVE_API_KEY"

# Set Google Drive folder ID for recordings
firebase functions:config:set google.drive_folder_id="YOUR_GOOGLE_DRIVE_FOLDER_ID"

# Set Calendly API key
firebase functions:config:set calendly.api_key="YOUR_CALENDLY_API_KEY"

# Print the current configuration
firebase functions:config:get
