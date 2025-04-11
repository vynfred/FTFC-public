import { callFunction } from '../firebase-config';

/**
 * Email types for the application
 */
export const EMAIL_TYPES = {
  WELCOME: 'welcome',
  MEETING_SCHEDULED: 'meeting_scheduled',
  DOCUMENT_UPLOADED: 'document_uploaded',
  MILESTONE_COMPLETED: 'milestone_completed',
  PASSWORD_RESET: 'password_reset',
  LEAD_NOTIFICATION: 'lead_notification',
  REFERRAL_RECEIVED: 'referral_received'
};

/**
 * Send a custom email using Firebase Functions
 * @param {string} to - Recipient email address
 * @param {string} emailType - Type of email from EMAIL_TYPES
 * @param {Object} emailData - Data to populate the email content
 * @returns {Promise<Object>} - Result of the operation
 */
export const sendCustomEmail = async (to, emailType, emailData = {}) => {
  try {
    // Call the function using our helper
    const result = await callFunction('sendCustomEmail', {
      to,
      emailType,
      emailData
    });

    return result.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send a welcome email to a new user
 * @param {string} email - Recipient email address
 * @param {string} name - Recipient name
 * @returns {Promise<Object>} - Result of the operation
 */
export const sendWelcomeEmail = async (email, name) => {
  return sendCustomEmail(email, EMAIL_TYPES.WELCOME, { name });
};

/**
 * Send a meeting scheduled email
 * @param {string} email - Recipient email address
 * @param {Object} meetingData - Meeting data
 * @returns {Promise<Object>} - Result of the operation
 */
export const sendMeetingEmail = async (email, meetingData) => {
  return sendCustomEmail(email, EMAIL_TYPES.MEETING_SCHEDULED, meetingData);
};

/**
 * Send a document uploaded email
 * @param {string} email - Recipient email address
 * @param {Object} documentData - Document data
 * @returns {Promise<Object>} - Result of the operation
 */
export const sendDocumentEmail = async (email, documentData) => {
  return sendCustomEmail(email, EMAIL_TYPES.DOCUMENT_UPLOADED, documentData);
};

/**
 * Send a milestone completed email
 * @param {string} email - Recipient email address
 * @param {Object} milestoneData - Milestone data
 * @returns {Promise<Object>} - Result of the operation
 */
export const sendMilestoneEmail = async (email, milestoneData) => {
  return sendCustomEmail(email, EMAIL_TYPES.MILESTONE_COMPLETED, milestoneData);
};

/**
 * Send a lead notification email
 * @param {string} email - Recipient email address
 * @param {Object} leadData - Lead data
 * @returns {Promise<Object>} - Result of the operation
 */
export const sendLeadNotificationEmail = async (email, leadData) => {
  return sendCustomEmail(email, EMAIL_TYPES.LEAD_NOTIFICATION, leadData);
};

/**
 * Send a referral notification email
 * @param {string} email - Recipient email address
 * @param {Object} referralData - Referral data
 * @returns {Promise<Object>} - Result of the operation
 */
export const sendReferralEmail = async (email, referralData) => {
  return sendCustomEmail(email, EMAIL_TYPES.REFERRAL_RECEIVED, referralData);
};
