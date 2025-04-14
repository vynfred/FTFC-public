import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useStatsView } from '../../context/StatsViewContext';
import { getStoredTokens } from '../../services/googleIntegration';
import { getTranscriptsForEntity, processGeminiNotesForEntity } from '../../services/meetingTranscriptService';
import './MeetingTranscriptList.css';

/**
 * Component to display a list of meeting transcripts for an entity
 */
const MeetingTranscriptList = ({ entityId, entityType, readOnly = false }) => {
  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTranscript, setExpandedTranscript] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { viewCompanyStats } = useStatsView();

  // Fetch transcripts when component mounts or when entityId/entityType changes
  useEffect(() => {
    const fetchTranscripts = async () => {
      try {
        setLoading(true);

        // Use the service function to get transcripts
        const transcriptData = await getTranscriptsForEntity(entityType, entityId);
        setTranscripts(transcriptData);
      } catch (err) {
        console.error('Error fetching transcripts:', err);
        setError('Failed to load meeting transcripts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (entityId && entityType) {
      fetchTranscripts();
    }
  }, [entityId, entityType]);

  // Handle transcript expansion
  const toggleTranscript = (transcriptId) => {
    setExpandedTranscript(expandedTranscript === transcriptId ? null : transcriptId);
  };

  // Handle refresh from Gemini Notes - only for team members
  const handleRefreshFromGemini = async () => {
    try {
      setRefreshing(true);

      // Get Google tokens
      const tokens = getStoredTokens();

      if (!tokens) {
        setError('Not connected to Google. Please connect your Google account first.');
        setRefreshing(false);
        return;
      }

      // Process Gemini Notes for this entity
      await processGeminiNotesForEntity(entityType, entityId, tokens);

      // Refresh transcripts
      const transcriptData = await getTranscriptsForEntity(entityType, entityId);
      setTranscripts(transcriptData);

      setRefreshing(false);
    } catch (err) {
      console.error('Error refreshing from Gemini Notes:', err);
      setError('Failed to refresh from Gemini Notes. Please try again later.');
      setRefreshing(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading transcripts...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (transcripts.length === 0) {
    return (
      <div className="no-transcripts">
        <p>No meeting transcripts found</p>
        {/* Only show refresh button for team members (not readOnly) */}
        {!readOnly && (
          <button
            className="refresh-button"
            onClick={handleRefreshFromGemini}
            disabled={refreshing}
          >
            {refreshing ? 'Checking Gemini Notes...' : 'Check Gemini Notes'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="meeting-transcripts">
      <div className="transcripts-header">
        <h3>Meeting Transcripts</h3>
        {/* Only show refresh button for team members (not readOnly) */}
        {!readOnly && (
          <button
            className="refresh-button"
            onClick={handleRefreshFromGemini}
            disabled={refreshing}
          >
            {refreshing ? 'Checking Gemini Notes...' : 'Check Gemini Notes'}
          </button>
        )}
      </div>

      <div className="transcripts-list">
        {transcripts.map(transcript => (
          <div
            key={transcript.id}
            className={`transcript-item ${expandedTranscript === transcript.id ? 'expanded' : ''} ${transcript.sourceType === 'gemini' ? 'gemini-source' : ''}`}
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
                        <li key={index}>
                          {item.description}
                          {item.assignee && <span className="assignee"> ({item.assignee})</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {transcript.participants && transcript.participants.length > 0 && (
                  <div className="transcript-participants">
                    <h5>Participants</h5>
                    <ul>
                      {transcript.participants.map((participant, index) => (
                        <li key={index}>{participant}</li>
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

                {transcript.transcriptUrl && (
                  <div className="transcript-link">
                    <a
                      href={transcript.transcriptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-original-button"
                    >
                      View Original in Google Docs
                    </a>
                  </div>
                )}

                <div className="transcript-source">
                  <p>Source: {transcript.sourceType === 'gemini' ? 'Google Meet (Gemini)' : transcript.sourceType || 'Unknown'}</p>
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
  entityType: PropTypes.oneOf(['client', 'investor', 'partner', 'lead']).isRequired,
  readOnly: PropTypes.bool
};

export default MeetingTranscriptList;
