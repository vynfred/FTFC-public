import React from 'react';
import { FaSearch as OriginalFaSearch } from 'react-icons/fa';

/**
 * FaSearch component that wraps the original FaSearch from react-icons/fa
 * This ensures that any component importing FaSearch from our custom icons module
 * will get the proper icon.
 */
const FaSearch = (props) => {
  return <OriginalFaSearch {...props} />;
};

export default FaSearch;
