import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Your Firebase config object will be loaded from environment variables
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Add console logs to debug environment variables
if (!process.env.REACT_APP_FIREBASE_API_KEY) {
  console.error('Firebase API key is missing');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Set persistence to local to keep the user logged in
setPersistence(auth, browserLocalPersistence)
  .catch(error => {
    console.error('Error setting auth persistence:', error);
  });

// Add this function for centralized error handling
const handleFirebaseError = (error) => {
  console.error('Firebase Error:', error);
  return 'An error occurred. Please try again.';
};

// Add Firebase security rules
const firebaseRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /blog/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    match /leads/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
`;

// Single export statement
export { db, auth, storage, handleFirebaseError }; 