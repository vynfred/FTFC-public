# FTFC Firebase Functions

This directory contains the Firebase Cloud Functions for the FTFC application.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on the `.env.example` template:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file with your actual credentials.

## Environment Variables

For Cross-Account Protection (RISC) to work properly, you need to set up the following environment variables:

- `GOOGLE_RISC_CLIENT_EMAIL`: The service account email address
- `GOOGLE_RISC_PRIVATE_KEY`: The private key (with newline characters)
- `GOOGLE_RISC_PRIVATE_KEY_ID`: The private key ID
- `GOOGLE_RISC_PROJECT_ID`: Your Google Cloud project ID

## Deployment

To deploy the functions:

```bash
# Deploy all functions
npm run deploy

# Deploy specific functions
firebase deploy --only functions:functionName1,functions:functionName2
```

## Cross-Account Protection Setup

1. Create a service account with the RISC Configuration Admin role in your Google Cloud project:
   - Go to Google Cloud Console > IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Name: "risc-admin" (or similar)
   - Grant the "RISC Configuration Admin" role
   - Create a JSON key and download it

2. Extract the required credentials from the JSON key file and add them to your `.env` file:
   ```
   GOOGLE_RISC_CLIENT_EMAIL=the-value-from-client_email
   GOOGLE_RISC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nThe-value-from-private_key\n-----END PRIVATE KEY-----\n"
   GOOGLE_RISC_PRIVATE_KEY_ID=the-value-from-private_key_id
   GOOGLE_RISC_PROJECT_ID=the-value-from-project_id
   ```

3. Enable the RISC API in your Google Cloud project:
   - Go to Google Cloud Console > APIs & Services > Library
   - Search for "RISC API"
   - Click "Enable"
   - Accept the RISC Terms of Service

4. Deploy the functions with the environment variables:
   ```bash
   firebase functions:config:set env.google_risc_client_email="$GOOGLE_RISC_CLIENT_EMAIL" env.google_risc_private_key_id="$GOOGLE_RISC_PRIVATE_KEY_ID" env.google_risc_project_id="$GOOGLE_RISC_PROJECT_ID"
   firebase functions:config:set env.google_risc_private_key="$GOOGLE_RISC_PRIVATE_KEY"
   firebase deploy --only functions
   ```

5. After deployment, navigate to Company Settings > Security in the FTFC application to configure and test Cross-Account Protection.

## Local Development

To run functions locally with environment variables:

```bash
firebase functions:config:get > .runtimeconfig.json
firebase emulators:start
```
