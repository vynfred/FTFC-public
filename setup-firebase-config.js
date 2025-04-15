/**
 * Setup Firebase Functions Configuration
 * 
 * This script reads values from the .env file and sets them in Firebase Functions configuration
 * without exposing sensitive information in logs or scripts.
 */
require('dotenv').config();
const { execSync } = require('child_process');

console.log('Setting up Firebase Functions configuration...');

// Function to safely set a config value
const setConfig = (path, value) => {
  if (!value) {
    console.log(`Skipping ${path} - value not found in .env`);
    return;
  }
  
  try {
    execSync(`firebase functions:config:set ${path}="${value}"`, { stdio: 'pipe' });
    console.log(`✓ Set ${path}`);
  } catch (error) {
    console.error(`✗ Error setting ${path}: ${error.message}`);
  }
};

// Set SendGrid configuration
setConfig('sendgrid.key', process.env.REACT_APP_SENDGRID_API_KEY);
setConfig('sendgrid.from_email', process.env.REACT_APP_SENDGRID_FROM_EMAIL || 'noreply@ftfc.co');

// Set Google configuration
setConfig('google.project_id', process.env.GOOGLE_PROJECT_ID);
setConfig('google.client_email', process.env.GOOGLE_CLIENT_EMAIL);
setConfig('google.private_key', process.env.GOOGLE_PRIVATE_KEY);
setConfig('google.drive_folder_id', process.env.REACT_APP_GOOGLE_DRIVE_FOLDER_ID);
setConfig('google.meet_api_key', process.env.REACT_APP_GOOGLE_MEET_API_KEY);
setConfig('google.speech_to_text_api_key', process.env.REACT_APP_GOOGLE_SPEECH_TO_TEXT_API_KEY);
setConfig('google.drive_api_key', process.env.REACT_APP_GOOGLE_DRIVE_API_KEY);
setConfig('google.webhook_key', process.env.REACT_APP_WEBHOOK_API_KEY);

// Set admin configuration
setConfig('admin.email', 'hellovynfred@gmail.com');

console.log('\nFirebase Functions configuration setup complete.');
console.log('To deploy the updated configuration, run: firebase deploy --only functions');
