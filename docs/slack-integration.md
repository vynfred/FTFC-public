# Slack Integration

This document provides instructions for setting up and using the Slack integration in the FTFC application.

## Overview

The Slack integration allows the FTFC application to send notifications to Slack channels for various events, such as new leads, meeting schedules, document uploads, and more. This helps keep your team informed about important activities in real-time.

## Setup Instructions

### 1. Create a Slack App

1. Go to [https://api.slack.com/apps](https://api.slack.com/apps) and sign in with your Slack account.
2. Click **Create New App**.
3. Choose **From scratch**.
4. Enter a name for your app (e.g., "FTFC Notifications") and select the workspace where you want to install the app.
5. Click **Create App**.

### 2. Configure Incoming Webhooks

1. In the left sidebar, click on **Incoming Webhooks**.
2. Toggle the switch to **On** to activate incoming webhooks.
3. Click **Add New Webhook to Workspace**.
4. Select the channel where you want to receive notifications by default.
5. Click **Allow** to authorize the app.
6. Copy the webhook URL that is generated. You'll need this for the FTFC application.

### 3. Configure FTFC Application

1. Log in to the FTFC application as an administrator.
2. Go to **Company Settings** > **Integrations**.
3. Click on the **Slack** tab.
4. Toggle the switch to enable Slack integration.
5. Paste the webhook URL you copied from Slack.
6. Enter the default channel name (without the # symbol).
7. Configure which events should trigger notifications and which channels they should be sent to.
8. Click **Save Configuration**.

### 4. Test the Integration

1. Click the **Test** button next to the webhook URL to send a test message to Slack.
2. Check your Slack channel to verify that the test message was received.

## Notification Types

The FTFC application can send notifications to Slack for the following events:

| Event | Description |
|-------|-------------|
| New Lead | When a new lead is submitted through the intake form |
| Lead Updated | When a lead's information or status is updated |
| New Client | When a new client is added to the system |
| New Investor | When a new investor is added to the system |
| New Partner | When a new partner is added to the system |
| Meeting Scheduled | When a new meeting is scheduled |
| Meeting Canceled | When a meeting is canceled |
| Document Uploaded | When a document is uploaded to the system |
| Milestone Completed | When a milestone is marked as completed |
| Meeting Transcript Available | When a meeting transcript is available |
| Action Item Created | When an action item is created |
| Action Item Completed | When an action item is marked as completed |
| Referral Received | When a new referral is received |

## Channel Configuration

You can configure different Slack channels for different types of notifications. For example, you might want:

- Lead notifications to go to a #leads channel
- Meeting notifications to go to a #meetings channel
- Document notifications to go to a #documents channel

If no specific channel is configured for a notification type, the default channel will be used.

## Troubleshooting

### Notifications Not Being Sent

1. Check that the Slack integration is enabled in the FTFC application.
2. Verify that the webhook URL is correct.
3. Make sure the notification type is enabled.
4. Check that the channel name is correct (do not include the # symbol).
5. Verify that the Slack app has permission to post to the specified channel.

### Error Messages

If you see error messages when testing the webhook, here are some common issues:

- **Invalid webhook URL**: Make sure the webhook URL starts with `https://hooks.slack.com/`.
- **Channel not found**: Verify that the channel exists and that the Slack app has permission to post to it.
- **Rate limited**: Slack has rate limits for incoming webhooks. If you're sending too many notifications in a short period, some may be blocked.

## Advanced Configuration

### Custom Notification Templates

The FTFC application uses predefined templates for Slack notifications. If you need to customize these templates, please contact the FTFC support team.

### Webhook Security

The webhook URL is a secret token that allows posting to your Slack workspace. Keep it secure and do not share it publicly.

## Testing the Integration

You can use the provided test script to verify that the Slack integration is working correctly:

```bash
node scripts/test-slack-integration.js
```

This script will:

1. Check if Slack is configured in the FTFC application
2. Test the webhook URL
3. Send test notifications for each enabled notification type

## Support

If you encounter any issues with the Slack integration, please contact the FTFC support team at support@ftfc.co.
