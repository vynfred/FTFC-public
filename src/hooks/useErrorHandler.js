import { useState, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import { handleError, getUserFriendlyErrorMessage } from '../utils/errors';

/**
 * Custom hook for handling errors
 * 
 * Provides a consistent way to handle errors across the application.
 * 
 * @param {Object} options - Hook options
 * @param {boolean} [options.showToast=true] - Whether to show toast notifications for errors
 * @param {Function} [options.logger=console.error] - Logger function for errors
 * @param {Function} [options.onError] - Callback function when an error occurs
 * @returns {Object} Error handling utilities
 */
const useErrorHandler = ({
  showToast = true,
  logger = console.error,
  onError
} = {}) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showError } = useToast();
  
  /**
   * Handle an error
   * @param {Error} err - The error to handle
   * @param {string} [customMessage] - Custom error message to display
   */
  const handleErrorWithState = useCallback((err, customMessage) => {
    // Process the error
    const processedError = handleError(err, logger);
    
    // Set error state
    setError(processedError);
    
    // Show toast notification if enabled
    if (showToast) {
      const message = customMessage || getUserFriendlyErrorMessage(
        processedError.code,
        processedError.message
      );
      showError(message);
    }
    
    // Call onError callback if provided
    if (onError) {
      onError(processedError);
    }
    
    // Return the processed error
    return processedError;
  }, [logger, showToast, showError, onError]);
  
  /**
   * Clear the error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  /**
   * Execute an async function with error handling
   * @param {Function} asyncFn - The async function to execute
   * @param {Object} options - Options for error handling
   * @param {string} [options.loadingMessage] - Loading message to display
   * @param {string} [options.errorMessage] - Error message to display if the function fails
   * @param {string} [options.successMessage] - Success message to display if the function succeeds
   * @param {boolean} [options.showLoadingState=true] - Whether to update the loading state
   * @returns {Promise<any>} The result of the async function
   */
  const executeWithErrorHandling = useCallback(async (
    asyncFn,
    {
      loadingMessage,
      errorMessage,
      successMessage,
      showLoadingState = true
    } = {}
  ) => {
    try {
      // Set loading state if enabled
      if (showLoadingState) {
        setIsLoading(true);
      }
      
      // Execute the async function
      const result = await asyncFn();
      
      // Show success message if provided
      if (successMessage && showToast) {
        showError(successMessage, 'success');
      }
      
      return result;
    } catch (err) {
      // Handle the error
      handleErrorWithState(err, errorMessage);
      throw err;
    } finally {
      // Reset loading state if enabled
      if (showLoadingState) {
        setIsLoading(false);
      }
    }
  }, [handleErrorWithState, showToast, showError]);
  
  return {
    error,
    isLoading,
    handleError: handleErrorWithState,
    clearError,
    executeWithErrorHandling
  };
};

export default useErrorHandler;
