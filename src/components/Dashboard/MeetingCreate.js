import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { addDoc, collection, getDocs, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase-config';
import styles from './DetailPages.module.css';

const MeetingCreate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [meetingData, setMeetingData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 30,
    type: 'Client Meeting',
    location: 'Google Meet',
    meetUrl: '',
    description: '',
    attendees: [],
    relatedEntityType: '', // client, investor, partner, lead
    relatedEntityId: '',
    notes: ''
  });
  
  // New attendee state
  const [newAttendee, setNewAttendee] = useState({
    name: '',
    email: '',
    role: ''
  });
  
  // Fetch contacts for attendee selection
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contactsQuery = query(collection(db, 'contacts'));
        const contactsSnapshot = await getDocs(contactsQuery);
        const contactsList = contactsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setContacts(contactsList);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContacts();
  }, []);
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeetingData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle new attendee input change
  const handleAttendeeInputChange = (e) => {
    const { name, value } = e.target;
    setNewAttendee(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle adding attendee
  const handleAddAttendee = () => {
    if (!newAttendee.name || !newAttendee.email) return;
    
    setMeetingData(prev => ({
      ...prev,
      attendees: [...prev.attendees, { ...newAttendee }]
    }));
    
    // Reset new attendee form
    setNewAttendee({
      name: '',
      email: '',
      role: ''
    });
  };
  
  // Handle selecting contact as attendee
  const handleSelectContact = (e) => {
    const contactId = e.target.value;
    if (!contactId) return;
    
    const selectedContact = contacts.find(contact => contact.id === contactId);
    if (selectedContact) {
      setNewAttendee({
        name: `${selectedContact.firstName} ${selectedContact.lastName}`,
        email: selectedContact.email,
        role: selectedContact.position || ''
      });
    }
  };
  
  // Handle removing attendee
  const handleRemoveAttendee = (index) => {
    setMeetingData(prev => ({
      ...prev,
      attendees: prev.attendees.filter((_, i) => i !== index)
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!meetingData.title || !meetingData.date || !meetingData.time) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Format meeting data
      const formattedMeeting = {
        ...meetingData,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        status: 'Scheduled'
      };
      
      // Create meeting in Firestore
      const docRef = await addDoc(collection(db, 'meetings'), formattedMeeting);
      
      setSuccess(true);
      
      // Redirect to meeting detail page after a short delay
      setTimeout(() => {
        navigate(`/dashboard/meetings/${docRef.id}`);
      }, 1500);
    } catch (err) {
      console.error('Error creating meeting:', err);
      setError(`Error creating meeting: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
          <button 
            className={`${styles.actionButton} ${styles.saveButton}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <FaSave /> {isSubmitting ? 'Creating...' : 'Schedule Meeting'}
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => navigate('/dashboard/calendar')}
            disabled={isSubmitting}
          >
            <FaTimes /> Cancel
          </button>
        </div>
      </div>
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      {success ? (
        <div className={styles.successMessage}>
          <h3>Meeting Scheduled Successfully!</h3>
          <p>Redirecting to meeting details...</p>
        </div>
      ) : (
        <form className={styles.createForm} onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <h3>Meeting Details</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Meeting Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={meetingData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="type">Meeting Type</label>
                <select
                  id="type"
                  name="type"
                  value={meetingData.type}
                  onChange={handleInputChange}
                >
                  <option value="Client Meeting">Client Meeting</option>
                  <option value="Investor Meeting">Investor Meeting</option>
                  <option value="Partner Meeting">Partner Meeting</option>
                  <option value="Lead Meeting">Lead Meeting</option>
                  <option value="Internal Meeting">Internal Meeting</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="date">Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={meetingData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="time">Time *</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={meetingData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="duration">Duration (minutes)</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  min="15"
                  step="15"
                  value={meetingData.duration}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="location">Location</label>
                <select
                  id="location"
                  name="location"
                  value={meetingData.location}
                  onChange={handleInputChange}
                >
                  <option value="Google Meet">Google Meet</option>
                  <option value="Zoom">Zoom</option>
                  <option value="Microsoft Teams">Microsoft Teams</option>
                  <option value="In Person">In Person</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              {(meetingData.location === 'Google Meet' || 
                meetingData.location === 'Zoom' || 
                meetingData.location === 'Microsoft Teams') && (
                <div className={styles.formGroup}>
                  <label htmlFor="meetUrl">Meeting URL</label>
                  <input
                    type="url"
                    id="meetUrl"
                    name="meetUrl"
                    value={meetingData.meetUrl}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={meetingData.description}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h3>Related Entity</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="relatedEntityType">Entity Type</label>
                <select
                  id="relatedEntityType"
                  name="relatedEntityType"
                  value={meetingData.relatedEntityType}
                  onChange={handleInputChange}
                >
                  <option value="">None</option>
                  <option value="client">Client</option>
                  <option value="investor">Investor</option>
                  <option value="partner">Partner</option>
                  <option value="lead">Lead</option>
                </select>
              </div>
              
              {meetingData.relatedEntityType && (
                <div className={styles.formGroup}>
                  <label htmlFor="relatedEntityId">Entity ID</label>
                  <input
                    type="text"
                    id="relatedEntityId"
                    name="relatedEntityId"
                    value={meetingData.relatedEntityId}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h3>Attendees</h3>
            
            {meetingData.attendees.length > 0 && (
              <div className={styles.attendeesList}>
                {meetingData.attendees.map((attendee, index) => (
                  <div key={index} className={styles.attendeeItem}>
                    <div className={styles.attendeeInfo}>
                      <div className={styles.attendeeName}>{attendee.name}</div>
                      <div className={styles.attendeeEmail}>{attendee.email}</div>
                      {attendee.role && <div className={styles.attendeeRole}>{attendee.role}</div>}
                    </div>
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => handleRemoveAttendee(index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className={styles.addAttendeeSection}>
              <h4>Add Attendee</h4>
              
              {!loading && contacts.length > 0 && (
                <div className={styles.formGroup}>
                  <label htmlFor="contactSelect">Select from Contacts</label>
                  <select
                    id="contactSelect"
                    onChange={handleSelectContact}
                    defaultValue=""
                  >
                    <option value="">Select a contact</option>
                    {contacts.map(contact => (
                      <option key={contact.id} value={contact.id}>
                        {contact.firstName} {contact.lastName} ({contact.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="attendeeName">Name</label>
                  <input
                    type="text"
                    id="attendeeName"
                    name="name"
                    value={newAttendee.name}
                    onChange={handleAttendeeInputChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="attendeeEmail">Email</label>
                  <input
                    type="email"
                    id="attendeeEmail"
                    name="email"
                    value={newAttendee.email}
                    onChange={handleAttendeeInputChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="attendeeRole">Role</label>
                  <input
                    type="text"
                    id="attendeeRole"
                    name="role"
                    value={newAttendee.role}
                    onChange={handleAttendeeInputChange}
                  />
                </div>
              </div>
              
              <button
                type="button"
                className={styles.addButton}
                onClick={handleAddAttendee}
                disabled={!newAttendee.name || !newAttendee.email}
              >
                <FaPlus /> Add Attendee
              </button>
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h3>Notes</h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="notes">Meeting Notes</label>
              <textarea
                id="notes"
                name="notes"
                rows="4"
                value={meetingData.notes}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default MeetingCreate;
