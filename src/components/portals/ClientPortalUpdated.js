import React, { useEffect, useState } from 'react';
import { FaChartLine, FaFileAlt } from 'react-icons/fa';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GoalSection from '../common/GoalSection';
import MeetingSection from '../common/MeetingSection';
import MilestoneList from '../common/MilestoneList';
import ReferralLink from '../common/ReferralLink';
import TeamMemberCard from '../common/TeamMemberCard';
import CalendlyBookingLink from '../integrations/CalendlyBookingLink';
import GoogleCalendarConnect from '../integrations/GoogleCalendarConnect';
import MeetingHistory from '../integrations/MeetingHistoryUpdated';
import MeetingScheduler from '../integrations/MeetingScheduler';
import MeetingTranscriptList from '../meetings/MeetingTranscriptList';
import styles from './Portal.module.css';

const ClientPortal = () => {
  const { user, hasRole, USER_ROLES } = useAuth();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showMeetingScheduler, setShowMeetingScheduler] = useState(false);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);

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

  // Handle booking meeting
  const handleBookMeeting = () => {
    if (isCalendarConnected) {
      setShowMeetingScheduler(true);
    } else {
      setShowBookingModal(true);
    }
  };

  // Handle calendar connection
  const handleCalendarConnect = (tokens, profile) => {
    setIsCalendarConnected(true);
  };

  // Handle calendar disconnection
  const handleCalendarDisconnect = () => {
    setIsCalendarConnected(false);
  };

  // Handle meeting scheduled
  const handleMeetingScheduled = (event) => {
    setShowMeetingScheduler(false);
    // In a real app, you would update the client data with the new meeting
  };

  // Mock client data - in a real app, this would come from your backend
  const clientData = {
    name: 'Acme Corporation',
    status: 'Active',
    documentCount: 12,
    assignedTeamMember: {
      id: '1', // Added team member ID for Calendly booking
      name: 'John Smith',
      title: 'Financial Advisor',
      email: 'john.smith@ftfc.com',
      phone: '(555) 123-4567',
      imageSrc: '/images/team-member-1.jpg'
    },
    upcomingMeeting: null, // Set to null to show the booking button
    milestones: [
      {
        id: '1',
        title: 'Initial Consultation',
        description: 'Discuss funding needs and options',
        status: 'completed',
        date: 'May 1, 2023'
      },
      {
        id: '2',
        title: 'Financial Documentation',
        description: 'Prepare and submit financial statements',
        status: 'completed',
        date: 'May 15, 2023'
      },
      {
        id: '3',
        title: 'Term Sheet Review',
        description: 'Review and negotiate term sheet',
        status: 'in-progress',
        date: 'June 1, 2023'
      },
      {
        id: '4',
        title: 'Due Diligence',
        description: 'Complete investor due diligence process',
        status: 'pending',
        date: 'June 15, 2023'
      },
      {
        id: '5',
        title: 'Funding',
        description: 'Receive initial funding',
        status: 'pending',
        date: 'July 1, 2023'
      }
    ],
    goals: [
      {
        id: '1',
        title: 'Series A Funding',
        target: '$2,000,000',
        current: '$1,500,000',
        progress: 75
      },
      {
        id: '2',
        title: 'Monthly Revenue',
        target: '$100,000',
        current: '$85,000',
        progress: 85
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
    documentList: [
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

  return (
    <div className={styles.portalContainer}>
      <div className={styles.portalHeader}>
        <h1 className={styles.portalTitle}>Client Portal</h1>
        <div className={styles.portalStatus}>
          <span className={styles.statusLabel}>Status:</span>
          <span className={styles.statusValue}>{clientData.status}</span>
        </div>
      </div>

      <div className={styles.portalContent}>
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>
            <FaChartLine className={styles.sectionIcon} />
            Goals
          </h2>
          <GoalSection goals={clientData.goals} />
        </div>

        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Milestones</h2>
          <MilestoneList milestones={clientData.milestones} />
        </div>

        {/* Google Calendar Integration Section */}
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Calendar Integration</h2>
          <GoogleCalendarConnect
            onConnect={handleCalendarConnect}
            onDisconnect={handleCalendarDisconnect}
          />

          {isCalendarConnected && (
            <div className={styles.calendarActions}>
              <button
                className={styles.scheduleButton}
                onClick={() => setShowMeetingScheduler(!showMeetingScheduler)}
              >
                {showMeetingScheduler ? 'Hide Scheduler' : 'Schedule a Meeting'}
              </button>

              {showMeetingScheduler && (
                <MeetingScheduler
                  onScheduled={handleMeetingScheduled}
                  contactEmail={user?.email}
                  entityType="client"
                  entityId={user?.uid || '123'}
                  entityName={clientData.name}
                />
              )}
            </div>
          )}
        </div>

        {/* Meeting Section */}
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Upcoming Meeting</h2>
          <MeetingSection
            meeting={clientData.upcomingMeeting}
            onBookMeeting={handleBookMeeting}
          />
        </div>

        {/* Calendly Booking Link - Show when no Google Calendar connection */}
        {!isCalendarConnected && (
          <div className={styles.portalSection}>
            <h2 className={styles.sectionTitle}>Schedule a Meeting</h2>
            <CalendlyBookingLink
              teamMemberId={clientData.assignedTeamMember.id}
              teamMemberName={clientData.assignedTeamMember.name}
              entityType="client"
              entityId={user?.uid || '123'}
              entityName={clientData.name}
            />
          </div>
        )}

        {/* Meeting History Section - Only show if calendar is connected */}
        {isCalendarConnected && (
          <div className={styles.portalSection}>
            <h2 className={styles.sectionTitle}>Meeting History</h2>
            <MeetingHistory
              entityType="client"
              entityId={user?.uid || '123'}
            />
          </div>
        )}

        {/* Meeting Transcripts Section */}
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Meeting Transcripts</h2>
          <MeetingTranscriptList
            entityType="client"
            entityId={user?.uid || '123'}
            readOnly={true} // Client portal is read-only (no Google auth needed)
          />
        </div>

        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Documents</h2>

          <div className={styles.documentList}>
            {clientData.documentList.map((document, index) => (
              <div key={index} className={styles.documentItem}>
                <div className={styles.documentIcon}>
                  <FaFileAlt />
                </div>
                <div className={styles.documentContent}>
                  <h4>{document.title}</h4>
                  <p>Uploaded: {document.date}</p>
                </div>
                <button className={styles.documentButton}>View</button>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Refer a Company</h2>
          <ReferralLink
            type="client"
            referrerId={user?.uid || '123'}
            referrerName={clientData.name}
          />
        </div>

        {/* Team Member Card Section */}
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Your FTFC Advisor</h2>
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
