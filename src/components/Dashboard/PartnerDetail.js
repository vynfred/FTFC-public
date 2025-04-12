import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaSave, FaTrash, FaCalendarPlus, FaFileUpload, FaHandshake } from 'react-icons/fa';
import DashboardSection from '../shared/DashboardSection';
import styles from './DetailPages.module.css';

const PartnerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPartner, setEditedPartner] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock referrals data
  const [referrals, setReferrals] = useState([
    { id: 1, name: 'ABC Corporation', type: 'Client', date: '2024-01-15', status: 'Converted', value: '$15,000' },
    { id: 2, name: 'XYZ Investments', type: 'Investor', date: '2024-02-10', status: 'In Progress', value: 'Pending' },
    { id: 3, name: 'Global Tech Solutions', type: 'Client', date: '2024-03-05', status: 'New Lead', value: 'Potential $25,000' }
  ]);
  
  // Mock documents data
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Partnership Agreement.pdf', type: 'PDF', size: '2.8 MB', uploadDate: '2023-12-10', uploadedBy: 'John Doe' },
    { id: 2, name: 'Referral Program Terms.docx', type: 'DOCX', size: '1.2 MB', uploadDate: '2023-12-15', uploadedBy: 'Jane Smith' },
    { id: 3, name: 'Commission Structure.xlsx', type: 'XLSX', size: '1.5 MB', uploadDate: '2024-01-05', uploadedBy: 'John Doe' }
  ]);
  
  // Mock meetings data
  const [meetings, setMeetings] = useState([
    { id: 1, title: 'Partnership Kickoff', date: '2023-12-20', time: '10:00 AM', attendees: ['John Doe', 'Jane Smith', 'Partner Team'], notes: 'Discussed partnership goals and referral process' },
    { id: 2, title: 'Monthly Check-in', date: '2024-01-20', time: '11:00 AM', attendees: ['John Doe', 'Partner Team'], notes: 'Reviewed first month performance and addressed questions' },
    { id: 3, title: 'Quarterly Strategy', date: '2024-03-15', time: '2:00 PM', attendees: ['Jane Smith', 'Marketing Team', 'Partner Team'], notes: 'Planned Q2 referral targets and marketing initiatives' }
  ]);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        setLoading(true);
        // In a real app, this would fetch from Firebase
        // For now, we'll use mock data
        const mockPartner = {
          id: id,
          name: 'Business Connections Network',
          contactName: 'David Wilson',
          email: 'david@bcnetwork.com',
          phone: '(555) 456-7890',
          address: '789 Partnership Blvd, Chicago, IL 60601',
          type: 'Referral Partner',
          industry: 'Business Networking',
          website: 'https://bcnetwork.example.com',
          status: 'Active',
          assignedTo: 'John Doe',
          createdDate: '2023-12-01',
          lastContact: '2024-03-15',
          notes: 'Business Connections Network is a premier business networking organization with over 5,000 members across the Midwest. They specialize in connecting businesses for mutual growth opportunities.',
          tags: ['Networking', 'Referral Partner', 'High Value'],
          referralCount: 15,
          commissionRate: '10%',
          focusAreas: 'Small to medium-sized businesses in technology, finance, and healthcare sectors. Particularly strong connections in the Chicago startup ecosystem.'
        };
        
        setPartner(mockPartner);
        setEditedPartner(mockPartner);
      } catch (err) {
        console.error('Error fetching partner:', err);
        setError('Failed to load partner details');
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // In a real app, this would update the partner in Firebase
      // For now, we'll just update our local state
      setPartner(editedPartner);
      setIsEditing(false);
      // Show success message or notification
    } catch (err) {
      console.error('Error saving partner:', err);
      // Show error message
    }
  };

  const handleCancel = () => {
    setEditedPartner(partner);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPartner(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddReferral = () => {
    const newReferral = {
      id: referrals.length + 1,
      name: '',
      type: 'Client',
      date: new Date().toISOString().split('T')[0],
      status: 'New Lead',
      value: 'Pending'
    };
    setReferrals([...referrals, newReferral]);
  };

  const handleScheduleMeeting = () => {
    // In a real app, this would open a meeting scheduler
    console.log('Schedule meeting for partner:', partner.name);
  };

  const handleUploadDocument = () => {
    // In a real app, this would open a file upload dialog
    console.log('Upload document for partner:', partner.name);
  };

  if (loading) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.loading}>Loading partner details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.error}>{error}</div>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/dashboard/partners')}
        >
          <FaArrowLeft /> Back to Partners
        </button>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.error}>Partner not found</div>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/dashboard/partners')}
        >
          <FaArrowLeft /> Back to Partners
        </button>
      </div>
    );
  }

  return (
    <div className={styles.detailPage}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/dashboard/partners')}
        >
          <FaArrowLeft /> Back to Partners
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

      <DashboardSection title={partner.name}>
        <div className={styles.clientStatus}>
          <span className={`${styles.statusBadge} ${styles[partner.status.toLowerCase()]}`}>
            {partner.status}
          </span>
          <span className={styles.assignedTo}>Assigned to: {partner.assignedTo}</span>
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
              className={`${styles.tabButton} ${activeTab === 'referrals' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('referrals')}
            >
              Referrals
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
                          value={editedPartner.contactName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={editedPartner.email}
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
                          value={editedPartner.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="website">Website</label>
                        <input
                          type="url"
                          id="website"
                          name="website"
                          value={editedPartner.website}
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
                        value={editedPartner.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="type">Partner Type</label>
                        <input
                          type="text"
                          id="type"
                          name="type"
                          value={editedPartner.type}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="industry">Industry</label>
                        <input
                          type="text"
                          id="industry"
                          name="industry"
                          value={editedPartner.industry}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="commissionRate">Commission Rate</label>
                        <input
                          type="text"
                          id="commissionRate"
                          name="commissionRate"
                          value={editedPartner.commissionRate}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="referralCount">Referral Count</label>
                        <input
                          type="number"
                          id="referralCount"
                          name="referralCount"
                          value={editedPartner.referralCount}
                          onChange={handleInputChange}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="notes">Notes</label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={editedPartner.notes}
                        onChange={handleInputChange}
                        rows="4"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="focusAreas">Focus Areas</label>
                      <textarea
                        id="focusAreas"
                        name="focusAreas"
                        value={editedPartner.focusAreas}
                        onChange={handleInputChange}
                        rows="3"
                      />
                    </div>
                  </div>
                ) : (
                  <div className={styles.partnerInfo}>
                    <div className={styles.infoSection}>
                      <h3>Contact Information</h3>
                      <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Contact Name:</span>
                          <span className={styles.infoValue}>{partner.contactName}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Email:</span>
                          <span className={styles.infoValue}>{partner.email}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Phone:</span>
                          <span className={styles.infoValue}>{partner.phone}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Website:</span>
                          <span className={styles.infoValue}>
                            <a href={partner.website} target="_blank" rel="noopener noreferrer">
                              {partner.website}
                            </a>
                          </span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Address:</span>
                          <span className={styles.infoValue}>{partner.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoSection}>
                      <h3>Partner Information</h3>
                      <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Type:</span>
                          <span className={styles.infoValue}>{partner.type}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Industry:</span>
                          <span className={styles.infoValue}>{partner.industry}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Commission Rate:</span>
                          <span className={styles.infoValue}>{partner.commissionRate}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Referral Count:</span>
                          <span className={styles.infoValue}>{partner.referralCount}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Partner Since:</span>
                          <span className={styles.infoValue}>{new Date(partner.createdDate).toLocaleDateString()}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Last Contact:</span>
                          <span className={styles.infoValue}>{new Date(partner.lastContact).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoSection}>
                      <h3>Notes</h3>
                      <p className={styles.notes}>{partner.notes}</p>
                    </div>

                    <div className={styles.infoSection}>
                      <h3>Focus Areas</h3>
                      <p className={styles.goals}>{partner.focusAreas}</p>
                    </div>

                    <div className={styles.infoSection}>
                      <h3>Tags</h3>
                      <div className={styles.tags}>
                        {partner.tags.map((tag, index) => (
                          <span key={index} className={styles.tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'referrals' && (
              <div className={styles.referralsTab}>
                <div className={styles.tabActions}>
                  <button className={styles.addButton} onClick={handleAddReferral}>
                    Add Referral
                  </button>
                </div>
                <div className={styles.documentsTable}>
                  <div className={styles.tableHeader}>
                    <div className={styles.tableCell}>Name</div>
                    <div className={styles.tableCell}>Type</div>
                    <div className={styles.tableCell}>Date</div>
                    <div className={styles.tableCell}>Status</div>
                    <div className={styles.tableCell}>Value</div>
                  </div>
                  {referrals.map(referral => (
                    <div key={referral.id} className={styles.tableRow}>
                      <div className={styles.tableCell}>{referral.name}</div>
                      <div className={styles.tableCell}>{referral.type}</div>
                      <div className={styles.tableCell}>{new Date(referral.date).toLocaleDateString()}</div>
                      <div className={styles.tableCell}>
                        <span className={`${styles.statusBadge} ${styles[referral.status.toLowerCase().replace(' ', '-')]}`}>
                          {referral.status}
                        </span>
                      </div>
                      <div className={styles.tableCell}>{referral.value}</div>
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

export default PartnerDetail;
