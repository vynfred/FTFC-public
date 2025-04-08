import React from 'react';
import { FaBuilding, FaLightbulb, FaUsers } from 'react-icons/fa';
import styles from './FocusAreas.module.css';

/**
 * FocusAreas component for displaying partner's areas of focus
 * 
 * @param {Object} props
 * @param {Array} props.focusAreas - Array of focus area objects
 */
const FocusAreas = ({ focusAreas }) => {
  if (!focusAreas || focusAreas.length === 0) {
    return (
      <div className={styles.emptyState}>
        <FaLightbulb className={styles.emptyIcon} />
        <p>No focus areas have been defined yet</p>
      </div>
    );
  }

  // Get icon based on focus area type
  const getIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'industry':
        return <FaBuilding />;
      case 'client':
        return <FaUsers />;
      default:
        return <FaLightbulb />;
    }
  };

  return (
    <div className={styles.focusAreasSection}>
      <h3 className={styles.sectionTitle}>Areas of Focus</h3>
      
      <div className={styles.focusGrid}>
        {focusAreas.map((area, index) => (
          <div key={index} className={styles.focusCard}>
            <div className={styles.focusIcon}>
              {getIcon(area.type)}
            </div>
            <div className={styles.focusContent}>
              <h4 className={styles.focusTitle}>{area.title}</h4>
              {area.description && (
                <p className={styles.focusDescription}>{area.description}</p>
              )}
              {area.expertise && (
                <div className={styles.expertiseLevel}>
                  <span className={styles.expertiseLabel}>Expertise:</span>
                  <div className={styles.expertiseBar}>
                    <div 
                      className={styles.expertiseFill} 
                      style={{ width: `${area.expertise}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FocusAreas;
