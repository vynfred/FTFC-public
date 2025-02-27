import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaCheck } from 'react-icons/fa';

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

const LeadForm = () => {
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
    referralSource: '',
    referrerName: ''
  });

  const [validation, setValidation] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    try {
      let pitchDeckUrl = formData.pitchDeck.link;

      // Upload pitch deck if file exists
      if (formData.pitchDeck.file) {
        const fileRef = ref(storage, `pitch-decks/${formData.companyName}-${Date.now()}`);
        await uploadBytes(fileRef, formData.pitchDeck.file);
        pitchDeckUrl = await getDownloadURL(fileRef);
      }

      // Add to Firestore
      await addDoc(collection(db, 'leads'), {
        ...formData,
        pitchDeck: {
          url: pitchDeckUrl,
          link: formData.pitchDeck.link
        },
        status: 'Applied',
        submittedAt: new Date()
      });

      // Reset form
      setFormData({...initialFormState});
      alert('Thank you for your submission!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="consultation-form">
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

      <button 
        type="submit" 
        className="submit-button" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Consultation Request'}
      </button>
    </form>
  );
};

export default LeadForm; 