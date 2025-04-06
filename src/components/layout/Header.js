import React, { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

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
    <header className="site-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">FTFC</Link>
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/services" className={location.pathname === '/services' ? 'active' : ''}>
                Services
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/blog" className={location.pathname === '/blog' ? 'active' : ''}>
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header-buttons">
          <Link to="/client-login" className="client-login-btn">
            Client Login
          </Link>
          <Link to="/consultation" className="consultation-btn">
            Free Consultation
          </Link>
        </div>
      </div>

      <style jsx>{`
        .site-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background-color: #0f172a;
          height: 60px;
          display: flex;
          align-items: center;
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .logo a {
          font-size: 24px;
          font-weight: 700;
          color: #f59e0b;
          text-decoration: none;
        }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          color: #ffffff;
          font-size: 24px;
          cursor: pointer;
        }

        .main-nav {
          display: flex;
          align-items: center;
        }

        .nav-list {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-item {
          margin: 0;
          padding: 0;
        }

        .nav-item a {
          color: #ffffff;
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
          padding: 20px 15px;
          display: block;
        }

        .nav-item a:hover, .nav-item a.active {
          color: #f59e0b;
          background-color: rgba(245, 158, 11, 0.1);
        }

        .header-buttons {
          display: flex;
          align-items: center;
        }

        .client-login-btn, .consultation-btn {
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .client-login-btn {
          background-color: transparent;
          border: 1px solid #f59e0b;
          color: #f59e0b;
          margin-right: 10px;
        }

        .client-login-btn:hover {
          background-color: rgba(245, 158, 11, 0.1);
        }

        .consultation-btn {
          background-color: #f59e0b;
          color: #0f172a;
          border: 1px solid #f59e0b;
        }

        .consultation-btn:hover {
          background-color: #d97706;
          border-color: #d97706;
        }

        @media (max-width: 768px) {
          .menu-toggle {
            display: block;
          }

          .main-nav {
            position: fixed;
            top: 60px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 60px);
            background-color: #0f172a;
            flex-direction: column;
            align-items: flex-start;
            padding: 20px;
            transition: left 0.3s ease;
            z-index: 999;
          }

          .main-nav.open {
            left: 0;
          }

          .nav-list {
            flex-direction: column;
            width: 100%;
          }

          .nav-item {
            width: 100%;
          }

          .nav-item a {
            padding: 15px 0;
            width: 100%;
          }

          .header-buttons {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
