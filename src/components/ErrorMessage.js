import React from 'react';

const ErrorMessage = ({ message }) => (
  <div className="error-message">
    <p>{message}</p>
    <button onClick={() => window.location.reload()} className="retry-button">
      Try Again
    </button>
  </div>
);

export default ErrorMessage; 