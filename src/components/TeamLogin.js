import React, { useState } from 'react';
import { auth } from '../firebase-config';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const TeamLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error.code === 'auth/user-not-found' ? 'Invalid email or password' :
        error.code === 'auth/wrong-password' ? 'Invalid email or password' :
        error.code === 'auth/invalid-email' ? 'Invalid email format' :
        'An error occurred during login. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, formData.email);
      setSuccessMessage('Password reset email sent. Please check your inbox.');
      setIsResetMode(false);
    } catch (error) {
      setError('Error sending reset email. Please verify your email address.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className="page-header">
        <h1>Team Login</h1>
      </header>

      <div className="login-container">
        <h2>{isResetMode ? 'Reset Password' : 'Team Login'}</h2>
        
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        
        <form className="login-form" onSubmit={isResetMode ? handlePasswordReset : handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              disabled={isLoading}
            />
          </div>
          {!isResetMode && (
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                disabled={isLoading}
              />
            </div>
          )}
          <div className="form-actions">
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading 
                ? (isResetMode ? 'Sending...' : 'Logging in...') 
                : (isResetMode ? 'Send Reset Link' : 'Login')}
            </button>
            
            <button 
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                setIsResetMode(!isResetMode);
                setError('');
                setSuccessMessage('');
              }}
              className="link-button"
            >
              {isResetMode ? 'Back to Login' : 'Forgot Password?'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default TeamLogin; 