import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaChevronDown, FaChevronUp, FaFileAlt, FaVideo } from 'react-icons/fa';
import { useStatsView } from '../../context/StatsViewContext';
import { getMeetingRecordings, getStoredTokens, listUpcomingEvents } from '../../services/googleIntegration';
import styles from './Integrations.module.css';
import MeetingTranscriptList from './MeetingTranscriptList';

/**
 * Meeting History Component
 *
 * This component displays a list of past and upcoming meetings,
 * along with their recordings and transcripts if available.
 */
const MeetingHistory = ({
  entityType, // 'client', 'investor', or 'partner'
  entityId    // ID of the entity
}) => {
  const [meetings, setMeetings] = useState([]);
  const [expandedMeetingId, setExpandedMeetingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTranscripts, setShowTranscripts] = useState(false);
  const { viewCompanyStats } = useStatsView();

  // Fetch meetings on component mount or when viewCompanyStats changes
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setIsLoading(true);
        const tokens = getStoredTokens();

        if (!tokens) {
          throw new Error('Not connected to Google Calendar');
        }

        // Get upcoming and past events, respecting the company/user toggle
        const events = await listUpcomingEvents(
          tokens,
          10,
          true, // includePast
          viewCompanyStats, // companyWide - use the stats toggle value
          entityType,
          entityId
        );

        // Process events
        const processedMeetings = await Promise.all(events.map(async (event) => {
          // Check if event has a Google Meet link
          const isMeetEvent = event.conferenceData?.conferenceId &&
                             event.conferenceData?.conferenceSolution?.name === 'Google Meet';

          // Get recordings if it's a Meet event
          let recordings = [];
          if (isMeetEvent) {
            try {
              recordings = await getMeetingRecordings(tokens, event.conferenceData.conferenceId);
            } catch (err) {
              console.log('No recordings found for meeting:', event.conferenceData.conferenceId);
            }
          }

          // Determine if the meeting is in the past
          const now = new Date();
          const endTime = new Date(event.end.dateTime || event.end.date);
          const isPast = endTime < now;

          return {
            id: event.id,
            title: event.summary,
            description: event.description,
            startTime: event.start.dateTime || event.start.date,
            endTime: event.end.dateTime || event.end.date,
            attendees: event.attendees || [],
            meetLink: isMeetEvent ? event.hangoutLink : null,
            conferenceId: isMeetEvent ? event.conferenceData.conferenceId : null,
            recordings,
            isPast
          };
        }));

        // Sort meetings: upcoming first, then past
        const sortedMeetings = processedMeetings.sort((a, b) => {
          if (a.isPast === b.isPast) {
            // If both are past or both are upcoming, sort by date (newest first for past, soonest first for upcoming)
            return a.isPast
              ? new Date(b.startTime) - new Date(a.startTime) // Past meetings: newest first
              : new Date(a.startTime) - new Date(b.startTime); // Upcoming meetings: soonest first
          }
          return a.isPast ? 1 : -1; // Upcoming meetings first
        });

        setMeetings(sortedMeetings);
      } catch (error) {
        console.error('Error fetching meetings:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, [entityType, entityId, viewCompanyStats]); // Re-fetch when viewCompanyStats changes

  // Toggle meeting expansion
  const toggleMeeting = (meetingId) => {
    setExpandedMeetingId(expandedMeetingId === meetingId ? null : meetingId);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading meetings...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (meetings.length === 0) {
    return (
      <div className={styles.noMeetings}>
        <p>No meetings found</p>
      </div>
    );
  }

  return (
    <div className={styles.meetingHistory}>
      <div className={styles.meetingHistoryHeader}>
        {entityType && entityId && (
          <div className={styles.transcriptsToggle}>
            <button
              className={styles.toggleButton}
              onClick={() => setShowTranscripts(!showTranscripts)}
            >
              {showTranscripts ? 'Show Meetings' : 'Show Transcripts'}
            </button>
          </div>
        )}

        <div className={styles.dataSourceIndicator}>
          Showing {viewCompanyStats ? 'all company' : 'your'} meetings
        </div>
      </div>

      {showTranscripts && entityType && entityId ? (
        <MeetingTranscriptList
          entityType={entityType}
          entityId={entityId}
        />
      ) : (
        <div className={styles.meetingsList}>
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className={`${styles.meetingItem} ${meeting.isPast ? styles.past : styles.upcoming}`}
            >
              <div
                className={styles.meetingHeader}
                onClick={() => toggleMeeting(meeting.id)}
              >
                <div className={styles.meetingTitle}>
                  <FaCalendarAlt className={styles.meetingIcon} />
                  {meeting.title}
                </div>
                <div className={styles.meetingTime}>
                  {formatDate(meeting.startTime)} {formatTime(meeting.startTime)}
                </div>
                <div className={styles.meetingStatus}>
                  {meeting.isPast ? 'Completed' : 'Upcoming'}
                </div>
                <div className={styles.meetingExpand}>
                  {expandedMeetingId === meeting.id ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>

              {expandedMeetingId === meeting.id && (
                <div className={styles.meetingDetails}>
                  {meeting.description && (
                    <div className={styles.meetingDescription}>
                      <h4>Description</h4>
                      <p>{meeting.description}</p>
                    </div>
                  )}

                  {meeting.attendees.length > 0 && (
                    <div className={styles.meetingAttendees}>
                      <h4>Attendees</h4>
                      <ul>
                        {meeting.attendees.map((attendee, index) => (
                          <li key={index}>{attendee.email}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {meeting.recordings.length > 0 && (
                    <div className={styles.meetingRecordings}>
                      <h4>Recordings</h4>
                      <ul>
                        {meeting.recordings.map((recording, index) => (
                          <li key={index}>
                            <a
                              href={recording.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaFileAlt /> Recording {index + 1}
                            </a>
                            <span className={styles.recordingDate}>
                              {formatDate(recording.createdTime)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!meeting.isPast && meeting.meetLink && (
                    <div className={styles.meetingJoin}>
                      <h4>Join Meeting</h4>
                      <a
                        href={meeting.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.joinButton}
                      >
                        <FaVideo /> Join Google Meet
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MeetingHistory;
