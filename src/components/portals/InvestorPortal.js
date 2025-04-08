import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { FaFileAlt, FaChartLine, FaBuilding, FaHandshake } from 'react-icons/fa';
import styles from './Portal.module.css';
import TeamMemberCard from '../common/TeamMemberCard';
import ReferralLink from '../common/ReferralLink';
import MeetingSection from '../common/MeetingSection';

const InvestorPortal = () => {
  const { user, hasRole, USER_ROLES } = useAuth();
  const [showBookingModal, setShowBookingModal] = useState(false);

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

  // Sample data - in a real app, this would come from your backend
  const investorData = {
    name: 'Jane Investor',
    activeInvestments: 5,
    pendingDeals: 3,
    assignedTeamMember: {
      name: 'Sarah Johnson',
      title: 'Investment Relations Manager',
      email: 'sarah.johnson@ftfc.com',
      phone: '(555) 987-6543',
      imageSrc: '/images/team-member-2.jpg'
    },
    // Upcoming meeting - set to null to show the booking button
    upcomingMeeting: null, // This will show the "Book a Meeting" button
    opportunities: [
      {
        id: 'opp1',
        companyName: 'TechStart Inc.',
        stage: 'Series A',
        description: 'AI-powered customer service platform with 200% YoY growth',
        seeking: '$2.5M',
        valuation: '$12M',
        industry: 'SaaS'
      },
      {
        id: 'opp2',
        companyName: 'GreenEnergy Solutions',
        stage: 'Seed',
        description: 'Innovative solar panel technology with 40% higher efficiency',
        seeking: '$1.2M',
        valuation: '$5M',
        industry: 'CleanTech'
      }
    ],
    documents: [
      {
        title: 'TechStart Inc. Due Diligence Report',
        date: 'Jun 5, 2023'
      },
      {
        title: 'GreenEnergy Solutions Pitch Deck',
        date: 'May 28, 2023'
      },
      {
        title: 'Q2 2023 Portfolio Report',
        date: 'May 15, 2023'
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
        <h1>Welcome to Your Investor Portal</h1>
        <p>Access your investment opportunities and portfolio</p>
      </div>

      <div className={styles.portalContent}>
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Overview</h2>
          
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <FaBuilding />
              </div>
              <div className={styles.metricContent}>
                <h3>Active Investments</h3>
                <p className={styles.metricValue}>{investorData.activeInvestments}</p>
              </div>
            </div>
            
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <FaHandshake />
              </div>
              <div className={styles.metricContent}>
                <h3>Pending Deals</h3>
                <p className={styles.metricValue}>{investorData.pendingDeals}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Meeting Section */}
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Meetings</h2>
          <MeetingSection 
            meeting={investorData.upcomingMeeting} 
            onBookMeeting={handleBookMeeting} 
          />
        </div>
        
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Investment Opportunities</h2>
          
          <div className={styles.opportunityList}>
            {investorData.opportunities.map((opportunity, index) => (
              <div key={index} className={styles.opportunityItem}>
                <div className={styles.opportunityHeader}>
                  <h3>{opportunity.companyName}</h3>
                  <span className={styles.opportunityTag}>{opportunity.stage}</span>
                </div>
                <p className={styles.opportunityDesc}>
                  {opportunity.description}
                </p>
                <div className={styles.opportunityDetails}>
                  <div className={styles.opportunityDetail}>
                    <span className={styles.detailLabel}>Seeking:</span>
                    <span className={styles.detailValue}>{opportunity.seeking}</span>
                  </div>
                  <div className={styles.opportunityDetail}>
                    <span className={styles.detailLabel}>Valuation:</span>
                    <span className={styles.detailValue}>{opportunity.valuation}</span>
                  </div>
                  <div className={styles.opportunityDetail}>
                    <span className={styles.detailLabel}>Industry:</span>
                    <span className={styles.detailValue}>{opportunity.industry}</span>
                  </div>
                </div>
                <button className={styles.opportunityButton}>View Details</button>
              </div>
            ))}
          </div>
          
          <button className={styles.viewAllButton}>View All Opportunities</button>
        </div>
        
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Your Documents</h2>
          
          <div className={styles.documentList}>
            {investorData.documents.map((document, index) => (
              <div key={index} className={styles.documentItem}>
                <div className={styles.documentIcon}>
                  <FaFileAlt />
                </div>
                <div className={styles.documentContent}>
                  <h4>{document.title}</h4>
                  <p>Uploaded on {document.date}</p>
                </div>
                <button className={styles.documentButton}>View</button>
              </div>
            ))}
          </div>
          
          <button className={styles.viewAllButton}>View All Documents</button>
        </div>
        
        {/* Referral Link Section */}
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Refer an Investor</h2>
          <ReferralLink 
            userId={user?.uid || 'investor123'} 
            type="investor" 
            title="Your Investor Referral Link" 
          />
        </div>
        
        {/* Team Member Card Section */}
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Your Investment Manager</h2>
          <TeamMemberCard 
            name={investorData.assignedTeamMember.name}
            title={investorData.assignedTeamMember.title}
            email={investorData.assignedTeamMember.email}
            phone={investorData.assignedTeamMember.phone}
            imageSrc={investorData.assignedTeamMember.imageSrc}
          />
        </div>
      </div>
    </div>
  );
};

export default InvestorPortal;
