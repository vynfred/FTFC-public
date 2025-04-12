import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaExclamationCircle, FaUserPlus } from 'react-icons/fa';
import { extractLeadDataFromMeeting, createLeadFromMeeting } from '../../services/MeetingToLeadService';
import ValidationService from '../../services/ValidationService';
import styles from './MeetingToLead.module.css';

/**
 * Meeting to Lead Form Component
 * 
 * This component provides a form to create a lead from meeting data.
 * It pre-populates the form with data extracted from the meeting.
 */
const MeetingToLeadForm = ({ meeting, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  // Initialize form with meeting data
  useEffect(() => {
    if (meeting) {
      const extractedData = extractLeadDataFromMeeting(meeting);
      setFormData(extractedData);
    }
  }, [meeting]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested fields (like address)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!ValidationService.validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.companyName) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Create lead from meeting data
      const result = await createLeadFromMeeting(meeting, formData);
      
      setSubmitSuccess(true);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result);
      }
      
      // Navigate to the new lead after a short delay
      setTimeout(() => {
        navigate(`/dashboard/leads/${result.leadId}`);
      }, 1500);
    } catch (error) {
      console.error('Error creating lead from meeting:', error);
      setSubmitError('Failed to create lead. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!meeting) {
    return <div className={styles.error}>Meeting data not available</div>;
  }

  return (
    <div className={styles.meetingToLeadForm}>
      <div className={styles.formHeader}>
        <h2>
          <FaUserPlus className={styles.headerIcon} />
          Create Lead from Meeting
        </h2>
        <p>Create a new lead using information from this meeting</p>
      </div>
      
      {submitSuccess ? (
        <div className={styles.successMessage}>
          <FaCheck className={styles.successIcon} />
          <h3>Lead Created Successfully!</h3>
          <p>Redirecting to the new lead...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {submitError && (
            <div className={styles.errorMessage}>
              <FaExclamationCircle className={styles.errorIcon} />
              {submitError}
            </div>
          )}
          
          <div className={styles.formSection}>
            <h3>Meeting Information</h3>
            <div className={styles.meetingInfo}>
              <div className={styles.meetingDetail}>
                <strong>Meeting Title:</strong> {meeting.title}
              </div>
              <div className={styles.meetingDetail}>
                <strong>Date:</strong> {meeting.date}
              </div>
              <div className={styles.meetingDetail}>
                <strong>Time:</strong> {meeting.startTime} - {meeting.endTime}
              </div>
              {meeting.attendees && meeting.attendees.length > 0 && (
                <div className={styles.meetingDetail}>
                  <strong>Attendees:</strong> {meeting.attendees.map(a => a.email || a).join(', ')}
                </div>
              )}
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h3>Contact Information</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.required}>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleChange}
                  className={errors.firstName ? styles.inputError : ''}
                  required
                />
                {errors.firstName && <div className={styles.errorText}>{errors.firstName}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.required}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleChange}
                  className={errors.lastName ? styles.inputError : ''}
                  required
                />
                {errors.lastName && <div className={styles.errorText}>{errors.lastName}</div>}
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.required}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className={errors.email ? styles.inputError : ''}
                  required
                />
                {errors.email && <div className={styles.errorText}>{errors.email}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  placeholder="(123) 456-7890"
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.required}>Role</label>
              <input
                type="text"
                name="role"
                value={formData.role || ''}
                onChange={handleChange}
                placeholder="e.g., CEO, CTO, Founder"
                className={errors.role ? styles.inputError : ''}
                required
              />
              {errors.role && <div className={styles.errorText}>{errors.role}</div>}
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h3>Company Information</h3>
            <div className={styles.formGroup}>
              <label className={styles.required}>Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName || ''}
                onChange={handleChange}
                className={errors.companyName ? styles.inputError : ''}
                required
              />
              {errors.companyName && <div className={styles.errorText}>{errors.companyName}</div>}
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry || ''}
                  onChange={handleChange}
                  placeholder="e.g., Technology, Healthcare"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Team Size</label>
                <select
                  name="teamSize"
                  value={formData.teamSize || ''}
                  onChange={handleChange}
                >
                  <option value="">Select Team Size</option>
                  <option value="1-5">1-5</option>
                  <option value="6-10">6-10</option>
                  <option value="11-25">11-25</option>
                  <option value="26-50">26-50</option>
                  <option value="51-100">51-100</option>
                  <option value="101+">101+</option>
                </select>
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Revenue Status</label>
                <select
                  name="revenueStatus"
                  value={formData.revenueStatus || ''}
                  onChange={handleChange}
                >
                  <option value="">Select Revenue Status</option>
                  <option value="pre-revenue">Pre-Revenue</option>
                  <option value="revenue-generating">Revenue Generating</option>
                  <option value="profitable">Profitable</option>
                </select>
              </div>
              
              {(formData.revenueStatus === 'revenue-generating' || formData.revenueStatus === 'profitable') && (
                <div className={styles.formGroup}>
                  <label>Current ARR</label>
                  <input
                    type="number"
                    name="currentARR"
                    value={formData.currentARR || ''}
                    onChange={handleChange}
                    placeholder="$"
                    min="0"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h3>Fundraising Information</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Capital Raised to Date</label>
                <input
                  type="number"
                  name="capitalRaised"
                  value={formData.capitalRaised || ''}
                  onChange={handleChange}
                  placeholder="$"
                  min="0"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Target Raise</label>
                <input
                  type="number"
                  name="targetRaise"
                  value={formData.targetRaise || ''}
                  onChange={handleChange}
                  placeholder="$"
                  min="0"
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label>Timeline</label>
              <select
                name="timeline"
                value={formData.timeline || ''}
                onChange={handleChange}
              >
                <option value="">Select Timeline</option>
                <option value="Immediately">Immediately</option>
                <option value="Within 1 month">Within 1 month</option>
                <option value="Within 3 months">Within 3 months</option>
                <option value="Within 6 months">Within 6 months</option>
                <option value="Exploring options">Exploring options</option>
              </select>
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h3>Notes</h3>
            <div className={styles.formGroup}>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                rows={5}
                placeholder="Additional notes about this lead..."
              />
            </div>
          </div>
          
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <FaArrowLeft /> Cancel
            </button>
            
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Lead...' : 'Create Lead'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MeetingToLeadForm;
