import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './GoogleIntegrations.module.css';

/**
 * Google OAuth Callback Component
 *
 * This component handles the OAuth callback from Google.
 * It extracts the authorization code from the URL,
 * and redirects the user back to the appropriate page.
 * 
 * Note: The actual token exchange is handled by Firebase Auth.
 */
const GoogleOAuthCallbackSecure = ({ redirectPath = '/dashboard' }) => {
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
        const error = urlParams.get('error');

        if (error) {
          throw new Error(`Authentication error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code found');
        }

        // Verify state parameter to prevent CSRF attacks
        const storedState = localStorage.getItem('googleAuthState');
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

        // Firebase Auth will handle the token exchange automatically
        // We just need to redirect the user back to the appropriate page

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
        } else if (driveRequested) {
          returnPath = '/dashboard/profile';
          console.log('GoogleOAuthCallback: Drive was requested, redirecting to profile page');
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
          localStorage.removeItem('googleAuthState');
          localStorage.removeItem('googleAuthTimestamp');
          localStorage.removeItem('googleAuthCalendarRequested');
          localStorage.removeItem('googleAuthDriveRequested');
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
        </div>
      )}

      {status === 'error' && (
        <div className={styles.error}>
          <div className={styles['error-icon']}>✗</div>
          <p>Error connecting to Google Services</p>
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

export default GoogleOAuthCallbackSecure;
