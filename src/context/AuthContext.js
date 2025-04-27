import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
    console.log('AuthContext: Setting up auth state listener');
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('AuthContext: Auth state changed:', firebaseUser ? 'User signed in' : 'No user');
      if (firebaseUser) {
        console.log('AuthContext: User details:', {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          providerId: firebaseUser.providerId,
          providerData: firebaseUser.providerData.map(p => p.providerId)
        });

        // Log authentication method
        console.log('AuthContext: Authentication method:',
          firebaseUser.providerData.some(p => p.providerId === 'google.com') ? 'Google' : 'Email/Password');

        // Check if this is a Google sign-in
        const isGoogleSignIn = firebaseUser.providerData.some(p => p.providerId === 'google.com');
        if (isGoogleSignIn) {
          console.log('AuthContext: This is a Google sign-in');
          localStorage.setItem('googleSignInSuccess', 'true');
          sessionStorage.setItem('googleSignInSuccess', 'true');
        }

        // Store auth state in localStorage for debugging
        localStorage.setItem('authState', JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          timestamp: new Date().toISOString()
        }));
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

          if (userDoc.exists()) {
            // User exists in Firestore, use that data
            const userData = userDoc.data();
            console.log('User found in Firestore:', userData);
            setUser({
              ...userData,
              id: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || userData.name,
              photoURL: firebaseUser.photoURL
            });
          } else {
            // User doesn't exist in Firestore yet, create a new record
            // Default to team role for new users
            console.log('Creating new user in Firestore');
            const newUserData = {
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email,
              role: USER_ROLES.TEAM,
              permissions: ['view_all', 'edit_all', 'admin'],
              createdAt: new Date().toISOString(),
              photoURL: firebaseUser.photoURL || ''
            };

            try {
              // Save to Firestore
              await setDoc(doc(db, 'users', firebaseUser.uid), newUserData);
              console.log('User saved to Firestore');
            } catch (firestoreError) {
              // If Firestore save fails (e.g., due to ad blockers), still proceed with authentication
              console.error('Error saving user to Firestore:', firestoreError);
              console.log('Continuing with authentication despite Firestore error');
            }

            setUser({
              ...newUserData,
              id: firebaseUser.uid
            });
          }

          setIsAuthenticated(true);

          // Check if we need to redirect after successful authentication
          const googleSignInSuccess = localStorage.getItem('googleSignInSuccess') || sessionStorage.getItem('googleSignInSuccess');
          const userRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole') || 'team';
          const intendedRole = localStorage.getItem('intendedUserRole') || userRole;

          // Check if this is a Google sign-in based on provider data
          const isGoogleSignIn = firebaseUser.providerData.some(p => p.providerId === 'google.com');

          console.log('Auth state check:', {
            googleSignInSuccess: googleSignInSuccess ? 'Found' : 'Not found',
            userRole,
            intendedRole,
            isGoogleSignIn
          });

          // Clean up any legacy flags
          localStorage.removeItem('googleRedirectInProgress'); // Legacy
          localStorage.removeItem('googleRedirectTimestamp'); // Legacy

          // If this is a successful sign-in, redirect to the appropriate portal
          // We check both the flag and the provider data to be sure
          if (googleSignInSuccess === 'true' || isGoogleSignIn) {
            console.log('Successful authentication detected, redirecting to appropriate portal');

            // Use the intended role from localStorage if available, otherwise use the stored role
            const roleToUse = intendedRole || userRole;
            console.log('Using role for redirect:', roleToUse);

            // Redirect based on user role
            switch (roleToUse) {
              case 'client':
                console.log('Redirecting to client portal');
                window.location.href = '/client-portal';
                break;
              case 'investor':
                console.log('Redirecting to investor portal');
                window.location.href = '/investor-portal';
                break;
              case 'partner':
                console.log('Redirecting to partner portal');
                window.location.href = '/partner-portal';
                break;
              case 'team':
              default:
                console.log('Redirecting to dashboard');
                window.location.href = '/dashboard';
                break;
            }

            // Clear the flags
            localStorage.removeItem('googleSignInSuccess');
            sessionStorage.removeItem('googleSignInSuccess');
            localStorage.removeItem('intendedUserRole');
          } else {
            console.log('No redirect needed or not a Google sign-in');
          }
        } catch (error) {
          console.error('Error getting user data:', error);
          // Even if there's an error with Firestore, we still want to authenticate the user
          // since they've successfully signed in with Firebase Auth
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
        // No user is signed in
        console.log('No user signed in');
        setIsAuthenticated(false);
        setUser(null);
      }

      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
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