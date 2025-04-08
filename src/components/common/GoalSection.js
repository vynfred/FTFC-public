import React from 'react';
import { FaBullseye, FaCheckCircle } from 'react-icons/fa';
import styles from './GoalSection.module.css';

/**
 * GoalSection component for displaying client goals
 * 
 * @param {Object} props
 * @param {Array} props.goals - Array of goal objects with title and description properties
 * @param {string} props.title - Section title (optional)
 */
const GoalSection = ({ goals, title = 'Goals' }) => {
  if (!goals || goals.length === 0) {
    return (
      <div className={styles.emptyState}>
        <FaBullseye className={styles.emptyIcon} />
        <p>No goals have been set yet</p>
      </div>
    );
  }

  return (
    <div className={styles.goalSection}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      
      <div className={styles.goalList}>
        {goals.map((goal, index) => (
          <div key={index} className={styles.goalItem}>
            <div className={styles.goalIcon}>
              <FaBullseye />
            </div>
            <div className={styles.goalContent}>
              <h4 className={styles.goalTitle}>{goal.title}</h4>
              {goal.description && (
                <p className={styles.goalDescription}>{goal.description}</p>
              )}
              {goal.targetDate && (
                <p className={styles.goalMeta}>
                  Target completion: {goal.targetDate}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalSection;
