import React, { Component } from 'react';
import ErrorBoundary from '../components/common/ErrorBoundary';

/**
 * Higher-Order Component for Error Handling
 * 
 * This HOC wraps a component with an ErrorBoundary and provides
 * consistent error handling functionality.
 * 
 * @param {React.Component} WrappedComponent - The component to wrap
 * @param {Object} options - Configuration options
 * @param {Function} options.onError - Function to call when an error occurs
 * @param {React.Component} options.FallbackComponent - Component to render when an error occurs
 * @returns {React.Component} The wrapped component
 */
const withErrorHandling = (
  WrappedComponent,
  {
    onError = (error, errorInfo) => console.error('Error caught by HOC:', error, errorInfo),
    FallbackComponent = null
  } = {}
) => {
  class WithErrorHandling extends Component {
    render() {
      return (
        <ErrorBoundary onError={onError} FallbackComponent={FallbackComponent}>
          <WrappedComponent {...this.props} />
        </ErrorBoundary>
      );
    }
  }

  // Set display name for debugging
  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithErrorHandling.displayName = `withErrorHandling(${wrappedComponentName})`;

  return WithErrorHandling;
};

export default withErrorHandling;
