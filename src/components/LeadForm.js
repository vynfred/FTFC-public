import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { storage } from '../firebase-config';

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

  const [validation, setValidation] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

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

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({...prev, phone: formatted}));
  };

  const validateField = (name, value) => {
    let isValid = true;
    switch (name) {
      case 'email':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;
      case 'phone':
        isValid = value.replace(/\D/g, '').length === 10;
        break;
      default:
        isValid = value.trim() !== '';
    }
    setValidation(prev => ({...prev, [name]: isValid}));
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
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('There was an error submitting your form. Please try again.');
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
            value={formData.firstName}
            onChange={(e) => {
              setFormData(prev => ({...prev, firstName: e.target.value}));
              validateField('firstName', e.target.value);
            }}
            required
          />
          {validation.firstName && <FaCheck className="validation-check" />}
        </div>

        {/* Add other personal info fields similarly */}
        <div className="form-group">
          <label className="required-field">Role in Company</label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => {
              setFormData(prev => ({...prev, role: e.target.value}));
              validateField('role', e.target.value);
            }}
            required
          />
          {validation.role && <FaCheck className="validation-check" />}
        </div>

        <div className="form-group">
          <label className="required-field">Address</label>
          <input
            type="text"
            placeholder="Street Address"
            value={formData.address.street}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              address: {...prev.address, street: e.target.value}
            }))}
            required
          />
          {/* Add city, state, zip inputs */}
        </div>
      </section>

      {/* Timeline Dropdown */}
      <div className="form-group">
        <label className="required-field">Timeline</label>
        <select
          value={formData.timeline}
          onChange={(e) => setFormData(prev => ({...prev, timeline: e.target.value}))}
          required
        >
          <option value="">Select Timeline</option>
          {timelineOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Referral Source */}
      <div className="form-group">
        <label className="required-field">How did you hear about us?</label>
        <select
          value={formData.referralSource}
          onChange={(e) => setFormData(prev => ({...prev, referralSource: e.target.value}))}
          required
        >
          <option value="">Select Source</option>
          {referralOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Conditional Referrer Name field */}
      {formData.referralSource === 'Person' && (
        <div className="form-group">
          <label className="required-field">Referrer's Name</label>
          <input
            type="text"
            value={formData.referrerName}
            onChange={(e) => setFormData(prev => ({...prev, referrerName: e.target.value}))}
            required
          />
        </div>
      )}

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

      {/* Referral Information (if not provided via props) */}
      {!referralType && !referrerId && (
        <section>
          <h2>Referral Information</h2>
          <div className="form-group">
            <label>How did you hear about us?</label>
            <select
              name="referralSource"
              value={formData.referralSource}
              onChange={handleChange}
            >
              <option value="">Select Source</option>
              <option value="search">Search Engine</option>
              <option value="social">Social Media</option>
              <option value="event">Event</option>
              <option value="referral">Personal Referral</option>
              <option value="other">Other</option>
            </select>
          </div>

          {formData.referralSource === 'referral' && (
            <div className="form-group">
              <label>Referrer's Name</label>
              <input
                type="text"
                name="referrerName"
                value={formData.referrerName}
                onChange={handleChange}
                placeholder="Who referred you to us?"
              />
            </div>
          )}
        </section>
      )}

      <button
        type="submit"
        className="submit-button"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Consultation Request'}
      </button>
        </>
      )}
    </form>
  );
};

export default LeadForm;