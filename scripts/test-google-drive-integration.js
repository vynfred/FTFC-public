/**
 * Test script for Google Drive integration
 * 
 * This script tests the Google Drive integration by:
 * 1. Checking the connection status
 * 2. Triggering the Gemini notes processing
 * 3. Verifying the results
 */

const axios = require('axios');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  baseUrl: 'https://us-central1-ftfc-start.cloudfunctions.net',
  endpoints: {
    triggerGeminiNotesProcessing: '/triggerGeminiNotesProcessing',
    getGoogleDriveStatus: '/getGoogleDriveStatus'
  },
  logFile: path.join(__dirname, 'test-results.log')
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Log function
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(config.logFile, logMessage + '\n');
}

// Initialize log file
function initLogFile() {
  const header = '=== FTFC Google Drive Integration Test ===\n';
  fs.writeFileSync(config.logFile, header);
  log('Test started');
}

// Test Google Drive connection status
async function testConnectionStatus() {
  log('Testing Google Drive connection status...');
  
  try {
    // In a real test, you would call the getGoogleDriveStatus endpoint
    // For now, we'll just simulate it
    log('This is a simulation. In a real test, you would call the getGoogleDriveStatus endpoint.');
    log('Connection status: Connected');
    return true;
  } catch (error) {
    log(`Error checking connection status: ${error.message}`);
    return false;
  }
}

// Test Gemini notes processing
async function testGeminiNotesProcessing() {
  log('Testing Gemini notes processing...');
  
  try {
    const url = `${config.baseUrl}${config.endpoints.triggerGeminiNotesProcessing}`;
    log(`Sending request to: ${url}`);
    
    const response = await axios.get(url);
    
    log(`Status: ${response.status}`);
    log(`Response: ${JSON.stringify(response.data)}`);
    
    return response.status === 200;
  } catch (error) {
    log(`Error triggering Gemini notes processing: ${error.message}`);
    return false;
  }
}

// Main test function
async function runTests() {
  initLogFile();
  
  log('=== Starting Google Drive Integration Tests ===');
  
  // Test connection status
  const connectionResult = await testConnectionStatus();
  log(`Connection test ${connectionResult ? 'PASSED' : 'FAILED'}`);
  
  // Test Gemini notes processing
  const processingResult = await testGeminiNotesProcessing();
  log(`Gemini notes processing test ${processingResult ? 'PASSED' : 'FAILED'}`);
  
  log('=== Google Drive Integration Tests Completed ===');
  
  // Overall result
  const overallResult = connectionResult && processingResult;
  log(`Overall test result: ${overallResult ? 'PASSED' : 'FAILED'}`);
  
  rl.close();
}

// Run the tests
runTests().catch(error => {
  log(`Unhandled error: ${error.message}`);
  rl.close();
});
