import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { MILESTONE_STATUS } from '../../services/MilestoneService';
import styles from './MilestoneForm.module.css';

/**
 * MilestoneForm component for creating and editing milestones
 * 
 * @param {Object} props
 * @param {Object} props.initialData - Initial milestone data
 * @param {Function} props.onSubmit - Function called when the form is submitted
 * @param {Function} props.onCancel - Function called when the form is cancelled
 * @param {Boolean} props.isSubmitting - Whether the form is currently submitting
 * @param {String} props.error - Error message to display
 */
const MilestoneForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
  error = null
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: MILESTONE_STATUS.PENDING,
    date: new Date().toISOString().split('T')[0],
    notes: '',
    ...initialData
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  
  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Validate the form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.date) {
      errors.date = 'Date is required';
    }
    
    setValidationErrors(errors);
    
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (onSubmit) {
      onSubmit(formData);
    }
  };
  
  // Handle form cancellation
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };
  
  return (
    <form className={styles.milestoneForm} onSubmit={handleSubmit}>
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      <div className={styles.formGroup}>
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className={validationErrors.title ? styles.inputError : ''}
          disabled={isSubmitting}
          required
        />
        {validationErrors.title && (
          <div className={styles.fieldError}>{validationErrors.title}</div>
        )}
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows="3"
          disabled={isSubmitting}
        ></textarea>
      </div>
      
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            disabled={isSubmitting}
          >
            <option value={MILESTONE_STATUS.PENDING}>Pending</option>
            <option value={MILESTONE_STATUS.IN_PROGRESS}>In Progress</option>
            <option value={MILESTONE_STATUS.COMPLETED}>Completed</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="date">Target Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className={validationErrors.date ? styles.inputError : ''}
            disabled={isSubmitting}
            required
          />
          {validationErrors.date && (
            <div className={styles.fieldError}>{validationErrors.date}</div>
          )}
        </div>
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows="3"
          disabled={isSubmitting}
        ></textarea>
      </div>
      
      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          <FaTimes /> Cancel
        </button>
        
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          <FaSave /> {isSubmitting ? 'Saving...' : 'Save Milestone'}
        </button>
      </div>
    </form>
  );
};

export default MilestoneForm;
