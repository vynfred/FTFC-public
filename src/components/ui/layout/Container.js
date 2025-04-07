import React from 'react';
import styles from './Layout.module.css';

/**
 * Container component for consistent content width and padding
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Container content
 * @param {boolean} props.fluid - Whether the container should be full width
 * @param {boolean} props.narrow - Whether the container should be narrow
 * @param {boolean} props.wide - Whether the container should be wide
 * @param {string} props.as - HTML element to render as ('div', 'section', 'article', etc.)
 * @param {string} props.padding - Padding size ('none', 'sm', 'md', 'lg')
 * @param {boolean} props.centerContent - Whether to center content vertically and horizontally
 * @param {string} props.className - Additional CSS class names
 */
const Container = ({
  children,
  fluid = false,
  narrow = false,
  wide = false,
  as: Component = 'div',
  padding = 'default',
  centerContent = false,
  className = '',
  ...rest
}) => {
  // Determine CSS classes based on props
  const containerClasses = [
    styles.container,
    fluid ? styles.fluid : '',
    narrow ? styles.narrow : '',
    wide ? styles.wide : '',
    padding !== 'default' ? styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`] : '',
    centerContent ? styles.centerContent : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={containerClasses} {...rest}>
      {children}
    </Component>
  );
};

export default Container;
