import React, { useEffect, useState } from 'react';
import { getMeetingRecordings, getStoredTokens, listUpcomingEvents } from '../../services/googleIntegration';

/**
 * Meeting History Component
 *
 * This component displays a list of past and upcoming meetings,
 * along with their recordings if available.
 */
const MeetingHistory = () => {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMeeting, setExpandedMeeting] = useState(null);
  const [recordings, setRecordings] = useState({});

  // Fetch meetings on component mount
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const tokens = getStoredTokens();

        if (!tokens) {
          throw new Error('Not connected to Google Calendar');
        }

        const events = await listUpcomingEvents(tokens, 20);

        // Filter for Google Meet events
        const meetEvents = events.filter(event =>
          event.conferenceData &&
          event.conferenceData.conferenceSolution &&
          event.conferenceData.conferenceSolution.key.type === 'hangoutsMeet'
        );

        setMeetings(meetEvents);
      } catch (error) {
        console.error('Error fetching meetings:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  // Fetch recordings for a meeting
  const fetchRecordings = async (meetingId) => {
    try {
      const tokens = getStoredTokens();

      if (!tokens) {
        throw new Error('Not connected to Google Calendar');
      }

      const recordingFiles = await getMeetingRecordings(tokens, meetingId);

      setRecordings(prev => ({
        ...prev,
        [meetingId]: recordingFiles
      }));
    } catch (error) {
      console.error('Error fetching recordings:', error);
    }
  };

  // Handle meeting expansion
  const handleExpandMeeting = (meetingId) => {
    if (expandedMeeting === meetingId) {
      setExpandedMeeting(null);
    } else {
      setExpandedMeeting(meetingId);

      // Fetch recordings if not already fetched
      if (!recordings[meetingId]) {
        fetchRecordings(meetingId);
      }
    }
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

  // Check if meeting is in the past
  const isPastMeeting = (endTimeString) => {
    const endTime = new Date(endTimeString);
    return endTime < new Date();
  };

  if (isLoading) {
    return <div className="loading">Loading meetings...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        Error: {error}
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="no-meetings">
        No Google Meet meetings found.
      </div>
    );
  }

  return (
    <div className="meeting-history">
      <h3>Meeting History</h3>

      <div className="meetings-list">
        {meetings.map(meeting => (
          <div
            key={meeting.id}
            className={`meeting-item ${isPastMeeting(meeting.end.dateTime) ? 'past' : 'upcoming'}`}
          >
            <div
              className="meeting-header"
              onClick={() => handleExpandMeeting(meeting.id)}
            >
              <div className="meeting-title">
                {meeting.summary}
              </div>
              <div className="meeting-time">
                {formatDate(meeting.start.dateTime)} • {formatTime(meeting.start.dateTime)} - {formatTime(meeting.end.dateTime)}
              </div>
              <div className="meeting-status">
                {isPastMeeting(meeting.end.dateTime) ? 'Completed' : 'Upcoming'}
              </div>
              <div className="meeting-expand">
                {expandedMeeting === meeting.id ? '▼' : '▶'}
              </div>
            </div>

            {expandedMeeting === meeting.id && (
              <div className="meeting-details">
                {meeting.description && (
                  <div className="meeting-description">
                    <h4>Description</h4>
                    <p>{meeting.description}</p>
                  </div>
                )}

                <div className="meeting-attendees">
                  <h4>Attendees</h4>
                  {meeting.attendees ? (
                    <ul>
                      {meeting.attendees.map((attendee, index) => (
                        <li key={index}>
                          {attendee.email}
                          {attendee.organizer && ' (Organizer)'}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No attendees</p>
                  )}
                </div>

                {isPastMeeting(meeting.end.dateTime) && (
                  <div className="meeting-recordings">
                    <h4>Recordings</h4>
                    {recordings[meeting.id] ? (
                      recordings[meeting.id].length > 0 ? (
                        <ul>
                          {recordings[meeting.id].map(recording => (
                            <li key={recording.id}>
                              <a
                                href={recording.webViewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {recording.name}
                              </a>
                              <span className="recording-date">
                                {new Date(recording.createdTime).toLocaleDateString()}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No recordings found</p>
                      )
                    ) : (
                      <p>Loading recordings...</p>
                    )}
                  </div>
                )}

                {meeting.conferenceData && meeting.conferenceData.entryPoints && (
                  <div className="meeting-join">
                    <h4>Join Meeting</h4>
                    {meeting.conferenceData.entryPoints.map((entryPoint, index) => (
                      <div key={index} className="entry-point">
                        {entryPoint.entryPointType === 'video' && (
                          <a
                            href={entryPoint.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="join-button"
                          >
                            Join with Google Meet
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingHistory;
