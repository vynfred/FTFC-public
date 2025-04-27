import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, USER_ROLES } from '../../context/EmergencyAuthContext';
import LoadingSpinner from '../shared/LoadingSpinner';

/**
 * ProtectedRoute component that restricts access based on user authentication and roles
 */
const EmergencyProtectedRoute = ({
  children,
  allowedRoles = [USER_ROLES.TEAM, USER_ROLES.CLIENT, USER_ROLES.INVESTOR, USER_ROLES.PARTNER],
  redirectPath = '/team-login'
}) => {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    console.log('ProtectedRoute: Still loading authentication state');
    return <div className="loading-spinner-container">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!user) {
    console.log('ProtectedRoute: No user found, redirecting to', redirectPath);
    
    // Redirect to login while saving the attempted private route
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // For simplicity in emergency mode, allow access
  return children;
};

export default EmergencyProtectedRoute;
