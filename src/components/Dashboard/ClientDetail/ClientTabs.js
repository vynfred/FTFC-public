import React from 'react';
import styles from '../DetailPages.module.css';

/**
 * Tab navigation component for client detail page
 */
const ClientTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'milestones', label: 'Milestones' },
    { id: 'documents', label: 'Documents' },
    { id: 'meetings', label: 'Meetings' }
  ];

  return (
    <div className={styles.tabs}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`${styles.tabButton} ${activeTab === tab.id ? styles.activeTab : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ClientTabs;
