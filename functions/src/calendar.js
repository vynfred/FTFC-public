/**
 * Firebase Cloud Functions for Google Calendar Integration
 * 
 * These functions handle Google Calendar operations securely on the server side.
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');

// Initialize admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Create a Google Calendar event with Google Meet
 */
exports.createCalendarEvent = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to create calendar events'
    );
  }

  try {
    const {
      title,
      description,
      startDateTime,
      endDateTime,
      attendees,
      sendNotifications = true,
      addConferenceData = true,
      entityType,
      entityId,
      entityName
    } = data;
    
    // Validate required fields
    if (!title || !startDateTime || !endDateTime) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Title, start time, and end time are required'
      );
    }
    
    // Get user document with tokens
    const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    
    if (!userDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'User document not found'
      );
    }
    
    const userData = userDoc.data();
    
    // Check if tokens exist
    if (!userData.googleTokens || !userData.googleTokens.accessToken) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'No Google tokens found for user'
      );
    }
    
    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      functions.config().google.client_id,
      functions.config().google.client_secret,
      functions.config().google.redirect_uri
    );
    
    // Set credentials
    oauth2Client.setCredentials({
      access_token: userData.googleTokens.accessToken,
      refresh_token: userData.googleTokens.refreshToken
    });
    
    // Create Calendar API client
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    // Get user timezone or use default
    const userTimezone = userData.timezone || 'America/New_York';
    
    // Create event object with proper naming convention for FTFC meetings
    // Format: FTFC-[EntityType]-[EntityID]-[Date]-[EntityName]
    let eventSummary = title;
    
    // Add FTFC prefix if not already present
    if (!eventSummary.startsWith('FTFC')) {
      if (entityType && entityId) {
        const dateStr = new Date(startDateTime).toISOString().split('T')[0];
        eventSummary = `FTFC-${entityType}-${entityId}-${dateStr}-${title}`;
      } else {
        eventSummary = `FTFC-${title}`;
      }
    }
    
    // Create event object
    const event = {
      summary: eventSummary,
      description: description || 'Meeting scheduled via FTFC platform',
      start: {
        dateTime: startDateTime,
        timeZone: userTimezone
      },
      end: {
        dateTime: endDateTime,
        timeZone: userTimezone
      },
      attendees: attendees ? attendees.map(email => ({ email })) : [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 } // 30 minutes before
        ]
      }
    };
    
    // Add conference data if requested
    if (addConferenceData) {
      event.conferenceData = {
        createRequest: {
          requestId: `ftfc-meet-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      };
    }
    
    // Insert event with conference data
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: addConferenceData ? 1 : 0,
      sendUpdates: sendNotifications ? 'all' : 'none' // Send emails to attendees if requested
    });
    
    // Store the event in Firestore for reference
    const meetingRef = await admin.firestore().collection('meetings').add({
      googleEventId: response.data.id,
      title: response.data.summary,
      description: response.data.description,
      startTime: response.data.start.dateTime,
      endTime: response.data.end.dateTime,
      attendees: response.data.attendees?.map(a => a.email) || [],
      meetingLink: response.data.hangoutLink,
      conferenceData: response.data.conferenceData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: context.auth.uid,
      // Add entity information if available
      entityType: entityType || null,
      entityId: entityId || null,
      entityName: entityName || null
    });
    
    // Return event data with meeting ID
    return {
      ...response.data,
      ftfcMeetingId: meetingRef.id
    };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    
    // Handle token expiration
    if (error.message.includes('invalid_grant') || error.message.includes('token expired')) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Google authentication has expired. Please reconnect your Google account.',
        error.message
      );
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'Error creating calendar event',
      error.message
    );
  }
});

/**
 * List calendar events
 */
exports.listCalendarEvents = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to list calendar events'
    );
  }

  try {
    const {
      timeMin = new Date().toISOString(),
      timeMax,
      maxResults = 100,
      companyWide = true,
      entityType,
      entityId,
      includePast = false,
      meetOnly = false
    } = data;
    
    // Get user document with tokens
    const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    
    if (!userDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'User document not found'
      );
    }
    
    const userData = userDoc.data();
    
    // Check if tokens exist
    if (!userData.googleTokens || !userData.googleTokens.accessToken) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'No Google tokens found for user'
      );
    }
    
    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      functions.config().google.client_id,
      functions.config().google.client_secret,
      functions.config().google.redirect_uri
    );
    
    // Set credentials
    oauth2Client.setCredentials({
      access_token: userData.googleTokens.accessToken,
      refresh_token: userData.googleTokens.refreshToken
    });
    
    // Create Calendar API client
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    // Set time range
    const effectiveTimeMin = includePast 
      ? new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString() 
      : timeMin;
    
    // Get events from Google Calendar
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: effectiveTimeMin,
      timeMax: timeMax || undefined,
      maxResults: maxResults * 2, // Get more events than needed to account for filtering
      singleEvents: true,
      orderBy: 'startTime'
    });
    
    let events = response.data.items || [];
    
    // Filter for Google Meet events if meetOnly is true
    if (meetOnly) {
      events = events.filter(event =>
        event.conferenceData &&
        event.conferenceData.conferenceSolution &&
        event.conferenceData.conferenceSolution.key.type === 'hangoutsMeet'
      );
    }
    
    // If not company-wide, filter for events created by the current user
    if (!companyWide) {
      const userEmail = userData.email;
      
      if (userEmail) {
        events = events.filter(event => {
          // Check if user is the creator or an attendee
          const isCreator = event.creator?.email === userEmail;
          const isAttendee = event.attendees?.some(attendee => attendee.email === userEmail);
          return isCreator || isAttendee;
        });
      }
    }
    
    // If entity filtering is requested, get events from Firestore
    if (entityType && entityId) {
      // Query Firestore for meetings associated with this entity
      const meetingsQuery = await admin.firestore().collection('meetings')
        .where('entityType', '==', entityType)
        .where('entityId', '==', entityId)
        .get();
      
      const entityMeetingIds = meetingsQuery.docs.map(doc => doc.data().googleEventId);
      
      // Filter Google Calendar events to only those associated with this entity
      events = events.filter(event => entityMeetingIds.includes(event.id));
    }
    
    // Limit to requested number of results
    events = events.slice(0, maxResults);
    
    return events;
  } catch (error) {
    console.error('Error listing calendar events:', error);
    
    // Handle token expiration
    if (error.message.includes('invalid_grant') || error.message.includes('token expired')) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Google authentication has expired. Please reconnect your Google account.',
        error.message
      );
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'Error listing calendar events',
      error.message
    );
  }
});

/**
 * Get meeting transcripts from Google Drive
 */
exports.getMeetingTranscripts = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to get meeting transcripts'
    );
  }

  try {
    const { meetingId } = data;
    
    if (!meetingId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Meeting ID is required'
      );
    }
    
    // Get user document with tokens
    const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    
    if (!userDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'User document not found'
      );
    }
    
    const userData = userDoc.data();
    
    // Check if tokens exist
    if (!userData.googleTokens || !userData.googleTokens.accessToken) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'No Google tokens found for user'
      );
    }
    
    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      functions.config().google.client_id,
      functions.config().google.client_secret,
      functions.config().google.redirect_uri
    );
    
    // Set credentials
    oauth2Client.setCredentials({
      access_token: userData.googleTokens.accessToken,
      refresh_token: userData.googleTokens.refreshToken
    });
    
    // Create Drive API client
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    
    // Extract meeting code from meetingId if it's a full URL
    let searchQuery = meetingId;
    if (meetingId.includes('meet.google.com')) {
      const meetCodeMatch = meetingId.match(/([a-z0-9-]{10,})/i);
      if (meetCodeMatch) {
        searchQuery = meetCodeMatch[1];
      }
    }
    
    // Search for Gemini Notes documents
    // Gemini Notes typically have "Meeting notes" or "Meeting transcript" in the title
    const geminiNotesQuery = `(name contains 'Meeting notes' or name contains 'Meeting transcript') and mimeType='application/vnd.google-apps.document'`;
    
    // Add meeting-specific search if we have a meeting ID
    const meetingQuery = searchQuery ?
      `${geminiNotesQuery} and (name contains '${searchQuery}' or fullText contains '${searchQuery}')` :
      geminiNotesQuery;
    
    // Search for Gemini Notes documents
    const response = await drive.files.list({
      q: meetingQuery,
      fields: 'files(id, name, webViewLink, createdTime, mimeType, description, thumbnailLink)',
      orderBy: 'createdTime desc',
      pageSize: 10
    });
    
    const transcriptFiles = response.data.files || [];
    
    // For each Google Doc, extract the content
    const docs = google.docs({ version: 'v1', auth: oauth2Client });
    
    for (const file of transcriptFiles) {
      try {
        const docContent = await docs.documents.get({ documentId: file.id });
        
        // Extract text content from the document
        let textContent = '';
        let summary = '';
        let keyPoints = [];
        let actionItems = [];
        let participants = [];
        
        if (docContent.data && docContent.data.body && docContent.data.body.content) {
          // Process document sections
          let currentSection = '';
          
          docContent.data.body.content.forEach(element => {
            // Check for headings to identify sections
            if (element.paragraph && element.paragraph.paragraphStyle &&
                element.paragraph.paragraphStyle.namedStyleType &&
                element.paragraph.paragraphStyle.namedStyleType.includes('HEADING')) {
              
              // Extract heading text
              let headingText = '';
              if (element.paragraph.elements) {
                element.paragraph.elements.forEach(el => {
                  if (el.textRun && el.textRun.content) {
                    headingText += el.textRun.content.trim();
                  }
                });
              }
              
              // Set current section based on heading
              if (headingText.toLowerCase().includes('summary')) {
                currentSection = 'summary';
              } else if (headingText.toLowerCase().includes('key point') ||
                         headingText.toLowerCase().includes('main point')) {
                currentSection = 'keyPoints';
              } else if (headingText.toLowerCase().includes('action item') ||
                         headingText.toLowerCase().includes('next step')) {
                currentSection = 'actionItems';
              } else if (headingText.toLowerCase().includes('participant') ||
                         headingText.toLowerCase().includes('attendee')) {
                currentSection = 'participants';
              } else if (headingText.toLowerCase().includes('transcript')) {
                currentSection = 'transcript';
              } else {
                currentSection = 'other';
              }
            }
            
            // Extract text content based on current section
            if (element.paragraph && element.paragraph.elements) {
              let paragraphText = '';
              
              element.paragraph.elements.forEach(paraElement => {
                if (paraElement.textRun && paraElement.textRun.content) {
                  paragraphText += paraElement.textRun.content;
                }
              });
              
              // Add to appropriate section
              if (currentSection === 'summary') {
                summary += paragraphText;
              } else if (currentSection === 'keyPoints') {
                // Extract bullet points
                if (paragraphText.trim().startsWith('•') || paragraphText.trim().startsWith('-')) {
                  keyPoints.push(paragraphText.trim().replace(/^[•\-]\s*/, ''));
                }
              } else if (currentSection === 'actionItems') {
                // Extract bullet points
                if (paragraphText.trim().startsWith('•') || paragraphText.trim().startsWith('-')) {
                  actionItems.push(paragraphText.trim().replace(/^[•\-]\s*/, ''));
                }
              } else if (currentSection === 'participants') {
                // Extract email addresses
                const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
                const emails = paragraphText.match(emailRegex);
                if (emails) {
                  participants = participants.concat(emails);
                }
              }
              
              // Add to full text content
              textContent += paragraphText;
            }
          });
        }
        
        // Store extracted content
        file.textContent = textContent;
        file.summary = summary.trim();
        file.keyPoints = keyPoints;
        file.actionItems = actionItems;
        file.participants = [...new Set(participants)]; // Remove duplicates
        file.sourceType = 'gemini';
      } catch (docError) {
        console.error('Error getting document content:', docError);
        file.textContent = 'Error retrieving transcript content';
        file.sourceType = 'gemini';
      }
    }
    
    return transcriptFiles;
  } catch (error) {
    console.error('Error getting meeting transcripts:', error);
    
    // Handle token expiration
    if (error.message.includes('invalid_grant') || error.message.includes('token expired')) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Google authentication has expired. Please reconnect your Google account.',
        error.message
      );
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'Error getting meeting transcripts',
      error.message
    );
  }
});

/**
 * Check Google connection status
 */
exports.checkGoogleConnection = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to check Google connection'
    );
  }

  try {
    // Get user document with tokens
    const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    
    if (!userDoc.exists) {
      return { connected: false };
    }
    
    const userData = userDoc.data();
    
    // Check if tokens exist
    if (!userData.googleTokens || !userData.googleTokens.accessToken) {
      return { connected: false };
    }
    
    // Check if token is expired
    const expiryDate = userData.googleTokens.expiryDate;
    const isExpired = !expiryDate || Date.now() >= expiryDate;
    
    if (isExpired && !userData.googleTokens.refreshToken) {
      return { connected: false };
    }
    
    return { connected: true };
  } catch (error) {
    console.error('Error checking Google connection:', error);
    return { connected: false };
  }
});

/**
 * Disconnect Google account
 */
exports.disconnectGoogle = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to disconnect Google account'
    );
  }

  try {
    // Get user document with tokens
    const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    
    if (!userDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'User document not found'
      );
    }
    
    const userData = userDoc.data();
    
    // Check if tokens exist
    if (!userData.googleTokens || !userData.googleTokens.accessToken) {
      // No tokens to revoke
      return { success: true };
    }
    
    // Revoke access token
    if (userData.googleTokens.accessToken) {
      try {
        const axios = require('axios');
        await axios.get(
          `https://accounts.google.com/o/oauth2/revoke?token=${userData.googleTokens.accessToken}`
        );
      } catch (revokeError) {
        console.error('Error revoking access token:', revokeError);
        // Continue even if revocation fails
      }
    }
    
    // Remove tokens from Firestore
    await admin.firestore().collection('users').doc(context.auth.uid).update({
      googleTokens: admin.firestore.FieldValue.delete()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error disconnecting Google account:', error);
    
    throw new functions.https.HttpsError(
      'internal',
      'Error disconnecting Google account',
      error.message
    );
  }
});
