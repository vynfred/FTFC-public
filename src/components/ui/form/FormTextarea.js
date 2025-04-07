import React from 'react';
import styles from './Form.module.css';

/**
 * FormTextarea component for multiline text inputs
 * 
 * @param {Object} props
 * @param {string} props.id - Textarea ID
 * @param {string} props.name - Textarea name
 * @param {string} props.label - Textarea label
 * @param {string} props.value - Textarea value
 * @param {Function} props.onChange - Function called when textarea changes
 * @param {string} props.placeholder - Textarea placeholder
 * @param {boolean} props.required - Whether the textarea is required
 * @param {boolean} props.disabled - Whether the textarea is disabled
 * @param {string} props.error - Error message
 * @param {string} props.helpText - Help text
 * @param {number} props.rows - Number of rows
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
  disabled = false,
  error,
  helpText,
  rows = 4,
  className = '',
  ...rest
}) => {
  // Determine textarea classes based on props
  const textareaClasses = [
    styles.formTextarea,
    error ? styles.inputError : '',
    className
  ].filter(Boolean).join(' ');

  // Determine label classes based on props
  const labelClasses = [
    styles.formLabel,
    required ? styles.required : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.formGroup}>
      {label && (
        <label htmlFor={id} className={labelClasses}>
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
        className={textareaClasses}
        {...rest}
      />
      
      {helpText && !error && (
        <div className={styles.formHelpText}>{helpText}</div>
      )}
      
      {error && (
        <div className={styles.formError}>{error}</div>
      )}
    </div>
  );
};

export default FormTextarea;
