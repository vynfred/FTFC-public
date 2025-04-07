import React from 'react';
import styles from './Form.module.css';

/**
 * FormSelect component for dropdown selects
 * 
 * @param {Object} props
 * @param {string} props.id - Select ID
 * @param {string} props.name - Select name
 * @param {string} props.label - Select label
 * @param {string} props.value - Select value
 * @param {Function} props.onChange - Function called when select changes
 * @param {Array} props.options - Array of options [{value, label}]
 * @param {boolean} props.required - Whether the select is required
 * @param {boolean} props.disabled - Whether the select is disabled
 * @param {string} props.error - Error message
 * @param {string} props.helpText - Help text
 * @param {string} props.size - Select size (sm, md, lg)
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
  disabled = false,
  error,
  helpText,
  size,
  className = '',
  ...rest
}) => {
  // Determine select classes based on props
  const selectClasses = [
    styles.formSelect,
    error ? styles.inputError : '',
    size === 'sm' ? styles.inputSm : '',
    size === 'lg' ? styles.inputLg : '',
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
      
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={selectClasses}
        {...rest}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {helpText && !error && (
        <div className={styles.formHelpText}>{helpText}</div>
      )}
      
      {error && (
        <div className={styles.formError}>{error}</div>
      )}
    </div>
  );
};

export default FormSelect;
