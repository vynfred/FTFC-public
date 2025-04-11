import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import CalendarIntegration from './CalendarIntegration';
import styles from './Dashboard.module.css';

/**
 * Calendar Page Component
 * 
 * This component serves as a dedicated page for calendar integration
 * in the team dashboard.
 */
const CalendarPage = () => {
  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardSection}>
        <h1 className={styles.sectionTitle}>
          <FaCalendarAlt className={styles.headerIcon} />
          Calendar Integration
        </h1>
        <p className={styles.sectionDescription}>
          Connect your Google Calendar to schedule and manage client meetings
        </p>
        
        <CalendarIntegration />
      </div>
    </div>
  );
};

export default CalendarPage;
