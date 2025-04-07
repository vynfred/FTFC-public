import React from 'react';
import styles from './Form.module.css';

/**
 * FormInput component for text inputs, numbers, emails, etc.
 * 
 * @param {Object} props
 * @param {string} props.id - Input ID
 * @param {string} props.name - Input name
 * @param {string} props.type - Input type (text, email, password, number, etc.)
 * @param {string} props.label - Input label
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Input placeholder
 * @param {boolean} props.required - Whether the input is required
 * @param {string} props.hint - Hint text displayed below the input
 * @param {string} props.error - Error message
 * @param {boolean} props.success - Whether the input is in a success state
 * @param {boolean} props.disabled - Whether the input is disabled
 * @param {string} props.className - Additional CSS class names
 */
const FormInput = ({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
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
      
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={styles.input}
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

export default FormInput;
