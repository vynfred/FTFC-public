const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');

// Email templates and types
const EMAIL_TYPES = {
  WELCOME: 'welcome',
  MEETING_SCHEDULED: 'meeting_scheduled',
  DOCUMENT_UPLOADED: 'document_uploaded',
  MILESTONE_COMPLETED: 'milestone_completed',
  PASSWORD_RESET: 'password_reset',
  LEAD_NOTIFICATION: 'lead_notification',
  REFERRAL_RECEIVED: 'referral_received'
};

/**
 * Initialize the SendGrid service with API key from environment
 */
const initSendGrid = () => {
  // Get API key from environment variables
  const apiKey = functions.config().sendgrid?.key;
  
  if (!apiKey) {
    console.error('SendGrid API key not found in environment variables');
    throw new Error('SendGrid API key not configured');
  }
  
  sgMail.setApiKey(apiKey);
};

/**
 * Get email subject based on email type and data
 * @param {string} emailType - Type of email from EMAIL_TYPES
 * @param {Object} data - Data to populate the subject
 * @returns {string} - Email subject
 */
const getSubjectForEmailType = (emailType, data) => {
  switch (emailType) {
    case EMAIL_TYPES.WELCOME:
      return `Welcome to FTFC, ${data.name}!`;
    case EMAIL_TYPES.MEETING_SCHEDULED:
      return `Meeting Scheduled: ${data.meetingTitle}`;
    case EMAIL_TYPES.DOCUMENT_UPLOADED:
      return `New Document: ${data.documentName} has been uploaded`;
    case EMAIL_TYPES.MILESTONE_COMPLETED:
      return `Milestone Completed: ${data.milestoneName}`;
    case EMAIL_TYPES.PASSWORD_RESET:
      return 'FTFC Password Reset Request';
    case EMAIL_TYPES.LEAD_NOTIFICATION:
      return `New Lead: ${data.leadName} from ${data.source}`;
    case EMAIL_TYPES.REFERRAL_RECEIVED:
      return `New Referral from ${data.referrerName}`;
    default:
      return 'FTFC Notification';
  }
};

/**
 * Get email HTML content based on email type and data
 * @param {string} emailType - Type of email from EMAIL_TYPES
 * @param {Object} data - Data to populate the HTML content
 * @returns {string} - Email HTML content
 */
const getHtmlForEmailType = (emailType, data) => {
  // Common header and footer for all emails
  const header = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #0a1950;
          padding: 20px;
          text-align: center;
        }
        .header img {
          max-width: 150px;
        }
        .content {
          padding: 20px;
          background-color: #fff;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .button {
          display: inline-block;
          background-color: #0a1950;
          color: #ffd700 !important;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 4px;
          margin: 20px 0;
          font-weight: bold;
        }
        h1 {
          color: #0a1950;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://ftfc-start.web.app/ftfc-logo.png" alt="FTFC Logo">
        </div>
        <div class="content">
  `;

  const footer = `
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} FTFC. All rights reserved.</p>
          <p>123 Business Avenue, Suite 100, San Francisco, CA 94107</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Email-specific content
  let content = '';
  
  switch (emailType) {
    case EMAIL_TYPES.WELCOME:
      content = `
        <h1>Welcome to FTFC, ${data.name}!</h1>
        <p>Thank you for joining our platform. We're excited to help you grow your business.</p>
        <p>Your account has been created successfully. You can now log in to your portal at any time.</p>
        <p><a href="https://ftfc-start.web.app/login" class="button">Log In to Your Account</a></p>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
      `;
      break;
      
    case EMAIL_TYPES.MEETING_SCHEDULED:
      content = `
        <h1>Meeting Scheduled</h1>
        <p>Your meeting "${data.meetingTitle}" has been scheduled for ${data.meetingDate} at ${data.meetingTime}.</p>
        <p><strong>Meeting Details:</strong></p>
        <ul>
          <li>Title: ${data.meetingTitle}</li>
          <li>Date: ${data.meetingDate}</li>
          <li>Time: ${data.meetingTime}</li>
          <li>Duration: ${data.duration} minutes</li>
          ${data.location ? `<li>Location: ${data.location}</li>` : ''}
          ${data.meetingLink ? `<li>Meeting Link: <a href="${data.meetingLink}">${data.meetingLink}</a></li>` : ''}
        </ul>
        <p><a href="${data.calendarLink}" class="button">Add to Calendar</a></p>
      `;
      break;
      
    case EMAIL_TYPES.DOCUMENT_UPLOADED:
      content = `
        <h1>New Document Uploaded</h1>
        <p>A new document has been uploaded to your account.</p>
        <p><strong>Document Details:</strong></p>
        <ul>
          <li>Name: ${data.documentName}</li>
          <li>Uploaded by: ${data.uploadedBy}</li>
          <li>Date: ${data.uploadDate}</li>
        </ul>
        <p><a href="${data.documentLink}" class="button">View Document</a></p>
      `;
      break;
      
    case EMAIL_TYPES.MILESTONE_COMPLETED:
      content = `
        <h1>Milestone Completed</h1>
        <p>Congratulations! The milestone "${data.milestoneName}" has been completed.</p>
        <p><strong>Milestone Details:</strong></p>
        <ul>
          <li>Name: ${data.milestoneName}</li>
          <li>Completed on: ${data.completionDate}</li>
          <li>Next milestone: ${data.nextMilestone || 'None'}</li>
        </ul>
        <p><a href="${data.portalLink}" class="button">View in Portal</a></p>
      `;
      break;
      
    case EMAIL_TYPES.PASSWORD_RESET:
      content = `
        <h1>Password Reset Request</h1>
        <p>We received a request to reset your password for your FTFC account.</p>
        <p>If you didn't make this request, you can safely ignore this email.</p>
        <p><a href="${data.resetLink}" class="button">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
      `;
      break;
      
    case EMAIL_TYPES.LEAD_NOTIFICATION:
      content = `
        <h1>New Lead Notification</h1>
        <p>A new lead has been added to the system.</p>
        <p><strong>Lead Details:</strong></p>
        <ul>
          <li>Name: ${data.leadName}</li>
          <li>Company: ${data.company || 'N/A'}</li>
          <li>Email: ${data.email}</li>
          <li>Phone: ${data.phone || 'N/A'}</li>
          <li>Source: ${data.source}</li>
        </ul>
        <p><a href="${data.leadLink}" class="button">View Lead</a></p>
      `;
      break;
      
    case EMAIL_TYPES.REFERRAL_RECEIVED:
      content = `
        <h1>New Referral Received</h1>
        <p>You've received a new referral from ${data.referrerName}.</p>
        <p><strong>Referral Details:</strong></p>
        <ul>
          <li>Referrer: ${data.referrerName}</li>
          <li>Referral Name: ${data.referralName}</li>
          <li>Company: ${data.company || 'N/A'}</li>
          <li>Email: ${data.email}</li>
          <li>Phone: ${data.phone || 'N/A'}</li>
        </ul>
        <p><a href="${data.referralLink}" class="button">View Referral</a></p>
      `;
      break;
      
    default:
      content = `
        <h1>FTFC Notification</h1>
        <p>You have a new notification from FTFC.</p>
        <p><a href="https://ftfc-start.web.app/login" class="button">Log In to Your Account</a></p>
      `;
  }
  
  return header + content + footer;
};

/**
 * Send an email using SendGrid
 * @param {string} to - Recipient email address
 * @param {string} emailType - Type of email from EMAIL_TYPES
 * @param {Object} data - Data to populate the email content
 * @returns {Promise<Object>} - Result of the operation
 */
const sendEmail = async (to, emailType, data) => {
  try {
    // Initialize SendGrid
    initSendGrid();
    
    // Prepare email message
    const msg = {
      to,
      from: functions.config().sendgrid?.from_email || 'noreply@ftfc.co',
      subject: getSubjectForEmailType(emailType, data),
      html: getHtmlForEmailType(emailType, data),
    };
    
    // Send email
    await sgMail.send(msg);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

module.exports = {
  EMAIL_TYPES,
  sendEmail
};
