/**
 * This file defines a global FaSearch variable to prevent reference errors
 * It's a hack to fix the "FaSearch is not defined" error
 */

// Define FaSearch globally if it doesn't exist
if (typeof window !== 'undefined') {
  if (!window.FaSearch) {
    // Create a simple object with render method to mimic a React component
    window.FaSearch = function FaSearch(props) {
      // This is just a placeholder, it won't actually be used
      // The real component will be imported from react-icons/fa
      return null;
    };
  }
}

export default function initGlobalFaSearch() {
  // This function doesn't need to do anything, just importing it is enough
  console.log('Global FaSearch initialized');
  return null;
}
