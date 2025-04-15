import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

/**
 * A reusable search bar component with FaSearch icon
 * 
 * @param {Object} props
 * @param {string} props.placeholder - Placeholder text for the search input
 * @param {string} props.initialValue - Initial value for the search input
 * @param {Function} props.onSearch - Function to call when search is submitted
 * @param {Function} props.onChange - Function to call when search value changes
 * @param {string} props.className - Additional CSS class names
 */
const SearchBar = ({
  placeholder = 'Search...',
  initialValue = '',
  onSearch,
  onChange,
  className = '',
  ...rest
}) => {
  const [searchValue, setSearchValue] = useState(initialValue);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  return (
    <form 
      className={`search-bar-container ${className}`} 
      onSubmit={handleSubmit}
    >
      <div className="search-icon-wrapper">
        <FaSearch className="search-icon" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
        className="search-input"
        {...rest}
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
