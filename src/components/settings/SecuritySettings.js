import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import CrossAccountProtection from './CrossAccountProtection';

/**
 * SecuritySettings component for managing security-related settings
 * 
 * This component serves as a container for various security settings
 * including Cross-Account Protection and other security features.
 */
const SecuritySettings = () => {
  return (
    <div className="security-settings">
      <div className="flex items-center mb-6">
        <FaShieldAlt className="text-blue-600 text-3xl mr-3" />
        <h2 className="text-2xl font-semibold">Security Settings</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Configure security settings to protect your application and users from potential threats.
        These settings help ensure data integrity and account security.
      </p>
      
      {/* Cross-Account Protection */}
      <CrossAccountProtection />
      
      {/* Additional security settings can be added here */}
    </div>
  );
};

export default SecuritySettings;
