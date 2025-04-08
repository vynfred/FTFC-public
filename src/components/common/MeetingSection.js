import React from 'react';
import { FaCalendarAlt, FaClock, FaVideo, FaPhone } from 'react-icons/fa';
import styles from './MeetingSection.module.css';

/**
 * MeetingSection component for displaying upcoming meetings or a booking button
 * 
 * @param {Object} props
 * @param {Object} props.meeting - Meeting object with date, time, title, and type properties
 * @param {Function} props.onBookMeeting - Function to call when the book meeting button is clicked
 */
const MeetingSection = ({ meeting, onBookMeeting }) => {
  return (
    <div className={styles.meetingSection}>
      <h3 className={styles.meetingTitle}>Upcoming Meeting</h3>
      
      {meeting ? (
        <div className={styles.meetingCard}>
          <div className={styles.meetingHeader}>
            <h4>{meeting.title}</h4>
            <span className={styles.meetingType}>
              {meeting.type === 'video' ? (
                <FaVideo className={styles.meetingTypeIcon} />
              ) : (
                <FaPhone className={styles.meetingTypeIcon} />
              )}
              {meeting.type === 'video' ? 'Video Call' : 'Phone Call'}
            </span>
          </div>
          <div className={styles.meetingDetails}>
            <div className={styles.meetingDetail}>
              <FaCalendarAlt className={styles.meetingDetailIcon} />
              <span>{meeting.date}</span>
            </div>
            <div className={styles.meetingDetail}>
              <FaClock className={styles.meetingDetailIcon} />
              <span>{meeting.time}</span>
            </div>
          </div>
          <div className={styles.meetingActions}>
            <button className={styles.meetingButton}>Join Meeting</button>
            <button className={styles.meetingButtonOutline}>Reschedule</button>
          </div>
        </div>
      ) : (
        <div className={styles.noMeetingCard}>
          <p className={styles.noMeetingText}>No meetings scheduled</p>
          <button 
            className={styles.bookMeetingButton}
            onClick={onBookMeeting}
          >
            Book a Meeting
          </button>
        </div>
      )}
    </div>
  );
};

export default MeetingSection;
