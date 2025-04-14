/**
 * Utility functions for generating and validating tokens
 */

/**
 * Generate a random token for verification purposes
 * @returns {string} A random token
 */
export const generateToken = () => {
  // Generate a random string of 32 characters
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  
  for (let i = 0; i < 32; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return token;
};

/**
 * Validate a token against an expiry date
 * @param {string} token - The token to validate
 * @param {Date} expiryDate - The expiry date of the token
 * @returns {boolean} Whether the token is valid
 */
export const validateToken = (token, expiryDate) => {
  if (!token || !expiryDate) {
    return false;
  }
  
  // Check if the token has expired
  const now = new Date();
  const expiry = new Date(expiryDate);
  
  return now < expiry;
};
