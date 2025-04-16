import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaCamera, FaEnvelope, FaGoogleDrive, FaPhone, FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase-config';
import GoogleCalendarConnect from '../integrations/GoogleCalendarConnect';
import GoogleDriveConnect from '../integrations/GoogleDriveConnect';
import ProfileThemeToggle from '../ui/theme/ProfileThemeToggle';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  const { user } = useAuth();
  // User data state
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    role: 'Admin',
    department: 'Sales',
    joinDate: '2022-01-15',
    profileImage: null
  });

  // Check for Google connections
  const [isGoogleDriveConnected, setIsGoogleDriveConnected] = useState(false);
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userData });

  // Fetch user data from Firestore
  // Check for Google connections
  useEffect(() => {
    console.log('UserProfile: Checking for Google connections');

    // Check if Google Drive is connected
    const driveConnected = localStorage.getItem('googleDriveConnected');
    console.log('UserProfile: Drive connected flag:', driveConnected);

    if (driveConnected === 'true') {
      setIsGoogleDriveConnected(true);
      console.log('UserProfile: Google Drive is connected');
    } else {
      console.log('UserProfile: Google Drive is NOT connected');
      setIsGoogleDriveConnected(false);
    }

    // Check if Google Calendar is connected
    const calendarConnected = localStorage.getItem('googleCalendarConnected');
    console.log('UserProfile: Calendar connected flag:', calendarConnected);

    if (calendarConnected === 'true') {
      setIsGoogleCalendarConnected(true);
      console.log('UserProfile: Google Calendar is connected');
    } else {
      console.log('UserProfile: Google Calendar is NOT connected');
      setIsGoogleCalendarConnected(false);
    }

    // Check for tokens
    const tokens = localStorage.getItem('googleTokens');
    console.log('UserProfile: Tokens in localStorage:', tokens ? 'Yes' : 'No');
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData({
              name: data.displayName || user.displayName || 'User',
              email: data.email || user.email || '',
              phone: data.phone || '',
              role: data.role || 'Team Member',
              department: data.department || '',
              joinDate: data.createdAt ? new Date(data.createdAt.toDate()).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              profileImage: data.photoURL || user.photoURL || null
            });
            setFormData({
              name: data.displayName || user.displayName || 'User',
              email: data.email || user.email || '',
              phone: data.phone || '',
              role: data.role || 'Team Member',
              department: data.department || '',
              joinDate: data.createdAt ? new Date(data.createdAt.toDate()).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              profileImage: data.photoURL || user.photoURL || null
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

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

          <div className={styles.settingsSection}>
            <ProfileThemeToggle />
          </div>
        </div>

        {/* Google Drive Integration Section */}
        <div className={styles.profileCard}>
          <h3>
            <FaGoogleDrive className={styles.sectionIcon} />
            Google Drive Integration
          </h3>
          <p className={styles.sectionDescription}>
            Connect your Google Drive to enable automatic processing of Gemini meeting notes
          </p>

          <GoogleDriveConnect
            onConnect={(tokens, profile) => {
              console.log('Google Drive connected', profile);
              setIsGoogleDriveConnected(true);
              localStorage.setItem('googleDriveConnected', 'true');
            }}
            onDisconnect={() => {
              console.log('Google Drive disconnected');
              setIsGoogleDriveConnected(false);
              localStorage.removeItem('googleDriveConnected');
            }}
          />

          {/* Debug section */}
          <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
            <h4>Debug Information</h4>
            <p>If you're having connection issues, try setting the flags manually:</p>
            <button
              onClick={() => {
                localStorage.setItem('googleDriveConnected', 'true');
                alert('Google Drive connection flag set!');
                window.location.reload();
              }}
              style={{ padding: '8px 16px', backgroundColor: '#4285f4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '10px' }}
            >
              Force Set Drive Connection Flag
            </button>

            <div>
              <h5>Current localStorage Items:</h5>
              <pre style={{ maxHeight: '150px', overflow: 'auto', padding: '10px', backgroundColor: '#eee', fontSize: '12px' }}>
                {JSON.stringify((() => {
                  const items = {};
                  try {
                    for (let i = 0; i < localStorage.length; i++) {
                      const key = localStorage.key(i);
                      try {
                        const value = localStorage.getItem(key);
                        items[key] = value;
                      } catch (e) {
                        items[key] = "Error reading value";
                      }
                    }
                  } catch (e) {
                    return { error: e.message };
                  }
                  return items;
                })(), null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Calendar Integration Section */}
        <div className={styles.profileCard}>
          <h3>
            <FaCalendarAlt className={styles.sectionIcon} />
            Calendar Integration
          </h3>
          <p className={styles.sectionDescription}>
            Connect your Google Calendar to schedule and manage client meetings
          </p>

          <GoogleCalendarConnect
            onConnect={(tokens, profile) => {
              console.log('Google Calendar connected', profile);
              setIsGoogleCalendarConnected(true);
              localStorage.setItem('googleCalendarConnected', 'true');
            }}
            onDisconnect={() => {
              console.log('Google Calendar disconnected');
              setIsGoogleCalendarConnected(false);
              localStorage.removeItem('googleCalendarConnected');
            }}
          />

          {/* Debug section */}
          <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
            <h4>Debug Information</h4>
            <p>If you're having connection issues, try setting the flags manually:</p>
            <button
              onClick={() => {
                localStorage.setItem('googleCalendarConnected', 'true');
                alert('Google Calendar connection flag set!');
                window.location.reload();
              }}
              style={{ padding: '8px 16px', backgroundColor: '#4285f4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '10px' }}
            >
              Force Set Calendar Connection Flag
            </button>

            <div>
              <h5>Connection Status:</h5>
              <ul style={{ listStyle: 'none', padding: '0' }}>
                <li>Calendar Connected: <strong>{isGoogleCalendarConnected ? 'Yes' : 'No'}</strong></li>
                <li>Drive Connected: <strong>{isGoogleDriveConnected ? 'Yes' : 'No'}</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
