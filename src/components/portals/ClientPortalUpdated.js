import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaChartLine, FaFileAlt } from 'react-icons/fa';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GoalSection from '../common/GoalSection';
import MeetingSection from '../common/MeetingSection';
import MilestoneList from '../common/MilestoneList';
import ReferralLink from '../common/ReferralLink';
import TeamMemberCard from '../common/TeamMemberCard';
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

  // Sample data - in a real app, this would come from your backend
  const clientData = {
    name: 'Acme Startup',
    status: 'Series A Ready',
    documentCount: 12,
    assignedTeamMember: {
      name: 'John Smith',
      title: 'Senior Advisor',
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
    goals: [
      {
        title: 'Complete Series A Funding',
        progress: 75,
        description: 'Raise $5M in Series A funding by Q3 2023'
      },
      {
        title: 'Expand Team',
        progress: 40,
        description: 'Hire key leadership positions: CTO, CMO, and COO'
      },
      {
        title: 'Product Launch',
        progress: 90,
        description: 'Launch MVP to early adopters by end of Q2'
      }
    ],
    milestones: [
      {
        title: 'Financial Model Review',
        completed: true,
        date: 'May 1, 2023'
      },
      {
        title: 'Pitch Deck Finalization',
        completed: true,
        date: 'May 15, 2023'
      },
      {
        title: 'Investor Introductions',
        completed: false,
        date: 'June 30, 2023'
      },
      {
        title: 'Term Sheet Negotiation',
        completed: false,
        date: 'July 15, 2023'
      }
    ],
    recentActivity: [
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
    documentList: [ // Changed from documents to documentList to avoid conflict
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
        <h1>Welcome to Your Client Portal</h1>
        <p>Here's everything you need to know about your engagement with FTFC</p>
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
                <p className={styles.metricValue}>{clientData.documentCount}</p>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <FaCalendarAlt />
              </div>
              <div className={styles.metricContent}>
                <h3>Calendar</h3>
                <p className={styles.metricValue}>
                  {isCalendarConnected ? 'Connected' : 'Not Connected'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Your Team</h2>
          <TeamMemberCard teamMember={clientData.assignedTeamMember} />
        </div>

        {/* Goals Section */}
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Your Goals</h2>
          <GoalSection goals={clientData.goals} />
        </div>

        {/* Milestones Section */}
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Your Milestones</h2>
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
            readOnly={true}
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
      </div>
    </div>
  );
};

export default ClientPortal;
