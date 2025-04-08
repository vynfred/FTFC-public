import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import styles from './DashboardWrapper.module.css';
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
      document.body.classList.add(styles.sidebarCollapsed);
    } else {
      document.body.classList.remove(styles.sidebarCollapsed);
    }

    return () => {
      document.body.classList.remove(styles.sidebarCollapsed);
    };
  }, [sidebarCollapsed]);

  return (
    <div className={`${styles.dashboardLayoutContainer} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
      {/* Top Navigation */}
      <PrivateTopNav
        toggleMobileMenu={toggleMobileMenu}
      />

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
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
        className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.active : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Content Area */}
      <div className={styles.dashboardContent}>
        <div className={styles.dashboardWrapper}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardWrapper;