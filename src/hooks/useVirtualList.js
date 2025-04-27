import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

/**
 * Custom hook for implementing virtual lists
 * 
 * Renders only the items that are visible in the viewport to improve performance
 * when dealing with large lists.
 * 
 * @param {Object} options - Hook options
 * @param {Array} options.items - The full list of items
 * @param {number} options.itemHeight - The height of each item in pixels
 * @param {number} [options.overscan=5] - Number of items to render above and below the visible area
 * @param {number} [options.scrollingDelay=150] - Delay in ms to wait after scrolling stops before recalculating
 * @returns {Object} Virtual list utilities
 */
const useVirtualList = ({
  items,
  itemHeight,
  overscan = 5,
  scrollingDelay = 150
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef(null);
  const scrollingTimeoutRef = useRef(null);
  
  // Calculate the total height of the list
  const totalHeight = useMemo(() => {
    return items.length * itemHeight;
  }, [items.length, itemHeight]);
  
  // Calculate the range of visible items
  const visibleRange = useMemo(() => {
    if (containerHeight === 0) return { startIndex: 0, endIndex: overscan * 2 };
    
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    
    return { startIndex, endIndex };
  }, [scrollTop, containerHeight, itemHeight, items.length, overscan]);
  
  // Get the visible items
  const visibleItems = useMemo(() => {
    const { startIndex, endIndex } = visibleRange;
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
      offsetTop: (startIndex + index) * itemHeight
    }));
  }, [visibleRange, items, itemHeight]);
  
  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    
    const { scrollTop: currentScrollTop } = containerRef.current;
    setScrollTop(currentScrollTop);
    
    // Set scrolling state
    setIsScrolling(true);
    
    // Clear previous timeout
    if (scrollingTimeoutRef.current) {
      clearTimeout(scrollingTimeoutRef.current);
    }
    
    // Set new timeout to detect when scrolling stops
    scrollingTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, scrollingDelay);
  }, [scrollingDelay]);
  
  // Initialize container height and add scroll event listener
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver(entries => {
      const { height } = entries[0].contentRect;
      setContainerHeight(height);
    });
    
    resizeObserver.observe(containerRef.current);
    containerRef.current.addEventListener('scroll', handleScroll);
    
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
      resizeObserver.disconnect();
      
      if (scrollingTimeoutRef.current) {
        clearTimeout(scrollingTimeoutRef.current);
      }
    };
  }, [handleScroll]);
  
  // Scroll to a specific item
  const scrollToItem = useCallback((index, align = 'auto') => {
    if (!containerRef.current) return;
    
    const { offsetHeight } = containerRef.current;
    const itemTop = index * itemHeight;
    const itemBottom = itemTop + itemHeight;
    
    const currentTop = containerRef.current.scrollTop;
    const currentBottom = currentTop + offsetHeight;
    
    let targetScrollTop = currentTop;
    
    if (align === 'start' || (align === 'auto' && itemTop < currentTop)) {
      targetScrollTop = itemTop;
    } else if (align === 'end' || (align === 'auto' && itemBottom > currentBottom)) {
      targetScrollTop = itemBottom - offsetHeight;
    }
    
    containerRef.current.scrollTop = targetScrollTop;
  }, [itemHeight]);
  
  return {
    containerRef,
    visibleItems,
    totalHeight,
    isScrolling,
    scrollToItem
  };
};

export default useVirtualList;
