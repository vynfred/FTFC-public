import React from 'react';
import { auth } from '../../firebase-config';
import { useNavigate } from 'react-router-dom';

function DashboardNav() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/team-login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="dashboard-header">
      <h1>FTFC Dashboard</h1>
      <div className="dashboard-controls">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}

export default DashboardNav; 