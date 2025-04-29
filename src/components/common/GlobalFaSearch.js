import SearchIcon from '../icons/SearchIcon';

/**
 * This file defines a global FaSearch variable to prevent reference errors
 * It's a hack to fix the "FaSearch is not defined" error
 */

// Define FaSearch globally if it doesn't exist
if (typeof window !== 'undefined') {
  // Create a component that mimics the FaSearch API
  window.FaSearch = SearchIcon;
}

export default function initGlobalFaSearch() {
  // This function doesn't need to do anything, just importing it is enough
  console.log('Global FaSearch initialized with custom SearchIcon');
  return null;
}
