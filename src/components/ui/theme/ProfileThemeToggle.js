import React from 'react';
import { FaMoon, FaSun, FaAdjust, FaDesktop, FaCheck } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';
import styles from './Theme.module.css';

/**
 * ProfileThemeToggle component for user profile
 * Allows users to switch between themes
 */
const ProfileThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  // Get theme icon based on current theme
  const getThemeIcon = (themeType) => {
    switch (themeType) {
      case 'light':
        return <FaSun className={styles.themeOptionIcon} />;
      case 'dark':
        return <FaMoon className={styles.themeOptionIcon} />;
      case 'high-contrast':
        return <FaAdjust className={styles.themeOptionIcon} />;
      case 'system':
        return <FaDesktop className={styles.themeOptionIcon} />;
      default:
        return <FaMoon className={styles.themeOptionIcon} />;
    }
  };

  // Get theme label based on current theme
  const getThemeLabel = (themeType) => {
    switch (themeType) {
      case 'light':
        return 'Light Mode';
      case 'dark':
        return 'Dark Mode';
      case 'high-contrast':
        return 'High Contrast';
      case 'system':
        return 'System Default';
      default:
        return 'Dark Mode';
    }
  };

  return (
    <div className={styles.profileThemeSettings}>
      <h4 className={styles.settingTitle}>Theme Settings</h4>
      <p className={styles.settingDescription}>
        Choose your preferred theme for the application
      </p>
      
      <div className={styles.themeOptions}>
        {['light', 'dark', 'high-contrast', 'system'].map((themeType) => (
          <div
            key={themeType}
            className={`${styles.themeCard} ${theme === themeType ? styles.activeTheme : ''}`}
            onClick={() => setTheme(themeType)}
          >
            <div className={styles.themeCardIcon}>
              {getThemeIcon(themeType)}
            </div>
            <div className={styles.themeCardContent}>
              <span className={styles.themeCardTitle}>{getThemeLabel(themeType)}</span>
            </div>
            {theme === themeType && (
              <div className={styles.themeCardCheck}>
                <FaCheck />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileThemeToggle;
