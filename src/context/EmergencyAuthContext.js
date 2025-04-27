// EmergencyAuthContext.js - A minimal implementation to fix destructuring errors

import React, { createContext, useContext, useState } from 'react';

// Create context
const AuthContext = createContext();

// Custom hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a default object to prevent destructuring errors
    return {
      isAuthenticated: false,
      user: null,
      loading: false,
      login: () => {},
      logout: () => {},
      googleSignIn: () => {},
      hasPermission: () => false,
      hasRole: () => false,
      USER_ROLES: {
        TEAM: 'team',
        CLIENT: 'client',
        INVESTOR: 'investor',
        PARTNER: 'partner'
      }
    };
  }
  return context;
};

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
  const [loading, setLoading] = useState(false);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    try {
      console.log('Login attempt with:', credentials.email);
      // Simulate successful login
      setUser({
        id: '123456',
        name: 'Test User',
        email: credentials.email,
        role: USER_ROLES.TEAM,
        permissions: ['view_all', 'edit_all', 'admin'],
        photoURL: ''
      });
      setIsAuthenticated(true);
      setLoading(false);
      return { user: { email: credentials.email } };
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      throw error;
    }
  };
  
  // Google Sign-In function
  const googleSignIn = async () => {
    setLoading(true);
    try {
      console.log('Google sign-in attempt');
      // Simulate successful Google sign-in
      setUser({
        id: '123456',
        name: 'Google User',
        email: 'google.user@example.com',
        role: USER_ROLES.TEAM,
        permissions: ['view_all', 'edit_all', 'admin'],
        photoURL: ''
      });
      setIsAuthenticated(true);
      setLoading(false);
      return { user: { email: 'google.user@example.com' } };
    } catch (error) {
      console.error('Google Sign-In error:', error);
      setLoading(false);
      throw error;
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
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
        googleSignIn,
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
