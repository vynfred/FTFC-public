import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { clearTokens, getAuthUrl, getStoredTokens, getUserProfile } from '../../services/googleIntegration';
import styles from './GoogleConnect.module.css';

/**
 * Google Drive Connect Component
 *
 * This component provides a button to connect to Google Drive
 * and displays the connection status.
 */
const GoogleDriveConnect = ({ onConnect, onDisconnect }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Check if user is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log('GoogleDriveConnect: Checking connection status');
        const tokens = getStoredTokens();
        const driveConnected = localStorage.getItem('googleDriveConnected');
        const sessionDriveConnected = sessionStorage.getItem('googleDriveConnected');
        console.log('GoogleDriveConnect: Tokens from storage:', tokens ? 'Found' : 'Not found');
        console.log('GoogleDriveConnect: Drive connected flag (localStorage):', driveConnected);
        console.log('GoogleDriveConnect: Drive connected flag (sessionStorage):', sessionDriveConnected);

        // Check if we have tokens and either localStorage or sessionStorage flag is true
        if (tokens && (driveConnected === 'true' || sessionDriveConnected === 'true')) {
          // Get user profile to verify connection
          console.log('GoogleDriveConnect: Getting user profile with tokens');
          const profile = await getUserProfile(tokens);
          console.log('GoogleDriveConnect: Got profile:', profile);
          setUserProfile(profile);
          setIsConnected(true);
          console.log('GoogleDriveConnect: Set isConnected to TRUE');

          // Ensure both storage locations have the flag set
          localStorage.setItem('googleDriveConnected', 'true');
          sessionStorage.setItem('googleDriveConnected', 'true');

          // Call onConnect callback if provided
          if (onConnect) {
            console.log('GoogleDriveConnect: Calling onConnect callback');
            onConnect(tokens, profile);
          }
        } else {
          console.log('GoogleDriveConnect: No tokens or connection flag found, not connected');
          // If we have tokens but no flag, try to set the flag
          if (tokens && !driveConnected && !sessionDriveConnected) {
            try {
              // Verify tokens are valid by getting user profile
              console.log('GoogleDriveConnect: Found tokens but no connection flag, verifying tokens');
              const profile = await getUserProfile(tokens);
              if (profile) {
                console.log('GoogleDriveConnect: Tokens are valid, setting connection flag');
                localStorage.setItem('googleDriveConnected', 'true');
                sessionStorage.setItem('googleDriveConnected', 'true');
                setUserProfile(profile);
                setIsConnected(true);

                // Call onConnect callback if provided
                if (onConnect) {
                  console.log('GoogleDriveConnect: Calling onConnect callback');
                  onConnect(tokens, profile);
                }
                return;
              }
            } catch (verifyError) {
              console.error('GoogleDriveConnect: Error verifying tokens:', verifyError);
              clearTokens();
            }
          }
        }
      } catch (error) {
        console.error('Error checking Google Drive connection:', error);
        // Clear invalid tokens and connection flags
        console.log('GoogleDriveConnect: Clearing invalid tokens and connection flags');
        clearTokens();
        setIsConnected(false);
      } finally {
        setIsLoading(false);
        console.log('GoogleDriveConnect: Set isLoading to FALSE');
      }
    };

    if (user) {
      checkConnection();
    } else {
      setIsLoading(false);
    }
  }, [onConnect, user]);

  // Handle connect button click
  const handleConnect = () => {
    // Store the current user's email in localStorage to help with the OAuth flow
    if (user && user.email) {
      localStorage.setItem('userEmail', user.email);
      console.log('GoogleDriveConnect: Stored user email in localStorage:', user.email);
    }

    // Generate the auth URL with drive-specific options
    const authUrl = getAuthUrl([], { drive: true });
    console.log('GoogleDriveConnect: Redirecting to Google OAuth URL');

    // Redirect directly to the auth URL
    window.location.href = authUrl;
  };

  // Handle disconnect button click
  const handleDisconnect = () => {
    // Clear all tokens and connection flags
    clearTokens();

    // Update component state
    setIsConnected(false);
    setUserProfile(null);

    // Call onDisconnect callback if provided
    if (onDisconnect) {
      onDisconnect();
    }
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!userProfile) return '';

    const names = userProfile.names || [];
    return names.length > 0 ? names[0].displayName : '';
  };

  // Get user email
  const getUserEmail = () => {
    if (!userProfile) return '';

    const emails = userProfile.emailAddresses || [];
    return emails.length > 0 ? emails[0].value : '';
  };

  // Get user photo URL
  const getUserPhotoUrl = () => {
    if (!userProfile) return '';

    const photos = userProfile.photos || [];
    return photos.length > 0 ? photos[0].url : '';
  };

  if (isLoading) {
    return <div className={styles.loading}>Checking connection status...</div>;
  }

  return (
    <div className={styles['google-connect']}>
      <h3>Google Drive Integration</h3>
      <p className={styles['connect-description']}>
        Connect your Google Drive to enable automatic processing of Gemini meeting notes.
      </p>

      {isConnected ? (
        <div className={styles['connected-status']}>
          <div className={styles['user-profile']}>
            {getUserPhotoUrl() && (
              <img
                src={getUserPhotoUrl()}
                alt={getUserDisplayName()}
                className={styles['user-photo']}
              />
            )}
            <div className={styles['user-info']}>
              <div className={styles['user-name']}>{getUserDisplayName()}</div>
              <div className={styles['user-email']}>{getUserEmail()}</div>
            </div>
          </div>
          <div className={styles['connection-message']}>
            <span className={`${styles['status-indicator']} ${styles.connected}`}></span>
            Connected to Google Drive
          </div>
          <button
            className={styles['disconnect-button']}
            onClick={handleDisconnect}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className={styles['connect-prompt']}>
          <div className={styles['connection-message']}>
            <span className={`${styles['status-indicator']} ${styles.disconnected}`}></span>
            Not connected to Google Drive
          </div>
          <button
            className={styles['connect-button']}
            onClick={handleConnect}
          >
            Connect Google Drive
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleDriveConnect;
