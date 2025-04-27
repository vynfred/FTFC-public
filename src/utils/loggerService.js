/**
 * Logger Service
 * 
 * Provides centralized logging functionality for the application
 * with different log levels and destinations.
 */

import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Log levels
export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

// Log categories
export const LOG_CATEGORIES = {
  AUTH: 'auth',
  API: 'api',
  NAVIGATION: 'navigation',
  PERFORMANCE: 'performance',
  USER_ACTION: 'user_action',
  SYSTEM: 'system'
};

/**
 * Log an event to Firestore and console
 * @param {string} category - Log category
 * @param {string} action - Action being logged
 * @param {Object} details - Additional details
 * @param {string} level - Log level
 * @returns {Promise<void>}
 */
export const logEvent = async (
  category = LOG_CATEGORIES.SYSTEM,
  action,
  details = {},
  level = LOG_LEVELS.INFO
) => {
  try {
    // Always log to console in development
    if (process.env.NODE_ENV === 'development') {
      const consoleMethod = level === LOG_LEVELS.ERROR ? console.error :
                           level === LOG_LEVELS.WARN ? console.warn :
                           level === LOG_LEVELS.DEBUG ? console.debug :
                           console.log;
      
      consoleMethod(`[${category.toUpperCase()}] ${action}`, details);
    }
    
    // Don't log debug messages to Firestore in production
    if (process.env.NODE_ENV === 'production' && level === LOG_LEVELS.DEBUG) {
      return;
    }
    
    // Log to Firestore
    const db = getFirestore();
    const auth = getAuth();
    
    const logData = {
      category,
      action,
      details: sanitizeLogData(details),
      level,
      timestamp: serverTimestamp(),
      userId: auth.currentUser?.uid || 'anonymous',
      userEmail: auth.currentUser?.email || null,
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer || null,
      sessionId: getSessionId()
    };
    
    await addDoc(collection(db, 'clientLogs'), logData);
  } catch (error) {
    // Fallback to console if Firestore logging fails
    console.error('Error logging event:', error);
    console.log(`[${category}] ${action}`, details);
  }
};

/**
 * Log an authentication event
 * @param {string} action - Auth action
 * @param {Object} details - Additional details
 * @param {string} level - Log level
 * @returns {Promise<void>}
 */
export const logAuthEvent = async (action, details = {}, level = LOG_LEVELS.INFO) => {
  return logEvent(LOG_CATEGORIES.AUTH, action, details, level);
};

/**
 * Log an API event
 * @param {string} action - API action
 * @param {Object} details - Additional details
 * @param {string} level - Log level
 * @returns {Promise<void>}
 */
export const logApiEvent = async (action, details = {}, level = LOG_LEVELS.INFO) => {
  return logEvent(LOG_CATEGORIES.API, action, details, level);
};

/**
 * Log an error
 * @param {string} category - Log category
 * @param {string} action - Error action
 * @param {Error} error - Error object
 * @param {Object} additionalDetails - Additional context
 * @returns {Promise<void>}
 */
export const logError = async (category, action, error, additionalDetails = {}) => {
  const errorDetails = {
    message: error.message,
    stack: error.stack,
    code: error.code,
    ...additionalDetails
  };
  
  return logEvent(category, action, errorDetails, LOG_LEVELS.ERROR);
};

/**
 * Get or create a session ID
 * @returns {string} Session ID
 */
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('sessionId');
  
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('sessionId', sessionId);
  }
  
  return sessionId;
};

/**
 * Generate a unique session ID
 * @returns {string} Session ID
 */
const generateSessionId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Sanitize log data to remove sensitive information
 * @param {Object} data - Data to sanitize
 * @returns {Object} Sanitized data
 */
const sanitizeLogData = (data) => {
  if (!data || typeof data !== 'object') {
    return data;
  }
  
  // Create a deep copy to avoid modifying the original
  const sanitized = JSON.parse(JSON.stringify(data));
  
  // List of sensitive field names to redact
  const sensitiveFields = [
    'password', 'token', 'accessToken', 'refreshToken', 'idToken',
    'secret', 'apiKey', 'key', 'credential', 'ssn', 'socialSecurity',
    'creditCard', 'cardNumber', 'cvv', 'pin'
  ];
  
  // Recursively sanitize objects
  const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }
    
    Object.keys(obj).forEach(key => {
      // Check if this is a sensitive field
      if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object') {
        // Recursively sanitize nested objects
        sanitizeObject(obj[key]);
      }
    });
    
    return obj;
  };
  
  return sanitizeObject(sanitized);
};
