import React from 'react';
import PropTypes from 'prop-types';
import { useModal } from '../../context/ModalContext';
import styles from './ActionButton.module.css';

/**
 * ActionButton Component
 * 
 * A reusable button component that triggers modal actions based on the action prop.
 * This component is used across all detail pages to ensure consistent button behavior.
 */
const ActionButton = ({
  action,
  entityType,
  entityId,
  entityName,
  entityEmail,
  meetingData,
  className,
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  ...props
}) => {
  const { openModal } = useModal();

  const handleClick = () => {
    switch (action) {
      case 'scheduleMeeting':
        openModal('scheduleMeeting', {
          entityType,
          entityId,
          entityName,
          email: entityEmail
        });
        break;
      case 'uploadDocument':
        openModal('uploadDocument', {
          entityType,
          entityId
        });
        break;
      case 'createLead':
        openModal('createLead', {
          entityType,
          entityId,
          entityName,
          meetingData
        });
        break;
      case 'addAttendee':
        openModal('addAttendee', {
          meetingId: entityId
        });
        break;
      case 'addMilestone':
        openModal('addMilestone', {
          entityType,
          entityId
        });
        break;
      case 'addNote':
        openModal('addNote', {
          entityType,
          entityId,
          entityName
        });
        break;
      case 'addActivity':
        openModal('addActivity', {
          entityType,
          entityId
        });
        break;
      case 'convertToClient':
        openModal('convertToClient', {
          leadId: entityId,
          leadName: entityName
        });
        break;
      default:
        console.warn(`Action "${action}" not implemented`);
    }
  };

  const buttonClasses = [
    styles.button,
    styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    styles[`size${size.toUpperCase()}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={buttonClasses}
      onClick={handleClick}
      type="button"
      {...props}
    >
      {Icon && <Icon className={styles.icon} />}
      <span>{children}</span>
    </button>
  );
};

ActionButton.propTypes = {
  action: PropTypes.string.isRequired,
  entityType: PropTypes.string,
  entityId: PropTypes.string,
  entityName: PropTypes.string,
  entityEmail: PropTypes.string,
  meetingData: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'text']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  icon: PropTypes.elementType
};

export default ActionButton;
