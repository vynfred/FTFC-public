import React, { useEffect, useState } from 'react';
import { createMeetEvent, getStoredTokens } from '../../services/googleIntegration';
import { saveTranscript } from '../../services/meetingTranscriptService';
import { configureAutoRecording, registerMeetingWebhook } from '../../services/meetingWebhookService';

/**
 * Meeting Scheduler Component
 *
 * This component provides a form to schedule Google Meet meetings.
 * It also associates meetings with entities (clients, investors, partners)
 * and sets up transcript processing.
 */
const MeetingScheduler = ({
  onScheduled,
  contactEmail,
  entityType, // 'client', 'investor', or 'partner'
  entityId,   // ID of the entity
  entityName  // Name of the entity
}) => {
  // Generate default meeting title based on entity information
  const generateDefaultTitle = () => {
    if (entityType && entityId && entityName) {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      return `FTFC-${entityType.toUpperCase()}-${entityId}-${formattedDate}-${entityName}`;
    }
    return '';
  };

  const [title, setTitle] = useState(generateDefaultTitle());
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Default to 30 minutes from now
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [duration, setDuration] = useState(30);
  const [attendees, setAttendees] = useState(contactEmail ? [contactEmail] : ['']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Update title when entity information changes
  useEffect(() => {
    if (entityType && entityId && entityName) {
      setTitle(generateDefaultTitle());
    }
  }, [entityType, entityId, entityName]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Get tokens
      const tokens = getStoredTokens();

      if (!tokens) {
        throw new Error('Not connected to Google Calendar');
      }

      // Calculate start and end times
      const startDateTime = new Date(`${date}T${startTime}`);
      const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

      // Filter out empty attendees
      const filteredAttendees = attendees.filter(email => email.trim() !== '');

      // Create event
      const eventDetails = {
        title,
        description,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        attendees: filteredAttendees
      };

      const createdEvent = await createMeetEvent(tokens, eventDetails);

      // If entity information is provided, associate the meeting with the entity
      if (entityType && entityId) {
        // Prepare meeting data for transcript processing
        const meetingData = {
          meetingId: createdEvent.id,
          title: createdEvent.summary,
          date: createdEvent.start.dateTime,
          attendees: createdEvent.attendees?.map(a => a.email) || [],
          entityType,
          entityId,
          entityName
        };

        // Create a placeholder transcript entry that will be updated after the meeting
        const transcriptData = {
          meetingId: createdEvent.id,
          title: createdEvent.summary,
          date: createdEvent.start.dateTime,
          participants: meetingData.attendees,
          transcript: 'Transcript will be available after the meeting.',
          summary: 'Summary will be available after the meeting.',
          keyPoints: [],
          actionItems: [],
          status: 'scheduled'
        };

        // Save the transcript placeholder
        await saveTranscript(transcriptData, entityType, entityId);

        // Register webhook for meeting recording notifications
        await registerMeetingWebhook(createdEvent, entityType, entityId);

        // Configure automatic recording for the meeting
        await configureAutoRecording(createdEvent);
      }

      // Set success
      setSuccess(true);

      // Reset form
      setTitle('');
      setDescription('');
      setDate('');
      setStartTime('');
      setDuration(30);
      setAttendees(['']);

      // Call onScheduled callback if provided
      if (onScheduled) {
        onScheduled(createdEvent);
      }
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding attendee
  const handleAddAttendee = () => {
    setAttendees([...attendees, '']);
  };

  // Handle removing attendee
  const handleRemoveAttendee = (index) => {
    const newAttendees = [...attendees];
    newAttendees.splice(index, 1);
    setAttendees(newAttendees);
  };

  // Handle attendee change
  const handleAttendeeChange = (index, value) => {
    const newAttendees = [...attendees];
    newAttendees[index] = value;
    setAttendees(newAttendees);
  };

  return (
    <div className="meeting-scheduler">
      <h3>Schedule a Google Meet</h3>

      {success && (
        <div className="success-message">
          Meeting scheduled successfully!
        </div>
      )}

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Meeting Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <small className="form-text text-muted">
            Using the format: FTFC-[EntityType]-[EntityID]-[Date]-[EntityName]
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="startTime">Start Time</label>
            <input
              type="time"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration (minutes)</label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Attendees</label>
          {attendees.map((attendee, index) => (
            <div key={index} className="attendee-row">
              <input
                type="email"
                value={attendee}
                onChange={(e) => handleAttendeeChange(index, e.target.value)}
                placeholder="Email address"
                required
              />
              {attendees.length > 1 && (
                <button
                  type="button"
                  className="remove-attendee"
                  onClick={() => handleRemoveAttendee(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="add-attendee"
            onClick={handleAddAttendee}
          >
            Add Attendee
          </button>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="schedule-button"
            disabled={isLoading}
          >
            {isLoading ? 'Scheduling...' : 'Schedule Meeting'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MeetingScheduler;
