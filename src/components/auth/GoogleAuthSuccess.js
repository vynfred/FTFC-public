import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set success flags in both localStorage and sessionStorage
    localStorage.setItem('googleSignInSuccess', 'true');
    try {
      sessionStorage.setItem('googleSignInSuccess', 'true');
    } catch (e) {
      console.warn('Could not set sessionStorage item:', e);
    }
    
    // Set user role
    localStorage.setItem('userRole', 'team');
    try {
      sessionStorage.setItem('userRole', 'team');
    } catch (e) {
      console.warn('Could not set sessionStorage item:', e);
    }
    
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
      <h2>Authentication Successful</h2>
      <div style={{
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%'
      }}>
        <p>You have successfully signed in with Google.</p>
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

export default GoogleAuthSuccess;
