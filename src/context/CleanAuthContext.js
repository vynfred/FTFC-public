// CleanAuthContext.js - A clean implementation of authentication context

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    createOrUpdateUser, getCurrentUserData, logOut, signInWithEmail,
    signInWithGoogle, subscribeToAuthChanges, USER_ROLES
} from '../firebase-auth-clean';

// Create context
const AuthContext = createContext();

// Custom hook to use the context
export const useAuth = () => useContext(AuthContext);

// Export user roles
export { USER_ROLES };

// Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount using Firebase Auth
  useEffect(() => {
    console.log('AuthContext: Setting up auth state listener');

    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      console.log('AuthContext: Auth state changed:', firebaseUser ? 'User signed in' : 'No user');

      if (firebaseUser && firebaseUser.uid && firebaseUser.email) {
        console.log('AuthContext: User signed in:', firebaseUser.email);

        try {
          // Get user data from Firestore or create new user
          let userData = await getCurrentUserData(firebaseUser.uid);

          if (!userData) {
            // User doesn't exist in Firestore yet, create a new record
            userData = await createOrUpdateUser(firebaseUser);
          }

          // Set user state with combined data
          setUser({
            ...userData,
            id: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || userData.name,
            photoURL: firebaseUser.photoURL
          });

          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error getting user data:', error);

          // Even if there's an error with Firestore, we still want to authenticate the user
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email,
            role: USER_ROLES.TEAM,
            permissions: ['view_all', 'edit_all', 'admin'],
            photoURL: firebaseUser.photoURL || ''
          });

          setIsAuthenticated(true);
        }
      } else {
        // No user is signed in or invalid user object
        console.log('No valid user signed in');
        setIsAuthenticated(false);
        setUser(null);
      }

      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Login function with Firebase Authentication
  const login = async (credentials) => {
    setLoading(true);

    try {
      // Sign in with Firebase Authentication
      const user = await signInWithEmail(credentials.email, credentials.password);
      return user;
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
      console.log('AuthContext: Starting Google sign-in...');
      const result = await signInWithGoogle();
      // Make sure we return a valid object even if result is undefined
      return result || { user: null };
    } catch (error) {
      console.error('Google Sign-In error:', error);
      setLoading(false);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logOut();
      // Auth state will be updated by the onAuthStateChanged listener
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
