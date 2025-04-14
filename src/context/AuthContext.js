import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

          if (userDoc.exists()) {
            // User exists in Firestore, use that data
            const userData = userDoc.data();
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
            const newUserData = {
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email,
              role: USER_ROLES.TEAM,
              permissions: ['view_all', 'edit_all', 'admin'],
              createdAt: new Date().toISOString(),
              photoURL: firebaseUser.photoURL || ''
            };

            // Save to Firestore
            await setDoc(doc(db, 'users', firebaseUser.uid), newUserData);

            setUser({
              ...newUserData,
              id: firebaseUser.uid
            });
          }

          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error getting user data:', error);
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        // No user is signed in
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
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

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