import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { clearTokens, getAuthUrl, getStoredTokens, getUserProfile } from '../../services/googleIntegration';
import styles from './GoogleIntegrations.module.css';

/**
 * Google Calendar Connect Component
 *
 * This component provides a button to connect to Google Calendar
 * and displays the connection status.
 */
const GoogleCalendarConnect = ({ onConnect, onDisconnect }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log('GoogleCalendarConnect: Checking connection status');
        const tokens = getStoredTokens();
        console.log('GoogleCalendarConnect: Tokens from storage:', tokens ? 'Found' : 'Not found');

        if (tokens) {
          // Get user profile to verify connection
          console.log('GoogleCalendarConnect: Getting user profile with tokens');
          const profile = await getUserProfile(tokens);
          console.log('GoogleCalendarConnect: Got profile:', profile);
          setUserProfile(profile);
          setIsConnected(true);
          console.log('GoogleCalendarConnect: Set isConnected to TRUE');

          // Call onConnect callback if provided
          if (onConnect) {
            console.log('GoogleCalendarConnect: Calling onConnect callback');
            onConnect(tokens, profile);
          }
        } else {
          console.log('GoogleCalendarConnect: No tokens found, not connected');
        }
      } catch (error) {
        console.error('Error checking Google connection:', error);
        // Clear invalid tokens
        console.log('GoogleCalendarConnect: Clearing invalid tokens');
        clearTokens();
        setIsConnected(false);
      } finally {
        setIsLoading(false);
        console.log('GoogleCalendarConnect: Set isLoading to FALSE');
      }
    };

    checkConnection();
  }, [onConnect]);

  // Handle connect button click
  const handleConnect = () => {
    // Get auth URL with calendar-specific scopes
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    // Store the current user's email in localStorage to help with the OAuth flow
    const { user } = useAuth();
    if (user && user.email) {
      localStorage.setItem('userEmail', user.email);
      console.log('GoogleCalendarConnect: Stored user email in localStorage:', user.email);
    }

    // Store the current path to return to after authentication
    const currentPath = window.location.pathname;
    localStorage.setItem('googleAuthReturnPath', currentPath);
    console.log('GoogleCalendarConnect: Stored return path:', currentPath);

    // Generate the auth URL and redirect
    const authUrl = getAuthUrl(scopes);
    console.log('GoogleCalendarConnect: Redirecting to Google OAuth URL:', authUrl);

    // Redirect directly to the auth URL
    window.location.href = authUrl;
  };

  // Handle disconnect button click
  const handleDisconnect = () => {
    // Clear tokens
    clearTokens();
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
    <div className={styles['google-calendar-connect']}>
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
            Connected to Google Calendar
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
            Not connected to Google Calendar
          </div>
          <p className={styles['connect-description']}>
            Connect your Google Calendar to schedule meetings and access recordings.
          </p>
          <button
            className={styles['connect-button']}
            onClick={handleConnect}
          >
            Connect Google Calendar
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleCalendarConnect;
