import React from 'react';
import { FaEnvelope, FaFacebook, FaInstagram, FaLinkedin, FaPhone } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div className={styles.footerColumn}>
              <div className={styles.footerLogo}>FTFC</div>
              <p className={styles.footerDescription}>
                Financial Technology Funding Corporation provides innovative funding solutions for startups and small businesses.
              </p>
              <div className={styles.socialLinks}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <FaFacebook />
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <FaXTwitter />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <FaLinkedin />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <FaInstagram />
                </a>
              </div>
            </div>

            <div className={styles.footerColumn}>
              <h3 className={styles.footerHeading}>Quick Links</h3>
              <ul className={styles.footerLinks}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/team">Team</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/careers">Careers</Link></li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h3 className={styles.footerHeading}>Contact Us</h3>
              <ul className={styles.contactInfo}>
                <li>
                  <FaPhone className={styles.contactIcon} />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li>
                  <FaEnvelope className={styles.contactIcon} />
                  <span>info@ftfc.com</span>
                </li>
              </ul>
              <Link to="/consultation" className={styles.consultationButton}>
                Free Consultation
              </Link>
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
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.container}>
          <p className={styles.copyright}>
            &copy; {currentYear} Financial Technology Funding Corporation. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
