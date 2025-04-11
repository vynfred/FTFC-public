import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaCalendarPlus, FaEdit, FaExchangeAlt, FaFileUpload, FaSave } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardSection from '../shared/DashboardSection';
import styles from './DetailPages.module.css';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionError, setConversionError] = useState(null);
  const [conversionSuccess, setConversionSuccess] = useState(false);
  const [conversionData, setConversionData] = useState({
    goals: [
      {
        title: 'Initial Funding',
        description: 'Secure initial funding for operations',
        target: '',
        current: '',
        progress: 0
      }
    ],
    milestones: [
      {
        title: 'Initial Consultation',
        description: 'Discuss client needs and objectives',
        status: 'completed',
        date: new Date().toISOString().split('T')[0]
      },
      {
        title: 'Proposal Acceptance',
        description: 'Client accepts our proposal',
        status: 'pending',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ]
  });

  // Mock activities data
  const [activities, setActivities] = useState([
    { id: 1, type: 'Email', date: '2024-03-01', description: 'Sent initial outreach email', user: 'John Doe' },
    { id: 2, type: 'Call', date: '2024-03-05', description: 'Introductory call to discuss needs', user: 'John Doe' },
    { id: 3, type: 'Email', date: '2024-03-10', description: 'Sent follow-up with proposal', user: 'Jane Smith' },
    { id: 4, type: 'Meeting', date: '2024-03-15', description: 'Virtual meeting to present solutions', user: 'John Doe' }
  ]);

  // Mock documents data
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Initial Proposal.pdf', type: 'PDF', size: '1.8 MB', uploadDate: '2024-03-10', uploadedBy: 'Jane Smith' },
    { id: 2, name: 'Meeting Agenda.docx', type: 'DOCX', size: '0.5 MB', uploadDate: '2024-03-14', uploadedBy: 'John Doe' }
  ]);

  // Mock notes data
  const [notes, setNotes] = useState([
    { id: 1, content: 'Lead is interested in our enterprise solution. They currently use a competitor product but are looking to switch in the next quarter.', date: '2024-03-05', user: 'John Doe' },
    { id: 2, content: 'Budget is approximately $50K. Decision maker is the CTO, but we need to convince the IT Director first.', date: '2024-03-15', user: 'John Doe' }
  ]);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true);
        // In a real app, this would fetch from Firebase
        // For now, we'll use mock data
        const mockLead = {
          id: id,
          name: 'Innovate Solutions Inc.',
          contactName: 'Robert Chen',
          email: 'robert@innovatesolutions.com',
          phone: '(555) 789-0123',
          address: '456 Tech Park, Austin, TX 78701',
          industry: 'Software Development',
          size: 'Medium (50-250 employees)',
          website: 'https://innovatesolutions.example.com',
          status: 'Qualified',
          assignedTo: 'John Doe',
          createdDate: '2024-03-01',
          lastContact: '2024-03-15',
          source: 'Website Form',
          notes: 'Innovate Solutions is looking for a financial management solution for their growing team. They currently use spreadsheets but need something more robust as they scale.',
          tags: ['Software', 'Growing', 'High Priority'],
          budget: '$40K-$60K',
          timeline: 'Q2 2024',
          probability: '70%',
          nextSteps: 'Schedule product demo with IT team and prepare customized proposal.'
        };

        setLead(mockLead);
        setEditedLead(mockLead);
      } catch (err) {
        console.error('Error fetching lead:', err);
        setError('Failed to load lead details');
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // In a real app, this would update the lead in Firebase
      // For now, we'll just update our local state
      setLead(editedLead);
      setIsEditing(false);
      // Show success message or notification
    } catch (err) {
      console.error('Error saving lead:', err);
      // Show error message
    }
  };

  const handleCancel = () => {
    setEditedLead(lead);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedLead(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddActivity = () => {
    const newActivity = {
      id: activities.length + 1,
      type: 'Note',
      date: new Date().toISOString().split('T')[0],
      description: '',
      user: 'John Doe' // In a real app, this would be the current user
    };
    setActivities([...activities, newActivity]);
  };

  const handleAddNote = () => {
    const newNote = {
      id: notes.length + 1,
      content: '',
      date: new Date().toISOString().split('T')[0],
      user: 'John Doe' // In a real app, this would be the current user
    };
    setNotes([...notes, newNote]);
  };

  const handleScheduleMeeting = () => {
    // In a real app, this would open a meeting scheduler
    console.log('Schedule meeting for lead:', lead.name);
  };

  const handleUploadDocument = () => {
    // In a real app, this would open a file upload dialog
    console.log('Upload document for lead:', lead.name);
  };

  const handleConvertToClient = () => {
    // Show the conversion modal
    setShowConversionModal(true);
  };

  const handleCancelConversion = () => {
    setShowConversionModal(false);
    setConversionError(null);
  };

  const handleConversionInputChange = (e, type, index) => {
    const { name, value } = e.target;

    setConversionData(prev => {
      const updated = { ...prev };
      updated[type][index][name] = value;
      return updated;
    });
  };

  const handleAddGoal = () => {
    setConversionData(prev => ({
      ...prev,
      goals: [
        ...prev.goals,
        {
          title: '',
          description: '',
          target: '',
          current: '',
          progress: 0
        }
      ]
    }));
  };

  const handleAddMilestone = () => {
    setConversionData(prev => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        {
          title: '',
          description: '',
          status: 'pending',
          date: new Date().toISOString().split('T')[0]
        }
      ]
    }));
  };

  const handleRemoveGoal = (index) => {
    setConversionData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveMilestone = (index) => {
    setConversionData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const handleConfirmConversion = async () => {
    setIsConverting(true);
    setConversionError(null);

    try {
      // Call the service to convert the lead to a client
      const client = await convertLeadToClient(id, {
        goals: conversionData.goals,
        milestones: conversionData.milestones,
        owner: lead.assignedTo,
        createdBy: 'manual_conversion'
      });

      setConversionSuccess(true);

      // Navigate to the new client page after a short delay
      setTimeout(() => {
        navigate(`/dashboard/clients/${client.id}`);
      }, 1500);
    } catch (err) {
      console.error('Error converting lead to client:', err);
      setConversionError(`Error converting lead: ${err.message}`);
      setIsConverting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.loading}>Loading lead details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.error}>{error}</div>
        <button
          className={styles.backButton}
          onClick={() => navigate('/dashboard/leads')}
        >
          <FaArrowLeft /> Back to Leads
        </button>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.error}>Lead not found</div>
        <button
          className={styles.backButton}
          onClick={() => navigate('/dashboard/leads')}
        >
          <FaArrowLeft /> Back to Leads
        </button>
      </div>
    );
  }

  return (
    <div className={styles.detailPage}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => navigate('/dashboard/leads')}
        >
          <FaArrowLeft /> Back to Leads
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
                className={`${styles.actionButton} ${styles.convertButton}`}
                onClick={handleConvertToClient}
              >
                <FaExchangeAlt /> Convert to Client
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

      <DashboardSection title={lead.name}>
        <div className={styles.clientStatus}>
          <span className={`${styles.statusBadge} ${styles[lead.status.toLowerCase()]}`}>
            {lead.status}
          </span>
          <span className={styles.assignedTo}>Assigned to: {lead.assignedTo}</span>
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
              className={`${styles.tabButton} ${activeTab === 'activities' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('activities')}
            >
              Activities
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'documents' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              Documents
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'notes' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              Notes
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
                          value={editedLead.contactName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={editedLead.email}
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
                          value={editedLead.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="website">Website</label>
                        <input
                          type="url"
                          id="website"
                          name="website"
                          value={editedLead.website}
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
                        value={editedLead.address}
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
                          value={editedLead.industry}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="size">Company Size</label>
                        <input
                          type="text"
                          id="size"
                          name="size"
                          value={editedLead.size}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="status">Status</label>
                        <select
                          id="status"
                          name="status"
                          value={editedLead.status}
                          onChange={handleInputChange}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Proposal">Proposal</option>
                          <option value="Negotiation">Negotiation</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="source">Source</label>
                        <input
                          type="text"
                          id="source"
                          name="source"
                          value={editedLead.source}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="budget">Budget</label>
                        <input
                          type="text"
                          id="budget"
                          name="budget"
                          value={editedLead.budget}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="timeline">Timeline</label>
                        <input
                          type="text"
                          id="timeline"
                          name="timeline"
                          value={editedLead.timeline}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="notes">Notes</label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={editedLead.notes}
                        onChange={handleInputChange}
                        rows="4"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="nextSteps">Next Steps</label>
                      <textarea
                        id="nextSteps"
                        name="nextSteps"
                        value={editedLead.nextSteps}
                        onChange={handleInputChange}
                        rows="3"
                      />
                    </div>
                  </div>
                ) : (
                  <div className={styles.leadInfo}>
                    <div className={styles.infoSection}>
                      <h3>Contact Information</h3>
                      <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Contact Name:</span>
                          <span className={styles.infoValue}>{lead.contactName}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Email:</span>
                          <span className={styles.infoValue}>{lead.email}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Phone:</span>
                          <span className={styles.infoValue}>{lead.phone}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Website:</span>
                          <span className={styles.infoValue}>
                            <a href={lead.website} target="_blank" rel="noopener noreferrer">
                              {lead.website}
                            </a>
                          </span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Address:</span>
                          <span className={styles.infoValue}>{lead.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoSection}>
                      <h3>Company Information</h3>
                      <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Industry:</span>
                          <span className={styles.infoValue}>{lead.industry}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Size:</span>
                          <span className={styles.infoValue}>{lead.size}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Source:</span>
                          <span className={styles.infoValue}>{lead.source}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Created Date:</span>
                          <span className={styles.infoValue}>{new Date(lead.createdDate).toLocaleDateString()}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Last Contact:</span>
                          <span className={styles.infoValue}>{new Date(lead.lastContact).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoSection}>
                      <h3>Opportunity Details</h3>
                      <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Budget:</span>
                          <span className={styles.infoValue}>{lead.budget}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Timeline:</span>
                          <span className={styles.infoValue}>{lead.timeline}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Probability:</span>
                          <span className={styles.infoValue}>{lead.probability}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoSection}>
                      <h3>Notes</h3>
                      <p className={styles.notes}>{lead.notes}</p>
                    </div>

                    <div className={styles.infoSection}>
                      <h3>Next Steps</h3>
                      <p className={styles.goals}>{lead.nextSteps}</p>
                    </div>

                    <div className={styles.infoSection}>
                      <h3>Tags</h3>
                      <div className={styles.tags}>
                        {lead.tags.map((tag, index) => (
                          <span key={index} className={styles.tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activities' && (
              <div className={styles.activitiesTab}>
                <div className={styles.tabActions}>
                  <button className={styles.addButton} onClick={handleAddActivity}>
                    Add Activity
                  </button>
                </div>
                <div className={styles.activitiesList}>
                  {activities.map(activity => (
                    <div key={activity.id} className={styles.activityItem}>
                      <div className={styles.activityHeader}>
                        <div className={styles.activityType}>{activity.type}</div>
                        <div className={styles.activityDate}>{new Date(activity.date).toLocaleDateString()}</div>
                      </div>
                      <div className={styles.activityDescription}>
                        {activity.description}
                      </div>
                      <div className={styles.activityUser}>
                        By: {activity.user}
                      </div>
                    </div>
                  ))}
                </div>
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

            {activeTab === 'notes' && (
              <div className={styles.notesTab}>
                <div className={styles.tabActions}>
                  <button className={styles.addButton} onClick={handleAddNote}>
                    Add Note
                  </button>
                </div>
                <div className={styles.notesList}>
                  {notes.map(note => (
                    <div key={note.id} className={styles.noteItem}>
                      <div className={styles.noteContent}>
                        {note.content}
                      </div>
                      <div className={styles.noteFooter}>
                        <div className={styles.noteDate}>
                          {new Date(note.date).toLocaleDateString()}
                        </div>
                        <div className={styles.noteUser}>
                          By: {note.user}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardSection>

      {/* Conversion Modal */}
      {showConversionModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Convert Lead to Client</h2>
              <button
                className={styles.closeButton}
                onClick={handleCancelConversion}
                disabled={isConverting}
              >
                <FaTimes />
              </button>
            </div>

            {conversionError && (
              <div className={styles.errorMessage}>
                {conversionError}
              </div>
            )}

            {conversionSuccess ? (
              <div className={styles.successMessage}>
                <FaCheck className={styles.successIcon} />
                <p>Lead successfully converted to client!</p>
                <p>Redirecting to client page...</p>
              </div>
            ) : (
              <div className={styles.modalContent}>
                <p>You are about to convert <strong>{lead.name}</strong> from a lead to a client.</p>
                <p>Please review and update the following information:</p>

                <div className={styles.conversionSection}>
                  <h3>Goals</h3>
                  <div className={styles.goalsList}>
                    {conversionData.goals.map((goal, index) => (
                      <div key={index} className={styles.goalItem}>
                        <div className={styles.goalHeader}>
                          <input
                            type="text"
                            name="title"
                            value={goal.title}
                            onChange={(e) => handleConversionInputChange(e, 'goals', index)}
                            placeholder="Goal Title"
                            className={styles.goalTitle}
                          />
                          <button
                            type="button"
                            className={styles.removeButton}
                            onClick={() => handleRemoveGoal(index)}
                            disabled={conversionData.goals.length <= 1}
                          >
                            <FaTrash />
                          </button>
                        </div>
                        <input
                          type="text"
                          name="description"
                          value={goal.description}
                          onChange={(e) => handleConversionInputChange(e, 'goals', index)}
                          placeholder="Goal Description"
                          className={styles.goalDescription}
                        />
                        <div className={styles.goalMetrics}>
                          <input
                            type="text"
                            name="target"
                            value={goal.target}
                            onChange={(e) => handleConversionInputChange(e, 'goals', index)}
                            placeholder="Target (e.g. $1M)"
                            className={styles.goalTarget}
                          />
                          <input
                            type="text"
                            name="current"
                            value={goal.current}
                            onChange={(e) => handleConversionInputChange(e, 'goals', index)}
                            placeholder="Current (e.g. $250K)"
                            className={styles.goalCurrent}
                          />
                          <input
                            type="number"
                            name="progress"
                            value={goal.progress}
                            onChange={(e) => handleConversionInputChange(e, 'goals', index)}
                            min="0"
                            max="100"
                            placeholder="Progress %"
                            className={styles.goalProgress}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className={styles.addButton}
                    onClick={handleAddGoal}
                  >
                    <FaPlus /> Add Goal
                  </button>
                </div>

                <div className={styles.conversionSection}>
                  <h3>Milestones</h3>
                  <div className={styles.milestonesList}>
                    {conversionData.milestones.map((milestone, index) => (
                      <div key={index} className={styles.milestoneItem}>
                        <div className={styles.milestoneHeader}>
                          <input
                            type="text"
                            name="title"
                            value={milestone.title}
                            onChange={(e) => handleConversionInputChange(e, 'milestones', index)}
                            placeholder="Milestone Title"
                            className={styles.milestoneTitle}
                          />
                          <button
                            type="button"
                            className={styles.removeButton}
                            onClick={() => handleRemoveMilestone(index)}
                            disabled={conversionData.milestones.length <= 1}
                          >
                            <FaTrash />
                          </button>
                        </div>
                        <input
                          type="text"
                          name="description"
                          value={milestone.description}
                          onChange={(e) => handleConversionInputChange(e, 'milestones', index)}
                          placeholder="Milestone Description"
                          className={styles.milestoneDescription}
                        />
                        <div className={styles.milestoneDetails}>
                          <select
                            name="status"
                            value={milestone.status}
                            onChange={(e) => handleConversionInputChange(e, 'milestones', index)}
                            className={styles.milestoneStatus}
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                          <input
                            type="date"
                            name="date"
                            value={milestone.date}
                            onChange={(e) => handleConversionInputChange(e, 'milestones', index)}
                            className={styles.milestoneDate}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className={styles.addButton}
                    onClick={handleAddMilestone}
                  >
                    <FaPlus /> Add Milestone
                  </button>
                </div>

                <div className={styles.modalActions}>
                  <button
                    className={styles.cancelButton}
                    onClick={handleCancelConversion}
                    disabled={isConverting}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.confirmButton}
                    onClick={handleConfirmConversion}
                    disabled={isConverting}
                  >
                    {isConverting ? 'Converting...' : 'Convert to Client'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDetail;
