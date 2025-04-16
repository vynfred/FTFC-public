import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, getRedirectResult, GoogleAuthProvider, onAuthStateChanged as firebaseAuthStateChanged, signInWithEmailAndPassword, signInWithRedirect, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  driveFolderId: process.env.REACT_APP_GOOGLE_DRIVE_FOLDER_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);
const firebaseDb = getFirestore(app);
const firebaseStorage = getStorage(app);
const firebaseFunctions = getFunctions(app);

// Export services
export { db, auth, storage, handleFirebaseError, functions, app };

// Development mode check
const isDevelopment = process.env.NODE_ENV === 'development';

// Create a Google provider instance to reuse
const googleProvider = new GoogleAuthProvider();
// Add scopes
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
// Set custom parameters
googleProvider.setCustomParameters({
  prompt: 'select_account',
  // Explicitly set the client ID from environment variable
  client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID
});

// Auth service
// Always use real Firebase auth for Google authentication to work properly
const auth = {
  currentUser: firebaseAuth.currentUser,
  onAuthStateChanged: (callback) => firebaseAuthStateChanged(firebaseAuth, callback),
  signInWithEmailAndPassword: (email, password) => signInWithEmailAndPassword(firebaseAuth, email, password),
  signOut: () => firebaseSignOut(firebaseAuth),
  createUserWithEmailAndPassword: (email, password) => createUserWithEmailAndPassword(firebaseAuth, email, password),
  getRedirectResult: async () => {
    console.log('Getting redirect result...');
    try {
      // Check if we're in the middle of a Google sign-in
      const signInStarted = localStorage.getItem('googleSignInStarted');
      console.log('Google sign-in started flag:', signInStarted ? 'Found' : 'Not found');

      // Get the stored state and timestamp
      const storedState = localStorage.getItem('googleAuthState');
      const storedTimestamp = localStorage.getItem('googleAuthTimestamp');
      console.log('Stored state:', storedState ? 'Found' : 'Not found');
      console.log('Stored timestamp:', storedTimestamp ? 'Found' : 'Not found');

      // Get the result from Firebase
      console.log('Calling getRedirectResult from Firebase...');
      const result = await getRedirectResult(firebaseAuth);
      console.log('Redirect result:', result ? 'Success' : 'No result');

      if (result && result.user) {
        console.log('User signed in via redirect:', result.user.email);
        console.log('User UID:', result.user.uid);
        console.log('User provider data:', result.user.providerData.map(p => p.providerId));

        // Verify the state parameter if available
        // This is a critical security check to prevent CSRF attacks
        if (storedState && result._tokenResponse && result._tokenResponse.state) {
          const returnedState = result._tokenResponse.state;
          console.log('Verifying state parameter...');
          console.log('Returned state:', returnedState);
          console.log('Stored state:', storedState);

          if (returnedState !== storedState) {
            console.error('State mismatch! Possible CSRF attack');
            // In a production environment, you might want to handle this more gracefully
            // For now, we'll continue but log the error
          } else {
            console.log('State verification successful');
          }
        }

        // Store a flag in both localStorage and sessionStorage to indicate successful sign-in
        console.log('Setting googleSignInSuccess flag');
        localStorage.setItem('googleSignInSuccess', 'true');
        sessionStorage.setItem('googleSignInSuccess', 'true');

        // Get the intended role from localStorage
        const intendedRole = localStorage.getItem('intendedUserRole') || 'team';
        console.log('Intended role:', intendedRole);
        localStorage.setItem('userRole', intendedRole);
        sessionStorage.setItem('userRole', intendedRole);

        // Store the user's email for future use
        if (result.user.email) {
          localStorage.setItem('userEmail', result.user.email);
          console.log('Stored user email:', result.user.email);
        }

        // Store tokens if available
        if (result.credential && result.credential.accessToken) {
          console.log('Credential found in result, storing tokens');
          const tokens = {
            access_token: result.credential.accessToken,
            id_token: result.credential.idToken,
            refresh_token: result._tokenResponse?.refresh_token,
            expiry_date: Date.now() + 3600 * 1000 // 1 hour from now
          };

          console.log('Storing tokens in localStorage');
          localStorage.setItem('googleTokens', JSON.stringify(tokens));
          localStorage.setItem('googleDriveTokens', JSON.stringify(tokens)); // For Drive-specific functions

          // Set connection flags in both localStorage and sessionStorage
          localStorage.setItem('googleCalendarConnected', 'true');
          localStorage.setItem('googleDriveConnected', 'true');
          sessionStorage.setItem('googleCalendarConnected', 'true');
          sessionStorage.setItem('googleDriveConnected', 'true');

          console.log('Connection flags set successfully');
        } else {
          console.log('No credential found in result');
        }
      } else if (signInStarted === 'true') {
        // If we were in the middle of a sign-in but got no result, something went wrong
        console.log('No result but sign-in was started, setting error flag');
        localStorage.setItem('googleSignInError', 'true');
      }

      // Clean up regardless of result
      console.log('Cleaning up auth state');
      localStorage.removeItem('googleAuthState');
      localStorage.removeItem('googleAuthTimestamp');
      localStorage.removeItem('googleSignInStarted');

      return result;
    } catch (error) {
      console.error('Error getting redirect result:', error);

      // Clean up in case of error
      localStorage.removeItem('googleAuthState');
      localStorage.removeItem('googleAuthTimestamp');
      localStorage.removeItem('intendedUserRole');
      localStorage.removeItem('googleSignInStarted');
      localStorage.setItem('googleSignInError', 'true');

      throw error;
    }
  },
  // Method to update the Google provider's client ID
  updateGoogleProviderClientId: (clientId) => {
    console.log('Updating Google provider client ID:', clientId);
    googleProvider.setCustomParameters({
      prompt: 'select_account',
      client_id: clientId
    });
  },
  signInWithGoogle: () => {
    try {
      console.log('Starting Google sign-in process with redirect...');

      // Generate a secure state parameter to prevent CSRF attacks
      const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      // Store state and timestamp in localStorage to verify when the redirect completes
      localStorage.setItem('googleAuthState', state);
      localStorage.setItem('googleAuthTimestamp', Date.now().toString());

      // Store the intended role before redirecting
      localStorage.setItem('intendedUserRole', 'team');

      // Set a flag to indicate we're starting a Google sign-in
      localStorage.setItem('googleSignInStarted', 'true');

      // Log the current state before redirect
      console.log('Google sign-in: State before redirect', {
        state,
        timestamp: Date.now(),
        intendedRole: 'team'
      });

      // Reset the provider to ensure we're using a fresh instance
      googleProvider = new GoogleAuthProvider();

      // Set custom parameters including state
      googleProvider.setCustomParameters({
        // Always prompt user to select account to ensure they get the right one
        prompt: 'select_account',
        // Include state parameter for CSRF protection
        state: state,
        // Use the client ID from environment variables
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '815708531852-scs6t2uph7ci2vkgpfvn7uq5q7406s20.apps.googleusercontent.com',
        // Request offline access to get refresh token
        access_type: 'offline',
        // Include previously granted scopes
        include_granted_scopes: true
      });

      // Use the redirect method as recommended by Google for web applications
      console.log('Calling signInWithRedirect...');
      return signInWithRedirect(firebaseAuth, googleProvider);
    } catch (error) {
      console.error('Google sign-in error in try/catch:', error);
      // Clean up in case of error
      localStorage.removeItem('googleAuthState');
      localStorage.removeItem('googleAuthTimestamp');
      localStorage.removeItem('intendedUserRole');
      localStorage.removeItem('googleSignInStarted');
      throw error;
    }
  },

  // Method for role-specific Google sign-in with redirect
  signInWithGoogleRedirect: (role) => {
    try {
      console.log(`Starting Google sign-in with redirect for role: ${role}`);

      // Generate a secure state parameter to prevent CSRF attacks
      const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      // Store state and timestamp in localStorage to verify when the redirect completes
      localStorage.setItem('googleAuthState', state);
      localStorage.setItem('googleAuthTimestamp', Date.now().toString());

      // Store the intended role before redirecting
      localStorage.setItem('intendedUserRole', role || 'team');

      // Set a flag to indicate we're starting a Google sign-in
      localStorage.setItem('googleSignInStarted', 'true');

      // Log the current state before redirect
      console.log('Google sign-in: State before redirect', {
        state,
        timestamp: Date.now(),
        intendedRole: role || 'team'
      });

      // Reset the provider to ensure we're using a fresh instance
      googleProvider = new GoogleAuthProvider();

      // Set custom parameters including state
      googleProvider.setCustomParameters({
        // Always prompt user to select account to ensure they get the right one
        prompt: 'select_account',
        // Include state parameter for CSRF protection
        state: state,
        // Use the client ID from environment variables
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '815708531852-scs6t2uph7ci2vkgpfvn7uq5q7406s20.apps.googleusercontent.com',
        // Request offline access to get refresh token
        access_type: 'offline',
        // Include previously granted scopes
        include_granted_scopes: true
      });

      // Use the redirect method as recommended by Google for web applications
      console.log('Calling signInWithRedirect...');
      return signInWithRedirect(firebaseAuth, googleProvider);
    } catch (error) {
      console.error('Google sign-in redirect error:', error);
      // Clean up in case of error
      localStorage.removeItem('googleAuthState');
      localStorage.removeItem('googleAuthTimestamp');
      localStorage.removeItem('intendedUserRole');
      localStorage.removeItem('googleSignInStarted');
      throw error;
    }
  }
};

// Firestore service
const db = isDevelopment ?
  // Mock firestore for development
  {
    collection: (name) => ({
      doc: (id) => ({
        get: () => Promise.resolve({
          exists: true,
          data: () => ({
            id,
            name: 'Mock Data',
            createdAt: new Date()
          }),
          id
        }),
        set: (data) => Promise.resolve(data),
        update: (data) => Promise.resolve(data),
        delete: () => Promise.resolve()
      }),
      add: (data) => Promise.resolve({ id: 'new-doc-id', ...data }),
      where: () => ({
        get: () => Promise.resolve({
          docs: [
            {
              id: '1',
              data: () => ({ name: 'Mock Data 1' }),
              exists: true
            },
            {
              id: '2',
              data: () => ({ name: 'Mock Data 2' }),
              exists: true
            }
          ]
        }),
        orderBy: () => ({
          limit: () => ({
            get: () => Promise.resolve({
              docs: [
                {
                  id: '1',
                  data: () => ({ name: 'Mock Data 1' }),
                  exists: true
                }
              ]
            })
          })
        })
      })
    })
  } :
  // Real Firestore for production
  firebaseDb;

// Storage service
const storage = isDevelopment ?
  // Mock storage for development
  {
    ref: (path) => ({
      put: (file) => ({
        on: (event, progressCallback, errorCallback, completeCallback) => {
          // Simulate upload completion
          setTimeout(() => {
            completeCallback();
          }, 1000);
        },
        then: (callback) => {
          callback({
            ref: {
              getDownloadURL: () => Promise.resolve(`https://example.com/${path}`)
            }
          });
          return { catch: () => {} };
        }
      }),
      delete: () => Promise.resolve()
    })
  } :
  // Real Firebase storage for production
  firebaseStorage;

// Error handling function
const handleFirebaseError = (error) => {
  console.error('Firebase Error:', error);
  return 'An error occurred. Please try again.';
};

// Functions service
const functions = isDevelopment ?
  // Mock functions for development
  {
    httpsCallable: (name) => (data) => {
      console.log(`Mock function call: ${name}`, data);
      return Promise.resolve({ data: { success: true } });
    }
  } :
  // Real Firebase functions for production
  firebaseFunctions;

// Export httpsCallable function for use in services
export const callFunction = (name, data) => {
  if (isDevelopment) {
    // Mock implementation for development
    console.log(`Mock function call: ${name}`, data);
    return Promise.resolve({ data: { success: true } });
  } else {
    // Real implementation for production
    return httpsCallable(functions, name)(data);
  }
};


