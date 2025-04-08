import React, { createContext, useContext, useEffect, useState } from 'react';

// Create context
const AuthContext = createContext();

// Custom hook to use the context
export const useAuth = () => useContext(AuthContext);

// User roles
export const USER_ROLES = {
  TEAM: 'team',
  CLIENT: 'client',
  INVESTOR: 'investor',
  PARTNER: 'partner'
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('ftfc_user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('ftfc_user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function with role-based access
  const login = (credentials, role) => {
    setLoading(true);

    // In a real app, this would make an API call to validate credentials
    // and return user data with the appropriate role

    // For demo purposes, we'll simulate different users based on role or email
    let userData;

    // For testing purposes, allow specific email addresses to map to roles
    if (credentials.email === 'team@ftfc.com' || credentials.email.includes('admin') || credentials.email.includes('john')) {
      role = USER_ROLES.TEAM;
    } else if (credentials.email === 'client@ftfc.com' || credentials.email.includes('client')) {
      role = USER_ROLES.CLIENT;
    } else if (credentials.email === 'investor@ftfc.com' || credentials.email.includes('investor')) {
      role = USER_ROLES.INVESTOR;
    } else if (credentials.email === 'partner@ftfc.com' || credentials.email.includes('partner')) {
      role = USER_ROLES.PARTNER;
    }

    // If no role is specified or detected, default to TEAM for testing
    if (!role) {
      role = USER_ROLES.TEAM;
    }

    switch (role) {
      case USER_ROLES.TEAM:
        userData = {
          id: 'team-1',
          name: 'Team Member',
          email: credentials.email || 'team@ftfc.com',
          role: USER_ROLES.TEAM,
          permissions: ['view_all', 'edit_all', 'admin']
        };
        break;

      case USER_ROLES.CLIENT:
        userData = {
          id: 'client-1',
          name: 'Client User',
          email: credentials.email || 'client@ftfc.com',
          role: USER_ROLES.CLIENT,
          companyId: 'company-1',
          permissions: ['view_own_data']
        };
        break;

      case USER_ROLES.INVESTOR:
        userData = {
          id: 'investor-1',
          name: 'Investor User',
          email: credentials.email || 'investor@ftfc.com',
          role: USER_ROLES.INVESTOR,
          investorId: 'investor-1',
          permissions: ['view_investments']
        };
        break;

      case USER_ROLES.PARTNER:
        userData = {
          id: 'partner-1',
          name: 'Partner User',
          email: credentials.email || 'partner@ftfc.com',
          role: USER_ROLES.PARTNER,
          partnerId: 'partner-1',
          permissions: ['view_referrals']
        };
        break;

      default:
        // Default to team role for any unrecognized role
        userData = {
          id: 'team-1',
          name: 'Team Member',
          email: credentials.email || 'team@ftfc.com',
          role: USER_ROLES.TEAM,
          permissions: ['view_all', 'edit_all', 'admin']
        };
    }

    // Store user in localStorage for session persistence
    localStorage.setItem('ftfc_user', JSON.stringify(userData));

    setUser(userData);
    setIsAuthenticated(true);
    setLoading(false);

    return userData;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('ftfc_user');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Check if user has a specific permission
  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        hasPermission,
        hasRole,
        USER_ROLES
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;