import React from 'react';
import ContentSection from './ContentSection';
import TextField from './TextField';
import ImageUpload from './ImageUpload';
import ArrayField from './ArrayField';

/**
 * ContactContent component for editing the contact page content
 */
const ContactContent = ({ data, onFieldChange, onArrayFieldChange, onAddArrayItem, onRemoveArrayItem }) => {
  // Handle text field change
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    onFieldChange(name, value);
  };
  
  // Handle image upload
  const handleImageChange = (e) => {
    const { name, value } = e.target;
    onFieldChange(name, value);
  };
  
  // Handle office location change
  const handleLocationChange = (index, field, value) => {
    onArrayFieldChange('officeLocations', index, field, value);
  };
  
  // Add office location
  const addOfficeLocation = () => {
    onAddArrayItem('officeLocations', {
      city: '',
      address: '',
      phone: '',
      email: ''
    });
  };
  
  return (
    <div className="content-section">
      <h3>Contact Page Content</h3>
      
      <ContentSection title="Page Header">
        <TextField 
          name="pageTitle" 
          label="Page Title" 
          value={data.pageTitle || ''} 
          onChange={handleTextChange}
        />
        <TextField 
          name="pageSubtitle" 
          label="Page Subtitle" 
          value={data.pageSubtitle || ''} 
          onChange={handleTextChange}
          multiline
        />
        <ImageUpload 
          name="headerImage" 
          label="Header Image" 
          value={data.headerImage} 
          onChange={handleImageChange}
        />
      </ContentSection>

      <ContentSection title="Office Locations">
        <ArrayField 
          name="officeLocations"
          items={data.officeLocations || []}
          onAdd={addOfficeLocation}
          onRemove={(name, index) => onRemoveArrayItem(name, index)}
          addLabel="Add Office Location"
        >
          {(field, index) => (
            <div className="location-item">
              <TextField 
                name={`${field}-city`}
                label="City" 
                value={data.officeLocations[index]?.city || ''} 
                onChange={(e) => handleLocationChange(index, 'city', e.target.value)}
              />
              <TextField 
                name={`${field}-address`}
                label="Address" 
                value={data.officeLocations[index]?.address || ''} 
                onChange={(e) => handleLocationChange(index, 'address', e.target.value)}
                multiline
              />
              <div className="field-row">
                <TextField 
                  name={`${field}-phone`}
                  label="Phone" 
                  value={data.officeLocations[index]?.phone || ''} 
                  onChange={(e) => handleLocationChange(index, 'phone', e.target.value)}
                />
                <TextField 
                  name={`${field}-email`}
                  label="Email" 
                  value={data.officeLocations[index]?.email || ''} 
                  onChange={(e) => handleLocationChange(index, 'email', e.target.value)}
                />
              </div>
              <ImageUpload 
                name={`${field}-image`}
                label="Office Image" 
                value={data.officeLocations[index]?.image} 
                onChange={(e) => handleLocationChange(index, 'image', e.target.value)}
              />
            </div>
          )}
        </ArrayField>
      </ContentSection>

      <ContentSection title="Contact Form">
        <TextField 
          name="contactFormTitle" 
          label="Contact Form Title" 
          value={data.contactFormTitle || ''} 
          onChange={handleTextChange}
        />
        <TextField 
          name="contactFormSubtitle" 
          label="Contact Form Subtitle" 
          value={data.contactFormSubtitle || ''} 
          onChange={handleTextChange}
          multiline
        />
      </ContentSection>
      
      <style jsx>{`
        .field-row {
          display: flex;
          gap: 16px;
        }
        
        @media (max-width: 768px) {
          .field-row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactContent;
