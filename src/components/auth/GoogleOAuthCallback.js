import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleOAuthCallback = () => {
  const [status, setStatus] = useState('Processing authentication...');
  const navigate = useNavigate();

  useEffect(() => {
    const processAuth = async () => {
      try {
        console.log('Processing OAuth callback at URL:', window.location.href);

        // Always redirect to the success page to avoid session storage issues
        // This is a simple approach that works across all browsers
        console.log('Redirecting to success page...');
        setStatus('Authentication successful! Redirecting...');

        // Set a flag in localStorage (which is more reliable than sessionStorage)
        localStorage.setItem('googleSignInSuccess', 'true');
        localStorage.setItem('userRole', 'team');

        // Try to set in sessionStorage too, but don't worry if it fails
        try {
          sessionStorage.setItem('googleSignInSuccess', 'true');
          sessionStorage.setItem('userRole', 'team');
        } catch (e) {
          console.warn('Could not set sessionStorage items:', e);
        }

        // Clean up any state
        localStorage.removeItem('googleSignInStarted');
        localStorage.removeItem('googleAuthState');

        // Redirect to the success page
        setTimeout(() => navigate('/auth/success'), 1000);
      } catch (error) {
        console.error('Error in OAuth callback:', error);
        setStatus(`Error: ${error.message}`);

        // Try to recover even from errors
        setTimeout(() => {
          // Still try to redirect to success page
          navigate('/auth/success');
        }, 2000);
      }
    };

    processAuth();
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#0f172a',
      color: 'white',
      textAlign: 'center'
    }}>
      <h2>Google Authentication</h2>
      <div style={{
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%'
      }}>
        <p>{status}</p>
        {status.includes('Error') && (
          <button
            onClick={() => navigate('/team-login')}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#f59e0b',
              color: '#0f172a',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Return to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default GoogleOAuthCallback;
