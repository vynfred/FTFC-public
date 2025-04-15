import React from 'react';

/**
 * A simple search component that doesn't use FaSearch
 * This is a workaround for the FaSearch reference error
 */
const SimpleSearch = ({ 
  placeholder = 'Search...', 
  value = '', 
  onChange, 
  className = '' 
}) => {
  return (
    <div className={`simple-search-container ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="simple-search-input"
      />
    </div>
  );
};

export default SimpleSearch;
