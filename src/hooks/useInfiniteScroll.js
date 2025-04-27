import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for implementing infinite scrolling
 * 
 * Detects when the user has scrolled to the bottom of a container
 * and triggers a callback to load more data.
 * 
 * @param {Object} options - Hook options
 * @param {Function} options.onLoadMore - Function to call when more data should be loaded
 * @param {boolean} options.hasMore - Whether there is more data to load
 * @param {boolean} options.loading - Whether data is currently being loaded
 * @param {number} [options.threshold=200] - Distance from bottom (in px) to trigger loading more
 * @param {HTMLElement} [options.scrollContainer=window] - The scrollable container
 * @returns {Object} Infinite scroll utilities
 */
const useInfiniteScroll = ({
  onLoadMore,
  hasMore,
  loading,
  threshold = 200,
  scrollContainer = null
}) => {
  const [isFetching, setIsFetching] = useState(false);
  const loadMoreRef = useRef(null);
  const containerRef = useRef(null);
  
  // Set the container ref if provided
  useEffect(() => {
    if (scrollContainer) {
      containerRef.current = scrollContainer;
    } else {
      containerRef.current = window;
    }
  }, [scrollContainer]);
  
  // Check if we need to load more data
  const checkScroll = useCallback(() => {
    if (!loadMoreRef.current || loading || !hasMore || isFetching) return;
    
    const container = containerRef.current;
    const loadMoreElement = loadMoreRef.current;
    
    let bottomOfElement;
    let bottomOfScreen;
    
    if (container === window) {
      // For window scrolling
      const rect = loadMoreElement.getBoundingClientRect();
      bottomOfElement = rect.bottom;
      bottomOfScreen = window.innerHeight;
    } else {
      // For custom container scrolling
      const containerRect = container.getBoundingClientRect();
      const elementRect = loadMoreElement.getBoundingClientRect();
      bottomOfElement = elementRect.bottom - containerRect.top;
      bottomOfScreen = container.clientHeight;
    }
    
    // If the bottom of the element is within the threshold of the bottom of the screen
    if (bottomOfElement - threshold <= bottomOfScreen) {
      setIsFetching(true);
    }
  }, [loading, hasMore, isFetching, threshold]);
  
  // Add scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    
    // Initial check
    checkScroll();
    
    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);
  
  // Call onLoadMore when isFetching changes to true
  useEffect(() => {
    if (!isFetching) return;
    
    const loadMore = async () => {
      try {
        await onLoadMore();
      } finally {
        setIsFetching(false);
      }
    };
    
    loadMore();
  }, [isFetching, onLoadMore]);
  
  return {
    loadMoreRef,
    isFetching
  };
};

export default useInfiniteScroll;
