import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase-config';

/**
 * Component to demonstrate email functionality with SendGrid
 */
const EmailExample = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setStatus({
        type: 'error',
        message: 'Please enter an email address'
      });
      return;
    }
    
    setLoading(true);
    setStatus({ type: '', message: '' });
    
    try {
      // Send password reset email using Firebase Auth (which will use SendGrid)
      await sendPasswordResetEmail(auth, email);
      
      setStatus({
        type: 'success',
        message: 'Password reset email sent successfully! Please check your inbox.'
      });
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setStatus({
        type: 'error',
        message: `Failed to send email: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-example">
      <h3>Test SendGrid Email Integration</h3>
      <p>Enter your email to receive a password reset email via SendGrid:</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="form-control"
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Password Reset Email'}
        </button>
      </form>
      
      {status.message && (
        <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'} mt-3`}>
          {status.message}
        </div>
      )}
      
      <div className="mt-4">
        <h4>How it works:</h4>
        <ol>
          <li>User enters email and clicks the button</li>
          <li>Firebase Auth triggers the password reset flow</li>
          <li>Our custom Firebase Functions intercept the email</li>
          <li>SendGrid API is used to send a branded email</li>
          <li>User receives a professionally styled email with reset link</li>
        </ol>
      </div>
    </div>
  );
};

export default EmailExample;
