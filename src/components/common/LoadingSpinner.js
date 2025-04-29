import PropTypes from 'prop-types';
import React from 'react';
import styles from './LoadingSpinner.module.css';

/**
 * LoadingSpinner - A reusable loading spinner component
 *
 * @param {Object} props
 * @param {string} props.size - Size of the spinner ('small', 'medium', 'large')
 * @param {string} props.color - Color of the spinner ('primary', 'secondary', 'white', 'dark')
 * @param {string} props.text - Optional text to display below the spinner
 * @param {boolean} props.fullPage - Whether to display the spinner centered on the full page
 * @param {boolean} props.overlay - Whether to display the spinner with a background overlay
 */
const LoadingSpinner = ({
  size = 'medium',
  color = 'primary',
  text,
  fullPage = false,
  overlay = false
}) => {
  // Determine the CSS classes based on props
  const spinnerClasses = [
    styles.spinner,
    styles[size],
    styles[color]
  ].join(' ');

  // If fullPage or overlay is true, wrap the spinner in a container
  if (fullPage || overlay || text) {
    const containerClasses = [
      styles.container,
      fullPage ? styles.fullPage : '',
      overlay ? styles.overlay : ''
    ].filter(Boolean).join(' ');

    return (
      <div className={containerClasses} role="status" aria-live="polite">
        <div className={spinnerClasses}>
          <div className={styles.bounce1}></div>
          <div className={styles.bounce2}></div>
          <div className={styles.bounce3}></div>
        </div>
        {text && <p className={styles.text}>{text}</p>}
        <span className={styles.srOnly}>Loading...</span>
      </div>
    );
  }

  // Simple spinner without container
  return (
    <div className={spinnerClasses} role="status" aria-live="polite">
      <div className={styles.bounce1}></div>
      <div className={styles.bounce2}></div>
      <div className={styles.bounce3}></div>
      <span className={styles.srOnly}>Loading...</span>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'secondary', 'white', 'dark']),
  text: PropTypes.string,
  fullPage: PropTypes.bool,
  overlay: PropTypes.bool
};

export default LoadingSpinner;
