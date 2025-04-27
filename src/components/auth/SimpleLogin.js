import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { FaEnvelope, FaInfoCircle, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-direct';

const SimpleLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Google authentication has been temporarily removed
  // It will be implemented by a specialist in a future update

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
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="label-with-link">
              <label htmlFor="password">Password</label>
              <a href="/forgot-password" className="forgot-password">
                Forgot password?
              </a>
            </div>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        <div className="or-divider">
          <span>OR</span>
        </div>

        <div className="coming-soon-notice">
          <FaInfoCircle className="info-icon" />
          <p>Google Sign-In will be available soon</p>
        </div>

        <div className="login-footer">
          <p>Are you a client? <a href="/client-login" className="client-login-link">Client Login</a></p>
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

        .or-divider {
          position: relative;
          text-align: center;
          margin: 24px 0;
        }

        .or-divider::before,
        .or-divider::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 45%;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.1);
        }

        .or-divider::before {
          left: 0;
        }

        .or-divider::after {
          right: 0;
        }

        .or-divider span {
          display: inline-block;
          padding: 0 10px;
          background-color: #1e293b;
          color: #94a3b8;
          position: relative;
          z-index: 1;
        }

        .coming-soon-notice {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 14px;
          background-color: rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          border: 1px dashed rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          font-size: 16px;
          text-align: center;
        }

        .info-icon {
          color: #f59e0b;
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

export default SimpleLogin;
