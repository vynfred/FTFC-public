import React from 'react';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import styles from './MilestoneList.module.css';

/**
 * MilestoneList component for displaying a list of milestones with completion status
 *
 * @param {Object} props
 * @param {Array} props.milestones - Array of milestone objects with title and completed properties
 */
const MilestoneList = ({ milestones }) => {
  if (!milestones || milestones.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No milestones available</p>
      </div>
    );
  }

  return (
    <div className={styles.milestoneList}>
      {milestones.map((milestone, index) => (
        <div key={index} className={styles.milestoneItem}>
          <div className={styles.milestoneStatus}>
            {milestone.completed ? (
              <FaCheckCircle className={styles.completedIcon} />
            ) : (
              <FaRegCircle className={styles.pendingIcon} />
            )}
          </div>
          <div className={styles.milestoneContent}>
            <h4 className={styles.milestoneTitle}>{milestone.title}</h4>
            {milestone.description && (
              <p className={styles.milestoneDescription}>{milestone.description}</p>
            )}
            {milestone.date && (
              <p className={styles.milestoneDate}>{milestone.date}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MilestoneList;
