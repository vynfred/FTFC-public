/**
 * Test script for SendGrid email functionality
 * 
 * This script tests sending a password reset email using SendGrid
 */
const sgMail = require('@sendgrid/mail');
const chalk = require('chalk');
require('dotenv').config();

// Get API key from environment variable
const apiKey = process.env.REACT_APP_SENDGRID_API_KEY;
const fromEmail = process.env.REACT_APP_SENDGRID_FROM_EMAIL;

if (!apiKey) {
  console.error(chalk.red('REACT_APP_SENDGRID_API_KEY not found in environment variables'));
  process.exit(1);
}

if (!fromEmail) {
  console.error(chalk.red('REACT_APP_SENDGRID_FROM_EMAIL not found in environment variables'));
  process.exit(1);
}

// Set API key
sgMail.setApiKey(apiKey);

// Get recipient email from command line argument or use default
const recipientEmail = process.argv[2] || 'hellovynfred@gmail.com';

// Create password reset email
const msg = {
  to: recipientEmail,
  from: fromEmail,
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
          <a href="https://ftfc-start.web.app/reset-password?code=test-reset-code" style="background-color: #0a1950; color: #ffd700; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </p>
        <p>This link will expire in 1 hour.</p>
      </div>
      <div style="padding: 10px; background-color: #0a1950; color: white; text-align: center;">
        <p>&copy; ${new Date().getFullYear()} FTFC. All rights reserved.</p>
      </div>
    </div>
  `
};

// Send email
console.log(chalk.blue(`Sending password reset email to ${recipientEmail}...`));

sgMail.send(msg)
  .then((response) => {
    console.log(chalk.green('✓ Password reset email sent successfully!'));
    console.log(chalk.gray(`Status code: ${response[0].statusCode}`));
    console.log(chalk.blue('SendGrid integration is working correctly.'));
  })
  .catch((error) => {
    console.error(chalk.red('✗ Error sending password reset email:'));
    console.error(chalk.red(error.message));
    
    if (error.response) {
      console.error(chalk.red(`Status code: ${error.response.status}`));
      console.error(chalk.red(`Response body: ${JSON.stringify(error.response.body)}`));
    }
  });
