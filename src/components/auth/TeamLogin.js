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

  const navigate = useNavigate();
  const { login, googleSignIn } = useAuth();

  // Alternative method for Google sign-in using redirect
  const handleGoogleSignInRedirect = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      console.log('TeamLogin: Starting Google sign-in with redirect...');
      // Set a flag in localStorage to indicate we're doing a redirect
      // Using localStorage instead of sessionStorage because it persists across redirects
      localStorage.setItem('googleRedirectInProgress', 'true');

      // Add a timestamp to track when the redirect was initiated
      localStorage.setItem('googleRedirectTimestamp', Date.now().toString());

      // Use the redirect method
      await auth.signInWithGoogleRedirect();

      // Note: This will redirect the page, so the code below will only run if the redirect fails
      console.log('Redirect did not happen as expected');
    } catch (error) {
      console.error('TeamLogin: Google sign-in redirect error:', error);
      localStorage.removeItem('googleRedirectInProgress');
      localStorage.removeItem('googleRedirectTimestamp');
      setErrors({ general: `Google sign-in failed: ${error.message}. Please try again.` });
      setIsLoading(false);
    }
  };

  // Check for redirect result when component mounts
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        setIsLoading(true);
        console.log('Checking for redirect result...');

        // Get the redirect result
        const result = await auth.getRedirectResult();

        if (result && result.user) {
          console.log('Redirect sign-in successful:', result.user.email);
          // Redirect to dashboard
          navigate('/dashboard');
          return;
        }

        // Check if we have a redirect in progress or just completed
        const redirectInProgress = localStorage.getItem('googleRedirectInProgress');
        const redirectTimestamp = localStorage.getItem('googleRedirectTimestamp');
        const googleSignInSuccess = sessionStorage.getItem('googleSignInSuccess');

        if (redirectInProgress || googleSignInSuccess) {
          // Clear the flags
          localStorage.removeItem('googleRedirectInProgress');
          localStorage.removeItem('googleRedirectTimestamp');
          sessionStorage.removeItem('googleSignInSuccess');

          // If the redirect was recent (within the last 5 minutes), this is likely a successful redirect
          if (redirectTimestamp) {
            const timestamp = parseInt(redirectTimestamp, 10);
            const now = Date.now();
            const fiveMinutesInMs = 5 * 60 * 1000;

            if (now - timestamp < fiveMinutesInMs) {
              console.log('Recent redirect detected, likely successful');
              navigate('/dashboard');
              return;
            }
          }

          if (googleSignInSuccess) {
            // If we have a success flag but no redirect result, it was a popup success
            navigate('/dashboard');
            return;
          }
        }
      } catch (error) {
        console.error('Redirect sign-in error:', error);
        if (error.code !== 'auth/credential-already-in-use') {
          setErrors({ general: `Google sign-in failed: ${error.message}. Please try again.` });
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkRedirectResult();

    // Force scroll to top when component mounts
    // Immediate scroll
    window.scrollTo(0, 0);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

    // Set multiple timeouts to ensure it works
    const timeoutIds = [];
    for (let i = 0; i < 10; i++) {
      timeoutIds.push(
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }, i * 100) // 0ms, 100ms, 200ms, etc.
      );
    }

    return () => timeoutIds.forEach(id => clearTimeout(id));
  }, []);

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

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      console.log('TeamLogin: Starting Google sign-in...');
      // Attempt Google sign-in with Firebase Authentication using the popup method
      const result = await auth.signInWithGoogle();
      console.log('TeamLogin: Google sign-in successful:', result);
      console.log('TeamLogin: User:', result.user);
      console.log('TeamLogin: User email:', result.user.email);
      console.log('TeamLogin: User ID:', result.user.uid);

      // Store authentication success in localStorage for debugging
      localStorage.setItem('authSuccess', 'true');
      localStorage.setItem('authUser', JSON.stringify({
        email: result.user.email,
        uid: result.user.uid,
        displayName: result.user.displayName,
        timestamp: new Date().toISOString()
      }));

      console.log('TeamLogin: Redirecting to dashboard...');
      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (error) {
      console.error('TeamLogin: Google sign-in error:', error);
      console.error('TeamLogin: Error code:', error.code);
      console.error('TeamLogin: Error message:', error.message);

      // Store authentication error in localStorage for debugging
      localStorage.setItem('authError', JSON.stringify({
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString()
      }));

      // Show detailed error message
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('TeamLogin: User closed the popup');
        // No need to show an error
      } else if (error.code === 'auth/popup-blocked') {
        setErrors({ general: 'Popup was blocked by your browser. Please allow popups for this site.' });
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.log('TeamLogin: Popup request was cancelled');
        // No need to show an error
      } else if (error.code === 'auth/unauthorized-domain') {
        setErrors({ general: 'This domain is not authorized for OAuth operations.' });
      } else {
        setErrors({ general: `Google sign-in failed: ${error.message}. Please try again.` });
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

        <div style={{ margin: '20px 0', textAlign: 'center' }}>
          <p style={{ margin: '10px 0', color: '#94a3b8' }}>- OR -</p>
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
              padding: '12px',
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
          padding: 32px;
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
          margin-bottom: 20px;
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
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        input {
          width: 100%;
          padding: 12px 12px 12px 40px;
          background-color: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: #ffffff;
          font-size: 14px;
          transition: border-color 0.2s ease;
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
          padding: 12px;
          background-color: #f59e0b;
          color: #0f172a;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
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
