import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

/**
 * Standalone ProtectedRoute component that doesn't use any context
 */
const StandaloneProtectedRoute = ({ children, redirectPath = '/team-login' }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // Show loading while checking authentication
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

  // If not authenticated, redirect to login
  if (!user) {
    console.log('ProtectedRoute: No user found, redirecting to', redirectPath);
    
    // Redirect to login while saving the attempted private route
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // User is authenticated, render children
  return children;
};

export default StandaloneProtectedRoute;
