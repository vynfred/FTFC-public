/**
 * Utility for lazy loading components
 */
import React, { lazy, Suspense } from 'react';

/**
 * Creates a lazy-loaded component with a loading fallback
 * @param {Function} importFunc - Import function for the component
 * @param {Object} options - Options for the lazy loading
 * @param {React.ReactNode} options.fallback - Fallback component to show while loading
 * @returns {React.ComponentType} - Lazy-loaded component
 */
export const lazyLoad = (importFunc, { fallback = <div>Loading...</div> } = {}) => {
  const LazyComponent = lazy(importFunc);

  return (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};
