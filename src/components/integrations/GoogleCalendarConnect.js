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
  const auth = useAuth(); // Correct placement of useAuth
  const [isConnected, setIsConnected] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log('GoogleCalendarConnect: Checking connection status');
        const tokens = getStoredTokens();
        const calendarConnected = localStorage.getItem('googleCalendarConnected');
        const sessionCalendarConnected = sessionStorage.getItem('googleCalendarConnected');
        console.log('GoogleCalendarConnect: Tokens from storage:', tokens ? 'Found' : 'Not found');
        console.log('GoogleCalendarConnect: Calendar connected flag (localStorage):', calendarConnected);
        console.log('GoogleCalendarConnect: Calendar connected flag (sessionStorage):', sessionCalendarConnected);

        // Check if we have tokens and either localStorage or sessionStorage flag is true
        if (tokens && (calendarConnected === 'true' || sessionCalendarConnected === 'true')) {
          // Get user profile to verify connection
          console.log('GoogleCalendarConnect: Getting user profile with tokens');
          try {
            const profile = await getUserProfile(tokens);
            console.log('GoogleCalendarConnect: Got profile:', profile);

            // Check if we got a valid profile
            if (profile && (profile.names || profile.emailAddresses)) {
              setUserProfile(profile);
              setIsConnected(true);
              console.log('GoogleCalendarConnect: Set isConnected to TRUE');

              // Ensure both storage locations have the flag set
              localStorage.setItem('googleCalendarConnected', 'true');
              sessionStorage.setItem('googleCalendarConnected', 'true');

              // Call onConnect callback if provided
              if (onConnect) {
                console.log('GoogleCalendarConnect: Calling onConnect callback');
                onConnect(tokens, profile);
              }
            } else {
              console.log('GoogleCalendarConnect: Invalid profile received, clearing tokens');
              clearTokens();
              setIsConnected(false);
            }
          } catch (profileError) {
            console.error('GoogleCalendarConnect: Error getting user profile:', profileError);
            // If we can't get the profile, the tokens might be invalid
            clearTokens();
            setIsConnected(false);
          }
        } else {
          console.log('GoogleCalendarConnect: No tokens or connection flag found, not connected');
          // If we have tokens but no flag, try to set the flag
          if (tokens && !calendarConnected && !sessionCalendarConnected) {
            try {
              // Verify tokens are valid by getting user profile
              console.log('GoogleCalendarConnect: Found tokens but no connection flag, verifying tokens');
              const profile = await getUserProfile(tokens);
              if (profile && (profile.names || profile.emailAddresses)) {
                console.log('GoogleCalendarConnect: Tokens are valid, setting connection flag');
                localStorage.setItem('googleCalendarConnected', 'true');
                sessionStorage.setItem('googleCalendarConnected', 'true');
                setUserProfile(profile);
                setIsConnected(true);

                // Call onConnect callback if provided
                if (onConnect) {
                  console.log('GoogleCalendarConnect: Calling onConnect callback');
                  onConnect(tokens, profile);
                }
                return;
              } else {
                console.log('GoogleCalendarConnect: Invalid profile received, clearing tokens');
                clearTokens();
              }
            } catch (verifyError) {
              console.error('GoogleCalendarConnect: Error verifying tokens:', verifyError);
              clearTokens();
            }
          }
        }
      } catch (error) {
        console.error('Error checking Google connection:', error);
        // Clear invalid tokens and connection flags
        console.log('GoogleCalendarConnect: Clearing invalid tokens and connection flags');
        clearTokens();
        localStorage.removeItem('googleCalendarConnected');
        localStorage.removeItem('googleDriveConnected');
        sessionStorage.removeItem('googleCalendarConnected');
        sessionStorage.removeItem('googleDriveConnected');
        setIsConnected(false);
      } finally {
        setIsLoading(false);
        console.log('GoogleCalendarConnect: Set isLoading to FALSE');
      }
    };

    checkConnection();

    // Set up an interval to periodically check connection status
    const intervalId = setInterval(() => {
      const calendarConnected = localStorage.getItem('googleCalendarConnected') === 'true';
      if (calendarConnected !== isConnected) {
        console.log('GoogleCalendarConnect: Interval check - Connection status changed to:', calendarConnected);
        if (calendarConnected) {
          checkConnection();
        } else {
          setIsConnected(false);
          setUserProfile(null);
        }
      }
    }, 2000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [onConnect, isConnected]);

  // Handle connect button click
  const handleConnect = () => {
    const { user } = auth;
    if (user && user.email) {
      localStorage.setItem('userEmail', user.email);
      console.log('GoogleCalendarConnect: Stored user email in localStorage:', user.email);
    }

    // Clear any existing connection flags to ensure a fresh start
    localStorage.removeItem('googleCalendarConnected');
    localStorage.removeItem('googleDriveConnected');
    sessionStorage.removeItem('googleCalendarConnected');
    sessionStorage.removeItem('googleDriveConnected');

    // Set a flag to indicate we're specifically requesting calendar access
    localStorage.setItem('googleAuthCalendarRequested', 'true');
    localStorage.setItem('googleAuthReturnPath', '/dashboard/calendar');
    console.log('GoogleCalendarConnect: Set calendar request flag and return path');

    // Generate the auth URL with calendar-specific options
    const authUrl = getAuthUrl([], { calendar: true });
    console.log('GoogleCalendarConnect: Redirecting to Google OAuth URL:', authUrl);

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
