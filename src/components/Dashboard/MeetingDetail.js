import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaEdit, FaFileAlt, FaSave, FaUserPlus, FaUserTie, FaVideo } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import MeetingToLeadForm from '../meetings/MeetingToLeadForm';
import MeetingTranscriptViewer from '../meetings/MeetingTranscriptViewer';
import DashboardSection from '../shared/DashboardSection';
import styles from './DetailPages.module.css';

const MeetingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMeeting, setEditedMeeting] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateLeadForm, setShowCreateLeadForm] = useState(false);

  // Meeting transcript data
  const [transcriptId, setTranscriptId] = useState(null);

  // Mock action items data
  const [actionItems, setActionItems] = useState([
    { id: 1, description: 'Adjust Phase 1 timeline from 4 to 6 weeks', assignee: 'John Doe', dueDate: '2024-03-25', status: 'Pending' },
    { id: 2, description: 'Speak with HR about additional developer resources', assignee: 'John Doe', dueDate: '2024-03-22', status: 'Pending' },
    { id: 3, description: 'Prepare analysis of integration challenges', assignee: 'Sarah Johnson', dueDate: '2024-03-29', status: 'In Progress' },
    { id: 4, description: 'Schedule technical deep dive session', assignee: 'John Doe', dueDate: '2024-03-23', status: 'Completed' }
  ]);

  // Mock attendees data
  const [attendees, setAttendees] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Project Manager', status: 'Attended' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Lead Developer', status: 'Attended' },
    { id: 3, name: 'Robert Chen', email: 'robert@example.com', role: 'System Architect', status: 'Attended' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'Product Owner', status: 'Absent' }
  ]);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        setLoading(true);
        // In a real app, this would fetch from Firebase
        // For now, we'll use mock data
        const mockMeeting = {
          id: id,
          title: 'Project Requirements Discussion',
          date: '2024-03-20',
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          type: 'Google Meet',
          status: 'Completed',
          organizer: 'John Doe',
          relatedTo: 'Innovate Solutions Inc.',
          relatedToType: 'Client',
          meetingLink: 'https://meet.google.com/abc-defg-hij',
          recordingLink: 'https://drive.google.com/file/d/123456789',
          agenda: '1. Review project timeline\n2. Discuss technical requirements\n3. Assign action items\n4. Schedule follow-up meetings',
          summary: 'Discussed project timeline and technical requirements. Decided to extend Phase 1 timeline to 6 weeks and add additional developer resources. Identified potential integration challenges that need further analysis.',
          nextSteps: 'Schedule technical deep dive session for next week. Update project plan with new timeline. Begin resource allocation process.',
          transcriptId: 'mock-transcript-id' // Mock transcript ID
        };

        setMeeting(mockMeeting);
        setEditedMeeting(mockMeeting);
        setTranscriptId(mockMeeting.transcriptId);
      } catch (err) {
        console.error('Error fetching meeting:', err);
        setError('Failed to load meeting details');
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // In a real app, this would update the meeting in Firebase
      // For now, we'll just update our local state
      setMeeting(editedMeeting);
      setIsEditing(false);
      // Show success message or notification
    } catch (err) {
      console.error('Error saving meeting:', err);
      // Show error message
    }
  };

  const handleCancel = () => {
    setEditedMeeting(meeting);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedMeeting(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddActionItem = () => {
    const newActionItem = {
      id: actionItems.length + 1,
      description: '',
      assignee: '',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setActionItems([...actionItems, newActionItem]);
  };

  const handleAddAttendee = () => {
    // In a real app, this would open a dialog to add an attendee
    console.log('Add attendee to meeting:', meeting.title);
  };

  const handleJoinMeeting = () => {
    // In a real app, this would open the meeting link
    window.open(meeting.meetingLink, '_blank');
  };

  const handleViewRecording = () => {
    // In a real app, this would open the recording link
    window.open(meeting.recordingLink, '_blank');
  };

  const handleCreateLead = () => {
    setShowCreateLeadForm(true);
  };

  const handleCancelCreateLead = () => {
    setShowCreateLeadForm(false);
  };

  const handleLeadCreated = (result) => {
    // In a real app, this would update the meeting with the lead ID
    console.log('Lead created:', result);
    // You could also show a success message or navigate to the lead
    setShowCreateLeadForm(false);
  };

  if (loading) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.loading}>Loading meeting details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.error}>{error}</div>
        <button
          className={styles.backButton}
          onClick={() => navigate('/dashboard/calendar')}
        >
          <FaArrowLeft /> Back to Calendar
        </button>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.error}>Meeting not found</div>
        <button
          className={styles.backButton}
          onClick={() => navigate('/dashboard/calendar')}
        >
          <FaArrowLeft /> Back to Calendar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.detailPage}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => navigate('/dashboard/calendar')}
        >
          <FaArrowLeft /> Back to Calendar
        </button>
        <div className={styles.actions}>
          {isEditing ? (
            <>
              <button
                className={`${styles.actionButton} ${styles.saveButton}`}
                onClick={handleSave}
              >
                <FaSave /> Save
              </button>
              <button
                className={styles.actionButton}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              {meeting.status === 'Scheduled' && (
                <button
                  className={styles.actionButton}
                  onClick={handleJoinMeeting}
                >
                  <FaVideo /> Join Meeting
                </button>
              )}
              {meeting.status === 'Completed' && meeting.recordingLink && (
                <button
                  className={styles.actionButton}
                  onClick={handleViewRecording}
                >
                  <FaVideo /> View Recording
                </button>
              )}
              <button
                className={styles.actionButton}
                onClick={handleAddAttendee}
              >
                <FaUserPlus /> Add Attendee
              </button>
              <button
                className={`${styles.actionButton} ${styles.createLeadButton}`}
                onClick={handleCreateLead}
              >
                <FaUserTie /> Create Lead
              </button>
              <button
                className={styles.actionButton}
                onClick={handleEdit}
              >
                <FaEdit /> Edit
              </button>
            </>
          )}
        </div>
      </div>

      {showCreateLeadForm ? (
        <div className={styles.createLeadFormContainer}>
          <MeetingToLeadForm
            meeting={meeting}
            onCancel={handleCancelCreateLead}
            onSuccess={handleLeadCreated}
          />
        </div>
      ) : (
        <DashboardSection title={meeting.title}>
        <div className={styles.meetingMeta}>
          <div className={styles.meetingDateTime}>
            {new Date(meeting.date).toLocaleDateString()} | {meeting.startTime} - {meeting.endTime}
          </div>
          <div className={styles.meetingStatus}>
            <span className={`${styles.statusBadge} ${styles[meeting.status.toLowerCase()]}`}>
              {meeting.status}
            </span>
          </div>
        </div>

        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tabButton} ${activeTab === 'overview' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'transcript' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('transcript')}
            >
              Transcript
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'action-items' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('action-items')}
            >
              Action Items
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'attendees' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('attendees')}
            >
              Attendees
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'overview' && (
              <div className={styles.overviewTab}>
                {isEditing ? (
                  <div className={styles.editForm}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="date">Date</label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={editedMeeting.date}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="startTime">Start Time</label>
                        <input
                          type="text"
                          id="startTime"
                          name="startTime"
                          value={editedMeeting.startTime}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="endTime">End Time</label>
                        <input
                          type="text"
                          id="endTime"
                          name="endTime"
                          value={editedMeeting.endTime}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="type">Meeting Type</label>
                        <input
                          type="text"
                          id="type"
                          name="type"
                          value={editedMeeting.type}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="status">Status</label>
                        <select
                          id="status"
                          name="status"
                          value={editedMeeting.status}
                          onChange={handleInputChange}
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="organizer">Organizer</label>
                        <input
                          type="text"
                          id="organizer"
                          name="organizer"
                          value={editedMeeting.organizer}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="relatedTo">Related To</label>
                        <input
                          type="text"
                          id="relatedTo"
                          name="relatedTo"
                          value={editedMeeting.relatedTo}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="meetingLink">Meeting Link</label>
                      <input
                        type="url"
                        id="meetingLink"
                        name="meetingLink"
                        value={editedMeeting.meetingLink}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="recordingLink">Recording Link</label>
                      <input
                        type="url"
                        id="recordingLink"
                        name="recordingLink"
                        value={editedMeeting.recordingLink || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="agenda">Agenda</label>
                      <textarea
                        id="agenda"
                        name="agenda"
                        value={editedMeeting.agenda}
                        onChange={handleInputChange}
                        rows="4"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="summary">Summary</label>
                      <textarea
                        id="summary"
                        name="summary"
                        value={editedMeeting.summary}
                        onChange={handleInputChange}
                        rows="4"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="nextSteps">Next Steps</label>
                      <textarea
                        id="nextSteps"
                        name="nextSteps"
                        value={editedMeeting.nextSteps}
                        onChange={handleInputChange}
                        rows="3"
                      />
                    </div>
                  </div>
                ) : (
                  <div className={styles.meetingInfo}>
                    <div className={styles.infoSection}>
                      <h3>Meeting Details</h3>
                      <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Type:</span>
                          <span className={styles.infoValue}>{meeting.type}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Organizer:</span>
                          <span className={styles.infoValue}>{meeting.organizer}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Related To:</span>
                          <span className={styles.infoValue}>{meeting.relatedTo} ({meeting.relatedToType})</span>
                        </div>
                        {meeting.meetingLink && (
                          <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Meeting Link:</span>
                            <span className={styles.infoValue}>
                              <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer">
                                {meeting.meetingLink}
                              </a>
                            </span>
                          </div>
                        )}
                        {meeting.recordingLink && (
                          <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Recording:</span>
                            <span className={styles.infoValue}>
                              <a href={meeting.recordingLink} target="_blank" rel="noopener noreferrer">
                                View Recording
                              </a>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.infoSection}>
                      <h3>Agenda</h3>
                      <p className={styles.agenda}>{meeting.agenda}</p>
                    </div>

                    <div className={styles.infoSection}>
                      <h3>Summary</h3>
                      <p className={styles.summary}>{meeting.summary}</p>
                    </div>

                    <div className={styles.infoSection}>
                      <h3>Next Steps</h3>
                      <p className={styles.nextSteps}>{meeting.nextSteps}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'transcript' && (
              <div className={styles.transcriptTab}>
                {transcriptId ? (
                  <MeetingTranscriptViewer transcriptId={transcriptId} meetingId={meeting.id} />
                ) : (
                  <div className={styles.noTranscriptMessage}>
                    <FaFileAlt className={styles.noTranscriptIcon} />
                    <p>No transcript is available for this meeting yet.</p>
                    {meeting.status === 'Completed' && (
                      <p className={styles.transcriptNote}>
                        Transcripts are typically available within 24 hours after a meeting is completed.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'action-items' && (
              <div className={styles.actionItemsTab}>
                <div className={styles.tabActions}>
                  <button className={styles.addButton} onClick={handleAddActionItem}>
                    Add Action Item
                  </button>
                </div>
                <div className={styles.actionItemsList}>
                  {actionItems.map(item => (
                    <div key={item.id} className={styles.actionItem}>
                      <div className={styles.actionItemHeader}>
                        <div className={styles.actionItemStatus}>
                          <select
                            value={item.status}
                            onChange={(e) => {
                              const updatedItems = actionItems.map(ai =>
                                ai.id === item.id ? { ...ai, status: e.target.value } : ai
                              );
                              setActionItems(updatedItems);
                            }}
                            className={styles[`status-${item.status.toLowerCase().replace(' ', '-')}`]}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                        <div className={styles.actionItemDueDate}>
                          Due: {new Date(item.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={styles.actionItemDescription}>
                        {item.description}
                      </div>
                      <div className={styles.actionItemAssignee}>
                        Assigned to: {item.assignee}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'attendees' && (
              <div className={styles.attendeesTab}>
                <div className={styles.tabActions}>
                  <button className={styles.addButton} onClick={handleAddAttendee}>
                    Add Attendee
                  </button>
                </div>
                <div className={styles.attendeesTable}>
                  <div className={styles.tableHeader}>
                    <div className={styles.tableCell}>Name</div>
                    <div className={styles.tableCell}>Email</div>
                    <div className={styles.tableCell}>Role</div>
                    <div className={styles.tableCell}>Status</div>
                  </div>
                  {attendees.map(attendee => (
                    <div key={attendee.id} className={styles.tableRow}>
                      <div className={styles.tableCell}>{attendee.name}</div>
                      <div className={styles.tableCell}>{attendee.email}</div>
                      <div className={styles.tableCell}>{attendee.role}</div>
                      <div className={styles.tableCell}>
                        <span className={`${styles.statusBadge} ${styles[attendee.status.toLowerCase()]}`}>
                          {attendee.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardSection>
      )}
    </div>
  );
};

export default MeetingDetail;
