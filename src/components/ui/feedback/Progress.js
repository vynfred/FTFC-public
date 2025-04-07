import React from 'react';
import styles from './Feedback.module.css';

/**
 * Progress component for displaying progress bars
 * 
 * @param {Object} props
 * @param {number} props.value - Current progress value (0-100)
 * @param {string} props.label - Progress label
 * @param {boolean} props.showValue - Whether to show the progress value
 * @param {string} props.variant - Progress variant ('primary', 'secondary', 'success', 'warning', 'error')
 * @param {string} props.className - Additional CSS class names
 */
const Progress = ({
  value = 0,
  label,
  showValue = false,
  variant = 'primary',
  className = '',
  ...rest
}) => {
  // Ensure value is between 0 and 100
  const normalizedValue = Math.min(Math.max(0, value), 100);
  
  // Determine CSS classes based on props
  const progressClasses = [
    styles.progress,
    styles[`progress${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <div {...rest}>
      {(label || showValue) && (
        <div className={styles.progressInfo}>
          {label && <div className={styles.progressLabel}>{label}</div>}
          {showValue && <div className={styles.progressValue}>{normalizedValue}%</div>}
        </div>
      )}
      
      <div className={progressClasses}>
        <div 
          className={styles.progressBar} 
          style={{ width: `${normalizedValue}%` }}
          role="progressbar"
          aria-valuenow={normalizedValue}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  );
};

export default Progress;
