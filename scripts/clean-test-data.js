// Script to clean up the Firebase database, keeping only the specified test accounts
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, deleteDoc, query, where } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Test accounts to keep
const TEST_ACCOUNTS = {
  clients: ['hellovynfred@gmail.com'],
  investors: ['wilfred.hirst@gmail.com']
};

// Function to clean up a collection
async function cleanupCollection(collectionName, emailField, testEmails) {
  console.log(`Cleaning up ${collectionName} collection...`);
  
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    
    const deletePromises = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const email = data[emailField];
      
      // If the document doesn't have an email field or the email is not in the test emails list, delete it
      if (!email || !testEmails.includes(email.toLowerCase())) {
        console.log(`Deleting ${collectionName} document with ID: ${doc.id}`);
        deletePromises.push(deleteDoc(doc.ref));
      } else {
        console.log(`Keeping ${collectionName} document with email: ${email}`);
      }
    });
    
    await Promise.all(deletePromises);
    console.log(`Deleted ${deletePromises.length} documents from ${collectionName} collection`);
  } catch (error) {
    console.error(`Error cleaning up ${collectionName} collection:`, error);
  }
}

// Function to clean up all collections
async function cleanupDatabase() {
  try {
    // Clean up clients collection
    await cleanupCollection('clients', 'email', TEST_ACCOUNTS.clients);
    
    // Clean up investors collection
    await cleanupCollection('investors', 'email', TEST_ACCOUNTS.investors);
    
    // Clean up leads collection (delete all)
    await cleanupCollection('leads', 'email', []);
    
    // Clean up partners collection (delete all)
    await cleanupCollection('partners', 'email', []);
    
    // Clean up meetings collection (delete all)
    await cleanupCollection('meetings', 'email', []);
    
    // Clean up transcripts collection (delete all)
    await cleanupCollection('transcripts', 'email', []);
    
    console.log('Database cleanup completed successfully');
  } catch (error) {
    console.error('Error cleaning up database:', error);
  }
}

// Run the cleanup function
cleanupDatabase();
