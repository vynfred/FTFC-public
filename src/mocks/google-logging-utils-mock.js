/**
 * Mock implementation of google-logging-utils for browser environments
 *
 * This provides a complete implementation that doesn't rely on Node.js-specific features
 */

// Mock colors functions
const colours = {
  red: (text) => text,
  green: (text) => text,
  yellow: (text) => text,
  blue: (text) => text,
  magenta: (text) => text,
  cyan: (text) => text,
  white: (text) => text,
  gray: (text) => text,
  bold: (text) => text,
  dim: (text) => text,
  underline: (text) => text
};

// Create a Logger class that mimics the original
class Logger {
  constructor(name, options = {}) {
    this.name = name;
    this.options = {
      level: options.level || 'info',
      levels: options.levels || ['error', 'warn', 'info', 'verbose', 'debug', 'silly'],
      colors: options.colors !== false,
      ...options
    };
    this.stdout = { isTTY: false };
    this.stderr = { isTTY: false };
  }

  // This is the method that was causing the error
  isEnabled() {
    return false;
  }

  // Mock the refresh method
  refresh() {
    return this;
  }

  // Log methods
  error(...args) {
    console.error(`[${this.name}]`, ...args);
    return this;
  }

  warn(...args) {
    console.warn(`[${this.name}]`, ...args);
    return this;
  }

  info(...args) {
    console.info(`[${this.name}]`, ...args);
    return this;
  }

  verbose(...args) {
    console.log(`[${this.name}] VERBOSE:`, ...args);
    return this;
  }

  debug(...args) {
    console.debug(`[${this.name}] DEBUG:`, ...args);
    return this;
  }

  silly(...args) {
    console.log(`[${this.name}] SILLY:`, ...args);
    return this;
  }

  // Color methods
  red(text) { return text; }
  green(text) { return text; }
  yellow(text) { return text; }
  blue(text) { return text; }
  magenta(text) { return text; }
  cyan(text) { return text; }
  white(text) { return text; }
  gray(text) { return text; }
  grey(text) { return text; }
  bold(text) { return text; }
  dim(text) { return text; }
  underline(text) { return text; }
}

// Factory function to create a logger
const createLogger = (name, options = {}) => {
  return new Logger(name, options);
};

// Export the mock implementation
export default {
  createLogger,
  colours,
  Logger
};

// Named exports for direct imports
export {
    createLogger,
    colours,
    Logger
};

