import React from 'react';
import './TextField.css';

/**
 * TextField component for text input in the public pages editor
 */
const TextField = ({ name, label, value, onChange, multiline = false, placeholder = '', required = false }) => {
  return (
    <div className="text-field">
      <label htmlFor={name} className="field-label">
        {label}
        {required && <span className="required-mark">*</span>}
      </label>

      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          className="text-input multiline"
          required={required}
        />
      ) : (
        <input
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="text-input"
          required={required}
        />
      )}
    </div>
  );
};

export default TextField;
