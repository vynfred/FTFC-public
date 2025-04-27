import React, { memo } from 'react';
import isEqual from 'lodash/isEqual';

/**
 * Higher-Order Component for memoizing a component with deep comparison
 * 
 * This HOC wraps a component with React.memo and uses a custom comparison
 * function to perform deep equality checks on props.
 * 
 * @param {React.Component} Component - The component to memoize
 * @param {Function} [propsAreEqual] - Optional custom comparison function
 * @returns {React.Component} The memoized component
 */
const withMemoization = (Component, propsAreEqual = null) => {
  // Default comparison function using deep equality
  const defaultPropsAreEqual = (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  };

  // Use custom comparison function if provided, otherwise use default
  const compareProps = propsAreEqual || defaultPropsAreEqual;

  // Create memoized component
  const MemoizedComponent = memo(Component, compareProps);

  // Set display name for debugging
  const displayName = Component.displayName || Component.name || 'Component';
  MemoizedComponent.displayName = `withMemoization(${displayName})`;

  return MemoizedComponent;
};

export default withMemoization;
