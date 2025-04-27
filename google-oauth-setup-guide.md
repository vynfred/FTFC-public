# Google OAuth Configuration Guide

This guide will help you properly configure your Google OAuth credentials to work with your Firebase application.

## Step 1: Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account (the one you use for Firebase)
3. Select your project (the one associated with your Firebase app)
4. In the left sidebar, navigate to "APIs & Services"

## Step 2: Configure OAuth Consent Screen

1. In the left sidebar, navigate to "APIs & Services" > "OAuth consent screen"
2. Make sure your app is properly configured with the necessary scopes:
   - `email`
   - `profile`
   - `https://www.googleapis.com/auth/calendar` (if needed)
   - `https://www.googleapis.com/auth/drive` (if needed)

## Step 3: Update OAuth Credentials

1. In the left sidebar, navigate to "APIs & Services" > "Credentials"
2. Find your OAuth 2.0 Client ID (the one with ID: `815508531852-scs6t2uph7ci2vkgpfvn7uq5q7406s20.apps.googleusercontent.com`)
3. Click on it to edit

## Step 4: Add Authorized JavaScript Origins

Add the following URLs to the "Authorized JavaScript origins" section:

```
https://ftfc-start.web.app
https://ftfc.co
http://localhost:3000
```

## Step 5: Add Authorized Redirect URIs

Add the following URLs to the "Authorized redirect URIs" section:

```
https://ftfc-start.firebaseapp.com/__/auth/handler
https://ftfc-start.web.app/__/auth/handler
https://ftfc.co/__/auth/handler
http://localhost:3000/__/auth/handler
postmessage
```

> **Important**:
> - The `postmessage` redirect URI is crucial for Google Identity Services to work properly with the popup flow.
> - The `__/auth/handler` paths are Firebase's default authentication handlers and must be included.
> - Make sure to use the `.firebaseapp.com` domain as well as the custom domains.

## Step 6: Save Changes

Click "Save" to apply your changes.

## Step 7: Test Authentication

1. Go to https://ftfc-start.web.app/google-signin-test.html to test the standalone Google Sign-In
2. If that works, try the main application at https://ftfc-start.web.app/team-login

## Troubleshooting

If you still encounter issues:

1. **Check the browser console for specific error messages**
   - Look for "redirect_uri_mismatch" errors which indicate a problem with your authorized redirect URIs
   - Look for CORS errors which might indicate issues with your domain configuration

2. **Verify your Firebase authDomain**
   - Make sure you're using the correct authDomain in your Firebase configuration
   - For Firebase projects, use the `.firebaseapp.com` domain, not the `.web.app` domain
   - Example: `ftfc-start.firebaseapp.com` instead of `ftfc-start.web.app`

3. **Check Firebase Authentication settings**
   - Go to Firebase Console > Authentication > Sign-in method
   - Ensure Google is enabled as a sign-in provider
   - Verify that the correct OAuth Client ID is being used

4. **Clear browser data**
   - Clear your browser cache and cookies
   - Try using an incognito/private browsing window

5. **Check for Cross-Origin issues**
   - If you see COOP (Cross-Origin-Opener-Policy) warnings, you may need to add appropriate headers to your hosting configuration

6. **Verify the redirect URIs**
   - Make sure all the required redirect URIs are added to your Google Cloud Console project
   - The special `postmessage` redirect URI is required for Google Identity Services to work properly
   - The `__/auth/handler` paths are required for Firebase Authentication

7. **Use the Firebase Auth Check Tool**
   - Visit https://ftfc-start.web.app/firebase-auth-check.html to verify your Firebase configuration

## Additional Resources

- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Google OAuth 2.0 for Client-side Web Applications](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow)
