import React, { useState } from 'react';
import { FaCalendarAlt, FaUserPlus } from 'react-icons/fa';
import { useModal } from '../../context/ModalContext';
import Modal from '../ui/feedback/Modal';
import styles from './Modals.module.css';

/**
 * Schedule Meeting Modal
 * 
 * This modal allows users to schedule a meeting with a client, investor, partner, or lead.
 */
const ScheduleMeetingModal = () => {
  const { modals, closeModal } = useModal();
  const { isOpen, data } = modals.scheduleMeeting;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    attendees: []
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen && data) {
      // Generate default title based on entity
      const defaultTitle = `Meeting with ${data.entityName || 'Client'}`;
      
      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const defaultDate = tomorrow.toISOString().split('T')[0];
      
      // Set default attendees if email is provided
      const defaultAttendees = data.email ? [data.email] : [];
      
      setFormData({
        title: defaultTitle,
        date: defaultDate,
        startTime: '10:00',
        endTime: '11:00',
        description: '',
        attendees: defaultAttendees
      });
      
      setSuccess(false);
      setError(null);
    }
  }, [isOpen, data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAttendeeChange = (index, value) => {
    const newAttendees = [...formData.attendees];
    newAttendees[index] = value;
    setFormData(prev => ({
      ...prev,
      attendees: newAttendees
    }));
  };

  const handleAddAttendee = () => {
    setFormData(prev => ({
      ...prev,
      attendees: [...prev.attendees, '']
    }));
  };

  const handleRemoveAttendee = (index) => {
    const newAttendees = [...formData.attendees];
    newAttendees.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      attendees: newAttendees
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call an API to schedule the meeting
      console.log('Scheduling meeting:', {
        ...formData,
        entityType: data?.entityType,
        entityId: data?.entityId
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      
      // Close modal after a delay
      setTimeout(() => {
        closeModal('scheduleMeeting');
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Error scheduling meeting:', err);
      setError('Failed to schedule meeting. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => closeModal('scheduleMeeting')}
      title={
        <div className={styles.modalTitleWithIcon}>
          <FaCalendarAlt className={styles.modalTitleIcon} />
          Schedule Meeting
        </div>
      }
      size="md"
    >
      {success ? (
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <h3>Meeting Scheduled Successfully!</h3>
          <p>The meeting has been added to the calendar.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <div className={styles.formGroup}>
            <label htmlFor="title">Meeting Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="startTime">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="endTime">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className={styles.textarea}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Attendees</label>
            {formData.attendees.map((attendee, index) => (
              <div key={index} className={styles.attendeeRow}>
                <input
                  type="email"
                  value={attendee}
                  onChange={(e) => handleAttendeeChange(index, e.target.value)}
                  placeholder="Email address"
                  required
                  className={styles.input}
                />
                {formData.attendees.length > 1 && (
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => handleRemoveAttendee(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className={styles.addButton}
              onClick={handleAddAttendee}
            >
              <FaUserPlus /> Add Attendee
            </button>
          </div>
          
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => closeModal('scheduleMeeting')}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Scheduling...' : 'Schedule Meeting'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ScheduleMeetingModal;
