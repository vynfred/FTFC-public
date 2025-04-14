import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FaChartBar, FaSort, FaSortDown, FaSortUp, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase-config';
import DashboardSection from '../shared/DashboardSection';
import { SearchBar } from '../ui/form';
import './DashboardStyles.css';
import styles from './LeadsDashboard.module.css';

const LeadsDashboard = () => {
  const navigate = useNavigate();

  // State for leads data
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch leads from Firebase
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const leadsQuery = query(collection(db, 'leads'));
        const snapshot = await getDocs(leadsQuery);
        const leadsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Ensure all required fields have default values
          name: doc.data().name || 'Unnamed Lead',
          company: doc.data().company || 'Unknown Company',
          status: doc.data().status || 'New',
          value: doc.data().value || '$0',
          lastContact: doc.data().lastContact || new Date().toISOString().split('T')[0],
          source: doc.data().source || 'Unknown',
          assignedTo: doc.data().assignedTo || 'Unassigned'
        }));
        setLeads(leadsList);
        setFilteredLeads(leadsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leads:', error);
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

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
    navigate('/dashboard/leads/new');
  };

  // Table actions component for the leads table
  const leadsTableActions = (
    <>
      <div className="filter-container">
        <div className="search-container">
          <SearchBar
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dashboard-search"
          />
        </div>
        <div className="filter-actions">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-button"
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Qualified">Qualified</option>
            <option value="Negotiation">Negotiation</option>
          </select>
        </div>
        <button className="action-button primary-button" onClick={handleCreateLead}>
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
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Leads</h1>
      </div>
      {/* Lead Statistics Section */}
      <DashboardSection title="Lead Overview">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FaUserPlus />
            </div>
            <div className="stat-content">
              <h3>Total Leads</h3>
              <p className="stat-value">{totalLeads}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaChartBar />
            </div>
            <div className="stat-content">
              <h3>New Leads</h3>
              <p className="stat-value">{newLeads}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaChartBar />
            </div>
            <div className="stat-content">
              <h3>Qualified Leads</h3>
              <p className="stat-value">{qualifiedLeads}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaChartBar />
            </div>
            <div className="stat-content">
              <h3>In Negotiation</h3>
              <p className="stat-value">{negotiationLeads}</p>
            </div>
          </div>
        </div>
      </DashboardSection>

      {/* Leads Table Section */}
      <DashboardSection
        title="Leads"
        actions={leadsTableActions}
      >
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="col-md" onClick={() => requestSort('name')}>
                  Name {getSortIcon('name')}
                </th>
                <th className="col-md" onClick={() => requestSort('company')}>
                  Company {getSortIcon('company')}
                </th>
                <th className="col-sm" onClick={() => requestSort('status')}>
                  Status {getSortIcon('status')}
                </th>
                <th className="col-sm" onClick={() => requestSort('value')}>
                  Value {getSortIcon('value')}
                </th>
                <th className="col-md" onClick={() => requestSort('lastContact')}>
                  Last Contact {getSortIcon('lastContact')}
                </th>
                <th className="col-md" onClick={() => requestSort('source')}>
                  Source {getSortIcon('source')}
                </th>
                <th className="col-md" onClick={() => requestSort('assignedTo')}>
                  Assigned To {getSortIcon('assignedTo')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map(lead => (
                <tr key={lead.id} onClick={() => handleLeadClick(lead.id)}>
                  <td className="col-md">{lead.name}</td>
                  <td className="col-md">{lead.company}</td>
                  <td className="col-sm">
                    <span className={`status-badge ${lead.status === 'New' ? 'status-new' : lead.status === 'Qualified' ? 'status-qualified' : 'status-negotiation'}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="col-sm">{lead.value}</td>
                  <td className="col-md">{new Date(lead.lastContact).toLocaleDateString()}</td>
                  <td className="col-md">{lead.source}</td>
                  <td className="col-md">{lead.assignedTo}</td>
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
