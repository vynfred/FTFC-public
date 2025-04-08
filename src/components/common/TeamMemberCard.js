import React from 'react';
import { FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';
import styles from './TeamMemberCard.module.css';

/**
 * TeamMemberCard component for displaying team member information
 * 
 * @param {Object} props
 * @param {string} props.name - Team member name
 * @param {string} props.title - Team member title/position
 * @param {string} props.email - Team member email
 * @param {string} props.phone - Team member phone number
 * @param {string} props.imageSrc - Team member profile image URL
 */
const TeamMemberCard = ({ name, title, email, phone, imageSrc }) => {
  return (
    <div className={styles.teamMemberCard}>
      <div className={styles.memberImageContainer}>
        {imageSrc ? (
          <img src={imageSrc} alt={name} className={styles.memberImage} />
        ) : (
          <div className={styles.memberImagePlaceholder}>
            <FaUser />
          </div>
        )}
      </div>
      <div className={styles.memberInfo}>
        <h3 className={styles.memberName}>{name}</h3>
        <p className={styles.memberTitle}>{title}</p>
        <div className={styles.memberContact}>
          {email && (
            <p className={styles.contactItem}>
              <FaEnvelope className={styles.contactIcon} />
              <a href={`mailto:${email}`}>{email}</a>
            </p>
          )}
          {phone && (
            <p className={styles.contactItem}>
              <FaPhone className={styles.contactIcon} />
              <a href={`tel:${phone}`}>{phone}</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
