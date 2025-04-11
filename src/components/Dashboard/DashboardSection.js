import React from 'react';
import PropTypes from 'prop-types';
import styles from './Dashboard.module.css';

/**
 * Reusable Dashboard Section component
 * Used to create consistent section styling across the dashboard
 */
const DashboardSection = ({ 
  title, 
  children, 
  className = '', 
  titleClassName = '',
  contentClassName = '',
  actionButton = null
}) => {
  return (
    <div className={`${styles.dashboardSection} ${className}`}>
      <div className={`${styles.dashboardSectionHeader} ${titleClassName}`}>
        <h2 className={styles.dashboardSectionTitle}>{title}</h2>
        {actionButton && (
          <div className={styles.dashboardSectionAction}>
            {actionButton}
          </div>
        )}
      </div>
      <div className={`${styles.dashboardSectionContent} ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

DashboardSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  titleClassName: PropTypes.string,
  contentClassName: PropTypes.string,
  actionButton: PropTypes.node
};

export default DashboardSection;
