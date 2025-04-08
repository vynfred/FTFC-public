import React from 'react';
import ContentSection from './ContentSection';
import TextField from './TextField';
import ImageUpload from './ImageUpload';
import ArrayField from './ArrayField';

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
      
      <style jsx>{`
        .services-list {
          margin-top: 16px;
          padding: 16px;
          background-color: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
        }
        
        .services-list h5 {
          margin-top: 0;
          margin-bottom: 16px;
          font-size: 14px;
          font-weight: 600;
          color: #94a3b8;
        }
        
        .service-item {
          margin-bottom: 16px;
          padding: 16px;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .add-button {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          border: 1px dashed #f59e0b;
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
        }
        
        .add-button:hover {
          background-color: rgba(245, 158, 11, 0.2);
        }
        
        .remove-button {
          background-color: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 4px;
          padding: 8px 16px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 8px;
        }
        
        .remove-button:hover {
          background-color: rgba(239, 68, 68, 0.2);
        }
      `}</style>
    </div>
  );
};

export default ServicesContent;
