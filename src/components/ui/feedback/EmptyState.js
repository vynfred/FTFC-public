import React from 'react';
import styles from './Feedback.module.css';

/**
 * EmptyState component for displaying when there is no data
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string} props.title - Empty state title
 * @param {string} props.message - Empty state message
 * @param {React.ReactNode} props.action - Action button or link
 * @param {string} props.className - Additional CSS class names
 */
const EmptyState = ({
  icon,
  title,
  message,
  action,
  className = '',
  ...rest
}) => {
  // Determine CSS classes based on props
  const emptyStateClasses = [
    styles.emptyState,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={emptyStateClasses} {...rest}>
      {icon && (
        <div className={styles.emptyIcon}>
          {icon}
        </div>
      )}
      
      {title && (
        <h3 className={styles.emptyTitle}>{title}</h3>
      )}
      
      {message && (
        <p className={styles.emptyText}>{message}</p>
      )}
      
      {action && (
        <div className={styles.emptyAction}>
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
