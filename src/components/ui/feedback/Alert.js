import React from 'react';
// Import icons individually to reduce bundle size
import FaCheckCircle from 'react-icons/fa/FaCheckCircle';
import FaExclamationTriangle from 'react-icons/fa/FaExclamationTriangle';
import FaInfoCircle from 'react-icons/fa/FaInfoCircle';
import FaTimes from 'react-icons/fa/FaTimes';
import FaTimesCircle from 'react-icons/fa/FaTimesCircle';
import styles from './Feedback.module.css';

/**
 * Alert component for displaying messages to the user
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Alert content
 * @param {string} props.title - Alert title
 * @param {string} props.variant - Alert variant ('info', 'success', 'warning', 'error')
 * @param {boolean} props.dismissible - Whether the alert can be dismissed
 * @param {Function} props.onDismiss - Function called when the alert is dismissed
 * @param {string} props.className - Additional CSS class names
 */
const Alert = ({
  children,
  title,
  variant = 'info',
  dismissible = false,
  onDismiss,
  className = '',
  ...rest
}) => {
  // Get the appropriate icon based on variant
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <FaCheckCircle />;
      case 'warning':
        return <FaExclamationTriangle />;
      case 'error':
        return <FaTimesCircle />;
      case 'info':
      default:
        return <FaInfoCircle />;
    }
  };

  // Determine CSS classes based on props
  const alertClasses = [
    styles.alert,
    styles[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={alertClasses} role="alert" {...rest}>
      <div className={styles.alertIcon}>
        {getIcon()}
      </div>

      <div className={styles.alertContent}>
        {title && <div className={styles.alertTitle}>{title}</div>}
        <div className={styles.alertMessage}>{children}</div>
      </div>

      {dismissible && onDismiss && (
        <button
          type="button"
          className={styles.alertClose}
          onClick={onDismiss}
          aria-label="Close"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default Alert;
