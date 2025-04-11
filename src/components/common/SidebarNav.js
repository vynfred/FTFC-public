import React from 'react';
import { FaChartBar, FaChartLine, FaChevronLeft, FaChevronRight, FaCog, FaHandshake, FaHistory, FaUserFriends, FaUsers } from 'react-icons/fa';
import { Link, NavLink, useLocation } from 'react-router-dom';
import styles from './SidebarNav.module.css';

const SidebarNav = ({ collapsed, toggleSidebar }) => {
  const location = useLocation();
  const pathName = location.pathname;

  // User info (in real app, this would come from context/api)
  const userInfo = {
    name: 'John Doe',
    role: 'Admin',
    initials: 'J', // Just the first letter of the first name
    profileImage: null // In a real app, this would be the URL to the user's profile image
  };

  // Format the current date for "Last Updated"
  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const navItems = [
    {
      path: '/dashboard',
      name: 'Sales',
      icon: <FaChartBar />
    },
    {
      path: '/dashboard/marketing',
      name: 'Marketing',
      icon: <FaChartLine />
    },
    {
      path: '/dashboard/leads',
      name: 'Leads',
      icon: <FaUsers />
    },
    {
      path: '/dashboard/clients',
      name: 'Clients',
      icon: <FaUserFriends />
    },
    {
      path: '/dashboard/investors',
      name: 'Investors',
      icon: <FaUserFriends />
    },
    {
      path: '/dashboard/partners',
      name: 'Partners',
      icon: <FaHandshake />
    },
    {
      path: '/dashboard/calendar',
      name: 'Calendar',
      icon: <FaCalendarAlt />
    },
    {
      path: '/dashboard/company-settings',
      name: 'Company Settings',
      icon: <FaCog />
    }
  ];

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* Sidebar Toggle Button */}
      <div
        className={styles.toggle}
        onClick={toggleSidebar}
        role="button"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ?
          <FaChevronRight size={14} /> :
          <FaChevronLeft size={14} />
        }
      </div>

      {/* Navigation Menu */}
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.path} className={styles.navItem}>
              <NavLink
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.text}>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className={styles.footer}>
        <Link to="/dashboard/profile" className={styles.user}>
          <div className={styles.avatar}>
            {userInfo.profileImage ? (
              <img
                src={userInfo.profileImage}
                alt={userInfo.name}
                className={styles.profileImage}
              />
            ) : (
              <span className={styles.initials}>{userInfo.initials}</span>
            )}
          </div>
          {!collapsed && (
            <div className={styles.userInfo}>
              <div className={styles.userName}>{userInfo.name}</div>
              <div className={styles.userRole}>{userInfo.role}</div>
            </div>
          )}
        </Link>

        {!collapsed && (
          <div className={styles.lastUpdated}>
            <FaHistory className={styles.lastUpdatedIcon} />
            <span>Last Updated: {formattedDate}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarNav;