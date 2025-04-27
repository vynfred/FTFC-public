import React, { useCallback, useEffect, useState } from 'react';
import { FaEdit, FaEllipsisH, FaTrash, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { deleteLead, getLeads } from '../../../services/leadsService';
import { formatDate } from '../../../utils/dateUtils';
import Pagination from '../../common/Pagination';
import styles from './LeadsList.module.css';

/**
 * Paginated Leads List Component
 * 
 * Displays a paginated list of leads with filtering and sorting options.
 */
const LeadsList = ({ onConvertToClient }) => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  // State
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [lastDocId, setLastDocId] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [pageCache, setPageCache] = useState({});
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState('');
  const [assignedToFilter, setAssignedToFilter] = useState('');
  
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  // Fetch leads with pagination
  const fetchLeads = useCallback(async (page = 1, newPageSize = pageSize) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if we have this page in cache
      const cacheKey = `${page}_${newPageSize}_${statusFilter}_${assignedToFilter}`;
      if (pageCache[cacheKey]) {
        setLeads(pageCache[cacheKey].leads);
        setLastDocId(pageCache[cacheKey].lastDocId);
        setHasMore(pageCache[cacheKey].hasMore);
        setLoading(false);
        return;
      }
      
      // Determine the startAfterDoc based on the requested page
      let startAfterDocId = null;
      
      if (page > 1) {
        // For pages beyond the first, we need the last doc of the previous page
        const prevPageKey = `${page - 1}_${newPageSize}_${statusFilter}_${assignedToFilter}`;
        if (pageCache[prevPageKey]) {
          startAfterDocId = pageCache[prevPageKey].lastDocId;
        } else {
          // If we don't have the previous page in cache, we need to fetch all pages up to the requested one
          for (let i = 1; i < page; i++) {
            const result = await getLeads({
              status: statusFilter || undefined,
              assignedTo: assignedToFilter || undefined,
              pageSize: newPageSize,
              startAfterDoc: startAfterDocId
            });
            
            startAfterDocId = result.pagination.lastDocId;
            
            // Cache this page
            const pageKey = `${i}_${newPageSize}_${statusFilter}_${assignedToFilter}`;
            setPageCache(prev => ({
              ...prev,
              [pageKey]: {
                leads: result.leads,
                lastDocId: result.pagination.lastDocId,
                hasMore: result.pagination.hasMore
              }
            }));
            
            // If there are no more results, break
            if (!result.pagination.hasMore) break;
          }
        }
      }
      
      // Fetch the requested page
      const result = await getLeads({
        status: statusFilter || undefined,
        assignedTo: assignedToFilter || undefined,
        pageSize: newPageSize,
        startAfterDoc: startAfterDocId
      });
      
      setLeads(result.leads);
      setLastDocId(result.pagination.lastDocId);
      setHasMore(result.pagination.hasMore);
      
      // Cache this page
      setPageCache(prev => ({
        ...prev,
        [cacheKey]: {
          leads: result.leads,
          lastDocId: result.pagination.lastDocId,
          hasMore: result.pagination.hasMore
        }
      }));
      
      // Update total items estimate
      if (page === 1) {
        // On first page, we can estimate the total based on whether there are more pages
        const estimatedTotal = result.pagination.hasMore
          ? newPageSize * 2 // At least 2 pages
          : result.leads.length;
        setTotalItems(estimatedTotal);
      } else if (!result.pagination.hasMore) {
        // If we've reached the last page, we can calculate the exact total
        setTotalItems((page - 1) * newPageSize + result.leads.length);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Failed to load leads. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [pageSize, statusFilter, assignedToFilter, pageCache]);
  
  // Initial fetch
  useEffect(() => {
    fetchLeads(1);
  }, [fetchLeads]);
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchLeads(page);
  };
  
  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    setPageCache({}); // Clear cache when page size changes
    fetchLeads(1, newPageSize);
  };
  
  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'status') {
      setStatusFilter(value);
    } else if (name === 'assignedTo') {
      setAssignedToFilter(value);
    }
    
    setCurrentPage(1);
    setPageCache({}); // Clear cache when filters change
  };
  
  // Apply filters
  const handleApplyFilters = () => {
    fetchLeads(1);
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setStatusFilter('');
    setAssignedToFilter('');
    setCurrentPage(1);
    setPageCache({}); // Clear cache when filters change
    fetchLeads(1);
  };
  
  // Handle lead click
  const handleLeadClick = (leadId) => {
    navigate(`/dashboard/leads/${leadId}`);
  };
  
  // Handle lead edit
  const handleEditLead = (e, leadId) => {
    e.stopPropagation();
    navigate(`/dashboard/leads/${leadId}/edit`);
  };
  
  // Handle lead delete
  const handleDeleteLead = async (e, leadId) => {
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this lead?')) {
      return;
    }
    
    try {
      await deleteLead(leadId);
      
      // Remove from state
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
      
      // Update total items
      setTotalItems(prev => prev - 1);
      
      // Clear cache
      setPageCache({});
      
      showSuccess('Lead deleted successfully');
    } catch (err) {
      console.error('Error deleting lead:', err);
      showError('Failed to delete lead');
    }
  };
  
  // Handle convert to client
  const handleConvertToClient = (e, lead) => {
    e.stopPropagation();
    onConvertToClient(lead);
  };
  
  return (
    <div className={styles.leadsListContainer}>
      {/* Filters */}
      <div className={styles.filtersContainer}>
        <div className={styles.filterGroup}>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={statusFilter}
            onChange={handleFilterChange}
            className={styles.filterSelect}
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>
        
        <div className={styles.filterGroup}>
          <label htmlFor="assignedTo">Assigned To:</label>
          <select
            id="assignedTo"
            name="assignedTo"
            value={assignedToFilter}
            onChange={handleFilterChange}
            className={styles.filterSelect}
          >
            <option value="">All Team Members</option>
            <option value="user1">John Doe</option>
            <option value="user2">Jane Smith</option>
            <option value="user3">Bob Johnson</option>
          </select>
        </div>
        
        <div className={styles.filterActions}>
          <button
            className={styles.applyButton}
            onClick={handleApplyFilters}
          >
            Apply Filters
          </button>
          <button
            className={styles.resetButton}
            onClick={handleResetFilters}
          >
            Reset
          </button>
        </div>
      </div>
      
      {/* Leads Table */}
      <div className={styles.tableContainer}>
        <table className={styles.leadsTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Created</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="8" className={styles.loadingCell}>
                  Loading leads...
                </td>
              </tr>
            )}
            
            {!loading && error && (
              <tr>
                <td colSpan="8" className={styles.errorCell}>
                  {error}
                </td>
              </tr>
            )}
            
            {!loading && !error && leads.length === 0 && (
              <tr>
                <td colSpan="8" className={styles.emptyCell}>
                  No leads found. Try adjusting your filters.
                </td>
              </tr>
            )}
            
            {!loading && !error && leads.map(lead => (
              <tr
                key={lead.id}
                onClick={() => handleLeadClick(lead.id)}
                className={styles.leadRow}
              >
                <td>{lead.name}</td>
                <td>{lead.company || 'N/A'}</td>
                <td>{lead.email}</td>
                <td>{lead.phone || 'N/A'}</td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[lead.status]}`}>
                    {lead.status}
                  </span>
                </td>
                <td>{formatDate(lead.createdAt?.toDate?.() || lead.createdAt)}</td>
                <td>{lead.assignedTo || 'Unassigned'}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.actionButton}
                      onClick={(e) => handleEditLead(e, lead.id)}
                      title="Edit Lead"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={(e) => handleConvertToClient(e, lead)}
                      title="Convert to Client"
                    >
                      <FaUserPlus />
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={(e) => handleDeleteLead(e, lead.id)}
                      title="Delete Lead"
                    >
                      <FaTrash />
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Show more actions menu
                      }}
                      title="More Actions"
                    >
                      <FaEllipsisH />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={handlePageChange}
        showPageSizeSelector={true}
        pageSizeOptions={[10, 25, 50, 100]}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default LeadsList;
