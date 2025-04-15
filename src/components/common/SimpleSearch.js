import React from 'react';
import SearchIcon from '../icons/SearchIcon';

/**
 * A simple search component with SearchIcon
 * Enhanced with our stable SearchIcon component
 */
const SimpleSearch = ({ 
  placeholder = 'Search...', 
  value = '', 
  onChange, 
  className = '' 
}) => {
  return (
    <div className={`simple-search-container ${className}`}>
      <div className="simple-search-icon-wrapper">
        <SearchIcon className="simple-search-icon" />
      </div>
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
