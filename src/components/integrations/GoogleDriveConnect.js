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

        setIsConnected(status.connected);
        if (status.connected && status.email) {
          setUserEmail(status.email);

          // Call onConnect callback if provided
          if (onConnect) {
            onConnect();
          }
        }
      } catch (error) {
        console.error('Error checking Google Drive connection:', error);
        setIsConnected(false);
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
    // Get auth URL and redirect
    const authUrl = getGoogleAuthUrl();
    window.location.href = authUrl;
  };

  // Handle disconnect button click
  const handleDisconnect = async () => {
    try {
      await disconnectGoogleDrive();
      setIsConnected(false);
      setUserEmail('');

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
