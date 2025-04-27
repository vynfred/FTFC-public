import React, { useState } from 'react';
import { FaEnvelope, FaGoogle, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/EmergencyAuthContext';

const ProperTeamLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login, googleSignIn } = useAuth();

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
      await login({ email, password });
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
      const result = await googleSignIn();
      console.log('Google sign-in result:', result);

      // Check if we got a valid user back
      if (!result || !result.user) {
        console.warn('No user returned from Google sign-in');
        setError('Google sign-in failed. Please try again.');
        setIsLoading(false);
        return;
      }

      // Auth state change listener will handle redirect
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
    <div className="team-login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Team Login</h1>
          <p className="login-subtitle">Access your FTFC team dashboard</p>
        </div>

        {error && (
          <div className="error-message general-error">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={isLoading}
                className={error && !email ? 'error' : ''}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="label-with-link">
              <label htmlFor="password">Password</label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
                className={error && !password ? 'error' : ''}
              />
            </div>
          </div>

          <div className="form-group">
            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
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

        <div className="login-footer">
          <p>Are you a client? <Link to="/client-login" className="client-login-link">Client Login</Link></p>
        </div>
      </div>

      <style jsx>{`
        .team-login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          background-color: #0f172a;
        }

        .login-card {
          width: 100%;
          max-width: 480px;
          background-color: #1e293b;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 40px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-title {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 8px 0;
        }

        .login-subtitle {
          font-size: 16px;
          color: #94a3b8;
          margin: 0;
        }

        .login-form {
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 28px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
        }

        .label-with-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .forgot-password {
          font-size: 14px;
          color: #f59e0b;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .forgot-password:hover {
          color: #d97706;
          text-decoration: underline;
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 16px;
        }

        input {
          width: 100%;
          padding: 14px 14px 14px 42px;
          background-color: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: #ffffff;
          font-size: 15px;
          transition: border-color 0.2s ease;
          margin-bottom: 4px;
        }

        input:focus {
          outline: none;
          border-color: #f59e0b;
        }

        input.error {
          border-color: #ef4444;
        }

        .error-message {
          color: #ef4444;
          font-size: 14px;
          margin-top: 8px;
        }

        .general-error {
          background-color: rgba(239, 68, 68, 0.1);
          border-radius: 4px;
          padding: 12px;
          margin-bottom: 20px;
          text-align: center;
        }

        .login-button {
          width: 100%;
          padding: 14px;
          background-color: #f59e0b;
          color: #0f172a;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
          margin-top: 8px;
        }

        .login-button:hover {
          background-color: #d97706;
        }

        .login-button:disabled {
          background-color: #94a3b8;
          cursor: not-allowed;
        }

        .login-footer {
          text-align: center;
          color: #94a3b8;
          font-size: 14px;
          margin-top: 24px;
        }

        .login-footer p {
          margin: 8px 0;
        }

        .client-login-link {
          color: #f59e0b;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .client-login-link:hover {
          color: #d97706;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default ProperTeamLogin;
