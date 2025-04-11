/**
 * Test script for Gemini notes processing
 * 
 * This script makes a direct HTTP request to the Cloud Function endpoint
 * to trigger the Gemini notes processing.
 */

const https = require('https');

// Cloud Function URL
const FUNCTION_URL = 'https://us-central1-ftfc-start.cloudfunctions.net/triggerGeminiNotesProcessing';

// Make the request
const req = https.request(FUNCTION_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const jsonResponse = JSON.parse(data);
      console.log('RESPONSE:', jsonResponse);
    } catch (e) {
      console.log('RESPONSE (raw):', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

// End the request
req.end();

console.log('Request sent to:', FUNCTION_URL);
console.log('Waiting for response...');
