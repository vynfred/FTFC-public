/**
 * Sanitization Utility
 * 
 * This utility provides functions for sanitizing user-generated content
 * to prevent XSS attacks and other security vulnerabilities.
 */

import DOMPurify from 'dompurify';

/**
 * Configure DOMPurify with safe defaults
 */
const configureDOMPurify = () => {
  if (typeof window !== 'undefined') {
    // Allow only safe tags and attributes
    const purify = DOMPurify(window);
    
    // Configure allowed tags and attributes
    purify.setConfig({
      ALLOWED_TAGS: [
        'a', 'b', 'br', 'div', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'i', 'li', 'ol', 'p', 'span', 'strong', 'u', 'ul', 'blockquote',
        'code', 'pre', 'hr', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'class', 'style', 'src', 'alt', 'title',
        'width', 'height', 'id'
      ],
      ALLOW_DATA_ATTR: false,
      USE_PROFILES: { html: true },
      FORBID_TAGS: ['script', 'style', 'iframe', 'frame', 'object', 'embed', 'form', 'input', 'button'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout', 'onmousedown', 'onmouseup'],
      SAFE_FOR_TEMPLATES: true,
      SAFE_FOR_JQUERY: true
    });
    
    return purify;
  }
  
  return null;
};

// Initialize DOMPurify
const purify = configureDOMPurify();

/**
 * Sanitize HTML content
 * @param {string} html - The HTML content to sanitize
 * @returns {string} The sanitized HTML
 */
export const sanitizeHtml = (html) => {
  if (!html) return '';
  
  if (typeof window === 'undefined') {
    // Server-side rendering - return placeholder
    return html;
  }
  
  return purify.sanitize(html, {
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM: false
  });
};

/**
 * Sanitize a text string (remove HTML)
 * @param {string} text - The text to sanitize
 * @returns {string} The sanitized text
 */
export const sanitizeText = (text) => {
  if (!text) return '';
  
  if (typeof window === 'undefined') {
    // Server-side rendering - basic sanitization
    return text.replace(/<[^>]*>/g, '');
  }
  
  return purify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
};

/**
 * Sanitize an object's string properties
 * @param {Object} obj - The object to sanitize
 * @param {Array<string>} htmlFields - Fields that should allow safe HTML
 * @returns {Object} The sanitized object
 */
export const sanitizeObject = (obj, htmlFields = []) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = { ...obj };
  
  Object.keys(sanitized).forEach(key => {
    const value = sanitized[key];
    
    if (typeof value === 'string') {
      // Check if this field should allow HTML
      if (htmlFields.includes(key)) {
        sanitized[key] = sanitizeHtml(value);
      } else {
        sanitized[key] = sanitizeText(value);
      }
    } else if (typeof value === 'object' && value !== null) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeObject(value, htmlFields);
    }
  });
  
  return sanitized;
};

/**
 * Sanitize a URL
 * @param {string} url - The URL to sanitize
 * @returns {string} The sanitized URL
 */
export const sanitizeUrl = (url) => {
  if (!url) return '';
  
  // Only allow http:, https:, mailto:, and tel: protocols
  const sanitized = url.trim().toLowerCase();
  
  if (
    sanitized.startsWith('http://') ||
    sanitized.startsWith('https://') ||
    sanitized.startsWith('mailto:') ||
    sanitized.startsWith('tel:')
  ) {
    return sanitized;
  }
  
  // If no valid protocol, assume https
  if (sanitized.includes('.')) {
    return `https://${sanitized}`;
  }
  
  return '';
};

/**
 * Sanitize form input data
 * @param {Object} formData - The form data to sanitize
 * @param {Array<string>} htmlFields - Fields that should allow safe HTML
 * @returns {Object} The sanitized form data
 */
export const sanitizeFormData = (formData, htmlFields = []) => {
  return sanitizeObject(formData, htmlFields);
};
