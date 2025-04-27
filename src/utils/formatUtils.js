/**
 * Format Utility Functions
 * 
 * This file contains utility functions for formatting data.
 */

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: USD)
 * @param {string} locale - The locale (default: en-US)
 * @returns {string} The formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (amount === null || amount === undefined) return 'N/A';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${amount}`;
  }
};

/**
 * Format a number with commas
 * @param {number} number - The number to format
 * @param {number} decimals - The number of decimal places (default: 0)
 * @returns {string} The formatted number string
 */
export const formatNumber = (number, decimals = 0) => {
  if (number === null || number === undefined) return 'N/A';
  
  try {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(number);
  } catch (error) {
    console.error('Error formatting number:', error);
    return `${number}`;
  }
};

/**
 * Format a percentage
 * @param {number} value - The value to format (e.g., 0.75 for 75%)
 * @param {number} decimals - The number of decimal places (default: 0)
 * @returns {string} The formatted percentage string
 */
export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined) return 'N/A';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return `${value * 100}%`;
  }
};

/**
 * Format a phone number
 * @param {string} phone - The phone number to format
 * @returns {string} The formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return 'N/A';
  
  try {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format based on length
    if (cleaned.length === 10) {
      // US format: (XXX) XXX-XXXX
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned[0] === '1') {
      // US format with country code: +1 (XXX) XXX-XXXX
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    } else {
      // Return as is with dashes for readability
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
  } catch (error) {
    console.error('Error formatting phone number:', error);
    return phone;
  }
};

/**
 * Truncate text with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - The maximum length (default: 100)
 * @returns {string} The truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  
  try {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
  } catch (error) {
    console.error('Error truncating text:', error);
    return text;
  }
};

/**
 * Convert bytes to a human-readable file size
 * @param {number} bytes - The size in bytes
 * @param {number} decimals - The number of decimal places (default: 2)
 * @returns {string} The formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  if (!bytes) return 'N/A';
  
  try {
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
  } catch (error) {
    console.error('Error formatting file size:', error);
    return `${bytes} Bytes`;
  }
};

/**
 * Capitalize the first letter of each word in a string
 * @param {string} text - The text to capitalize
 * @returns {string} The capitalized text
 */
export const capitalizeWords = (text) => {
  if (!text) return '';
  
  try {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  } catch (error) {
    console.error('Error capitalizing words:', error);
    return text;
  }
};

/**
 * Convert a camelCase string to Title Case
 * @param {string} camelCase - The camelCase string
 * @returns {string} The Title Case string
 */
export const camelCaseToTitleCase = (camelCase) => {
  if (!camelCase) return '';
  
  try {
    const result = camelCase.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  } catch (error) {
    console.error('Error converting camelCase to Title Case:', error);
    return camelCase;
  }
};
