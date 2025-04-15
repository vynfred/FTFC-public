import { FaSearch } from 'react-icons/fa';

/**
 * This file defines a global FaSearch variable to prevent reference errors
 * It's a hack to fix the "FaSearch is not defined" error
 */

// Define FaSearch globally if it doesn't exist
if (typeof window !== 'undefined') {
  window.FaSearch = FaSearch;
}

export default function initGlobalFaSearch() {
  // This function doesn't need to do anything, just importing it is enough
  console.log('Global FaSearch initialized');
  return null;
}
