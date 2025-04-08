import React, { useState, useRef } from 'react';
import { FaImage, FaUpload, FaTimes } from 'react-icons/fa';

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
      
      <style jsx>{`
        .image-upload {
          width: 100%;
        }
        
        .field-label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: #94a3b8;
        }
        
        .required-mark {
          color: #ef4444;
          margin-left: 4px;
        }
        
        .upload-container {
          width: 100%;
          position: relative;
        }
        
        .file-input {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }
        
        .upload-placeholder {
          display: flex;
          align-items: center;
          padding: 16px;
          background-color: rgba(255, 255, 255, 0.05);
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .upload-placeholder:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: rgba(245, 158, 11, 0.5);
        }
        
        .placeholder-icon {
          font-size: 24px;
          color: #94a3b8;
          margin-right: 16px;
        }
        
        .placeholder-text {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .upload-text {
          font-size: 14px;
          font-weight: 500;
          color: #ffffff;
        }
        
        .upload-hint {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 4px;
        }
        
        .upload-icon {
          font-size: 16px;
          color: #f59e0b;
        }
        
        .image-preview-container {
          position: relative;
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .image-preview {
          width: 100%;
          height: auto;
          display: block;
        }
        
        .remove-button {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.5);
          color: #ffffff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .remove-button:hover {
          background-color: rgba(239, 68, 68, 0.8);
        }
      `}</style>
    </div>
  );
};

export default ImageUpload;
