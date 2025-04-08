import React from 'react';

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
      
      <style jsx>{`
        .content-section {
          margin-bottom: 24px;
          padding: 16px;
          background-color: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .section-title {
          font-size: 16px;
          font-weight: 600;
          margin-top: 0;
          margin-bottom: 16px;
          color: #f59e0b;
          border-bottom: 1px solid rgba(245, 158, 11, 0.3);
          padding-bottom: 8px;
        }
        
        .section-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
      `}</style>
    </div>
  );
};

export default ContentSection;
