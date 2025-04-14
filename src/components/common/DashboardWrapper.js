import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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

  // Get user info from AuthContext
  const { user } = useAuth();

  // Extract user info or use defaults
  const name = user?.name || user?.displayName || 'Team Member';
  const role = user?.role || 'Team';
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'TM';

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