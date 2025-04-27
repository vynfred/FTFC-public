import React from 'react';
import { FaArrowLeft, FaCalendarPlus, FaEdit, FaFileUpload, FaSave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from '../DetailPages.module.css';

/**
 * Client header component with navigation and action buttons
 */
const ClientHeader = ({ 
  client, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onScheduleMeeting, 
  onUploadDocument 
}) => {
  const navigate = useNavigate();

  return (
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
              onClick={onSave}
            >
              <FaSave /> Save
            </button>
            <button
              className={styles.actionButton}
              onClick={onCancel}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className={styles.actionButton}
              onClick={onScheduleMeeting}
            >
              <FaCalendarPlus /> Schedule Meeting
            </button>
            <button
              className={styles.actionButton}
              onClick={onUploadDocument}
            >
              <FaFileUpload /> Upload Document
            </button>
            <button
              className={styles.actionButton}
              onClick={onEdit}
            >
              <FaEdit /> Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ClientHeader;
