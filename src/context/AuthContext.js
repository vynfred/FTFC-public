import React, { createContext, useContext, useState } from 'react';

// Create context
const AuthContext = createContext();

// Custom hook to use the context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to true for development
  const [user, setUser] = useState({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin'
  });
  const [loading, setLoading] = useState(false);

  const login = (credentials) => {
    // In a real app, this would make an API call
    console.log('Login with:', credentials);
    setIsAuthenticated(true);
    setUser({
      id: '1',
      name: 'John Doe',
      email: credentials.email || 'john@example.com',
      role: 'admin'
    });
  };

  const logout = () => {
    // In a real app, this would make an API call
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;