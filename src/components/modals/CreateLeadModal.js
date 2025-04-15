import React, { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { useModal } from '../../context/ModalContext';
import Modal from '../ui/feedback/Modal';
import styles from './Modals.module.css';

/**
 * Create Lead Modal
 * 
 * This modal allows users to create a new lead, optionally associated with a meeting.
 */
const CreateLeadModal = () => {
  const { modals, closeModal } = useModal();
  const { isOpen, data } = modals.createLead;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    position: '',
    source: '',
    notes: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      // Pre-fill data if available
      if (data?.meetingData) {
        const { meetingData } = data;
        setFormData({
          firstName: '',
          lastName: '',
          email: meetingData.attendees?.[0] || '',
          phone: '',
          companyName: '',
          position: '',
          source: 'Meeting',
          notes: `From meeting: ${meetingData.title} on ${new Date(meetingData.date).toLocaleDateString()}`
        });
      } else {
        // Default empty form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          companyName: '',
          position: '',
          source: '',
          notes: ''
        });
      }
      
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call an API to create the lead
      console.log('Creating lead:', {
        ...formData,
        entityType: data?.entityType,
        entityId: data?.entityId,
        meetingId: data?.meetingData?.id
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      
      // Close modal after a delay
      setTimeout(() => {
        closeModal('createLead');
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Error creating lead:', err);
      setError('Failed to create lead. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => closeModal('createLead')}
      title={
        <div className={styles.modalTitleWithIcon}>
          <FaUserPlus className={styles.modalTitleIcon} />
          Create New Lead
        </div>
      }
      size="md"
    >
      {success ? (
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <h3>Lead Created Successfully!</h3>
          <p>The new lead has been added to the system.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="companyName">Company</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="position">Position</label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="source">Lead Source</label>
            <select
              id="source"
              name="source"
              value={formData.source}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value="">-- Select Source --</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Meeting">Meeting</option>
              <option value="Event">Event</option>
              <option value="Social Media">Social Media</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              className={styles.textarea}
            />
          </div>
          
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => closeModal('createLead')}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Lead'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default CreateLeadModal;
