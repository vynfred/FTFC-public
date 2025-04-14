import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { db } from '../../firebase-config';
import { validateToken } from '../../utils/tokenUtils';
import styles from './Auth.module.css';

/**
 * Contact Verification Page
 * 
 * This page verifies a contact's email address using a token
 * and enables portal access for the contact.
 */
const VerifyContact = () => {
  const { contactId, token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // verifying, success, expired, invalid
  const [contact, setContact] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyContact = async () => {
      if (!contactId || !token) {
        setVerificationStatus('invalid');
        return;
      }

      try {
        // Get the contact document
        const contactRef = doc(db, 'contacts', contactId);
        const contactDoc = await getDoc(contactRef);

        if (!contactDoc.exists()) {
          setVerificationStatus('invalid');
          return;
        }

        const contactData = contactDoc.data();
        setContact(contactData);

        // Check if the contact is already verified
        if (contactData.isVerified) {
          setVerificationStatus('success');
          return;
        }

        // Validate the token
        if (contactData.verificationToken !== token) {
          setVerificationStatus('invalid');
          return;
        }

        // Check if the token has expired
        if (!validateToken(token, contactData.verificationExpiry)) {
          setVerificationStatus('expired');
          return;
        }

        // Update the contact document
        await updateDoc(contactRef, {
          isVerified: true,
          portalAccess: true,
          verificationToken: null, // Clear the token for security
          verifiedAt: new Date().toISOString()
        });

        setVerificationStatus('success');

        // Redirect to the appropriate portal after a delay
        setTimeout(() => {
          const portalType = contactData.type.toLowerCase();
          if (portalType === 'client') {
            navigate('/client-login');
          } else if (portalType === 'investor') {
            navigate('/investor-login');
          } else if (portalType === 'partner') {
            navigate('/partner-login');
          } else {
            navigate('/');
          }
        }, 5000);
      } catch (error) {
        console.error('Error verifying contact:', error);
        setVerificationStatus('invalid');
      }
    };

    verifyContact();
  }, [contactId, token, navigate]);

  const renderContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className={styles.verifyingContainer}>
            <FaSpinner className={styles.spinner} />
            <h2>Verifying your account...</h2>
            <p>Please wait while we verify your account.</p>
          </div>
        );

      case 'success':
        return (
          <div className={styles.successContainer}>
            <FaCheckCircle className={styles.successIcon} />
            <h2>Account Verified!</h2>
            <p>Your account has been successfully verified.</p>
            <p>You now have access to your portal.</p>
            {contact && (
              <p>
                You will be redirected to the{' '}
                {contact.type === 'Client'
                  ? 'Client'
                  : contact.type === 'Investor'
                  ? 'Investor'
                  : 'Partner'}{' '}
                login page in a few seconds.
              </p>
            )}
            <div className={styles.buttonContainer}>
              <Link
                to={
                  contact && contact.type === 'Client'
                    ? '/client-login'
                    : contact && contact.type === 'Investor'
                    ? '/investor-login'
                    : contact && contact.type === 'Partner'
                    ? '/partner-login'
                    : '/'
                }
                className={styles.primaryButton}
              >
                Go to Login
              </Link>
            </div>
          </div>
        );

      case 'expired':
        return (
          <div className={styles.errorContainer}>
            <FaExclamationTriangle className={styles.errorIcon} />
            <h2>Verification Link Expired</h2>
            <p>The verification link has expired.</p>
            <p>Please contact FTFC to request a new verification link.</p>
            <div className={styles.buttonContainer}>
              <Link to="/contact" className={styles.primaryButton}>
                Contact Us
              </Link>
              <Link to="/" className={styles.secondaryButton}>
                Go to Homepage
              </Link>
            </div>
          </div>
        );

      case 'invalid':
      default:
        return (
          <div className={styles.errorContainer}>
            <FaExclamationTriangle className={styles.errorIcon} />
            <h2>Invalid Verification Link</h2>
            <p>The verification link is invalid or has been used.</p>
            <p>Please contact FTFC to request a new verification link.</p>
            <div className={styles.buttonContainer}>
              <Link to="/contact" className={styles.primaryButton}>
                Contact Us
              </Link>
              <Link to="/" className={styles.secondaryButton}>
                Go to Homepage
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.verifyContainer}>
      <div className={styles.verifyCard}>{renderContent()}</div>
    </div>
  );
};

export default VerifyContact;
