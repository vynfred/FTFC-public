/**
 * Simple SendGrid Test Script
 * 
 * This script sends a test email using SendGrid to verify that the API key is working correctly.
 */
const sgMail = require('@sendgrid/mail');
const inquirer = require('inquirer');
const chalk = require('chalk');

// Configuration
const config = {
  fromEmail: 'noreply@ftfc.co',
  testEmail: 'hellovynfred@gmail.com'
};

// Main function
async function testSendGrid() {
  console.log(chalk.blue('Starting SendGrid Email Test'));
  
  // Get API key from user input
  const { apiKey } = await inquirer.prompt([
    {
      type: 'password',
      name: 'apiKey',
      message: 'Enter your SendGrid API key:',
      mask: '*'
    }
  ]);
  
  // Initialize SendGrid
  sgMail.setApiKey(apiKey);
  
  try {
    // Send a test email
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
    
    console.log(chalk.green('✓ Test email sent successfully!'));
    console.log(chalk.gray(`Status code: ${response[0].statusCode}`));
    console.log(chalk.blue('SendGrid integration is working correctly.'));
  } catch (error) {
    console.error(chalk.red('✗ Error sending test email:'));
    console.error(chalk.red(error.message));
    
    if (error.response) {
      console.error(chalk.red(`Status code: ${error.response.status}`));
      console.error(chalk.red(`Response body: ${JSON.stringify(error.response.body)}`));
    }
    
    console.log(chalk.yellow('Please check your SendGrid API key and try again.'));
  }
}

// Run the test
testSendGrid().catch(console.error);
