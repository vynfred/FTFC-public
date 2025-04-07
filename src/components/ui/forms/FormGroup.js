import React from 'react';
import styles from '../../forms/Form.module.css';

/**
 * FormGroup component for grouping form elements
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Form elements
 * @param {string} props.label - Group label
 * @param {string} props.hint - Hint text displayed below the label
 * @param {boolean} props.required - Whether the group is required
 * @param {string} props.error - Error message
 * @param {string} props.className - Additional CSS class names
 */
const FormGroup = ({
  children,
  label,
  hint,
  required = false,
  error,
  className = '',
  ...rest
}) => {
  // Determine the group class based on validation state
  const groupClass = [
    styles.group,
    error ? styles.error : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClass} {...rest}>
      {label && (
        <label className={`${styles.label} ${required ? styles.required : ''}`}>
          {label}
        </label>
      )}
      
      {hint && !error && (
        <div className={styles.hint}>{hint}</div>
      )}
      
      {children}
      
      {error && (
        <div className={styles.errorMessage}>{error}</div>
      )}
    </div>
  );
};

export default FormGroup;
