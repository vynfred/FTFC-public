import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Special component for Safari to handle Google authentication
 * This component doesn't rely on sessionStorage which can cause issues in Safari
 */
const SafariGoogleAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set a flag in localStorage (which is more reliable than sessionStorage in Safari)
    localStorage.setItem('googleSignInSuccess', 'true');
    localStorage.setItem('userRole', 'team');
    
    // Clean up any state
    localStorage.removeItem('googleSignInStarted');
    localStorage.removeItem('googleAuthState');
    
    // Redirect to dashboard after a short delay
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
    
    return () => clearTimeout(timer);
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
      <h2>Safari Authentication</h2>
      <div style={{
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%'
      }}>
        <p>Authentication successful!</p>
        <p>Redirecting to dashboard...</p>
        <div style={{
          marginTop: '20px',
          width: '100%',
          height: '4px',
          backgroundColor: '#334155',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '30%',
            height: '100%',
            backgroundColor: '#f59e0b',
            borderRadius: '2px',
            animation: 'progress 1.5s linear'
          }}></div>
        </div>
      </div>
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default SafariGoogleAuth;
