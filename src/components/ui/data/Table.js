import React, { useCallback, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaFilter, FaInbox, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { debounce } from '../../../utils/performance';
import { SearchBar } from '../form';
import styles from './Table.module.css';

/**
 * Table component for displaying tabular data with sorting, filtering, and pagination
 *
 * @param {Object} props
 * @param {Array} props.columns - Array of column definitions [{id, label, sortable, render}]
 * @param {Array} props.data - Array of data objects
 * @param {string} props.title - Table title
 * @param {React.ReactNode} props.actions - Additional actions to display in the toolbar
 * @param {boolean} props.selectable - Whether rows are selectable
 * @param {Function} props.onRowClick - Function called when a row is clicked
 * @param {boolean} props.loading - Whether the table is loading
 * @param {string} props.emptyMessage - Message to display when there is no data
 * @param {boolean} props.pagination - Whether to enable pagination
 * @param {number} props.defaultPageSize - Default number of rows per page
 * @param {Array} props.pageSizeOptions - Array of page size options
 * @param {boolean} props.filterable - Whether to enable filtering
 * @param {Object} props.filterConfig - Configuration for filters
 * @param {string} props.className - Additional CSS class names
 */
const Table = ({
  columns = [],
  data = [],
  title,
  actions,
  selectable = false,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  pagination = true,
  defaultPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  filterable = true,
  filterConfig = {},
  className = '',
  ...rest
}) => {
  // State for sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // State for filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // State for selected rows
  const [selectedRows, setSelectedRows] = useState([]);

  // Filtered and sorted data
  const [processedData, setProcessedData] = useState([]);

  // Total number of pages
  const totalPages = Math.ceil(processedData.length / pageSize);

  // Current page data
  const currentData = pagination
    ? processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : processedData;

  // Handle sort request
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon based on current sort state
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className={styles.sortIcon} />;
    }
    return sortConfig.direction === 'asc'
      ? <FaSortUp className={styles.sortIcon} />
      : <FaSortDown className={styles.sortIcon} />;
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Debounced search to avoid too many re-renders
  const debouncedSearch = useCallback(
    debounce(handleSearchChange, 300),
    []
  );

  // Handle filter change
  const handleFilterChange = (filterKey, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterKey]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when page size changes
  };

  // Handle row click
  const handleRowClick = (row, index) => {
    if (selectable) {
      // Toggle selection
      const isSelected = selectedRows.includes(row.id);
      if (isSelected) {
        setSelectedRows(selectedRows.filter(id => id !== row.id));
      } else {
        setSelectedRows([...selectedRows, row.id]);
      }
    }

    if (onRowClick) {
      onRowClick(row, index);
    }
  };

  // Process data (filter, sort, etc.)
  useEffect(() => {
    let result = [...data];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => {
        // Search in all string and number fields
        return Object.keys(item).some(key => {
          const value = item[key];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(term);
          }
          if (typeof value === 'number') {
            return value.toString().includes(term);
          }
          return false;
        });
      });
    }

    // Apply column filters
    if (Object.keys(filters).length > 0) {
      result = result.filter(item => {
        return Object.keys(filters).every(key => {
          const filterValue = filters[key];
          if (!filterValue || filterValue.length === 0) return true;

          const itemValue = item[key];

          // Handle array filters (multi-select)
          if (Array.isArray(filterValue)) {
            if (Array.isArray(itemValue)) {
              return filterValue.some(v => itemValue.includes(v));
            }
            return filterValue.includes(itemValue);
          }

          // Handle range filters
          if (typeof filterValue === 'object' && (filterValue.min !== undefined || filterValue.max !== undefined)) {
            if (filterValue.min !== undefined && itemValue < filterValue.min) return false;
            if (filterValue.max !== undefined && itemValue > filterValue.max) return false;
            return true;
          }

          // Handle string filters
          if (typeof itemValue === 'string') {
            return itemValue.toLowerCase().includes(filterValue.toLowerCase());
          }

          // Handle exact match
          return itemValue === filterValue;
        });
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Handle undefined or null values
        if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
        if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;

        // Handle dates
        if (aValue instanceof Date && bValue instanceof Date) {
          return sortConfig.direction === 'asc'
            ? aValue.getTime() - bValue.getTime()
            : bValue.getTime() - aValue.getTime();
        }

        // Handle strings
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // Handle numbers
        return sortConfig.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      });
    }

    setProcessedData(result);
  }, [data, searchTerm, filters, sortConfig]);

  // Reset pagination when data changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  return (
    <div className={`${styles.tableContainer} ${className}`} {...rest}>
      {/* Table Toolbar */}
      {(title || actions || filterable) && (
        <div className={styles.tableToolbar}>
          {title && <h3 className={styles.tableTitle}>{title}</h3>}

          <div className={styles.tableActions}>
            {filterable && (
              <>
                <div className={styles.searchContainer}>
                  <SearchBar
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={debouncedSearch}
                    className={styles.tableSearch}
                  />
                </div>

                <div className={styles.filterContainer}>
                  <button
                    className={`${styles.filterButton} ${Object.keys(filters).length > 0 ? styles.active : ''}`}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <FaFilter className={styles.filterIcon} />
                    {Object.keys(filters).length > 0 && (
                      <span>{Object.keys(filters).length}</span>
                    )}
                  </button>

                  <div className={`${styles.filterDropdown} ${showFilters ? styles.open : ''}`}>
                    {columns
                      .filter(column => column.filterable !== false)
                      .map(column => (
                        <div key={column.id} className={styles.filterGroup}>
                          <div className={styles.filterGroupTitle}>{column.label}</div>

                          {/* Render appropriate filter UI based on column type */}
                          {column.filterType === 'select' && column.filterOptions && (
                            column.filterOptions.map(option => (
                              <div key={option.value} className={styles.filterOption}>
                                <input
                                  type="checkbox"
                                  id={`filter-${column.id}-${option.value}`}
                                  className={styles.filterCheckbox}
                                  checked={filters[column.id]?.includes(option.value) || false}
                                  onChange={(e) => {
                                    const currentFilters = filters[column.id] || [];
                                    if (e.target.checked) {
                                      handleFilterChange(column.id, [...currentFilters, option.value]);
                                    } else {
                                      handleFilterChange(
                                        column.id,
                                        currentFilters.filter(v => v !== option.value)
                                      );
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={`filter-${column.id}-${option.value}`}
                                  className={styles.filterLabel}
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))
                          )}

                          {column.filterType === 'range' && (
                            <div className={styles.filterOption}>
                              <input
                                type="number"
                                placeholder="Min"
                                className={styles.searchInput}
                                value={filters[column.id]?.min || ''}
                                onChange={(e) => {
                                  const value = e.target.value ? Number(e.target.value) : undefined;
                                  handleFilterChange(column.id, {
                                    ...filters[column.id],
                                    min: value
                                  });
                                }}
                              />
                              <span>to</span>
                              <input
                                type="number"
                                placeholder="Max"
                                className={styles.searchInput}
                                value={filters[column.id]?.max || ''}
                                onChange={(e) => {
                                  const value = e.target.value ? Number(e.target.value) : undefined;
                                  handleFilterChange(column.id, {
                                    ...filters[column.id],
                                    max: value
                                  });
                                }}
                              />
                            </div>
                          )}

                          {column.filterType === 'text' && (
                            <div className={styles.filterOption}>
                              <input
                                type="text"
                                placeholder="Filter..."
                                className={styles.searchInput}
                                value={filters[column.id] || ''}
                                onChange={(e) => {
                                  handleFilterChange(column.id, e.target.value);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))}

                    <div className={styles.filterActions}>
                      <button
                        className={styles.filterActionButton}
                        onClick={clearFilters}
                      >
                        Clear All
                      </button>
                      <button
                        className={`${styles.filterActionButton} ${styles.primary}`}
                        onClick={() => setShowFilters(false)}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {actions}
          </div>
        </div>
      )}

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              {columns.map(column => (
                <th
                  key={column.id}
                  className={`${styles.tableHeaderCell} ${column.sortable !== false ? styles.sortable : ''}`}
                  onClick={() => column.sortable !== false && requestSort(column.id)}
                  style={column.width ? { width: column.width } : {}}
                >
                  {column.label}
                  {column.sortable !== false && getSortIcon(column.id)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={styles.tableBody}>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className={styles.loadingState}>
                  <div className={styles.loadingSpinner}>Loading...</div>
                </td>
              </tr>
            ) : currentData.length > 0 ? (
              currentData.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className={`
                    ${styles.tableRow}
                    ${onRowClick || selectable ? styles.clickable : ''}
                    ${selectedRows.includes(row.id) ? styles.selected : ''}
                  `}
                  onClick={() => handleRowClick(row, rowIndex)}
                >
                  {columns.map(column => (
                    <td key={column.id} className={styles.tableCell}>
                      {column.render
                        ? column.render(row[column.id], row, rowIndex)
                        : row[column.id]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>
                    <FaInbox />
                  </div>
                  <div className={styles.emptyStateText}>{emptyMessage}</div>
                  <div className={styles.emptyStateSubtext}>
                    {searchTerm || Object.keys(filters).length > 0
                      ? 'Try adjusting your search or filter criteria'
                      : 'Add data to see it appear here'}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Pagination */}
      {pagination && !loading && processedData.length > 0 && (
        <div className={styles.tableFooter}>
          <div className={styles.pagination}>
            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              &laquo;
            </button>
            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                // Show all pages if 5 or fewer
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                // Near the start
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                // Near the end
                pageNum = totalPages - 4 + i;
              } else {
                // In the middle
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  className={`${styles.paginationButton} ${currentPage === pageNum ? styles.active : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight />
            </button>
            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              &raquo;
            </button>
          </div>

          <div className={styles.paginationInfo}>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} entries
          </div>

          <div className={styles.rowSizeSelector}>
            <span>Rows per page:</span>
            <select
              className={styles.rowSizeSelect}
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
