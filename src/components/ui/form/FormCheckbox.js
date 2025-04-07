import React from 'react';
import styles from './Form.module.css';

/**
 * FormCheckbox component for checkbox inputs
 * 
 * @param {Object} props
 * @param {string} props.id - Checkbox ID
 * @param {string} props.name - Checkbox name
 * @param {string} props.label - Checkbox label
 * @param {boolean} props.checked - Whether the checkbox is checked
 * @param {Function} props.onChange - Function called when checkbox changes
 * @param {boolean} props.disabled - Whether the checkbox is disabled
 * @param {string} props.error - Error message
 * @param {string} props.helpText - Help text
 * @param {string} props.className - Additional CSS class names
 */
const FormCheckbox = ({
  id,
  name,
  label,
  checked,
  onChange,
  disabled = false,
  error,
  helpText,
  className = '',
  ...rest
}) => {
  return (
    <div className={styles.formGroup}>
      <div className={styles.formCheck}>
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`${styles.formCheckInput} ${className}`}
          {...rest}
        />
        
        {label && (
          <label htmlFor={id} className={styles.formCheckLabel}>
            {label}
          </label>
        )}
      </div>
      
      {helpText && !error && (
        <div className={styles.formHelpText}>{helpText}</div>
      )}
      
      {error && (
        <div className={styles.formError}>{error}</div>
      )}
    </div>
  );
};

export default FormCheckbox;
