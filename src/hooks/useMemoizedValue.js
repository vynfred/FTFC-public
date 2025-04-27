import { useMemo, useRef } from 'react';

/**
 * Custom hook for memoizing values with deep comparison of dependencies
 * 
 * This hook is similar to useMemo, but it performs a deep comparison of
 * dependencies to prevent unnecessary recalculations when objects have the same
 * values but different references.
 * 
 * @param {Function} factory - The factory function that creates the value
 * @param {Array} dependencies - The dependencies array
 * @returns {any} The memoized value
 */
const useMemoizedValue = (factory, dependencies) => {
  const ref = useRef({
    value: undefined,
    dependencies,
    initialized: false
  });

  // Check if dependencies have changed
  const depsChanged = !dependencies || !ref.current.dependencies || 
    !ref.current.initialized ||
    dependencies.length !== ref.current.dependencies.length ||
    dependencies.some((dep, i) => {
      // Deep comparison for objects
      if (typeof dep === 'object' && dep !== null && ref.current.dependencies[i] !== null) {
        return JSON.stringify(dep) !== JSON.stringify(ref.current.dependencies[i]);
      }
      // Simple comparison for primitives
      return dep !== ref.current.dependencies[i];
    });

  // Recalculate value if dependencies have changed
  if (depsChanged) {
    ref.current.value = factory();
    ref.current.dependencies = dependencies;
    ref.current.initialized = true;
  }

  return useMemo(() => ref.current.value, [depsChanged]);
};

export default useMemoizedValue;
