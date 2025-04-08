import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import './ArrayField.css';

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
    </div>
  );
};

export default ArrayField;
