import React from 'react';
import styles from '../DetailPages.module.css';

/**
 * Client meetings component for displaying and managing client meetings
 */
const ClientMeetings = ({ meetings, onScheduleMeeting }) => {
  return (
    <div className={styles.meetingsTab}>
      <div className={styles.tabActions}>
        <button className={styles.addButton} onClick={onScheduleMeeting}>
          Schedule Meeting
        </button>
      </div>
      <div className={styles.meetingsList}>
        {meetings.length === 0 ? (
          <div className={styles.emptyState}>No meetings scheduled</div>
        ) : (
          meetings.map(meeting => (
            <div key={meeting.id} className={styles.meetingItem}>
              <div className={styles.meetingHeader}>
                <h4 className={styles.meetingTitle}>{meeting.title}</h4>
                <div className={styles.meetingDateTime}>
                  {new Date(meeting.date).toLocaleDateString()} at {meeting.time}
                </div>
              </div>
              <div className={styles.meetingAttendees}>
                <span className={styles.attendeesLabel}>Attendees:</span>
                <span className={styles.attendeesList}>
                  {meeting.attendees.join(', ')}
                </span>
              </div>
              {meeting.notes && (
                <div className={styles.meetingNotes}>
                  <h5>Notes:</h5>
                  <p>{meeting.notes}</p>
                </div>
              )}
              <div className={styles.meetingActions}>
                <button className={styles.meetingButton}>View Details</button>
                <button className={styles.meetingButton}>Edit</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientMeetings;
