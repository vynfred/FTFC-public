# Google Drive Integration Testing Guide

This guide provides instructions for testing the Google Drive integration features of the FTFC application.

## Prerequisites

- Access to the FTFC application (https://ftfc-start.web.app)
- A Google account with Gemini enabled
- Test client, investor, partner, and lead data in the system

## Testing Google Drive Connection

### Connecting Google Drive

1. Log in to the FTFC application as a team member
2. Navigate to your profile page
3. Locate the Google Drive integration section
4. Click the "Connect Google Drive" button
5. You should be redirected to Google's OAuth consent screen
6. Grant the requested permissions
7. You should be redirected back to the FTFC application
8. Verify that the connection status shows as "Connected"
9. Verify that your Google account email is displayed

### Disconnecting Google Drive

1. Log in to the FTFC application as a team member
2. Navigate to your profile page
3. Locate the Google Drive integration section
4. Click the "Disconnect Google Drive" button
5. Confirm the disconnection
6. Verify that the connection status shows as "Not Connected"
7. Verify that the "Connect Google Drive" button is displayed

## Testing Gemini Notes Processing

### Manual Processing

1. Log in to the FTFC application as a team member
2. Create a test meeting with a client, investor, partner, or lead
3. Ensure the meeting includes the email addresses of the participants
4. Conduct the meeting with Gemini enabled
5. Verify that Gemini generates meeting notes
6. Run the test script to trigger manual processing:
   ```
   node test-gemini-notes.js
   ```
7. Verify that the script returns a success message
8. Navigate to the entity's detail page
9. Verify that the meeting notes appear in the notes section

### Automatic Processing

1. Log in to the FTFC application as a team member
2. Create a test meeting with a client, investor, partner, or lead
3. Ensure the meeting includes the email addresses of the participants
4. Conduct the meeting with Gemini enabled
5. Verify that Gemini generates meeting notes
6. Wait for the automatic processing to occur (runs every 2 minutes)
7. Navigate to the entity's detail page
8. Verify that the meeting notes appear in the notes section

## Testing Entity Association

### Client Meeting Notes

1. Log in to the FTFC application as a team member
2. Create a test meeting with a client
3. Ensure the meeting includes the client's email address
4. Conduct the meeting with Gemini enabled
5. Trigger the notes processing
6. Navigate to the client's detail page
7. Verify that the meeting notes appear in the notes section
8. Verify that the notes are correctly formatted and include:
   - Meeting title
   - Date and time
   - Participants
   - Summary
   - Action items (if any)

### Investor Meeting Notes

1. Log in to the FTFC application as a team member
2. Create a test meeting with an investor
3. Ensure the meeting includes the investor's email address
4. Conduct the meeting with Gemini enabled
5. Trigger the notes processing
6. Navigate to the investor's detail page
7. Verify that the meeting notes appear in the notes section
8. Verify that the notes are correctly formatted

### Partner Meeting Notes

1. Log in to the FTFC application as a team member
2. Create a test meeting with a partner
3. Ensure the meeting includes the partner's email address
4. Conduct the meeting with Gemini enabled
5. Trigger the notes processing
6. Navigate to the partner's detail page
7. Verify that the meeting notes appear in the notes section
8. Verify that the notes are correctly formatted

### Lead Meeting Notes

1. Log in to the FTFC application as a team member
2. Create a test meeting with a lead
3. Ensure the meeting includes the lead's email address
4. Conduct the meeting with Gemini enabled
5. Trigger the notes processing
6. Navigate to the lead's detail page
7. Verify that the meeting notes appear in the notes section
8. Verify that the notes are correctly formatted

## Testing Portal Access

### Client Portal

1. Log in to the FTFC application as a client
2. Navigate to your client portal
3. Verify that you can see meeting notes from meetings you participated in
4. Verify that you cannot see meeting notes from other clients

### Investor Portal

1. Log in to the FTFC application as an investor
2. Navigate to your investor portal
3. Verify that you can see meeting notes from meetings you participated in
4. Verify that you cannot see meeting notes from other investors

### Partner Portal

1. Log in to the FTFC application as a partner
2. Navigate to your partner portal
3. Verify that you can see meeting notes from meetings you participated in
4. Verify that you cannot see meeting notes from other partners

## Reporting Issues

If you encounter any issues during testing, please document them with the following information:

1. Test case ID (from the test plan)
2. Description of the issue
3. Steps to reproduce
4. Expected result
5. Actual result
6. Screenshots (if applicable)
7. Browser/device information

Submit the issue report to the development team for investigation.
