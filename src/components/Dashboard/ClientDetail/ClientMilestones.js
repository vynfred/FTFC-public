import React from 'react';
import { FaPlus } from 'react-icons/fa';
import MilestoneListInteractive from '../../common/MilestoneListInteractive';
import MilestoneModal from '../../common/MilestoneModal';
import styles from '../DetailPages.module.css';

/**
 * Client milestones component for managing client milestones
 */
const ClientMilestones = ({
  milestones,
  milestonesLoading,
  showMilestoneModal,
  currentMilestone,
  isSubmittingMilestone,
  milestoneError,
  onAddMilestone,
  onEditMilestone,
  onDeleteMilestone,
  onStatusChange,
  onCloseMilestoneModal,
  onSubmitMilestone
}) => {
  return (
    <div className={styles.milestonesTab}>
      <div className={styles.tabActions}>
        <button className={styles.addButton} onClick={onAddMilestone}>
          <FaPlus /> Add Milestone
        </button>
      </div>

      {milestonesLoading ? (
        <div className={styles.loading}>Loading milestones...</div>
      ) : (
        <MilestoneListInteractive
          milestones={milestones}
          onEdit={onEditMilestone}
          onDelete={onDeleteMilestone}
          onStatusChange={onStatusChange}
          isEditable={true}
          isLoading={milestonesLoading}
        />
      )}

      {/* Milestone Modal */}
      <MilestoneModal
        isOpen={showMilestoneModal}
        onClose={onCloseMilestoneModal}
        milestone={currentMilestone}
        onSubmit={onSubmitMilestone}
        isSubmitting={isSubmittingMilestone}
        error={milestoneError}
      />
    </div>
  );
};

export default ClientMilestones;
