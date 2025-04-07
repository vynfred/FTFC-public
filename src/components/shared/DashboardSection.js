import React from 'react';
import styles from './DashboardSection.module.css';

/**
 * DashboardSection - A standardized section component for dashboards
 *
 * This component provides consistent styling and structure for all dashboard sections.
 * It handles the outer container, title, and optional action buttons in a uniform way.
 *
 * @param {Object} props
 * @param {string} props.title - The title of the section
 * @param {React.ReactNode} props.children - The content to display in the section
 * @param {React.ReactNode} props.actions - Optional action buttons or controls
 * @param {string} props.width - Optional width class: 'half', 'third', 'twoThirds', or 'full' (default)
 * @param {boolean} props.hoverable - Whether to show hover effects
 * @param {string} props.className - Optional additional CSS classes
 * @returns {JSX.Element}
 */
const DashboardSection = ({
  title,
  children,
  actions,
  width = 'full',
  hoverable = false,
  className = ''
}) => {
  // Determine CSS classes based on props
  const sectionClasses = [
    styles.section,
    styles[width], // 'full', 'half', 'third', 'twoThirds'
    hoverable ? styles.hoverable : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <section className={sectionClasses}>
      {title && (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {actions && (
            <div className={styles.actions}>
              {actions}
            </div>
          )}
        </div>
      )}
      <div className={styles.content}>
        {children}
      </div>
    </section>
  );
};

export default DashboardSection;