import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { disconnectGoogleDrive, getGoogleAuthUrl, getGoogleDriveStatus } from '../../services/googleDriveService.simple';
import styles from './GoogleConnect.module.css';

/**
 * Google Drive Connect Component
 *
 * This component provides a button to connect to Google Drive
 * and displays the connection status.
 */
const GoogleDriveConnect = ({ onConnect, onDisconnect }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Check if user is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const status = await getGoogleDriveStatus();
        const driveConnected = localStorage.getItem('googleDriveConnected');
        const sessionDriveConnected = sessionStorage.getItem('googleDriveConnected');
        console.log('GoogleDriveConnect: Drive connected flag (localStorage):', driveConnected);
        console.log('GoogleDriveConnect: Drive connected flag (sessionStorage):', sessionDriveConnected);

        // Check if we have a connected status and either localStorage or sessionStorage flag is true
        if (status.connected && (driveConnected === 'true' || sessionDriveConnected === 'true')) {
          setIsConnected(true);
          if (status.email) {
            setUserEmail(status.email);

            // Ensure both storage locations have the flag set
            localStorage.setItem('googleDriveConnected', 'true');
            sessionStorage.setItem('googleDriveConnected', 'true');

            // Call onConnect callback if provided
            if (onConnect) {
              onConnect();
            }
          }
        } else {
          // If we have a connected status but no flag, try to set the flag
          if (status.connected && !driveConnected && !sessionDriveConnected) {
            console.log('GoogleDriveConnect: Found connected status but no connection flag, setting flags');
            localStorage.setItem('googleDriveConnected', 'true');
            sessionStorage.setItem('googleDriveConnected', 'true');
            setIsConnected(true);
            if (status.email) {
              setUserEmail(status.email);

              // Call onConnect callback if provided
              if (onConnect) {
                onConnect();
              }
            }
          } else {
            setIsConnected(false);
            console.log('GoogleDriveConnect: Not connected or missing connection flag');
          }
        }
      } catch (error) {
        console.error('Error checking Google Drive connection:', error);
        setIsConnected(false);
        localStorage.removeItem('googleDriveConnected');
        sessionStorage.removeItem('googleDriveConnected');
      } finally {
        setIsLoading(false);
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
    }

    // Store the current path to return to after authentication
    const currentPath = window.location.pathname;
    localStorage.setItem('googleAuthReturnPath', currentPath);
    console.log('GoogleDriveConnect: Stored return path:', currentPath);

    // Get auth URL with drive-specific scopes
    const authUrl = getGoogleAuthUrl();
    console.log('Redirecting to Google Drive OAuth URL:', authUrl);

    // Redirect directly to the auth URL
    window.location.href = authUrl;
  };

  // Handle disconnect button click
  const handleDisconnect = async () => {
    try {
      await disconnectGoogleDrive();
      setIsConnected(false);
      setUserEmail('');

      // Clear connection flags from both localStorage and sessionStorage
      localStorage.removeItem('googleDriveConnected');
      localStorage.removeItem('googleCalendarConnected');
      sessionStorage.removeItem('googleDriveConnected');
      sessionStorage.removeItem('googleCalendarConnected');

      // Clear tokens
      localStorage.removeItem('googleTokens');
      localStorage.removeItem('googleDriveTokens');

      // Call onDisconnect callback if provided
      if (onDisconnect) {
        onDisconnect();
      }
    } catch (error) {
      console.error('Error disconnecting Google Drive:', error);
    }
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
            <div className={styles['user-info']}>
              <div className={styles['user-email']}>{userEmail}</div>
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
