import React, { memo } from 'react';
import PropTypes from 'prop-types';
import useVirtualList from '../../hooks/useVirtualList';
import styles from './VirtualList.module.css';

/**
 * Virtual List Component
 * 
 * Renders only the items that are visible in the viewport to improve performance
 * when dealing with large lists.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.items - The full list of items
 * @param {Function} props.renderItem - Function to render each item
 * @param {number} props.itemHeight - The height of each item in pixels
 * @param {number} [props.height=400] - The height of the list container
 * @param {number} [props.overscan=5] - Number of items to render above and below the visible area
 * @param {string} [props.className] - Additional CSS class for the container
 */
const VirtualList = ({
  items,
  renderItem,
  itemHeight,
  height = 400,
  overscan = 5,
  className = ''
}) => {
  const {
    containerRef,
    visibleItems,
    totalHeight,
    isScrolling
  } = useVirtualList({
    items,
    itemHeight,
    overscan
  });
  
  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className}`}
      style={{ height }}
      data-testid="virtual-list-container"
    >
      <div
        className={styles.innerContainer}
        style={{ height: totalHeight }}
        data-testid="virtual-list-inner"
      >
        {visibleItems.map(({ item, index, offsetTop }) => (
          <div
            key={index}
            className={styles.itemWrapper}
            style={{
              position: 'absolute',
              top: offsetTop,
              height: itemHeight,
              width: '100%'
            }}
            data-testid={`virtual-list-item-${index}`}
          >
            {renderItem({ item, index, isScrolling })}
          </div>
        ))}
      </div>
    </div>
  );
};

VirtualList.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  itemHeight: PropTypes.number.isRequired,
  height: PropTypes.number,
  overscan: PropTypes.number,
  className: PropTypes.string
};

// Memoize the component to prevent unnecessary re-renders
export default memo(VirtualList);
