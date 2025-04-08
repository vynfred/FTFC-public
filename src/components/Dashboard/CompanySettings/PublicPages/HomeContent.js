import React from 'react';
import ArrayField from './ArrayField';
import ContentSection from './ContentSection';
import './HomeContent.css';
import ImageUpload from './ImageUpload';
import TextField from './TextField';

/**
 * HomeContent component for editing the home page content
 */
const HomeContent = ({ data, onFieldChange, onArrayFieldChange, onAddArrayItem, onRemoveArrayItem }) => {
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

  // Handle service highlight change
  const handleServiceChange = (index, field, value) => {
    onArrayFieldChange('serviceHighlights', index, field, value);
  };

  // Handle benefit change
  const handleBenefitChange = (index, value) => {
    onArrayFieldChange('benefits', index, 'text', value);
  };

  // Add service highlight
  const addServiceHighlight = () => {
    onAddArrayItem('serviceHighlights', {
      title: '',
      description: '',
      icon: null
    });
  };

  // Add benefit
  const addBenefit = () => {
    onAddArrayItem('benefits', { text: '' });
  };

  return (
    <div className="content-section">
      <h3>Home Page Content</h3>

      <ContentSection title="Hero Section">
        <TextField
          name="heroTitle"
          label="Main Headline"
          value={data.heroTitle || ''}
          onChange={handleTextChange}
        />
        <TextField
          name="heroSubtitle"
          label="Subtitle"
          value={data.heroSubtitle || ''}
          onChange={handleTextChange}
          multiline
        />
        <ImageUpload
          name="heroImage"
          label="Hero Image"
          value={data.heroImage}
          onChange={handleImageChange}
        />
        <div className="field-row">
          <TextField
            name="ctaText"
            label="CTA Button Text"
            value={data.ctaText || ''}
            onChange={handleTextChange}
          />
          <TextField
            name="ctaLink"
            label="CTA Button Link"
            value={data.ctaLink || ''}
            onChange={handleTextChange}
          />
        </div>
      </ContentSection>

      <ContentSection title="Services Overview">
        <ArrayField
          name="serviceHighlights"
          items={data.serviceHighlights || []}
          onAdd={addServiceHighlight}
          onRemove={(name, index) => onRemoveArrayItem(name, index)}
          addLabel="Add Service"
        >
          {(field, index) => (
            <div className="service-item">
              <TextField
                name={`${field}-title`}
                label="Service Title"
                value={data.serviceHighlights[index]?.title || ''}
                onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
              />
              <TextField
                name={`${field}-description`}
                label="Short Description"
                value={data.serviceHighlights[index]?.description || ''}
                onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                multiline
              />
              <ImageUpload
                name={`${field}-icon`}
                label="Service Icon"
                value={data.serviceHighlights[index]?.icon}
                onChange={(e) => handleServiceChange(index, 'icon', e.target.value)}
              />
            </div>
          )}
        </ArrayField>
      </ContentSection>

      <ContentSection title="Why Choose Us">
        <TextField
          name="whyUsTitle"
          label="Section Title"
          value={data.whyUsTitle || ''}
          onChange={handleTextChange}
        />
        <TextField
          name="whyUsDescription"
          label="Section Description"
          value={data.whyUsDescription || ''}
          onChange={handleTextChange}
          multiline
        />
        <ArrayField
          name="benefits"
          items={data.benefits || []}
          onAdd={addBenefit}
          onRemove={(name, index) => onRemoveArrayItem(name, index)}
          addLabel="Add Benefit"
        >
          {(field, index) => (
            <TextField
              name={`${field}-text`}
              label={`Benefit ${index + 1}`}
              value={data.benefits[index]?.text || ''}
              onChange={(e) => handleBenefitChange(index, e.target.value)}
            />
          )}
        </ArrayField>
      </ContentSection>


    </div>
  );
};

export default HomeContent;
