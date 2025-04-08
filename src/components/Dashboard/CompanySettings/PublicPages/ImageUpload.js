import React, { useRef, useState } from 'react';
import { FaImage, FaTimes, FaUpload } from 'react-icons/fa';
import './ImageUpload.css';

/**
 * ImageUpload component for image uploads in the public pages editor
 */
const ImageUpload = ({ name, label, value, onChange, required = false }) => {
  const [preview, setPreview] = useState(value || '');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Call the onChange handler with the file
    if (onChange) {
      onChange({
        target: {
          name,
          value: file,
          type: 'file'
        }
      });
    }
  };

  const handleRemoveImage = () => {
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Call the onChange handler with null
    if (onChange) {
      onChange({
        target: {
          name,
          value: null,
          type: 'file'
        }
      });
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="image-upload">
      <label className="field-label">
        {label}
        {required && <span className="required-mark">*</span>}
      </label>

      <div className="upload-container">
        <input
          type="file"
          ref={fileInputRef}
          id={name}
          name={name}
          onChange={handleFileChange}
          accept="image/*"
          className="file-input"
          required={required && !preview}
        />

        {preview ? (
          <div className="image-preview-container">
            <img src={preview} alt={label} className="image-preview" />
            <button
              type="button"
              className="remove-button"
              onClick={handleRemoveImage}
              aria-label="Remove image"
            >
              <FaTimes />
            </button>
          </div>
        ) : (
          <div className="upload-placeholder" onClick={handleClick}>
            <FaImage className="placeholder-icon" />
            <div className="placeholder-text">
              <span className="upload-text">Click to upload image</span>
              <span className="upload-hint">PNG, JPG, GIF up to 5MB</span>
            </div>
            <FaUpload className="upload-icon" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
