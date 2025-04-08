import React from 'react';
import ArrayField from './ArrayField';
import ContentSection from './ContentSection';
import ImageUpload from './ImageUpload';
import './ServicesContent.css';
import TextField from './TextField';

/**
 * ServicesContent component for editing the services page content
 */
const ServicesContent = ({ data, onFieldChange, onArrayFieldChange, onAddArrayItem, onRemoveArrayItem }) => {
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

  // Handle service category change
  const handleCategoryChange = (index, field, value) => {
    onArrayFieldChange('serviceCategories', index, field, value);
  };

  // Handle service change within a category
  const handleServiceChange = (categoryIndex, serviceIndex, field, value) => {
    const updatedServices = [...data.serviceCategories[categoryIndex].services];
    updatedServices[serviceIndex] = {
      ...updatedServices[serviceIndex],
      [field]: value
    };

    handleCategoryChange(categoryIndex, 'services', updatedServices);
  };

  // Add service category
  const addServiceCategory = () => {
    onAddArrayItem('serviceCategories', {
      title: '',
      services: []
    });
  };

  // Add service to category
  const addService = (categoryIndex) => {
    const updatedCategories = [...data.serviceCategories];
    updatedCategories[categoryIndex].services.push({
      title: '',
      description: '',
      icon: null
    });

    onFieldChange('serviceCategories', updatedCategories);
  };

  // Remove service from category
  const removeService = (categoryIndex, serviceIndex) => {
    const updatedCategories = [...data.serviceCategories];
    updatedCategories[categoryIndex].services.splice(serviceIndex, 1);

    onFieldChange('serviceCategories', updatedCategories);
  };

  return (
    <div className="content-section">
      <h3>Services Page Content</h3>

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

      <ContentSection title="Service Categories">
        <ArrayField
          name="serviceCategories"
          items={data.serviceCategories || []}
          onAdd={addServiceCategory}
          onRemove={(name, index) => onRemoveArrayItem(name, index)}
          addLabel="Add Service Category"
        >
          {(field, index) => (
            <div className="category-item">
              <TextField
                name={`${field}-title`}
                label="Category Title"
                value={data.serviceCategories[index]?.title || ''}
                onChange={(e) => handleCategoryChange(index, 'title', e.target.value)}
              />

              <div className="services-list">
                <h5>Services in this Category</h5>

                {data.serviceCategories[index]?.services?.map((service, serviceIndex) => (
                  <div key={serviceIndex} className="service-item">
                    <TextField
                      name={`${field}-service-${serviceIndex}-title`}
                      label="Service Title"
                      value={service.title || ''}
                      onChange={(e) => handleServiceChange(index, serviceIndex, 'title', e.target.value)}
                    />
                    <TextField
                      name={`${field}-service-${serviceIndex}-description`}
                      label="Service Description"
                      value={service.description || ''}
                      onChange={(e) => handleServiceChange(index, serviceIndex, 'description', e.target.value)}
                      multiline
                    />
                    <ImageUpload
                      name={`${field}-service-${serviceIndex}-icon`}
                      label="Service Icon"
                      value={service.icon}
                      onChange={(e) => handleServiceChange(index, serviceIndex, 'icon', e.target.value)}
                    />

                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => removeService(index, serviceIndex)}
                    >
                      Remove Service
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="add-button"
                  onClick={() => addService(index)}
                >
                  Add Service
                </button>
              </div>
            </div>
          )}
        </ArrayField>
      </ContentSection>


    </div>
  );
};

export default ServicesContent;
