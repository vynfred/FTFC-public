import React, { useState, useEffect } from 'react';
import { FaCheck, FaEdit, FaPlus, FaSave, FaTrash, FaUserPlus } from 'react-icons/fa';
import { updateTranscript } from '../../services/meetingTranscriptService';
import styles from './ActionItemManager.module.css';

/**
 * Action Item Manager Component
 * 
 * This component allows users to manage action items from meeting transcripts.
 * It provides functionality to add, edit, delete, and assign action items.
 */
const ActionItemManager = ({ transcript, onUpdate }) => {
  const [actionItems, setActionItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    description: '',
    assignee: '',
    dueDate: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Initialize action items from transcript
  useEffect(() => {
    if (transcript && transcript.actionItems) {
      setActionItems(transcript.actionItems);
    }
  }, [transcript]);

  // Handle adding a new action item
  const handleAddItem = () => {
    setIsAdding(true);
    setIsEditing(false);
    setEditingItem(null);
    setNewItem({
      description: '',
      assignee: '',
      dueDate: ''
    });
  };

  // Handle editing an existing action item
  const handleEditItem = (item, index) => {
    setIsEditing(true);
    setIsAdding(false);
    setEditingItem(index);
    setNewItem({
      description: item.description,
      assignee: item.assignee || '',
      dueDate: item.dueDate || ''
    });
  };

  // Handle deleting an action item
  const handleDeleteItem = async (index) => {
    if (!window.confirm('Are you sure you want to delete this action item?')) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      // Create a copy of action items and remove the item at the specified index
      const updatedItems = [...actionItems];
      updatedItems.splice(index, 1);

      // Update the transcript with the new action items
      await updateTranscript(transcript.id, {
        actionItems: updatedItems
      });

      // Update local state
      setActionItems(updatedItems);
      
      // Show success message
      setSuccess('Action item deleted successfully');
      setTimeout(() => setSuccess(null), 3000);

      // Call the onUpdate callback if provided
      if (onUpdate) {
        onUpdate({
          ...transcript,
          actionItems: updatedItems
        });
      }
    } catch (err) {
      console.error('Error deleting action item:', err);
      setError('Failed to delete action item');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle saving a new or edited action item
  const handleSaveItem = async () => {
    // Validate input
    if (!newItem.description.trim()) {
      setError('Description is required');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      // Create a copy of action items
      const updatedItems = [...actionItems];

      // If editing, update the existing item
      if (isEditing && editingItem !== null) {
        updatedItems[editingItem] = {
          ...updatedItems[editingItem],
          description: newItem.description,
          assignee: newItem.assignee || null,
          dueDate: newItem.dueDate || null
        };
      } 
      // If adding, add the new item
      else if (isAdding) {
        updatedItems.push({
          description: newItem.description,
          assignee: newItem.assignee || null,
          dueDate: newItem.dueDate || null
        });
      }

      // Update the transcript with the new action items
      await updateTranscript(transcript.id, {
        actionItems: updatedItems
      });

      // Update local state
      setActionItems(updatedItems);
      setIsEditing(false);
      setIsAdding(false);
      setEditingItem(null);
      
      // Show success message
      setSuccess(isEditing ? 'Action item updated successfully' : 'Action item added successfully');
      setTimeout(() => setSuccess(null), 3000);

      // Call the onUpdate callback if provided
      if (onUpdate) {
        onUpdate({
          ...transcript,
          actionItems: updatedItems
        });
      }
    } catch (err) {
      console.error('Error saving action item:', err);
      setError('Failed to save action item');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle canceling the add/edit operation
  const handleCancel = () => {
    setIsEditing(false);
    setIsAdding(false);
    setEditingItem(null);
    setError(null);
  };

  // Handle input changes for the new/edited item
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle marking an action item as completed
  const handleMarkCompleted = async (index) => {
    try {
      setIsSaving(true);
      setError(null);

      // Create a copy of action items
      const updatedItems = [...actionItems];
      
      // Update the status of the item
      updatedItems[index] = {
        ...updatedItems[index],
        status: updatedItems[index].status === 'completed' ? 'pending' : 'completed'
      };

      // Update the transcript with the new action items
      await updateTranscript(transcript.id, {
        actionItems: updatedItems
      });

      // Update local state
      setActionItems(updatedItems);
      
      // Show success message
      setSuccess('Action item status updated');
      setTimeout(() => setSuccess(null), 3000);

      // Call the onUpdate callback if provided
      if (onUpdate) {
        onUpdate({
          ...transcript,
          actionItems: updatedItems
        });
      }
    } catch (err) {
      console.error('Error updating action item status:', err);
      setError('Failed to update action item status');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.actionItemManager}>
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      {success && (
        <div className={styles.successMessage}>
          <FaCheck className={styles.successIcon} />
          {success}
        </div>
      )}
      
      <div className={styles.actionItemHeader}>
        <h3>Action Items</h3>
        <button 
          className={styles.addButton}
          onClick={handleAddItem}
          disabled={isAdding || isEditing}
        >
          <FaPlus /> Add Action Item
        </button>
      </div>
      
      {(isAdding || isEditing) && (
        <div className={styles.actionItemForm}>
          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={newItem.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Enter action item description"
              required
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="assignee">Assignee</label>
              <input
                type="text"
                id="assignee"
                name="assignee"
                value={newItem.assignee}
                onChange={handleInputChange}
                placeholder="Enter assignee name"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={newItem.dueDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className={styles.formActions}>
            <button
              className={styles.cancelButton}
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
            
            <button
              className={styles.saveButton}
              onClick={handleSaveItem}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : (
                <>
                  <FaSave /> {isEditing ? 'Update' : 'Save'}
                </>
              )}
            </button>
          </div>
        </div>
      )}
      
      <div className={styles.actionItemList}>
        {actionItems.length === 0 ? (
          <div className={styles.emptyMessage}>
            No action items found. Add an action item to get started.
          </div>
        ) : (
          actionItems.map((item, index) => (
            <div 
              key={index} 
              className={`${styles.actionItem} ${item.status === 'completed' ? styles.completed : ''}`}
            >
              <div className={styles.actionItemCheckbox}>
                <input
                  type="checkbox"
                  checked={item.status === 'completed'}
                  onChange={() => handleMarkCompleted(index)}
                  id={`action-item-${index}`}
                />
                <label htmlFor={`action-item-${index}`} className={styles.checkboxLabel}></label>
              </div>
              
              <div className={styles.actionItemContent}>
                <div className={styles.actionItemDescription}>
                  {item.description}
                </div>
                
                <div className={styles.actionItemMeta}>
                  {item.assignee && (
                    <div className={styles.actionItemAssignee}>
                      <FaUserPlus className={styles.metaIcon} />
                      {item.assignee}
                    </div>
                  )}
                  
                  {item.dueDate && (
                    <div className={styles.actionItemDueDate}>
                      Due: {new Date(item.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.actionItemActions}>
                <button
                  className={styles.editButton}
                  onClick={() => handleEditItem(item, index)}
                  disabled={isEditing || isAdding}
                  title="Edit action item"
                >
                  <FaEdit />
                </button>
                
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteItem(index)}
                  disabled={isEditing || isAdding}
                  title="Delete action item"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActionItemManager;
