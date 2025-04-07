import React from 'react';
import styles from './Form.module.css';

/**
 * FormButton component for form actions
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {string} props.variant - Button variant (primary, secondary, danger)
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {Function} props.onClick - Function called when button is clicked
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string} props.className - Additional CSS class names
 */
const FormButton = ({
  children,
  type = 'button',
  variant = 'primary',
  disabled = false,
  onClick,
  icon,
  className = '',
  ...rest
}) => {
  // Determine button classes based on props
  const buttonClasses = [
    styles.formButton,
    variant === 'primary' ? styles.formButtonPrimary : '',
    variant === 'secondary' ? styles.formButtonSecondary : '',
    variant === 'danger' ? styles.formButtonDanger : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={buttonClasses}
      {...rest}
    >
      {icon && <span className={styles.formButtonIcon}>{icon}</span>}
      {children}
    </button>
  );
};

export default FormButton;
