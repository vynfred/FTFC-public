import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { FaFileAlt, FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import styles from './Portal.module.css';
import TeamMemberCard from '../common/TeamMemberCard';
import MilestoneList from '../common/MilestoneList';
import ReferralLink from '../common/ReferralLink';
import MeetingSection from '../common/MeetingSection';

const ClientPortal = () => {
  const { user, hasRole, USER_ROLES } = useAuth();
  const [showBookingModal, setShowBookingModal] = useState(false);

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

  // Sample data - in a real app, this would come from your backend
  const clientData = {
    name: 'Acme Corporation',
    status: 'Active',
    documents: 12,
    assignedTeamMember: {
      name: 'John Smith',
      title: 'Financial Advisor',
      email: 'john.smith@ftfc.com',
      phone: '(555) 123-4567',
      imageSrc: '/images/team-member-1.jpg'
    },
    // Upcoming meeting - set to null to show the booking button
    upcomingMeeting: {
      title: 'Quarterly Review',
      date: 'June 15, 2023',
      time: '10:00 AM EST',
      type: 'video'
    },
    // Milestones with completion status
    milestones: [
      {
        title: 'Initial Consultation',
        completed: true,
        date: 'May 1, 2023'
      },
      {
        title: 'Business Plan Review',
        completed: true,
        date: 'May 15, 2023'
      },
      {
        title: 'Financial Projections',
        completed: true,
        date: 'May 30, 2023'
      },
      {
        title: 'Pitch Deck Creation',
        completed: false,
        description: 'In progress - scheduled for completion by June 20'
      },
      {
        title: 'Investor Introductions',
        completed: false
      }
    ],
    recentActivity: [
      {
        date: 'Jun 1, 2023',
        title: 'Document Uploaded',
        description: 'Financial Statement Q2 2023'
      },
      {
        date: 'May 28, 2023',
        title: 'Meeting Completed',
        description: 'Quarterly Review with John Smith'
      },
      {
        date: 'May 15, 2023',
        title: 'Funding Milestone',
        description: 'Series A Documentation Completed'
      }
    ],
    documents: [
      {
        title: 'Financial Statement Q2 2023',
        date: 'Jun 1, 2023'
      },
      {
        title: 'Series A Term Sheet',
        date: 'May 15, 2023'
      },
      {
        title: 'Business Plan 2023',
        date: 'Apr 10, 2023'
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
        <h1>Welcome to Your Client Portal</h1>
        <p>Access your financial information and services</p>
      </div>

      <div className={styles.portalContent}>
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Overview</h2>
          
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <FaChartLine />
              </div>
              <div className={styles.metricContent}>
                <h3>Current Status</h3>
                <p className={styles.metricValue}>{clientData.status}</p>
              </div>
            </div>
            
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <FaFileAlt />
              </div>
              <div className={styles.metricContent}>
                <h3>Documents</h3>
                <p className={styles.metricValue}>{clientData.documents}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Milestones Section */}
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Your Milestones</h2>
          <MilestoneList milestones={clientData.milestones} />
        </div>
        
        {/* Meeting Section */}
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Meetings</h2>
          <MeetingSection 
            meeting={clientData.upcomingMeeting} 
            onBookMeeting={handleBookMeeting} 
          />
        </div>
        
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>
          
          <div className={styles.activityList}>
            {clientData.recentActivity.map((activity, index) => (
              <div key={index} className={styles.activityItem}>
                <div className={styles.activityDate}>{activity.date}</div>
                <div className={styles.activityContent}>
                  <h4>{activity.title}</h4>
                  <p>{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Your Documents</h2>
          
          <div className={styles.documentList}>
            {clientData.documents.map((document, index) => (
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
          <h2 className={styles.sectionTitle}>Refer a Company</h2>
          <ReferralLink 
            userId={user?.uid || 'client123'} 
            type="client" 
            title="Your Company Referral Link" 
          />
        </div>
        
        {/* Team Member Card Section */}
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Your Advisor</h2>
          <TeamMemberCard 
            name={clientData.assignedTeamMember.name}
            title={clientData.assignedTeamMember.title}
            email={clientData.assignedTeamMember.email}
            phone={clientData.assignedTeamMember.phone}
            imageSrc={clientData.assignedTeamMember.imageSrc}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientPortal;
