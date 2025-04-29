import React from 'react';
import PropTypes from 'prop-types';
import styles from './SearchBar.module.css';

/**
 * SearchBar - A reusable search input component with an inline SVG search icon
 * This component doesn't rely on external icon libraries
 * 
 * @param {Object} props
 * @param {string} props.placeholder - Placeholder text for the search input
 * @param {string} props.value - Current value of the search input
 * @param {Function} props.onChange - Function to call when the input value changes
 * @param {string} props.className - Additional CSS class for the container
 * @param {string} props.inputClassName - Additional CSS class for the input
 * @param {string} props.iconClassName - Additional CSS class for the icon
 */
const SearchBar = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  className = '',
  inputClassName = '',
  iconClassName = ''
}) => {
  return (
    <div className={`${styles.searchContainer} ${className}`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 512 512"
        width="1em"
        height="1em"
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        className={`${styles.searchIcon} ${iconClassName}`}
      >
        <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${styles.searchInput} ${inputClassName}`}
      />
    </div>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  iconClassName: PropTypes.string
};

export default SearchBar;
