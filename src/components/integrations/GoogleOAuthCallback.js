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
        // Get code from URL
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');

        if (!code) {
          const error = urlParams.get('error');
          throw new Error(error || 'No authorization code found');
        }

        console.log('GoogleOAuthCallback: Got code, exchanging for tokens');
        // Exchange code for tokens
        const tokens = await getTokensFromCode(code);
        console.log('GoogleOAuthCallback: Received tokens:', tokens ? 'Success' : 'Failed');

        // Store tokens in localStorage
        console.log('GoogleOAuthCallback: Storing tokens in localStorage');
        try {
          localStorage.setItem('googleTokens', JSON.stringify(tokens));
          console.log('GoogleOAuthCallback: Successfully stored tokens in localStorage');

          // Store flags to indicate successful connection
          localStorage.setItem('googleCalendarConnected', 'true');
          console.log('GoogleOAuthCallback: Set googleCalendarConnected flag to true');

          localStorage.setItem('googleDriveConnected', 'true');
          console.log('GoogleOAuthCallback: Set googleDriveConnected flag to true');

          // Verify the flags were set
          const calendarFlag = localStorage.getItem('googleCalendarConnected');
          const driveFlag = localStorage.getItem('googleDriveConnected');
          console.log('GoogleOAuthCallback: Verification - Calendar flag:', calendarFlag);
          console.log('GoogleOAuthCallback: Verification - Drive flag:', driveFlag);
        } catch (storageError) {
          console.error('GoogleOAuthCallback: Error storing in localStorage:', storageError);
          setError('Failed to store connection data. Please check your browser settings.');
        }

        // Get the return path from localStorage or use default
        const returnPath = localStorage.getItem('googleAuthReturnPath') || redirectPath;
        console.log('GoogleOAuthCallback: Return path:', returnPath);

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
      localStorage.setItem('googleCalendarConnected', 'true');
      localStorage.setItem('googleDriveConnected', 'true');
      alert('Connection flags set successfully!');
    } catch (e) {
      alert('Error setting flags: ' + e.message);
    }
  };

  return (
    <div className={styles['oauth-callback']}>
      <h2>Google Calendar Integration</h2>

      {status === 'processing' && (
        <div className={styles.processing}>
          <div className={styles.spinner}></div>
          <p>Processing your Google Calendar connection...</p>
        </div>
      )}

      {status === 'success' && (
        <div className={styles.success}>
          <div className={styles['success-icon']}>✓</div>
          <p>Successfully connected to Google Calendar!</p>
          <p className={styles['redirect-message']}>Redirecting you back to the dashboard...</p>

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
