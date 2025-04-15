import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, getRedirectResult, GoogleAuthProvider, onAuthStateChanged as firebaseAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, signOut as firebaseSignOut } from 'firebase/auth';
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
  getRedirectResult: () => getRedirectResult(firebaseAuth),
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
      console.log('Starting Google sign-in process with popup...');
      return signInWithPopup(firebaseAuth, googleProvider)
        .then(result => {
          console.log('Google sign-in successful:', result.user.email);
          // Store a flag in sessionStorage to indicate successful sign-in
          sessionStorage.setItem('googleSignInSuccess', 'true');
          return result;
        })
        .catch(error => {
          console.error('Google sign-in error in promise chain:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          if (error.email) console.error('Error email:', error.email);
          if (error.credential) console.error('Error credential:', error.credential);

          // If popup is blocked or fails, try redirect method
          if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
            console.log('Popup failed, trying redirect method...');
            return signInWithRedirect(firebaseAuth, googleProvider);
          }

          throw error;
        });
    } catch (error) {
      console.error('Google sign-in error in try/catch:', error);
      throw error;
    }
  },

  // Alternative method using redirect instead of popup
  signInWithGoogleRedirect: () => {
    try {
      console.log('Starting Google sign-in with redirect...');
      // Store a flag in sessionStorage to indicate redirect is in progress
      sessionStorage.setItem('googleRedirectInProgress', 'true');
      return signInWithRedirect(firebaseAuth, googleProvider);
    } catch (error) {
      console.error('Google sign-in redirect error:', error);
      sessionStorage.removeItem('googleRedirectInProgress');
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


