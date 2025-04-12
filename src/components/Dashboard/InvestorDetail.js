import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaSave, FaTrash, FaCalendarPlus, FaFileUpload, FaChartLine } from 'react-icons/fa';
import DashboardSection from '../shared/DashboardSection';
import styles from './DetailPages.module.css';

const InvestorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [investor, setInvestor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInvestor, setEditedInvestor] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock investments data
  const [investments, setInvestments] = useState([
    { id: 1, amount: 250000, date: '2023-06-15', type: 'Seed Round', status: 'Completed', notes: 'Initial investment' },
    { id: 2, amount: 500000, date: '2023-12-10', type: 'Series A', status: 'Completed', notes: 'Follow-up investment' },
    { id: 3, amount: 750000, date: '2024-06-01', type: 'Series B', status: 'Pending', notes: 'Planned expansion funding' }
  ]);
  
  // Mock documents data
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Investment Agreement.pdf', type: 'PDF', size: '3.2 MB', uploadDate: '2023-06-10', uploadedBy: 'John Doe' },
    { id: 2, name: 'Term Sheet.docx', type: 'DOCX', size: '1.5 MB', uploadDate: '2023-05-25', uploadedBy: 'Jane Smith' },
    { id: 3, name: 'Financial Projections.xlsx', type: 'XLSX', size: '2.8 MB', uploadDate: '2023-06-05', uploadedBy: 'John Doe' }
  ]);
  
  // Mock meetings data
  const [meetings, setMeetings] = useState([
    { id: 1, title: 'Investment Strategy Meeting', date: '2023-05-20', time: '10:00 AM', attendees: ['John Doe', 'Jane Smith', 'Investor Team'], notes: 'Discussed investment strategy and timeline' },
    { id: 2, title: 'Quarterly Review', date: '2023-09-15', time: '2:00 PM', attendees: ['John Doe', 'Investor Team'], notes: 'Reviewed Q3 performance and projections' },
    { id: 3, title: 'Series B Planning', date: '2024-02-10', time: '11:00 AM', attendees: ['Jane Smith', 'Finance Team', 'Investor Team'], notes: 'Planned Series B funding round' }
  ]);

  useEffect(() => {
    const fetchInvestor = async () => {
      try {
        setLoading(true);
        // In a real app, this would fetch from Firebase
        // For now, we'll use mock data
        const mockInvestor = {
          id: id,
          name: 'Capital Ventures LLC',
          contactName: 'Michael Chen',
          email: 'michael@capitalventures.com',
          phone: '(555) 987-6543',
          address: '456 Finance Ave, New York, NY 10022',
          type: 'Venture Capital',
          investmentFocus: 'Technology, Healthcare, Fintech',
          website: 'https://capitalventures.example.com',
          status: 'Active',
          assignedTo: 'Jane Smith',
          createdDate: '2023-05-10',
          lastContact: '2024-02-10',
          notes: 'Capital Ventures is a mid-sized VC firm focused on early-stage technology companies. They have a particular interest in AI and healthcare technology solutions.',
          tags: ['Venture Capital', 'Technology', 'Healthcare'],
          totalInvested: '$1,500,000',
          investmentGoals: 'Looking for high-growth opportunities in the AI and healthcare space. Target ROI of 5x within 5 years.'
        };
        
        setInvestor(mockInvestor);
        setEditedInvestor(mockInvestor);
      } catch (err) {
        console.error('Error fetching investor:', err);
        setError('Failed to load investor details');
      } finally {
        setLoading(false);
      }
    };

    fetchInvestor();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // In a real app, this would update the investor in Firebase
      // For now, we'll just update our local state
      setInvestor(editedInvestor);
      setIsEditing(false);
      // Show success message or notification
    } catch (err) {
      console.error('Error saving investor:', err);
      // Show error message
    }
  };

  const handleCancel = () => {
    setEditedInvestor(investor);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedInvestor(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddInvestment = () => {
    const newInvestment = {
      id: investments.length + 1,
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      type: 'New Investment',
      status: 'Pending',
      notes: ''
    };
    setInvestments([...investments, newInvestment]);
  };

  const handleScheduleMeeting = () => {
    // In a real app, this would open a meeting scheduler
    console.log('Schedule meeting for investor:', investor.name);
  };

  const handleUploadDocument = () => {
    // In a real app, this would open a file upload dialog
    console.log('Upload document for investor:', investor.name);
  };

  if (loading) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.loading}>Loading investor details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.error}>{error}</div>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/dashboard/investors')}
        >
          <FaArrowLeft /> Back to Investors
        </button>
      </div>
    );
  }

  if (!investor) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.error}>Investor not found</div>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/dashboard/investors')}
        >
          <FaArrowLeft /> Back to Investors
        </button>
      </div>
    );
  }

  return (
    <div className={styles.detailPage}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/dashboard/investors')}
        >
          <FaArrowLeft /> Back to Investors
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

      <DashboardSection title={investor.name}>
        <div className={styles.clientStatus}>
          <span className={`${styles.statusBadge} ${styles[investor.status.toLowerCase()]}`}>
            {investor.status}
          </span>
          <span className={styles.assignedTo}>Assigned to: {investor.assignedTo}</span>
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
              className={`${styles.tabButton} ${activeTab === 'investments' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('investments')}
            >
              Investments
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
                          value={editedInvestor.contactName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={editedInvestor.email}
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
                          value={editedInvestor.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="website">Website</label>
                        <input
                          type="url"
                          id="website"
                          name="website"
                          value={editedInvestor.website}
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
                        value={editedInvestor.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="type">Investor Type</label>
                        <input
                          type="text"
                          id="type"
                          name="type"
                          value={editedInvestor.type}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="investmentFocus">Investment Focus</label>
                        <input
                          type="text"
                          id="investmentFocus"
                          name="investmentFocus"
                          value={editedInvestor.investmentFocus}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="notes">Notes</label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={editedInvestor.notes}
                        onChange={handleInputChange}
                        rows="4"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="investmentGoals">Investment Goals</label>
                      <textarea
                        id="investmentGoals"
                        name="investmentGoals"
                        value={editedInvestor.investmentGoals}
                        onChange={handleInputChange}
                        rows="3"
                      />
                    </div>
                  </div>
                ) : (
                  <div className={styles.investorInfo}>
                    <div className={styles.infoSection}>
                      <h3>Contact Information</h3>
                      <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Contact Name:</span>
                          <span className={styles.infoValue}>{investor.contactName}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Email:</span>
                          <span className={styles.infoValue}>{investor.email}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Phone:</span>
                          <span className={styles.infoValue}>{investor.phone}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Website:</span>
                          <span className={styles.infoValue}>
                            <a href={investor.website} target="_blank" rel="noopener noreferrer">
                              {investor.website}
                            </a>
                          </span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Address:</span>
                          <span className={styles.infoValue}>{investor.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoSection}>
                      <h3>Investor Information</h3>
                      <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Type:</span>
                          <span className={styles.infoValue}>{investor.type}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Investment Focus:</span>
                          <span className={styles.infoValue}>{investor.investmentFocus}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Total Invested:</span>
                          <span className={styles.infoValue}>{investor.totalInvested}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Investor Since:</span>
                          <span className={styles.infoValue}>{new Date(investor.createdDate).toLocaleDateString()}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Last Contact:</span>
                          <span className={styles.infoValue}>{new Date(investor.lastContact).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoSection}>
                      <h3>Notes</h3>
                      <p className={styles.notes}>{investor.notes}</p>
                    </div>

                    <div className={styles.infoSection}>
                      <h3>Investment Goals</h3>
                      <p className={styles.goals}>{investor.investmentGoals}</p>
                    </div>

                    <div className={styles.infoSection}>
                      <h3>Tags</h3>
                      <div className={styles.tags}>
                        {investor.tags.map((tag, index) => (
                          <span key={index} className={styles.tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'investments' && (
              <div className={styles.investmentsTab}>
                <div className={styles.tabActions}>
                  <button className={styles.addButton} onClick={handleAddInvestment}>
                    Add Investment
                  </button>
                </div>
                <div className={styles.documentsTable}>
                  <div className={styles.tableHeader}>
                    <div className={styles.tableCell}>Amount</div>
                    <div className={styles.tableCell}>Type</div>
                    <div className={styles.tableCell}>Date</div>
                    <div className={styles.tableCell}>Status</div>
                    <div className={styles.tableCell}>Notes</div>
                  </div>
                  {investments.map(investment => (
                    <div key={investment.id} className={styles.tableRow}>
                      <div className={styles.tableCell}>${investment.amount.toLocaleString()}</div>
                      <div className={styles.tableCell}>{investment.type}</div>
                      <div className={styles.tableCell}>{new Date(investment.date).toLocaleDateString()}</div>
                      <div className={styles.tableCell}>
                        <span className={`${styles.statusBadge} ${styles[investment.status.toLowerCase()]}`}>
                          {investment.status}
                        </span>
                      </div>
                      <div className={styles.tableCell}>{investment.notes}</div>
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

export default InvestorDetail;
