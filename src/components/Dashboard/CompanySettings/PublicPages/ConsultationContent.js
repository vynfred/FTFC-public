import React from 'react';
import ContentSection from './ContentSection';
import TextField from './TextField';
import ImageUpload from './ImageUpload';
import ArrayField from './ArrayField';

/**
 * ConsultationContent component for editing the consultation page content
 */
const ConsultationContent = ({ data, onFieldChange, onArrayFieldChange, onAddArrayItem, onRemoveArrayItem }) => {
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
  
  // Handle consultation step change
  const handleStepChange = (index, field, value) => {
    onArrayFieldChange('consultationSteps', index, field, value);
  };
  
  // Add consultation step
  const addConsultationStep = () => {
    onAddArrayItem('consultationSteps', {
      title: '',
      description: ''
    });
  };
  
  return (
    <div className="content-section">
      <h3>Consultation Page Content</h3>
      
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

      <ContentSection title="Consultation Process">
        <ArrayField 
          name="consultationSteps"
          items={data.consultationSteps || []}
          onAdd={addConsultationStep}
          onRemove={(name, index) => onRemoveArrayItem(name, index)}
          addLabel="Add Process Step"
        >
          {(field, index) => (
            <div className="step-item">
              <TextField 
                name={`${field}-title`}
                label={`Step ${index + 1} Title`} 
                value={data.consultationSteps[index]?.title || ''} 
                onChange={(e) => handleStepChange(index, 'title', e.target.value)}
              />
              <TextField 
                name={`${field}-description`}
                label={`Step ${index + 1} Description`} 
                value={data.consultationSteps[index]?.description || ''} 
                onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                multiline
              />
              <ImageUpload 
                name={`${field}-icon`}
                label="Step Icon" 
                value={data.consultationSteps[index]?.icon} 
                onChange={(e) => handleStepChange(index, 'icon', e.target.value)}
              />
            </div>
          )}
        </ArrayField>
      </ContentSection>

      <ContentSection title="Consultation Form">
        <TextField 
          name="formTitle" 
          label="Form Title" 
          value={data.formTitle || ''} 
          onChange={handleTextChange}
        />
        <TextField 
          name="formSubtitle" 
          label="Form Subtitle" 
          value={data.formSubtitle || ''} 
          onChange={handleTextChange}
          multiline
        />
      </ContentSection>
    </div>
  );
};

export default ConsultationContent;
