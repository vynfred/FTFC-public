/**
 * Slack Integration Test Script
 * 
 * This script tests the Slack integration for the FTFC application:
 * 1. Tests the webhook configuration
 * 2. Tests sending notifications for different event types
 */

const admin = require('firebase-admin');
const axios = require('axios');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin with service account
try {
  // Check if service account file exists
  const serviceAccountPath = path.join(__dirname, '..', 'service-account.json');
  if (!fs.existsSync(serviceAccountPath)) {
    console.error(chalk.red('Service account file not found at:'), serviceAccountPath);
    console.log(chalk.yellow('Please create a service account file and try again.'));
    process.exit(1);
  }
  
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error(chalk.red('Error initializing Firebase Admin:'), error);
  process.exit(1);
}

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

// Log result with color
function logResult(testName, success, message) {
  const icon = success ? '✅' : '❌';
  const color = success ? chalk.green : chalk.red;
  console.log(`${icon} ${chalk.bold(testName)}: ${color(message)}`);
}

// Test Slack integration
async function testSlackIntegration() {
  console.log(chalk.blue.bold('\n=== FTFC Slack Integration Test ===\n'));
  
  try {
    // Get Slack configuration
    const slackConfigDoc = await admin.firestore().collection('settings').doc('slack').get();
    
    if (!slackConfigDoc.exists) {
      console.log(chalk.yellow('Slack configuration not found. Creating a default configuration...'));
      
      // Prompt for webhook URL
      const { webhookUrl } = await inquirer.prompt([
        {
          type: 'input',
          name: 'webhookUrl',
          message: 'Enter your Slack webhook URL:',
          validate: (input) => {
            if (!input) return 'Webhook URL is required';
            if (!input.startsWith('https://hooks.slack.com/')) {
              return 'Invalid Slack webhook URL. It should start with https://hooks.slack.com/';
            }
            return true;
          }
        }
      ]);
      
      // Create default configuration
      await admin.firestore().collection('settings').doc('slack').set({
        enabled: true,
        webhookUrl,
        defaultChannel: 'general',
        channels: {},
        notificationTypes: Object.values(NOTIFICATION_TYPES).reduce((acc, type) => {
          acc[type] = true;
          return acc;
        }, {}),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(chalk.green('Default Slack configuration created.'));
      
      // Get the updated configuration
      const updatedConfigDoc = await admin.firestore().collection('settings').doc('slack').get();
      slackConfig = updatedConfigDoc.data();
    } else {
      slackConfig = slackConfigDoc.data();
    }
    
    // Check if Slack is enabled
    if (!slackConfig.enabled) {
      console.log(chalk.yellow('Slack integration is disabled. Enabling it for testing...'));
      
      await admin.firestore().collection('settings').doc('slack').update({
        enabled: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      slackConfig.enabled = true;
    }
    
    // Check webhook URL
    if (!slackConfig.webhookUrl) {
      const { webhookUrl } = await inquirer.prompt([
        {
          type: 'input',
          name: 'webhookUrl',
          message: 'Enter your Slack webhook URL:',
          validate: (input) => {
            if (!input) return 'Webhook URL is required';
            if (!input.startsWith('https://hooks.slack.com/')) {
              return 'Invalid Slack webhook URL. It should start with https://hooks.slack.com/';
            }
            return true;
          }
        }
      ]);
      
      await admin.firestore().collection('settings').doc('slack').update({
        webhookUrl,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      slackConfig.webhookUrl = webhookUrl;
    }
    
    console.log(chalk.blue('\n--- Testing Slack Webhook ---\n'));
    
    // Test webhook
    const testResult = await testWebhook(slackConfig.webhookUrl);
    
    if (!testResult) {
      console.log(chalk.red('Webhook test failed. Exiting...'));
      return;
    }
    
    // Ask which notification types to test
    const { notificationTypes } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'notificationTypes',
        message: 'Select notification types to test:',
        choices: Object.entries(NOTIFICATION_TYPES).map(([key, value]) => ({
          name: key.replace(/_/g, ' ').toLowerCase(),
          value,
          checked: true
        }))
      }
    ]);
    
    if (notificationTypes.length === 0) {
      console.log(chalk.yellow('No notification types selected. Exiting...'));
      return;
    }
    
    console.log(chalk.blue('\n--- Testing Slack Notifications ---\n'));
    
    // Test each selected notification type
    for (const type of notificationTypes) {
      await testNotification(type, slackConfig);
    }
    
    console.log(chalk.green.bold('\nAll tests completed!'));
  } catch (error) {
    console.error(chalk.red('Error testing Slack integration:'), error);
  } finally {
    // Exit
    process.exit();
  }
}

// Test webhook
async function testWebhook(webhookUrl) {
  try {
    console.log(chalk.blue('Testing webhook...'));
    
    // Send a test message
    const response = await axios.post(webhookUrl, {
      text: '🧪 *FTFC Slack Integration Test*\n\nThis is a test message from the FTFC application test script.',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🧪 FTFC Slack Integration Test',
            emoji: true
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'This is a test message from the FTFC application test script.'
          }
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Test sent at ${new Date().toLocaleString()}`
            }
          ]
        }
      ]
    });
    
    logResult('Webhook Test', true, 'Message sent successfully. Check your Slack channel.');
    return true;
  } catch (error) {
    logResult('Webhook Test', false, `Error: ${error.message}`);
    
    if (error.response) {
      console.error(chalk.red('Response data:'), error.response.data);
    }
    
    return false;
  }
}

// Test notification
async function testNotification(type, slackConfig) {
  try {
    console.log(chalk.blue(`Testing ${type.replace(/_/g, ' ').toLowerCase()} notification...`));
    
    // Get the channel for this notification type
    const channel = slackConfig.channels[type] || slackConfig.defaultChannel || 'general';
    
    // Generate test data based on notification type
    const testData = generateTestData(type);
    
    // Generate message
    const message = generateSlackMessage(type, testData, channel);
    
    // Send the message
    await axios.post(slackConfig.webhookUrl, message);
    
    // Log the notification
    await admin.firestore().collection('notificationLogs').add({
      type: 'slack',
      notificationType: type,
      channel,
      data: testData,
      success: true,
      test: true,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    logResult(`${type.replace(/_/g, ' ').toLowerCase()} Notification`, true, 'Notification sent successfully');
    return true;
  } catch (error) {
    logResult(`${type.replace(/_/g, ' ').toLowerCase()} Notification`, false, `Error: ${error.message}`);
    return false;
  }
}

// Generate test data for notification type
function generateTestData(type) {
  const baseUrl = 'https://ftfc-start.web.app';
  const testId = uuidv4().substring(0, 8);
  
  switch (type) {
    case NOTIFICATION_TYPES.NEW_LEAD:
      return {
        firstName: 'Test',
        lastName: 'Lead',
        companyName: 'Test Company',
        email: 'test.lead@example.com',
        phone: '(555) 123-4567',
        source: 'Test Script',
        leadLink: `${baseUrl}/dashboard/leads/test-${testId}`
      };
      
    case NOTIFICATION_TYPES.LEAD_UPDATED:
      return {
        firstName: 'Test',
        lastName: 'Lead',
        companyName: 'Test Company',
        status: 'Qualified',
        updatedBy: 'Test User',
        changes: [
          { field: 'Status', oldValue: 'New', newValue: 'Qualified' },
          { field: 'Phone', oldValue: '(555) 123-4567', newValue: '(555) 987-6543' }
        ],
        leadLink: `${baseUrl}/dashboard/leads/test-${testId}`
      };
      
    case NOTIFICATION_TYPES.NEW_CLIENT:
      return {
        name: 'Test Client Inc.',
        contactName: 'John Test',
        email: 'john@testclient.com',
        addedBy: 'Test User',
        clientLink: `${baseUrl}/dashboard/clients/test-${testId}`
      };
      
    case NOTIFICATION_TYPES.NEW_INVESTOR:
      return {
        name: 'Test Investor Capital',
        contactName: 'Jane Test',
        email: 'jane@testinvestor.com',
        addedBy: 'Test User',
        investorLink: `${baseUrl}/dashboard/investors/test-${testId}`
      };
      
    case NOTIFICATION_TYPES.NEW_PARTNER:
      return {
        name: 'Test Partner LLC',
        contactName: 'Bob Test',
        email: 'bob@testpartner.com',
        addedBy: 'Test User',
        partnerLink: `${baseUrl}/dashboard/partners/test-${testId}`
      };
      
    case NOTIFICATION_TYPES.MEETING_SCHEDULED:
      return {
        title: 'Test Meeting',
        date: new Date().toLocaleDateString(),
        startTime: '10:00 AM',
        endTime: '11:00 AM',
        organizer: 'Test User',
        attendees: [
          { name: 'Test User', email: 'test.user@ftfc.co' },
          { name: 'John Test', email: 'john@testclient.com' }
        ],
        meetingLink: 'https://meet.google.com/test-meeting'
      };
      
    case NOTIFICATION_TYPES.MEETING_CANCELED:
      return {
        title: 'Test Meeting',
        date: new Date().toLocaleDateString(),
        startTime: '10:00 AM',
        endTime: '11:00 AM',
        canceledBy: 'Test User',
        reason: 'Scheduling conflict'
      };
      
    case NOTIFICATION_TYPES.DOCUMENT_UPLOADED:
      return {
        name: 'Test Document.pdf',
        type: 'PDF',
        uploadedBy: 'Test User',
        size: 1024 * 1024, // 1MB
        entityType: 'client',
        entityName: 'Test Client Inc.',
        documentLink: `${baseUrl}/dashboard/documents/test-${testId}`
      };
      
    case NOTIFICATION_TYPES.MILESTONE_COMPLETED:
      return {
        title: 'Test Milestone',
        completedBy: 'Test User',
        entityType: 'client',
        entityName: 'Test Client Inc.',
        description: 'This is a test milestone for testing Slack notifications.',
        entityLink: `${baseUrl}/dashboard/clients/test-${testId}`
      };
      
    case NOTIFICATION_TYPES.TRANSCRIPT_CREATED:
      return {
        title: 'Test Meeting',
        date: new Date().toLocaleDateString(),
        summary: 'This is a test summary for a meeting transcript.',
        keyPoints: [
          'This is the first key point from the test meeting.',
          'This is the second key point from the test meeting.',
          'This is the third key point from the test meeting.'
        ],
        transcriptLink: `${baseUrl}/dashboard/meetings/test-${testId}/transcript`
      };
      
    case NOTIFICATION_TYPES.ACTION_ITEM_CREATED:
      return {
        description: 'This is a test action item for testing Slack notifications.',
        assignee: 'Test User',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 7 days from now
        meetingTitle: 'Test Meeting',
        actionItemLink: `${baseUrl}/dashboard/action-items/test-${testId}`
      };
      
    case NOTIFICATION_TYPES.ACTION_ITEM_COMPLETED:
      return {
        description: 'This is a test action item for testing Slack notifications.',
        completedBy: 'Test User',
        completedDate: new Date().toLocaleDateString(),
        actionItemLink: `${baseUrl}/dashboard/action-items/test-${testId}`
      };
      
    case NOTIFICATION_TYPES.REFERRAL_RECEIVED:
      return {
        referralName: 'Test Referral',
        company: 'Test Referral Company',
        email: 'test.referral@example.com',
        phone: '(555) 123-4567',
        referrerName: 'Test Referrer',
        referralLink: `${baseUrl}/dashboard/leads/test-${testId}`
      };
      
    default:
      return {
        testId,
        timestamp: new Date().toISOString()
      };
  }
}

// Generate Slack message for notification type
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
            text: '🎯 New Lead Received (TEST)',
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
            text: '🔄 Lead Updated (TEST)',
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
      
    // Add cases for other notification types...
    // For brevity, I'm only including a few examples
      
    default:
      // Generic message for other notification types
      message.blocks.push(
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `📢 FTFC Test Notification: ${type.replace(/_/g, ' ')}`,
            emoji: true
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `This is a test notification for *${type.replace(/_/g, ' ')}*.\n\nTest ID: ${data.testId || uuidv4().substring(0, 8)}`
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
              text: `*${key.charAt(0).toUpperCase() + key.slice(1)}:*\n${value}`
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
        text: `🧪 *TEST NOTIFICATION* • Sent from FTFC Test Script • ${new Date().toLocaleString()}`
      }
    ]
  });
  
  return message;
}

// Run the test
testSlackIntegration().catch(console.error);
