import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ErrorDisplay from './ErrorDisplay';

/**
 * Default fallback UI for error states
 */
const DefaultFallback = ({ error, resetError }) => (
  <ErrorDisplay
    message={error.message || 'An unexpected error occurred'}
    onRetry={resetError}
    variant="full"
    error={error}
  />
);

DefaultFallback.propTypes = {
  error: PropTypes.object.isRequired,
  resetError: PropTypes.func
};

/**
 * Error Boundary Component
 *
 * This component catches JavaScript errors in its child component tree,
 * logs those errors, and displays a fallback UI.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    this.setState({ errorInfo });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    const { children, FallbackComponent } = this.props;
    const { hasError, error } = this.state;

    if (hasError) {
      // Render the fallback UI
      const Fallback = FallbackComponent || DefaultFallback;
      return <Fallback error={error} resetError={this.resetError} />;
    }

    // Render children if there's no error
    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  onError: PropTypes.func,
  FallbackComponent: PropTypes.elementType
};

export default ErrorBoundary;
