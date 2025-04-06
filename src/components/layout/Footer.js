import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column">
              <div className="footer-logo">FTFC</div>
              <p className="footer-description">
                Financial Technology Funding Corporation provides innovative funding solutions for startups and small businesses.
              </p>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaFacebook />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaTwitter />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaLinkedin />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaInstagram />
                </a>
              </div>
            </div>
            
            <div className="footer-column">
              <h3 className="footer-heading">Quick Links</h3>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3 className="footer-heading">Services</h3>
              <ul className="footer-links">
                <li><Link to="/services#startup-funding">Startup Funding</Link></li>
                <li><Link to="/services#business-loans">Business Loans</Link></li>
                <li><Link to="/services#venture-capital">Venture Capital</Link></li>
                <li><Link to="/services#financial-consulting">Financial Consulting</Link></li>
                <li><Link to="/services#investment-strategies">Investment Strategies</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3 className="footer-heading">Contact Us</h3>
              <ul className="contact-info">
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>123 Finance Street, San Francisco, CA 94105</span>
                </li>
                <li>
                  <FaPhone className="contact-icon" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li>
                  <FaEnvelope className="contact-icon" />
                  <span>info@ftfc.com</span>
                </li>
              </ul>
              <Link to="/consultation" className="consultation-button">
                Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p className="copyright">
            &copy; {currentYear} Financial Technology Funding Corporation. All rights reserved.
          </p>
          <div className="legal-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .footer {
          background-color: #0f172a;
          color: #ffffff;
        }
        
        .footer-top {
          padding: 60px 0 40px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
        }
        
        .footer-logo {
          font-size: 24px;
          font-weight: 700;
          color: #f59e0b;
          margin-bottom: 16px;
        }
        
        .footer-description {
          color: #94a3b8;
          margin-bottom: 20px;
          line-height: 1.6;
        }
        
        .social-links {
          display: flex;
          gap: 16px;
        }
        
        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          color: #ffffff;
          font-size: 16px;
          transition: all 0.2s ease;
        }
        
        .social-link:hover {
          background-color: #f59e0b;
          color: #0f172a;
        }
        
        .footer-heading {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 10px;
        }
        
        .footer-heading::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 2px;
          background-color: #f59e0b;
        }
        
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .footer-links li {
          margin-bottom: 12px;
        }
        
        .footer-links a {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        
        .footer-links a:hover {
          color: #f59e0b;
        }
        
        .contact-info {
          list-style: none;
          padding: 0;
          margin: 0 0 20px 0;
        }
        
        .contact-info li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 16px;
          color: #94a3b8;
        }
        
        .contact-icon {
          margin-right: 12px;
          margin-top: 4px;
          color: #f59e0b;
        }
        
        .consultation-button {
          display: inline-block;
          background-color: #f59e0b;
          color: #0f172a;
          padding: 10px 20px;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 600;
          transition: background-color 0.2s ease;
        }
        
        .consultation-button:hover {
          background-color: #d97706;
        }
        
        .footer-bottom {
          padding: 20px 0;
        }
        
        .footer-bottom .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .copyright {
          color: #94a3b8;
          margin: 0;
        }
        
        .legal-links {
          display: flex;
          gap: 20px;
        }
        
        .legal-links a {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        
        .legal-links a:hover {
          color: #f59e0b;
        }
        
        @media (max-width: 768px) {
          .footer-bottom .container {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
