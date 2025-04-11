import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-config';
import './MeetingTranscriptList.css';

/**
 * Component to display a list of meeting transcripts for an entity
 */
const MeetingTranscriptList = ({ entityId, entityType }) => {
  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTranscript, setExpandedTranscript] = useState(null);

  useEffect(() => {
    const fetchTranscripts = async () => {
      try {
        setLoading(true);
        
        // Query transcripts for this entity
        const transcriptsQuery = query(
          collection(db, 'transcripts'),
          where('entityId', '==', entityId),
          where('entityType', '==', entityType),
          orderBy('date', 'desc')
        );
        
        const querySnapshot = await getDocs(transcriptsQuery);
        
        const transcriptData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate() || new Date()
        }));
        
        setTranscripts(transcriptData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching transcripts:', err);
        setError('Failed to load meeting transcripts. Please try again later.');
        setLoading(false);
      }
    };
    
    if (entityId && entityType) {
      fetchTranscripts();
    }
  }, [entityId, entityType]);

  const toggleTranscript = (id) => {
    if (expandedTranscript === id) {
      setExpandedTranscript(null);
    } else {
      setExpandedTranscript(id);
    }
  };

  if (loading) {
    return <div className="transcript-loading">Loading meeting transcripts...</div>;
  }

  if (error) {
    return <div className="transcript-error">{error}</div>;
  }

  if (transcripts.length === 0) {
    return (
      <div className="transcript-empty">
        <p>No meeting transcripts available.</p>
      </div>
    );
  }

  return (
    <div className="meeting-transcripts">
      <h3 className="transcripts-title">Meeting Transcripts</h3>
      
      <div className="transcripts-list">
        {transcripts.map(transcript => (
          <div 
            key={transcript.id} 
            className={`transcript-item ${expandedTranscript === transcript.id ? 'expanded' : ''}`}
          >
            <div 
              className="transcript-header" 
              onClick={() => toggleTranscript(transcript.id)}
            >
              <div className="transcript-title">
                <h4>{transcript.title || 'Untitled Meeting'}</h4>
                <span className="transcript-date">
                  {transcript.date.toLocaleDateString()} at {transcript.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="transcript-toggle">
                <span className="toggle-icon">
                  {expandedTranscript === transcript.id ? '−' : '+'}
                </span>
              </div>
            </div>
            
            {expandedTranscript === transcript.id && (
              <div className="transcript-content">
                {transcript.summary && (
                  <div className="transcript-summary">
                    <h5>Summary</h5>
                    <p>{transcript.summary}</p>
                  </div>
                )}
                
                {transcript.keyPoints && transcript.keyPoints.length > 0 && (
                  <div className="transcript-key-points">
                    <h5>Key Points</h5>
                    <ul>
                      {transcript.keyPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {transcript.actionItems && transcript.actionItems.length > 0 && (
                  <div className="transcript-action-items">
                    <h5>Action Items</h5>
                    <ul>
                      {transcript.actionItems.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {transcript.transcript && (
                  <div className="transcript-full">
                    <h5>Full Transcript</h5>
                    <div className="transcript-text">
                      {transcript.transcript}
                    </div>
                  </div>
                )}
                
                <div className="transcript-source">
                  <p>Source: {transcript.sourceType === 'gemini' ? 'Google Meet (Gemini)' : transcript.sourceType}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

MeetingTranscriptList.propTypes = {
  entityId: PropTypes.string.isRequired,
  entityType: PropTypes.oneOf(['client', 'investor', 'partner', 'lead']).isRequired
};

export default MeetingTranscriptList;
