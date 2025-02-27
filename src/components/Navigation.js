import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { path: '/', text: 'Home' },
    { path: '/about', text: 'About' },
    { path: '/blog', text: 'Blog' },
    { path: '/services', text: 'Services' },
    { path: '/testimonials', text: 'Testimonials' },
    { path: '/contact', text: 'Contact' },
    { path: '/consultation', text: 'Free Consultation' }
  ];

  return (
    <nav className="top-nav">
      <Link to="/" className="brand-logo">
        FTFC
      </Link>
      
      <button 
        className="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
        <li><Link to="/about" onClick={() => setIsOpen(false)}>About</Link></li>
        <li><Link to="/blog" onClick={() => setIsOpen(false)}>Blog</Link></li>
        <li><Link to="/testimonials" onClick={() => setIsOpen(false)}>Testimonials</Link></li>
        <li><Link to="/services" onClick={() => setIsOpen(false)}>Services</Link></li>
        <li><Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation; 