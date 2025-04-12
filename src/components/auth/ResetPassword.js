import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { FaLock, FaCheck, FaArrowLeft } from 'react-icons/fa';
import { auth } from '../../firebase-config';
import styles from './Auth.module.css';

/**
 * ResetPassword component for setting a new password
 * 
 * This component allows users to set a new password after clicking a reset link.
 * It verifies the reset code and handles the password reset process.
 */
const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [resetCode, setResetCode] = useState('');
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [email, setEmail] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the reset code from the URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const oobCode = searchParams.get('oobCode');
    
    if (!oobCode) {
      setError('Invalid or missing reset code. Please request a new password reset link.');
      setIsVerifying(false);
      return;
    }
    
    setResetCode(oobCode);
    
    // Verify the reset code
    const verifyCode = async () => {
      try {
        const email = await verifyPasswordResetCode(auth, oobCode);
        setEmail(email);
        setIsCodeValid(true);
      } catch (error) {
        console.error('Error verifying reset code:', error);
        if (error.code === 'auth/expired-action-code') {
          setError('This password reset link has expired. Please request a new one.');
        } else if (error.code === 'auth/invalid-action-code') {
          setError('Invalid reset link. Please request a new password reset link.');
        } else {
          setError('An error occurred. Please request a new password reset link.');
        }
        setIsCodeValid(false);
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyCode();
  }, [location]);

  // Validate password
  const validatePassword = (password) => {
    const errors = {};
    
    if (password.length < 8) {
      errors.length = 'Password must be at least 8 characters';
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.uppercase = 'Password must contain at least one uppercase letter';
    }
    
    if (!/[a-z]/.test(password)) {
      errors.lowercase = 'Password must contain at least one lowercase letter';
    }
    
    if (!/[0-9]/.test(password)) {
      errors.number = 'Password must contain at least one number';
    }
    
    return errors;
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setValidationErrors(validatePassword(newPassword));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    const passwordErrors = validatePassword(password);
    if (Object.keys(passwordErrors).length > 0) {
      setValidationErrors(passwordErrors);
      setError('Please fix the password errors before submitting');
      return;
    }
    
    // Reset states
    setError('');
    setIsSubmitting(true);
    
    try {
      // Confirm password reset
      await confirmPasswordReset(auth, resetCode, password);
      
      // Show success message
      setSubmitSuccess(true);
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/team-login');
      }, 3000);
    } catch (error) {
      console.error('Error resetting password:', error);
      if (error.code === 'auth/expired-action-code') {
        setError('This password reset link has expired. Please request a new one.');
      } else if (error.code === 'auth/invalid-action-code') {
        setError('Invalid reset link. Please request a new password reset link.');
      } else if (error.code === 'auth/weak-password') {
        setError('The password is too weak. Please choose a stronger password.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while verifying the code
  if (isVerifying) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>Reset Password</h1>
            <p className={styles.subtitle}>Verifying your reset link...</p>
          </div>
          <div className={styles.content}>
            <div className={styles.loadingSpinner}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Reset Password</h1>
          <p className={styles.subtitle}>
            {isCodeValid 
              ? `Create a new password for ${email}` 
              : 'Password Reset Link Error'}
          </p>
        </div>

        <div className={styles.content}>
          {!isCodeValid ? (
            <div className={styles.errorContainer}>
              <div className={styles.errorMessage}>{error}</div>
              <div className={styles.formActions}>
                <Link to="/forgot-password" className={styles.submitButton}>
                  Request New Reset Link
                </Link>
                <Link to="/team-login" className={styles.linkButton}>
                  <FaArrowLeft className={styles.buttonIcon} /> Back to Login
                </Link>
              </div>
            </div>
          ) : submitSuccess ? (
            <div className={styles.successMessage}>
              <p>Your password has been successfully reset!</p>
              <p>You will be redirected to the login page in a few seconds...</p>
              <div className={styles.formActions}>
                <Link to="/team-login" className={styles.linkButton}>
                  <FaArrowLeft className={styles.buttonIcon} /> Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              {error && <div className={styles.errorMessage}>{error}</div>}
              
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>New Password</label>
                <div className={styles.inputWrapper}>
                  <FaLock className={styles.inputIcon} />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your new password"
                    className={styles.input}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                {Object.keys(validationErrors).length > 0 && (
                  <div className={styles.passwordRequirements}>
                    <p>Password requirements:</p>
                    <ul>
                      <li className={!validationErrors.length ? styles.valid : ''}>
                        {!validationErrors.length ? <FaCheck /> : null} At least 8 characters
                      </li>
                      <li className={!validationErrors.uppercase ? styles.valid : ''}>
                        {!validationErrors.uppercase ? <FaCheck /> : null} At least one uppercase letter
                      </li>
                      <li className={!validationErrors.lowercase ? styles.valid : ''}>
                        {!validationErrors.lowercase ? <FaCheck /> : null} At least one lowercase letter
                      </li>
                      <li className={!validationErrors.number ? styles.valid : ''}>
                        {!validationErrors.number ? <FaCheck /> : null} At least one number
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                <div className={styles.inputWrapper}>
                  <FaLock className={styles.inputIcon} />
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className={styles.input}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                {password && confirmPassword && password !== confirmPassword && (
                  <div className={styles.fieldError}>Passwords do not match</div>
                )}
              </div>
              
              <div className={styles.formActions}>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </button>
                
                <Link to="/team-login" className={styles.linkButton}>
                  <FaArrowLeft className={styles.buttonIcon} /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
