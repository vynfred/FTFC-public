import React from 'react';
import './VariableStyledCard.css';

const VariableStyledCard = ({ title, children, className = '' }) => {
  return (
    <div className={`variable-styled-card ${className}`}>
      {title && <h3 className="variable-styled-card-title">{title}</h3>}
      <div className="variable-styled-card-content">
        {children}
      </div>
    </div>
  );
};

export default VariableStyledCard;
