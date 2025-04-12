/**
 * Validation Service
 * 
 * This service provides validation functions for forms in the application.
 * It includes validation for common fields like email, phone, and numbers,
 * as well as specific validation for lead forms.
 */

/**
 * Validate an email address
 * @param {string} email - Email address to validate
 * @returns {boolean} - Whether the email is valid
 */
export const validateEmail = (email) => {
  if (!email) return false;
  
  // RFC 5322 compliant email regex
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(String(email).toLowerCase());
};

/**
 * Validate a phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
export const validatePhone = (phone) => {
  if (!phone) return false;
  
  // Remove all non-numeric characters
  const numericPhone = phone.replace(/\D/g, '');
  
  // Check if the phone number has at least 10 digits
  return numericPhone.length >= 10;
};

/**
 * Validate a URL
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
export const validateUrl = (url) => {
  if (!url) return false;
  
  try {
    // Try to create a URL object
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validate a number
 * @param {string|number} value - Number to validate
 * @param {Object} options - Validation options
 * @param {number} options.min - Minimum value
 * @param {number} options.max - Maximum value
 * @returns {boolean} - Whether the number is valid
 */
export const validateNumber = (value, options = {}) => {
  if (value === null || value === undefined || value === '') return false;
  
  // Convert to number
  const num = Number(value);
  
  // Check if it's a valid number
  if (isNaN(num)) return false;
  
  // Check min value
  if (options.min !== undefined && num < options.min) return false;
  
  // Check max value
  if (options.max !== undefined && num > options.max) return false;
  
  return true;
};

/**
 * Validate a required field
 * @param {any} value - Value to validate
 * @returns {boolean} - Whether the value is not empty
 */
export const validateRequired = (value) => {
  if (value === null || value === undefined) return false;
  
  if (typeof value === 'string') {
    return value.trim() !== '';
  }
  
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  
  return true;
};

/**
 * Validate a zip code
 * @param {string} zipCode - Zip code to validate
 * @returns {boolean} - Whether the zip code is valid
 */
export const validateZipCode = (zipCode) => {
  if (!zipCode) return false;
  
  // US zip code regex (5 digits or 5+4 format)
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
};

/**
 * Format a phone number as user types
 * @param {string} value - Phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (value) => {
  if (!value) return '';
  
  // Remove all non-numeric characters
  const phone = value.replace(/\D/g, '');
  
  // Format based on length
  if (phone.length < 4) return phone;
  if (phone.length < 7) return `(${phone.slice(0,3)}) ${phone.slice(3)}`;
  return `(${phone.slice(0,3)}) ${phone.slice(3,6)}-${phone.slice(6,10)}`;
};

/**
 * Format a currency value
 * @param {string|number} value - Currency value to format
 * @returns {string} - Formatted currency value
 */
export const formatCurrency = (value) => {
  if (!value) return '';
  
  // Convert to number
  const num = Number(value);
  
  // Check if it's a valid number
  if (isNaN(num)) return value;
  
  // Format as currency
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};

/**
 * Validate a lead form
 * @param {Object} formData - Form data to validate
 * @returns {Object} - Validation errors
 */
export const validateLeadForm = (formData) => {
  const errors = {};
  
  // Personal Information
  if (!validateRequired(formData.firstName)) {
    errors.firstName = 'First name is required';
  }
  
  if (!validateRequired(formData.lastName)) {
    errors.lastName = 'Last name is required';
  }
  
  if (!validateRequired(formData.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!validateRequired(formData.phone)) {
    errors.phone = 'Phone number is required';
  } else if (!validatePhone(formData.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }
  
  if (!validateRequired(formData.role)) {
    errors.role = 'Role is required';
  }
  
  // Company Information
  if (!validateRequired(formData.companyName)) {
    errors.companyName = 'Company name is required';
  }
  
  if (!validateRequired(formData.industry)) {
    errors.industry = 'Industry is required';
  }
  
  if (formData.website && !validateUrl(formData.website)) {
    errors.website = 'Please enter a valid URL';
  }
  
  // Fundraising Information
  if (formData.currentARR && !validateNumber(formData.currentARR, { min: 0 })) {
    errors.currentARR = 'Current ARR must be a positive number';
  }
  
  if (formData.capitalRaised && !validateNumber(formData.capitalRaised, { min: 0 })) {
    errors.capitalRaised = 'Capital raised must be a positive number';
  }
  
  if (!validateRequired(formData.targetRaise)) {
    errors.targetRaise = 'Target raise is required';
  } else if (!validateNumber(formData.targetRaise, { min: 0 })) {
    errors.targetRaise = 'Target raise must be a positive number';
  }
  
  if (!validateRequired(formData.timeline)) {
    errors.timeline = 'Timeline is required';
  }
  
  return errors;
};

export default {
  validateEmail,
  validatePhone,
  validateUrl,
  validateNumber,
  validateRequired,
  validateZipCode,
  formatPhoneNumber,
  formatCurrency,
  validateLeadForm
};
