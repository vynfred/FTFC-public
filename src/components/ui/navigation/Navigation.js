import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import styles from './Navigation.module.css';

/**
 * Responsive Navigation component
 * 
 * @param {Object} props
 * @param {Array} props.items - Navigation items array [{path, name, icon}]
 * @param {string} props.orientation - Navigation orientation ('horizontal', 'vertical')
 * @param {boolean} props.responsive - Whether the navigation is responsive
 * @param {boolean} props.iconOnly - Whether to show only icons
 * @param {string} props.className - Additional CSS class names
 */
const Navigation = ({
  items = [],
  orientation = 'horizontal',
  responsive = true,
  iconOnly = false,
  className = '',
  ...rest
}) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  
  // Toggle mobile navigation
  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
  };
  
  // Close mobile navigation when a link is clicked
  const handleNavLinkClick = () => {
    if (mobileNavOpen) {
      setMobileNavOpen(false);
    }
  };
  
  // Determine CSS classes based on props
  const navClasses = [
    styles.nav,
    styles[orientation],
    responsive ? styles.responsive : '',
    iconOnly ? styles.iconOnly : '',
    className
  ].filter(Boolean).join(' ');
  
  // Determine mobile nav classes
  const mobileNavClasses = [
    styles.mobileNav,
    mobileNavOpen ? styles.open : ''
  ].filter(Boolean).join(' ');
  
  return (
    <nav className={navClasses} {...rest}>
      {/* Desktop Navigation */}
      <ul className={styles.navList}>
        {items.map((item, index) => (
          <li key={index} className={styles.navItem}>
            <NavLink
              to={item.path}
              className={({ isActive }) => 
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
              onClick={handleNavLinkClick}
              end={item.exact}
            >
              {item.icon && <span className={styles.navIcon}>{item.icon}</span>}
              <span className={styles.navText}>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      
      {/* Mobile Navigation Toggle */}
      {responsive && (
        <button
          className={styles.mobileToggle}
          onClick={toggleMobileNav}
          aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'}
        >
          {mobileNavOpen ? <FaTimes /> : <FaBars />}
        </button>
      )}
      
      {/* Mobile Navigation */}
      {responsive && (
        <div className={mobileNavClasses}>
          <ul className={styles.navList}>
            {items.map((item, index) => (
              <li key={index} className={styles.navItem}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                  }
                  onClick={handleNavLinkClick}
                  end={item.exact}
                >
                  {item.icon && <span className={styles.navIcon}>{item.icon}</span>}
                  <span className={styles.navText}>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
