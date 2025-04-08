import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { FaFileAlt, FaChartLine, FaUserPlus, FaEnvelope, FaDollarSign } from 'react-icons/fa';
import styles from './Portal.module.css';

const PartnerPortal = () => {
  const { user, hasRole, USER_ROLES } = useAuth();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = 'FTFC | Partner Portal';
  }, []);

  // Security check - only partners can access this portal
  if (!hasRole(USER_ROLES.PARTNER)) {
    return <Navigate to="/partner-login" replace />;
  }

  return (
    <div className={styles.portalContainer}>
      <div className={styles.portalHeader}>
        <h1>Welcome to Your Partner Portal</h1>
        <p>Manage your referrals and track your commissions</p>
      </div>

      <div className={styles.portalContent}>
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Referral Performance</h2>
          
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <FaUserPlus />
              </div>
              <div className={styles.metricContent}>
                <h3>Total Referrals</h3>
                <p className={styles.metricValue}>24</p>
              </div>
            </div>
            
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <FaChartLine />
              </div>
              <div className={styles.metricContent}>
                <h3>Conversion Rate</h3>
                <p className={styles.metricValue}>42%</p>
              </div>
            </div>
            
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <FaDollarSign />
              </div>
              <div className={styles.metricContent}>
                <h3>Commission Earned</h3>
                <p className={styles.metricValue}>$12,450</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Recent Referrals</h2>
          
          <div className={styles.referralList}>
            <div className={styles.referralItem}>
              <div className={styles.referralHeader}>
                <h3>Acme Corporation</h3>
                <span className={`${styles.referralStatus} ${styles.statusPending}`}>Pending</span>
              </div>
              <div className={styles.referralDetails}>
                <div className={styles.referralDetail}>
                  <span className={styles.detailLabel}>Contact:</span>
                  <span className={styles.detailValue}>John Smith</span>
                </div>
                <div className={styles.referralDetail}>
                  <span className={styles.detailLabel}>Date:</span>
                  <span className={styles.detailValue}>Jun 5, 2023</span>
                </div>
                <div className={styles.referralDetail}>
                  <span className={styles.detailLabel}>Service:</span>
                  <span className={styles.detailValue}>Startup Funding</span>
                </div>
              </div>
            </div>
            
            <div className={styles.referralItem}>
              <div className={styles.referralHeader}>
                <h3>TechGrowth Inc.</h3>
                <span className={`${styles.referralStatus} ${styles.statusConverted}`}>Converted</span>
              </div>
              <div className={styles.referralDetails}>
                <div className={styles.referralDetail}>
                  <span className={styles.detailLabel}>Contact:</span>
                  <span className={styles.detailValue}>Sarah Johnson</span>
                </div>
                <div className={styles.referralDetail}>
                  <span className={styles.detailLabel}>Date:</span>
                  <span className={styles.detailValue}>May 22, 2023</span>
                </div>
                <div className={styles.referralDetail}>
                  <span className={styles.detailLabel}>Service:</span>
                  <span className={styles.detailValue}>Growth Capital</span>
                </div>
              </div>
              <div className={styles.referralCommission}>
                <span className={styles.commissionLabel}>Commission:</span>
                <span className={styles.commissionValue}>$2,500</span>
              </div>
            </div>
            
            <div className={styles.referralItem}>
              <div className={styles.referralHeader}>
                <h3>Global Solutions LLC</h3>
                <span className={`${styles.referralStatus} ${styles.statusConverted}`}>Converted</span>
              </div>
              <div className={styles.referralDetails}>
                <div className={styles.referralDetail}>
                  <span className={styles.detailLabel}>Contact:</span>
                  <span className={styles.detailValue}>Michael Brown</span>
                </div>
                <div className={styles.referralDetail}>
                  <span className={styles.detailLabel}>Date:</span>
                  <span className={styles.detailValue}>May 10, 2023</span>
                </div>
                <div className={styles.referralDetail}>
                  <span className={styles.detailLabel}>Service:</span>
                  <span className={styles.detailValue}>Financial Consulting</span>
                </div>
              </div>
              <div className={styles.referralCommission}>
                <span className={styles.commissionLabel}>Commission:</span>
                <span className={styles.commissionValue}>$1,800</span>
              </div>
            </div>
          </div>
          
          <button className={styles.viewAllButton}>View All Referrals</button>
        </div>
        
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Your Referral Tools</h2>
          
          <div className={styles.toolsGrid}>
            <div className={styles.toolCard}>
              <h3>Referral Link</h3>
              <p>Share this unique link with potential clients</p>
              <div className={styles.linkContainer}>
                <input 
                  type="text" 
                  value="https://ftfc.com/ref/partner123" 
                  readOnly 
                  className={styles.linkInput}
                />
                <button className={styles.copyButton}>Copy</button>
              </div>
            </div>
            
            <div className={styles.toolCard}>
              <h3>Marketing Materials</h3>
              <p>Download resources to share with potential clients</p>
              <div className={styles.documentList}>
                <div className={styles.documentItem}>
                  <div className={styles.documentIcon}>
                    <FaFileAlt />
                  </div>
                  <div className={styles.documentContent}>
                    <h4>FTFC Services Overview</h4>
                  </div>
                  <button className={styles.documentButton}>Download</button>
                </div>
                
                <div className={styles.documentItem}>
                  <div className={styles.documentIcon}>
                    <FaFileAlt />
                  </div>
                  <div className={styles.documentContent}>
                    <h4>Partner Program Guide</h4>
                  </div>
                  <button className={styles.documentButton}>Download</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Contact Your Partner Manager</h2>
          
          <div className={styles.contactCard}>
            <div className={styles.contactInfo}>
              <h3>David Wilson</h3>
              <p>Partner Relations Manager</p>
              <p><FaEnvelope className={styles.contactIcon} /> david.wilson@ftfc.com</p>
            </div>
            <button className={styles.contactButton}>Schedule Meeting</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerPortal;
