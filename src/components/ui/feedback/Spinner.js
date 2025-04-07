import React from 'react';
import styles from './Feedback.module.css';

/**
 * Spinner component for loading states
 * 
 * @param {Object} props
 * @param {string} props.size - Spinner size ('sm', 'md', 'lg', 'xl')
 * @param {string} props.color - Spinner color ('primary', 'secondary', 'white')
 * @param {string} props.className - Additional CSS class names
 */
const Spinner = ({
  size = 'md',
  color = 'primary',
  className = '',
  ...rest
}) => {
  // Determine CSS classes based on props
  const spinnerClasses = [
    styles.spinner,
    styles[`spinner${size.charAt(0).toUpperCase() + size.slice(1)}`],
    styles[`spinner${color.charAt(0).toUpperCase() + color.slice(1)}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={spinnerClasses} 
      role="status"
      aria-label="Loading"
      {...rest}
    />
  );
};

export default Spinner;
