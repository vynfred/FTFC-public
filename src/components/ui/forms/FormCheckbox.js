import React from 'react';
import styles from '../../forms/Form.module.css';

/**
 * FormCheckbox component for checkbox inputs
 * 
 * @param {Object} props
 * @param {string} props.id - Checkbox ID
 * @param {string} props.name - Checkbox name
 * @param {string} props.label - Checkbox label
 * @param {boolean} props.checked - Whether the checkbox is checked
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.required - Whether the checkbox is required
 * @param {string} props.hint - Hint text displayed below the checkbox
 * @param {string} props.error - Error message
 * @param {boolean} props.disabled - Whether the checkbox is disabled
 * @param {string} props.className - Additional CSS class names
 */
const FormCheckbox = ({
  id,
  name,
  label,
  checked,
  onChange,
  required = false,
  hint,
  error,
  disabled = false,
  className = '',
  ...rest
}) => {
  // Determine the group class based on validation state
  const groupClass = [
    styles.checkboxGroup,
    error ? styles.error : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClass}>
      <label className={styles.checkboxLabel}>
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={styles.checkbox}
          {...rest}
        />
        <span>{label}{required && <span className={styles.required}></span>}</span>
      </label>
      
      {hint && !error && (
        <div className={styles.hint}>{hint}</div>
      )}
      
      {error && (
        <div className={styles.errorMessage}>{error}</div>
      )}
    </div>
  );
};

export default FormCheckbox;
