const functions = require("firebase-functions/v2");
const admin = require("../src/admin");
const { google } = require("googleapis");

// Process calendar tasks (create/cancel Google Calendar events)
exports.processCalendarTasks = functions.firestore.onDocumentCreated({
  document: "tasks/{taskId}",
  region: "us-central1"
}, async (event) => {
  const snapshot = event.data;
  const context = event;
    const taskData = snapshot.data();

    if (!taskData.type.startsWith("create_google_calendar") &&
        !taskData.type.startsWith("cancel_google_calendar")) {
      console.log(`Ignoring task of type: ${taskData.type}`);
      return null;
    }

    try {
      // Update task status to processing
      await snapshot.ref.update({
        status: "processing",
        processingStartedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Process the task based on its type
      if (taskData.type === "create_google_calendar_event") {
        await createGoogleCalendarEvent(taskData, snapshot.ref);
      } else if (taskData.type === "cancel_google_calendar_event") {
        await cancelGoogleCalendarEvent(taskData, snapshot.ref);
      }

      // Update task status to completed
      await snapshot.ref.update({
        status: "completed",
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return null;
    } catch (error) {
      console.error(`Error processing task ${context.params.taskId}:`, error);

      // Update task status to error
      await snapshot.ref.update({
        status: "error",
        errorMessage: error.message,
        errorAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return null;
    }
  });

// Create a Google Calendar event from a Calendly event
async function createGoogleCalendarEvent(taskData, taskRef) {
  const db = admin.firestore();

  // Get the Calendly event
  const calendlyEventDoc = await db.collection("calendlyEvents").doc(taskData.calendlyEventId).get();

  if (!calendlyEventDoc.exists) {
    throw new Error(`Calendly event not found: ${taskData.calendlyEventId}`);
  }

  const calendlyEvent = calendlyEventDoc.data();

  // Get the user's Google tokens
  const userDoc = await db.collection("users").doc(taskData.userId).get();

  if (!userDoc.exists) {
    throw new Error(`User not found: ${taskData.userId}`);
  }

  const userData = userDoc.data();

  if (!userData.googleTokens) {
    throw new Error(`User does not have Google tokens: ${taskData.userId}`);
  }

  // Create OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    functions.config().google.client_id,
    functions.config().google.client_secret,
    functions.config().google.redirect_uri
  );

  // Set credentials
  oauth2Client.setCredentials(userData.googleTokens);

  // Check if token is expired and refresh if needed
  if (userData.googleTokens.expiry_date && userData.googleTokens.expiry_date <= Date.now()) {
    try {
      const { tokens } = await oauth2Client.refreshAccessToken();

      // Update tokens in Firestore
      await userDoc.ref.update({
        "googleTokens.access_token": tokens.access_token,
        "googleTokens.expiry_date": tokens.expiry_date,
        "googleTokens.id_token": tokens.id_token || userData.googleTokens.id_token,
        "googleTokens.token_type": tokens.token_type,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Update OAuth2 client with new tokens
      oauth2Client.setCredentials(tokens);
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw new Error("Failed to refresh Google token");
    }
  }

  // Create Google Calendar API client
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  // Generate a title with FTFC convention if entity info is available
  let title = calendlyEvent.name;

  if (calendlyEvent.entityType && calendlyEvent.entityId) {
    const today = new Date().toISOString().split("T")[0];
    title = `FTFC-${calendlyEvent.entityType.toUpperCase()}-${calendlyEvent.entityId}-${today}-Calendly`;
  }

  // Create event object
  const event = {
    summary: title,
    description: `Meeting scheduled via Calendly by ${calendlyEvent.inviteeName} (${calendlyEvent.inviteeEmail})`,
    start: {
      dateTime: calendlyEvent.startTime,
      timeZone: "America/New_York" // Default timezone
    },
    end: {
      dateTime: calendlyEvent.endTime,
      timeZone: "America/New_York" // Default timezone
    },
    attendees: [
      { email: calendlyEvent.inviteeEmail }
    ],
    conferenceData: {
      createRequest: {
        requestId: `ftfc-meet-${Date.now()}`,
        conferenceSolutionKey: {
          type: "hangoutsMeet"
        }
      }
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 }, // 1 day before
        { method: "popup", minutes: 30 } // 30 minutes before
      ]
    }
  };

  // Add user's email as an attendee
  if (userData.email) {
    event.attendees.push({ email: userData.email });
  }

  // Insert event with conference data
  const response = await calendar.events.insert({
    calendarId: "primary",
    resource: event,
    conferenceDataVersion: 1,
    sendUpdates: "all" // Send emails to attendees
  });

  console.log(`Created Google Calendar event: ${response.data.id}`);

  // Update Calendly event with Google Calendar event ID
  await calendlyEventDoc.ref.update({
    googleEventId: response.data.id,
    meetingLink: response.data.hangoutLink,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  // If entity information is available, register webhook and configure auto-recording
  if (calendlyEvent.entityType && calendlyEvent.entityId) {
    // Register webhook for meeting recording notifications
    await registerMeetingWebhook(response.data, calendlyEvent.entityType, calendlyEvent.entityId);

    // Configure automatic recording for the meeting
    await configureAutoRecording(response.data);
  }

  // Update task with Google Calendar event ID
  await taskRef.update({
    googleEventId: response.data.id,
    meetingLink: response.data.hangoutLink
  });

  return response.data;
}

// Cancel a Google Calendar event
async function cancelGoogleCalendarEvent(taskData, taskRef) {
  const db = admin.firestore();

  // Get the Calendly event
  const calendlyEventDoc = await db.collection("calendlyEvents").doc(taskData.calendlyEventId).get();

  if (!calendlyEventDoc.exists) {
    throw new Error(`Calendly event not found: ${taskData.calendlyEventId}`);
  }

  const calendlyEvent = calendlyEventDoc.data();

  // Find the user who created the Google Calendar event
  const usersSnapshot = await db.collection("users")
    .where("email", "==", calendlyEvent.createdByEmail)
    .limit(1)
    .get();

  if (usersSnapshot.empty) {
    throw new Error(`User not found for email: ${calendlyEvent.createdByEmail}`);
  }

  const userData = usersSnapshot.docs[0].data();

  if (!userData.googleTokens) {
    throw new Error(`User does not have Google tokens: ${usersSnapshot.docs[0].id}`);
  }

  // Create OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    functions.config().google.client_id,
    functions.config().google.client_secret,
    functions.config().google.redirect_uri
  );

  // Set credentials
  oauth2Client.setCredentials(userData.googleTokens);

  // Check if token is expired and refresh if needed
  if (userData.googleTokens.expiry_date && userData.googleTokens.expiry_date <= Date.now()) {
    try {
      const { tokens } = await oauth2Client.refreshAccessToken();

      // Update tokens in Firestore
      await db.collection("users").doc(usersSnapshot.docs[0].id).update({
        "googleTokens.access_token": tokens.access_token,
        "googleTokens.expiry_date": tokens.expiry_date,
        "googleTokens.id_token": tokens.id_token || userData.googleTokens.id_token,
        "googleTokens.token_type": tokens.token_type,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Update OAuth2 client with new tokens
      oauth2Client.setCredentials(tokens);
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw new Error("Failed to refresh Google token");
    }
  }

  // Create Google Calendar API client
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  // Cancel the event
  await calendar.events.delete({
    calendarId: "primary",
    eventId: taskData.googleEventId,
    sendUpdates: "all" // Send emails to attendees
  });

  console.log(`Canceled Google Calendar event: ${taskData.googleEventId}`);

  // Update Calendly event
  await calendlyEventDoc.ref.update({
    googleEventStatus: "canceled",
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return null;
}

// Register a webhook for a Google Meet event
async function registerMeetingWebhook(meetingData, entityType, entityId) {
  try {
    const db = admin.firestore();

    // Create webhook data for Firestore
    const webhookData = {
      meetingId: meetingData.id,
      conferenceId: meetingData.conferenceData?.conferenceId,
      title: meetingData.summary,
      date: meetingData.start.dateTime,
      entityType,
      entityId,
      status: "registered",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Save webhook registration to Firestore
    const webhookRef = await db.collection("meetingWebhooks").add(webhookData);

    console.log(`Registered meeting webhook: ${webhookRef.id}`);

    return {
      id: webhookRef.id,
      ...webhookData
    };
  } catch (error) {
    console.error("Error registering meeting webhook:", error);
    throw error;
  }
}

// Configure automatic recording for a Google Meet event
async function configureAutoRecording(meetingData) {
  try {
    const db = admin.firestore();

    // Create recording configuration for Firestore
    const recordingConfig = {
      meetingId: meetingData.id,
      conferenceId: meetingData.conferenceData?.conferenceId,
      autoRecord: true,
      autoTranscribe: true,
      status: "configured",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Save recording configuration to Firestore
    const configRef = await db.collection("recordingConfigs").add(recordingConfig);

    console.log(`Configured auto-recording: ${configRef.id}`);

    return {
      id: configRef.id,
      ...recordingConfig
    };
  } catch (error) {
    console.error("Error configuring auto recording:", error);
    throw error;
  }
}
