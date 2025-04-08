import React from 'react';
import { FaEnvelope, FaFacebook, FaInstagram, FaLinkedin, FaPhone } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerTop}>
          <div className={styles.footerLogo}>
            <h2>FTFC</h2>
            <p>Funding The Future Capital</p>
          </div>
          <div className={styles.footerSocial}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaXTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
          </div>
        </div>
        <div className={styles.footerDivider}></div>
        <div className={styles.footerMain}>
          <div className={styles.footerGrid}>
            <div className={styles.footerColumn}>
              <h3 className={styles.footerHeading}>Navigation</h3>
              <ul className={styles.footerLinks}>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/team">Team</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h3 className={styles.footerHeading}>Contact</h3>
              <ul className={styles.footerContactList}>
                <li>
                  <FaEnvelope className={styles.footerContactIcon} />
                  <a href="mailto:info@ftfc.com">info@ftfc.com</a>
                </li>
                <li>
                  <FaPhone className={styles.footerContactIcon} />
                  <a href="tel:+1234567890">(123) 456-7890</a>
                </li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h3 className={styles.footerHeading}>Login</h3>
              <ul className={styles.footerLinks}>
                <li><Link to="/client-login">Client Login</Link></li>
                <li><Link to="/investor-login">Investor Login</Link></li>
                <li><Link to="/partner-login">Partner Login</Link></li>
                <li><Link to="/team-login">Team Login</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; {currentYear} Funding The Future Capital. All rights reserved.</p>
          <div className={styles.footerBottomLinks}>
            <Link to="/privacy">Privacy Policy</Link>
            <span className={styles.footerDot}>&middot;</span>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
