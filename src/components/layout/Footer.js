import React from 'react';
import { FaEnvelope, FaFacebook, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaTwitter } from 'react-icons/fa';
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
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <FaTwitter />
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
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h3 className={styles.footerHeading}>Services</h3>
              <ul className={styles.footerLinks}>
                <li><Link to="/services#startup-funding">Startup Funding</Link></li>
                <li><Link to="/services#business-loans">Business Loans</Link></li>
                <li><Link to="/services#venture-capital">Venture Capital</Link></li>
                <li><Link to="/services#financial-consulting">Financial Consulting</Link></li>
                <li><Link to="/services#investment-strategies">Investment Strategies</Link></li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h3 className={styles.footerHeading}>Contact Us</h3>
              <ul className={styles.contactInfo}>
                <li>
                  <FaMapMarkerAlt className={styles.contactIcon} />
                  <span>123 Finance Street, San Francisco, CA 94105</span>
                </li>
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
