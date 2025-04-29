import React, { useCallback, useMemo, useState } from 'react';
import { FaEdit, FaFilter, FaSortAmountDown, FaTrash, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../../components/common/SearchBar';
import useDebounce from '../../../hooks/useDebounce';
import { formatDate } from '../../../utils/dateUtils';
import VirtualList from '../../common/VirtualList';
import styles from './LeadsVirtualList.module.css';

/**
 * Leads Virtual List Component
 *
 * Displays a large list of leads with virtual scrolling for performance.
 *
 * @param {Object} props - Component props
 * @param {Array} props.leads - The list of leads
 * @param {Function} props.onDelete - Function to call when a lead is deleted
 * @param {Function} props.onConvert - Function to call when a lead is converted to a client
 */
const LeadsVirtualList = ({ leads, onDelete, onConvert }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Debounce search term to prevent excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filter and sort leads
  const filteredAndSortedLeads = useMemo(() => {
    // Filter by search term
    let result = leads.filter(lead => {
      if (!debouncedSearchTerm) return true;

      const searchTermLower = debouncedSearchTerm.toLowerCase();
      return (
        lead.name?.toLowerCase().includes(searchTermLower) ||
        lead.email?.toLowerCase().includes(searchTermLower) ||
        lead.company?.toLowerCase().includes(searchTermLower) ||
        lead.phone?.toLowerCase().includes(searchTermLower)
      );
    });

    // Filter by status
    if (statusFilter) {
      result = result.filter(lead => lead.status === statusFilter);
    }

    // Sort leads
    result.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];

      // Handle dates
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        valueA = valueA?.toDate?.() || new Date(valueA);
        valueB = valueB?.toDate?.() || new Date(valueB);
      }

      // Handle strings
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      // Handle undefined values
      if (valueA === undefined) return 1;
      if (valueB === undefined) return -1;

      // Compare values
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [leads, debouncedSearchTerm, statusFilter, sortField, sortDirection]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (field === sortField) {
      // Toggle sort direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Handle lead click
  const handleLeadClick = useCallback((lead) => {
    navigate(`/dashboard/leads/${lead.id}`);
  }, [navigate]);

  // Handle lead edit
  const handleEditLead = useCallback((e, lead) => {
    e.stopPropagation();
    navigate(`/dashboard/leads/${lead.id}/edit`);
  }, [navigate]);

  // Handle lead delete
  const handleDeleteLead = useCallback((e, lead) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${lead.name}?`)) {
      onDelete(lead.id);
    }
  }, [onDelete]);

  // Handle convert to client
  const handleConvertToClient = useCallback((e, lead) => {
    e.stopPropagation();
    onConvert(lead);
  }, [onConvert]);

  // Render each lead item
  const renderLeadItem = useCallback(({ item: lead, index, isScrolling }) => {
    return (
      <div
        className={`${styles.leadItem} ${isScrolling ? styles.scrolling : ''}`}
        onClick={() => handleLeadClick(lead)}
      >
        <div className={styles.leadInfo}>
          <div className={styles.leadName}>{lead.name}</div>
          <div className={styles.leadCompany}>{lead.company || 'N/A'}</div>
          <div className={styles.leadEmail}>{lead.email}</div>
          <div className={styles.leadPhone}>{lead.phone || 'N/A'}</div>
          <div className={styles.leadStatus}>
            <span className={`${styles.statusBadge} ${styles[lead.status]}`}>
              {lead.status}
            </span>
          </div>
          <div className={styles.leadDate}>
            {formatDate(lead.createdAt?.toDate?.() || lead.createdAt)}
          </div>
        </div>

        <div className={styles.leadActions}>
          <button
            className={styles.actionButton}
            onClick={(e) => handleEditLead(e, lead)}
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
            onClick={(e) => handleDeleteLead(e, lead)}
            title="Delete Lead"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    );
  }, [handleLeadClick, handleEditLead, handleConvertToClient, handleDeleteLead]);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <SearchBar
          placeholder="Search leads..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchContainer}
          inputClassName={styles.searchInput}
          iconClassName={styles.searchIcon}
        />

        <div className={styles.filterContainer}>
          <FaFilter className={styles.filterIcon} />
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
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

        <div className={styles.sortContainer}>
          <FaSortAmountDown className={styles.sortIcon} />
          <select
            value={`${sortField}-${sortDirection}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-');
              setSortField(field);
              setSortDirection(direction);
            }}
            className={styles.sortSelect}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="status-asc">Status (A-Z)</option>
            <option value="status-desc">Status (Z-A)</option>
          </select>
        </div>
      </div>

      <div className={styles.listHeader}>
        <div className={styles.headerCell} onClick={() => handleSortChange('name')}>
          Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
        </div>
        <div className={styles.headerCell} onClick={() => handleSortChange('company')}>
          Company {sortField === 'company' && (sortDirection === 'asc' ? '↑' : '↓')}
        </div>
        <div className={styles.headerCell} onClick={() => handleSortChange('email')}>
          Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
        </div>
        <div className={styles.headerCell} onClick={() => handleSortChange('phone')}>
          Phone {sortField === 'phone' && (sortDirection === 'asc' ? '↑' : '↓')}
        </div>
        <div className={styles.headerCell} onClick={() => handleSortChange('status')}>
          Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
        </div>
        <div className={styles.headerCell} onClick={() => handleSortChange('createdAt')}>
          Created {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
        </div>
        <div className={styles.headerCell}>Actions</div>
      </div>

      {filteredAndSortedLeads.length === 0 ? (
        <div className={styles.emptyState}>
          No leads found. Try adjusting your filters.
        </div>
      ) : (
        <VirtualList
          items={filteredAndSortedLeads}
          renderItem={renderLeadItem}
          itemHeight={80}
          height={600}
          overscan={5}
          className={styles.virtualList}
        />
      )}

      <div className={styles.listFooter}>
        Showing {filteredAndSortedLeads.length} of {leads.length} leads
      </div>
    </div>
  );
};

export default React.memo(LeadsVirtualList);
