import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import PrivateTopNav from './PrivateTopNav';
import SidebarNav from './SidebarNav';

const DashboardWrapper = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // Handle window resize to automatically collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on initial load

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Get user info from localStorage or use defaults
  const getUserInfo = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      return {
        name: user.name || 'John Doe',
        role: user.role || 'Admin',
        initials: user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'JD'
      };
    } catch (error) {
      console.error('Error parsing user data:', error);
      return { name: 'John Doe', role: 'Admin', initials: 'JD' };
    }
  };

  const { name, role, initials } = getUserInfo();

  // Add necessary class to body to enable style targeting
  useEffect(() => {
    // Toggle sidebar collapsed class on body for global styling
    if (sidebarCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }

    return () => {
      document.body.classList.remove('sidebar-collapsed');
    };
  }, [sidebarCollapsed]);

  return (
    <div className={`dashboard-layout-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Top Navigation */}
      <PrivateTopNav
        toggleMobileMenu={toggleMobileMenu}
      />

      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <SidebarNav
          collapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
          userInfo={{
            name,
            role,
            initials
          }}
        />
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Content Area */}
      <div className="dashboard-content">
        <div className="dashboard-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardWrapper;