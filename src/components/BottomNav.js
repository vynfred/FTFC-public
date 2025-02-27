import React from 'react';
import { Link } from 'react-router-dom';
import { FaXTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa6';
import '../styles/styles.css';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <div className="nav-content">
        <ul>
          <li className="bottom-nav-logo">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/ftfc-start.firebasestorage.app/o/FTFC%20logo.png?alt=media&token=a850a631-453f-4cc8-b9a2-695c199beffe"
              alt="FTFC Logo"
              className="footer-logo"
            />
          </li>
          <li className="bottom-nav-col">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/testimonials">Testimonials</Link>
            <Link to="/services">Services</Link>
          </li>
          <li className="bottom-nav-col">
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/team-login">Team Login</Link>
          </li>
        </ul>
        
        <div className="social-links">
          <a href="https://twitter.com/ftfcapital" target="_blank" rel="noopener noreferrer">
            <FaXTwitter />
          </a>
          <a href="https://linkedin.com/company/ftfcapital" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
          <a href="https://instagram.com/ftfcapital" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav; 