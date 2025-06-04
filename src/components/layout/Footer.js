import React from 'react';
import { FaEnvelope, FaInstagram, FaLinkedin, FaPhone } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Company Info Section */}
        <div className={styles.companyInfo}>
          <h2 className={styles.companyName}>FTFC</h2>
          <p className={styles.companyTagline}>Bridging together founder and funder.</p>

          <div className={styles.socialIcons}>
            {/* <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <FaXTwitter />
            </a> */}
            <a href="https://www.instagram.com/firsttimefoundercapital/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <FaInstagram />
            </a>
            <a href="https://www.linkedin.com/company/first-time-founder-capital/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Navigation Section */}
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Navigation</h3>
          <ul className={styles.footerLinks}>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/team">Team</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Contact</h3>
          <ul className={styles.contactList}>
            <li className={styles.contactItem}>
              <FaEnvelope className={styles.contactIcon} />
              <a href="mailto:info@ftfc.com">info@ftfc.com</a>
            </li>
            <li className={styles.contactItem}>
              <FaPhone className={styles.contactIcon} />
              <a href="tel:+1234567890">(617) 475-0705</a>
            </li>
          </ul>
        </div>

        {/* Login Section */}
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Login</h3>
          <ul className={styles.footerLinks}>
            <li><Link to="/client-login">Client Login</Link></li>
            <li><Link to="/investor-login">Investor Login</Link></li>
            <li><Link to="/partner-login">Partner Login</Link></li>
            <li><Link to="/team-login">Team Login</Link></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={styles.footerBottom}>
        <p className={styles.copyright}>&copy; {currentYear} Bridging together founder and funder. All rights reserved.</p>
        <div className={styles.legalLinks}>
          <Link to="/privacy">Privacy Policy</Link>
          <span className={styles.divider}>•</span>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
