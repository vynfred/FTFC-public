import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase-config';

const ConsultationPage = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    vision: '',
    industry: [],
    teamSize: '',
    revenueStatus: 'pre-revenue',
    annualRevenue: '',
    capitalRaised: '',
    capitalSource: [],
    targetRaise: '',
    preparationStage: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    additionalNotes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'industry' || name === 'capitalSource') {
      // Handle multiple select
      const values = Array.from(e.target.selectedOptions, option => option.value);
      setFormData(prev => ({ ...prev, [name]: values }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create lead document
      const leadDoc = await addDoc(collection(db, 'leads'), {
        ...formData,
        status: 'new',
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        source: 'consultation_form',
        assignedTo: '',
        notes: [],
        followUpDate: null
      });

      // Create activity log
      await addDoc(collection(db, 'activity'), {
        type: 'lead',
        action: 'created',
        leadId: leadDoc.id,
        companyName: formData.companyName,
        timestamp: serverTimestamp(),
        description: `New consultation request from ${formData.companyName}`
      });

      setSubmitMessage({
        type: 'success',
        text: 'Thank you! We will contact you shortly to schedule your consultation.'
      });

      // Reset form
      setFormData({
        companyName: '',
        vision: '',
        industry: [],
        teamSize: '',
        revenueStatus: 'pre-revenue',
        annualRevenue: '',
        capitalRaised: '',
        capitalSource: [],
        targetRaise: '',
        preparationStage: '',
        contactName: '',
        email: '',
        phone: '',
        website: '',
        additionalNotes: ''
      });

    } catch (error) {
      console.error('Error submitting consultation form:', error);
      setSubmitMessage({
        type: 'error',
        text: 'There was an error submitting your request. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="consultation-container">
      <div className="page-header">
        <h1>Request a Free Consultation</h1>
        <p>Tell us about your startup and fundraising goals</p>
      </div>

      {submitMessage.text && (
        <div className={`message ${submitMessage.type}`}>
          {submitMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="consultation-form">
        <section>
          <h2>Company Information</h2>
          <div className="form-group">
            <label className="required-field">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="required-field">Company Vision</label>
            <textarea
              name="vision"
              value={formData.vision}
              onChange={handleChange}
              required
              placeholder="What does your company do?"
            />
          </div>

          <div className="form-group">
            <label className="required-field">Industry</label>
            <select
              multiple
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              required
            >
              <option value="SaaS">SaaS</option>
              <option value="Fintech">Fintech</option>
              <option value="Healthcare">Healthcare</option>
              <option value="E-commerce">E-commerce</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Hardware">Hardware</option>
              <option value="Consumer">Consumer</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Other">Other</option>
            </select>
            <span className="helper-text">Hold Ctrl/Cmd to select multiple</span>
          </div>
        </section>

        <section>
          <h2>Team & Traction</h2>
          <div className="form-group">
            <label className="required-field">Team Size</label>
            <input
              type="number"
              name="teamSize"
              value={formData.teamSize}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label className="required-field">Revenue Status</label>
            <select
              name="revenueStatus"
              value={formData.revenueStatus}
              onChange={handleChange}
              required
            >
              <option value="pre-revenue">Pre-revenue</option>
              <option value="post-revenue">Post-revenue</option>
            </select>
          </div>

          {formData.revenueStatus === 'post-revenue' && (
            <div className="form-group">
              <label>Annual Recurring Revenue (ARR)</label>
              <input
                type="text"
                name="annualRevenue"
                value={formData.annualRevenue}
                onChange={handleChange}
                placeholder="e.g. $100,000"
              />
            </div>
          )}
        </section>

        <section>
          <h2>Fundraising Information</h2>
          <div className="form-group">
            <label>Capital Previously Raised</label>
            <input
              type="text"
              name="capitalRaised"
              value={formData.capitalRaised}
              onChange={handleChange}
              placeholder="e.g. $500,000"
            />
          </div>

          <div className="form-group">
            <label>Source of Capital</label>
            <select
              multiple
              name="capitalSource"
              value={formData.capitalSource}
              onChange={handleChange}
            >
              <option value="bootstrapped">Bootstrapped</option>
              <option value="friends_family">Friends & Family</option>
              <option value="angel">Angel Investors</option>
              <option value="accelerator">Accelerator</option>
              <option value="venture_capital">Venture Capital</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="required-field">Target Raise Amount</label>
            <input
              type="text"
              name="targetRaise"
              value={formData.targetRaise}
              onChange={handleChange}
              required
              placeholder="e.g. $1,000,000"
            />
          </div>

          <div className="form-group">
            <label className="required-field">Preparation Stage</label>
            <select
              name="preparationStage"
              value={formData.preparationStage}
              onChange={handleChange}
              required
            >
              <option value="">Select stage</option>
              <option value="planning">Planning Phase</option>
              <option value="materials">Preparing Materials</option>
              <option value="ready">Ready to Pitch</option>
              <option value="active">Actively Pitching</option>
            </select>
          </div>
        </section>

        <section>
          <h2>Contact Information</h2>
          <div className="form-group">
            <label className="required-field">Contact Name</label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="required-field">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://"
            />
          </div>

          <div className="form-group">
            <label>Additional Notes</label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              placeholder="Any other information you'd like to share?"
            />
          </div>
        </section>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default ConsultationPage; 