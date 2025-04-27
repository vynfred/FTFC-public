import React from 'react';
import styles from '../DetailPages.module.css';

/**
 * Client overview component showing client information
 */
const ClientOverview = ({ client, isEditing, editedClient, onInputChange }) => {
  if (isEditing) {
    return (
      <div className={styles.editForm}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="contactName">Contact Name</label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={editedClient.contactName}
              onChange={onInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={editedClient.email}
              onChange={onInputChange}
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={editedClient.phone}
              onChange={onInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="website">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={editedClient.website}
              onChange={onInputChange}
            />
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={editedClient.address}
            onChange={onInputChange}
          />
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="industry">Industry</label>
            <input
              type="text"
              id="industry"
              name="industry"
              value={editedClient.industry}
              onChange={onInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="size">Company Size</label>
            <input
              type="text"
              id="size"
              name="size"
              value={editedClient.size}
              onChange={onInputChange}
            />
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={editedClient.notes}
            onChange={onInputChange}
            rows="4"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="goals">Goals</label>
          <textarea
            id="goals"
            name="goals"
            value={editedClient.goals}
            onChange={onInputChange}
            rows="3"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.clientInfo}>
      <div className={styles.infoSection}>
        <h3>Contact Information</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Contact Name:</span>
            <span className={styles.infoValue}>{client.contactName}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Email:</span>
            <span className={styles.infoValue}>{client.email}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Phone:</span>
            <span className={styles.infoValue}>{client.phone}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Website:</span>
            <span className={styles.infoValue}>
              <a href={client.website} target="_blank" rel="noopener noreferrer">
                {client.website}
              </a>
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Address:</span>
            <span className={styles.infoValue}>{client.address}</span>
          </div>
        </div>
      </div>

      <div className={styles.infoSection}>
        <h3>Company Information</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Industry:</span>
            <span className={styles.infoValue}>{client.industry}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Size:</span>
            <span className={styles.infoValue}>{client.size}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Revenue:</span>
            <span className={styles.infoValue}>{client.revenue}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Client Since:</span>
            <span className={styles.infoValue}>{new Date(client.createdDate).toLocaleDateString()}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Last Contact:</span>
            <span className={styles.infoValue}>{new Date(client.lastContact).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className={styles.infoSection}>
        <h3>Notes</h3>
        <p className={styles.notes}>{client.notes}</p>
      </div>

      <div className={styles.infoSection}>
        <h3>Goals</h3>
        <p className={styles.goals}>{client.goals}</p>
      </div>

      <div className={styles.infoSection}>
        <h3>Tags</h3>
        <div className={styles.tags}>
          {client.tags && client.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientOverview;
