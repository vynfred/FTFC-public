/**
 * Mock implementation of google-logging-utils for browser environments
 * 
 * This provides a minimal implementation that doesn't rely on Node.js-specific features
 * like process.stdout.isTTY
 */

// Create a simple logger that works in the browser
const createLogger = (name) => {
  return {
    // Basic log levels
    error: (...args) => console.error(`[${name}]`, ...args),
    warn: (...args) => console.warn(`[${name}]`, ...args),
    info: (...args) => console.info(`[${name}]`, ...args),
    verbose: (...args) => console.log(`[${name}] VERBOSE:`, ...args),
    debug: (...args) => console.debug(`[${name}] DEBUG:`, ...args),
    
    // Mock the isEnabled method that's causing the error
    isEnabled: () => false,
    
    // Mock the refresh method
    refresh: () => {},
    
    // Mock color methods
    red: (text) => text,
    green: (text) => text,
    yellow: (text) => text,
    blue: (text) => text,
    magenta: (text) => text,
    cyan: (text) => text,
    white: (text) => text,
    gray: (text) => text,
    bold: (text) => text
  };
};

// Export the mock implementation
export default {
  createLogger
};
