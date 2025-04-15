import React from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from './Form.module.css';

/**
 * SearchBar component for searching content
 *
 * @param {Object} props
 * @param {string} props.placeholder - Placeholder text for the search input
 * @param {string} props.value - Current search value
 * @param {Function} props.onChange - Function to call when search value changes
 * @param {string} props.className - Additional CSS class names
 */
const SearchBar = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  className = '',
  ...rest
}) => {
  return (
    <div className={`${styles.searchContainer} ${className}`}>
      <div className={styles.searchIconWrapper}>
        <FaSearch className={styles.searchIcon} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={styles.searchInput}
        {...rest}
      />
    </div>
  );
};

export default SearchBar;
