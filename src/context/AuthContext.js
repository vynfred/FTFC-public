import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase-config';

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
        const result = await auth.getRedirectResult();
        if (result && result.user) {
          console.log('AuthContext: Redirect result found, user signed in');

          // Get the intended role from localStorage
          const intendedRole = localStorage.getItem('intendedUserRole') || 'team';
          console.log('AuthContext: Intended role:', intendedRole);

          // Store the role in sessionStorage
          sessionStorage.setItem('userRole', intendedRole);

          // User is already handled by the auth state change listener
          // The redirect to the appropriate portal will happen there
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('AuthContext: Auth state changed:', firebaseUser ? 'User signed in' : 'No user');
      if (firebaseUser) {
        console.log('AuthContext: User details:', {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName
        });

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
          const authState = localStorage.getItem('googleAuthState');
          const authTimestamp = localStorage.getItem('googleAuthTimestamp');
          const googleSignInSuccess = localStorage.getItem('googleSignInSuccess') || sessionStorage.getItem('googleSignInSuccess');
          const userRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');

          console.log('Auth state check:', {
            authState: authState ? 'Found' : 'Not found',
            authTimestamp: authTimestamp ? 'Found' : 'Not found',
            googleSignInSuccess: googleSignInSuccess ? 'Found' : 'Not found',
            userRole
          });

          // Clean up auth state flags
          localStorage.removeItem('googleAuthState');
          localStorage.removeItem('googleAuthTimestamp');
          localStorage.removeItem('googleRedirectInProgress'); // Legacy
          localStorage.removeItem('googleRedirectTimestamp'); // Legacy

          // If we have a recent auth timestamp (within the last 5 minutes), this is likely a successful redirect
          if (authTimestamp) {
            const timestamp = parseInt(authTimestamp, 10);
            const now = Date.now();
            const fiveMinutesInMs = 5 * 60 * 1000;

            if (now - timestamp < fiveMinutesInMs) {
              console.log('Recent authentication detected, redirecting to appropriate portal');

              // Import navigate function
              const { navigate } = await import('react-router-dom');

              // Redirect based on user role
              switch (userRole) {
                case 'client':
                  window.location.href = '/client-portal';
                  break;
                case 'investor':
                  window.location.href = '/investor-portal';
                  break;
                case 'partner':
                  window.location.href = '/partner-portal';
                  break;
                case 'team':
                default:
                  window.location.href = '/dashboard';
                  break;
              }
            }
          }

          if (googleSignInSuccess) {
            // Clear the flag
            localStorage.removeItem('googleSignInSuccess');
            sessionStorage.removeItem('googleSignInSuccess');
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
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

      // Check if we have a stored client ID from a redirect
      const storedClientId = localStorage.getItem('googleClientId');
      if (storedClientId) {
        console.log('AuthContext: Using stored client ID from redirect');
        // Ensure the auth provider uses the same client ID
        auth.updateGoogleProviderClientId(storedClientId);
      }

      // Use the signInWithGoogle method from our auth service
      const result = await auth.signInWithGoogle();

      // Clear any stored client ID
      localStorage.removeItem('googleClientId');

      // Firebase Auth successful, user state will be updated by the onAuthStateChanged listener
      return result.user;
    } catch (error) {
      console.error('Google Sign-In error:', error);
      localStorage.removeItem('googleClientId');
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
      await signOut(auth);
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