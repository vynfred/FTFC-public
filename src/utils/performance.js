/**
 * Performance utilities for optimizing React components
 */

/**
 * Debounce function to limit how often a function is called
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @param {boolean} immediate - Whether to call the function immediately
 * @returns {Function} - The debounced function
 */
export const debounce = (func, wait = 300, immediate = false) => {
  let timeout;
  
  return function executedFunction(...args) {
    const context = this;
    
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
};

/**
 * Throttle function to limit how often a function is called
 * 
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} - The throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  
  return function executedFunction(...args) {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Memoize function to cache results of expensive function calls
 * 
 * @param {Function} func - The function to memoize
 * @returns {Function} - The memoized function
 */
export const memoize = (func) => {
  const cache = new Map();
  
  return function executedFunction(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func.apply(this, args);
    cache.set(key, result);
    
    return result;
  };
};

/**
 * Lazy load an image with IntersectionObserver
 * 
 * @param {HTMLImageElement} img - The image element to lazy load
 * @param {string} src - The source URL of the image
 */
export const lazyLoadImage = (img, src) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        img.src = src;
        observer.disconnect();
      }
    });
  });
  
  observer.observe(img);
};

/**
 * Measure component render time
 * 
 * @param {string} componentName - The name of the component
 * @param {Function} callback - The function to measure
 * @returns {any} - The result of the callback function
 */
export const measureRenderTime = (componentName, callback) => {
  if (process.env.NODE_ENV === 'development') {
    const startTime = performance.now();
    const result = callback();
    const endTime = performance.now();
    
    console.log(`[Performance] ${componentName} rendered in ${(endTime - startTime).toFixed(2)}ms`);
    
    return result;
  }
  
  return callback();
};

/**
 * Create a performance-optimized event handler
 * 
 * @param {string} eventType - The type of event to listen for
 * @param {Function} handler - The event handler function
 * @param {Object} options - Options for the event listener
 * @returns {Function} - A function to remove the event listener
 */
export const createOptimizedEventHandler = (eventType, handler, options = {}) => {
  const { passive = true, capture = false, debounceTime = 0, throttleTime = 0 } = options;
  
  let optimizedHandler = handler;
  
  if (debounceTime > 0) {
    optimizedHandler = debounce(handler, debounceTime);
  } else if (throttleTime > 0) {
    optimizedHandler = throttle(handler, throttleTime);
  }
  
  window.addEventListener(eventType, optimizedHandler, { passive, capture });
  
  return () => {
    window.removeEventListener(eventType, optimizedHandler, { capture });
  };
};

/**
 * Optimize animations with requestAnimationFrame
 * 
 * @param {Function} callback - The animation callback
 * @returns {number} - The animation frame ID
 */
export const optimizeAnimation = (callback) => {
  return requestAnimationFrame(callback);
};

/**
 * Cancel an optimized animation
 * 
 * @param {number} animationId - The animation frame ID
 */
export const cancelOptimizedAnimation = (animationId) => {
  cancelAnimationFrame(animationId);
};
