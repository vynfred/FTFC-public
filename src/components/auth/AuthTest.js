import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase-config';

const AuthTest = () => {
  const [email, setEmail] = useState('hellovynfred@gmail.com');
  const [password, setPassword] = useState('Test123');
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authState, setAuthState] = useState('');

  // Using the auth service from firebase-config.js

  useEffect(() => {
    // Check current auth state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setAuthState(JSON.stringify(user, null, 2));
      } else {
        setUser(null);
        setAuthState('No user signed in');
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      setUser(userCredential.user);
      setAuthState(JSON.stringify(userCredential.user, null, 2));
      console.log('Sign in successful:', userCredential.user);
    } catch (error) {
      setError(`Error: ${error.code} - ${error.message}`);
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);

    try {
      await auth.signOut();
      setUser(null);
      setAuthState('User signed out');
      console.log('Sign out successful');
    } catch (error) {
      setError(`Error: ${error.code} - ${error.message}`);
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Firebase Authentication Test</h1>

      <div style={{ marginBottom: '20px' }}>
        <h2>Current Auth State:</h2>
        <pre style={{
          background: '#f5f5f5',
          padding: '10px',
          borderRadius: '5px',
          overflow: 'auto',
          maxHeight: '300px'
        }}>
          {authState}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Sign In with Email/Password</h2>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button
          onClick={handleSignIn}
          disabled={loading}
          style={{
            padding: '10px 15px',
            background: '#4285F4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        <button
          onClick={handleSignOut}
          disabled={loading || !user}
          style={{
            padding: '10px 15px',
            background: '#DB4437',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>

      {error && (
        <div style={{
          color: 'red',
          background: '#ffebee',
          padding: '10px',
          borderRadius: '4px',
          marginTop: '20px'
        }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <h2>Firebase Configuration</h2>
        <pre style={{
          background: '#f5f5f5',
          padding: '10px',
          borderRadius: '5px',
          overflow: 'auto'
        }}>
          {JSON.stringify({
            apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
            authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
            storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.REACT_APP_FIREBASE_APP_ID
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default AuthTest;
