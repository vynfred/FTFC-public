import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import SidebarNav from './SidebarNav';
import PrivateTopNav from './PrivateTopNav';

// Standalone DashboardWrapper that doesn't use any context
const StandaloneDashboardWrapper = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Get user info directly from Firebase Auth
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

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

  // Extract user info or use defaults
  const name = user?.displayName || 'Team Member';
  const role = 'Team';
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'TM';

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

  if (loading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#0f172a',
      color: 'white',
      fontSize: '18px'
    }}>
      Loading...
    </div>;
  }

  return (
    <div className={`dashboard-layout-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`} style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f1f5f9'
    }}>
      {/* Top Navigation */}
      <PrivateTopNav
        toggleMobileMenu={toggleMobileMenu}
      />

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Sidebar */}
        <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`} style={{
          width: sidebarCollapsed ? '80px' : '280px',
          backgroundColor: '#1e293b',
          transition: 'width 0.3s ease',
          position: 'fixed',
          top: '60px',
          bottom: 0,
          left: 0,
          zIndex: 10
        }}>
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
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 5,
            display: isMobileMenuOpen ? 'block' : 'none'
          }}
        />

        {/* Content Area */}
        <div className="dashboard-content" style={{
          marginLeft: sidebarCollapsed ? '80px' : '280px',
          padding: '20px',
          flex: 1,
          transition: 'margin-left 0.3s ease'
        }}>
          <div className="dashboard-wrapper" style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '20px'
          }}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandaloneDashboardWrapper;
