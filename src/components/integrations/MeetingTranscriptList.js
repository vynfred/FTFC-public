import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaFileAlt, FaChevronRight } from 'react-icons/fa';
import { getTranscriptsForEntity } from '../../services/meetingTranscriptService';
import MeetingTranscript from './MeetingTranscript';
import styles from './Integrations.module.css';

/**
 * Meeting Transcript List Component
 * 
 * This component displays a list of meeting transcripts for an entity.
 */
const MeetingTranscriptList = ({ 
  entityType, // 'client', 'investor', or 'partner'
  entityId,
  readOnly = false
}) => {
  const [transcripts, setTranscripts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTranscriptId, setSelectedTranscriptId] = useState(null);
  
  // Fetch transcripts on component mount
  useEffect(() => {
    const fetchTranscripts = async () => {
      try {
        const transcriptData = await getTranscriptsForEntity(entityType, entityId);
        setTranscripts(transcriptData);
      } catch (error) {
        console.error('Error fetching transcripts:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (entityType && entityId) {
      fetchTranscripts();
    } else {
      setIsLoading(false);
    }
  }, [entityType, entityId]);
  
  // Handle transcript selection
  const handleTranscriptSelect = (transcriptId) => {
    setSelectedTranscriptId(transcriptId === selectedTranscriptId ? null : transcriptId);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  if (isLoading) {
    return <div className={styles.loading}>Loading transcripts...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }
  
  if (!entityType || !entityId) {
    return <div className={styles.noEntity}>No entity specified</div>;
  }
  
  if (transcripts.length === 0) {
    return (
      <div className={styles.noTranscripts}>
        <FaFileAlt className={styles.noTranscriptsIcon} />
        <p>No meeting transcripts available</p>
      </div>
    );
  }
  
  return (
    <div className={styles.transcriptListContainer}>
      <h3 className={styles.transcriptListTitle}>Meeting Transcripts</h3>
      
      <div className={styles.transcriptList}>
        {transcripts.map((transcript) => (
          <div key={transcript.id} className={styles.transcriptListItem}>
            <div 
              className={`${styles.transcriptListItemHeader} ${selectedTranscriptId === transcript.id ? styles.active : ''}`}
              onClick={() => handleTranscriptSelect(transcript.id)}
            >
              <div className={styles.transcriptListItemInfo}>
                <div className={styles.transcriptListItemTitle}>
                  <FaCalendarAlt className={styles.transcriptListItemIcon} />
                  {transcript.title}
                </div>
                <div className={styles.transcriptListItemDate}>
                  {formatDate(transcript.date)}
                </div>
              </div>
              <FaChevronRight className={`${styles.transcriptListItemArrow} ${selectedTranscriptId === transcript.id ? styles.rotated : ''}`} />
            </div>
            
            {selectedTranscriptId === transcript.id && (
              <div className={styles.transcriptListItemContent}>
                <MeetingTranscript 
                  transcriptId={transcript.id} 
                  readOnly={readOnly}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingTranscriptList;
