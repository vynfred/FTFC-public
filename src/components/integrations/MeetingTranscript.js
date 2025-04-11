import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaUserFriends, FaFileAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { getTranscriptById, updateTranscript } from '../../services/meetingTranscriptService';
import styles from './Integrations.module.css';

/**
 * Meeting Transcript Component
 * 
 * This component displays a meeting transcript and allows editing.
 */
const MeetingTranscript = ({ transcriptId, readOnly = false }) => {
  const [transcript, setTranscript] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState({});
  
  // Fetch transcript on component mount
  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        const transcriptData = await getTranscriptById(transcriptId);
        setTranscript(transcriptData);
      } catch (error) {
        console.error('Error fetching transcript:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTranscript();
  }, [transcriptId]);
  
  // Handle edit button click
  const handleEditClick = () => {
    setEditedTranscript({
      transcript: transcript.transcript,
      summary: transcript.summary,
      keyPoints: [...transcript.keyPoints],
      actionItems: [...transcript.actionItems]
    });
    setIsEditing(true);
  };
  
  // Handle save button click
  const handleSaveClick = async () => {
    try {
      await updateTranscript(transcriptId, editedTranscript);
      setTranscript({
        ...transcript,
        ...editedTranscript
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating transcript:', error);
      setError(error.message);
    }
  };
  
  // Handle cancel button click
  const handleCancelClick = () => {
    setIsEditing(false);
  };
  
  // Handle transcript text change
  const handleTranscriptChange = (e) => {
    setEditedTranscript({
      ...editedTranscript,
      transcript: e.target.value
    });
  };
  
  // Handle summary text change
  const handleSummaryChange = (e) => {
    setEditedTranscript({
      ...editedTranscript,
      summary: e.target.value
    });
  };
  
  // Handle key point change
  const handleKeyPointChange = (index, value) => {
    const updatedKeyPoints = [...editedTranscript.keyPoints];
    updatedKeyPoints[index] = value;
    setEditedTranscript({
      ...editedTranscript,
      keyPoints: updatedKeyPoints
    });
  };
  
  // Handle add key point
  const handleAddKeyPoint = () => {
    setEditedTranscript({
      ...editedTranscript,
      keyPoints: [...editedTranscript.keyPoints, '']
    });
  };
  
  // Handle remove key point
  const handleRemoveKeyPoint = (index) => {
    const updatedKeyPoints = [...editedTranscript.keyPoints];
    updatedKeyPoints.splice(index, 1);
    setEditedTranscript({
      ...editedTranscript,
      keyPoints: updatedKeyPoints
    });
  };
  
  // Handle action item change
  const handleActionItemChange = (index, field, value) => {
    const updatedActionItems = [...editedTranscript.actionItems];
    updatedActionItems[index] = {
      ...updatedActionItems[index],
      [field]: value
    };
    setEditedTranscript({
      ...editedTranscript,
      actionItems: updatedActionItems
    });
  };
  
  // Handle add action item
  const handleAddActionItem = () => {
    setEditedTranscript({
      ...editedTranscript,
      actionItems: [...editedTranscript.actionItems, {
        description: '',
        assignee: '',
        dueDate: null
      }]
    });
  };
  
  // Handle remove action item
  const handleRemoveActionItem = (index) => {
    const updatedActionItems = [...editedTranscript.actionItems];
    updatedActionItems.splice(index, 1);
    setEditedTranscript({
      ...editedTranscript,
      actionItems: updatedActionItems
    });
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  if (isLoading) {
    return <div className={styles.loading}>Loading transcript...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }
  
  if (!transcript) {
    return <div className={styles.noTranscript}>Transcript not found</div>;
  }
  
  return (
    <div className={styles.transcriptContainer}>
      <div className={styles.transcriptHeader}>
        <h2 className={styles.transcriptTitle}>{transcript.title}</h2>
        <div className={styles.transcriptMeta}>
          <div className={styles.transcriptMetaItem}>
            <FaCalendarAlt className={styles.transcriptMetaIcon} />
            <span>{formatDate(transcript.date)}</span>
          </div>
          <div className={styles.transcriptMetaItem}>
            <FaUserFriends className={styles.transcriptMetaIcon} />
            <span>{transcript.participants.join(', ')}</span>
          </div>
        </div>
        
        {!readOnly && (
          <div className={styles.transcriptActions}>
            {isEditing ? (
              <>
                <button 
                  className={`${styles.transcriptActionButton} ${styles.saveButton}`}
                  onClick={handleSaveClick}
                >
                  <FaSave className={styles.buttonIcon} />
                  Save
                </button>
                <button 
                  className={`${styles.transcriptActionButton} ${styles.cancelButton}`}
                  onClick={handleCancelClick}
                >
                  <FaTimes className={styles.buttonIcon} />
                  Cancel
                </button>
              </>
            ) : (
              <button 
                className={`${styles.transcriptActionButton} ${styles.editButton}`}
                onClick={handleEditClick}
              >
                <FaEdit className={styles.buttonIcon} />
                Edit
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className={styles.transcriptContent}>
        <div className={styles.transcriptSection}>
          <h3 className={styles.transcriptSectionTitle}>
            <FaFileAlt className={styles.sectionIcon} />
            Summary
          </h3>
          {isEditing ? (
            <textarea
              className={styles.transcriptTextarea}
              value={editedTranscript.summary}
              onChange={handleSummaryChange}
              rows={4}
            />
          ) : (
            <p className={styles.transcriptSummary}>{transcript.summary}</p>
          )}
        </div>
        
        <div className={styles.transcriptSection}>
          <h3 className={styles.transcriptSectionTitle}>Key Points</h3>
          {isEditing ? (
            <div className={styles.editableList}>
              {editedTranscript.keyPoints.map((point, index) => (
                <div key={index} className={styles.editableItem}>
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => handleKeyPointChange(index, e.target.value)}
                    className={styles.editableInput}
                  />
                  <button
                    className={styles.removeItemButton}
                    onClick={() => handleRemoveKeyPoint(index)}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              <button
                className={styles.addItemButton}
                onClick={handleAddKeyPoint}
              >
                Add Key Point
              </button>
            </div>
          ) : (
            <ul className={styles.keyPointsList}>
              {transcript.keyPoints.map((point, index) => (
                <li key={index} className={styles.keyPoint}>{point}</li>
              ))}
            </ul>
          )}
        </div>
        
        <div className={styles.transcriptSection}>
          <h3 className={styles.transcriptSectionTitle}>Action Items</h3>
          {isEditing ? (
            <div className={styles.editableList}>
              {editedTranscript.actionItems.map((item, index) => (
                <div key={index} className={styles.editableActionItem}>
                  <div className={styles.actionItemField}>
                    <label>Description:</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleActionItemChange(index, 'description', e.target.value)}
                      className={styles.editableInput}
                    />
                  </div>
                  <div className={styles.actionItemField}>
                    <label>Assignee:</label>
                    <input
                      type="text"
                      value={item.assignee || ''}
                      onChange={(e) => handleActionItemChange(index, 'assignee', e.target.value)}
                      className={styles.editableInput}
                    />
                  </div>
                  <div className={styles.actionItemField}>
                    <label>Due Date:</label>
                    <input
                      type="date"
                      value={item.dueDate || ''}
                      onChange={(e) => handleActionItemChange(index, 'dueDate', e.target.value)}
                      className={styles.editableInput}
                    />
                  </div>
                  <button
                    className={styles.removeItemButton}
                    onClick={() => handleRemoveActionItem(index)}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              <button
                className={styles.addItemButton}
                onClick={handleAddActionItem}
              >
                Add Action Item
              </button>
            </div>
          ) : (
            <ul className={styles.actionItemsList}>
              {transcript.actionItems.map((item, index) => (
                <li key={index} className={styles.actionItem}>
                  <div className={styles.actionItemDescription}>{item.description}</div>
                  {item.assignee && (
                    <div className={styles.actionItemAssignee}>Assignee: {item.assignee}</div>
                  )}
                  {item.dueDate && (
                    <div className={styles.actionItemDueDate}>Due: {formatDate(item.dueDate)}</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className={styles.transcriptSection}>
          <h3 className={styles.transcriptSectionTitle}>Full Transcript</h3>
          {isEditing ? (
            <textarea
              className={styles.transcriptTextarea}
              value={editedTranscript.transcript}
              onChange={handleTranscriptChange}
              rows={10}
            />
          ) : (
            <div className={styles.fullTranscript}>{transcript.transcript}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingTranscript;
