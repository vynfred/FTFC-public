import React from 'react';
import PropTypes from 'prop-types';
import styles from './ComponentTemplate.module.css';

/**
 * Component Template
 * 
 * This is a template for creating new components with a consistent structure.
 * Copy this file and rename it to create a new component.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - The component title
 * @param {React.ReactNode} props.children - The component children
 * @param {string} [props.className] - Additional CSS class
 * @param {Object} [props.style] - Inline styles
 * @param {Function} [props.onClick] - Click handler
 */
const ComponentTemplate = ({
  title,
  children,
  className = '',
  style = {},
  onClick = () => {},
  ...restProps
}) => {
  // Event handlers
  const handleClick = (e) => {
    onClick(e);
  };

  // Render
  return (
    <div 
      className={`${styles.container} ${className}`}
      style={style}
      onClick={handleClick}
      {...restProps}
    >
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

// PropTypes for documentation and validation
ComponentTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func
};

export default ComponentTemplate;
