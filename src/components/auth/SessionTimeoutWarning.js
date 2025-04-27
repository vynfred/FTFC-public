import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/EmergencyAuthContext';
import { forceReauthentication, isSessionActive, refreshTokenWithBackoff } from '../../utils/authUtils';
import styles from './SessionTimeoutWarning.module.css';

/**
 * Session Timeout Warning Component
 *
 * Displays a warning when the user's session is about to expire
 * and provides options to extend the session or log out.
 */
const SessionTimeoutWarning = ({
  warningMinutes = 5,
  logoutMinutes = 1,
  checkInterval = 60000, // 1 minute
  maxInactivityMinutes = 30
}) => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) return;

    let warningTimer;
    let logoutTimer;

    const checkSession = async () => {
      try {
        // Check if session is active based on user activity
        if (!isSessionActive(maxInactivityMinutes)) {
          console.log('Session inactive due to user inactivity');
          await forceReauthentication();
          return;
        }

        // Check token expiration
        try {
          // Try to refresh the token if it's expired
          await refreshTokenWithBackoff();

          // Token refreshed successfully, hide warning if shown
          if (showWarning) {
            setShowWarning(false);
            clearTimeout(logoutTimer);
          }
        } catch (error) {
          console.warn('Token refresh failed:', error);

          // Show warning if not already shown
          if (!showWarning) {
            setShowWarning(true);
            setTimeRemaining(warningMinutes * 60);

            // Set timer to force logout
            logoutTimer = setTimeout(() => {
              console.log('Session expired, logging out');
              forceReauthentication();
            }, logoutMinutes * 60 * 1000);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    // Initial check
    checkSession();

    // Set up interval to check session
    const intervalId = setInterval(checkSession, checkInterval);

    // Set up countdown timer when warning is shown
    let countdownId;
    if (showWarning) {
      countdownId = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(countdownId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
      clearInterval(countdownId);
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
    };
  }, [user, showWarning, warningMinutes, logoutMinutes, checkInterval, maxInactivityMinutes, logout]);

  const handleExtendSession = async () => {
    try {
      await refreshTokenWithBackoff();
      setShowWarning(false);
    } catch (error) {
      console.error('Error extending session:', error);
      // If we can't extend the session, force re-authentication
      forceReauthentication();
    }
  };

  const handleLogout = () => {
    forceReauthentication();
  };

  if (!showWarning || !user) {
    return null;
  }

  // Format time remaining
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Session Timeout Warning</h3>
        <p className={styles.message}>
          Your session will expire in <span className={styles.timer}>{formattedTime}</span>.
        </p>
        <p className={styles.submessage}>
          Due to inactivity, you will be logged out automatically.
          Would you like to extend your session?
        </p>
        <div className={styles.buttons}>
          <button
            className={`${styles.button} ${styles.extendButton}`}
            onClick={handleExtendSession}
          >
            Extend Session
          </button>
          <button
            className={`${styles.button} ${styles.logoutButton}`}
            onClick={handleLogout}
          >
            Logout Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutWarning;
