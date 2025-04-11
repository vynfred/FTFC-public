const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const crypto = require("crypto");

// Process Calendly webhook events
exports.processCalendlyWebhook = functions.https.onRequest(async (req, res) => {
  try {
    // Verify the webhook signature
    const signature = req.headers["calendly-webhook-signature"];
    const webhookSecret = functions.config().calendly.webhook_secret;
    
    if (!signature || !webhookSecret) {
      console.error("Missing signature or webhook secret");
      return res.status(401).send("Unauthorized");
    }
    
    // Verify signature
    const payload = JSON.stringify(req.body);
    const hmac = crypto.createHmac("sha256", webhookSecret);
    const digest = hmac.update(payload).digest("hex");
    
    if (signature !== digest) {
      console.error("Invalid signature");
      return res.status(401).send("Unauthorized");
    }
    
    // Process the event
    const event = req.body;
    const eventType = event.payload.event;
    const eventData = event.payload.data;
    
    console.log(`Processing Calendly event: ${eventType}`);
    
    // Handle different event types
    switch (eventType) {
      case "invitee.created":
        await handleInviteeCreated(eventData);
        break;
      case "invitee.canceled":
        await handleInviteeCanceled(eventData);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }
    
    return res.status(200).send("Event processed");
  } catch (error) {
    console.error("Error processing Calendly webhook:", error);
    return res.status(500).send("Internal server error");
  }
});

// Handle invitee.created event
async function handleInviteeCreated(eventData) {
  try {
    // Get event details
    const eventUri = eventData.event;
    const inviteeUri = eventData.uri;
    
    // Get event details from Calendly API
    const eventResponse = await axios.get(eventUri, {
      headers: {
        "Authorization": `Bearer ${functions.config().calendly.api_key}`,
        "Content-Type": "application/json"
      }
    });
    
    const eventDetails = eventResponse.data.resource;
    
    // Get invitee details from Calendly API
    const inviteeResponse = await axios.get(inviteeUri, {
      headers: {
        "Authorization": `Bearer ${functions.config().calendly.api_key}`,
        "Content-Type": "application/json"
      }
    });
    
    const inviteeDetails = inviteeResponse.data.resource;
    
    // Store the event in Firestore
    const db = admin.firestore();
    
    // Check if this is associated with an FTFC entity
    // Look for custom questions that might identify the entity
    let entityType = null;
    let entityId = null;
    
    if (inviteeDetails.questions_and_answers) {
      for (const qa of inviteeDetails.questions_and_answers) {
        if (qa.question.toLowerCase().includes("client id") || 
            qa.question.toLowerCase().includes("investor id") || 
            qa.question.toLowerCase().includes("partner id")) {
          entityId = qa.answer;
        }
        
        if (qa.question.toLowerCase().includes("entity type")) {
          entityType = qa.answer.toLowerCase();
        }
      }
    }
    
    // Store the Calendly event
    const calendlyEventRef = await db.collection("calendlyEvents").add({
      calendlyEventUri: eventUri,
      inviteeUri: inviteeUri,
      name: eventDetails.name,
      startTime: eventDetails.start_time,
      endTime: eventDetails.end_time,
      inviteeEmail: inviteeDetails.email,
      inviteeName: inviteeDetails.name,
      status: "active",
      entityType,
      entityId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Stored Calendly event: ${calendlyEventRef.id}`);
    
    // If we have Google Calendar integration enabled, create a Google Calendar event
    if (functions.config().google && functions.config().google.client_id) {
      // Find the user associated with this Calendly event
      const usersSnapshot = await db.collection("users")
        .where("calendlyUri", "==", eventDetails.event_memberships[0].user)
        .limit(1)
        .get();
      
      if (!usersSnapshot.empty) {
        const userData = usersSnapshot.docs[0].data();
        
        // If user has Google tokens, create a Google Calendar event
        if (userData.googleTokens) {
          // Create a Google Calendar event
          // This would be implemented in a separate function
          // that calls the Google Calendar API
          console.log("Creating Google Calendar event for Calendly event");
          
          // Queue a task to create the Google Calendar event
          const taskRef = await db.collection("tasks").add({
            type: "create_google_calendar_event",
            calendlyEventId: calendlyEventRef.id,
            userId: usersSnapshot.docs[0].id,
            status: "pending",
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
          
          console.log(`Queued task to create Google Calendar event: ${taskRef.id}`);
        }
      }
    }
  } catch (error) {
    console.error("Error handling invitee.created event:", error);
    throw error;
  }
}

// Handle invitee.canceled event
async function handleInviteeCanceled(eventData) {
  try {
    // Get invitee details
    const inviteeUri = eventData.uri;
    
    // Find the Calendly event in Firestore
    const db = admin.firestore();
    const eventsSnapshot = await db.collection("calendlyEvents")
      .where("inviteeUri", "==", inviteeUri)
      .limit(1)
      .get();
    
    if (eventsSnapshot.empty) {
      console.log(`No Calendly event found for invitee URI: ${inviteeUri}`);
      return;
    }
    
    const eventDoc = eventsSnapshot.docs[0];
    const eventData = eventDoc.data();
    
    // Update the event status
    await eventDoc.ref.update({
      status: "canceled",
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Updated Calendly event status to canceled: ${eventDoc.id}`);
    
    // If there's a Google Calendar event associated with this Calendly event,
    // cancel it as well
    if (eventData.googleEventId) {
      // Queue a task to cancel the Google Calendar event
      await db.collection("tasks").add({
        type: "cancel_google_calendar_event",
        calendlyEventId: eventDoc.id,
        googleEventId: eventData.googleEventId,
        status: "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`Queued task to cancel Google Calendar event: ${eventData.googleEventId}`);
    }
  } catch (error) {
    console.error("Error handling invitee.canceled event:", error);
    throw error;
  }
}
