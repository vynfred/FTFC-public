import React from 'react';
import './ContentSection.css';

/**
 * ContentSection component for grouping form fields in the public pages editor
 */
const ContentSection = ({ title, children }) => {
  return (
    <div className="content-section">
      <h4 className="section-title">{title}</h4>
      <div className="section-content">
        {children}
      </div>
    </div>
  );
};

export default ContentSection;
