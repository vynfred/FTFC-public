import React, { useEffect, useState } from 'react';
import { FaChartBar, FaFilter, FaSearch, FaSort, FaSortDown, FaSortUp, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { leadsData } from '../../data/testData';
import DashboardSection from '../shared/DashboardSection';
import styles from './LeadsDashboard.module.css';

const LeadsDashboard = () => {
  const navigate = useNavigate();
  
  // State for leads data
  const [leads, setLeads] = useState(leadsData);
  const [filteredLeads, setFilteredLeads] = useState(leadsData);
  
  // State for sorting
  const [sortConfig, setSortConfig] = useState({
    key: 'lastContact',
    direction: 'desc'
  });
  
  // State for filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Effect to filter and sort leads
  useEffect(() => {
    let result = [...leads];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(lead => lead.status === filterStatus);
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredLeads(result);
  }, [leads, searchTerm, filterStatus, sortConfig]);
  
  // Function to request sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Function to get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className={styles.sortIcon} />;
    }
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className={styles.sortIcon} /> 
      : <FaSortDown className={styles.sortIcon} />;
  };
  
  // Function to get status color class
  const getStatusColorClass = (status) => {
    switch (status) {
      case 'New':
        return styles.statusNew;
      case 'Qualified':
        return styles.statusQualified;
      case 'Negotiation':
        return styles.statusNegotiation;
      default:
        return styles.statusNeutral;
    }
  };
  
  // Function to handle lead click
  const handleLeadClick = (id) => {
    navigate(`/dashboard/leads/${id}`);
  };
  
  // Function to handle create lead
  const handleCreateLead = () => {
    navigate('/dashboard/leads/create');
  };
  
  // Table actions component for the leads table
  const leadsTableActions = (
    <>
      <div className={styles.searchFilterContainer}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search leads..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.filterContainer}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={styles.statusFilter}
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Qualified">Qualified</option>
            <option value="Negotiation">Negotiation</option>
          </select>
          <FaFilter className={styles.filterIcon} />
        </div>
      </div>
      <div className={styles.actionButtonContainer}>
        <button className={styles.createButton} onClick={handleCreateLead}>
          <FaUserPlus /> Add Lead
        </button>
      </div>
    </>
  );
  
  // Calculate lead statistics
  const totalLeads = leads.length;
  const newLeads = leads.filter(lead => lead.status === 'New').length;
  const qualifiedLeads = leads.filter(lead => lead.status === 'Qualified').length;
  const negotiationLeads = leads.filter(lead => lead.status === 'Negotiation').length;
  
  return (
    <div className={styles.leadsDashboard}>
      {/* Lead Statistics Section */}
      <DashboardSection title="Lead Overview">
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaUserPlus />
            </div>
            <div className={styles.statContent}>
              <h3>Total Leads</h3>
              <p className={styles.statValue}>{totalLeads}</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaChartBar />
            </div>
            <div className={styles.statContent}>
              <h3>New Leads</h3>
              <p className={styles.statValue}>{newLeads}</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaChartBar />
            </div>
            <div className={styles.statContent}>
              <h3>Qualified Leads</h3>
              <p className={styles.statValue}>{qualifiedLeads}</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaChartBar />
            </div>
            <div className={styles.statContent}>
              <h3>In Negotiation</h3>
              <p className={styles.statValue}>{negotiationLeads}</p>
            </div>
          </div>
        </div>
      </DashboardSection>
      
      {/* Leads Table Section */}
      <DashboardSection
        title="Leads"
        actions={leadsTableActions}
      >
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th onClick={() => requestSort('name')}>
                  Name {getSortIcon('name')}
                </th>
                <th onClick={() => requestSort('company')}>
                  Company {getSortIcon('company')}
                </th>
                <th onClick={() => requestSort('status')}>
                  Status {getSortIcon('status')}
                </th>
                <th onClick={() => requestSort('value')}>
                  Value {getSortIcon('value')}
                </th>
                <th onClick={() => requestSort('lastContact')}>
                  Last Contact {getSortIcon('lastContact')}
                </th>
                <th onClick={() => requestSort('source')}>
                  Source {getSortIcon('source')}
                </th>
                <th onClick={() => requestSort('assignedTo')}>
                  Assigned To {getSortIcon('assignedTo')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map(lead => (
                <tr key={lead.id} onClick={() => handleLeadClick(lead.id)}>
                  <td>{lead.name}</td>
                  <td>{lead.company}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusColorClass(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td>{lead.value}</td>
                  <td>{new Date(lead.lastContact).toLocaleDateString()}</td>
                  <td>{lead.source}</td>
                  <td>{lead.assignedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardSection>
    </div>
  );
};

export default LeadsDashboard;
