import React from 'react';
import styles from './Layout.module.css';

/**
 * Section component for consistent vertical spacing
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Section content
 * @param {string} props.size - Section size ('sm', 'md', 'lg')
 * @param {boolean} props.noPaddingTop - Whether to remove top padding
 * @param {boolean} props.noPaddingBottom - Whether to remove bottom padding
 * @param {string} props.className - Additional CSS class names
 */
const Section = ({
  children,
  size = 'md',
  noPaddingTop = false,
  noPaddingBottom = false,
  className = '',
  ...rest
}) => {
  // Determine CSS classes based on props
  const sectionClasses = [
    styles.section,
    size !== 'md' ? styles[size] : '',
    noPaddingTop ? styles.noPaddingTop : '',
    noPaddingBottom ? styles.noPaddingBottom : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <section className={sectionClasses} {...rest}>
      {children}
    </section>
  );
};

export default Section;
