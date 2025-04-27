import React, { useState } from 'react';
import { FaEnvelope, FaGoogle, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// Standalone login component that doesn't use any context
const StandaloneLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const auth = getAuth();

  // Handle email/password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else {
        setError('Login failed. Please try again.');
      }
      
      setIsLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err) {
      console.error('Google login error:', err);
      
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Pop-up was blocked by your browser. Please allow pop-ups for this site.');
      } else {
        setError('Google sign-in failed. Please try again.');
      }
      
      setIsLoading(false);
    }
  };

  return (
    <div className="team-login-container" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#0f172a'
    }}>
      <div className="login-card" style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '40px'
      }}>
        <div className="login-header" style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#ffffff',
            margin: '0 0 8px 0'
          }}>Team Login</h1>
          <p style={{
            fontSize: '16px',
            color: '#94a3b8',
            margin: '0'
          }}>Access your FTFC team dashboard</p>
        </div>
        
        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '4px',
            padding: '12px',
            marginBottom: '20px',
            textAlign: 'center',
            color: '#ef4444'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleEmailLogin} style={{marginBottom: '24px'}}>
          <div style={{marginBottom: '28px'}}>
            <label htmlFor="email" style={{
              display: 'block',
              marginBottom: '8px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '500'
            }}>Email</label>
            <div style={{position: 'relative'}}>
              <FaEnvelope style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                fontSize: '16px'
              }} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 42px',
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontSize: '15px'
                }}
              />
            </div>
          </div>
          
          <div style={{marginBottom: '28px'}}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <label htmlFor="password" style={{
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '500'
              }}>Password</label>
              <Link to="/forgot-password" style={{
                fontSize: '14px',
                color: '#f59e0b',
                textDecoration: 'none'
              }}>
                Forgot password?
              </Link>
            </div>
            <div style={{position: 'relative'}}>
              <FaLock style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                fontSize: '16px'
              }} />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 42px',
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontSize: '15px'
                }}
              />
            </div>
          </div>
          
          <div>
            <button 
              type="submit" 
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#f59e0b',
                color: '#0f172a',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                marginTop: '8px'
              }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        
        <div style={{ margin: '32px 0', textAlign: 'center' }}>
          <p style={{ margin: '16px 0', color: '#94a3b8' }}>- OR -</p>
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              padding: '14px',
              backgroundColor: '#ffffff',
              color: '#333333',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <FaGoogle style={{ color: '#DB4437' }} />
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </div>
        
        <div style={{
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: '14px',
          marginTop: '24px'
        }}>
          <p>Are you a client? <Link to="/client-login" style={{
            color: '#f59e0b',
            textDecoration: 'none'
          }}>Client Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default StandaloneLogin;
