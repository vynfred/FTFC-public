/**
 * Script to manually trigger the Gemini notes processing
 * 
 * This script calls the Cloud Function endpoint to trigger the processing
 * of Gemini meeting notes from team members' Google Drive accounts.
 */

const fetch = require('node-fetch');

// Cloud Function URL
const FUNCTION_URL = 'https://us-central1-ftfc-start.cloudfunctions.net/triggerGeminiNotesProcessing';

async function triggerGeminiNotesProcessing() {
  try {
    console.log('Triggering Gemini notes processing...');
    
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('Success:', data);
    } else {
      console.error('Error:', data);
    }
  } catch (error) {
    console.error('Error triggering Gemini notes processing:', error);
  }
}

// Execute the function
triggerGeminiNotesProcessing();
