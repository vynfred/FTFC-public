import React from 'react';
import styles from '../../forms/Form.module.css';

/**
 * FormSelect component for dropdown selects
 * 
 * @param {Object} props
 * @param {string} props.id - Select ID
 * @param {string} props.name - Select name
 * @param {string} props.label - Select label
 * @param {string} props.value - Selected value
 * @param {Function} props.onChange - Change handler
 * @param {Array} props.options - Array of options [{value, label}]
 * @param {boolean} props.required - Whether the select is required
 * @param {string} props.hint - Hint text displayed below the select
 * @param {string} props.error - Error message
 * @param {boolean} props.success - Whether the select is in a success state
 * @param {boolean} props.disabled - Whether the select is disabled
 * @param {string} props.className - Additional CSS class names
 */
const FormSelect = ({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  required = false,
  hint,
  error,
  success = false,
  disabled = false,
  className = '',
  ...rest
}) => {
  // Determine the group class based on validation state
  const groupClass = [
    styles.group,
    error ? styles.error : '',
    success ? styles.success : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClass}>
      {label && (
        <label 
          htmlFor={id} 
          className={`${styles.label} ${required ? styles.required : ''}`}
        >
          {label}
        </label>
      )}
      
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={styles.select}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {hint && !error && (
        <div className={styles.hint}>{hint}</div>
      )}
      
      {error && (
        <div className={styles.errorMessage}>{error}</div>
      )}
    </div>
  );
};

export default FormSelect;
