import React, { useState } from 'react';
import { FaEnvelope, FaPhone } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
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
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
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
        message: ''
      });

      setSubmitSuccess(true);

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      setErrors({ general: 'Failed to send message. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Contact Us</h1>
          <p className="page-subtitle">Get in touch with our team to discuss your business needs.</p>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2 className="section-title">Get In Touch</h2>
              <p className="contact-description">
                Have questions about our services or want to schedule a consultation? Reach out to us using the contact information below or fill out the form.
              </p>

              <div className="info-items">
                <div className="info-item">
                  <div className="info-icon">
                    <FaPhone />
                  </div>
                  <div className="info-content">
                    <h3 className="info-title">Phone</h3>
                    <p className="info-text">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <FaEnvelope />
                  </div>
                  <div className="info-content">
                    <h3 className="info-title">Email</h3>
                    <p className="info-text">info@ftfc.com</p>
                  </div>
                </div>


              </div>
            </div>

            <div className="contact-form-container">
              <div className="form-header">
                <h2 className="form-title">Send Us a Message</h2>
                <p className="form-subtitle">Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>

              {submitSuccess && (
                <div className="success-message">
                  <p>Your message has been sent successfully! We'll get back to you soon.</p>
                </div>
              )}

              {errors.general && (
                <div className="error-message general-error">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
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
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
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

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    rows="5"
                    className={errors.message ? 'error' : ''}
                  ></textarea>
                  {errors.message && <div className="error-text">{errors.message}</div>}
                </div>

                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .contact-page {
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

        .contact-section {
          padding: 80px 0;
          background-color: #ffffff;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
        }

        .section-title {
          font-size: 36px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 20px;
        }

        .contact-description {
          color: #64748b;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .info-items {
          margin-bottom: 40px;
        }

        .info-item {
          display: flex;
          margin-bottom: 24px;
        }

        .info-icon {
          width: 50px;
          height: 50px;
          background-color: rgba(245, 158, 11, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f59e0b;
          font-size: 20px;
          margin-right: 16px;
        }

        .info-title {
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 8px 0;
        }

        .info-text {
          color: #64748b;
          margin: 0;
        }

        .map-container {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .contact-form-container {
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

        .success-message {
          background-color: rgba(16, 185, 129, 0.1);
          color: #10b981;
          padding: 16px;
          border-radius: 4px;
          margin-bottom: 20px;
          text-align: center;
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

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #0f172a;
          font-weight: 500;
        }

        input, textarea {
          width: 100%;
          padding: 12px;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          color: #0f172a;
          font-size: 16px;
          transition: border-color 0.2s ease;
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: #f59e0b;
        }

        input.error, textarea.error {
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

        @media (max-width: 768px) {
          .page-title {
            font-size: 36px;
          }

          .contact-grid {
            grid-template-columns: 1fr;
          }

          .section-title {
            font-size: 30px;
          }

          .contact-form-container {
            padding: 30px;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;
