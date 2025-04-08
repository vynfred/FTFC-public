import React from 'react';
import ContentSection from './ContentSection';
import TextField from './TextField';
import ArrayField from './ArrayField';

/**
 * PrivacyContent component for editing the privacy policy page content
 */
const PrivacyContent = ({ data, onFieldChange, onArrayFieldChange, onAddArrayItem, onRemoveArrayItem }) => {
  // Handle text field change
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    onFieldChange(name, value);
  };
  
  // Handle section change
  const handleSectionChange = (index, field, value) => {
    onArrayFieldChange('sections', index, field, value);
  };
  
  // Add section
  const addSection = () => {
    onAddArrayItem('sections', {
      title: '',
      content: ''
    });
  };
  
  return (
    <div className="content-section">
      <h3>Privacy Policy Page Content</h3>
      
      <ContentSection title="Page Header">
        <TextField 
          name="pageTitle" 
          label="Page Title" 
          value={data.pageTitle || ''} 
          onChange={handleTextChange}
        />
        <TextField 
          name="lastUpdated" 
          label="Last Updated Date (YYYY-MM-DD)" 
          value={data.lastUpdated || ''} 
          onChange={handleTextChange}
        />
      </ContentSection>

      <ContentSection title="Privacy Policy Sections">
        <ArrayField 
          name="sections"
          items={data.sections || []}
          onAdd={addSection}
          onRemove={(name, index) => onRemoveArrayItem(name, index)}
          addLabel="Add Section"
        >
          {(field, index) => (
            <div className="section-item">
              <TextField 
                name={`${field}-title`}
                label="Section Title" 
                value={data.sections[index]?.title || ''} 
                onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
              />
              <TextField 
                name={`${field}-content`}
                label="Section Content" 
                value={data.sections[index]?.content || ''} 
                onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                multiline
              />
            </div>
          )}
        </ArrayField>
      </ContentSection>
    </div>
  );
};

export default PrivacyContent;
