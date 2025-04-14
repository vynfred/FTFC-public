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
          const redirectInProgress = localStorage.getItem('googleRedirectInProgress');
          const redirectTimestamp = localStorage.getItem('googleRedirectTimestamp');
          const googleSignInSuccess = sessionStorage.getItem('googleSignInSuccess');

          if (redirectInProgress) {
            console.log('Detected redirect in progress, clearing flags');
            // Clear the flags
            localStorage.removeItem('googleRedirectInProgress');
            localStorage.removeItem('googleRedirectTimestamp');

            // If the redirect was recent (within the last 5 minutes), this is likely a successful redirect
            if (redirectTimestamp) {
              const timestamp = parseInt(redirectTimestamp, 10);
              const now = Date.now();
              const fiveMinutesInMs = 5 * 60 * 1000;

              if (now - timestamp < fiveMinutesInMs) {
                console.log('Recent redirect detected, likely successful');
              }
            }
          }

          if (googleSignInSuccess) {
            // Clear the flag
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
      // Use the signInWithGoogle method from our auth service
      const result = await auth.signInWithGoogle();

      // Firebase Auth successful, user state will be updated by the onAuthStateChanged listener
      return result.user;
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