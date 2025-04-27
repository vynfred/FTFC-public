import { useCallback, useRef } from 'react';

/**
 * Custom hook for memoizing callbacks with deep comparison of dependencies
 * 
 * This hook is similar to useCallback, but it performs a deep comparison of
 * dependencies to prevent unnecessary re-renders when objects have the same
 * values but different references.
 * 
 * @param {Function} callback - The callback function to memoize
 * @param {Array} dependencies - The dependencies array
 * @returns {Function} The memoized callback
 */
const useMemoizedCallback = (callback, dependencies) => {
  const ref = useRef({
    callback,
    dependencies,
    memoizedCallback: (...args) => ref.current.callback(...args)
  });

  // Check if dependencies have changed
  const depsChanged = !dependencies || !ref.current.dependencies || 
    dependencies.length !== ref.current.dependencies.length ||
    dependencies.some((dep, i) => {
      // Deep comparison for objects
      if (typeof dep === 'object' && dep !== null && ref.current.dependencies[i] !== null) {
        return JSON.stringify(dep) !== JSON.stringify(ref.current.dependencies[i]);
      }
      // Simple comparison for primitives
      return dep !== ref.current.dependencies[i];
    });

  // Update ref if callback or dependencies have changed
  if (callback !== ref.current.callback || depsChanged) {
    ref.current.callback = callback;
    ref.current.dependencies = dependencies;
  }

  return useCallback(ref.current.memoizedCallback, []);
};

export default useMemoizedCallback;
