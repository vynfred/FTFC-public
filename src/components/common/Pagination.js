import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import styles from './Pagination.module.css';

/**
 * Pagination Component
 * 
 * A reusable pagination component for navigating through pages of data.
 * 
 * @param {Object} props - Component props
 * @param {number} props.currentPage - The current page number (1-based)
 * @param {number} props.totalPages - The total number of pages
 * @param {number} props.pageSize - The number of items per page
 * @param {number} props.totalItems - The total number of items
 * @param {Function} props.onPageChange - Function called when page changes
 * @param {number} [props.siblingCount=1] - Number of siblings to show on each side of current page
 * @param {boolean} [props.showPageSizeSelector=false] - Whether to show the page size selector
 * @param {Array<number>} [props.pageSizeOptions=[10, 25, 50, 100]] - Available page size options
 * @param {Function} [props.onPageSizeChange] - Function called when page size changes
 */
const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  siblingCount = 1,
  showPageSizeSelector = false,
  pageSizeOptions = [10, 25, 50, 100],
  onPageSizeChange
}) => {
  // Generate page numbers to display
  const pageNumbers = useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 3; // siblings + current + first + last
    
    // If we have fewer pages than the number we want to show
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Calculate left and right sibling indexes
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    
    // Should we show ellipsis
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    
    // Default case with both ellipses
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, '...', ...middleRange, '...', totalPages];
    }
    
    // Only show right ellipsis
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftRange = Array.from(
        { length: rightSiblingIndex },
        (_, i) => i + 1
      );
      return [...leftRange, '...', totalPages];
    }
    
    // Only show left ellipsis
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightRange = Array.from(
        { length: totalPages - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, '...', ...rightRange];
    }
    
    // Fallback
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [currentPage, totalPages, siblingCount]);
  
  // Calculate the range of items being displayed
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(startItem + pageSize - 1, totalItems);
  
  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };
  
  // Handle page size change
  const handlePageSizeChange = (e) => {
    const newPageSize = parseInt(e.target.value, 10);
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
  };
  
  return (
    <div className={styles.paginationContainer}>
      <div className={styles.paginationInfo}>
        {totalItems > 0 ? (
          <span>
            Showing {startItem}-{endItem} of {totalItems} items
          </span>
        ) : (
          <span>No items to display</span>
        )}
      </div>
      
      <div className={styles.paginationControls}>
        {/* First page button */}
        <button
          className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabled : ''}`}
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          aria-label="Go to first page"
        >
          <FaAngleDoubleLeft />
        </button>
        
        {/* Previous page button */}
        <button
          className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabled : ''}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
        >
          <FaChevronLeft />
        </button>
        
        {/* Page numbers */}
        <div className={styles.pageNumbers}>
          {pageNumbers.map((pageNumber, index) => (
            <React.Fragment key={index}>
              {pageNumber === '...' ? (
                <span className={styles.ellipsis}>...</span>
              ) : (
                <button
                  className={`${styles.pageNumber} ${pageNumber === currentPage ? styles.active : ''}`}
                  onClick={() => handlePageChange(pageNumber)}
                  disabled={pageNumber === currentPage}
                  aria-label={`Go to page ${pageNumber}`}
                  aria-current={pageNumber === currentPage ? 'page' : undefined}
                >
                  {pageNumber}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Next page button */}
        <button
          className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabled : ''}`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
        >
          <FaChevronRight />
        </button>
        
        {/* Last page button */}
        <button
          className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabled : ''}`}
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Go to last page"
        >
          <FaAngleDoubleRight />
        </button>
      </div>
      
      {/* Page size selector */}
      {showPageSizeSelector && onPageSizeChange && (
        <div className={styles.pageSizeSelector}>
          <label htmlFor="pageSize">Items per page:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className={styles.pageSizeSelect}
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  siblingCount: PropTypes.number,
  showPageSizeSelector: PropTypes.bool,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  onPageSizeChange: PropTypes.func
};

export default Pagination;
