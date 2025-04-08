import React, { useState } from 'react';
import { FaCamera, FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  // Mock user data - in a real app, this would come from context/API
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    role: 'Admin',
    department: 'Sales',
    joinDate: '2022-01-15',
    profileImage: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userData });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData(formData);
    setIsEditing(false);
    // In a real app, you would save the data to the backend here
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h1>User Profile</h1>
        <p>Manage your account information and settings</p>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.profileCard}>
          <div className={styles.profileImageSection}>
            <div className={styles.profileImageContainer}>
              {userData.profileImage ? (
                <img 
                  src={userData.profileImage} 
                  alt={userData.name} 
                  className={styles.profileImage} 
                />
              ) : (
                <div className={styles.profileImagePlaceholder}>
                  <FaUser />
                </div>
              )}
              <button className={styles.uploadButton}>
                <FaCamera />
                <span>Change Photo</span>
              </button>
            </div>
          </div>

          <div className={styles.profileDetails}>
            {isEditing ? (
              <form onSubmit={handleSubmit} className={styles.editForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="department">Department</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formActions}>
                  <button type="button" className={styles.cancelButton} onClick={handleCancel}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.saveButton}>
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className={styles.profileInfo}>
                  <h2>{userData.name}</h2>
                  <p className={styles.userRole}>{userData.role}</p>

                  <div className={styles.infoItem}>
                    <FaEnvelope className={styles.infoIcon} />
                    <span>{userData.email}</span>
                  </div>

                  <div className={styles.infoItem}>
                    <FaPhone className={styles.infoIcon} />
                    <span>{userData.phone}</span>
                  </div>

                  <div className={styles.additionalInfo}>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Department:</span>
                      <span className={styles.infoValue}>{userData.department}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Joined:</span>
                      <span className={styles.infoValue}>
                        {new Date(userData.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  className={styles.editButton}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        <div className={styles.profileCard}>
          <h3>Account Settings</h3>
          
          <div className={styles.settingsSection}>
            <h4>Password</h4>
            <button className={styles.actionButton}>Change Password</button>
          </div>
          
          <div className={styles.settingsSection}>
            <h4>Notifications</h4>
            <button className={styles.actionButton}>Manage Notifications</button>
          </div>
          
          <div className={styles.settingsSection}>
            <h4>Two-Factor Authentication</h4>
            <button className={styles.actionButton}>Enable 2FA</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
