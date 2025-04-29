import PropTypes from 'prop-types';
import React from 'react';
import { FaInbox, FaPlus } from 'react-icons/fa';
import SearchIcon from '../icons/SearchIcon';
import styles from './EmptyState.module.css';

/**
 * EmptyState - A reusable component for displaying empty state messages
 *
 * @param {Object} props
 * @param {string} props.message - The message to display
 * @param {string} props.type - The type of empty state ('no-data', 'no-results', 'no-access')
 * @param {string} props.actionText - Optional text for the action button
 * @param {Function} props.onAction - Optional callback for the action button
 * @param {React.ReactNode} props.icon - Optional custom icon
 * @param {string} props.variant - Optional variant ('default', 'compact', 'table')
 */
const EmptyState = ({
  message,
  type = 'no-data',
  actionText,
  onAction,
  icon,
  variant = 'default'
}) => {
  // Default messages based on type
  const defaultMessages = {
    'no-data': 'No data available',
    'no-results': 'No results found',
    'no-access': 'You don\'t have access to this content',
    'loading-error': 'Failed to load data'
  };

  // Default icons based on type
  const getDefaultIcon = () => {
    switch (type) {
      case 'no-results':
        return <SearchIcon className={styles.icon} />;
      case 'no-access':
        return <FaInbox className={styles.icon} />;
      case 'loading-error':
        return <FaInbox className={styles.icon} />;
      case 'no-data':
      default:
        return <FaInbox className={styles.icon} />;
    }
  };

  // Use provided message or default based on type
  const displayMessage = message || defaultMessages[type] || defaultMessages['no-data'];

  // Use provided icon or default based on type
  const displayIcon = icon || getDefaultIcon();

  // Render different variants
  switch (variant) {
    case 'compact':
      return (
        <div className={styles.compactContainer}>
          {displayIcon}
          <p className={styles.compactMessage}>{displayMessage}</p>
          {actionText && onAction && (
            <button className={styles.compactAction} onClick={onAction}>
              {actionText}
            </button>
          )}
        </div>
      );

    case 'table':
      return (
        <tr className={styles.tableRow}>
          <td colSpan="100%" className={styles.tableCell}>
            <div className={styles.tableContainer}>
              {displayIcon}
              <p className={styles.tableMessage}>{displayMessage}</p>
              {actionText && onAction && (
                <button className={styles.tableAction} onClick={onAction}>
                  <FaPlus className={styles.actionIcon} />
                  {actionText}
                </button>
              )}
            </div>
          </td>
        </tr>
      );

    case 'default':
    default:
      return (
        <div className={styles.container}>
          <div className={styles.iconContainer}>{displayIcon}</div>
          <h3 className={styles.title}>{displayMessage}</h3>
          {actionText && onAction && (
            <button className={styles.actionButton} onClick={onAction}>
              <FaPlus className={styles.actionIcon} />
              {actionText}
            </button>
          )}
        </div>
      );
  }
};

EmptyState.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(['no-data', 'no-results', 'no-access', 'loading-error']),
  actionText: PropTypes.string,
  onAction: PropTypes.func,
  icon: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'compact', 'table'])
};

export default EmptyState;
