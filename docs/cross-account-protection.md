# Cross-Account Protection Implementation

This document describes the implementation of Google's Cross-Account Protection (RISC) in the FTFC application.

## Overview

Cross-Account Protection is a security feature that allows your application to receive notifications from Google when users' Google Accounts experience security events, such as being compromised or disabled. This helps protect your application from security breaches that could occur through compromised Google Accounts.

## Implementation Details

### 1. Firebase Function for Event Receiver

We've implemented a Firebase Function (`securityEventReceiver`) that receives and processes security event tokens from Google. This function:

- Validates the security event tokens using Google's public keys
- Extracts the security event information
- Takes appropriate action based on the event type

### 2. Security Event Handling

The implementation handles the following types of security events:

| Event Type | Action Taken |
|------------|--------------|
| `sessions-revoked` | Revokes all user sessions and adds a security alert in Firestore |
| `tokens-revoked` | Revokes all user sessions and adds a security alert in Firestore |
| `account-disabled` | If reason is "hijacking", disables the user's account and adds a security alert in Firestore |
| `account-enabled` | Re-enables the user's account if it was previously disabled due to hijacking |
| `account-credential-change-required` | Adds a security alert in Firestore to prompt the user to change their credentials |
| `verification` | Logs the verification event (used for testing) |

### 3. Admin Functions

We've also implemented several admin functions to manage the Cross-Account Protection integration:

- `createRiscServiceAccountToken`: Creates a JWT token for authenticating with the RISC API
- `registerRiscEndpoint`: Registers the event receiver endpoint with Google
- `testRiscEventStream`: Tests the event stream by sending a verification event

### 4. UI Component

A UI component has been added to the Company Settings page under the "Security" tab to allow administrators to:

- Configure Cross-Account Protection
- Test the configuration
- View the status of the integration

## Setup Instructions

To set up Cross-Account Protection for your application:

1. Create a service account with the RISC Configuration Admin role in your Google Cloud project
2. Enable the RISC API in your Google Cloud project
3. Add the service account credentials to your `.env` file:
   ```
   # Google Service Account for RISC (Cross-Account Protection)
   GOOGLE_RISC_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
   GOOGLE_RISC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key content here\n-----END PRIVATE KEY-----\n"
   GOOGLE_RISC_PRIVATE_KEY_ID=your-private-key-id
   GOOGLE_RISC_PROJECT_ID=your-project-id
   ```
4. Deploy the Firebase Functions
5. Navigate to Company Settings > Security in the FTFC application
6. Click "Configure Cross-Account Protection"
7. Test the configuration by clicking "Test Configuration"

## Security Considerations

- The service account key should be stored securely in environment variables, never in version control
- Only admin users should be able to call the admin functions
- The event receiver endpoint should validate all incoming tokens before processing them

## Troubleshooting

If you encounter issues with Cross-Account Protection:

1. Check the Firebase Functions logs for detailed error messages
2. Verify that the RISC API is enabled in your Google Cloud project
3. Ensure that the service account has the correct permissions
4. Verify that your OAuth client is properly configured in the Google Cloud Console

## References

- [Google's Cross-Account Protection Documentation](https://developers.google.com/identity/protocols/risc)
- [RISC API Reference](https://developers.google.com/identity/protocols/risc/reference)
- [OpenID Connect RISC Profile](https://openid.net/specs/openid-risc-profile-1_0.html)
