import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase-config';
import styles from './DetailPages.module.css';

const LeadCreate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [leadData, setLeadData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    position: '',
    industry: '',
    source: '',
    status: 'New',
    assignedTo: '',
    notes: '',
    estimatedValue: '',
    probability: '50'
  });
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLeadData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!leadData.firstName || !leadData.lastName || !leadData.email) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create lead in Firestore
      const docRef = await addDoc(collection(db, 'leads'), {
        ...leadData,
        name: `${leadData.firstName} ${leadData.lastName}`,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        activities: [],
        documents: []
      });
      
      setSuccess(true);
      
      // Redirect to lead detail page after a short delay
      setTimeout(() => {
        navigate(`/dashboard/leads/${docRef.id}`);
      }, 1500);
    } catch (err) {
      console.error('Error creating lead:', err);
      setError(`Error creating lead: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={styles.detailPage}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/dashboard/leads')}
        >
          <FaArrowLeft /> Back to Leads
        </button>
        <div className={styles.actions}>
          <button 
            className={`${styles.actionButton} ${styles.saveButton}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <FaSave /> {isSubmitting ? 'Creating...' : 'Create Lead'}
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => navigate('/dashboard/leads')}
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
          <h3>Lead Created Successfully!</h3>
          <p>Redirecting to lead details...</p>
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
                  value={leadData.firstName}
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
                  value={leadData.lastName}
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
                  value={leadData.email}
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
                  value={leadData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h3>Company Information</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={leadData.companyName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="position">Position</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={leadData.position}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="industry">Industry</label>
                <select
                  id="industry"
                  name="industry"
                  value={leadData.industry}
                  onChange={handleInputChange}
                >
                  <option value="">Select Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="source">Lead Source</label>
                <select
                  id="source"
                  name="source"
                  value={leadData.source}
                  onChange={handleInputChange}
                >
                  <option value="">Select Source</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Event">Event</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h3>Lead Details</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={leadData.status}
                  onChange={handleInputChange}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Lost">Lost</option>
                  <option value="Won">Won</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="assignedTo">Assigned To</label>
                <input
                  type="text"
                  id="assignedTo"
                  name="assignedTo"
                  value={leadData.assignedTo}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="estimatedValue">Estimated Value ($)</label>
                <input
                  type="number"
                  id="estimatedValue"
                  name="estimatedValue"
                  value={leadData.estimatedValue}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="probability">Probability (%)</label>
                <input
                  type="number"
                  id="probability"
                  name="probability"
                  min="0"
                  max="100"
                  value={leadData.probability}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                rows="4"
                value={leadData.notes}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default LeadCreate;
