import React, { useState } from 'react';
import { FaCheckCircle, FaEdit, FaEllipsisH, FaRegCircle, FaTrash } from 'react-icons/fa';
import { MILESTONE_STATUS } from '../../services/MilestoneService';
import styles from './MilestoneListInteractive.module.css';

/**
 * MilestoneListInteractive component for displaying and managing milestones
 * 
 * @param {Object} props
 * @param {Array} props.milestones - Array of milestone objects
 * @param {Function} props.onEdit - Function called when a milestone is edited
 * @param {Function} props.onDelete - Function called when a milestone is deleted
 * @param {Function} props.onStatusChange - Function called when a milestone's status is changed
 * @param {Boolean} props.isEditable - Whether the milestones can be edited
 * @param {Boolean} props.isLoading - Whether the milestones are loading
 */
const MilestoneListInteractive = ({
  milestones = [],
  onEdit,
  onDelete,
  onStatusChange,
  isEditable = true,
  isLoading = false
}) => {
  const [activeMenu, setActiveMenu] = useState(null);
  
  // Toggle the menu for a milestone
  const toggleMenu = (milestoneId) => {
    setActiveMenu(activeMenu === milestoneId ? null : milestoneId);
  };
  
  // Close all menus
  const closeMenus = () => {
    setActiveMenu(null);
  };
  
  // Handle edit button click
  const handleEdit = (milestone) => {
    closeMenus();
    if (onEdit) {
      onEdit(milestone);
    }
  };
  
  // Handle delete button click
  const handleDelete = (milestone) => {
    closeMenus();
    if (onDelete) {
      onDelete(milestone);
    }
  };
  
  // Handle status change
  const handleStatusChange = (milestone, newStatus) => {
    closeMenus();
    if (onStatusChange) {
      onStatusChange(milestone, newStatus);
    }
  };
  
  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case MILESTONE_STATUS.COMPLETED:
        return <FaCheckCircle className={styles.completedIcon} />;
      case MILESTONE_STATUS.IN_PROGRESS:
        return <FaRegCircle className={`${styles.pendingIcon} ${styles.inProgressIcon}`} />;
      case MILESTONE_STATUS.PENDING:
      default:
        return <FaRegCircle className={styles.pendingIcon} />;
    }
  };
  
  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case MILESTONE_STATUS.COMPLETED:
        return 'Completed';
      case MILESTONE_STATUS.IN_PROGRESS:
        return 'In Progress';
      case MILESTONE_STATUS.PENDING:
      default:
        return 'Pending';
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (isLoading) {
    return (
      <div className={styles.loading}>
        Loading milestones...
      </div>
    );
  }
  
  if (!milestones || milestones.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No milestones available</p>
      </div>
    );
  }
  
  return (
    <div className={styles.milestoneList}>
      {milestones.map((milestone) => (
        <div 
          key={milestone.id} 
          className={`${styles.milestoneItem} ${styles[milestone.status || 'pending']}`}
        >
          <div className={styles.milestoneStatus}>
            {getStatusIcon(milestone.status)}
          </div>
          
          <div className={styles.milestoneContent}>
            <h4 className={styles.milestoneTitle}>{milestone.title}</h4>
            
            {milestone.description && (
              <p className={styles.milestoneDescription}>{milestone.description}</p>
            )}
            
            <div className={styles.milestoneDetails}>
              <span className={`${styles.milestoneStatusText} ${styles[milestone.status || 'pending']}`}>
                {getStatusText(milestone.status)}
              </span>
              
              {milestone.date && (
                <span className={styles.milestoneDate}>
                  {formatDate(milestone.date)}
                </span>
              )}
            </div>
            
            {milestone.notes && (
              <p className={styles.milestoneNotes}>{milestone.notes}</p>
            )}
          </div>
          
          {isEditable && (
            <div className={styles.milestoneActions}>
              <button
                type="button"
                className={styles.menuButton}
                onClick={() => toggleMenu(milestone.id)}
                aria-label="Milestone actions"
              >
                <FaEllipsisH />
              </button>
              
              {activeMenu === milestone.id && (
                <div className={styles.actionsMenu}>
                  <button
                    type="button"
                    className={styles.menuItem}
                    onClick={() => handleEdit(milestone)}
                  >
                    <FaEdit /> Edit
                  </button>
                  
                  {milestone.status !== MILESTONE_STATUS.COMPLETED && (
                    <button
                      type="button"
                      className={styles.menuItem}
                      onClick={() => handleStatusChange(milestone, MILESTONE_STATUS.COMPLETED)}
                    >
                      <FaCheckCircle /> Mark Complete
                    </button>
                  )}
                  
                  {milestone.status === MILESTONE_STATUS.PENDING && (
                    <button
                      type="button"
                      className={styles.menuItem}
                      onClick={() => handleStatusChange(milestone, MILESTONE_STATUS.IN_PROGRESS)}
                    >
                      <FaRegCircle /> Mark In Progress
                    </button>
                  )}
                  
                  {milestone.status === MILESTONE_STATUS.IN_PROGRESS && (
                    <button
                      type="button"
                      className={styles.menuItem}
                      onClick={() => handleStatusChange(milestone, MILESTONE_STATUS.PENDING)}
                    >
                      <FaRegCircle /> Mark Pending
                    </button>
                  )}
                  
                  {milestone.status === MILESTONE_STATUS.COMPLETED && (
                    <button
                      type="button"
                      className={styles.menuItem}
                      onClick={() => handleStatusChange(milestone, MILESTONE_STATUS.IN_PROGRESS)}
                    >
                      <FaRegCircle /> Reopen
                    </button>
                  )}
                  
                  <button
                    type="button"
                    className={`${styles.menuItem} ${styles.deleteItem}`}
                    onClick={() => handleDelete(milestone)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MilestoneListInteractive;
