// Firebase configuration
// Replace these values with your actual Firebase credentials
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = firebase.firestore();
const auth = firebase.auth();

// Connect to emulators in development
if (location.hostname === "localhost") {
    db.useEmulator("localhost", 8081);
    auth.useEmulator("http://localhost:9098");
    firebase.functions().useEmulator("localhost", 5001);
}

// Add proper session handling
auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(() => {
        // Existing auth code
    })
    .catch((error) => {
        console.error('Error setting persistence:', error);
    });

// Auth state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        if (window.location.pathname.includes('login.html')) {
            window.location.href = '/dashboard.html';
        }
    } else {
        // User is signed out
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = '/login.html';
        }
    }
}); 