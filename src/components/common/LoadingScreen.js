import React from 'react';
import PropTypes from 'prop-types';
import styles from './LoadingScreen.module.css';

/**
 * Loading Screen Component
 * 
 * Displays a loading spinner and optional message.
 * Used as a fallback for lazy-loaded components.
 * 
 * @param {Object} props - Component props
 * @param {string} [props.message='Loading...'] - The loading message to display
 * @param {string} [props.size='medium'] - The size of the spinner ('small', 'medium', 'large')
 * @param {boolean} [props.fullScreen=false] - Whether to display the spinner full screen
 */
const LoadingScreen = ({ 
  message = 'Loading...', 
  size = 'medium', 
  fullScreen = false 
}) => {
  const containerClass = fullScreen 
    ? styles.fullScreenContainer 
    : styles.container;
  
  const spinnerClass = `${styles.spinner} ${styles[size]}`;
  
  return (
    <div className={containerClass}>
      <div className={spinnerClass}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

LoadingScreen.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullScreen: PropTypes.bool
};

export default LoadingScreen;
