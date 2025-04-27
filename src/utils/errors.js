/**
 * Custom Error Classes and Error Handling Utilities
 */

import { ERROR_CODES } from './constants';

/**
 * Base Application Error
 * 
 * Base class for all custom application errors.
 */
export class AppError extends Error {
  constructor(message, code = 'app/unknown-error', status = 500, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.status = status;
    this.details = details;
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  /**
   * Convert error to a plain object for logging or serialization
   */
  toObject() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      details: this.details,
      stack: this.stack
    };
  }
  
  /**
   * Get a user-friendly error message
   */
  getUserMessage() {
    return this.message;
  }
}

/**
 * Authentication Error
 * 
 * Used for authentication-related errors.
 */
export class AuthError extends AppError {
  constructor(message, code = ERROR_CODES.UNAUTHORIZED, status = 401, details = null) {
    super(message, code, status, details);
  }
}

/**
 * Validation Error
 * 
 * Used for data validation errors.
 */
export class ValidationError extends AppError {
  constructor(message, validationErrors = {}, code = 'validation/invalid-data', status = 400) {
    super(message, code, status, validationErrors);
  }
  
  /**
   * Get validation errors for a specific field
   */
  getFieldError(field) {
    return this.details && this.details[field] ? this.details[field] : null;
  }
  
  /**
   * Check if a specific field has errors
   */
  hasFieldError(field) {
    return !!this.getFieldError(field);
  }
}

/**
 * Not Found Error
 * 
 * Used when a requested resource is not found.
 */
export class NotFoundError extends AppError {
  constructor(message, code = ERROR_CODES.DOCUMENT_NOT_FOUND, status = 404, details = null) {
    super(message, code, status, details);
  }
}

/**
 * Permission Error
 * 
 * Used when a user doesn't have permission to access a resource.
 */
export class PermissionError extends AppError {
  constructor(message, code = ERROR_CODES.INSUFFICIENT_PERMISSIONS, status = 403, details = null) {
    super(message, code, status, details);
  }
}

/**
 * API Error
 * 
 * Used for errors from external APIs.
 */
export class ApiError extends AppError {
  constructor(message, code = ERROR_CODES.SERVICE_UNAVAILABLE, status = 503, details = null) {
    super(message, code, status, details);
  }
}

/**
 * Network Error
 * 
 * Used for network-related errors.
 */
export class NetworkError extends AppError {
  constructor(message, code = ERROR_CODES.NETWORK_ERROR, status = 503, details = null) {
    super(message, code, status, details);
  }
}

/**
 * Convert a Firebase error to an AppError
 * @param {Error} error - The Firebase error
 * @returns {AppError} The converted error
 */
export const convertFirebaseError = (error) => {
  const { code, message } = error;
  
  // Authentication errors
  if (code?.startsWith('auth/')) {
    switch (code) {
      case ERROR_CODES.INVALID_CREDENTIALS:
      case ERROR_CODES.USER_NOT_FOUND:
      case ERROR_CODES.WRONG_PASSWORD:
        return new AuthError('Invalid email or password', code, 401);
        
      case ERROR_CODES.EMAIL_ALREADY_IN_USE:
        return new AuthError('Email is already in use', code, 400);
        
      case ERROR_CODES.WEAK_PASSWORD:
        return new AuthError('Password is too weak', code, 400);
        
      case ERROR_CODES.INVALID_EMAIL:
        return new AuthError('Invalid email address', code, 400);
        
      default:
        return new AuthError(message || 'Authentication error', code, 401);
    }
  }
  
  // Firestore errors
  if (code?.startsWith('firestore/')) {
    switch (code) {
      case ERROR_CODES.DOCUMENT_NOT_FOUND:
        return new NotFoundError('Document not found', code, 404);
        
      case ERROR_CODES.COLLECTION_NOT_FOUND:
        return new NotFoundError('Collection not found', code, 404);
        
      default:
        return new AppError(message || 'Database error', code, 500);
    }
  }
  
  // Default case
  return new AppError(message || 'An unexpected error occurred', code || 'app/unknown-error', 500);
};

/**
 * Handle an error and return a standardized error object
 * @param {Error} error - The error to handle
 * @param {Function} [logger] - Optional logger function
 * @returns {Object} Standardized error object
 */
export const handleError = (error, logger = console.error) => {
  // Convert to AppError if it's not already
  const appError = error instanceof AppError
    ? error
    : convertFirebaseError(error);
  
  // Log the error
  if (logger) {
    logger('Error:', appError.toObject());
  }
  
  // Return standardized error object
  return {
    message: appError.message,
    code: appError.code,
    status: appError.status,
    details: appError.details
  };
};

/**
 * Create a user-friendly error message based on error code
 * @param {string} code - The error code
 * @param {string} [defaultMessage] - Default message if code is not recognized
 * @returns {string} User-friendly error message
 */
export const getUserFriendlyErrorMessage = (code, defaultMessage = 'An unexpected error occurred') => {
  switch (code) {
    // Authentication errors
    case ERROR_CODES.INVALID_CREDENTIALS:
    case ERROR_CODES.USER_NOT_FOUND:
    case ERROR_CODES.WRONG_PASSWORD:
      return 'Invalid email or password. Please try again.';
      
    case ERROR_CODES.EMAIL_ALREADY_IN_USE:
      return 'This email is already in use. Please use a different email or try logging in.';
      
    case ERROR_CODES.WEAK_PASSWORD:
      return 'Password is too weak. Please use a stronger password.';
      
    case ERROR_CODES.INVALID_EMAIL:
      return 'Please enter a valid email address.';
      
    case ERROR_CODES.UNAUTHORIZED:
      return 'You are not authorized to perform this action. Please log in and try again.';
      
    case ERROR_CODES.INSUFFICIENT_PERMISSIONS:
      return 'You do not have permission to access this resource.';
    
    // Database errors
    case ERROR_CODES.DOCUMENT_NOT_FOUND:
    case ERROR_CODES.COLLECTION_NOT_FOUND:
      return 'The requested information could not be found.';
    
    // API errors
    case ERROR_CODES.RATE_LIMIT_EXCEEDED:
      return 'Too many requests. Please try again later.';
      
    case ERROR_CODES.SERVICE_UNAVAILABLE:
      return 'The service is currently unavailable. Please try again later.';
      
    case ERROR_CODES.NETWORK_ERROR:
      return 'Network error. Please check your internet connection and try again.';
      
    case ERROR_CODES.TIMEOUT:
      return 'The request timed out. Please try again.';
      
    default:
      return defaultMessage;
  }
};
