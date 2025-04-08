import React, { useState } from 'react';
import { FaGlobe, FaHome, FaInfoCircle, FaHandshake, FaEnvelope, FaUsers, FaFileAlt, FaShieldAlt } from 'react-icons/fa';

/**
 * PublicPagesManager component for managing public page content
 */
const PublicPagesManager = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="public-pages-manager">
      <div className="manager-header">
        <h3>Public Pages Content Management</h3>
      </div>
      
      <div className="manager-content">
        <div className="page-tabs">
          <button
            className={`tab-button ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <FaHome className="tab-icon" />
            <span>Home</span>
          </button>
          
          <button
            className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <FaInfoCircle className="tab-icon" />
            <span>About</span>
          </button>
          
          <button
            className={`tab-button ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <FaHandshake className="tab-icon" />
            <span>Services</span>
          </button>
          
          <button
            className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <FaEnvelope className="tab-icon" />
            <span>Contact</span>
          </button>
          
          <button
            className={`tab-button ${activeTab === 'consultation' ? 'active' : ''}`}
            onClick={() => setActiveTab('consultation')}
          >
            <FaGlobe className="tab-icon" />
            <span>Consultation</span>
          </button>
          
          <button
            className={`tab-button ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            <FaUsers className="tab-icon" />
            <span>Team</span>
          </button>
          
          <button
            className={`tab-button ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => setActiveTab('terms')}
          >
            <FaFileAlt className="tab-icon" />
            <span>Terms</span>
          </button>
          
          <button
            className={`tab-button ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            <FaShieldAlt className="tab-icon" />
            <span>Privacy</span>
          </button>
        </div>
        
        <div className="page-content">
          <div className="content-placeholder">
            <h3>Content Management Coming Soon</h3>
            <p>The content management system for {activeTab} page is under development.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .public-pages-manager {
          width: 100%;
        }
        
        .manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .manager-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }
        
        .manager-content {
          display: flex;
          gap: 24px;
        }
        
        .page-tabs {
          width: 200px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .tab-button {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 12px 16px;
          background: none;
          border: none;
          border-radius: 4px;
          color: #94a3b8;
          font-size: 14px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .tab-button:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: #ffffff;
        }
        
        .tab-button.active {
          background-color: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }
        
        .tab-icon {
          margin-right: 12px;
          font-size: 16px;
        }
        
        .page-content {
          flex: 1;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 24px;
          max-height: 700px;
          overflow-y: auto;
        }
        
        .content-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px;
          text-align: center;
        }
        
        .content-placeholder h3 {
          font-size: 18px;
          font-weight: 600;
          color: #f59e0b;
          margin-bottom: 16px;
        }
        
        .content-placeholder p {
          color: #94a3b8;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default PublicPagesManager;
