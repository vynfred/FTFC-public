import React, { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className={styles.siteHeader}>
      <div className={styles.headerContainer}>
        <div className={styles.logo}>
          <Link to="/">FTFC</Link>
        </div>

        <button className={styles.menuToggle} onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav className={`${styles.mainNav} ${isMenuOpen ? styles.open : ''}`}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link to="/about" className={location.pathname === '/about' ? styles.active : ''}>
                About
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/team" className={location.pathname === '/team' ? styles.active : ''}>
                Team
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/services" className={location.pathname === '/services' ? styles.active : ''}>
                Services
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/contact" className={location.pathname === '/contact' ? styles.active : ''}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className={styles.headerButtons}>
          <Link to="/client-login" className={styles.clientLoginBtn}>
            Client Login
          </Link>
          <Link to="/consultation" className={styles.consultationBtn}>
            Free Consultation
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
