import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';

export const UserSettings = ({ user }) => {
  const [driveEnabled, setDriveEnabled] = useState(false);

  useEffect(() => {
    setDriveEnabled(user.googleDriveEnabled || false);
  }, [user]);

  const handleDriveToggle = async () => {
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        googleDriveEnabled: !driveEnabled,
        updatedAt: serverTimestamp()
      });
      setDriveEnabled(!driveEnabled);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div>
      <h2>Integration Settings</h2>
      <div>
        <label>
          <input
            type="checkbox"
            checked={driveEnabled}
            onChange={handleDriveToggle}
          />
          Enable Google Drive Notes Processing
        </label>
      </div>
    </div>
  );
};