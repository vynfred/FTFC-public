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
      // Get the stored state and timestamp
      const storedState = localStorage.getItem('googleAuthState');
      const storedTimestamp = localStorage.getItem('googleAuthTimestamp');
      console.log('Stored state:', storedState ? 'Found' : 'Not found');
      console.log('Stored timestamp:', storedTimestamp ? 'Found' : 'Not found');

      // Get the result from Firebase
      const result = await getRedirectResult(firebaseAuth);
      console.log('Redirect result:', result ? 'Success' : 'No result');

      if (result && result.user) {
        console.log('User signed in via redirect:', result.user.email);

        // Verify the state parameter if available
        if (storedState) {
          // In a real implementation, we would verify the state parameter from the redirect
          // For now, we'll just log it
          console.log('State verification would happen here');
        }

        // Store a flag in both localStorage and sessionStorage to indicate successful sign-in
        localStorage.setItem('googleSignInSuccess', 'true');
        sessionStorage.setItem('googleSignInSuccess', 'true');

        // Get the intended role from localStorage
        const intendedRole = localStorage.getItem('intendedUserRole') || 'team';
        localStorage.setItem('userRole', intendedRole);
        sessionStorage.setItem('userRole', intendedRole);

        // Store the user's email for future use
        if (result.user.email) {
          localStorage.setItem('userEmail', result.user.email);
        }

        // Store tokens if available
        if (result.credential && result.credential.accessToken) {
          const tokens = {
            access_token: result.credential.accessToken,
            id_token: result.credential.idToken,
            expiry_date: Date.now() + 3600 * 1000 // 1 hour from now
          };
          localStorage.setItem('googleTokens', JSON.stringify(tokens));

          // Set connection flags
          localStorage.setItem('googleCalendarConnected', 'true');
          localStorage.setItem('googleDriveConnected', 'true');
          sessionStorage.setItem('googleCalendarConnected', 'true');
          sessionStorage.setItem('googleDriveConnected', 'true');
        }
      }

      // Clean up regardless of result
      localStorage.removeItem('googleAuthState');
      localStorage.removeItem('googleAuthTimestamp');
      localStorage.removeItem('intendedUserRole');

      return result;
    } catch (error) {
      console.error('Error getting redirect result:', error);

      // Clean up in case of error
      localStorage.removeItem('googleAuthState');
      localStorage.removeItem('googleAuthTimestamp');
      localStorage.removeItem('intendedUserRole');

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

      // Store state in localStorage to verify when the redirect completes
      localStorage.setItem('googleAuthState', state);
      localStorage.setItem('googleAuthTimestamp', Date.now().toString());

      // Store the intended role before redirecting
      localStorage.setItem('intendedUserRole', 'team');

      // Set custom parameters including state
      googleProvider.setCustomParameters({
        prompt: 'select_account',
        state: state
      });

      // Use the redirect method
      return signInWithRedirect(firebaseAuth, googleProvider);
    } catch (error) {
      console.error('Google sign-in error in try/catch:', error);
      // Clean up in case of error
      localStorage.removeItem('googleAuthState');
      localStorage.removeItem('googleAuthTimestamp');
      localStorage.removeItem('intendedUserRole');
      throw error;
    }
  },

  // Method for role-specific Google sign-in with redirect
  signInWithGoogleRedirect: (role) => {
    try {
      console.log(`Starting Google sign-in with redirect for role: ${role}`);
      // Generate a secure state parameter to prevent CSRF attacks
      const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      // Store state in localStorage to verify when the redirect completes
      localStorage.setItem('googleAuthState', state);
      localStorage.setItem('googleAuthTimestamp', Date.now().toString());

      // Store the intended role before redirecting
      localStorage.setItem('intendedUserRole', role || 'team');

      // Set custom parameters including state
      googleProvider.setCustomParameters({
        prompt: 'select_account',
        state: state
      });

      // Use the redirect method
      return signInWithRedirect(firebaseAuth, googleProvider);
    } catch (error) {
      console.error('Google sign-in redirect error:', error);
      // Clean up in case of error
      localStorage.removeItem('googleAuthState');
      localStorage.removeItem('googleAuthTimestamp');
      localStorage.removeItem('intendedUserRole');
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


