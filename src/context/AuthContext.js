import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase-config';
import * as authService from '../services/authService';

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

  // Ensure auth is defined
  const auth = getAuth();

  // Check for redirect result on mount
  useEffect(() => {
    console.log('AuthContext: Checking for redirect result');
    const checkRedirectResult = async () => {
      try {
        console.log('AuthContext: Calling getGoogleRedirectResult');
        const result = await authService.getGoogleRedirectResult();
        console.log('AuthContext: getGoogleRedirectResult returned:', result ? 'Result found' : 'No result');

        if (result && result.user) {
          console.log('AuthContext: Redirect result found, user signed in:', result.user.email);
          console.log('AuthContext: User UID:', result.user.uid);
          console.log('AuthContext: Setting googleSignInSuccess flag');

          // Set a flag to indicate successful sign-in
          localStorage.setItem('googleSignInSuccess', 'true');
          sessionStorage.setItem('googleSignInSuccess', 'true');

          // Get the intended role from localStorage
          const intendedRole = localStorage.getItem('intendedUserRole') || 'team';
          console.log('AuthContext: Intended role:', intendedRole);

          // Store the role in sessionStorage and localStorage
          localStorage.setItem('userRole', intendedRole);
          sessionStorage.setItem('userRole', intendedRole);

          // User is already handled by the auth state change listener
          // The redirect to the appropriate portal will happen there
        } else {
          console.log('AuthContext: No user found in redirect result');

          // Check if we're in the middle of a redirect flow
          const authState = localStorage.getItem('googleAuthState');
          const authTimestamp = localStorage.getItem('googleAuthTimestamp');

          if (authState && authTimestamp) {
            console.log('AuthContext: Found auth state, we might be in the middle of a redirect flow');
            const timestamp = parseInt(authTimestamp, 10);
            const now = Date.now();
            const fiveMinutesInMs = 5 * 60 * 1000;

            if (now - timestamp < fiveMinutesInMs) {
              console.log('AuthContext: Recent auth timestamp, redirect might be in progress');
            } else {
              console.log('AuthContext: Auth timestamp is old, clearing auth state');
              localStorage.removeItem('googleAuthState');
              localStorage.removeItem('googleAuthTimestamp');
            }
          }
        }
      } catch (error) {
        console.error('AuthContext: Error getting redirect result:', error);
      }
    };

    checkRedirectResult();
  }, []);

  // Check for existing session on mount using Firebase Auth
  useEffect(() => {
    console.log('AuthProvider: Initializing auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('AuthProvider: Auth state changed:', firebaseUser ? 'User signed in' : 'No user');
      if (firebaseUser) {
        console.log('AuthProvider: User details:', {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          providerId: firebaseUser.providerId,
          providerData: firebaseUser.providerData.map(p => p.providerId)
        });

        // Update user state
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        });
        setIsAuthenticated(true);
      } else {
        console.log('AuthProvider: No user signed in');
        setUser(null);
        setIsAuthenticated(false);
      }

      setLoading(false);
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  // Login function with Firebase Authentication
  const login = async (credentials, role) => {
    setLoading(true);

    try {
      // Sign in with Firebase Authentication
      const userCredential = await authService.signInWithEmail(
        credentials.email,
        credentials.password
      );

      // Firebase Auth successful, user state will be updated by the onAuthStateChanged listener
      return userCredential.user;
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

      // Use the signInWithGoogle method from our auth service
      await authService.signInWithGoogle();

      // Firebase Auth successful, user state will be updated by the onAuthStateChanged listener
      return { success: true };
    } catch (error) {
      console.error('Google Sign-In error:', error);
      setLoading(false);
      throw error;
    }
  };

  // Register function
  const register = async (userData, password) => {
    setLoading(true);

    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        password
      );

      // Add additional user data to Firestore
      const newUserData = {
        name: userData.name || 'User',
        email: userData.email,
        role: userData.role || USER_ROLES.TEAM,
        permissions: userData.permissions || ['view_all'],
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), newUserData);

      // Firebase Auth successful, user state will be updated by the onAuthStateChanged listener
      return userCredential.user;
    } catch (error) {
      console.error('Registration error:', error);
      setLoading(false);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.signOutUser();
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
        register,
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