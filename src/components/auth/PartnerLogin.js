import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.css';

const PartnerLogin = () => {
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
      // Call login function from AuthContext with PARTNER role
      login(formData, 'partner');

      // Redirect to partner portal
      navigate('/partner-portal');
    } catch (error) {
      setErrors({ general: 'Login failed. Please check your credentials and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      console.log('PartnerLogin: Starting Google sign-in...');
      // Attempt Google sign-in with Firebase Authentication
      const result = await auth.signInWithGoogle();
      console.log('PartnerLogin: Google sign-in successful, redirecting...');

      // Redirect to partner portal on success
      navigate('/partner-portal');
    } catch (error) {
      console.error('PartnerLogin: Google sign-in error:', error);

      // Show detailed error message
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('PartnerLogin: User closed the popup');
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
          <h1 className={styles.title}>Partner Portal</h1>
          <p className={styles.subtitle}>Access your FTFC partner dashboard</p>
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

export default PartnerLogin;
