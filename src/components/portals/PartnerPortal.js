import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { FaFileAlt, FaChartLine, FaUsers, FaEnvelope } from 'react-icons/fa';
import styles from './Portal.module.css';
import TeamMemberCard from '../common/TeamMemberCard';
import ReferralLink from '../common/ReferralLink';
import MeetingSection from '../common/MeetingSection';

const PartnerPortal = () => {
  const { user, hasRole, USER_ROLES } = useAuth();
  const [showBookingModal, setShowBookingModal] = useState(false);

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

  // Sample data - in a real app, this would come from your backend
  const partnerData = {
    name: 'Robert Partner',
    totalReferrals: 15,
    activeReferrals: 8,
    totalCommission: '$5,400',
    assignedTeamMember: {
      name: 'David Wilson',
      title: 'Partner Relations Manager',
      email: 'david.wilson@ftfc.com',
      phone: '(555) 456-7890',
      imageSrc: '/images/team-member-3.jpg'
    },
    // Upcoming meeting - set to null to show the booking button
    upcomingMeeting: {
      title: 'Monthly Partner Review',
      date: 'June 20, 2023',
      time: '2:00 PM EST',
      type: 'video'
    },
    referrals: [
      {
        companyName: 'Acme Corporation',
        status: 'Pending',
        contact: 'John Smith',
        date: 'Jun 5, 2023',
        service: 'Startup Funding'
      },
      {
        companyName: 'TechGrowth Inc.',
        status: 'Converted',
        contact: 'Sarah Johnson',
        date: 'May 22, 2023',
        service: 'Growth Capital',
        commission: '$1,800'
      },
      {
        companyName: 'InnovateCo',
        status: 'In Progress',
        contact: 'Michael Brown',
        date: 'May 15, 2023',
        service: 'Series A Funding'
      }
    ],
    marketingMaterials: [
      {
        title: 'FTFC Services Overview',
        type: 'PDF'
      },
      {
        title: 'Partner Program Guide',
        type: 'PDF'
      }
    ]
  };

  const handleBookMeeting = () => {
    setShowBookingModal(true);
    // In a real app, you would open a booking modal or redirect to a booking page
    console.log('Book meeting clicked');
  };

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
                <FaUsers />
              </div>
              <div className={styles.metricContent}>
                <h3>Total Referrals</h3>
                <p className={styles.metricValue}>{partnerData.totalReferrals}</p>
              </div>
            </div>
            
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <FaChartLine />
              </div>
              <div className={styles.metricContent}>
                <h3>Active Referrals</h3>
                <p className={styles.metricValue}>{partnerData.activeReferrals}</p>
              </div>
            </div>
            
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <FaChartLine />
              </div>
              <div className={styles.metricContent}>
                <h3>Total Commission</h3>
                <p className={styles.metricValue}>{partnerData.totalCommission}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Meeting Section */}
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Meetings</h2>
          <MeetingSection 
            meeting={partnerData.upcomingMeeting} 
            onBookMeeting={handleBookMeeting} 
          />
        </div>
        
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Your Referrals</h2>
          
          <div className={styles.referralList}>
            {partnerData.referrals.map((referral, index) => (
              <div key={index} className={styles.referralItem}>
                <div className={styles.referralHeader}>
                  <h3>{referral.companyName}</h3>
                  <span className={`${styles.referralStatus} ${styles[`status${referral.status.replace(/\s+/g, '')}`]}`}>
                    {referral.status}
                  </span>
                </div>
                <div className={styles.referralDetails}>
                  <div className={styles.referralDetail}>
                    <span className={styles.detailLabel}>Contact:</span>
                    <span className={styles.detailValue}>{referral.contact}</span>
                  </div>
                  <div className={styles.referralDetail}>
                    <span className={styles.detailLabel}>Date:</span>
                    <span className={styles.detailValue}>{referral.date}</span>
                  </div>
                  <div className={styles.referralDetail}>
                    <span className={styles.detailLabel}>Service:</span>
                    <span className={styles.detailValue}>{referral.service}</span>
                  </div>
                </div>
                {referral.commission && (
                  <div className={styles.referralCommission}>
                    <span className={styles.commissionLabel}>Commission:</span>
                    <span className={styles.commissionValue}>{referral.commission}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <button className={styles.viewAllButton}>View All Referrals</button>
        </div>
        
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Your Referral Tools</h2>
          
          <div className={styles.toolsGrid}>
            {/* Referral Link */}
            <div className={styles.toolCard}>
              <h3>Referral Link</h3>
              <p>Share this unique link with potential clients</p>
              <ReferralLink 
                userId={user?.uid || 'partner123'} 
                type="client" 
                title="" 
              />
            </div>
            
            {/* Marketing Materials */}
            <div className={styles.toolCard}>
              <h3>Marketing Materials</h3>
              <p>Download resources to share with potential clients</p>
              <div className={styles.documentList}>
                {partnerData.marketingMaterials.map((material, index) => (
                  <div key={index} className={styles.documentItem}>
                    <div className={styles.documentIcon}>
                      <FaFileAlt />
                    </div>
                    <div className={styles.documentContent}>
                      <h4>{material.title}</h4>
                    </div>
                    <button className={styles.documentButton}>Download</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Team Member Card Section */}
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Your Partner Manager</h2>
          <TeamMemberCard 
            name={partnerData.assignedTeamMember.name}
            title={partnerData.assignedTeamMember.title}
            email={partnerData.assignedTeamMember.email}
            phone={partnerData.assignedTeamMember.phone}
            imageSrc={partnerData.assignedTeamMember.imageSrc}
          />
        </div>
      </div>
    </div>
  );
};

export default PartnerPortal;
