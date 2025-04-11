import React from 'react';
import { FaTimes } from 'react-icons/fa';
import MilestoneForm from './MilestoneForm';
import styles from './MilestoneModal.module.css';

/**
 * MilestoneModal component for adding and editing milestones
 * 
 * @param {Object} props
 * @param {Boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function called when the modal is closed
 * @param {Object} props.milestone - Milestone data for editing (null for creating)
 * @param {Function} props.onSubmit - Function called when the form is submitted
 * @param {Boolean} props.isSubmitting - Whether the form is currently submitting
 * @param {String} props.error - Error message to display
 */
const MilestoneModal = ({
  isOpen,
  onClose,
  milestone = null,
  onSubmit,
  isSubmitting = false,
  error = null
}) => {
  if (!isOpen) {
    return null;
  }
  
  const isEditing = !!milestone;
  const title = isEditing ? 'Edit Milestone' : 'Add Milestone';
  
  // Handle form submission
  const handleSubmit = (formData) => {
    if (onSubmit) {
      onSubmit(formData);
    }
  };
  
  // Handle modal close
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <FaTimes />
          </button>
        </div>
        
        <div className={styles.modalContent}>
          <MilestoneForm
            initialData={milestone}
            onSubmit={handleSubmit}
            onCancel={handleClose}
            isSubmitting={isSubmitting}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default MilestoneModal;
