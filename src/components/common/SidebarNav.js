import React from 'react';
import {
    FaChartBar, FaChartLine, FaChevronLeft, FaChevronRight, FaCog, FaHandshake, FaHistory, FaUserFriends, FaUsers
} from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router-dom';
// CSS is now imported globally

const SidebarNav = ({ collapsed, toggleSidebar }) => {
  const location = useLocation();
  const pathName = location.pathname;

  // User info (in real app, this would come from context/api)
  const userInfo = {
    name: 'John Doe',
    role: 'Admin',
    initials: 'JD'
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
      name: 'Dashboard',
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
      path: '/dashboard/company-settings',
      name: 'Company Settings',
      icon: <FaCog />
    }
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Toggle Button */}
      <div
        className="sidebar-toggle"
        onClick={toggleSidebar}
        role="button"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ?
          <FaChevronRight size={16} /> :
          <FaChevronLeft size={16} />
        }
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) => isActive ? "active" : ""}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{userInfo.initials}</div>
          {!collapsed && (
            <div className="user-info">
              <div className="user-name">{userInfo.name}</div>
              <div className="user-role">{userInfo.role}</div>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="last-updated">
            <FaHistory className="last-updated-icon" />
            <span>Last Updated: {formattedDate}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarNav;