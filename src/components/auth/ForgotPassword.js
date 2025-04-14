import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase-config';
import styles from './Auth.module.css';

/**
 * ForgotPassword component for requesting password reset emails
 *
 * This component allows users to request a password reset email by entering their email address.
 * It provides feedback on the success or failure of the request.
 */
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    // Reset states
    setError('');
    setIsSubmitting(true);

    try {
      console.log('Sending password reset email to:', email);

      // Configure actionCodeSettings for the password reset email
      const actionCodeSettings = {
        // URL you want to redirect back to after password reset
        url: window.location.origin + '/reset-password',
        // This must be true for password reset emails
        handleCodeInApp: false
      };

      // Send password reset email with actionCodeSettings
      await sendPasswordResetEmail(auth, email, actionCodeSettings);

      console.log('Password reset email sent successfully');

      // Show success message
      setEmailSent(true);
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Password reset error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);

      // Handle specific Firebase Auth errors
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email address');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later');
      } else {
        setError(`An error occurred: ${error.message}. Please try again later.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Reset Password</h1>
          <p className={styles.subtitle}>
            {emailSent
              ? 'Check your email for reset instructions'
              : 'Enter your email to receive a password reset link'}
          </p>
        </div>

        <div className={styles.content}>
          {submitSuccess ? (
            <div className={styles.successMessage}>
              <p>
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p>
                Please check your email and follow the instructions to reset your password.
                If you don't see the email, check your spam folder.
              </p>
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
                <label htmlFor="email" className={styles.label}>Email Address</label>
                <div className={styles.inputWrapper}>
                  <FaEnvelope className={styles.inputIcon} />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className={styles.input}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;
