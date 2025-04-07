import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import styles from './Modal.module.css';

/**
 * Modal component for displaying dialogs
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function called when the modal is closed
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.footer - Modal footer content
 * @param {string} props.size - Modal size (sm, md, lg, xl, full)
 * @param {boolean} props.closeOnOverlayClick - Whether to close the modal when the overlay is clicked
 * @param {boolean} props.closeOnEsc - Whether to close the modal when the Escape key is pressed
 * @param {string} props.className - Additional CSS class names
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className = '',
  ...rest
}) => {
  const modalRef = useRef(null);
  
  // Handle Escape key press
  useEffect(() => {
    const handleEscKey = (e) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = ''; // Restore scrolling when modal is closed
    };
  }, [isOpen, onClose, closeOnEsc]);
  
  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Don't render anything if the modal is not open
  if (!isOpen) return null;
  
  // Create a portal to render the modal at the end of the document body
  return createPortal(
    <div
      className={`${styles.modalOverlay} ${isOpen ? styles.open : ''}`}
      onClick={handleOverlayClick}
      {...rest}
    >
      <div
        className={`${styles.modalContainer} ${styles[size]} ${className}`}
        ref={modalRef}
      >
        {title && (
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>{title}</h2>
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close"
            >
              <FaTimes />
            </button>
          </div>
        )}
        
        <div className={styles.modalBody}>
          {children}
        </div>
        
        {footer && (
          <div className={styles.modalFooter}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

/**
 * Modal.Button component for modal actions
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button variant (primary, secondary, danger)
 * @param {Function} props.onClick - Function called when the button is clicked
 * @param {string} props.className - Additional CSS class names
 */
Modal.Button = ({
  children,
  variant = 'secondary',
  onClick,
  className = '',
  ...rest
}) => {
  // Determine button classes based on variant
  const buttonClasses = [
    styles.modalButton,
    variant === 'primary' ? styles.primaryButton : '',
    variant === 'secondary' ? styles.secondaryButton : '',
    variant === 'danger' ? styles.dangerButton : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Modal;
