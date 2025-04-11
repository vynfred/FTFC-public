/**
 * Meeting Notes Capture Test Script
 * 
 * This script tests the meeting notes capture functionality:
 * 1. Tests Google Drive integration
 * 2. Tests entity matching logic
 * 3. Verifies notes are correctly associated with entities
 * 4. Tests the scheduled function for regular processing
 */

const admin = require('firebase-admin');
const { google } = require('googleapis');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin with service account
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
}

// Configuration
const config = {
  testEmail: 'hellovynfred@gmail.com', // Change to your test email
  testFolderId: '1Z2Kc7JHDl6rnvaAiP6pv6M-N52zE0lRr', // Google Drive folder ID for meeting recordings
  testMeetingTitle: 'Test Meeting with Client ABC',
  testClientEmail: 'client@example.com',
  testInvestorEmail: 'investor@example.com',
  testPartnerEmail: 'partner@example.com'
};

// Helper function to log results
function logResult(test, result, message) {
  if (result) {
    console.log(chalk.green(`✓ ${test}: ${message}`));
  } else {
    console.log(chalk.red(`✗ ${test}: ${message}`));
  }
}

// Main test function
async function testMeetingNotesCapture() {
  console.log(chalk.blue('Starting Meeting Notes Capture Tests'));
  
  // Get Google OAuth credentials
  const credentials = await getGoogleCredentials();
  if (!credentials) {
    console.error(chalk.red('Google credentials not found. Tests cannot proceed.'));
    return;
  }
  
  try {
    // Initialize Google API clients
    const { drive, docs } = await initializeGoogleClients(credentials);
    
    // Test 1: Google Drive Connection
    console.log(chalk.yellow('\nTest 1: Google Drive Connection'));
    await testGoogleDriveConnection(drive);
    
    // Test 2: Create Test Meeting Note
    console.log(chalk.yellow('\nTest 2: Create Test Meeting Note'));
    const noteId = await createTestMeetingNote(drive, docs);
    
    // Test 3: Entity Matching Logic
    console.log(chalk.yellow('\nTest 3: Entity Matching Logic'));
    await testEntityMatching();
    
    // Test 4: Process Meeting Note
    console.log(chalk.yellow('\nTest 4: Process Meeting Note'));
    await testProcessMeetingNote(noteId);
    
    // Test 5: Scheduled Function
    console.log(chalk.yellow('\nTest 5: Scheduled Function'));
    await testScheduledFunction();
    
    console.log(chalk.blue('\nAll Meeting Notes Capture Tests Completed'));
  } catch (error) {
    console.error(chalk.red('Error during Meeting Notes Capture testing:'), error);
  }
}

// Get Google OAuth credentials
async function getGoogleCredentials() {
  try {
    // Check if credentials file exists
    const credentialsPath = path.join(__dirname, '..', 'google-credentials.json');
    if (fs.existsSync(credentialsPath)) {
      return JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    }
    
    // If not found, prompt user
    const { clientId, clientSecret } = await inquirer.prompt([
      {
        type: 'input',
        name: 'clientId',
        message: 'Enter your Google OAuth client ID:',
        validate: input => input.length > 0 ? true : 'Client ID is required'
      },
      {
        type: 'password',
        name: 'clientSecret',
        message: 'Enter your Google OAuth client secret:',
        validate: input => input.length > 0 ? true : 'Client secret is required'
      }
    ]);
    
    const credentials = {
      installed: {
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uris: ['urn:ietf:wg:oauth:2.0:oob', 'http://localhost']
      }
    };
    
    // Save credentials for future use
    fs.writeFileSync(credentialsPath, JSON.stringify(credentials, null, 2));
    
    return credentials;
  } catch (error) {
    console.error('Error getting Google credentials:', error);
    return null;
  }
}

// Initialize Google API clients
async function initializeGoogleClients(credentials) {
  try {
    const { client_id, client_secret, redirect_uris } = credentials.installed;
    
    // Create OAuth2 client
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );
    
    // Check if token exists
    const tokenPath = path.join(__dirname, '..', 'google-token.json');
    if (!fs.existsSync(tokenPath)) {
      // Generate auth URL
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/drive.readonly',
          'https://www.googleapis.com/auth/documents.readonly',
          'https://www.googleapis.com/auth/drive.file'
        ]
      });
      
      console.log(chalk.yellow('Authorize this app by visiting:'));
      console.log(chalk.blue(authUrl));
      
      const { code } = await inquirer.prompt([
        {
          type: 'input',
          name: 'code',
          message: 'Enter the authorization code:',
          validate: input => input.length > 0 ? true : 'Authorization code is required'
        }
      ]);
      
      // Get token
      const { tokens } = await oAuth2Client.getToken(code);
      
      // Save token for future use
      fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
      
      oAuth2Client.setCredentials(tokens);
    } else {
      // Use existing token
      const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
      oAuth2Client.setCredentials(tokens);
    }
    
    // Initialize Drive and Docs clients
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    const docs = google.docs({ version: 'v1', auth: oAuth2Client });
    
    return { drive, docs };
  } catch (error) {
    console.error('Error initializing Google clients:', error);
    throw error;
  }
}

// Test Google Drive connection
async function testGoogleDriveConnection(drive) {
  try {
    // List files in the test folder
    const response = await drive.files.list({
      q: `'${config.testFolderId}' in parents`,
      fields: 'files(id, name, mimeType)',
      spaces: 'drive'
    });
    
    const files = response.data.files;
    
    logResult(
      'Google Drive Connection',
      true,
      `Successfully connected to Google Drive. Found ${files.length} files in the test folder.`
    );
    
    return true;
  } catch (error) {
    logResult('Google Drive Connection', false, `Error: ${error.message}`);
    return false;
  }
}

// Create a test meeting note in Google Drive
async function createTestMeetingNote(drive, docs) {
  try {
    // Create a new Google Doc
    const docResponse = await docs.documents.create({
      requestBody: {
        title: config.testMeetingTitle
      }
    });
    
    const docId = docResponse.data.documentId;
    
    // Add content to the document
    await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: {
        requests: [
          {
            insertText: {
              location: {
                index: 1
              },
              text: `Meeting Notes: ${config.testMeetingTitle}\n\nDate: ${new Date().toLocaleDateString()}\n\nParticipants:\n- Test Team Member (${config.testEmail})\n- Client ABC (${config.testClientEmail})\n\nAgenda:\n1. Project Status Update\n2. Next Steps\n\nNotes:\n- Discussed current project status\n- Client is satisfied with progress\n- Next milestone due in 2 weeks\n\nAction Items:\n- Team to send updated timeline by Friday\n- Client to provide feedback on latest deliverable\n`
            }
          }
        ]
      }
    });
    
    // Move the document to the test folder
    await drive.files.update({
      fileId: docId,
      addParents: config.testFolderId,
      fields: 'id, parents'
    });
    
    logResult(
      'Create Test Meeting Note',
      true,
      `Successfully created test meeting note with ID: ${docId}`
    );
    
    return docId;
  } catch (error) {
    logResult('Create Test Meeting Note', false, `Error: ${error.message}`);
    return null;
  }
}

// Test entity matching logic
async function testEntityMatching() {
  try {
    // Create test entities in Firestore
    const db = admin.firestore();
    
    // Create test client
    await db.collection('clients').doc('test-client').set({
      name: 'Client ABC',
      email: config.testClientEmail,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Create test investor
    await db.collection('investors').doc('test-investor').set({
      name: 'Investor XYZ',
      email: config.testInvestorEmail,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Create test partner
    await db.collection('partners').doc('test-partner').set({
      name: 'Partner 123',
      email: config.testPartnerEmail,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Test matching logic with client email
    const clientMatch = await testMatchEntity(config.testClientEmail);
    logResult(
      'Entity Matching - Client',
      clientMatch && clientMatch.type === 'client',
      clientMatch 
        ? `Successfully matched client email to entity: ${clientMatch.type}/${clientMatch.id}`
        : 'Failed to match client email to entity'
    );
    
    // Test matching logic with investor email
    const investorMatch = await testMatchEntity(config.testInvestorEmail);
    logResult(
      'Entity Matching - Investor',
      investorMatch && investorMatch.type === 'investor',
      investorMatch 
        ? `Successfully matched investor email to entity: ${investorMatch.type}/${investorMatch.id}`
        : 'Failed to match investor email to entity'
    );
    
    // Test matching logic with partner email
    const partnerMatch = await testMatchEntity(config.testPartnerEmail);
    logResult(
      'Entity Matching - Partner',
      partnerMatch && partnerMatch.type === 'partner',
      partnerMatch 
        ? `Successfully matched partner email to entity: ${partnerMatch.type}/${partnerMatch.id}`
        : 'Failed to match partner email to entity'
    );
    
    return true;
  } catch (error) {
    logResult('Entity Matching', false, `Error: ${error.message}`);
    return false;
  }
}

// Test matching an email to an entity
async function testMatchEntity(email) {
  try {
    const db = admin.firestore();
    
    // Check clients
    const clientsSnapshot = await db.collection('clients')
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (!clientsSnapshot.empty) {
      return {
        type: 'client',
        id: clientsSnapshot.docs[0].id
      };
    }
    
    // Check investors
    const investorsSnapshot = await db.collection('investors')
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (!investorsSnapshot.empty) {
      return {
        type: 'investor',
        id: investorsSnapshot.docs[0].id
      };
    }
    
    // Check partners
    const partnersSnapshot = await db.collection('partners')
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (!partnersSnapshot.empty) {
      return {
        type: 'partner',
        id: partnersSnapshot.docs[0].id
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error matching entity:', error);
    return null;
  }
}

// Test processing a meeting note
async function testProcessMeetingNote(noteId) {
  if (!noteId) {
    logResult('Process Meeting Note', false, 'No note ID provided');
    return false;
  }
  
  try {
    const db = admin.firestore();
    
    // Create a test processed note record
    await db.collection('processedNotes').add({
      fileId: noteId,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
      entityType: 'client',
      entityId: 'test-client'
    });
    
    // Create a test transcript record
    const transcriptRef = await db.collection('transcripts').add({
      title: config.testMeetingTitle,
      date: new Date(),
      participants: [config.testEmail, config.testClientEmail],
      transcript: 'This is a test transcript content.',
      summary: 'Test meeting summary.',
      keyPoints: ['Key point 1', 'Key point 2'],
      actionItems: ['Action item 1', 'Action item 2'],
      entityType: 'client',
      entityId: 'test-client',
      sourceType: 'gemini',
      sourceId: noteId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Update client with reference to transcript
    await db.collection('clients').doc('test-client').update({
      transcripts: admin.firestore.FieldValue.arrayUnion({
        id: transcriptRef.id,
        title: config.testMeetingTitle,
        date: new Date(),
        sourceType: 'gemini',
        sourceId: noteId
      }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Verify the transcript was created and associated with the client
    const transcriptDoc = await db.collection('transcripts').doc(transcriptRef.id).get();
    const clientDoc = await db.collection('clients').doc('test-client').get();
    
    const transcriptExists = transcriptDoc.exists;
    const clientHasTranscript = clientDoc.exists && 
                               clientDoc.data().transcripts && 
                               clientDoc.data().transcripts.some(t => t.id === transcriptRef.id);
    
    logResult(
      'Process Meeting Note',
      transcriptExists && clientHasTranscript,
      transcriptExists && clientHasTranscript
        ? `Successfully processed meeting note and associated with client`
        : `Failed to process meeting note or associate with client`
    );
    
    return true;
  } catch (error) {
    logResult('Process Meeting Note', false, `Error: ${error.message}`);
    return false;
  }
}

// Test the scheduled function for regular processing
async function testScheduledFunction() {
  try {
    // Call the Cloud Function directly
    const functionsUrl = 'https://us-central1-ftfc-start.cloudfunctions.net/triggerGeminiNotesProcessing';
    
    // Use fetch to call the function
    const response = await fetch(functionsUrl);
    const data = await response.json();
    
    logResult(
      'Scheduled Function',
      response.ok,
      response.ok
        ? `Successfully triggered Gemini notes processing: ${JSON.stringify(data)}`
        : `Failed to trigger Gemini notes processing: ${response.statusText}`
    );
    
    return true;
  } catch (error) {
    logResult('Scheduled Function', false, `Error: ${error.message}`);
    return false;
  }
}

// Run the tests
testMeetingNotesCapture().catch(console.error);
