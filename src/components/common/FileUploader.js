import React, { useState } from 'react';
import { FaCloudUploadAlt, FaFileAlt, FaTrash } from 'react-icons/fa';

const FileUploader = ({ onFileUpload, acceptedFileTypes = '.csv,.xlsx,.xls' }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const uploadedFile = e.dataTransfer.files[0];
      setFile(uploadedFile);
      onFileUpload(uploadedFile);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);
      onFileUpload(uploadedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    onFileUpload(null);
  };

  return (
    <div className="file-uploader">
      {!file ? (
        <div 
          className={`upload-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FaCloudUploadAlt className="upload-icon" />
          <p className="upload-text">Drag & drop a file here, or click to select</p>
          <p className="upload-hint">Accepted file types: {acceptedFileTypes}</p>
          <input 
            type="file" 
            className="file-input" 
            onChange={handleFileChange}
            accept={acceptedFileTypes}
          />
        </div>
      ) : (
        <div className="file-preview">
          <div className="file-info">
            <FaFileAlt className="file-icon" />
            <div className="file-details">
              <p className="file-name">{file.name}</p>
              <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
          <button className="remove-file" onClick={handleRemoveFile}>
            <FaTrash />
          </button>
        </div>
      )}
      
      <style jsx>{`
        .file-uploader {
          width: 100%;
          margin-bottom: 20px;
        }
        
        .upload-area {
          border: 2px dashed #94a3b8;
          border-radius: 8px;
          padding: 30px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        .upload-area:hover, .upload-area.dragging {
          border-color: #f59e0b;
          background-color: rgba(245, 158, 11, 0.05);
        }
        
        .upload-icon {
          font-size: 48px;
          color: #94a3b8;
          margin-bottom: 16px;
        }
        
        .upload-text {
          font-size: 16px;
          color: #ffffff;
          margin-bottom: 8px;
        }
        
        .upload-hint {
          font-size: 14px;
          color: #94a3b8;
        }
        
        .file-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        
        .file-preview {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 16px;
        }
        
        .file-info {
          display: flex;
          align-items: center;
        }
        
        .file-icon {
          font-size: 24px;
          color: #f59e0b;
          margin-right: 16px;
        }
        
        .file-details {
          display: flex;
          flex-direction: column;
        }
        
        .file-name {
          font-size: 16px;
          color: #ffffff;
          margin: 0;
        }
        
        .file-size {
          font-size: 14px;
          color: #94a3b8;
          margin: 4px 0 0 0;
        }
        
        .remove-file {
          background: none;
          border: none;
          color: #ef4444;
          cursor: pointer;
          font-size: 18px;
          padding: 8px;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }
        
        .remove-file:hover {
          background-color: rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </div>
  );
};

export default FileUploader;
