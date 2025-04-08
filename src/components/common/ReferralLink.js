import React, { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';
import styles from './ReferralLink.module.css';

/**
 * ReferralLink component for displaying and copying a referral link
 * 
 * @param {Object} props
 * @param {string} props.userId - User ID for the referral link
 * @param {string} props.type - Type of referral (client, investor, partner)
 * @param {string} props.title - Title for the referral link section
 */
const ReferralLink = ({ userId, type, title = 'Your Referral Link' }) => {
  const [copied, setCopied] = useState(false);

  // Generate referral link with UTM parameters
  const generateReferralLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/intake/${type}/${userId}?utm_source=referral&utm_medium=portal&utm_campaign=${type}_referral&utm_content=${userId}`;
  };

  const referralLink = generateReferralLink();

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.referralLinkContainer}>
      <h3 className={styles.referralTitle}>{title}</h3>
      <p className={styles.referralDescription}>
        Share this unique link to refer {type === 'client' ? 'companies' : type === 'investor' ? 'investors' : 'partners'} to FTFC
      </p>
      <div className={styles.linkContainer}>
        <input
          type="text"
          value={referralLink}
          readOnly
          className={styles.linkInput}
        />
        <button 
          className={styles.copyButton}
          onClick={handleCopy}
          aria-label="Copy referral link"
        >
          {copied ? <FaCheck /> : <FaCopy />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
};

export default ReferralLink;
