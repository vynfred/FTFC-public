import { useState, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import { handleError, getUserFriendlyErrorMessage } from '../utils/errors';

/**
 * Custom hook for making API requests with error handling
 * 
 * Provides a consistent way to handle API requests and errors.
 * 
 * @param {Object} options - Hook options
 * @param {boolean} [options.showToast=true] - Whether to show toast notifications
 * @param {Function} [options.onError] - Callback function when an error occurs
 * @returns {Object} API request utilities
 */
const useApi = ({
  showToast = true,
  onError
} = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { showSuccess, showError } = useToast();

  /**
   * Reset the state
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  /**
   * Execute an API request
   * @param {Function} apiFunction - The API function to call
   * @param {Array} args - Arguments to pass to the API function
   * @param {Object} options - Request options
   * @param {string} [options.successMessage] - Success message to display
   * @param {string} [options.errorMessage] - Error message to display
   * @param {Function} [options.onSuccess] - Callback function on success
   * @param {boolean} [options.resetOnSuccess=false] - Whether to reset state on success
   * @returns {Promise<any>} The API response
   */
  const request = useCallback(async (
    apiFunction,
    args = [],
    {
      successMessage,
      errorMessage,
      onSuccess,
      resetOnSuccess = false
    } = {}
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Call the API function with the provided arguments
      const result = await apiFunction(...args);
      
      // Set the data state
      setData(result);
      
      // Show success message if provided
      if (successMessage && showToast) {
        showSuccess(successMessage);
      }
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(result);
      }
      
      // Reset state if requested
      if (resetOnSuccess) {
        reset();
      } else {
        setLoading(false);
      }
      
      return result;
    } catch (err) {
      // Process the error
      const processedError = handleError(err);
      
      // Set error state
      setError(processedError);
      setLoading(false);
      
      // Show error message if enabled
      if (showToast) {
        const message = errorMessage || getUserFriendlyErrorMessage(
          processedError.code,
          processedError.message
        );
        showError(message);
      }
      
      // Call onError callback if provided
      if (onError) {
        onError(processedError);
      }
      
      throw processedError;
    }
  }, [showToast, showSuccess, showError, onError, reset]);

  return {
    loading,
    error,
    data,
    request,
    reset
  };
};

export default useApi;
