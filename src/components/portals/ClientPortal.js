import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { FaFileAlt, FaChartLine, FaCalendarAlt, FaEnvelope } from 'react-icons/fa';
import styles from './Portal.module.css';

const ClientPortal = () => {
  const { user, hasRole, USER_ROLES } = useAuth();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = 'FTFC | Client Portal';
  }, []);

  // Security check - only clients can access this portal
  if (!hasRole(USER_ROLES.CLIENT)) {
    return <Navigate to="/client-login" replace />;
  }

  return (
    <div className={styles.portalContainer}>
      <div className={styles.portalHeader}>
        <h1>Welcome to Your Client Portal</h1>
        <p>Access your financial information and services</p>
      </div>

      <div className={styles.portalContent}>
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Your Financial Overview</h2>
          
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <FaChartLine />
              </div>
              <div className={styles.metricContent}>
                <h3>Current Status</h3>
                <p className={styles.metricValue}>Active</p>
              </div>
            </div>
            
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <FaFileAlt />
              </div>
              <div className={styles.metricContent}>
                <h3>Documents</h3>
                <p className={styles.metricValue}>12</p>
              </div>
            </div>
            
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <FaCalendarAlt />
              </div>
              <div className={styles.metricContent}>
                <h3>Next Meeting</h3>
                <p className={styles.metricValue}>Jun 15, 2023</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>
          
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <div className={styles.activityDate}>Jun 1, 2023</div>
              <div className={styles.activityContent}>
                <h4>Document Uploaded</h4>
                <p>Financial Statement Q2 2023</p>
              </div>
            </div>
            
            <div className={styles.activityItem}>
              <div className={styles.activityDate}>May 28, 2023</div>
              <div className={styles.activityContent}>
                <h4>Meeting Completed</h4>
                <p>Quarterly Review with John Smith</p>
              </div>
            </div>
            
            <div className={styles.activityItem}>
              <div className={styles.activityDate}>May 15, 2023</div>
              <div className={styles.activityContent}>
                <h4>Funding Milestone</h4>
                <p>Series A Documentation Completed</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Your Documents</h2>
          
          <div className={styles.documentList}>
            <div className={styles.documentItem}>
              <div className={styles.documentIcon}>
                <FaFileAlt />
              </div>
              <div className={styles.documentContent}>
                <h4>Financial Statement Q2 2023</h4>
                <p>Uploaded on Jun 1, 2023</p>
              </div>
              <button className={styles.documentButton}>View</button>
            </div>
            
            <div className={styles.documentItem}>
              <div className={styles.documentIcon}>
                <FaFileAlt />
              </div>
              <div className={styles.documentContent}>
                <h4>Series A Term Sheet</h4>
                <p>Uploaded on May 15, 2023</p>
              </div>
              <button className={styles.documentButton}>View</button>
            </div>
            
            <div className={styles.documentItem}>
              <div className={styles.documentIcon}>
                <FaFileAlt />
              </div>
              <div className={styles.documentContent}>
                <h4>Business Plan 2023</h4>
                <p>Uploaded on Apr 10, 2023</p>
              </div>
              <button className={styles.documentButton}>View</button>
            </div>
          </div>
          
          <button className={styles.viewAllButton}>View All Documents</button>
        </div>
        
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Contact Your Advisor</h2>
          
          <div className={styles.contactCard}>
            <div className={styles.contactInfo}>
              <h3>John Smith</h3>
              <p>Financial Advisor</p>
              <p><FaEnvelope className={styles.contactIcon} /> john.smith@ftfc.com</p>
            </div>
            <button className={styles.contactButton}>Schedule Meeting</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPortal;
