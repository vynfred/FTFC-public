import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { exchangeCodeForTokens as getTokensFromCode } from '../../services/googleIntegration';
import styles from './GoogleIntegrations.module.css';

/**
 * Google OAuth Callback Component
 *
 * This component handles the OAuth callback from Google.
 * It extracts the authorization code from the URL,
 * exchanges it for tokens, and stores them.
 */
const GoogleOAuthCallback = ({ redirectPath = '/dashboard' }) => {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        console.log('GoogleOAuthCallback: Processing OAuth callback');
        // Get code and state from URL
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (!code) {
          const error = urlParams.get('error');
          throw new Error(error || 'No authorization code found');
        }

        // Verify state parameter to prevent CSRF attacks
        const storedState = localStorage.getItem('googleApiAuthState');
        console.log('GoogleOAuthCallback: Verifying state parameter');
        console.log('GoogleOAuthCallback: Received state:', state);
        console.log('GoogleOAuthCallback: Stored state:', storedState);

        if (state && storedState) {
          if (state !== storedState) {
            console.error('GoogleOAuthCallback: State mismatch, possible CSRF attack');
            throw new Error('Invalid state parameter. Please try again.');
          } else {
            console.log('GoogleOAuthCallback: State verification successful');
          }
        } else if (!state) {
          console.warn('GoogleOAuthCallback: No state parameter received from Google');
          // Continue but log a warning
        } else if (!storedState) {
          console.warn('GoogleOAuthCallback: No stored state found');
          // Continue but log a warning
        }

        console.log('GoogleOAuthCallback: Got code, exchanging for tokens');
        // Exchange code for tokens - this function now handles token storage
        const tokens = await getTokensFromCode(code);
        console.log('GoogleOAuthCallback: Received tokens:', tokens ? 'Success' : 'Failed');

        // The exchangeCodeForTokens function now handles all token storage and flag setting
        // We just need to verify everything was set correctly
        try {
          // Verify the flags were set
          const calendarFlag = localStorage.getItem('googleCalendarConnected');
          const driveFlag = localStorage.getItem('googleDriveConnected');
          const sessionCalendarFlag = sessionStorage.getItem('googleCalendarConnected');
          const sessionDriveFlag = sessionStorage.getItem('googleDriveConnected');

          console.log('GoogleOAuthCallback: Verification - Calendar flag (localStorage):', calendarFlag);
          console.log('GoogleOAuthCallback: Verification - Drive flag (localStorage):', driveFlag);
          console.log('GoogleOAuthCallback: Verification - Calendar flag (sessionStorage):', sessionCalendarFlag);
          console.log('GoogleOAuthCallback: Verification - Drive flag (sessionStorage):', sessionDriveFlag);

          // If any flags are missing, set them again
          if (!calendarFlag) localStorage.setItem('googleCalendarConnected', 'true');
          if (!driveFlag) localStorage.setItem('googleDriveConnected', 'true');
          if (!sessionCalendarFlag) sessionStorage.setItem('googleCalendarConnected', 'true');
          if (!sessionDriveFlag) sessionStorage.setItem('googleDriveConnected', 'true');
        } catch (verifyError) {
          console.error('GoogleOAuthCallback: Error verifying flags:', verifyError);
          // Continue anyway, as the tokens should still be valid
        }

        // Get the return path from localStorage or use default
        let returnPath = localStorage.getItem('googleAuthReturnPath') || redirectPath;
        console.log('GoogleOAuthCallback: Return path from localStorage:', returnPath);

        // Check if we're connecting to Calendar or Drive specifically
        const calendarRequested = localStorage.getItem('googleAuthCalendarRequested') === 'true';
        const driveRequested = localStorage.getItem('googleAuthDriveRequested') === 'true';

        // Override return path based on what was requested
        if (calendarRequested) {
          returnPath = '/dashboard/calendar';
          console.log('GoogleOAuthCallback: Calendar was requested, redirecting to calendar page');

          // Ensure the calendar connection flag is set
          localStorage.setItem('googleCalendarConnected', 'true');
          sessionStorage.setItem('googleCalendarConnected', 'true');
        } else if (driveRequested) {
          returnPath = '/dashboard/profile';
          console.log('GoogleOAuthCallback: Drive was requested, redirecting to profile page');

          // Ensure the drive connection flag is set
          localStorage.setItem('googleDriveConnected', 'true');
          sessionStorage.setItem('googleDriveConnected', 'true');
        }

        // Add state parameter to the return path to force component remounting
        if (returnPath.includes('?')) {
          returnPath += '&auth=' + Date.now();
        } else {
          returnPath += '?auth=' + Date.now();
        }

        console.log('GoogleOAuthCallback: Final return path with state:', returnPath);

        // Update status
        setStatus('success');
        console.log('GoogleOAuthCallback: Set status to success');

        // Redirect after a short delay
        setTimeout(() => {
          console.log('GoogleOAuthCallback: Redirecting to', returnPath);
          navigate(returnPath);
          // Clear the return path
          localStorage.removeItem('googleAuthReturnPath');
        }, 2000);
      } catch (error) {
        console.error('Error processing OAuth callback:', error);
        setStatus('error');
        setError(error.message);
      }
    };

    processOAuthCallback();
  }, [location, navigate, redirectPath]);

  // Get all localStorage items for debugging
  const getLocalStorageItems = () => {
    const items = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
          const value = localStorage.getItem(key);
          items[key] = value;
        } catch (e) {
          items[key] = "Error reading value";
        }
      }
    } catch (e) {
      return { error: e.message };
    }
    return items;
  };

  const localStorageItems = getLocalStorageItems();

  // Function to manually set connection flags
  const setConnectionFlags = () => {
    try {
      // Check which type of connection was requested
      const calendarRequested = localStorage.getItem('googleAuthCalendarRequested') === 'true';
      const driveRequested = localStorage.getItem('googleAuthDriveRequested') === 'true';

      // Set the appropriate flags
      if (calendarRequested) {
        localStorage.setItem('googleCalendarConnected', 'true');
        sessionStorage.setItem('googleCalendarConnected', 'true');
        console.log('GoogleOAuthCallback: Manually set Calendar connection flags');
      }

      if (driveRequested) {
        localStorage.setItem('googleDriveConnected', 'true');
        sessionStorage.setItem('googleDriveConnected', 'true');
        console.log('GoogleOAuthCallback: Manually set Drive connection flags');
      }

      // If neither was specifically requested, set both as a fallback
      if (!calendarRequested && !driveRequested) {
        localStorage.setItem('googleCalendarConnected', 'true');
        localStorage.setItem('googleDriveConnected', 'true');
        sessionStorage.setItem('googleCalendarConnected', 'true');
        sessionStorage.setItem('googleDriveConnected', 'true');
        console.log('GoogleOAuthCallback: Manually set both connection flags as fallback');
      }

      alert('Connection flags set successfully!');
    } catch (e) {
      console.error('GoogleOAuthCallback: Error setting flags:', e);
      alert('Error setting flags: ' + e.message);
    }
  };

  return (
    <div className={styles['oauth-callback']}>
      <h2>Google {localStorage.getItem('googleAuthCalendarRequested') === 'true' ? 'Calendar' : localStorage.getItem('googleAuthDriveRequested') === 'true' ? 'Drive' : 'Services'} Integration</h2>

      {status === 'processing' && (
        <div className={styles.processing}>
          <div className={styles.spinner}></div>
          <p>Processing your Google {localStorage.getItem('googleAuthCalendarRequested') === 'true' ? 'Calendar' : localStorage.getItem('googleAuthDriveRequested') === 'true' ? 'Drive' : 'Services'} connection...</p>
        </div>
      )}

      {status === 'success' && (
        <div className={styles.success}>
          <div className={styles['success-icon']}>✓</div>
          <p>Successfully connected to Google {localStorage.getItem('googleAuthCalendarRequested') === 'true' ? 'Calendar' : localStorage.getItem('googleAuthDriveRequested') === 'true' ? 'Drive' : 'Services'}!</p>
          <p className={styles['redirect-message']}>Redirecting you back to the {localStorage.getItem('googleAuthCalendarRequested') === 'true' ? 'calendar page' : localStorage.getItem('googleAuthDriveRequested') === 'true' ? 'profile page' : 'dashboard'}...</p>

          {/* Debug section */}
          <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
            <h3>Debug Information</h3>
            <p>If you're having issues with the connection persisting, click the button below:</p>
            <button
              onClick={setConnectionFlags}
              style={{ padding: '8px 16px', backgroundColor: '#4285f4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Force Set Connection Flags
            </button>

            <div style={{ marginTop: '10px' }}>
              <h4>Current localStorage Items:</h4>
              <pre style={{ maxHeight: '200px', overflow: 'auto', padding: '10px', backgroundColor: '#eee', fontSize: '12px' }}>
                {JSON.stringify(localStorageItems, null, 2)}
              </pre>
            </div>

            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => navigate('/dashboard/calendar')}
                style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#34a853', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Go to Calendar
              </button>
              <button
                onClick={() => navigate('/dashboard/profile')}
                style={{ padding: '8px 16px', backgroundColor: '#34a853', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Go to Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className={styles.error}>
          <div className={styles['error-icon']}>✗</div>
          <p>Error connecting to Google Calendar</p>
          <p className={styles['error-message']}>{error}</p>
          <button
            className={styles['retry-button']}
            onClick={() => navigate('/dashboard')}
          >
            Return to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleOAuthCallback;
