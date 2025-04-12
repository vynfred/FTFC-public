/**
 * Slack Notifications Functions
 * 
 * These functions handle sending notifications to Slack.
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

// Get Firestore instance
const db = admin.firestore();

// Notification types
const NOTIFICATION_TYPES = {
  NEW_LEAD: 'new_lead',
  LEAD_UPDATED: 'lead_updated',
  NEW_CLIENT: 'new_client',
  NEW_INVESTOR: 'new_investor',
  NEW_PARTNER: 'new_partner',
  MEETING_SCHEDULED: 'meeting_scheduled',
  MEETING_CANCELED: 'meeting_canceled',
  DOCUMENT_UPLOADED: 'document_uploaded',
  MILESTONE_COMPLETED: 'milestone_completed',
  TRANSCRIPT_CREATED: 'transcript_created',
  ACTION_ITEM_CREATED: 'action_item_created',
  ACTION_ITEM_COMPLETED: 'action_item_completed',
  REFERRAL_RECEIVED: 'referral_received'
};

/**
 * Test a Slack webhook
 * @param {Object} data - Request data
 * @param {string} data.webhookUrl - Slack webhook URL
 * @returns {Promise<Object>} - Result of the test
 */
exports.testSlackWebhook = functions.https.onCall(async (data, context) => {
  try {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.'
      );
    }
    
    // Verify admin role
    const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only admins can test Slack webhooks.'
      );
    }
    
    // Validate webhook URL
    const { webhookUrl } = data;
    if (!webhookUrl || !webhookUrl.startsWith('https://hooks.slack.com/')) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid Slack webhook URL.'
      );
    }
    
    // Send a test message
    const response = await axios.post(webhookUrl, {
      text: '🎉 *FTFC Slack Integration Test*\n\nThis is a test message from the FTFC application. If you can see this, the Slack integration is working correctly!',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🎉 FTFC Slack Integration Test',
            emoji: true
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'This is a test message from the FTFC application. If you can see this, the Slack integration is working correctly!'
          }
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Test sent by: ${userDoc.data().name || context.auth.token.email} at ${new Date().toLocaleString()}`
            }
          ]
        }
      ]
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error testing Slack webhook:', error);
    
    // Check if it's a Slack API error
    if (error.response && error.response.data) {
      return {
        success: false,
        error: error.response.data.error || 'Slack API error',
        details: error.response.data
      };
    }
    
    return {
      success: false,
      error: error.message
    };
  }
});

/**
 * Send a notification to Slack
 * @param {Object} data - Notification data
 * @param {string} data.type - Notification type
 * @param {Object} data.data - Data for the notification
 * @param {string} data.channel - Slack channel
 * @param {string} data.webhookUrl - Slack webhook URL
 * @returns {Promise<Object>} - Result of the operation
 */
exports.sendSlackNotification = functions.https.onCall(async (data, context) => {
  try {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.'
      );
    }
    
    // Validate data
    const { type, data: notificationData, channel, webhookUrl } = data;
    
    if (!type || !notificationData || !webhookUrl) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required parameters.'
      );
    }
    
    // Generate the message
    const message = generateSlackMessage(type, notificationData, channel);
    
    // Send the message
    const response = await axios.post(webhookUrl, message);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending Slack notification:', error);
    
    // Check if it's a Slack API error
    if (error.response && error.response.data) {
      return {
        success: false,
        error: error.response.data.error || 'Slack API error',
        details: error.response.data
      };
    }
    
    return {
      success: false,
      error: error.message
    };
  }
});

/**
 * Generate a Slack message for a notification type
 * @param {string} type - Notification type
 * @param {Object} data - Data for the notification
 * @param {string} channel - Slack channel
 * @returns {Object} - Slack message
 */
function generateSlackMessage(type, data, channel) {
  // Base message object
  const message = {
    channel: channel,
    blocks: []
  };
  
  // Add header based on notification type
  switch (type) {
    case NOTIFICATION_TYPES.NEW_LEAD:
      message.blocks.push(
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
              text: `*Name:*\n${data.firstName} ${data.lastName}`
            },
            {
              type: 'mrkdwn',
              text: `*Company:*\n${data.companyName || 'N/A'}`
            },
            {
              type: 'mrkdwn',
              text: `*Email:*\n${data.email}`
            },
            {
              type: 'mrkdwn',
              text: `*Phone:*\n${data.phone || 'N/A'}`
            }
          ]
        }
      );
      
      if (data.source) {
        message.blocks.push({
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Source:*\n${data.source}`
            },
            {
              type: 'mrkdwn',
              text: `*Received:*\n${new Date().toLocaleString()}`
            }
          ]
        });
      }
      
      if (data.leadLink) {
        message.blocks.push({
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Lead',
                emoji: true
              },
              url: data.leadLink
            }
          ]
        });
      }
      break;
      
    case NOTIFICATION_TYPES.LEAD_UPDATED:
      message.blocks.push(
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🔄 Lead Updated',
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Lead:*\n${data.firstName} ${data.lastName}`
            },
            {
              type: 'mrkdwn',
              text: `*Company:*\n${data.companyName || 'N/A'}`
            }
          ]
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Status:*\n${data.status || 'N/A'}`
            },
            {
              type: 'mrkdwn',
              text: `*Updated By:*\n${data.updatedBy || 'System'}`
            }
          ]
        }
      );
      
      if (data.changes && data.changes.length > 0) {
        const changesText = data.changes.map(change => 
          `• ${change.field}: ${change.oldValue} → ${change.newValue}`
        ).join('\n');
        
        message.blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Changes:*\n${changesText}`
          }
        });
      }
      
      if (data.leadLink) {
        message.blocks.push({
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Lead',
                emoji: true
              },
              url: data.leadLink
            }
          ]
        });
      }
      break;
      
    case NOTIFICATION_TYPES.NEW_CLIENT:
      message.blocks.push(
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🤝 New Client Added',
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Client:*\n${data.name}`
            },
            {
              type: 'mrkdwn',
              text: `*Contact:*\n${data.contactName || 'N/A'}`
            },
            {
              type: 'mrkdwn',
              text: `*Email:*\n${data.email || 'N/A'}`
            },
            {
              type: 'mrkdwn',
              text: `*Added By:*\n${data.addedBy || 'System'}`
            }
          ]
        }
      );
      
      if (data.clientLink) {
        message.blocks.push({
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Client',
                emoji: true
              },
              url: data.clientLink
            }
          ]
        });
      }
      break;
      
    case NOTIFICATION_TYPES.NEW_INVESTOR:
      message.blocks.push(
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '💰 New Investor Added',
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Investor:*\n${data.name}`
            },
            {
              type: 'mrkdwn',
              text: `*Contact:*\n${data.contactName || 'N/A'}`
            },
            {
              type: 'mrkdwn',
              text: `*Email:*\n${data.email || 'N/A'}`
            },
            {
              type: 'mrkdwn',
              text: `*Added By:*\n${data.addedBy || 'System'}`
            }
          ]
        }
      );
      
      if (data.investorLink) {
        message.blocks.push({
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Investor',
                emoji: true
              },
              url: data.investorLink
            }
          ]
        });
      }
      break;
      
    case NOTIFICATION_TYPES.NEW_PARTNER:
      message.blocks.push(
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🤝 New Partner Added',
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Partner:*\n${data.name}`
            },
            {
              type: 'mrkdwn',
              text: `*Contact:*\n${data.contactName || 'N/A'}`
            },
            {
              type: 'mrkdwn',
              text: `*Email:*\n${data.email || 'N/A'}`
            },
            {
              type: 'mrkdwn',
              text: `*Added By:*\n${data.addedBy || 'System'}`
            }
          ]
        }
      );
      
      if (data.partnerLink) {
        message.blocks.push({
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Partner',
                emoji: true
              },
              url: data.partnerLink
            }
          ]
        });
      }
      break;
      
    case NOTIFICATION_TYPES.MEETING_SCHEDULED:
      message.blocks.push(
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '📅 Meeting Scheduled',
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Title:*\n${data.title}`
            },
            {
              type: 'mrkdwn',
              text: `*Date:*\n${data.date}`
            },
            {
              type: 'mrkdwn',
              text: `*Time:*\n${data.startTime} - ${data.endTime}`
            },
            {
              type: 'mrkdwn',
              text: `*Organizer:*\n${data.organizer || 'N/A'}`
            }
          ]
        }
      );
      
      if (data.attendees && data.attendees.length > 0) {
        const attendeesText = data.attendees.map(attendee => 
          `• ${attendee.name || attendee.email || attendee}`
        ).join('\n');
        
        message.blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Attendees:*\n${attendeesText}`
          }
        });
      }
      
      if (data.meetingLink) {
        message.blocks.push({
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Join Meeting',
                emoji: true
              },
              url: data.meetingLink
            }
          ]
        });
      }
      break;
      
    case NOTIFICATION_TYPES.MEETING_CANCELED:
      message.blocks.push(
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '❌ Meeting Canceled',
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Title:*\n${data.title}`
            },
            {
              type: 'mrkdwn',
              text: `*Date:*\n${data.date}`
            },
            {
              type: 'mrkdwn',
              text: `*Time:*\n${data.startTime} - ${data.endTime}`
            },
            {
              type: 'mrkdwn',
              text: `*Canceled By:*\n${data.canceledBy || 'N/A'}`
            }
          ]
        }
      );
      
      if (data.reason) {
        message.blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Reason:*\n${data.reason}`
          }
        });
      }
      break;
      
    case NOTIFICATION_TYPES.DOCUMENT_UPLOADED:
      message.blocks.push(
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '📄 Document Uploaded',
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Document:*\n${data.name}`
            },
            {
              type: 'mrkdwn',
              text: `*Type:*\n${data.type || 'N/A'}`
            },
            {
              type: 'mrkdwn',
              text: `*Uploaded By:*\n${data.uploadedBy || 'N/A'}`
            },
            {
              type: 'mrkdwn',
              text: `*Size:*\n${formatFileSize(data.size) || 'N/A'}`
            }
          ]
        }
      );
      
      if (data.entityType && data.entityName) {
        message.blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Related To:*\n${capitalizeFirstLetter(data.entityType)}: ${data.entityName}`
          }
        });
      }
      
      if (data.documentLink) {
        message.blocks.push({
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Document',
                emoji: true
              },
              url: data.documentLink
            }
          ]
        });
      }
      break;
      
    case NOTIFICATION_TYPES.MILESTONE_COMPLETED:
      message.blocks.push(
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🏆 Milestone Completed',
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Milestone:*\n${data.title}`
            },
            {
              type: 'mrkdwn',
              text: `*Completed By:*\n${data.completedBy || 'N/A'}`
            }
          ]
        }
      );
      
      if (data.entityType && data.entityName) {
        message.blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Related To:*\n${capitalizeFirstLetter(data.entityType)}: ${data.entityName}`
          }
        });
      }
      
      if (data.description) {
        message.blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Description:*\n${data.description}`
          }
        });
      }
      
      if (data.entityLink) {
        message.blocks.push({
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: `View ${capitalizeFirstLetter(data.entityType)}`,
                emoji: true
              },
              url: data.entityLink
            }
          ]
        });
      }
      break;
      
    case NOTIFICATION_TYPES.TRANSCRIPT_CREATED:
      message.blocks.push(
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '📝 Meeting Transcript Available',
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Meeting:*\n${data.title}`
            },
            {
              type: 'mrkdwn',
              text: `*Date:*\n${data.date}`
            }
          ]
        }
      );
      
      if (data.summary) {
        message.blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Summary:*\n${data.summary}`
          }
        });
      }
      
      if (data.keyPoints && data.keyPoints.length > 0) {
        const keyPointsText = data.keyPoints.slice(0, 3).map(point => 
          `• ${point}`
        ).join('\n');
        
        message.blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Key Points:*\n${keyPointsText}${data.keyPoints.length > 3 ? '\n_...and more_' : ''}`
          }
        });
      }
      
      if (data.transcriptLink) {
        message.blocks.push({
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Transcript',
                emoji: true
              },
              url: data.transcriptLink
            }
          ]
        });
      }
      break;
      
    case NOTIFICATION_TYPES.ACTION_ITEM_CREATED:
      message.blocks.push(
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '✅ Action Item Created',
            emoji: true
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Action Item:*\n${data.description}`
          }
        }
      );
      
      if (data.assignee || data.dueDate) {
        message.blocks.push({
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Assignee:*\n${data.assignee || 'Unassigned'}`
            },
            {
              type: 'mrkdwn',
              text: `*Due Date:*\n${data.dueDate || 'No due date'}`
            }
          ]
        });
      }
      
      if (data.meetingTitle) {
        message.blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*From Meeting:*\n${data.meetingTitle}`
          }
        });
      }
      
      if (data.actionItemLink) {
        message.blocks.push({
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Action Item',
                emoji: true
              },
              url: data.actionItemLink
            }
          ]
        });
      }
      break;
      
    case NOTIFICATION_TYPES.ACTION_ITEM_COMPLETED:
      message.blocks.push(
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '✅ Action Item Completed',
            emoji: true
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Action Item:*\n${data.description}`
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Completed By:*\n${data.completedBy || 'N/A'}`
            },
            {
              type: 'mrkdwn',
              text: `*Completed On:*\n${data.completedDate || new Date().toLocaleDateString()}`
            }
          ]
        }
      );
      
      if (data.actionItemLink) {
        message.blocks.push({
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Action Item',
                emoji: true
              },
              url: data.actionItemLink
            }
          ]
        });
      }
      break;
      
    case NOTIFICATION_TYPES.REFERRAL_RECEIVED:
      message.blocks.push(
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '👋 New Referral Received',
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Referral:*\n${data.referralName}`
            },
            {
              type: 'mrkdwn',
              text: `*Company:*\n${data.company || 'N/A'}`
            },
            {
              type: 'mrkdwn',
              text: `*Email:*\n${data.email}`
            },
            {
              type: 'mrkdwn',
              text: `*Phone:*\n${data.phone || 'N/A'}`
            }
          ]
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Referred By:*\n${data.referrerName}`
            },
            {
              type: 'mrkdwn',
              text: `*Received:*\n${new Date().toLocaleString()}`
            }
          ]
        }
      );
      
      if (data.referralLink) {
        message.blocks.push({
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Referral',
                emoji: true
              },
              url: data.referralLink
            }
          ]
        });
      }
      break;
      
    default:
      // Generic message for unknown notification types
      message.blocks.push(
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '📢 FTFC Notification',
            emoji: true
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `You have a new notification from FTFC.`
          }
        }
      );
      
      // Add any data as fields
      if (data) {
        const fields = [];
        
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === 'string' || typeof value === 'number') {
            fields.push({
              type: 'mrkdwn',
              text: `*${capitalizeFirstLetter(key)}:*\n${value}`
            });
          }
        });
        
        if (fields.length > 0) {
          message.blocks.push({
            type: 'section',
            fields: fields.slice(0, 10) // Limit to 10 fields
          });
        }
      }
  }
  
  // Add footer with timestamp
  message.blocks.push({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: `Sent from FTFC Application • ${new Date().toLocaleString()}`
      }
    ]
  });
  
  return message;
}

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
function formatFileSize(bytes) {
  if (!bytes || isNaN(bytes)) return 'Unknown';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Capitalize the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
function capitalizeFirstLetter(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Export functions
module.exports = {
  testSlackWebhook: exports.testSlackWebhook,
  sendSlackNotification: exports.sendSlackNotification,
  NOTIFICATION_TYPES
};
