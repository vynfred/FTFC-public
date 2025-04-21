# Google Authentication Setup Guide

## Overview

This document outlines the steps needed to properly configure Google Authentication for the FTFC application, following Google's best practices and ensuring compatibility with browsers that block third-party cookies. It also covers advanced topics like account linking and custom authentication.

## Required Configuration Changes

### 1. Update Firebase Configuration

The Firebase configuration in the application must use the same domain for `authDomain` as the domain where the application is hosted. This ensures that the authentication iframe and the application are on the same domain, preventing cross-origin storage access issues.

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBvmQSulq-URfFs7c-N7LyB8ShiJzpPjDg",
  authDomain: "ftfc-start.web.app", // Must match the domain where the app is hosted
  projectId: "ftfc-start",
  storageBucket: "ftfc-start.firebasestorage.app",
  messagingSenderId: "538027995020",
  appId: "1:538027995020:web:d15558c9fa086fcc1730a9"
};
```

### 2. Update Google Cloud Console Configuration

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select the project: `ftfc-451421`
3. Navigate to "APIs & Services" > "Credentials"
4. Find the OAuth 2.0 Client ID used for authentication
5. Edit the client ID and add the following Authorized Redirect URIs:
   - `https://ftfc-start.web.app/__/auth/handler`
   - `https://ftfc-start.firebaseapp.com/__/auth/handler`
   - `https://ftfc.co/__/auth/handler` (if using this domain in the future)

### 3. Environment Variables

Ensure the following environment variables are set correctly:

```
REACT_APP_FIREBASE_AUTH_DOMAIN=ftfc-start.web.app
REACT_APP_GOOGLE_REDIRECT_URI=https://ftfc-start.web.app/api/google/oauth-callback
```

## Testing the Configuration

After making these changes, test the authentication flow on different browsers:

1. Chrome (with third-party cookies blocked)
2. Safari
3. Firefox

Verify that the sign-in process works correctly in all browsers and that users are properly redirected back to the application after authentication.

## Troubleshooting

If authentication issues persist:

1. Check browser console for errors related to third-party cookies or storage access
2. Verify that the `authDomain` in Firebase config matches the domain where the app is hosted
3. Confirm that all redirect URIs are properly registered in Google Cloud Console
4. Test with the Firebase Local Emulator Suite to isolate authentication issues

## Advanced Authentication Features

### Account Linking

Account linking allows users to sign in to your app using multiple authentication providers by linking auth provider credentials to an existing user account. This means users are identifiable by the same Firebase user ID regardless of the authentication provider they used to sign in.

#### Implementation

1. Use the `linkWithPopup` or `linkWithRedirect` methods to link a new provider to an existing account:

```javascript
import { getAuth, linkWithPopup, GoogleAuthProvider } from 'firebase/auth';

const auth = getAuth();
const provider = new GoogleAuthProvider();

linkWithPopup(auth.currentUser, provider).then((result) => {
  // Accounts successfully linked.
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const user = result.user;
}).catch((error) => {
  // Handle errors here.
});
```

2. Handle the special case where the credentials are already linked to another user account:

```javascript
if (error.code === 'auth/account-exists-with-different-credential') {
  // The pending Google credential
  const pendingCred = error.credential;

  // Handle account merging as appropriate for your app
}
```

### Custom Authentication

If you have an existing authentication system, you can integrate it with Firebase Authentication by generating custom tokens on your server and using them to authenticate with Firebase.

#### Implementation

1. On your authentication server, generate a custom token when a user successfully signs in.

2. In your client application, use the custom token to authenticate with Firebase:

```javascript
import { getAuth, signInWithCustomToken } from 'firebase/auth';

const auth = getAuth();
signInWithCustomToken(auth, token)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
  })
  .catch((error) => {
    // Handle errors
  });
```

### Programmatic OAuth Configuration

For automated deployment and management, you can programmatically configure OAuth identity providers using the Google Cloud Identity Platform REST API.

#### Implementation

1. Get an OAuth 2.0 access token with Editor access to your Firebase project.

2. Use the REST API to add, update, or get OAuth provider configurations:

```javascript
// Example: Add a new OAuth provider
async function addIdpConfig(projectId, accessToken, idpId, clientId, clientSecret) {
  const uri = `https://identitytoolkit.googleapis.com/v2/projects/${projectId}/defaultSupportedIdpConfigs?idpId=${idpId}`;
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      name: `projects/${projectId}/defaultSupportedIdpConfigs/${idpId}`,
      enabled: true,
      clientId: clientId,
      clientSecret: clientSecret,
    }),
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Failed to add IdP configuration');
  }
}
```

## References

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Best practices for using signInWithRedirect on browsers that block third-party storage access](https://firebase.google.com/docs/auth/web/redirect-best-practices)
- [Google Identity Platform Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Link Multiple Auth Providers to an Account](https://firebase.google.com/docs/auth/web/account-linking)
- [Authenticate with Firebase Using a Custom Authentication System](https://firebase.google.com/docs/auth/web/custom-auth)
- [Programmatically configure OAuth identity providers](https://firebase.google.com/docs/auth/admin/programmatic-oauth-config)
