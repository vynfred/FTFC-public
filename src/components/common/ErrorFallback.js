import React from 'react';
import PropTypes from 'prop-types';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getUserFriendlyErrorMessage } from '../../utils/errors';
import styles from './ErrorFallback.module.css';

/**
 * Error Fallback Component
 * 
 * Displays a user-friendly error message with options to retry or go home.
 * Used as a fallback UI for error boundaries.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.error - The error object
 * @param {Function} [props.resetError] - Function to reset the error and retry
 * @param {boolean} [props.showHomeLink=true] - Whether to show the home link
 * @param {string} [props.homeLink='/'] - The home link URL
 * @param {string} [props.customMessage] - Custom error message to display
 */
const ErrorFallback = ({
  error,
  resetError,
  showHomeLink = true,
  homeLink = '/',
  customMessage
}) => {
  // Get user-friendly error message
  const errorMessage = customMessage || getUserFriendlyErrorMessage(
    error?.code,
    error?.message || 'Something went wrong'
  );
  
  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <FaExclamationTriangle className={styles.icon} />
      </div>
      
      <h2 className={styles.title}>Oops! Something went wrong</h2>
      
      <p className={styles.message}>{errorMessage}</p>
      
      <div className={styles.actions}>
        {resetError && (
          <button
            className={styles.retryButton}
            onClick={resetError}
            aria-label="Try again"
          >
            <FaRedo className={styles.buttonIcon} />
            Try Again
          </button>
        )}
        
        {showHomeLink && (
          <Link
            to={homeLink}
            className={styles.homeLink}
            aria-label="Go to home page"
          >
            <FaHome className={styles.buttonIcon} />
            Go to Home
          </Link>
        )}
      </div>
      
      {process.env.NODE_ENV === 'development' && error && (
        <div className={styles.developerInfo}>
          <h3>Developer Information</h3>
          <p className={styles.errorName}>{error.name}: {error.message}</p>
          {error.code && <p className={styles.errorCode}>Code: {error.code}</p>}
          {error.stack && (
            <pre className={styles.errorStack}>
              {error.stack}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

ErrorFallback.propTypes = {
  error: PropTypes.object.isRequired,
  resetError: PropTypes.func,
  showHomeLink: PropTypes.bool,
  homeLink: PropTypes.string,
  customMessage: PropTypes.string
};

export default ErrorFallback;
