import React from 'react';
import ContentSection from './ContentSection';
import TextField from './TextField';
import ImageUpload from './ImageUpload';
import ArrayField from './ArrayField';

/**
 * AboutContent component for editing the about page content
 */
const AboutContent = ({ data, onFieldChange, onArrayFieldChange, onAddArrayItem, onRemoveArrayItem }) => {
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
  
  // Handle value proposition change
  const handleValueChange = (index, field, value) => {
    onArrayFieldChange('valuePropositions', index, field, value);
  };
  
  // Add value proposition
  const addValueProposition = () => {
    onAddArrayItem('valuePropositions', {
      title: '',
      description: ''
    });
  };
  
  return (
    <div className="content-section">
      <h3>About Page Content</h3>
      
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

      <ContentSection title="Company Story">
        <TextField 
          name="companyStory" 
          label="Company Story" 
          value={data.companyStory || ''} 
          onChange={handleTextChange}
          multiline
        />
        <ImageUpload 
          name="storyImage" 
          label="Story Image" 
          value={data.storyImage} 
          onChange={handleImageChange}
        />
      </ContentSection>

      <ContentSection title="Mission & Vision">
        <TextField 
          name="missionStatement" 
          label="Mission Statement" 
          value={data.missionStatement || ''} 
          onChange={handleTextChange}
          multiline
        />
        <TextField 
          name="visionStatement" 
          label="Vision Statement" 
          value={data.visionStatement || ''} 
          onChange={handleTextChange}
          multiline
        />
      </ContentSection>

      <ContentSection title="Core Values">
        <ArrayField 
          name="valuePropositions"
          items={data.valuePropositions || []}
          onAdd={addValueProposition}
          onRemove={(name, index) => onRemoveArrayItem(name, index)}
          addLabel="Add Value"
        >
          {(field, index) => (
            <div className="value-item">
              <TextField 
                name={`${field}-title`}
                label="Value Title" 
                value={data.valuePropositions[index]?.title || ''} 
                onChange={(e) => handleValueChange(index, 'title', e.target.value)}
              />
              <TextField 
                name={`${field}-description`}
                label="Value Description" 
                value={data.valuePropositions[index]?.description || ''} 
                onChange={(e) => handleValueChange(index, 'description', e.target.value)}
                multiline
              />
            </div>
          )}
        </ArrayField>
      </ContentSection>
    </div>
  );
};

export default AboutContent;
