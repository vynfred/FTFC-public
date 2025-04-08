import React, { useState, useEffect } from 'react';
import { FaUser, FaBuilding, FaPhone, FaEnvelope, FaBriefcase, FaTags, FaSave, FaTimes } from 'react-icons/fa';
import './ContactForm.css';

/**
 * Contact Form Component
 * 
 * A reusable form for adding and editing contacts.
 * Supports association with companies, investment firms, and partner firms.
 */
const ContactForm = ({ 
  contact = null, 
  onSubmit, 
  onCancel,
  companies = [],
  investmentFirms = [],
  partnerFirms = []
}) => {
  // Initialize form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    bio: '',
    keywords: [],
    keyTerms: [],
    notes: '',
    isPrimary: false,
    associations: {
      companies: [],
      investmentFirms: [],
      partnerFirms: []
    }
  });
  
  // Form validation state
  const [errors, setErrors] = useState({});
  
  // Keyword input state
  const [keywordInput, setKeywordInput] = useState('');
  const [keyTermInput, setKeyTermInput] = useState('');
  
  // Association selection states
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCompanyRole, setSelectedCompanyRole] = useState('');
  const [selectedCompanyIsPrimary, setSelectedCompanyIsPrimary] = useState(false);
  
  const [selectedFirm, setSelectedFirm] = useState('');
  const [selectedFirmRole, setSelectedFirmRole] = useState('');
  const [selectedFirmIsPrimary, setSelectedFirmIsPrimary] = useState(false);
  
  const [selectedPartnerFirm, setSelectedPartnerFirm] = useState('');
  const [selectedPartnerFirmRole, setSelectedPartnerFirmRole] = useState('');
  const [selectedPartnerFirmIsPrimary, setSelectedPartnerFirmIsPrimary] = useState(false);
  
  // Initialize form with contact data if editing
  useEffect(() => {
    if (contact) {
      setFormData({
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
        email: contact.email || '',
        phone: contact.phone || '',
        title: contact.title || '',
        bio: contact.bio || '',
        keywords: contact.keywords || [],
        keyTerms: contact.keyTerms || [],
        notes: contact.notes || '',
        isPrimary: contact.isPrimary || false,
        associations: {
          companies: contact.associations?.companies || [],
          investmentFirms: contact.associations?.investmentFirms || [],
          partnerFirms: contact.associations?.partnerFirms || []
        }
      });
    }
  }, [contact]);
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Add keyword
  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };
  
  // Remove keyword
  const handleRemoveKeyword = (keyword) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };
  
  // Add key term
  const handleAddKeyTerm = () => {
    if (keyTermInput.trim()) {
      setFormData(prev => ({
        ...prev,
        keyTerms: [...prev.keyTerms, keyTermInput.trim()]
      }));
      setKeyTermInput('');
    }
  };
  
  // Remove key term
  const handleRemoveKeyTerm = (term) => {
    setFormData(prev => ({
      ...prev,
      keyTerms: prev.keyTerms.filter(t => t !== term)
    }));
  };
  
  // Add company association
  const handleAddCompany = () => {
    if (selectedCompany) {
      const companyExists = formData.associations.companies.some(
        company => company.companyId === selectedCompany
      );
      
      if (!companyExists) {
        setFormData(prev => ({
          ...prev,
          associations: {
            ...prev.associations,
            companies: [
              ...prev.associations.companies,
              {
                companyId: selectedCompany,
                role: selectedCompanyRole,
                isPrimary: selectedCompanyIsPrimary
              }
            ]
          }
        }));
        
        // Reset selection
        setSelectedCompany('');
        setSelectedCompanyRole('');
        setSelectedCompanyIsPrimary(false);
      }
    }
  };
  
  // Remove company association
  const handleRemoveCompany = (companyId) => {
    setFormData(prev => ({
      ...prev,
      associations: {
        ...prev.associations,
        companies: prev.associations.companies.filter(
          company => company.companyId !== companyId
        )
      }
    }));
  };
  
  // Add investment firm association
  const handleAddFirm = () => {
    if (selectedFirm) {
      const firmExists = formData.associations.investmentFirms.some(
        firm => firm.firmId === selectedFirm
      );
      
      if (!firmExists) {
        setFormData(prev => ({
          ...prev,
          associations: {
            ...prev.associations,
            investmentFirms: [
              ...prev.associations.investmentFirms,
              {
                firmId: selectedFirm,
                role: selectedFirmRole,
                isPrimary: selectedFirmIsPrimary
              }
            ]
          }
        }));
        
        // Reset selection
        setSelectedFirm('');
        setSelectedFirmRole('');
        setSelectedFirmIsPrimary(false);
      }
    }
  };
  
  // Remove investment firm association
  const handleRemoveFirm = (firmId) => {
    setFormData(prev => ({
      ...prev,
      associations: {
        ...prev.associations,
        investmentFirms: prev.associations.investmentFirms.filter(
          firm => firm.firmId !== firmId
        )
      }
    }));
  };
  
  // Add partner firm association
  const handleAddPartnerFirm = () => {
    if (selectedPartnerFirm) {
      const firmExists = formData.associations.partnerFirms.some(
        firm => firm.firmId === selectedPartnerFirm
      );
      
      if (!firmExists) {
        setFormData(prev => ({
          ...prev,
          associations: {
            ...prev.associations,
            partnerFirms: [
              ...prev.associations.partnerFirms,
              {
                firmId: selectedPartnerFirm,
                role: selectedPartnerFirmRole,
                isPrimary: selectedPartnerFirmIsPrimary
              }
            ]
          }
        }));
        
        // Reset selection
        setSelectedPartnerFirm('');
        setSelectedPartnerFirmRole('');
        setSelectedPartnerFirmIsPrimary(false);
      }
    }
  };
  
  // Remove partner firm association
  const handleRemovePartnerFirm = (firmId) => {
    setFormData(prev => ({
      ...prev,
      associations: {
        ...prev.associations,
        partnerFirms: prev.associations.partnerFirms.filter(
          firm => firm.firmId !== firmId
        )
      }
    }));
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>{contact ? 'Edit Contact' : 'Add Contact'}</h2>
      </div>
      
      <div className="form-section">
        <h3>Basic Information</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">
              <FaUser /> First Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? 'error' : ''}
            />
            {errors.firstName && <div className="error-message">{errors.firstName}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">
              <FaUser /> Last Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? 'error' : ''}
            />
            {errors.lastName && <div className="error-message">{errors.lastName}</div>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope /> Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">
              <FaPhone /> Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">
              <FaBriefcase /> Job Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
        </div>
      </div>
      
      <div className="form-section">
        <h3>Keywords & Terms</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="keywordInput">
              <FaTags /> Keywords
            </label>
            <div className="input-with-button">
              <input
                type="text"
                id="keywordInput"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="Add keyword"
              />
              <button 
                type="button" 
                onClick={handleAddKeyword}
                className="add-button"
              >
                Add
              </button>
            </div>
            
            <div className="tags-container">
              {formData.keywords.map((keyword, index) => (
                <div key={index} className="tag">
                  {keyword}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="remove-tag"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="keyTermInput">
              <FaTags /> Key Terms
            </label>
            <div className="input-with-button">
              <input
                type="text"
                id="keyTermInput"
                value={keyTermInput}
                onChange={(e) => setKeyTermInput(e.target.value)}
                placeholder="Add key term"
              />
              <button 
                type="button" 
                onClick={handleAddKeyTerm}
                className="add-button"
              >
                Add
              </button>
            </div>
            
            <div className="tags-container">
              {formData.keyTerms.map((term, index) => (
                <div key={index} className="tag">
                  {term}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveKeyTerm(term)}
                    className="remove-tag"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="form-section">
        <h3>Company Associations</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="selectedCompany">
              <FaBuilding /> Company
            </label>
            <select
              id="selectedCompany"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="">Select a company</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="selectedCompanyRole">Role</label>
            <input
              type="text"
              id="selectedCompanyRole"
              value={selectedCompanyRole}
              onChange={(e) => setSelectedCompanyRole(e.target.value)}
              placeholder="e.g. CEO, CTO"
            />
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={selectedCompanyIsPrimary}
                onChange={(e) => setSelectedCompanyIsPrimary(e.target.checked)}
              />
              Primary Contact
            </label>
          </div>
          
          <div className="form-group button-group">
            <button 
              type="button" 
              onClick={handleAddCompany}
              className="add-button"
              disabled={!selectedCompany}
            >
              Add
            </button>
          </div>
        </div>
        
        {formData.associations.companies.length > 0 && (
          <div className="associations-table">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Primary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.associations.companies.map((company, index) => {
                  const companyData = companies.find(c => c.id === company.companyId);
                  return (
                    <tr key={index}>
                      <td>{companyData ? companyData.name : company.companyId}</td>
                      <td>{company.role}</td>
                      <td>{company.isPrimary ? 'Yes' : 'No'}</td>
                      <td>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveCompany(company.companyId)}
                          className="remove-button"
                        >
                          <FaTimes />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="form-section">
        <h3>Investment Firm Associations</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="selectedFirm">
              <FaBuilding /> Investment Firm
            </label>
            <select
              id="selectedFirm"
              value={selectedFirm}
              onChange={(e) => setSelectedFirm(e.target.value)}
            >
              <option value="">Select a firm</option>
              {investmentFirms.map(firm => (
                <option key={firm.id} value={firm.id}>
                  {firm.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="selectedFirmRole">Role</label>
            <input
              type="text"
              id="selectedFirmRole"
              value={selectedFirmRole}
              onChange={(e) => setSelectedFirmRole(e.target.value)}
              placeholder="e.g. Partner, Associate"
            />
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={selectedFirmIsPrimary}
                onChange={(e) => setSelectedFirmIsPrimary(e.target.checked)}
              />
              Primary Contact
            </label>
          </div>
          
          <div className="form-group button-group">
            <button 
              type="button" 
              onClick={handleAddFirm}
              className="add-button"
              disabled={!selectedFirm}
            >
              Add
            </button>
          </div>
        </div>
        
        {formData.associations.investmentFirms.length > 0 && (
          <div className="associations-table">
            <table>
              <thead>
                <tr>
                  <th>Firm</th>
                  <th>Role</th>
                  <th>Primary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.associations.investmentFirms.map((firm, index) => {
                  const firmData = investmentFirms.find(f => f.id === firm.firmId);
                  return (
                    <tr key={index}>
                      <td>{firmData ? firmData.name : firm.firmId}</td>
                      <td>{firm.role}</td>
                      <td>{firm.isPrimary ? 'Yes' : 'No'}</td>
                      <td>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveFirm(firm.firmId)}
                          className="remove-button"
                        >
                          <FaTimes />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="form-section">
        <h3>Partner Firm Associations</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="selectedPartnerFirm">
              <FaBuilding /> Partner Firm
            </label>
            <select
              id="selectedPartnerFirm"
              value={selectedPartnerFirm}
              onChange={(e) => setSelectedPartnerFirm(e.target.value)}
            >
              <option value="">Select a firm</option>
              {partnerFirms.map(firm => (
                <option key={firm.id} value={firm.id}>
                  {firm.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="selectedPartnerFirmRole">Role</label>
            <input
              type="text"
              id="selectedPartnerFirmRole"
              value={selectedPartnerFirmRole}
              onChange={(e) => setSelectedPartnerFirmRole(e.target.value)}
              placeholder="e.g. Partner, Associate"
            />
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={selectedPartnerFirmIsPrimary}
                onChange={(e) => setSelectedPartnerFirmIsPrimary(e.target.checked)}
              />
              Primary Contact
            </label>
          </div>
          
          <div className="form-group button-group">
            <button 
              type="button" 
              onClick={handleAddPartnerFirm}
              className="add-button"
              disabled={!selectedPartnerFirm}
            >
              Add
            </button>
          </div>
        </div>
        
        {formData.associations.partnerFirms.length > 0 && (
          <div className="associations-table">
            <table>
              <thead>
                <tr>
                  <th>Firm</th>
                  <th>Role</th>
                  <th>Primary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.associations.partnerFirms.map((firm, index) => {
                  const firmData = partnerFirms.find(f => f.id === firm.firmId);
                  return (
                    <tr key={index}>
                      <td>{firmData ? firmData.name : firm.firmId}</td>
                      <td>{firm.role}</td>
                      <td>{firm.isPrimary ? 'Yes' : 'No'}</td>
                      <td>
                        <button 
                          type="button" 
                          onClick={() => handleRemovePartnerFirm(firm.firmId)}
                          className="remove-button"
                        >
                          <FaTimes />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="form-section">
        <h3>Notes</h3>
        
        <div className="form-row">
          <div className="form-group full-width">
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Add any additional notes about this contact"
            ></textarea>
          </div>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel-button">
          <FaTimes /> Cancel
        </button>
        <button type="submit" className="submit-button">
          <FaSave /> {contact ? 'Update Contact' : 'Create Contact'}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
