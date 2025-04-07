import React from 'react';
import styles from '../../forms/Form.module.css';

/**
 * FormRadio component for radio button inputs
 * 
 * @param {Object} props
 * @param {string} props.id - Radio group ID
 * @param {string} props.name - Radio group name
 * @param {string} props.label - Radio group label
 * @param {string} props.value - Selected value
 * @param {Function} props.onChange - Change handler
 * @param {Array} props.options - Array of options [{value, label}]
 * @param {boolean} props.required - Whether the radio group is required
 * @param {string} props.hint - Hint text displayed below the radio group
 * @param {string} props.error - Error message
 * @param {boolean} props.disabled - Whether the radio group is disabled
 * @param {string} props.className - Additional CSS class names
 */
const FormRadio = ({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  required = false,
  hint,
  error,
  disabled = false,
  className = '',
  ...rest
}) => {
  // Determine the group class based on validation state
  const groupClass = [
    styles.radioGroup,
    error ? styles.error : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClass}>
      {label && (
        <label className={`${styles.label} ${required ? styles.required : ''}`}>
          {label}
        </label>
      )}
      
      <div className={styles.radioOptions}>
        {options.map((option) => (
          <label key={option.value} className={styles.radioLabel}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              disabled={disabled}
              className={styles.radio}
              {...rest}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      
      {hint && !error && (
        <div className={styles.hint}>{hint}</div>
      )}
      
      {error && (
        <div className={styles.errorMessage}>{error}</div>
      )}
    </div>
  );
};

export default FormRadio;
