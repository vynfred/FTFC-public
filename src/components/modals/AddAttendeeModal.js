import React, { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { useModal } from '../../context/ModalContext';
import Modal from '../ui/feedback/Modal';
import styles from './Modals.module.css';

/**
 * Add Attendee Modal
 * 
 * This modal allows users to add attendees to a meeting.
 */
const AddAttendeeModal = () => {
  const { modals, closeModal } = useModal();
  const { isOpen, data } = modals.addAttendee;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        email: '',
        role: ''
      });
      
      setSuccess(false);
      setError(null);
    }
  }, [isOpen]);

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
      // In a real app, this would call an API to add the attendee
      console.log('Adding attendee:', {
        ...formData,
        meetingId: data?.meetingId
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      
      // Close modal after a delay
      setTimeout(() => {
        closeModal('addAttendee');
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Error adding attendee:', err);
      setError('Failed to add attendee. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => closeModal('addAttendee')}
      title={
        <div className={styles.modalTitleWithIcon}>
          <FaUserPlus className={styles.modalTitleIcon} />
          Add Attendee
        </div>
      }
      size="sm"
    >
      {success ? (
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <h3>Attendee Added Successfully!</h3>
          <p>The attendee has been added to the meeting.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
          
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
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value="">-- Select Role --</option>
              <option value="Required">Required</option>
              <option value="Optional">Optional</option>
            </select>
          </div>
          
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => closeModal('addAttendee')}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Attendee'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default AddAttendeeModal;
