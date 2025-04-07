import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaTimes } from 'react-icons/fa';
import styles from './Toast.module.css';

/**
 * Toast component for displaying notifications
 * 
 * @param {Object} props
 * @param {string} props.id - Toast ID
 * @param {string} props.title - Toast title
 * @param {string} props.message - Toast message
 * @param {string} props.type - Toast type (info, success, warning, error)
 * @param {number} props.duration - Toast duration in milliseconds
 * @param {boolean} props.showProgress - Whether to show the progress bar
 * @param {Function} props.onClose - Function called when the toast is closed
 */
const Toast = ({
  id,
  title,
  message,
  type = 'info',
  duration = 5000,
  showProgress = true,
  onClose
}) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  
  // Get icon based on toast type
  const getIcon = () => {
    switch (type) {
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
  
  // Handle close
  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      if (onClose) {
        onClose(id);
      }
    }, 300); // Match the transition duration
  }, [id, onClose]);
  
  // Show toast when mounted
  useEffect(() => {
    // Small delay to trigger the transition
    const showTimeout = setTimeout(() => {
      setVisible(true);
    }, 10);
    
    return () => clearTimeout(showTimeout);
  }, []);
  
  // Auto-close after duration
  useEffect(() => {
    if (duration === 0) return; // Don't auto-close if duration is 0
    
    const closeTimeout = setTimeout(() => {
      handleClose();
    }, duration);
    
    return () => clearTimeout(closeTimeout);
  }, [duration, handleClose]);
  
  // Update progress bar
  useEffect(() => {
    if (!showProgress || duration === 0) return;
    
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    const updateProgress = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const percent = (remaining / duration) * 100;
      setProgress(percent);
      
      if (remaining > 0) {
        requestAnimationFrame(updateProgress);
      }
    };
    
    const animationFrame = requestAnimationFrame(updateProgress);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [duration, showProgress]);
  
  return (
    <div
      className={`
        ${styles.toast}
        ${styles[type]}
        ${visible ? styles.visible : ''}
        ${exiting ? styles.exiting : ''}
      `}
    >
      <div className={styles.icon}>
        {getIcon()}
      </div>
      
      <div className={styles.content}>
        {title && <h4 className={styles.title}>{title}</h4>}
        {message && <p className={styles.message}>{message}</p>}
      </div>
      
      <button
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="Close"
      >
        <FaTimes />
      </button>
      
      {showProgress && duration > 0 && (
        <div
          className={styles.progressBar}
          style={{ width: `${progress}%` }}
        />
      )}
    </div>
  );
};

/**
 * ToastContainer component for managing multiple toasts
 * 
 * @param {Object} props
 * @param {Array} props.toasts - Array of toast objects
 * @param {string} props.position - Toast container position
 * @param {Function} props.onClose - Function called when a toast is closed
 */
const ToastContainer = ({
  toasts = [],
  position = 'bottomRight',
  onClose
}) => {
  // Don't render anything if there are no toasts
  if (toasts.length === 0) return null;
  
  // Create a portal to render the toasts at the end of the document body
  return createPortal(
    <div className={`${styles.toastContainer} ${styles[position]}`}>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onClose}
        />
      ))}
    </div>,
    document.body
  );
};

export { Toast, ToastContainer };
