import React, { useState } from 'react';
import { FaCloudUploadAlt, FaFileAlt } from 'react-icons/fa';
import { useModal } from '../../context/ModalContext';
import Modal from '../ui/feedback/Modal';
import styles from './Modals.module.css';

/**
 * Upload Document Modal
 * 
 * This modal allows users to upload documents for a client, investor, partner, or lead.
 */
const UploadDocumentModal = () => {
  const { modals, closeModal } = useModal();
  const { isOpen, data } = modals.uploadDocument;
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = React.useRef(null);

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setFiles([]);
      setSuccess(false);
      setError(null);
    }
  }, [isOpen]);

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
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      id: `file-${Date.now()}-${file.name}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (id) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError('Please select at least one file to upload.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would upload the files to a server
      console.log('Uploading files:', {
        files,
        entityType: data?.entityType,
        entityId: data?.entityId
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      
      // Close modal after a delay
      setTimeout(() => {
        closeModal('uploadDocument');
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Error uploading files:', err);
      setError('Failed to upload files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => closeModal('uploadDocument')}
      title={
        <div className={styles.modalTitleWithIcon}>
          <FaCloudUploadAlt className={styles.modalTitleIcon} />
          Upload Document
        </div>
      }
      size="md"
    >
      {success ? (
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <h3>Documents Uploaded Successfully!</h3>
          <p>{files.length} file(s) have been uploaded.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <div
            className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <FaCloudUploadAlt className={styles.dropZoneIcon} />
            <p className={styles.dropZoneText}>
              Drag and drop files here, or click to browse
            </p>
            <p className={styles.dropZoneHint}>
              Supported formats: PDF, Word, Excel, Images, etc.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className={styles.fileInput}
              onChange={handleFileSelect}
              multiple
            />
          </div>
          
          {files.length > 0 && (
            <div className={styles.fileList}>
              <h4 className={styles.fileListTitle}>Selected Files</h4>
              {files.map(file => (
                <div key={file.id} className={styles.fileItem}>
                  <div className={styles.fileInfo}>
                    <FaFileAlt className={styles.fileIcon} />
                    <div className={styles.fileDetails}>
                      <p className={styles.fileName}>{file.name}</p>
                      <p className={styles.fileSize}>{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.removeFileButton}
                    onClick={() => handleRemoveFile(file.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => closeModal('uploadDocument')}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading || files.length === 0}
            >
              {isLoading ? 'Uploading...' : 'Upload Files'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default UploadDocumentModal;
