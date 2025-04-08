import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaBuilding, FaUser, FaHandshake } from 'react-icons/fa';
import styles from './ReferralIntakeForm.module.css';

const ReferralIntakeForm = () => {
  const { referrerId, type } = useParams();
  const [formStep, setFormStep] = useState(0);
  const [referralType, setReferralType] = useState(type || '');
  const [formData, setFormData] = useState({
    // Common fields
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Company fields
    companyName: '',
    industry: '',
    teamSize: '',
    revenueStatus: '',
    currentARR: '',
    capitalRaised: '',
    targetRaise: '',
    timeline: '',
    
    // Investor fields
    investmentFocus: [],
    investmentSize: '',
    investmentStage: [],
    accreditedInvestor: '',
    
    // Partner fields
    organization: '',
    partnerType: '',
    specialties: [],
    
    // Referral info
    referrerId: referrerId || '',
    referrerName: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Industry options
  const industryOptions = [
    'SaaS',
    'FinTech',
    'HealthTech',
    'E-commerce',
    'AI/ML',
    'CleanTech',
    'EdTech',
    'Other'
  ];

  // Investment stage options
  const stageOptions = [
    'Pre-seed',
    'Seed',
    'Series A',
    'Series B',
    'Series C+',
    'Growth'
  ];

  // Partner type options
  const partnerTypeOptions = [
    'Financial Advisor',
    'Law Firm',
    'Accounting Firm',
    'Consultant',
    'Accelerator/Incubator',
    'Other'
  ];

  // Timeline options
  const timelineOptions = [
    'Immediately',
    'Within 1 month',
    'Within 3 months',
    'Within 6 months',
    'Exploring options'
  ];

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter(item => item !== value)
      }));
    }
  };

  // Handle referral type selection
  const handleReferralTypeSelect = (type) => {
    setReferralType(type);
    setFormStep(1);
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    // Common validations
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    
    // Type-specific validations
    if (referralType === 'company') {
      if (!formData.companyName) newErrors.companyName = 'Company name is required';
      if (!formData.industry) newErrors.industry = 'Industry is required';
    } else if (referralType === 'investor') {
      if (formData.investmentFocus.length === 0) newErrors.investmentFocus = 'At least one investment focus is required';
      if (!formData.investmentSize) newErrors.investmentSize = 'Investment size is required';
    } else if (referralType === 'partner') {
      if (!formData.organization) newErrors.organization = 'Organization name is required';
      if (!formData.partnerType) newErrors.partnerType = 'Partner type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would submit the form data to your backend here
      console.log('Form data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the referral type selection step
  const renderReferralTypeStep = () => (
    <div className={styles.referralTypeContainer}>
      <h2>What type of referral would you like to make?</h2>
      <p>Select the type of referral you'd like to submit</p>
      
      <div className={styles.referralTypeOptions}>
        <button 
          className={styles.referralTypeOption}
          onClick={() => handleReferralTypeSelect('company')}
        >
          <FaBuilding className={styles.referralTypeIcon} />
          <h3>Company</h3>
          <p>Refer a company looking for funding</p>
        </button>
        
        <button 
          className={styles.referralTypeOption}
          onClick={() => handleReferralTypeSelect('investor')}
        >
          <FaUser className={styles.referralTypeIcon} />
          <h3>Investor</h3>
          <p>Refer an investor looking for opportunities</p>
        </button>
        
        <button 
          className={styles.referralTypeOption}
          onClick={() => handleReferralTypeSelect('partner')}
        >
          <FaHandshake className={styles.referralTypeIcon} />
          <h3>Partner</h3>
          <p>Refer a potential partner for FTFC</p>
        </button>
      </div>
    </div>
  );

  // Render the form fields based on the selected referral type
  const renderFormFields = () => {
    return (
      <form onSubmit={handleSubmit} className={styles.referralForm}>
        <h2>
          {referralType === 'company' ? 'Company Referral' : 
           referralType === 'investor' ? 'Investor Referral' : 
           'Partner Referral'}
        </h2>
        
        {/* Common Fields */}
        <div className={styles.formSection}>
          <h3>Contact Information</h3>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? styles.inputError : ''}
              />
              {errors.firstName && <div className={styles.errorMessage}>{errors.firstName}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? styles.inputError : ''}
              />
              {errors.lastName && <div className={styles.errorMessage}>{errors.lastName}</div>}
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? styles.inputError : ''}
              />
              {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? styles.inputError : ''}
              />
              {errors.phone && <div className={styles.errorMessage}>{errors.phone}</div>}
            </div>
          </div>
        </div>
        
        {/* Company-specific Fields */}
        {referralType === 'company' && (
          <div className={styles.formSection}>
            <h3>Company Information</h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="companyName">Company Name *</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={errors.companyName ? styles.inputError : ''}
              />
              {errors.companyName && <div className={styles.errorMessage}>{errors.companyName}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="industry">Industry *</label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className={errors.industry ? styles.inputError : ''}
              >
                <option value="">Select Industry</option>
                {industryOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.industry && <div className={styles.errorMessage}>{errors.industry}</div>}
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="teamSize">Team Size</label>
                <input
                  type="number"
                  id="teamSize"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleChange}
                  min="1"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="revenueStatus">Revenue Status</label>
                <select
                  id="revenueStatus"
                  name="revenueStatus"
                  value={formData.revenueStatus}
                  onChange={handleChange}
                >
                  <option value="">Select Status</option>
                  <option value="pre-revenue">Pre-revenue</option>
                  <option value="revenue-generating">Revenue Generating</option>
                </select>
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="currentARR">Current ARR (if applicable)</label>
                <input
                  type="text"
                  id="currentARR"
                  name="currentARR"
                  value={formData.currentARR}
                  onChange={handleChange}
                  placeholder="e.g. $500K"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="capitalRaised">Capital Raised to Date</label>
                <input
                  type="text"
                  id="capitalRaised"
                  name="capitalRaised"
                  value={formData.capitalRaised}
                  onChange={handleChange}
                  placeholder="e.g. $1.2M"
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="targetRaise">Target Raise Amount</label>
                <input
                  type="text"
                  id="targetRaise"
                  name="targetRaise"
                  value={formData.targetRaise}
                  onChange={handleChange}
                  placeholder="e.g. $2M"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="timeline">Fundraising Timeline</label>
                <select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                >
                  <option value="">Select Timeline</option>
                  {timelineOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        
        {/* Investor-specific Fields */}
        {referralType === 'investor' && (
          <div className={styles.formSection}>
            <h3>Investor Information</h3>
            
            <div className={styles.formGroup}>
              <label>Investment Focus *</label>
              <div className={styles.checkboxGroup}>
                {industryOptions.map(option => (
                  <label key={option} className={styles.checkbox}>
                    <input
                      type="checkbox"
                      value={option}
                      checked={formData.investmentFocus.includes(option)}
                      onChange={(e) => handleCheckboxChange(e, 'investmentFocus')}
                    />
                    {option}
                  </label>
                ))}
              </div>
              {errors.investmentFocus && <div className={styles.errorMessage}>{errors.investmentFocus}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="investmentSize">Typical Investment Size *</label>
              <select
                id="investmentSize"
                name="investmentSize"
                value={formData.investmentSize}
                onChange={handleChange}
                className={errors.investmentSize ? styles.inputError : ''}
              >
                <option value="">Select Investment Size</option>
                <option value="under100k">Under $100K</option>
                <option value="100k-500k">$100K - $500K</option>
                <option value="500k-1m">$500K - $1M</option>
                <option value="1m-5m">$1M - $5M</option>
                <option value="over5m">Over $5M</option>
              </select>
              {errors.investmentSize && <div className={styles.errorMessage}>{errors.investmentSize}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label>Investment Stage</label>
              <div className={styles.checkboxGroup}>
                {stageOptions.map(option => (
                  <label key={option} className={styles.checkbox}>
                    <input
                      type="checkbox"
                      value={option}
                      checked={formData.investmentStage.includes(option)}
                      onChange={(e) => handleCheckboxChange(e, 'investmentStage')}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="accreditedInvestor">Accredited Investor?</label>
              <select
                id="accreditedInvestor"
                name="accreditedInvestor"
                value={formData.accreditedInvestor}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>
        )}
        
        {/* Partner-specific Fields */}
        {referralType === 'partner' && (
          <div className={styles.formSection}>
            <h3>Partner Information</h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="organization">Organization Name *</label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                className={errors.organization ? styles.inputError : ''}
              />
              {errors.organization && <div className={styles.errorMessage}>{errors.organization}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="partnerType">Partner Type *</label>
              <select
                id="partnerType"
                name="partnerType"
                value={formData.partnerType}
                onChange={handleChange}
                className={errors.partnerType ? styles.inputError : ''}
              >
                <option value="">Select Partner Type</option>
                {partnerTypeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.partnerType && <div className={styles.errorMessage}>{errors.partnerType}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label>Specialties</label>
              <div className={styles.checkboxGroup}>
                {industryOptions.map(option => (
                  <label key={option} className={styles.checkbox}>
                    <input
                      type="checkbox"
                      value={option}
                      checked={formData.specialties.includes(option)}
                      onChange={(e) => handleCheckboxChange(e, 'specialties')}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Referral Information */}
        {referrerId && (
          <div className={styles.formSection}>
            <h3>Referral Information</h3>
            <p className={styles.referralInfo}>
              You were referred by: <strong>{referrerId}</strong>
            </p>
          </div>
        )}
        
        <div className={styles.formActions}>
          <button 
            type="button" 
            className={styles.backButton}
            onClick={() => setFormStep(0)}
          >
            Back
          </button>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Referral'}
          </button>
        </div>
      </form>
    );
  };

  // Render success message after form submission
  const renderSuccessMessage = () => (
    <div className={styles.successMessage}>
      <h2>Thank You for Your Referral!</h2>
      <p>We've received your referral and will be in touch soon.</p>
      <button 
        className={styles.returnButton}
        onClick={() => {
          setSubmitSuccess(false);
          setFormStep(0);
          setReferralType('');
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            companyName: '',
            industry: '',
            teamSize: '',
            revenueStatus: '',
            currentARR: '',
            capitalRaised: '',
            targetRaise: '',
            timeline: '',
            investmentFocus: [],
            investmentSize: '',
            investmentStage: [],
            accreditedInvestor: '',
            organization: '',
            partnerType: '',
            specialties: [],
            referrerId: referrerId || '',
            referrerName: ''
          });
        }}
      >
        Submit Another Referral
      </button>
    </div>
  );

  return (
    <div className={styles.referralIntakeContainer}>
      {submitSuccess ? (
        renderSuccessMessage()
      ) : (
        formStep === 0 ? renderReferralTypeStep() : renderFormFields()
      )}
    </div>
  );
};

export default ReferralIntakeForm;
