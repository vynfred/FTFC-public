import React from 'react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';
import styles from './ErrorDisplay.module.css';

/**
 * ErrorDisplay - A reusable component for displaying error messages
 * 
 * @param {Object} props
 * @param {string} props.message - The error message to display
 * @param {Function} props.onRetry - Optional callback function to retry the operation
 * @param {string} props.variant - Optional variant ('inline', 'full', 'toast') - defaults to 'inline'
 * @param {Object} props.error - Optional error object for detailed logging
 */
const ErrorDisplay = ({ message, onRetry, variant = 'inline', error }) => {
  // Log detailed error to console for debugging
  if (error && process.env.NODE_ENV !== 'production') {
    console.error('Error details:', error);
  }

  // Default error message if none provided
  const errorMessage = message || 'An unexpected error occurred. Please try again.';

  // Render different variants based on the prop
  switch (variant) {
    case 'full':
      return (
        <div className={styles.fullError}>
          <div className={styles.errorIcon}>
            <FaExclamationTriangle size={48} />
          </div>
          <h2 className={styles.errorTitle}>Something went wrong</h2>
          <p className={styles.errorMessage}>{errorMessage}</p>
          {onRetry && (
            <button className={styles.retryButton} onClick={onRetry}>
              <FaRedo className={styles.retryIcon} />
              Try Again
            </button>
          )}
        </div>
      );

    case 'toast':
      return (
        <div className={styles.toastError}>
          <FaExclamationTriangle className={styles.toastIcon} />
          <span className={styles.toastMessage}>{errorMessage}</span>
          {onRetry && (
            <button className={styles.toastRetry} onClick={onRetry}>
              <FaRedo />
            </button>
          )}
        </div>
      );

    case 'inline':
    default:
      return (
        <div className={styles.inlineError}>
          <FaExclamationTriangle className={styles.inlineIcon} />
          <span className={styles.inlineMessage}>{errorMessage}</span>
          {onRetry && (
            <button className={styles.inlineRetry} onClick={onRetry}>
              <FaRedo className={styles.retryIcon} />
              Retry
            </button>
          )}
        </div>
      );
  }
};

export default ErrorDisplay;
