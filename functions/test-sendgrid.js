/**
 * Test script for SendGrid
 * 
 * This script sends a test email using SendGrid to verify that the API key is working correctly.
 * 
 * To run this script:
 * 1. Set the SENDGRID_API_KEY environment variable
 * 2. Run: node test-sendgrid.js
 */
const sgMail = require('@sendgrid/mail');

// Get API key from environment variable
const apiKey = process.env.SENDGRID_API_KEY;

if (!apiKey) {
  console.error('SENDGRID_API_KEY environment variable not set');
  process.exit(1);
}

// Set API key
sgMail.setApiKey(apiKey);

// Get recipient email from command line argument or use default
const recipientEmail = process.argv[2] || 'hellovynfred@gmail.com';

// Create email message
const msg = {
  to: recipientEmail,
  from: 'noreply@ftfc.co', // Use the email address you verified with SendGrid
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

// Send email
console.log(`Sending test email to ${recipientEmail}...`);

sgMail.send(msg)
  .then(() => {
    console.log('Test email sent successfully!');
  })
  .catch((error) => {
    console.error('Error sending test email:');
    console.error(error);
    
    if (error.response) {
      console.error('SendGrid API response:');
      console.error(error.response.body);
    }
  });
