import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

/**
 * ArrayField component for managing arrays of form fields in the public pages editor
 */
const ArrayField = ({ name, children, items = [], onAdd, onRemove, addLabel = 'Add Item', minItems = 0, maxItems = 10 }) => {
  const handleAdd = () => {
    if (items.length < maxItems && onAdd) {
      onAdd(name);
    }
  };
  
  const handleRemove = (index) => {
    if (items.length > minItems && onRemove) {
      onRemove(name, index);
    }
  };
  
  return (
    <div className="array-field">
      <div className="array-items">
        {items.map((item, index) => (
          <div key={index} className="array-item">
            <div className="item-content">
              {children(`${name}[${index}]`, index)}
            </div>
            
            {items.length > minItems && (
              <button 
                type="button" 
                className="remove-button"
                onClick={() => handleRemove(index)}
                aria-label="Remove item"
              >
                <FaTrash />
              </button>
            )}
          </div>
        ))}
      </div>
      
      {items.length < maxItems && (
        <button 
          type="button" 
          className="add-button"
          onClick={handleAdd}
        >
          <FaPlus className="add-icon" />
          {addLabel}
        </button>
      )}
      
      <style jsx>{`
        .array-field {
          width: 100%;
        }
        
        .array-items {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .array-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .item-content {
          flex: 1;
        }
        
        .remove-button {
          background-color: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: none;
          border-radius: 4px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        
        .remove-button:hover {
          background-color: rgba(239, 68, 68, 0.2);
        }
        
        .add-button {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          border: 1px dashed #f59e0b;
          border-radius: 8px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
        }
        
        .add-button:hover {
          background-color: rgba(245, 158, 11, 0.2);
        }
        
        .add-icon {
          margin-right: 8px;
        }
      `}</style>
    </div>
  );
};

export default ArrayField;
