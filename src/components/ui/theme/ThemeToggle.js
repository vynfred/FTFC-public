import React, { useEffect, useRef, useState } from 'react';
import { FaAdjust, FaCheck, FaDesktop, FaMoon, FaSun } from 'react-icons/fa';
import styles from './Theme.module.css';

/**
 * ThemeToggle component for switching between themes
 *
 * @param {Object} props
 * @param {string} props.className - Additional CSS class names
 */
const ThemeToggle = ({ className = '' }) => {
  const [theme, setTheme] = useState('dark');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Use system preference
      setTheme('system');
      // Remove data-theme attribute to use system preference
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (theme === 'system') {
        // If using system preference, update the UI when it changes
        setTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Handle theme change
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    setIsOpen(false);
  };

  // Handle system preference
  const handleSystemPreference = () => {
    localStorage.removeItem('theme');
    setTheme('system');
    document.documentElement.removeAttribute('data-theme');
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get theme icon
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <FaSun className={styles.themeIcon} />;
      case 'dark':
        return <FaMoon className={styles.themeIcon} />;
      case 'high-contrast':
        return <FaAdjust className={styles.themeIcon} />;
      default:
        return <FaDesktop className={styles.themeIcon} />;
    }
  };

  // Get theme label
  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'high-contrast':
        return 'High Contrast';
      default:
        return 'System';
    }
  };

  return (
    <div className={`${styles.themeDropdown} ${className}`} ref={dropdownRef}>
      <div
        className={styles.themeToggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle theme"
        role="button"
      >
        {getThemeIcon()}
        <span className={styles.themeLabel}>{getThemeLabel()}</span>
      </div>

      {isOpen && (
        <div className={styles.themeMenu}>
          <div
            className={`${styles.themeOption} ${theme === 'light' ? styles.active : ''}`}
            onClick={() => handleThemeChange('light')}
          >
            <FaSun className={styles.themeOptionIcon} />
            <span className={styles.themeOptionLabel}>Light</span>
            {theme === 'light' && <FaCheck className={styles.themeOptionIcon} />}
          </div>

          <div
            className={`${styles.themeOption} ${theme === 'dark' ? styles.active : ''}`}
            onClick={() => handleThemeChange('dark')}
          >
            <FaMoon className={styles.themeOptionIcon} />
            <span className={styles.themeOptionLabel}>Dark</span>
            {theme === 'dark' && <FaCheck className={styles.themeOptionIcon} />}
          </div>

          <div
            className={`${styles.themeOption} ${theme === 'high-contrast' ? styles.active : ''}`}
            onClick={() => handleThemeChange('high-contrast')}
          >
            <FaAdjust className={styles.themeOptionIcon} />
            <span className={styles.themeOptionLabel}>High Contrast</span>
            {theme === 'high-contrast' && <FaCheck className={styles.themeOptionIcon} />}
          </div>

          <div
            className={`${styles.themeOption} ${theme === 'system' ? styles.active : ''}`}
            onClick={handleSystemPreference}
          >
            <FaDesktop className={styles.themeOptionIcon} />
            <span className={styles.themeOptionLabel}>System</span>
            {theme === 'system' && <FaCheck className={styles.themeOptionIcon} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
