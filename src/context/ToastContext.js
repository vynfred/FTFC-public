import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer } from '../components/ui/feedback/Toast';

// Create context
const ToastContext = createContext();

/**
 * ToastProvider component for managing toasts
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.position - Toast container position
 */
export const ToastProvider = ({
  children,
  position = 'bottomRight'
}) => {
  const [toasts, setToasts] = useState([]);
  
  // Generate unique ID for toasts
  const generateId = () => {
    return `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };
  
  // Add a toast
  const addToast = useCallback((toast) => {
    const id = toast.id || generateId();
    setToasts(prevToasts => [...prevToasts, { ...toast, id }]);
    return id;
  }, []);
  
  // Remove a toast
  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);
  
  // Show an info toast
  const showInfo = useCallback((message, options = {}) => {
    return addToast({
      type: 'info',
      message,
      ...options
    });
  }, [addToast]);
  
  // Show a success toast
  const showSuccess = useCallback((message, options = {}) => {
    return addToast({
      type: 'success',
      message,
      ...options
    });
  }, [addToast]);
  
  // Show a warning toast
  const showWarning = useCallback((message, options = {}) => {
    return addToast({
      type: 'warning',
      message,
      ...options
    });
  }, [addToast]);
  
  // Show an error toast
  const showError = useCallback((message, options = {}) => {
    return addToast({
      type: 'error',
      message,
      ...options
    });
  }, [addToast]);
  
  // Context value
  const value = {
    toasts,
    addToast,
    removeToast,
    showInfo,
    showSuccess,
    showWarning,
    showError
  };
  
  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer
        toasts={toasts}
        position={position}
        onClose={removeToast}
      />
    </ToastContext.Provider>
  );
};

/**
 * useToast hook for accessing the toast context
 * 
 * @returns {Object} Toast context
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};
