import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';

const SimpleDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
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
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>FTFC Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome, {user.displayName || user.email}</h2>
          <p>You are now logged in to the FTFC dashboard.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Leads</h3>
            <p>View and manage your leads</p>
          </div>
          <div className="dashboard-card">
            <h3>Clients</h3>
            <p>View and manage your clients</p>
          </div>
          <div className="dashboard-card">
            <h3>Investors</h3>
            <p>View and manage your investors</p>
          </div>
          <div className="dashboard-card">
            <h3>Partners</h3>
            <p>View and manage your partners</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background-color: #f1f5f9;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background-color: #1e293b;
          color: white;
        }

        .logout-button {
          padding: 8px 16px;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .dashboard-content {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .welcome-card {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .dashboard-card {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .dashboard-card h3 {
          margin-top: 0;
          color: #1e293b;
        }
      `}</style>
    </div>
  );
};

export default SimpleDashboard;
