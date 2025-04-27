import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../minimal-firebase';

const MinimalDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate('/team-login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/team-login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f1f5f9'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1>Dashboard</h1>
        <button 
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h2>Welcome, {user.displayName || user.email}</h2>
        <p>You are now logged in with: {user.email}</p>
        
        <div style={{ marginTop: '20px' }}>
          <h3>User Information:</h3>
          <ul>
            <li><strong>Email:</strong> {user.email}</li>
            <li><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</li>
            <li><strong>User ID:</strong> {user.uid}</li>
            {user.displayName && <li><strong>Name:</strong> {user.displayName}</li>}
            {user.photoURL && (
              <li>
                <strong>Profile Photo:</strong>
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%',
                    marginLeft: '10px',
                    verticalAlign: 'middle'
                  }} 
                />
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MinimalDashboard;
