/**
 * Mock implementation of googleapis for browser environments
 *
 * This provides a minimal implementation of the googleapis module
 * that can be used in the browser without requiring the full module.
 */

// Create a minimal google object with just what we need
const google = {
  auth: {
    OAuth2: function(clientId, clientSecret, redirectUri) {
      this.clientId = clientId;
      this.clientSecret = clientSecret;
      this.redirectUri = redirectUri;

      this.setCredentials = function(credentials) {
        this.credentials = credentials;
      };

      this.generateAuthUrl = function(options) {
        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        authUrl.searchParams.append('client_id', this.clientId);
        authUrl.searchParams.append('redirect_uri', this.redirectUri);
        authUrl.searchParams.append('response_type', 'code');

        if (options && options.scope) {
          authUrl.searchParams.append('scope', Array.isArray(options.scope) ? options.scope.join(' ') : options.scope);
        }

        if (options && options.access_type) {
          authUrl.searchParams.append('access_type', options.access_type);
        }

        if (options && options.prompt) {
          authUrl.searchParams.append('prompt', options.prompt);
        }

        return authUrl.toString();
      };

      this.getToken = async function(code) {
        // In a real implementation, this would make an API call
        // For the mock, we'll just return a dummy token
        console.warn('Mock OAuth2.getToken called - this would normally make an API call');
        return { tokens: { access_token: 'mock-token', refresh_token: 'mock-refresh-token' } };
      };
    }
  },

  // Mock implementations of Google APIs
  calendar: function(options) {
    return {
      events: {
        list: async function(params) {
          console.warn('Mock calendar.events.list called - this would normally make an API call');
          return { data: { items: [] } };
        },
        insert: async function(params) {
          console.warn('Mock calendar.events.insert called - this would normally make an API call');
          return { data: { id: 'mock-event-id', htmlLink: 'https://calendar.google.com/mock-event' } };
        }
      }
    };
  },

  drive: function(options) {
    return {
      files: {
        list: async function(params) {
          console.warn('Mock drive.files.list called - this would normally make an API call');
          return { data: { files: [] } };
        },
        get: async function(params) {
          console.warn('Mock drive.files.get called - this would normally make an API call');
          return { data: { id: params.fileId, name: 'Mock File' } };
        }
      }
    };
  },

  docs: function(options) {
    return {
      documents: {
        get: async function(params) {
          console.warn('Mock docs.documents.get called - this would normally make an API call');
          return { data: { documentId: params.documentId, title: 'Mock Document', body: { content: [] } } };
        }
      }
    };
  },

  people: function(options) {
    return {
      people: {
        get: async function(params) {
          console.warn('Mock people.people.get called - this would normally make an API call');
          return {
            data: {
              names: [{ displayName: 'Mock User' }],
              emailAddresses: [{ value: 'mock@example.com' }],
              photos: [{ url: 'https://example.com/mock-photo.jpg' }]
            }
          };
        }
      }
    };
  }
};

// Export the google object as the default export
const googleapis = { google };

export default googleapis;

// Named exports for direct imports
export { google };
