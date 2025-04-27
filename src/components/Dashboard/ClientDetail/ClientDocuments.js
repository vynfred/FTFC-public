import React from 'react';
import styles from '../DetailPages.module.css';

/**
 * Client documents component for displaying and managing client documents
 */
const ClientDocuments = ({ documents, onUploadDocument }) => {
  return (
    <div className={styles.documentsTab}>
      <div className={styles.tabActions}>
        <button className={styles.addButton} onClick={onUploadDocument}>
          Upload Document
        </button>
      </div>
      <div className={styles.documentsTable}>
        <div className={styles.tableHeader}>
          <div className={styles.tableCell}>Name</div>
          <div className={styles.tableCell}>Type</div>
          <div className={styles.tableCell}>Size</div>
          <div className={styles.tableCell}>Uploaded</div>
          <div className={styles.tableCell}>Actions</div>
        </div>
        {documents.length === 0 ? (
          <div className={styles.emptyState}>No documents available</div>
        ) : (
          documents.map(doc => (
            <div key={doc.id} className={styles.tableRow}>
              <div className={styles.tableCell}>{doc.name}</div>
              <div className={styles.tableCell}>{doc.type}</div>
              <div className={styles.tableCell}>{doc.size}</div>
              <div className={styles.tableCell}>
                {new Date(doc.uploadDate).toLocaleDateString()} by {doc.uploadedBy}
              </div>
              <div className={styles.tableCell}>
                <button className={styles.iconButton}>View</button>
                <button className={styles.iconButton}>Download</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientDocuments;
