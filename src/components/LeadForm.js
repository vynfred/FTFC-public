import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { storage } from '../firebase-config';
import LeadProcessingService from '../services/LeadProcessingService';
import ValidationService from '../services/ValidationService';

const initialFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
  address: {
    street: '',
    city: '',
    state: '',
    zip: ''
  },
  companyName: '',
  industry: '',
  teamSize: '',
  revenueStatus: '',
  currentARR: '',
  capitalRaised: '',
  targetRaise: '',
  timeline: '',
  pitchDeck: {
    file: null,
    link: ''
  },
  referralSource: '',
  referrerName: ''
};

const LeadForm = ({ referralType = '', referrerId = '' }) => {
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    },

    // Company Info
    companyName: '',
    industry: '',
    teamSize: '',
    revenueStatus: '',
    currentARR: '',

    // Fundraising Info
    capitalRaised: '',
    targetRaise: '',
    timeline: '',
    pitchDeck: {
      file: null,
      link: ''
    },

    // Referral Info
    referralSource: referralType || '',
    referrerId: referrerId || '',
    referrerName: ''
  });

  const [errors, setErrors] = useState({});
  const [validation, setValidation] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formTouched, setFormTouched] = useState(false);

  const timelineOptions = [
    'Immediately',
    'Within 1 month',
    'Within 3 months',
    'Within 6 months',
    'Exploring options'
  ];

  const referralOptions = [
    'Person',
    'LinkedIn',
    'Google',
    'Event',
    'Other'
  ];

  // Format phone number as user types
  const formatPhoneNumber = (value) => {
    const phone = value.replace(/\D/g, '');
    if (phone.length < 4) return phone;
    if (phone.length < 7) return `(${phone.slice(0,3)}) ${phone.slice(3)}`;
    return `(${phone.slice(0,3)}) ${phone.slice(3,6)}-${phone.slice(6,10)}`;
  };

  // Generic change handler for form fields
  const handleChange = (e) => {
    const { name, value, type } = e.target;

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
      // Handle regular fields
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Mark form as touched
    if (!formTouched) {
      setFormTouched(true);
    }

    // Validate the field
    validateField(name, value);
  };

  const handlePhoneChange = (e) => {
    const formatted = ValidationService.formatPhoneNumber(e.target.value);
    setFormData(prev => ({...prev, phone: formatted}));
    validateField('phone', formatted);
  };

  const validateField = (name, value) => {
    let isValid = true;
    let errorMessage = '';

    // Handle nested fields (like address)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      value = value || formData[parent][child];

      // Validate address fields
      if (parent === 'address') {
        switch (child) {
          case 'zip':
            isValid = ValidationService.validateZipCode(value);
            errorMessage = isValid ? '' : 'Please enter a valid zip code';
            break;
          default:
            isValid = ValidationService.validateRequired(value);
            errorMessage = isValid ? '' : `${child.charAt(0).toUpperCase() + child.slice(1)} is required`;
        }
      }
    } else {
      // Use value from parameter or get from formData
      value = value !== undefined ? value : formData[name];

      // Validate based on field name
      switch (name) {
        case 'email':
          isValid = ValidationService.validateEmail(value);
          errorMessage = isValid ? '' : 'Please enter a valid email address';
          break;
        case 'phone':
          isValid = ValidationService.validatePhone(value);
          errorMessage = isValid ? '' : 'Please enter a valid phone number';
          break;
        case 'companyName':
        case 'firstName':
        case 'lastName':
        case 'role':
          isValid = ValidationService.validateRequired(value);
          errorMessage = isValid ? '' : `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
          break;
        case 'currentARR':
        case 'capitalRaised':
        case 'targetRaise':
          if (value) {
            isValid = ValidationService.validateNumber(value, { min: 0 });
            errorMessage = isValid ? '' : 'Please enter a valid positive number';
          }
          break;
        case 'website':
          if (value) {
            isValid = ValidationService.validateUrl(value);
            errorMessage = isValid ? '' : 'Please enter a valid URL';
          }
          break;
        case 'referrerName':
          if (formData.referralSource === 'Person') {
            isValid = ValidationService.validateRequired(value);
            errorMessage = isValid ? '' : 'Referrer name is required';
          }
          break;
      }
    }

    // Update validation state
    setValidation(prev => ({...prev, [name]: isValid}));

    // Update errors state
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));

    return isValid;
  };

  // Validate all form fields
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Required personal information
    if (!ValidationService.validateRequired(formData.firstName)) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!ValidationService.validateRequired(formData.lastName)) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!ValidationService.validateRequired(formData.email)) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!ValidationService.validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!ValidationService.validateRequired(formData.phone)) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!ValidationService.validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    if (!ValidationService.validateRequired(formData.role)) {
      newErrors.role = 'Role is required';
      isValid = false;
    }

    // Required company information
    if (!ValidationService.validateRequired(formData.companyName)) {
      newErrors.companyName = 'Company name is required';
      isValid = false;
    }

    if (!ValidationService.validateRequired(formData.industry)) {
      newErrors.industry = 'Industry is required';
      isValid = false;
    }

    // Validate address fields
    if (!ValidationService.validateRequired(formData.address.street)) {
      newErrors['address.street'] = 'Street address is required';
      isValid = false;
    }

    if (!ValidationService.validateRequired(formData.address.city)) {
      newErrors['address.city'] = 'City is required';
      isValid = false;
    }

    if (!ValidationService.validateRequired(formData.address.state)) {
      newErrors['address.state'] = 'State is required';
      isValid = false;
    }

    if (!ValidationService.validateRequired(formData.address.zip)) {
      newErrors['address.zip'] = 'Zip code is required';
      isValid = false;
    } else if (!ValidationService.validateZipCode(formData.address.zip)) {
      newErrors['address.zip'] = 'Please enter a valid zip code';
      isValid = false;
    }

    // Validate numeric fields if they have values
    if (formData.currentARR && !ValidationService.validateNumber(formData.currentARR, { min: 0 })) {
      newErrors.currentARR = 'Current ARR must be a positive number';
      isValid = false;
    }

    if (formData.capitalRaised && !ValidationService.validateNumber(formData.capitalRaised, { min: 0 })) {
      newErrors.capitalRaised = 'Capital raised must be a positive number';
      isValid = false;
    }

    if (!ValidationService.validateRequired(formData.targetRaise)) {
      newErrors.targetRaise = 'Target raise is required';
      isValid = false;
    } else if (!ValidationService.validateNumber(formData.targetRaise, { min: 0 })) {
      newErrors.targetRaise = 'Target raise must be a positive number';
      isValid = false;
    }

    if (!ValidationService.validateRequired(formData.timeline)) {
      newErrors.timeline = 'Timeline is required';
      isValid = false;
    }

    // Validate referral information
    if (!ValidationService.validateRequired(formData.referralSource)) {
      newErrors.referralSource = 'Please select how you heard about us';
      isValid = false;
    }

    if (formData.referralSource === 'Person' && !ValidationService.validateRequired(formData.referrerName)) {
      newErrors.referrerName = 'Referrer name is required';
      isValid = false;
    }

    // Update errors state
    setErrors(newErrors);

    return isValid;
  };

  const formatUrl = (url) => {
    if (!url) return url;

    let formattedUrl = url.trim();

    // Don't modify if it's already a complete URL
    if (formattedUrl.match(/^https?:\/\/www\./)) {
      return formattedUrl;
    }

    // Add https:// if not present
    if (!formattedUrl.match(/^https?:\/\//)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    // Add www. if not present
    if (!formattedUrl.match(/^https?:\/\/www\./)) {
      formattedUrl = formattedUrl.replace(/^(https?:\/\/)/, '$1www.');
    }

    return formattedUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.error-text');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      let pitchDeckUrl = formData.pitchDeck.link;

      // Upload pitch deck if file exists
      if (formData.pitchDeck.file) {
        const fileRef = ref(storage, `pitch-decks/${formData.companyName}-${Date.now()}`);
        await uploadBytes(fileRef, formData.pitchDeck.file);
        pitchDeckUrl = await getDownloadURL(fileRef);
      }

      // Prepare the lead data
      const leadData = {
        ...formData,
        pitchDeck: {
          url: pitchDeckUrl,
          link: formData.pitchDeck.link
        }
      };

      // Process the lead based on the source
      let result;

      if (referralType && referrerId) {
        // Process as a referral lead
        result = await LeadProcessingService.processReferralLead(leadData, referralType, referrerId);
      } else if (formData.referralSource && formData.referrerId) {
        // Process as a referral lead from form data
        result = await LeadProcessingService.processReferralLead(
          leadData,
          formData.referralSource,
          formData.referrerId
        );
      } else {
        // Process as a website form lead
        result = await LeadProcessingService.processWebsiteFormLead(leadData);
      }

      // Reset form and show success message
      setFormData({...initialFormState});
      setSubmitSuccess(true);

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('There was an error submitting your form. Please try again.');

      // Log detailed error for debugging
      if (error.code) {
        console.error(`Error code: ${error.code}`);
      }
      if (error.message) {
        console.error(`Error message: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="consultation-form">
      {submitSuccess ? (
        <div className="success-message">
          <h2>Thank you for your submission!</h2>
          <p>We have received your information and will contact you shortly.</p>
        </div>
      ) : (
        <>
          {submitError && (
            <div className="error-message">
              <p>{submitError}</p>
            </div>
          )}

          {/* Personal Information */}
          <section>
            <h2>Personal Information</h2>
            <div className="form-group">
              <label className="required-field">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
                required
              />
              {errors.firstName ? (
                <div className="error-text">{errors.firstName}</div>
              ) : (
                validation.firstName && <FaCheck className="validation-check" />
              )}
            </div>

            <div className="form-group">
              <label className="required-field">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
                required
              />
              {errors.lastName ? (
                <div className="error-text">{errors.lastName}</div>
              ) : (
                validation.lastName && <FaCheck className="validation-check" />
              )}
            </div>

            <div className="form-group">
              <label className="required-field">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                required
              />
              {errors.email ? (
                <div className="error-text">{errors.email}</div>
              ) : (
                validation.email && <FaCheck className="validation-check" />
              )}
            </div>

            <div className="form-group">
              <label className="required-field">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="(123) 456-7890"
                className={errors.phone ? 'error' : ''}
                required
              />
              {errors.phone ? (
                <div className="error-text">{errors.phone}</div>
              ) : (
                validation.phone && <FaCheck className="validation-check" />
              )}
            </div>

            <div className="form-group">
              <label className="required-field">Role in Company</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={errors.role ? 'error' : ''}
                required
              />
              {errors.role ? (
                <div className="error-text">{errors.role}</div>
              ) : (
                validation.role && <FaCheck className="validation-check" />
              )}
            </div>

            <div className="form-group">
              <label className="required-field">Address</label>
              <input
                type="text"
                name="address.street"
                placeholder="Street Address"
                value={formData.address.street}
                onChange={handleChange}
                className={errors['address.street'] ? 'error' : ''}
                required
              />
              {errors['address.street'] && (
                <div className="error-text">{errors['address.street']}</div>
              )}

              <div className="address-grid">
                <div>
                  <input
                    type="text"
                    name="address.city"
                    placeholder="City"
                    value={formData.address.city}
                    onChange={handleChange}
                    className={errors['address.city'] ? 'error' : ''}
                    required
                  />
                  {errors['address.city'] && (
                    <div className="error-text">{errors['address.city']}</div>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="address.state"
                    placeholder="State"
                    value={formData.address.state}
                    onChange={handleChange}
                    className={errors['address.state'] ? 'error' : ''}
                    required
                  />
                  {errors['address.state'] && (
                    <div className="error-text">{errors['address.state']}</div>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="address.zip"
                    placeholder="Zip Code"
                    value={formData.address.zip}
                    onChange={handleChange}
                    className={errors['address.zip'] ? 'error' : ''}
                    required
                  />
                  {errors['address.zip'] && (
                    <div className="error-text">{errors['address.zip']}</div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Company Information */}
          <section>
            <h2>Company Information</h2>
            <div className="form-group">
              <label className="required-field">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={errors.companyName ? 'error' : ''}
                required
              />
              {errors.companyName ? (
                <div className="error-text">{errors.companyName}</div>
              ) : (
                validation.companyName && <FaCheck className="validation-check" />
              )}
            </div>

            <div className="form-group">
              <label className="required-field">Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className={errors.industry ? 'error' : ''}
                required
              />
              {errors.industry ? (
                <div className="error-text">{errors.industry}</div>
              ) : (
                validation.industry && <FaCheck className="validation-check" />
              )}
            </div>

            <div className="form-group">
              <label>Team Size</label>
              <select
                name="teamSize"
                value={formData.teamSize}
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

            <div className="form-group">
              <label>Revenue Status</label>
              <select
                name="revenueStatus"
                value={formData.revenueStatus}
                onChange={handleChange}
              >
                <option value="">Select Revenue Status</option>
                <option value="pre-revenue">Pre-Revenue</option>
                <option value="revenue-generating">Revenue Generating</option>
                <option value="profitable">Profitable</option>
              </select>
            </div>

            {formData.revenueStatus === 'revenue-generating' || formData.revenueStatus === 'profitable' ? (
              <div className="form-group">
                <label>Current Annual Recurring Revenue (ARR)</label>
                <input
                  type="number"
                  name="currentARR"
                  value={formData.currentARR}
                  onChange={handleChange}
                  placeholder="$"
                  min="0"
                  className={errors.currentARR ? 'error' : ''}
                />
                {errors.currentARR && (
                  <div className="error-text">{errors.currentARR}</div>
                )}
              </div>
            ) : null}
          </section>

          {/* Fundraising Information */}
          <section>
            <h2>Fundraising Information</h2>
            <div className="form-group">
              <label>Capital Raised to Date</label>
              <input
                type="number"
                name="capitalRaised"
                value={formData.capitalRaised}
                onChange={handleChange}
                placeholder="$"
                min="0"
                className={errors.capitalRaised ? 'error' : ''}
              />
              {errors.capitalRaised && (
                <div className="error-text">{errors.capitalRaised}</div>
              )}
            </div>

            <div className="form-group">
              <label className="required-field">Target Raise Amount</label>
              <input
                type="number"
                name="targetRaise"
                value={formData.targetRaise}
                onChange={handleChange}
                placeholder="$"
                min="0"
                className={errors.targetRaise ? 'error' : ''}
                required
              />
              {errors.targetRaise ? (
                <div className="error-text">{errors.targetRaise}</div>
              ) : (
                validation.targetRaise && <FaCheck className="validation-check" />
              )}
            </div>

            <div className="form-group">
              <label className="required-field">Timeline</label>
              <select
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                className={errors.timeline ? 'error' : ''}
                required
              >
                <option value="">Select Timeline</option>
                {timelineOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.timeline && (
                <div className="error-text">{errors.timeline}</div>
              )}
            </div>

            {/* Pitch Deck Upload */}
            <div className="form-group">
              <label>Pitch Deck</label>
              <input
                type="file"
                accept=".pdf,.ppt,.pptx"
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  pitchDeck: {...prev.pitchDeck, file: e.target.files[0]}
                }))}
              />
              <div className="helper-text">Or provide a link:</div>
              <input
                type="url"
                name="pitchDeck.link"
                placeholder="Link to pitch deck"
                value={formData.pitchDeck.link}
                onChange={(e) => {
                  const formattedUrl = formatUrl(e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    pitchDeck: {...prev.pitchDeck, link: formattedUrl}
                  }));
                }}
                onBlur={(e) => {
                  const formattedUrl = formatUrl(e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    pitchDeck: {...prev.pitchDeck, link: formattedUrl}
                  }));
                }}
              />
            </div>
          </section>

          {/* Referral Information */}
          <section>
            <h2>Referral Information</h2>
            <div className="form-group">
              <label className="required-field">How did you hear about us?</label>
              <select
                name="referralSource"
                value={formData.referralSource}
                onChange={handleChange}
                className={errors.referralSource ? 'error' : ''}
                required
              >
                <option value="">Select Source</option>
                {referralOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.referralSource && (
                <div className="error-text">{errors.referralSource}</div>
              )}
            </div>

            {/* Conditional Referrer Name field */}
            {formData.referralSource === 'Person' && (
              <div className="form-group">
                <label className="required-field">Referrer's Name</label>
                <input
                  type="text"
                  name="referrerName"
                  value={formData.referrerName}
                  onChange={handleChange}
                  className={errors.referrerName ? 'error' : ''}
                  required
                />
                {errors.referrerName ? (
                  <div className="error-text">{errors.referrerName}</div>
                ) : (
                  validation.referrerName && <FaCheck className="validation-check" />
                )}
              </div>
            )}
          </section>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Consultation Request'}
          </button>
        </>
      )}

      <style>{`
        .address-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          margin-top: 10px;
        }

        .error-text {
          color: #e53e3e;
          font-size: 14px;
          margin-top: 4px;
        }

        .validation-check {
          color: #38a169;
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
        }

        .form-group {
          position: relative;
          margin-bottom: 20px;
        }

        .required-field::after {
          content: "*";
          color: #e53e3e;
          margin-left: 4px;
        }

        input.error, select.error {
          border-color: #e53e3e;
        }

        .helper-text {
          font-size: 14px;
          color: #718096;
          margin: 5px 0;
        }

        .success-message {
          background-color: #f0fff4;
          border: 1px solid #38a169;
          border-radius: 4px;
          padding: 20px;
          text-align: center;
          margin-bottom: 20px;
        }

        .error-message {
          background-color: #fff5f5;
          border: 1px solid #e53e3e;
          border-radius: 4px;
          padding: 20px;
          text-align: center;
          margin-bottom: 20px;
        }

        .submit-button {
          background-color: #3182ce;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 12px 24px;
          font-size: 16px;
          cursor: pointer;
          width: 100%;
          transition: background-color 0.2s;
        }

        .submit-button:hover {
          background-color: #2c5282;
        }

        .submit-button:disabled {
          background-color: #a0aec0;
          cursor: not-allowed;
        }

        section {
          margin-bottom: 30px;
        }

        h2 {
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
      `}</style>
    </form>
  );
};

export default LeadForm;
