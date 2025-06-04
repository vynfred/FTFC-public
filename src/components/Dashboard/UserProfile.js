import { doc, getDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaCamera, FaEnvelope, FaGoogleDrive, FaPhone, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase-config';
import GoogleCalendarConnect from '../integrations/GoogleCalendarConnect';
import GoogleDriveConnect from '../integrations/GoogleDriveConnect';
import ProfileThemeToggle from '../ui/theme/ProfileThemeToggle';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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

  // Handle logout with retry logic
  const handleLogout = async () => {
    try {
      // First call the Cloud Function to revoke tokens
      const functions = getFunctions();
      const logoutFunction = httpsCallable(functions, 'logout');

      // Implement client-side retry with exponential backoff
      const retryOperation = async (operation, maxRetries = 3, maxBackoff = 16) => {
        let retries = 0;

        while (retries < maxRetries) {
          try {
            return await operation();
          } catch (error) {
            // Check if this is a retryable error
            const isRetryable =
              error.code === 'unavailable' ||
              error.code === 'resource-exhausted' ||
              error.code === 'deadline-exceeded' ||
              error.code === 'internal';

            if (isRetryable) {
              retries++;

              if (retries >= maxRetries) {
                throw error; // Max retries reached
              }

              // Calculate backoff time with jitter
              const backoffTime = Math.min(Math.pow(2, retries) + Math.random(), maxBackoff);
              console.log(`Retry attempt ${retries}, waiting ${backoffTime} seconds`);

              // Wait for the backoff period
              await new Promise(resolve => setTimeout(resolve, backoffTime * 1000));
            } else {
              throw error; // Not a retryable error
            }
          }
        }
      };

      // Call the Cloud Function with retry logic
      await retryOperation(() => logoutFunction());

      // Then use the local logout function to clear state
      await logout();

      // Navigate to login page
      navigate('/team-login');
    } catch (error) {
      console.error('Error signing out:', error);
      // Show error to user
      alert('Failed to sign out. Please try again.');
    }
  };

  // Fetch user data from Firestore
  // Check for Google connections
  useEffect(() => {
    console.log('UserProfile: Checking for Google connections');

    // Check if Google Drive is connected (check both localStorage and sessionStorage)
    const driveConnected = localStorage.getItem('googleDriveConnected');
    const sessionDriveConnected = sessionStorage.getItem('googleDriveConnected');
    console.log('UserProfile: Drive connected flag (localStorage):', driveConnected);
    console.log('UserProfile: Drive connected flag (sessionStorage):', sessionDriveConnected);

    if (driveConnected === 'true' || sessionDriveConnected === 'true') {
      setIsGoogleDriveConnected(true);
      console.log('UserProfile: Google Drive is connected');

      // Ensure both storage locations have the flag set
      localStorage.setItem('googleDriveConnected', 'true');
      sessionStorage.setItem('googleDriveConnected', 'true');
    } else {
      console.log('UserProfile: Google Drive is NOT connected');
      setIsGoogleDriveConnected(false);
    }

    // Check if Google Calendar is connected (check both localStorage and sessionStorage)
    const calendarConnected = localStorage.getItem('googleCalendarConnected');
    const sessionCalendarConnected = sessionStorage.getItem('googleCalendarConnected');
    console.log('UserProfile: Calendar connected flag (localStorage):', calendarConnected);
    console.log('UserProfile: Calendar connected flag (sessionStorage):', sessionCalendarConnected);

    if (calendarConnected === 'true' || sessionCalendarConnected === 'true') {
      setIsGoogleCalendarConnected(true);
      console.log('UserProfile: Google Calendar is connected');

      // Ensure both storage locations have the flag set
      localStorage.setItem('googleCalendarConnected', 'true');
      sessionStorage.setItem('googleCalendarConnected', 'true');
    } else {
      console.log('UserProfile: Google Calendar is NOT connected');
      setIsGoogleCalendarConnected(false);
    }

    // Check for tokens
    const tokens = localStorage.getItem('googleTokens');
    const driveTokens = localStorage.getItem('googleDriveTokens');
    console.log('UserProfile: Tokens in localStorage:', tokens ? 'Yes' : 'No');
    console.log('UserProfile: Drive tokens in localStorage:', driveTokens ? 'Yes' : 'No');

    // If we have tokens but no connection flags, try to set the flags
    if (tokens && (!calendarConnected && !sessionCalendarConnected)) {
      try {
        // Verify tokens are valid by parsing them
        JSON.parse(tokens);
        console.log('UserProfile: Tokens are valid, setting calendar connection flag');
        localStorage.setItem('googleCalendarConnected', 'true');
        sessionStorage.setItem('googleCalendarConnected', 'true');
        setIsGoogleCalendarConnected(true);
      } catch (error) {
        console.error('UserProfile: Error validating tokens:', error);
      }
    }

    if (driveTokens && (!driveConnected && !sessionDriveConnected)) {
      try {
        // Verify tokens are valid by parsing them
        JSON.parse(driveTokens);
        console.log('UserProfile: Drive tokens are valid, setting drive connection flag');
        localStorage.setItem('googleDriveConnected', 'true');
        sessionStorage.setItem('googleDriveConnected', 'true');
        setIsGoogleDriveConnected(true);
      } catch (error) {
        console.error('UserProfile: Error validating drive tokens:', error);
      }
    }
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

          <div className={styles.settingsSection}>
            <h4>Logout</h4>
            <button
              className={`${styles.actionButton} ${styles.logoutButton}`}
              onClick={handleLogout}
            >
              <FaSignOutAlt className={styles.buttonIcon} />
              Logout
            </button>
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
            <p>If you&apos;re having connection issues, try setting the flags manually:</p>
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
            <p>If you&apos;re having connection issues, try setting the flags manually:</p>
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
