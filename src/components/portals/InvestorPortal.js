import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { FaFileAlt, FaChartLine, FaBuilding, FaEnvelope, FaHandshake } from 'react-icons/fa';
import styles from './Portal.module.css';

const InvestorPortal = () => {
  const { user, hasRole, USER_ROLES } = useAuth();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = 'FTFC | Investor Portal';
  }, []);

  // Security check - only investors can access this portal
  if (!hasRole(USER_ROLES.INVESTOR)) {
    return <Navigate to="/investor-login" replace />;
  }

  return (
    <div className={styles.portalContainer}>
      <div className={styles.portalHeader}>
        <h1>Welcome to Your Investor Portal</h1>
        <p>Access your investment opportunities and portfolio</p>
      </div>

      <div className={styles.portalContent}>
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Portfolio Overview</h2>
          
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <FaBuilding />
              </div>
              <div className={styles.metricContent}>
                <h3>Active Investments</h3>
                <p className={styles.metricValue}>5</p>
              </div>
            </div>
            
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <FaHandshake />
              </div>
              <div className={styles.metricContent}>
                <h3>Pending Deals</h3>
                <p className={styles.metricValue}>3</p>
              </div>
            </div>
            
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <FaChartLine />
              </div>
              <div className={styles.metricContent}>
                <h3>Portfolio Performance</h3>
                <p className={styles.metricValue}>+12.5%</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Investment Opportunities</h2>
          
          <div className={styles.opportunityList}>
            <div className={styles.opportunityItem}>
              <div className={styles.opportunityHeader}>
                <h3>TechStart Inc.</h3>
                <span className={styles.opportunityTag}>Series A</span>
              </div>
              <p className={styles.opportunityDesc}>
                AI-powered customer service platform with 200% YoY growth
              </p>
              <div className={styles.opportunityDetails}>
                <div className={styles.opportunityDetail}>
                  <span className={styles.detailLabel}>Seeking:</span>
                  <span className={styles.detailValue}>$2.5M</span>
                </div>
                <div className={styles.opportunityDetail}>
                  <span className={styles.detailLabel}>Valuation:</span>
                  <span className={styles.detailValue}>$12M</span>
                </div>
                <div className={styles.opportunityDetail}>
                  <span className={styles.detailLabel}>Industry:</span>
                  <span className={styles.detailValue}>SaaS</span>
                </div>
              </div>
              <button className={styles.opportunityButton}>View Details</button>
            </div>
            
            <div className={styles.opportunityItem}>
              <div className={styles.opportunityHeader}>
                <h3>GreenEnergy Solutions</h3>
                <span className={styles.opportunityTag}>Series B</span>
              </div>
              <p className={styles.opportunityDesc}>
                Renewable energy storage technology with patented battery design
              </p>
              <div className={styles.opportunityDetails}>
                <div className={styles.opportunityDetail}>
                  <span className={styles.detailLabel}>Seeking:</span>
                  <span className={styles.detailValue}>$5M</span>
                </div>
                <div className={styles.opportunityDetail}>
                  <span className={styles.detailLabel}>Valuation:</span>
                  <span className={styles.detailValue}>$30M</span>
                </div>
                <div className={styles.opportunityDetail}>
                  <span className={styles.detailLabel}>Industry:</span>
                  <span className={styles.detailValue}>CleanTech</span>
                </div>
              </div>
              <button className={styles.opportunityButton}>View Details</button>
            </div>
          </div>
          
          <button className={styles.viewAllButton}>View All Opportunities</button>
        </div>
        
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Your Documents</h2>
          
          <div className={styles.documentList}>
            <div className={styles.documentItem}>
              <div className={styles.documentIcon}>
                <FaFileAlt />
              </div>
              <div className={styles.documentContent}>
                <h4>TechStart Inc. Due Diligence Report</h4>
                <p>Uploaded on Jun 5, 2023</p>
              </div>
              <button className={styles.documentButton}>View</button>
            </div>
            
            <div className={styles.documentItem}>
              <div className={styles.documentIcon}>
                <FaFileAlt />
              </div>
              <div className={styles.documentContent}>
                <h4>GreenEnergy Solutions Pitch Deck</h4>
                <p>Uploaded on May 28, 2023</p>
              </div>
              <button className={styles.documentButton}>View</button>
            </div>
            
            <div className={styles.documentItem}>
              <div className={styles.documentIcon}>
                <FaFileAlt />
              </div>
              <div className={styles.documentContent}>
                <h4>Q2 2023 Portfolio Report</h4>
                <p>Uploaded on May 15, 2023</p>
              </div>
              <button className={styles.documentButton}>View</button>
            </div>
          </div>
          
          <button className={styles.viewAllButton}>View All Documents</button>
        </div>
        
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Contact Your Investment Manager</h2>
          
          <div className={styles.contactCard}>
            <div className={styles.contactInfo}>
              <h3>Sarah Johnson</h3>
              <p>Investment Relations Manager</p>
              <p><FaEnvelope className={styles.contactIcon} /> sarah.johnson@ftfc.com</p>
            </div>
            <button className={styles.contactButton}>Schedule Meeting</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorPortal;
