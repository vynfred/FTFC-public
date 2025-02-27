import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase-config';

const InvestorForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    title: '',
    investmentFocus: [],
    investmentSize: '',
    investmentStage: [],
    accreditedInvestor: '',
    priorExperience: '',
    coinvestmentInterest: '',
    additionalInfo: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await addDoc(collection(db, 'investors'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'new'
      });
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        organization: '',
        title: '',
        investmentFocus: [],
        investmentSize: '',
        investmentStage: [],
        accreditedInvestor: '',
        priorExperience: '',
        coinvestmentInterest: '',
        additionalInfo: ''
      });
    } catch (error) {
      setError('Error submitting form. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const values = [...formData[name]];
      if (e.target.checked) {
        values.push(value);
      } else {
        const index = values.indexOf(value);
        if (index > -1) values.splice(index, 1);
      }
      setFormData(prev => ({ ...prev, [name]: values }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="investor-form">
      <div className="form-section">
        <h3>Personal Information</h3>
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Professional Information</h3>
        <div className="form-group">
          <label htmlFor="organization">Organization</label>
          <input
            type="text"
            id="organization"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Investment Preferences</h3>
        <div className="form-group">
          <label>Investment Focus (Select all that apply)</label>
          <div className="checkbox-group">
            {['SaaS', 'FinTech', 'HealthTech', 'AI/ML', 'Consumer', 'Enterprise', 'Hardware', 'Other'].map(focus => (
              <label key={focus} className="checkbox-label">
                <input
                  type="checkbox"
                  name="investmentFocus"
                  value={focus}
                  checked={formData.investmentFocus.includes(focus)}
                  onChange={handleChange}
                />
                {focus}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="investmentSize">Typical Investment Size *</label>
          <select
            id="investmentSize"
            name="investmentSize"
            value={formData.investmentSize}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option value="0-25k">$0 - $25,000</option>
            <option value="25k-50k">$25,000 - $50,000</option>
            <option value="50k-100k">$50,000 - $100,000</option>
            <option value="100k-250k">$100,000 - $250,000</option>
            <option value="250k-500k">$250,000 - $500,000</option>
            <option value="500k+">$500,000+</option>
          </select>
        </div>

        <div className="form-group">
          <label>Preferred Investment Stage</label>
          <div className="checkbox-group">
            {['Pre-seed', 'Seed', 'Series A', 'Series B+'].map(stage => (
              <label key={stage} className="checkbox-label">
                <input
                  type="checkbox"
                  name="investmentStage"
                  value={stage}
                  checked={formData.investmentStage.includes(stage)}
                  onChange={handleChange}
                />
                {stage}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Additional Information</h3>
        <div className="form-group">
          <label htmlFor="accreditedInvestor">Are you an accredited investor? *</label>
          <select
            id="accreditedInvestor"
            name="accreditedInvestor"
            value={formData.accreditedInvestor}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priorExperience">Prior Investment Experience</label>
          <textarea
            id="priorExperience"
            name="priorExperience"
            value={formData.priorExperience}
            onChange={handleChange}
            placeholder="Please describe your investment experience..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="additionalInfo">Additional Information</label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            placeholder="Any other information you'd like to share..."
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Thank you for your interest! We'll be in touch soon.</div>}
      
      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
};

export default InvestorForm; 