import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaGoogle, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase-config';

const TeamLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [adBlockerDetected, setAdBlockerDetected] = useState(false);
  const [isBraveBrowser, setIsBraveBrowser] = useState(false);

  const navigate = useNavigate();
  const { login, googleSignIn } = useAuth();

  // Direct Google sign-in using Firebase
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      console.log('TeamLogin: Starting Google sign-in...');

      // Create a Google provider directly
      const provider = new GoogleAuthProvider();

      // Add scopes
      provider.addScope('email');
      provider.addScope('profile');

      // Force account selection
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      // Use redirect method for maximum compatibility
      console.log('Using signInWithRedirect directly...');
      await signInWithRedirect(auth, provider);

      // The page will redirect, so we won't reach this point
      console.log('TeamLogin: Redirect in progress...');
    } catch (error) {
      console.error('TeamLogin: Google sign-in failed:', error);

      // Show a more user-friendly error message
      let errorMessage = 'Google sign-in failed. Please try again.';

      if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message) {
        errorMessage = `Google sign-in failed: ${error.message}`;
      }

      setErrors({ general: errorMessage });
      setIsLoading(false);
    }
  };

  // Check for ad blockers and Brave browser
  useEffect(() => {
    const checkForAdBlocker = async () => {
      try {
        // Create a test element
        const testElement = document.createElement('div');
        testElement.className = 'adsbox';
        testElement.innerHTML = '&nbsp;';
        document.body.appendChild(testElement);

        // Wait a bit for ad blockers to hide the element
        await new Promise(resolve => setTimeout(resolve, 100));

        // Check if the element is hidden
        const isBlocked = testElement.offsetHeight === 0 ||
                         window.getComputedStyle(testElement).display === 'none' ||
                         !document.body.contains(testElement);

        // Clean up
        if (document.body.contains(testElement)) {
          document.body.removeChild(testElement);
        }

        // Set state based on result
        setAdBlockerDetected(isBlocked);
        console.log('Ad blocker detected:', isBlocked);
      } catch (error) {
        console.error('Error checking for ad blocker:', error);
      }
    };

    // Check for Brave browser
    const checkForBraveBrowser = () => {
      const brave = isBrave();
      setIsBraveBrowser(brave);
      console.log('Brave browser detected:', brave);
    };

    checkForAdBlocker();
    checkForBraveBrowser();
  }, []);

  // Check for redirect result when component mounts
  useEffect(() => {
    // Force scroll to top when component mounts
    window.scrollTo(0, 0);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

    // Check for redirect result using the Firebase SDK directly
    const checkRedirectResult = async () => {
      try {
        console.log('TeamLogin: Checking for redirect result...');

        // Import getRedirectResult dynamically to avoid circular dependencies
        const { getRedirectResult } = await import('firebase/auth');
        const result = await getRedirectResult(auth);

        if (result && result.user) {
          console.log('TeamLogin: Redirect result found, user signed in:', result.user.email);
          navigate('/dashboard');
        } else {
          console.log('TeamLogin: No redirect result found');
        }
      } catch (error) {
        console.error('TeamLogin: Error handling redirect result:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        setErrors({ general: `Google sign-in failed: ${error.message}. Please try again.` });
      }
    };

    // Run the redirect check
    checkRedirectResult();

    // Set a single timeout to ensure it works
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Call login function from AuthContext with Firebase Authentication
      await login({
        email: formData.email,
        password: formData.password
      });

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);

      // Handle specific Firebase Auth errors
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        setErrors({ general: 'Invalid email or password' });
      } else if (error.code === 'auth/user-not-found') {
        setErrors({ general: 'No account found with this email address' });
      } else if (error.code === 'auth/too-many-requests') {
        setErrors({ general: 'Too many failed login attempts. Please try again later.' });
      } else {
        setErrors({ general: 'Login failed. Please check your credentials and try again.' });
      }
    } finally {
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

        {errors.general && (
          <div className="error-message general-error">
            {errors.general}
          </div>
        )}

        <BrowserWarning />

        {isBraveBrowser && <BraveShieldsWarning />}

        {adBlockerDetected && !isBraveBrowser && (
          <div className="warning-message">
            <FaExclamationTriangle style={{ marginRight: '8px' }} />
            <span>
              Ad blocker detected! This may prevent Google sign-in from working properly.
              Please disable your ad blocker or privacy extensions for this site and try again.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
              />
            </div>
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <div className="label-with-link">
              <label htmlFor="password">Password</label>
              <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
            </div>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.password ? 'error' : ''}
              />
            </div>
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className="form-group">
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        <div style={{ margin: '32px 0', textAlign: 'center' }}>
          <p style={{ margin: '16px 0', color: '#94a3b8' }}>- OR -</p>
          <button
            type="button"
            onClick={handleGoogleSignIn}
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

        .warning-message {
          display: flex;
          align-items: center;
          background-color: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          border-radius: 4px;
          padding: 12px;
          margin-bottom: 20px;
          text-align: left;
          font-size: 14px;
          line-height: 1.5;
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

export default TeamLogin;
