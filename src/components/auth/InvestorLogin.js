import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaGoogle, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase-config';
import styles from './Auth.module.css';

const InvestorLogin = () => {
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
      // Call login function from AuthContext with INVESTOR role
      login(formData, 'investor');

      // Redirect to investor portal
      navigate('/investor-portal');
    } catch (error) {
      setErrors({ general: 'Login failed. Please check your credentials and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Alternative method for Google sign-in using redirect
  const handleGoogleSignInRedirect = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      console.log('InvestorLogin: Starting Google sign-in with redirect...');
      // Set a flag in localStorage to indicate we're doing a redirect
      localStorage.setItem('googleRedirectInProgress', 'true');
      localStorage.setItem('googleRedirectTimestamp', Date.now().toString());

      // Store the intended role
      localStorage.setItem('intendedUserRole', 'investor');

      // Store the client ID in localStorage to ensure consistency
      localStorage.setItem('googleClientId', process.env.REACT_APP_GOOGLE_CLIENT_ID);

      // Use the redirect method
      await auth.signInWithGoogleRedirect();

      // Note: This will redirect the page, so the code below will only run if the redirect fails
      console.log('Redirect did not happen as expected');
    } catch (error) {
      console.error('InvestorLogin: Google sign-in redirect error:', error);
      localStorage.removeItem('googleRedirectInProgress');
      localStorage.removeItem('googleRedirectTimestamp');
      localStorage.removeItem('intendedUserRole');
      localStorage.removeItem('googleClientId');
      setErrors({ general: `Google sign-in failed: ${error.message}. Please try again.` });
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      console.log('InvestorLogin: Starting Google sign-in...');
      // Attempt Google sign-in with Firebase Authentication
      const result = await auth.signInWithGoogle();
      console.log('InvestorLogin: Google sign-in successful, redirecting...');

      // Redirect to investor portal on success
      navigate('/investor-portal');
    } catch (error) {
      console.error('InvestorLogin: Google sign-in error:', error);

      // Show detailed error message
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('InvestorLogin: User closed the popup');
        // No need to show an error
      } else if (error.code === 'auth/popup-blocked') {
        setErrors({ general: 'Popup was blocked by your browser. Please allow popups for this site.' });
      } else {
        setErrors({ general: `Google sign-in failed: ${error.message}. Please try again.` });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Investor Portal</h1>
          <p className={styles.subtitle}>Access your FTFC investor dashboard</p>
        </div>

        {errors.general && (
          <div className={styles.errorMessage}>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <div className={styles.inputWrapper}>
              <FaEnvelope className={styles.inputIcon} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <div className={styles.errorText}>{errors.email}</div>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <FaLock className={styles.inputIcon} />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                placeholder="Enter your password"
              />
            </div>
            {errors.password && <div className={styles.errorText}>{errors.password}</div>}
          </div>

          <div className={styles.formActions}>
            <div className={styles.rememberMe}>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to="/forgot-password" className={styles.forgotPassword}>Forgot password?</Link>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.orDivider}>
          <span>OR</span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className={styles.googleButton}
        >
          <FaGoogle className={styles.googleIcon} />
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        <div className={styles.footer}>
          <p>Don't have an account? <a href="/contact" className={styles.link}>Contact us</a> to get access.</p>
        </div>
      </div>
    </div>
  );
};

export default InvestorLogin;
