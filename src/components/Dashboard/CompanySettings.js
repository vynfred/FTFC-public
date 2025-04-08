import React, { useEffect, useState } from 'react';
import { FaCog, FaEnvelope, FaGlobe, FaPhone, FaUser, FaUsers } from 'react-icons/fa';
import { useStatsView } from '../../context/StatsViewContext';

const CompanySettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { setViewCompanyStats } = useStatsView();

  // Force company stats view for Company Settings
  useEffect(() => {
    setViewCompanyStats(true);
  }, [setViewCompanyStats]);

  const [companyInfo, setCompanyInfo] = useState({
    name: 'FTFC Technologies',
    website: 'https://ftfc.com',
    email: 'info@ftfc.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, San Francisco, CA 94105',
    description: 'FTFC is a leading financial technology company specializing in funding solutions for startups and small businesses.'
  });

  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'John Doe', role: 'CEO', email: 'john@ftfc.com' },
    { id: 2, name: 'Jane Smith', role: 'CTO', email: 'jane@ftfc.com' },
    { id: 3, name: 'Michael Johnson', role: 'CFO', email: 'michael@ftfc.com' },
    { id: 4, name: 'Sarah Williams', role: 'Marketing Director', email: 'sarah@ftfc.com' }
  ]);

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save to an API
    alert('Settings saved successfully!');
  };

  return (
    <div className="company-settings">
      <div className="dashboard-section">
        <h1>Company Settings</h1>

        <div className="settings-container">
          <div className="settings-tabs">
            <button
              className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <FaCog className="tab-icon" />
              <span>General</span>
            </button>

            <button
              className={`tab-button ${activeTab === 'team' ? 'active' : ''}`}
              onClick={() => setActiveTab('team')}
            >
              <FaUsers className="tab-icon" />
              <span>Team</span>
            </button>
          </div>

          <div className="settings-content">
            {activeTab === 'general' && (
              <form onSubmit={handleSubmit} className="settings-form">
                <div className="form-group">
                  <label htmlFor="name">Company Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={companyInfo.name}
                    onChange={handleInfoChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="website">Website</label>
                  <div className="input-with-icon">
                    <FaGlobe className="input-icon" />
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={companyInfo.website}
                      onChange={handleInfoChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <div className="input-with-icon">
                    <FaEnvelope className="input-icon" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={companyInfo.email}
                      onChange={handleInfoChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <div className="input-with-icon">
                    <FaPhone className="input-icon" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={companyInfo.phone}
                      onChange={handleInfoChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={companyInfo.address}
                    onChange={handleInfoChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Company Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={companyInfo.description}
                    onChange={handleInfoChange}
                    rows="4"
                  ></textarea>
                </div>

                <button type="submit" className="save-button">Save Changes</button>
              </form>
            )}

            {activeTab === 'team' && (
              <div className="team-settings">
                <div className="team-list">
                  {teamMembers.map(member => (
                    <div key={member.id} className="team-member">
                      <div className="member-avatar">
                        <FaUser />
                      </div>
                      <div className="member-info">
                        <h3 className="member-name">{member.name}</h3>
                        <p className="member-role">{member.role}</p>
                        <p className="member-email">{member.email}</p>
                      </div>
                      <div className="member-actions">
                        <button className="edit-button">Edit</button>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="add-member-button">
                  <FaUser className="button-icon" />
                  Add Team Member
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .company-settings {
          width: 100%;
        }

        .settings-container {
          display: flex;
          padding: 16px;
        }

        .settings-tabs {
          width: 200px;
          margin-right: 24px;
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
          margin-bottom: 8px;
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

        .settings-content {
          flex: 1;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 24px;
        }

        .settings-form {
          max-width: 600px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #94a3b8;
          font-size: 14px;
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        input, textarea {
          width: 100%;
          padding: 10px 12px;
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: #ffffff;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }

        .input-with-icon input {
          padding-left: 36px;
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: #f59e0b;
        }

        textarea {
          resize: vertical;
        }

        .save-button {
          background-color: #f59e0b;
          color: #0f172a;
          border: none;
          border-radius: 4px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .save-button:hover {
          background-color: #d97706;
        }

        .team-list {
          margin-bottom: 24px;
        }

        .team-member {
          display: flex;
          align-items: center;
          padding: 16px;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .member-avatar {
          width: 48px;
          height: 48px;
          background-color: rgba(245, 158, 11, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f59e0b;
          font-size: 20px;
          margin-right: 16px;
        }

        .member-info {
          flex: 1;
        }

        .member-name {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 4px 0;
        }

        .member-role {
          font-size: 14px;
          color: #94a3b8;
          margin: 0 0 4px 0;
        }

        .member-email {
          font-size: 14px;
          color: #94a3b8;
          margin: 0;
        }

        .member-actions {
          margin-left: 16px;
        }

        .edit-button {
          background-color: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: none;
          border-radius: 4px;
          padding: 8px 12px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .edit-button:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .add-member-button {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          border: 1px dashed #f59e0b;
          border-radius: 8px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
        }

        .add-member-button:hover {
          background-color: rgba(245, 158, 11, 0.2);
        }

        .button-icon {
          margin-right: 8px;
        }
      `}</style>
    </div>
  );
};

export default CompanySettings;
