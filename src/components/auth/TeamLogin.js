import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaGoogle, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TeamLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login, googleSignIn } = useAuth();

  // Force scroll to top when component mounts
  useEffect(() => {
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
      // Attempt Google sign-in with Firebase Authentication
      await googleSignIn();

      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign-in error:', error);

      // Only show error if it's not the user closing the popup
      if (error.code !== 'auth/popup-closed-by-user') {
        setErrors({ general: 'Google sign-in failed. Please try again.' });
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
              transition: 'all 0.2s ease'
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
