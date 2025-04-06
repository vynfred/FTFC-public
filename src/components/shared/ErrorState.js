import React from 'react';

export const ErrorState = ({ error }) => {
  return (
    <div className="error-state">
      <div className="error-content">
        <h2>Something went wrong</h2>
        <p>{error || 'An unexpected error occurred. Please try again.'}</p>
      </div>
    </div>
  );
}; 