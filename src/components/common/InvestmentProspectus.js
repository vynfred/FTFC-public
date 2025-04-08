import React, { useState } from 'react';
import { FaEdit, FaSave, FaTimes, FaLightbulb } from 'react-icons/fa';
import styles from './InvestmentProspectus.module.css';

/**
 * InvestmentProspectus component for displaying investor's investment preferences and allowing notes
 * 
 * @param {Object} props
 * @param {Object} props.prospectus - Prospectus object with investment preferences
 * @param {Function} props.onSaveNotes - Function to call when notes are saved
 */
const InvestmentProspectus = ({ prospectus, onSaveNotes }) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(prospectus.notes || '');

  const handleSaveNotes = () => {
    if (onSaveNotes) {
      onSaveNotes(notes);
    }
    setIsEditingNotes(false);
  };

  const handleCancelEdit = () => {
    setNotes(prospectus.notes || '');
    setIsEditingNotes(false);
  };

  if (!prospectus) {
    return (
      <div className={styles.emptyState}>
        <FaLightbulb className={styles.emptyIcon} />
        <p>No investment prospectus available</p>
      </div>
    );
  }

  return (
    <div className={styles.prospectusSection}>
      <h3 className={styles.sectionTitle}>Investment Prospectus</h3>
      
      <div className={styles.prospectusContent}>
        <div className={styles.preferencesSection}>
          <h4 className={styles.subsectionTitle}>Investment Preferences</h4>
          
          <div className={styles.preferenceGrid}>
            <div className={styles.preferenceItem}>
              <span className={styles.preferenceLabel}>Investment Focus:</span>
              <span className={styles.preferenceValue}>
                {Array.isArray(prospectus.investmentFocus) 
                  ? prospectus.investmentFocus.join(', ') 
                  : prospectus.investmentFocus}
              </span>
            </div>
            
            <div className={styles.preferenceItem}>
              <span className={styles.preferenceLabel}>Investment Size:</span>
              <span className={styles.preferenceValue}>{prospectus.investmentSize}</span>
            </div>
            
            <div className={styles.preferenceItem}>
              <span className={styles.preferenceLabel}>Preferred Stages:</span>
              <span className={styles.preferenceValue}>
                {Array.isArray(prospectus.preferredStages) 
                  ? prospectus.preferredStages.join(', ') 
                  : prospectus.preferredStages}
              </span>
            </div>
            
            <div className={styles.preferenceItem}>
              <span className={styles.preferenceLabel}>Geographic Focus:</span>
              <span className={styles.preferenceValue}>{prospectus.geographicFocus || 'No preference'}</span>
            </div>
            
            <div className={styles.preferenceItem}>
              <span className={styles.preferenceLabel}>Expected Returns:</span>
              <span className={styles.preferenceValue}>{prospectus.expectedReturns}</span>
            </div>
            
            <div className={styles.preferenceItem}>
              <span className={styles.preferenceLabel}>Investment Horizon:</span>
              <span className={styles.preferenceValue}>{prospectus.investmentHorizon}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.notesSection}>
          <div className={styles.notesTitleRow}>
            <h4 className={styles.subsectionTitle}>Your Notes</h4>
            {!isEditingNotes && (
              <button 
                className={styles.editButton}
                onClick={() => setIsEditingNotes(true)}
              >
                <FaEdit /> Edit
              </button>
            )}
          </div>
          
          {isEditingNotes ? (
            <div className={styles.notesEditContainer}>
              <textarea
                className={styles.notesTextarea}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes about investment preferences, reminders, or specific interests..."
                rows={5}
              />
              <div className={styles.notesActions}>
                <button 
                  className={styles.cancelButton}
                  onClick={handleCancelEdit}
                >
                  <FaTimes /> Cancel
                </button>
                <button 
                  className={styles.saveButton}
                  onClick={handleSaveNotes}
                >
                  <FaSave /> Save
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.notesContent}>
              {notes ? (
                <p>{notes}</p>
              ) : (
                <p className={styles.emptyNotes}>
                  No notes added yet. Click Edit to add your notes.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentProspectus;
