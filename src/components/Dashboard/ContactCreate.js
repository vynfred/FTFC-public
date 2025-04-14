import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase-config';
import { EMAIL_TYPES, sendCustomEmail } from '../../services/emailService';
import { generateToken } from '../../utils/tokenUtils';
import styles from './DetailPages.module.css';

const ContactCreate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [contactData, setContactData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    position: '',
    type: 'Client', // Client, Investor, Partner, Other
    linkedCompanyId: '',
    linkedInvestorId: '',
    linkedPartnerId: '',
    notes: '',
    sendConfirmationEmail: true
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!contactData.firstName || !contactData.lastName || !contactData.email) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Generate verification token if sending confirmation email
      const verificationToken = contactData.sendConfirmationEmail ? generateToken() : null;
      const verificationExpiry = contactData.sendConfirmationEmail ?
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null; // 7 days from now

      // Create contact in Firestore
      const docRef = await addDoc(collection(db, 'contacts'), {
        ...contactData,
        name: `${contactData.firstName} ${contactData.lastName}`,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        isVerified: !contactData.sendConfirmationEmail, // If not sending email, mark as verified
        verificationToken: verificationToken,
        verificationExpiry: verificationExpiry,
        portalAccess: !contactData.sendConfirmationEmail // If not sending email, grant portal access
      });

      // Send confirmation email if option is selected
      if (contactData.sendConfirmationEmail) {
        try {
          const verificationUrl = `${window.location.origin}/verify-contact/${docRef.id}/${verificationToken}`;

          await sendCustomEmail(
            contactData.email,
            EMAIL_TYPES.WELCOME,
            {
              name: `${contactData.firstName} ${contactData.lastName}`,
              verificationUrl: verificationUrl,
              portalType: contactData.type.toLowerCase()
            }
          );

          console.log('Confirmation email sent successfully');
        } catch (emailError) {
          console.error('Error sending confirmation email:', emailError);
          // Continue even if email fails
        }
      }

      setSuccess(true);

      // Redirect to contact detail page after a short delay
      setTimeout(() => {
        navigate(`/dashboard/contacts/${docRef.id}`);
      }, 1500);
    } catch (err) {
      console.error('Error creating contact:', err);
      setError(`Error creating contact: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.detailPage}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => navigate('/dashboard/contacts')}
        >
          <FaArrowLeft /> Back to Contacts
        </button>
        <div className={styles.actions}>
          <button
            className={`${styles.actionButton} ${styles.saveButton}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <FaSave /> {isSubmitting ? 'Creating...' : 'Create Contact'}
          </button>
          <button
            className={styles.actionButton}
            onClick={() => navigate('/dashboard/contacts')}
            disabled={isSubmitting}
          >
            <FaTimes /> Cancel
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {success ? (
        <div className={styles.successMessage}>
          <h3>Contact Created Successfully!</h3>
          <p>Redirecting to contact details...</p>
        </div>
      ) : (
        <form className={styles.createForm} onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <h3>Contact Information</h3>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={contactData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={contactData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={contactData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={contactData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Professional Information</h3>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={contactData.companyName}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="position">Position</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={contactData.position}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="type">Contact Type</label>
                <select
                  id="type"
                  name="type"
                  value={contactData.type}
                  onChange={handleInputChange}
                >
                  <option value="Client">Client</option>
                  <option value="Investor">Investor</option>
                  <option value="Partner">Partner</option>
                  <option value="Lead">Lead</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {contactData.type === 'Client' && (
                <div className={styles.formGroup}>
                  <label htmlFor="linkedCompanyId">Linked Company ID</label>
                  <input
                    type="text"
                    id="linkedCompanyId"
                    name="linkedCompanyId"
                    value={contactData.linkedCompanyId}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              {contactData.type === 'Investor' && (
                <div className={styles.formGroup}>
                  <label htmlFor="linkedInvestorId">Linked Investor ID</label>
                  <input
                    type="text"
                    id="linkedInvestorId"
                    name="linkedInvestorId"
                    value={contactData.linkedInvestorId}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              {contactData.type === 'Partner' && (
                <div className={styles.formGroup}>
                  <label htmlFor="linkedPartnerId">Linked Partner ID</label>
                  <input
                    type="text"
                    id="linkedPartnerId"
                    name="linkedPartnerId"
                    value={contactData.linkedPartnerId}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Additional Information</h3>

            <div className={styles.formGroup}>
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                rows="4"
                value={contactData.notes}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="sendConfirmationEmail"
                  name="sendConfirmationEmail"
                  checked={contactData.sendConfirmationEmail}
                  onChange={(e) => setContactData(prev => ({
                    ...prev,
                    sendConfirmationEmail: e.target.checked
                  }))}
                />
                <label htmlFor="sendConfirmationEmail">Send confirmation email with portal access</label>
              </div>
              <p className={styles.helpText}>When checked, the contact will receive an email to verify their account and access their portal.</p>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactCreate;
