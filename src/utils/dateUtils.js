/**
 * Date Utility Functions
 * 
 * This file contains utility functions for working with dates.
 */

import { DATE_FORMATS } from './constants';

/**
 * Format a date according to the specified format
 * @param {Date|string|number} date - The date to format
 * @param {string} format - The format to use (from DATE_FORMATS)
 * @returns {string} The formatted date string
 */
export const formatDate = (date, format = DATE_FORMATS.DISPLAY_DATE) => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    switch (format) {
      case DATE_FORMATS.DISPLAY_DATE:
        return dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        
      case DATE_FORMATS.DISPLAY_DATETIME:
        return dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        
      case DATE_FORMATS.ISO_DATE:
        return dateObj.toISOString().split('T')[0];
        
      case DATE_FORMATS.ISO_DATETIME:
        return dateObj.toISOString();
        
      default:
        return dateObj.toLocaleDateString();
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Error';
  }
};

/**
 * Get a relative time string (e.g., "2 hours ago", "in 3 days")
 * @param {Date|string|number} date - The date to format
 * @returns {string} The relative time string
 */
export const getRelativeTimeString = (date) => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    const now = new Date();
    const diffMs = dateObj.getTime() - now.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    const diffMonth = Math.round(diffDay / 30);
    const diffYear = Math.round(diffDay / 365);
    
    if (diffSec < 0) {
      // Past
      if (diffSec > -60) return 'just now';
      if (diffMin > -60) return `${Math.abs(diffMin)} minute${Math.abs(diffMin) === 1 ? '' : 's'} ago`;
      if (diffHour > -24) return `${Math.abs(diffHour)} hour${Math.abs(diffHour) === 1 ? '' : 's'} ago`;
      if (diffDay > -30) return `${Math.abs(diffDay)} day${Math.abs(diffDay) === 1 ? '' : 's'} ago`;
      if (diffMonth > -12) return `${Math.abs(diffMonth)} month${Math.abs(diffMonth) === 1 ? '' : 's'} ago`;
      return `${Math.abs(diffYear)} year${Math.abs(diffYear) === 1 ? '' : 's'} ago`;
    } else {
      // Future
      if (diffSec < 60) return 'in a few seconds';
      if (diffMin < 60) return `in ${diffMin} minute${diffMin === 1 ? '' : 's'}`;
      if (diffHour < 24) return `in ${diffHour} hour${diffHour === 1 ? '' : 's'}`;
      if (diffDay < 30) return `in ${diffDay} day${diffDay === 1 ? '' : 's'}`;
      if (diffMonth < 12) return `in ${diffMonth} month${diffMonth === 1 ? '' : 's'}`;
      return `in ${diffYear} year${diffYear === 1 ? '' : 's'}`;
    }
  } catch (error) {
    console.error('Error getting relative time:', error);
    return 'Error';
  }
};

/**
 * Check if a date is in the past
 * @param {Date|string|number} date - The date to check
 * @returns {boolean} True if the date is in the past
 */
export const isPastDate = (date) => {
  if (!date) return false;
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return false;
    }
    
    return dateObj < new Date();
  } catch (error) {
    console.error('Error checking if date is in past:', error);
    return false;
  }
};

/**
 * Check if a date is today
 * @param {Date|string|number} date - The date to check
 * @returns {boolean} True if the date is today
 */
export const isToday = (date) => {
  if (!date) return false;
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return false;
    }
    
    const today = new Date();
    return (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    );
  } catch (error) {
    console.error('Error checking if date is today:', error);
    return false;
  }
};

/**
 * Add days to a date
 * @param {Date|string|number} date - The date to add days to
 * @param {number} days - The number of days to add
 * @returns {Date} The new date
 */
export const addDays = (date, days) => {
  if (!date) return new Date();
  
  try {
    const dateObj = date instanceof Date ? new Date(date) : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return new Date();
    }
    
    dateObj.setDate(dateObj.getDate() + days);
    return dateObj;
  } catch (error) {
    console.error('Error adding days to date:', error);
    return new Date();
  }
};

/**
 * Get the start of a day (midnight)
 * @param {Date|string|number} date - The date
 * @returns {Date} The start of the day
 */
export const startOfDay = (date) => {
  if (!date) return new Date();
  
  try {
    const dateObj = date instanceof Date ? new Date(date) : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return new Date();
    }
    
    dateObj.setHours(0, 0, 0, 0);
    return dateObj;
  } catch (error) {
    console.error('Error getting start of day:', error);
    return new Date();
  }
};

/**
 * Get the end of a day (23:59:59.999)
 * @param {Date|string|number} date - The date
 * @returns {Date} The end of the day
 */
export const endOfDay = (date) => {
  if (!date) return new Date();
  
  try {
    const dateObj = date instanceof Date ? new Date(date) : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return new Date();
    }
    
    dateObj.setHours(23, 59, 59, 999);
    return dateObj;
  } catch (error) {
    console.error('Error getting end of day:', error);
    return new Date();
  }
};
