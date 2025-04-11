/**
 * Service Account Configuration
 * 
 * This module provides the service account configuration for Google APIs.
 * It loads credentials from environment variables for security.
 */

// Load environment variables
require('dotenv').config();

/**
 * Get the service account configuration
 * @returns {Object} Service account configuration object
 */
const getServiceAccountConfig = () => {
  return {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID || 'ftfc-451421',
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY ? 
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
    client_email: process.env.GOOGLE_CLIENT_EMAIL || 'ftfc-website-service@ftfc-451421.iam.gserviceaccount.com',
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.GOOGLE_CLIENT_EMAIL ? 
      `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.GOOGLE_CLIENT_EMAIL)}` : 
      'https://www.googleapis.com/robot/v1/metadata/x509/ftfc-website-service%40ftfc-451421.iam.gserviceaccount.com',
    universe_domain: 'googleapis.com'
  };
};

module.exports = getServiceAccountConfig;
