import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaHome, FaChartBar, FaProjectDiagram, FaBlog, FaCog } from 'react-icons/fa';

const DashboardLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="dashboard-app">
      {/* Top Header */}
      <header className="dashboard-header">
        <div className="logo">FTFC</div>
        <button 
          className="menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </button>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="user-info">
            <div className="user-avatar">JD</div>
            <div className="user-details">
              <h3>John Doe</h3>
              <p>Admin</p>
            </div>
          </div>
          <div className="menu-settings">
            <button className="settings-button">
              <FaCog /> Settings
            </button>
            <button className="logout-button">
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="dashboard-content">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav-bar">
        <NavLink to="/dashboard" end>
          <FaHome />
          <span>Home</span>
        </NavLink>
        <NavLink to="/dashboard/pipeline">
          <FaProjectDiagram />
          <span>Pipeline</span>
        </NavLink>
        <NavLink to="/dashboard/reports">
          <FaChartBar />
          <span>Reports</span>
        </NavLink>
        <NavLink to="/dashboard/blog">
          <FaBlog />
          <span>Blog</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default DashboardLayout; 