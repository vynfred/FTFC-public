// SimpleAuthContext.js - Clean implementation of authentication context

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { auth, signInWithEmail, signInWithGoogle, logOut } from '../firebase-auth';

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
        console.log('AuthContext: User signed in:', firebaseUser.email);
        
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
              console.error('Error saving user to Firestore:', firestoreError);
            }
            
            setUser({
              ...newUserData,
              id: firebaseUser.uid
            });
          }
          
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
  const login = async (credentials) => {
    setLoading(true);
    
    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmail(credentials.email, credentials.password);
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
      const result = await signInWithGoogle();
      return result;
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
