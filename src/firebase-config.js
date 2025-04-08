import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseAuthStateChanged
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);
const firebaseDb = getFirestore(app);
const firebaseStorage = getStorage(app);

// Development mode check
const isDevelopment = process.env.NODE_ENV === 'development';

// Auth service
const auth = isDevelopment ? 
  // Mock auth for development
  {
    currentUser: {
      uid: '1',
      email: 'john@example.com',
      displayName: 'John Doe'
    },
    onAuthStateChanged: (callback) => {
      callback(auth.currentUser);
      return () => {}; // Return unsubscribe function
    },
    signInWithEmailAndPassword: (email, password) => {
      return Promise.resolve({
        user: {
          uid: '1',
          email,
          displayName: 'John Doe'
        }
      });
    },
    signOut: () => Promise.resolve(),
    createUserWithEmailAndPassword: () => Promise.resolve()
  } : 
  // Real Firebase auth for production
  {
    currentUser: firebaseAuth.currentUser,
    onAuthStateChanged: (callback) => firebaseAuthStateChanged(firebaseAuth, callback),
    signInWithEmailAndPassword: (email, password) => signInWithEmailAndPassword(firebaseAuth, email, password),
    signOut: () => firebaseSignOut(firebaseAuth),
    createUserWithEmailAndPassword: (email, password) => firebaseAuth.createUserWithEmailAndPassword(email, password)
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

// Export services
export { db, auth, storage, handleFirebaseError };
