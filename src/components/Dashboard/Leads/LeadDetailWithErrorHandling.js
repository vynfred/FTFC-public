import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { getLeadById, updateLead, deleteLead } from '../../../services/leadsService';
import useApi from '../../../hooks/useApi';
import ErrorFallback from '../../common/ErrorFallback';
import LoadingScreen from '../../common/LoadingScreen';
import styles from '../DetailPages.module.css';

/**
 * Lead Detail Component with Error Handling
 * 
 * Displays lead details with proper error handling and loading states.
 */
const LeadDetailWithErrorHandling = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // API hooks for different operations
  const {
    loading: loadingLead,
    error: leadError,
    data: lead,
    request: fetchLead
  } = useApi({
    errorMessage: 'Failed to load lead details'
  });
  
  const {
    loading: updating,
    error: updateError,
    request: performUpdate
  } = useApi({
    successMessage: 'Lead updated successfully',
    errorMessage: 'Failed to update lead'
  });
  
  const {
    loading: deleting,
    error: deleteError,
    request: performDelete
  } = useApi({
    successMessage: 'Lead deleted successfully',
    errorMessage: 'Failed to delete lead',
    onSuccess: () => navigate('/dashboard/leads')
  });
  
  // Fetch lead data on component mount
  useEffect(() => {
    fetchLead(getLeadById, [id]);
  }, [id, fetchLead]);
  
  // Handle update lead
  const handleUpdateLead = async (updatedData) => {
    await performUpdate(updateLead, [id, updatedData]);
    // Refresh lead data after update
    fetchLead(getLeadById, [id]);
  };
  
  // Handle delete lead
  const handleDeleteLead = async () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      await performDelete(deleteLead, [id]);
    }
  };
  
  // Handle retry on error
  const handleRetry = () => {
    fetchLead(getLeadById, [id]);
  };
  
  // Show loading state
  if (loadingLead) {
    return <LoadingScreen message="Loading lead details..." />;
  }
  
  // Show error state
  if (leadError) {
    return (
      <ErrorFallback
        error={leadError}
        resetError={handleRetry}
        customMessage="We couldn't load the lead details. Please try again."
      />
    );
  }
  
  // Show not found state
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
          <button
            className={styles.actionButton}
            onClick={() => handleUpdateLead({ status: 'qualified' })}
            disabled={updating}
          >
            Mark as Qualified
          </button>
          <button
            className={styles.actionButton}
            onClick={handleDeleteLead}
            disabled={deleting}
          >
            Delete Lead
          </button>
        </div>
      </div>
      
      {/* Display any update or delete errors */}
      {updateError && (
        <div className={styles.errorMessage}>
          {updateError.message}
        </div>
      )}
      
      {deleteError && (
        <div className={styles.errorMessage}>
          {deleteError.message}
        </div>
      )}
      
      {/* Lead details */}
      <div className={styles.detailContent}>
        <h2 className={styles.leadName}>{lead.name}</h2>
        
        <div className={styles.leadStatus}>
          <span className={`${styles.statusBadge} ${styles[lead.status]}`}>
            {lead.status}
          </span>
        </div>
        
        <div className={styles.detailSection}>
          <h3>Contact Information</h3>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Email:</span>
              <span className={styles.detailValue}>{lead.email}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Phone:</span>
              <span className={styles.detailValue}>{lead.phone || 'N/A'}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Company:</span>
              <span className={styles.detailValue}>{lead.company || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.detailSection}>
          <h3>Lead Information</h3>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Source:</span>
              <span className={styles.detailValue}>{lead.source}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Assigned To:</span>
              <span className={styles.detailValue}>{lead.assignedTo || 'Unassigned'}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Created:</span>
              <span className={styles.detailValue}>
                {lead.createdAt?.toDate?.() 
                  ? new Date(lead.createdAt.toDate()).toLocaleDateString() 
                  : new Date(lead.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        {lead.notes && (
          <div className={styles.detailSection}>
            <h3>Notes</h3>
            <p className={styles.notes}>{lead.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadDetailWithErrorHandling;
