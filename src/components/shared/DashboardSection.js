import React from 'react';
// CSS is now imported globally

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
 * @returns {JSX.Element}
 */
const DashboardSection = ({ title, children, actions }) => {
  return (
    <section className="dashboard-section">
      {title && (
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">{title}</h2>
          {actions && (
            <div className="dashboard-section-actions">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className="dashboard-section-content">
        {children}
      </div>
    </section>
  );
};

export default DashboardSection;