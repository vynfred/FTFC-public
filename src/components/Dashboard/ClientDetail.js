import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaCalendarPlus, FaEdit, FaFileUpload, FaPlus, FaSave } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { getClientById, updateClient } from '../../services/ClientService';
import { completeMilestone, createMilestone, deleteMilestone, MILESTONE_STATUS, updateMilestone } from '../../services/MilestoneService';
import MilestoneListInteractive from '../common/MilestoneListInteractive';
import MilestoneModal from '../common/MilestoneModal';
import DashboardSection from '../shared/DashboardSection';
import styles from './DetailPages.module.css';

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Milestone state
  const [milestones, setMilestones] = useState([]);
  const [milestonesLoading, setMilestonesLoading] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState(null);
  const [milestoneError, setMilestoneError] = useState(null);
  const [isSubmittingMilestone, setIsSubmittingMilestone] = useState(false);

  // Toast notifications
  const { showSuccess, showError } = useToast();

  // Mock documents data
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Client Contract.pdf', type: 'PDF', size: '2.4 MB', uploadDate: '2024-02-10', uploadedBy: 'John Doe' },
    { id: 2, name: 'Project Proposal.docx', type: 'DOCX', size: '1.8 MB', uploadDate: '2024-01-25', uploadedBy: 'Jane Smith' },
    { id: 3, name: 'Requirements Specification.xlsx', type: 'XLSX', size: '3.2 MB', uploadDate: '2024-02-15', uploadedBy: 'John Doe' }
  ]);

  // Mock meetings data
  const [meetings, setMeetings] = useState([
    { id: 1, title: 'Project Kickoff Meeting', date: '2024-02-20', time: '10:00 AM', attendees: ['John Doe', 'Jane Smith', 'Client Team'], notes: 'Discussed project timeline and deliverables' },
    { id: 2, title: 'Weekly Progress Update', date: '2024-02-27', time: '11:00 AM', attendees: ['John Doe', 'Client Team'], notes: 'Reviewed progress on phase 1 tasks' },
    { id: 3, title: 'Design Review', date: '2024-03-05', time: '2:00 PM', attendees: ['Jane Smith', 'Design Team', 'Client Team'], notes: 'Presented initial designs and gathered feedback' }
  ]);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);

        // Fetch client data from Firestore
        const clientData = await getClientById(id);

        if (!clientData) {
          throw new Error('Client not found');
        }

        setClient(clientData);
        setEditedClient(clientData);

        // Set milestones from client data
        if (clientData.milestones && Array.isArray(clientData.milestones)) {
          setMilestones(clientData.milestones);
        }
      } catch (err) {
        console.error('Error fetching client:', err);
        setError(`Failed to load client details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Save to Firestore
      await updateClient(id, editedClient);

      // Update local state
      setClient(editedClient);
      setIsEditing(false);

      showSuccess('Client updated successfully');
    } catch (err) {
      console.error('Error updating client:', err);
      showError(`Error updating client: ${err.message}`);
    }
  };

  const handleCancel = () => {
    setEditedClient(client);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedClient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Milestone functions
  const handleAddMilestone = () => {
    setCurrentMilestone(null);
    setMilestoneError(null);
    setShowMilestoneModal(true);
  };

  const handleEditMilestone = (milestone) => {
    setCurrentMilestone(milestone);
    setMilestoneError(null);
    setShowMilestoneModal(true);
  };

  const handleCloseMilestoneModal = () => {
    setShowMilestoneModal(false);
    setCurrentMilestone(null);
    setMilestoneError(null);
  };

  const handleMilestoneSubmit = async (formData) => {
    setIsSubmittingMilestone(true);
    setMilestoneError(null);

    try {
      if (currentMilestone) {
        // Update existing milestone
        const updatedMilestone = await updateMilestone('client', id, currentMilestone.id, formData);

        // Update local state
        setMilestones(prevMilestones =>
          prevMilestones.map(m => m.id === currentMilestone.id ? updatedMilestone : m)
        );

        showSuccess('Milestone updated successfully');
      } else {
        // Create new milestone
        const newMilestone = await createMilestone(formData, 'client', id);

        // Update local state
        setMilestones(prevMilestones => [...prevMilestones, newMilestone]);

        showSuccess('Milestone created successfully');
      }

      // Close the modal
      handleCloseMilestoneModal();
    } catch (err) {
      console.error('Error saving milestone:', err);
      setMilestoneError(`Error saving milestone: ${err.message}`);
      showError(`Error saving milestone: ${err.message}`);
    } finally {
      setIsSubmittingMilestone(false);
    }
  };

  const handleDeleteMilestone = async (milestone) => {
    if (!window.confirm(`Are you sure you want to delete the milestone "${milestone.title}"?`)) {
      return;
    }

    try {
      await deleteMilestone('client', id, milestone.id);

      // Update local state
      setMilestones(prevMilestones => prevMilestones.filter(m => m.id !== milestone.id));

      showSuccess('Milestone deleted successfully');
    } catch (err) {
      console.error('Error deleting milestone:', err);
      showError(`Error deleting milestone: ${err.message}`);
    }
  };

  const handleMilestoneStatusChange = async (milestone, newStatus) => {
    try {
      const isCompleting = newStatus === MILESTONE_STATUS.COMPLETED && milestone.status !== MILESTONE_STATUS.COMPLETED;

      let updatedMilestone;

      if (isCompleting) {
        // Complete the milestone
        updatedMilestone = await completeMilestone('client', id, milestone.id, {
          completedAt: new Date().toISOString()
        });

        showSuccess(`Milestone "${milestone.title}" marked as completed`);
      } else {
        // Update the status
        updatedMilestone = await updateMilestone('client', id, milestone.id, {
          status: newStatus
        });

        showSuccess(`Milestone status updated to "${newStatus}"`);
      }

      // Update local state
      setMilestones(prevMilestones =>
        prevMilestones.map(m => m.id === milestone.id ? updatedMilestone : m)
      );
    } catch (err) {
      console.error('Error updating milestone status:', err);
      showError(`Error updating milestone status: ${err.message}`);
    }
  };

  const handleScheduleMeeting = () => {
    // In a real app, this would open a meeting scheduler
    console.log('Schedule meeting for client:', client.name);
  };

  const handleUploadDocument = () => {
    // In a real app, this would open a file upload dialog
    console.log('Upload document for client:', client.name);
  };

  if (loading) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.loading}>Loading client details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.error}>{error}</div>
        <button
          className={styles.backButton}
          onClick={() => navigate('/dashboard/clients')}
        >
          <FaArrowLeft /> Back to Clients
        </button>
      </div>
    );
  }

  if (!client) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.error}>Client not found</div>
        <button
          className={styles.backButton}
          onClick={() => navigate('/dashboard/clients')}
        >
          <FaArrowLeft /> Back to Clients
        </button>
      </div>
    );
  }

  return (
    <div className={styles.detailPage}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => navigate('/dashboard/clients')}
        >
          <FaArrowLeft /> Back to Clients
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
              <button
                className={styles.actionButton}
                onClick={handleScheduleMeeting}
              >
                <FaCalendarPlus /> Schedule Meeting
              </button>
              <button
                className={styles.actionButton}
                onClick={handleUploadDocument}
              >
                <FaFileUpload /> Upload Document
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

      <DashboardSection title={client.name}>
        <div className={styles.clientStatus}>
          <span className={`${styles.statusBadge} ${styles[client.status.toLowerCase()]}`}>
            {client.status}
          </span>
          <span className={styles.assignedTo}>Assigned to: {client.assignedTo}</span>
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
              className={`${styles.tabButton} ${activeTab === 'milestones' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('milestones')}
            >
              Milestones
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'documents' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              Documents
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'meetings' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('meetings')}
            >
              Meetings
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'overview' && (
              <div className={styles.overviewTab}>
                {isEditing ? (
                  <div className={styles.editForm}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="contactName">Contact Name</label>
                        <input
                          type="text"
                          id="contactName"
                          name="contactName"
                          value={editedClient.contactName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={editedClient.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="phone">Phone</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={editedClient.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="website">Website</label>
                        <input
                          type="url"
                          id="website"
                          name="website"
                          value={editedClient.website}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="address">Address</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={editedClient.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="industry">Industry</label>
                        <input
                          type="text"
                          id="industry"
                          name="industry"
                          value={editedClient.industry}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="size">Company Size</label>
                        <input
                          type="text"
                          id="size"
                          name="size"
                          value={editedClient.size}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="notes">Notes</label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={editedClient.notes}
                        onChange={handleInputChange}
                        rows="4"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="goals">Goals</label>
                      <textarea
                        id="goals"
                        name="goals"
                        value={editedClient.goals}
                        onChange={handleInputChange}
                        rows="3"
                      />
                    </div>
                  </div>
                ) : (
                  <div className={styles.clientInfo}>
                    <div className={styles.infoSection}>
                      <h3>Contact Information</h3>
                      <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Contact Name:</span>
                          <span className={styles.infoValue}>{client.contactName}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Email:</span>
                          <span className={styles.infoValue}>{client.email}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Phone:</span>
                          <span className={styles.infoValue}>{client.phone}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Website:</span>
                          <span className={styles.infoValue}>
                            <a href={client.website} target="_blank" rel="noopener noreferrer">
                              {client.website}
                            </a>
                          </span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Address:</span>
                          <span className={styles.infoValue}>{client.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoSection}>
                      <h3>Company Information</h3>
                      <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Industry:</span>
                          <span className={styles.infoValue}>{client.industry}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Size:</span>
                          <span className={styles.infoValue}>{client.size}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Revenue:</span>
                          <span className={styles.infoValue}>{client.revenue}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Client Since:</span>
                          <span className={styles.infoValue}>{new Date(client.createdDate).toLocaleDateString()}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Last Contact:</span>
                          <span className={styles.infoValue}>{new Date(client.lastContact).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoSection}>
                      <h3>Notes</h3>
                      <p className={styles.notes}>{client.notes}</p>
                    </div>

                    <div className={styles.infoSection}>
                      <h3>Goals</h3>
                      <p className={styles.goals}>{client.goals}</p>
                    </div>

                    <div className={styles.infoSection}>
                      <h3>Tags</h3>
                      <div className={styles.tags}>
                        {client.tags.map((tag, index) => (
                          <span key={index} className={styles.tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'milestones' && (
              <div className={styles.milestonesTab}>
                <div className={styles.tabActions}>
                  <button className={styles.addButton} onClick={handleAddMilestone}>
                    <FaPlus /> Add Milestone
                  </button>
                </div>

                {milestonesLoading ? (
                  <div className={styles.loading}>Loading milestones...</div>
                ) : (
                  <MilestoneListInteractive
                    milestones={milestones}
                    onEdit={handleEditMilestone}
                    onDelete={handleDeleteMilestone}
                    onStatusChange={handleMilestoneStatusChange}
                    isEditable={true}
                    isLoading={milestonesLoading}
                  />
                )}

                {/* Milestone Modal */}
                <MilestoneModal
                  isOpen={showMilestoneModal}
                  onClose={handleCloseMilestoneModal}
                  milestone={currentMilestone}
                  onSubmit={handleMilestoneSubmit}
                  isSubmitting={isSubmittingMilestone}
                  error={milestoneError}
                />
              </div>
            )}

            {activeTab === 'documents' && (
              <div className={styles.documentsTab}>
                <div className={styles.tabActions}>
                  <button className={styles.addButton} onClick={handleUploadDocument}>
                    Upload Document
                  </button>
                </div>
                <div className={styles.documentsTable}>
                  <div className={styles.tableHeader}>
                    <div className={styles.tableCell}>Name</div>
                    <div className={styles.tableCell}>Type</div>
                    <div className={styles.tableCell}>Size</div>
                    <div className={styles.tableCell}>Uploaded</div>
                    <div className={styles.tableCell}>Actions</div>
                  </div>
                  {documents.map(doc => (
                    <div key={doc.id} className={styles.tableRow}>
                      <div className={styles.tableCell}>{doc.name}</div>
                      <div className={styles.tableCell}>{doc.type}</div>
                      <div className={styles.tableCell}>{doc.size}</div>
                      <div className={styles.tableCell}>
                        {new Date(doc.uploadDate).toLocaleDateString()} by {doc.uploadedBy}
                      </div>
                      <div className={styles.tableCell}>
                        <button className={styles.iconButton}>View</button>
                        <button className={styles.iconButton}>Download</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'meetings' && (
              <div className={styles.meetingsTab}>
                <div className={styles.tabActions}>
                  <button className={styles.addButton} onClick={handleScheduleMeeting}>
                    Schedule Meeting
                  </button>
                </div>
                <div className={styles.meetingsList}>
                  {meetings.map(meeting => (
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
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardSection>
    </div>
  );
};

export default ClientDetail;
