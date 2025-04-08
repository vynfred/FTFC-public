import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, USER_ROLES } from '../../context/AuthContext';
import LoadingSpinner from '../shared/LoadingSpinner';

/**
 * ProtectedRoute component that restricts access based on user authentication and roles
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string[]} [props.allowedRoles] - Array of roles allowed to access this route
 * @param {string} [props.redirectPath] - Path to redirect to if unauthorized
 */
const ProtectedRoute = ({
  children,
  allowedRoles = [USER_ROLES.TEAM, USER_ROLES.CLIENT, USER_ROLES.INVESTOR, USER_ROLES.PARTNER],
  redirectPath = '/team-login'
}) => {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, redirect to login
  if (!user) {
    // Redirect to login while saving the attempted private route
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Check if user has an allowed role
  const hasAllowedRole = allowedRoles.some(role => hasRole(role));

  if (!hasAllowedRole) {
    // Determine appropriate redirect based on user's role
    let roleBasedRedirect = '/team-login';

    if (user.role === USER_ROLES.CLIENT) {
      roleBasedRedirect = '/client-portal';
    } else if (user.role === USER_ROLES.INVESTOR) {
      roleBasedRedirect = '/investor-portal';
    } else if (user.role === USER_ROLES.PARTNER) {
      roleBasedRedirect = '/partner-portal';
    }

    return <Navigate to={roleBasedRedirect} replace />;
  }

  return children;
};

export default ProtectedRoute;