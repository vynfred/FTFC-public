import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { connectGoogleDrive, getTokensFromCode } from '../../services/googleDriveService.simple';
import styles from './GoogleConnect.module.css';

/**
 * Google Drive OAuth Callback Component
 *
 * This component handles the OAuth callback from Google.
 * It extracts the authorization code from the URL,
 * exchanges it for tokens, and connects Google Drive.
 */
const GoogleDriveCallback = ({ redirectPath = '/profile' }) => {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Get code from URL
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');

        if (!code) {
          const error = urlParams.get('error');
          throw new Error(error || 'No authorization code found');
        }

        console.log('GoogleDriveCallback: Got code from URL, exchanging for tokens');
        // Exchange code for tokens
        const tokens = await getTokensFromCode(code);
        console.log('GoogleDriveCallback: Got tokens, connecting Google Drive');

        // Connect Google Drive
        await connectGoogleDrive(tokens);
        console.log('GoogleDriveCallback: Successfully connected Google Drive');

        // Update status
        setStatus('success');

        // Store tokens in localStorage with a different key to avoid conflicts
        localStorage.setItem('googleDriveTokens', JSON.stringify(tokens));
        console.log('GoogleDriveCallback: Stored tokens in localStorage');

        // Redirect after a short delay
        setTimeout(() => {
          console.log('GoogleDriveCallback: Redirecting to', redirectPath);
          navigate(redirectPath);
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
      <h2>Google Drive Integration</h2>

      {status === 'processing' && (
        <div className={styles.processing}>
          <div className={styles.spinner}></div>
          <p>Processing your Google Drive connection...</p>
        </div>
      )}

      {status === 'success' && (
        <div className={styles.success}>
          <div className={styles['success-icon']}>✓</div>
          <p>Successfully connected to Google Drive!</p>
          <p className={styles['redirect-message']}>Redirecting you back to your profile...</p>
        </div>
      )}

      {status === 'error' && (
        <div className={styles.error}>
          <div className={styles['error-icon']}>✗</div>
          <p>Error connecting to Google Drive</p>
          <p className={styles['error-message']}>{error}</p>
          <button
            className={styles['retry-button']}
            onClick={() => navigate('/profile')}
          >
            Return to Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleDriveCallback;
