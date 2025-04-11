/**
 * SendGrid Email Integration Test Script
 *
 * This script tests the SendGrid email integration for the FTFC application:
 * 1. Tests the password reset email flow
 * 2. Tests other email notifications
 */

const admin = require('firebase-admin');
const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin with service account
try {
  // Check if service account file exists
  const serviceAccountPath = path.join(__dirname, '..', 'service-account.json');

  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Use application default credentials
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  } else {
    console.warn(chalk.yellow('No service account found. Some tests may fail.'));
    console.warn(chalk.yellow('Please set up service-account.json or GOOGLE_APPLICATION_CREDENTIALS.'));

    // Initialize without credentials for basic tests
    admin.initializeApp();
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
  console.warn(chalk.yellow('Continuing with limited functionality...'));
}

// Configuration
const config = {
  testEmail: 'hellovynfred@gmail.com', // Change to your test email
  fromEmail: 'noreply@ftfc.co',
  testUserId: 'test-user-' + uuidv4().substring(0, 8)
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
async function testSendGridIntegration() {
  console.log(chalk.blue('Starting SendGrid Email Integration Tests'));

  // Get SendGrid API key
  const apiKey = await getSendGridApiKey();
  if (!apiKey) {
    console.error(chalk.red('SendGrid API key not found. Tests cannot proceed.'));
    return;
  }

  // Initialize SendGrid
  sgMail.setApiKey(apiKey);

  try {
    // Test 1: Send a test email
    console.log(chalk.yellow('\nTest 1: Send Test Email'));
    await testSendEmail(apiKey);

    // Test 2: Test password reset email
    console.log(chalk.yellow('\nTest 2: Password Reset Email'));
    await testPasswordResetEmail();

    // Test 3: Test welcome email
    console.log(chalk.yellow('\nTest 3: Welcome Email'));
    await testWelcomeEmail();

    // Test 4: Test meeting notification email
    console.log(chalk.yellow('\nTest 4: Meeting Notification Email'));
    await testMeetingEmail();

    console.log(chalk.blue('\nAll SendGrid Email Tests Completed'));
  } catch (error) {
    console.error(chalk.red('Error during SendGrid testing:'), error);
  }
}

// Get SendGrid API key
async function getSendGridApiKey() {
  try {
    // Try to get from Firebase config
    const sendgridConfig = functions.config().sendgrid;
    if (sendgridConfig && sendgridConfig.key) {
      return sendgridConfig.key;
    }

    // If not found in config, prompt user
    const { apiKey } = await inquirer.prompt([
      {
        type: 'password',
        name: 'apiKey',
        message: 'Enter your SendGrid API key:',
        validate: input => input.length > 0 ? true : 'API key is required'
      }
    ]);

    return apiKey;
  } catch (error) {
    console.error('Error getting SendGrid API key:', error);
    return null;
  }
}

// Test sending a basic email
async function testSendEmail(apiKey) {
  try {
    const msg = {
      to: config.testEmail,
      from: config.fromEmail,
      subject: 'FTFC SendGrid Test',
      text: 'This is a test email from FTFC using SendGrid.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0a1950; padding: 20px; text-align: center; color: #ffd700;">
            <h1>FTFC SendGrid Test</h1>
          </div>
          <div style="padding: 20px; background-color: #f5f5f5;">
            <p>This is a test email from FTFC using SendGrid.</p>
            <p>If you're seeing this, the SendGrid integration is working correctly!</p>
            <p>Time sent: ${new Date().toISOString()}</p>
          </div>
          <div style="padding: 10px; background-color: #0a1950; color: white; text-align: center;">
            <p>&copy; ${new Date().getFullYear()} FTFC. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const response = await sgMail.send(msg);

    logResult(
      'Send Test Email',
      response && response[0] && response[0].statusCode >= 200 && response[0].statusCode < 300,
      `Email sent with status code: ${response[0].statusCode}`
    );

    return true;
  } catch (error) {
    logResult('Send Test Email', false, `Error: ${error.message}`);
    if (error.response) {
      console.error('SendGrid API response:', error.response.body);
    }
    return false;
  }
}

// Test password reset email
async function testPasswordResetEmail() {
  try {
    // Create a test user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: config.testEmail,
      password: 'TestPassword123',
      displayName: 'Test User',
      uid: config.testUserId
    });

    // Generate password reset link
    const resetLink = await admin.auth().generatePasswordResetLink(config.testEmail);

    // Send password reset email
    const msg = {
      to: config.testEmail,
      from: config.fromEmail,
      subject: 'FTFC Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0a1950; padding: 20px; text-align: center; color: #ffd700;">
            <h1>Password Reset Request</h1>
          </div>
          <div style="padding: 20px; background-color: #f5f5f5;">
            <p>We received a request to reset your password for your FTFC account.</p>
            <p>If you didn't make this request, you can safely ignore this email.</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #0a1950; color: #ffd700; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
            </p>
            <p>This link will expire in 1 hour.</p>
          </div>
          <div style="padding: 10px; background-color: #0a1950; color: white; text-align: center;">
            <p>&copy; ${new Date().getFullYear()} FTFC. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const response = await sgMail.send(msg);

    logResult(
      'Password Reset Email',
      response && response[0] && response[0].statusCode >= 200 && response[0].statusCode < 300,
      `Password reset email sent with status code: ${response[0].statusCode}`
    );

    // Clean up - delete test user
    await admin.auth().deleteUser(config.testUserId);

    return true;
  } catch (error) {
    logResult('Password Reset Email', false, `Error: ${error.message}`);

    // Try to clean up even if there was an error
    try {
      await admin.auth().deleteUser(config.testUserId);
    } catch (cleanupError) {
      console.error('Error cleaning up test user:', cleanupError);
    }

    return false;
  }
}

// Test welcome email
async function testWelcomeEmail() {
  try {
    const msg = {
      to: config.testEmail,
      from: config.fromEmail,
      subject: 'Welcome to FTFC, Test User!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0a1950; padding: 20px; text-align: center; color: #ffd700;">
            <h1>Welcome to FTFC!</h1>
          </div>
          <div style="padding: 20px; background-color: #f5f5f5;">
            <h2>Hello Test User,</h2>
            <p>Thank you for joining our platform. We're excited to help you grow your business.</p>
            <p>Your account has been created successfully. You can now log in to your portal at any time.</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="https://ftfc-start.web.app/login" style="background-color: #0a1950; color: #ffd700; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Log In to Your Account</a>
            </p>
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
          </div>
          <div style="padding: 10px; background-color: #0a1950; color: white; text-align: center;">
            <p>&copy; ${new Date().getFullYear()} FTFC. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const response = await sgMail.send(msg);

    logResult(
      'Welcome Email',
      response && response[0] && response[0].statusCode >= 200 && response[0].statusCode < 300,
      `Welcome email sent with status code: ${response[0].statusCode}`
    );

    return true;
  } catch (error) {
    logResult('Welcome Email', false, `Error: ${error.message}`);
    return false;
  }
}

// Test meeting notification email
async function testMeetingEmail() {
  try {
    const meetingDate = new Date();
    meetingDate.setDate(meetingDate.getDate() + 3); // 3 days from now

    const msg = {
      to: config.testEmail,
      from: config.fromEmail,
      subject: 'Meeting Scheduled: Quarterly Review',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0a1950; padding: 20px; text-align: center; color: #ffd700;">
            <h1>Meeting Scheduled</h1>
          </div>
          <div style="padding: 20px; background-color: #f5f5f5;">
            <h2>Quarterly Review</h2>
            <p>A new meeting has been scheduled with your FTFC team member.</p>

            <div style="background-color: white; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p><strong>Date:</strong> ${meetingDate.toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${meetingDate.toLocaleTimeString()}</p>
              <p><strong>Location:</strong> Google Meet</p>
              <p><strong>Meeting Link:</strong> <a href="https://meet.google.com/test-meeting-link">https://meet.google.com/test-meeting-link</a></p>
            </div>

            <p>Please make sure to add this meeting to your calendar. We look forward to speaking with you!</p>

            <p style="text-align: center; margin: 30px 0;">
              <a href="https://calendar.google.com" style="background-color: #0a1950; color: #ffd700; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Add to Calendar</a>
            </p>
          </div>
          <div style="padding: 10px; background-color: #0a1950; color: white; text-align: center;">
            <p>&copy; ${new Date().getFullYear()} FTFC. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const response = await sgMail.send(msg);

    logResult(
      'Meeting Notification Email',
      response && response[0] && response[0].statusCode >= 200 && response[0].statusCode < 300,
      `Meeting notification email sent with status code: ${response[0].statusCode}`
    );

    return true;
  } catch (error) {
    logResult('Meeting Notification Email', false, `Error: ${error.message}`);
    return false;
  }
}

// Run the tests
testSendGridIntegration().catch(console.error);
