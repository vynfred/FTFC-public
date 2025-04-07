import React, { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaFile, FaFileAlt, FaFilePdf, FaFileImage, FaFileWord, FaFileExcel, FaDownload, FaTrashAlt, FaFolder } from 'react-icons/fa';
import styles from './DocumentUpload.module.css';

/**
 * Document upload component with drag and drop support
 * 
 * @param {Object} props
 * @param {Array} props.documents - List of existing documents
 * @param {Function} props.onUpload - Function called when files are uploaded
 * @param {Function} props.onDelete - Function called when a document is deleted
 * @param {Function} props.onDownload - Function called when a document is downloaded
 * @param {boolean} props.isLoading - Whether the component is in a loading state
 */
const DocumentUpload = ({ 
  documents = [], 
  onUpload, 
  onDelete, 
  onDownload,
  isLoading = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState([]);
  const fileInputRef = useRef(null);

  // Handle drag events
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

  // Handle file selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Process the selected files
  const handleFiles = (files) => {
    const newUploads = Array.from(files).map(file => ({
      id: `upload-${Date.now()}-${file.name}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'uploading'
    }));

    setUploading([...uploading, ...newUploads]);

    // Simulate upload progress
    newUploads.forEach(upload => {
      simulateUpload(upload);
    });
  };

  // Simulate file upload with progress
  const simulateUpload = (upload) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      
      setUploading(current => 
        current.map(item => 
          item.id === upload.id 
            ? { ...item, progress } 
            : item
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
        
        // Complete the upload
        setTimeout(() => {
          setUploading(current => 
            current.filter(item => item.id !== upload.id)
          );
          
          if (onUpload) {
            onUpload({
              id: upload.id,
              name: upload.name,
              size: upload.size,
              type: upload.type,
              uploadedAt: new Date().toISOString()
            });
          }
        }, 500);
      }
    }, 300);
  };

  // Cancel an upload
  const cancelUpload = (uploadId) => {
    setUploading(current => 
      current.filter(item => item.id !== uploadId)
    );
  };

  // Get appropriate icon based on file type
  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return <FaFilePdf />;
    if (fileType.includes('image')) return <FaFileImage />;
    if (fileType.includes('word') || fileType.includes('document')) return <FaFileWord />;
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return <FaFileExcel />;
    return <FaFileAlt />;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className={styles.container}>
      {/* Upload area */}
      <div 
        className={`${styles.uploadArea} ${isDragging ? styles.dragActive : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <FaCloudUploadAlt className={styles.uploadIcon} />
        <p className={styles.uploadText}>
          Drag and drop files here, or click to browse
        </p>
        <p className={styles.uploadHint}>
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

      {/* Files being uploaded */}
      {uploading.length > 0 && (
        <div className={styles.documentList}>
          {uploading.map(file => (
            <div key={file.id} className={styles.documentItem}>
              <div className={styles.documentIcon}>
                {getFileIcon(file.type)}
              </div>
              <div className={styles.documentInfo}>
                <div className={styles.documentName}>{file.name}</div>
                <div className={styles.documentMeta}>
                  <span className={styles.documentSize}>{formatFileSize(file.size)}</span>
                </div>
                <div className={styles.uploadProgress}>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill} 
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                  <div className={styles.progressInfo}>
                    <span>{file.progress}% uploaded</span>
                    <span 
                      className={styles.cancelUpload}
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelUpload(file.id);
                      }}
                    >
                      Cancel
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Existing documents */}
      {documents.length > 0 ? (
        <div className={styles.documentList}>
          {documents.map(doc => (
            <div key={doc.id} className={styles.documentItem}>
              <div className={styles.documentIcon}>
                {getFileIcon(doc.type)}
              </div>
              <div className={styles.documentInfo}>
                <div className={styles.documentName}>{doc.name}</div>
                <div className={styles.documentMeta}>
                  <span className={styles.documentSize}>{formatFileSize(doc.size)}</span>
                  <span className={styles.documentDate}>
                    Uploaded {formatDate(doc.uploadedAt)}
                  </span>
                </div>
              </div>
              <div className={styles.documentActions}>
                <div 
                  className={`${styles.documentAction} ${styles.downloadAction}`}
                  onClick={() => onDownload && onDownload(doc)}
                  title="Download"
                >
                  <FaDownload />
                </div>
                <div 
                  className={`${styles.documentAction} ${styles.deleteAction}`}
                  onClick={() => onDelete && onDelete(doc.id)}
                  title="Delete"
                >
                  <FaTrashAlt />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isLoading ? (
        <div className={styles.emptyState}>
          <p>Loading documents...</p>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <FaFolder className={styles.emptyIcon} />
          <p className={styles.emptyText}>No documents uploaded yet</p>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
