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
        localStorage.setItem('googleTokens', JSON.stringify(tokens));

        // Store a flag to indicate successful connection
        localStorage.setItem('googleCalendarConnected', 'true');
        localStorage.setItem('googleDriveConnected', 'true');

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
