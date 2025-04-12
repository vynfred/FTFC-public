import React, { useEffect, useState } from 'react';
import { FaCheck, FaClipboard, FaExclamationCircle, FaFileAlt, FaSpinner, FaUserCircle } from 'react-icons/fa';
import { getTranscriptById } from '../../services/meetingTranscriptService';
import ActionItemManager from './ActionItemManager';
import styles from './MeetingTranscript.module.css';

/**
 * Meeting Transcript Viewer Component
 *
 * This component displays a meeting transcript with key points, action items, and summary.
 * It also provides functionality to copy text and assign action items.
 */
const MeetingTranscriptViewer = ({ transcriptId, meetingId }) => {
  const [transcript, setTranscript] = useState(null);
  const [showActionManager, setShowActionManager] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('transcript');
  const [copiedText, setCopiedText] = useState('');
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  // Fetch transcript data
  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        setLoading(true);
        setError(null);

        if (transcriptId) {
          const transcriptData = await getTranscriptById(transcriptId);
          setTranscript(transcriptData);
        } else {
          setError('No transcript ID provided');
        }
      } catch (err) {
        console.error('Error fetching transcript:', err);
        setError('Failed to load transcript');
      } finally {
        setLoading(false);
      }
    };

    fetchTranscript();
  }, [transcriptId]);

  // Handle transcript update
  const handleTranscriptUpdate = (updatedTranscript) => {
    setTranscript(updatedTranscript);
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(text);
        setShowCopiedMessage(true);
        setTimeout(() => setShowCopiedMessage(false), 2000);
      })
      .catch(err => {
        console.error('Error copying text:', err);
      });
  };

  // Format transcript text with speaker identification
  const formatTranscriptText = (text) => {
    if (!text) return '';

    // Split by speaker changes (e.g., "John: Hello" or "John Doe: Hello")
    const speakerPattern = /([A-Za-z\s]+):\s/g;
    const parts = text.split(speakerPattern);

    if (parts.length <= 1) {
      // No speaker pattern found, return the original text
      return <p className={styles.transcriptText}>{text}</p>;
    }

    // Format with speaker highlighting
    const formattedParts = [];
    for (let i = 1; i < parts.length; i += 2) {
      const speaker = parts[i];
      const speech = parts[i + 1] || '';

      formattedParts.push(
        <div key={i} className={styles.transcriptEntry}>
          <div className={styles.speaker}>
            <FaUserCircle className={styles.speakerIcon} />
            <span>{speaker}</span>
          </div>
          <div className={styles.speech}>{speech}</div>
        </div>
      );
    }

    return <div className={styles.transcriptContent}>{formattedParts}</div>;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.spinner} />
        <p>Loading transcript...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <FaExclamationCircle className={styles.errorIcon} />
        <p>{error}</p>
      </div>
    );
  }

  if (!transcript) {
    return (
      <div className={styles.noTranscriptContainer}>
        <FaFileAlt className={styles.noTranscriptIcon} />
        <p>No transcript available for this meeting.</p>
      </div>
    );
  }

  return (
    <div className={styles.transcriptViewer}>
      {showCopiedMessage && (
        <div className={styles.copiedMessage}>
          <FaCheck className={styles.copiedIcon} />
          Text copied to clipboard!
        </div>
      )}

      <div className={styles.transcriptHeader}>
        <h3>{transcript.title}</h3>
        <div className={styles.transcriptMeta}>
          <span className={styles.transcriptDate}>
            {new Date(transcript.date).toLocaleDateString()}
          </span>
          <span className={styles.transcriptSource}>
            Source: {transcript.sourceType === 'gemini' ? 'Gemini Notes' : 'Speech-to-Text'}
          </span>
        </div>
      </div>

      <div className={styles.transcriptTabs}>
        <button
          className={`${styles.transcriptTab} ${activeTab === 'transcript' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('transcript')}
        >
          Full Transcript
        </button>
        <button
          className={`${styles.transcriptTab} ${activeTab === 'summary' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
        <button
          className={`${styles.transcriptTab} ${activeTab === 'keyPoints' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('keyPoints')}
        >
          Key Points {transcript.keyPoints?.length > 0 && `(${transcript.keyPoints.length})`}
        </button>
        <button
          className={`${styles.transcriptTab} ${activeTab === 'actionItems' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('actionItems')}
        >
          Action Items {transcript.actionItems?.length > 0 && `(${transcript.actionItems.length})`}
        </button>
      </div>

      <div className={styles.transcriptBody}>
        {activeTab === 'transcript' && (
          <div className={styles.transcriptSection}>
            <div className={styles.sectionHeader}>
              <h4>Full Transcript</h4>
              <button
                className={styles.copyButton}
                onClick={() => handleCopyToClipboard(transcript.transcript)}
                title="Copy full transcript"
              >
                <FaClipboard /> Copy
              </button>
            </div>
            <div className={styles.transcriptTextContainer}>
              {formatTranscriptText(transcript.transcript)}
            </div>
          </div>
        )}

        {activeTab === 'summary' && (
          <div className={styles.transcriptSection}>
            <div className={styles.sectionHeader}>
              <h4>Summary</h4>
              <button
                className={styles.copyButton}
                onClick={() => handleCopyToClipboard(transcript.summary)}
                title="Copy summary"
              >
                <FaClipboard /> Copy
              </button>
            </div>
            <div className={styles.summaryContainer}>
              {transcript.summary ? (
                <p className={styles.summaryText}>{transcript.summary}</p>
              ) : (
                <p className={styles.noContentMessage}>No summary available for this transcript.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'keyPoints' && (
          <div className={styles.transcriptSection}>
            <div className={styles.sectionHeader}>
              <h4>Key Points</h4>
              <button
                className={styles.copyButton}
                onClick={() => handleCopyToClipboard(transcript.keyPoints.join('\n• '))}
                title="Copy key points"
              >
                <FaClipboard /> Copy All
              </button>
            </div>
            <div className={styles.keyPointsContainer}>
              {transcript.keyPoints && transcript.keyPoints.length > 0 ? (
                <ul className={styles.keyPointsList}>
                  {transcript.keyPoints.map((point, index) => (
                    <li key={index} className={styles.keyPoint}>
                      <div className={styles.keyPointText}>{point}</div>
                      <button
                        className={styles.copyItemButton}
                        onClick={() => handleCopyToClipboard(point)}
                        title="Copy this key point"
                      >
                        <FaClipboard />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.noContentMessage}>No key points identified in this transcript.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'actionItems' && (
          <div className={styles.transcriptSection}>
            {showActionManager ? (
              <ActionItemManager
                transcript={transcript}
                onUpdate={handleTranscriptUpdate}
              />
            ) : (
              <>
                <div className={styles.sectionHeader}>
                  <h4>Action Items</h4>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.manageButton}
                      onClick={() => setShowActionManager(true)}
                      title="Manage action items"
                    >
                      Manage Action Items
                    </button>
                    <button
                      className={styles.copyButton}
                      onClick={() => handleCopyToClipboard(transcript.actionItems.map(item => item.description).join('\n• '))}
                      title="Copy action items"
                    >
                      <FaClipboard /> Copy All
                    </button>
                  </div>
                </div>
                <div className={styles.actionItemsContainer}>
                  {transcript.actionItems && transcript.actionItems.length > 0 ? (
                    <ul className={styles.actionItemsList}>
                      {transcript.actionItems.map((item, index) => (
                        <li key={index} className={`${styles.actionItem} ${item.status === 'completed' ? styles.completedItem : ''}`}>
                          <div className={styles.actionItemContent}>
                            <div className={styles.actionItemText}>{item.description}</div>
                            {item.assignee && (
                              <div className={styles.actionItemAssignee}>
                                Assigned to: {item.assignee}
                              </div>
                            )}
                            {item.dueDate && (
                              <div className={styles.actionItemDueDate}>
                                Due: {new Date(item.dueDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          <div className={styles.actionItemActions}>
                            <button
                              className={styles.copyItemButton}
                              onClick={() => handleCopyToClipboard(item.description)}
                              title="Copy this action item"
                            >
                              <FaClipboard />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.noContentMessage}>No action items identified in this transcript.</p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {transcript.transcriptUrl && (
        <div className={styles.transcriptFooter}>
          <a
            href={transcript.transcriptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.viewOriginalLink}
          >
            View Original Document
          </a>
        </div>
      )}
    </div>
  );
};

export default MeetingTranscriptViewer;
