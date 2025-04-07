import React from 'react';
import styles from './Form.module.css';

/**
 * FormInput component for text inputs
 * 
 * @param {Object} props
 * @param {string} props.id - Input ID
 * @param {string} props.name - Input name
 * @param {string} props.label - Input label
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Function called when input changes
 * @param {string} props.placeholder - Input placeholder
 * @param {boolean} props.required - Whether the input is required
 * @param {boolean} props.disabled - Whether the input is disabled
 * @param {string} props.error - Error message
 * @param {string} props.helpText - Help text
 * @param {React.ReactNode} props.leftIcon - Icon to display on the left
 * @param {React.ReactNode} props.rightIcon - Icon to display on the right
 * @param {string} props.size - Input size (sm, md, lg)
 * @param {string} props.className - Additional CSS class names
 */
const FormInput = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  helpText,
  leftIcon,
  rightIcon,
  size,
  className = '',
  ...rest
}) => {
  // Determine input classes based on props
  const inputClasses = [
    styles.formInput,
    error ? styles.inputError : '',
    leftIcon ? styles.inputWithIconLeft : '',
    rightIcon ? styles.inputWithIconRight : '',
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
      
      <div className={leftIcon || rightIcon ? styles.inputWithIcon : ''}>
        {leftIcon && (
          <span className={`${styles.inputIcon} ${styles.iconLeft}`}>
            {leftIcon}
          </span>
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
          className={inputClasses}
          {...rest}
        />
        
        {rightIcon && (
          <span className={`${styles.inputIcon} ${styles.iconRight}`}>
            {rightIcon}
          </span>
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

export default FormInput;
