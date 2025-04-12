/**
 * Firebase Cloud Functions for FTFC Application
 */

const {onRequest} = require("firebase-functions/v2/https");
const {onCall} = require("firebase-functions/v2/https");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const axios = require("axios");
const meetingTranscripts = require('./src/meetingTranscripts');
const geminiNotesProcessor = require('./src/geminiNotesProcessor');
const googleDriveProxy = require('./src/googleDriveProxy');
const emailFunctions = require('./src/emailFunctions');
const calendlyWebhook = require('./src/calendlyWebhook');
const calendarTaskProcessor = require('./src/calendarTaskProcessor');
const slackNotifications = require('./src/slackNotifications');

// Initialize Firebase Admin
admin.initializeApp();

// Meeting Transcript Functions
exports.processMeetRecording = onRequest((request, response) => {
  return meetingTranscripts.processMeetRecording(request, response);
});

exports.processTranscriptionQueue = onSchedule({
  schedule: "every 5 minutes",
  timeZone: "America/New_York"
}, (context) => {
  return meetingTranscripts.processTranscriptionQueue(context);
});

// Gemini Notes Processing Functions
exports.processGeminiNotes = onSchedule({
  schedule: "every 2 minutes",
  timeZone: "America/New_York"
}, (context) => {
  return geminiNotesProcessor.processGeminiNotes(context);
});

exports.triggerGeminiNotesProcessing = onRequest((request, response) => {
  return geminiNotesProcessor.triggerGeminiNotesProcessing(request, response);
});

// Google Drive Proxy Functions
exports.connectGoogleDrive = onCall((data, context) => {
  return googleDriveProxy.connectGoogleDrive(data, context);
});

exports.disconnectGoogleDrive = onCall((data, context) => {
  return googleDriveProxy.disconnectGoogleDrive(data, context);
});

exports.getGoogleDriveStatus = onCall((data, context) => {
  return googleDriveProxy.getGoogleDriveStatus(data, context);
});

// Email Functions - Only export the callable function for now

// Callable Email Function
exports.sendCustomEmail = emailFunctions.sendCustomEmail;

// Calendly Webhook Functions
exports.processCalendlyWebhook = onRequest((request, response) => {
  return calendlyWebhook.processCalendlyWebhook(request, response);
});

// Calendar Task Processor Functions
exports.processCalendarTasks = calendarTaskProcessor.processCalendarTasks;

// Google Meet Auto-Recording Configuration
exports.configureMeetRecording = onRequest((request, response) => {
  // Verify API key
  const apiKey = request.headers['x-api-key'];
  if (apiKey !== process.env.WEBHOOK_API_KEY) {
    return response.status(401).send('Unauthorized');
  }

  // Log the request for debugging
  logger.info('Configure Meet Recording request:', request.body);

  // Store configuration in Firestore
  try {
    const { meetingId, conferenceId, configId, autoRecord, autoTranscribe, entityType, entityId } = request.body;

    // Update the recording config in Firestore
    const configRef = admin.firestore().collection('recordingConfigs').doc(configId);
    configRef.update({
      status: 'configured',
      entityType: entityType || null,
      entityId: entityId || null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Return success for now - this would be implemented with the Google Meet API
    return response.status(200).json({
      success: true,
      message: 'Auto-recording configured successfully',
      configId: configId,
      entityType,
      entityId
    });
  } catch (error) {
    logger.error('Error configuring auto-recording:', error);
    return response.status(500).json({
      success: false,
      message: 'Error configuring auto-recording',
      error: error.message
    });
  }
});

// Slack Notification Functions
exports.testSlackWebhook = onCall((data, context) => {
  return slackNotifications.testSlackWebhook(data, context);
});

exports.sendSlackNotification = onCall((data, context) => {
  return slackNotifications.sendSlackNotification(data, context);
});

// Slack Notification Triggers
exports.newLeadSlackNotification = functions.firestore
  .document('leads/{leadId}')
  .onCreate(async (snapshot, context) => {
    try {
      const leadData = snapshot.data();

      // Get Slack configuration
      const slackConfigDoc = await admin.firestore().collection('settings').doc('slack').get();
      if (!slackConfigDoc.exists || !slackConfigDoc.data().enabled || !slackConfigDoc.data().webhookUrl) {
        return null; // Slack not configured
      }

      const slackConfig = slackConfigDoc.data();

      // Check if this notification type is enabled
      if (!slackConfig.notificationTypes?.new_lead) {
        return null; // This notification type is disabled
      }

      // Get the channel for this notification type
      const channel = slackConfig.channels?.new_lead || slackConfig.defaultChannel;

      if (!channel) {
        return null; // No channel configured
      }

      // Generate lead link
      const leadLink = `https://${process.env.GCLOUD_PROJECT}.web.app/dashboard/leads/${context.params.leadId}`;

      // Send Slack notification
      const notificationData = {
        ...leadData,
        leadLink
      };

      // Generate the message
      const message = {
        channel: channel,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '🎯 New Lead Received',
              emoji: true
            }
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Name:*\n${leadData.firstName} ${leadData.lastName}`
              },
              {
                type: 'mrkdwn',
                text: `*Company:*\n${leadData.companyName || 'N/A'}`
              },
              {
                type: 'mrkdwn',
                text: `*Email:*\n${leadData.email}`
              },
              {
                type: 'mrkdwn',
                text: `*Phone:*\n${leadData.phone || 'N/A'}`
              }
            ]
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Source:*\n${leadData.source || 'Direct'}`
              },
              {
                type: 'mrkdwn',
                text: `*Received:*\n${new Date().toLocaleString()}`
              }
            ]
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'View Lead',
                  emoji: true
                },
                url: leadLink
              }
            ]
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `Sent from FTFC Application • ${new Date().toLocaleString()}`
              }
            ]
          }
        ]
      };

      // Send the message
      await axios.post(slackConfig.webhookUrl, message);

      // Log the notification
      await admin.firestore().collection('notificationLogs').add({
        type: 'slack',
        notificationType: 'new_lead',
        channel,
        data: notificationData,
        success: true,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      logger.error('Error sending Slack notification for new lead:', error);
      return { success: false, error: error.message };
    }
  });
