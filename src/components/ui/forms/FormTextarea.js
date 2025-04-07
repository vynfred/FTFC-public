import React from 'react';
import styles from '../../forms/Form.module.css';

/**
 * FormTextarea component for multiline text input
 * 
 * @param {Object} props
 * @param {string} props.id - Textarea ID
 * @param {string} props.name - Textarea name
 * @param {string} props.label - Textarea label
 * @param {string} props.value - Textarea value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Textarea placeholder
 * @param {boolean} props.required - Whether the textarea is required
 * @param {string} props.hint - Hint text displayed below the textarea
 * @param {string} props.error - Error message
 * @param {boolean} props.success - Whether the textarea is in a success state
 * @param {boolean} props.disabled - Whether the textarea is disabled
 * @param {number} props.rows - Number of rows to display
 * @param {string} props.className - Additional CSS class names
 */
const FormTextarea = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  hint,
  error,
  success = false,
  disabled = false,
  rows = 4,
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
      
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={styles.textarea}
        {...rest}
      />
      
      {hint && !error && (
        <div className={styles.hint}>{hint}</div>
      )}
      
      {error && (
        <div className={styles.errorMessage}>{error}</div>
      )}
    </div>
  );
};

export default FormTextarea;
