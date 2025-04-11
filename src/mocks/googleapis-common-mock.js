/**
 * Mock implementation of googleapis-common for browser environments
 *
 * This provides a minimal implementation of the googleapis-common module
 * that can be used in the browser without requiring the full module.
 */

// Mock OAuth2Client class
export class OAuth2Client {
  constructor(clientId, clientSecret, redirectUri) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.credentials = null;
  }

  setCredentials(credentials) {
    this.credentials = credentials;
  }

  getAccessToken() {
    if (!this.credentials || !this.credentials.access_token) {
      throw new Error('No access token available');
    }
    return { token: this.credentials.access_token };
  }

  getRequestHeaders() {
    if (!this.credentials || !this.credentials.access_token) {
      throw new Error('No access token available');
    }
    return {
      Authorization: `Bearer ${this.credentials.access_token}`
    };
  }

  request() {
    console.warn('Mock OAuth2Client.request called - this would normally make an API call');
    return Promise.resolve({ data: {} });
  }
}

// Create a more comprehensive mock
const googleapisCommon = {
  OAuth2Client,
  // Add other required exports
  GoogleAuth: OAuth2Client, // Simple alias for compatibility
  Compute: class {}, // Empty implementation
  JWT: class {}, // Empty implementation
  UserRefreshClient: class {}, // Empty implementation
  // Add any other classes or functions needed
};

// Export as default
export default googleapisCommon;

// Named exports for direct imports
export {
    OAuth2Client,
    // Re-export other classes
    OAuth2Client as GoogleAuth,
};

