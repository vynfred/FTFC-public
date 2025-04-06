import React, { useState } from 'react';
import { FaCheck, FaPhone, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';

const ConsultationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    employees: '',
    revenue: '',
    fundingType: '',
    fundingAmount: '',
    timeline: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.fundingType) {
      newErrors.fundingType = 'Please select a funding type';
    }
    
    if (!formData.timeline) {
      newErrors.timeline = 'Please select a timeline';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        employees: '',
        revenue: '',
        fundingType: '',
        fundingAmount: '',
        timeline: '',
        message: ''
      });
      
      setSubmitSuccess(true);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setErrors({ general: 'Failed to submit form. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="consultation-page">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Free Consultation</h1>
          <p className="page-subtitle">Schedule a free consultation with our financial experts to discuss your business funding needs.</p>
        </div>
      </section>
      
      <section className="consultation-section">
        <div className="container">
          {submitSuccess ? (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h2 className="success-title">Thank You for Your Request!</h2>
              <p className="success-text">
                We've received your consultation request and will contact you within 24 hours to schedule your free consultation.
              </p>
              <p className="success-text">
                In the meantime, feel free to explore our <a href="/services">services</a> or <a href="/blog">blog</a> for more information.
              </p>
            </div>
          ) : (
            <div className="consultation-grid">
              <div className="consultation-form-container">
                <div className="form-header">
                  <h2 className="form-title">Request Your Free Consultation</h2>
                  <p className="form-subtitle">Fill out the form below and we'll get back to you within 24 hours.</p>
                </div>
                
                {errors.general && (
                  <div className="error-message general-error">
                    {errors.general}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="consultation-form">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="Enter your full name" 
                      className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <div className="error-text">{errors.name}</div>}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        placeholder="Enter your email address" 
                        className={errors.email ? 'error' : ''}
                      />
                      {errors.email && <div className="error-text">{errors.email}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        placeholder="Enter your phone number" 
                        className={errors.phone ? 'error' : ''}
                      />
                      {errors.phone && <div className="error-text">{errors.phone}</div>}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="company">Company Name</label>
                    <input 
                      type="text" 
                      id="company" 
                      name="company" 
                      value={formData.company} 
                      onChange={handleChange} 
                      placeholder="Enter your company name" 
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="employees">Number of Employees</label>
                      <select 
                        id="employees" 
                        name="employees" 
                        value={formData.employees} 
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        <option value="1-10">1-10</option>
                        <option value="11-50">11-50</option>
                        <option value="51-200">51-200</option>
                        <option value="201-500">201-500</option>
                        <option value="500+">500+</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="revenue">Annual Revenue</label>
                      <select 
                        id="revenue" 
                        name="revenue" 
                        value={formData.revenue} 
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        <option value="Pre-revenue">Pre-revenue</option>
                        <option value="$0-$100K">$0-$100K</option>
                        <option value="$100K-$500K">$100K-$500K</option>
                        <option value="$500K-$1M">$500K-$1M</option>
                        <option value="$1M-$5M">$1M-$5M</option>
                        <option value="$5M+">$5M+</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="fundingType">Type of Funding Needed *</label>
                    <select 
                      id="fundingType" 
                      name="fundingType" 
                      value={formData.fundingType} 
                      onChange={handleChange}
                      className={errors.fundingType ? 'error' : ''}
                    >
                      <option value="">Select</option>
                      <option value="Startup Funding">Startup Funding</option>
                      <option value="Business Loan">Business Loan</option>
                      <option value="Venture Capital">Venture Capital</option>
                      <option value="Financial Consulting">Financial Consulting</option>
                      <option value="Investment Strategy">Investment Strategy</option>
                      <option value="Merger & Acquisition">Merger & Acquisition</option>
                      <option value="Not Sure">Not Sure</option>
                    </select>
                    {errors.fundingType && <div className="error-text">{errors.fundingType}</div>}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fundingAmount">Funding Amount Needed</label>
                      <select 
                        id="fundingAmount" 
                        name="fundingAmount" 
                        value={formData.fundingAmount} 
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        <option value="$10K-$50K">$10K-$50K</option>
                        <option value="$50K-$100K">$50K-$100K</option>
                        <option value="$100K-$500K">$100K-$500K</option>
                        <option value="$500K-$1M">$500K-$1M</option>
                        <option value="$1M-$5M">$1M-$5M</option>
                        <option value="$5M+">$5M+</option>
                        <option value="Not Sure">Not Sure</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="timeline">Timeline *</label>
                      <select 
                        id="timeline" 
                        name="timeline" 
                        value={formData.timeline} 
                        onChange={handleChange}
                        className={errors.timeline ? 'error' : ''}
                      >
                        <option value="">Select</option>
                        <option value="Immediately">Immediately</option>
                        <option value="1-3 months">1-3 months</option>
                        <option value="3-6 months">3-6 months</option>
                        <option value="6-12 months">6-12 months</option>
                        <option value="Not Sure">Not Sure</option>
                      </select>
                      {errors.timeline && <div className="error-text">{errors.timeline}</div>}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Additional Information</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      placeholder="Tell us more about your business and funding needs" 
                      rows="5"
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Request Consultation'}
                  </button>
                </form>
              </div>
              
              <div className="consultation-info">
                <div className="info-section">
                  <h2 className="info-title">Why Choose FTFC?</h2>
                  <ul className="benefits-list">
                    <li className="benefit-item">
                      <FaCheck className="benefit-icon" />
                      <span>Personalized funding solutions tailored to your business needs</span>
                    </li>
                    <li className="benefit-item">
                      <FaCheck className="benefit-icon" />
                      <span>Access to a network of investors, lenders, and financial institutions</span>
                    </li>
                    <li className="benefit-item">
                      <FaCheck className="benefit-icon" />
                      <span>Expert guidance from experienced financial advisors</span>
                    </li>
                    <li className="benefit-item">
                      <FaCheck className="benefit-icon" />
                      <span>Transparent process with no hidden fees</span>
                    </li>
                    <li className="benefit-item">
                      <FaCheck className="benefit-icon" />
                      <span>Ongoing support throughout your funding journey</span>
                    </li>
                  </ul>
                </div>
                
                <div className="info-section">
                  <h2 className="info-title">What to Expect</h2>
                  <ol className="steps-list">
                    <li className="step-item">
                      <div className="step-number">1</div>
                      <div className="step-content">
                        <h3 className="step-title">Initial Consultation</h3>
                        <p className="step-description">
                          We'll discuss your business, goals, and funding needs to understand your specific situation.
                        </p>
                      </div>
                    </li>
                    <li className="step-item">
                      <div className="step-number">2</div>
                      <div className="step-content">
                        <h3 className="step-title">Funding Strategy</h3>
                        <p className="step-description">
                          Our team will develop a customized funding strategy based on your business requirements.
                        </p>
                      </div>
                    </li>
                    <li className="step-item">
                      <div className="step-number">3</div>
                      <div className="step-content">
                        <h3 className="step-title">Implementation</h3>
                        <p className="step-description">
                          We'll guide you through the funding process, connecting you with the right financial partners.
                        </p>
                      </div>
                    </li>
                    <li className="step-item">
                      <div className="step-number">4</div>
                      <div className="step-content">
                        <h3 className="step-title">Ongoing Support</h3>
                        <p className="step-description">
                          Our relationship doesn't end once you secure funding. We provide continued support for your business growth.
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>
                
                <div className="info-section">
                  <h2 className="info-title">Contact Us Directly</h2>
                  <div className="contact-methods">
                    <div className="contact-method">
                      <div className="contact-icon">
                        <FaPhone />
                      </div>
                      <div className="contact-details">
                        <h3 className="contact-title">Phone</h3>
                        <p className="contact-value">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <div className="contact-method">
                      <div className="contact-icon">
                        <FaEnvelope />
                      </div>
                      <div className="contact-details">
                        <h3 className="contact-title">Email</h3>
                        <p className="contact-value">consultation@ftfc.com</p>
                      </div>
                    </div>
                    <div className="contact-method">
                      <div className="contact-icon">
                        <FaCalendarAlt />
                      </div>
                      <div className="contact-details">
                        <h3 className="contact-title">Office Hours</h3>
                        <p className="contact-value">Monday - Friday: 9:00 AM - 5:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      
      <style jsx>{`
        .consultation-page {
          padding-top: 80px;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .page-header {
          background-color: #0f172a;
          padding: 80px 0;
          text-align: center;
          color: #ffffff;
        }
        
        .page-title {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 16px;
        }
        
        .page-subtitle {
          font-size: 20px;
          color: #94a3b8;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .consultation-section {
          padding: 80px 0;
          background-color: #ffffff;
        }
        
        .consultation-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
        }
        
        .consultation-form-container {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .form-header {
          margin-bottom: 30px;
        }
        
        .form-title {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 8px 0;
        }
        
        .form-subtitle {
          color: #64748b;
          margin: 0;
        }
        
        .general-error {
          background-color: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 16px;
          border-radius: 4px;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #0f172a;
          font-weight: 500;
        }
        
        input, select, textarea {
          width: 100%;
          padding: 12px;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          color: #0f172a;
          font-size: 16px;
          transition: border-color 0.2s ease;
        }
        
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #f59e0b;
        }
        
        input.error, select.error, textarea.error {
          border-color: #ef4444;
        }
        
        .error-text {
          color: #ef4444;
          font-size: 14px;
          margin-top: 4px;
        }
        
        textarea {
          resize: vertical;
        }
        
        .submit-button {
          width: 100%;
          padding: 14px;
          background-color: #f59e0b;
          color: #ffffff;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .submit-button:hover {
          background-color: #d97706;
        }
        
        .submit-button:disabled {
          background-color: #94a3b8;
          cursor: not-allowed;
        }
        
        .consultation-info {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        
        .info-section {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .info-title {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 20px 0;
          padding-bottom: 10px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .benefits-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .benefit-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        
        .benefit-icon {
          color: #10b981;
          margin-right: 12px;
          margin-top: 4px;
        }
        
        .steps-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .step-item {
          display: flex;
          margin-bottom: 20px;
        }
        
        .step-number {
          width: 30px;
          height: 30px;
          background-color: #f59e0b;
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          margin-right: 16px;
          flex-shrink: 0;
        }
        
        .step-title {
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 8px 0;
        }
        
        .step-description {
          color: #64748b;
          margin: 0;
          line-height: 1.6;
        }
        
        .contact-methods {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .contact-method {
          display: flex;
          align-items: center;
        }
        
        .contact-icon {
          width: 40px;
          height: 40px;
          background-color: rgba(245, 158, 11, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f59e0b;
          margin-right: 16px;
        }
        
        .contact-title {
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 4px 0;
        }
        
        .contact-value {
          color: #64748b;
          margin: 0;
        }
        
        .success-message {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 60px;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .success-icon {
          width: 80px;
          height: 80px;
          background-color: #10b981;
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          margin: 0 auto 30px;
        }
        
        .success-title {
          font-size: 28px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 20px 0;
        }
        
        .success-text {
          color: #64748b;
          font-size: 18px;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        
        .success-text a {
          color: #f59e0b;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        
        .success-text a:hover {
          color: #d97706;
        }
        
        @media (max-width: 768px) {
          .page-title {
            font-size: 36px;
          }
          
          .consultation-grid {
            grid-template-columns: 1fr;
          }
          
          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
          
          .consultation-form-container,
          .info-section {
            padding: 30px 20px;
          }
          
          .success-message {
            padding: 40px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default ConsultationPage;
