import {
    ArcElement, Chart as ChartJS, Legend, Tooltip
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { FaAd, FaCalendarAlt, FaEdit, FaSort, FaSortDown, FaSortUp, FaUpload, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useStatsView } from '../../context/StatsViewContext';
import { generateLeadsCSVTemplate, processLeadsData, validateLeadsCSV } from '../../utils/csvUtils';
import FileUploader from '../common/FileUploader';
import DashboardSection from '../shared/DashboardSection';
import './DashboardStyles.css';
import styles from './LeadsDashboard.module.css';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const LeadsDashboard = ({ dateRange = '7d' }) => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [showUploader, setShowUploader] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const { viewCompanyStats } = useStatsView();

  // Example leads data
  const [allLeads, setAllLeads] = useState([
    { id: 1, name: 'John Smith', company: 'Acme Corp', email: 'john@acmecorp.com', phone: '(555) 123-4567', status: 'New Lead', value: 50000, lastContact: '2024-03-01', source: 'Website', assignedTo: 'John Doe', notes: 'Interested in marketing services', industry: 'Technology' },
    { id: 2, name: 'Sarah Johnson', company: 'Tech Innovators', email: 'sarah@techinnovators.com', phone: '(555) 234-5678', status: 'Meeting Scheduled', value: 75000, lastContact: '2024-03-02', source: 'Referral', assignedTo: 'Jane Smith', notes: 'Follow up after conference', industry: 'Technology' },
    { id: 3, name: 'Michael Brown', company: 'Growth Ventures', email: 'michael@growthventures.com', phone: '(555) 345-6789', status: 'Proposal Sent', value: 100000, lastContact: '2024-03-03', source: 'LinkedIn', assignedTo: 'John Doe', notes: 'Sent proposal for Q2 campaign', industry: 'Finance' },
    { id: 4, name: 'Emily Davis', company: 'Davis Enterprises', email: 'emily@davisent.com', phone: '(555) 456-7890', status: 'Negotiation', value: 60000, lastContact: '2024-03-04', source: 'Referral', assignedTo: 'John Doe', notes: 'Discussing contract terms', industry: 'Healthcare' },
    { id: 5, name: 'David Wilson', company: 'Wilson & Co', email: 'david@wilsonco.com', phone: '(555) 567-8901', status: 'New Lead', value: 85000, lastContact: '2024-03-05', source: 'Website', assignedTo: 'Jane Smith', notes: 'Requested information about services', industry: 'Retail' },
    { id: 6, name: 'Jennifer Lee', company: 'Innovative Solutions', email: 'jennifer@innovative.com', phone: '(555) 678-9012', status: 'Qualified', value: 120000, lastContact: '2024-03-06', source: 'Trade Show', assignedTo: 'John Doe', notes: 'Met at industry conference', industry: 'Technology' },
    { id: 7, name: 'Robert Taylor', company: 'Taylor Technologies', email: 'robert@taylortech.com', phone: '(555) 789-0123', status: 'Proposal Sent', value: 90000, lastContact: '2024-03-07', source: 'Email Campaign', assignedTo: 'Jane Smith', notes: 'Interested in full service package', industry: 'Technology' },
    { id: 8, name: 'Lisa Anderson', company: 'Anderson Group', email: 'lisa@andersongroup.com', phone: '(555) 890-1234', status: 'Meeting Scheduled', value: 70000, lastContact: '2024-03-08', source: 'Website', assignedTo: 'John Doe', notes: 'Call scheduled for next week', industry: 'Manufacturing' },
    { id: 9, name: 'James Martin', company: 'Martin Media', email: 'james@martinmedia.com', phone: '(555) 901-2345', status: 'Negotiation', value: 110000, lastContact: '2024-03-09', source: 'Referral', assignedTo: 'John Doe', notes: 'Discussing multi-year contract', industry: 'Media' },
    { id: 10, name: 'Patricia White', company: 'White Enterprises', email: 'patricia@whiteent.com', phone: '(555) 012-3456', status: 'Qualified', value: 95000, lastContact: '2024-03-10', source: 'LinkedIn', assignedTo: 'Jane Smith', notes: 'Follow up on initial consultation', industry: 'Finance' }
  ]);

  // Example upcoming meetings
  const [upcomingMeetings, setUpcomingMeetings] = useState([
    { id: 1, contact: 'Sarah Johnson', company: 'Tech Innovators', date: '2024-03-15T14:30:00', type: 'Follow-up Call' },
    { id: 2, contact: 'Michael Brown', company: 'Growth Ventures', date: '2024-03-16T11:00:00', type: 'Proposal Review' },
    { id: 3, contact: 'Lisa Anderson', company: 'Anderson Group', date: '2024-03-17T16:00:00', type: 'Initial Consultation' },
    { id: 4, contact: 'James Martin', company: 'Martin Media', date: '2024-03-18T09:30:00', type: 'Contract Discussion' }
  ]);

  // Filter data based on dateRange
  useEffect(() => {
    // In a real app, you would fetch data based on the dateRange
    console.log(`Fetching lead data for date range: ${dateRange}`);
    // For now, we'll just use our static data
  }, [dateRange]);

  // Get leads for stats based on filter
  const getLeadsForStats = () => {
    return !viewCompanyStats
      ? allLeads.filter(lead => lead.assignedTo === 'John Doe')
      : allLeads;
  };

  // Calculate lead statistics
  const getLeadStats = () => {
    const leads = getLeadsForStats();
    return {
      totalLeads: leads.length,
      newLeads: leads.filter(lead => lead.status === 'New Lead').length,
      qualifiedLeads: leads.filter(lead => lead.status === 'Qualified').length,
      meetingsScheduled: leads.filter(lead => lead.status === 'Meeting Scheduled').length,
      proposalsSent: leads.filter(lead => lead.status === 'Proposal Sent').length,
      inNegotiation: leads.filter(lead => lead.status === 'Negotiation').length,
      totalValue: leads.reduce((sum, lead) => sum + lead.value, 0),
      avgValue: Math.round(leads.reduce((sum, lead) => sum + lead.value, 0) / (leads.length || 1))
    };
  };

  const leadStats = getLeadStats();

  // Lead sources data for the graph
  const getLeadSourcesData = () => {
    const leads = getLeadsForStats();
    const sourceCounts = {};

    leads.forEach(lead => {
      if (sourceCounts[lead.source]) {
        sourceCounts[lead.source]++;
      } else {
        sourceCounts[lead.source] = 1;
      }
    });

    return Object.keys(sourceCounts).map(source => ({
      source,
      count: sourceCounts[source]
    })).sort((a, b) => b.count - a.count);
  };

  const leadSourcesData = getLeadSourcesData();

  // Calculate total leads for percentages
  const totalLeads = leadSourcesData.reduce((sum, item) => sum + item.count, 0);

  // Prepare data for the lead sources pie chart
  const prepareLeadSourcesChartData = () => {
    const labels = leadSourcesData.map(item => item.source);
    const data = leadSourcesData.map(item => item.count);
    const backgroundColor = leadSourcesData.map(item => getSourceColor(item.source));

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderColor: '#112240',
          borderWidth: 2,
          hoverOffset: 10
        }
      ]
    };
  };

  // Function to get color for lead source
  const getSourceColor = (source) => {
    const colorMap = {
      'Website': '#3498db',
      'Referral': '#2ecc71',
      'LinkedIn': '#9b59b6',
      'Trade Show': '#e74c3c',
      'Email Campaign': '#f39c12'
    };

    return colorMap[source] || '#95a5a6';
  };

  // Function to get the top lead source
  const getTopLeadSource = () => {
    if (leadSourcesData.length === 0) return 'None';
    return leadSourcesData[0].source;
  };

  // Industry data for the graph
  const getIndustryData = () => {
    const leads = getLeadsForStats();
    const industryCounts = {};

    leads.forEach(lead => {
      if (industryCounts[lead.industry]) {
        industryCounts[lead.industry]++;
      } else {
        industryCounts[lead.industry] = 1;
      }
    });

    return Object.keys(industryCounts).map(industry => ({
      industry,
      count: industryCounts[industry]
    })).sort((a, b) => b.count - a.count);
  };

  const industryData = getIndustryData();

  // Calculate total leads for industry percentages
  const totalIndustries = industryData.reduce((sum, item) => sum + item.count, 0);

  // Prepare data for the industry distribution pie chart
  const prepareIndustryChartData = () => {
    const labels = industryData.map(item => item.industry);
    const data = industryData.map(item => item.count);
    const backgroundColor = industryData.map(item => getIndustryColor(item.industry));

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderColor: '#112240',
          borderWidth: 2,
          hoverOffset: 10
        }
      ]
    };
  };

  // Function to get color for industry
  const getIndustryColor = (industry) => {
    const colorMap = {
      'Technology': '#3498db',
      'Finance': '#2ecc71',
      'Healthcare': '#9b59b6',
      'Retail': '#e74c3c',
      'Manufacturing': '#f39c12',
      'Media': '#1abc9c'
    };

    return colorMap[industry] || '#95a5a6';
  };

  // Sorting function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon based on current sort state
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort />;
    }
    return sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />;
  };

  // Filter and sort leads when filter state or sort config changes
  useEffect(() => {
    let filtered = [...allLeads];

    // Filter by assignment
    if (!viewCompanyStats) {
      filtered = filtered.filter(lead => lead.assignedTo === 'John Doe');
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(lead => lead.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(term) ||
        lead.company.toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term)
      );
    }

    // Sort the filtered leads
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        // Handle date sorting
        if (sortConfig.key === 'lastContact') {
          const dateA = new Date(a[sortConfig.key]);
          const dateB = new Date(b[sortConfig.key]);
          if (dateA < dateB) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (dateA > dateB) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        }

        // Handle numeric sorting
        if (typeof a[sortConfig.key] === 'number') {
          return sortConfig.direction === 'ascending'
            ? a[sortConfig.key] - b[sortConfig.key]
            : b[sortConfig.key] - a[sortConfig.key];
        }

        // Handle string sorting
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredLeads(filtered);
  }, [allLeads, viewCompanyStats, filterStatus, searchTerm, sortConfig]);

  const handleCreateLead = () => {
    navigate('/dashboard/leads/create');
  };

  const handleLeadClick = (id) => {
    navigate(`/dashboard/leads/${id}`);
  };

  const handleToggleUploader = () => {
    setShowUploader(!showUploader);
  };

  const handleLeadsUploaded = (newLeads) => {
    // In a real app, you would send these to your backend
    // For now, we'll just add them to our local state
    setAllLeads(prevLeads => [...prevLeads, ...newLeads]);

    // Hide the uploader after successful upload
    setTimeout(() => {
      setShowUploader(false);
    }, 3000);
  };

  // Function to determine status color class
  const getStatusColorClass = (status) => {
    switch(status) {
      case 'Unqualified':
        return 'statusNew';
      case 'In Qualification':
        return 'statusContacted';
      case 'Qualified':
        return 'statusQualified';
      case 'Evaluation':
        return 'statusEvaluation';
      case 'Opportunity':
        return 'statusOpportunity';
      case 'Closed Won':
        return 'statusWon';
      case 'Closed Lost':
        return 'statusLost';
      case 'Closed Deferred':
        return 'statusDeferred';
      default:
        return '';
    }
  };

  // Table actions component for the leads table
  const leadsTableActions = (
    <>
      <div className={styles.searchFilterContainer}>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={styles.statusFilter}
        >
          <option value="all">All Statuses</option>
          <option value="Unqualified">Unqualified</option>
          <option value="In Qualification">In Qualification</option>
          <option value="Qualified">Qualified</option>
          <option value="Evaluation">Evaluation</option>
          <option value="Opportunity">Opportunity</option>
          <option value="Closed Won">Closed Won</option>
          <option value="Closed Lost">Closed Lost</option>
          <option value="Closed Deferred">Closed Deferred</option>
        </select>
      </div>
      <div className={styles.actionButtonContainer}>
        <button className={styles.createButton} onClick={handleCreateLead}>
          <FaUserPlus /> Create Lead
        </button>
        <button className={`${styles.createButton} ${styles.uploadButton}`} onClick={handleToggleUploader}>
          <FaUpload /> {showUploader ? 'Hide Uploader' : 'Upload Leads'}
        </button>
      </div>
    </>
  );

  // Function to format date for meetings
  const formatMeetingDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Navigate to shortcuts
  const handleShortcutClick = (type) => {
    switch (type) {
      case 'create-lead':
        navigate('/dashboard/leads/create');
        break;
      case 'schedule-meeting':
        navigate('/dashboard/calendar');
        break;
      case 'blog':
        navigate('/dashboard/blog/create');
        break;
      case 'ad':
        navigate('/dashboard/ads/create');
        break;
      default:
        break;
    }
  };

  // Get view type text
  const getViewTypeText = () => {
    return !viewCompanyStats ? 'My Leads' : 'All Leads';
  };

  return (
    <div className={styles.leadsDashboard}>
      <div className={styles.leadsHeader}>
        <h1>Leads</h1>
      </div>

      {/* Summary Section */}
      <DashboardSection>
        <p className={styles.summaryText}>
          You have {leadStats.totalLeads} leads in your pipeline with a total value of ${leadStats.totalValue.toLocaleString()}.
          {leadStats.newLeads} new leads were added in the past {dateRange === '7d' ? 'week' : dateRange === '30d' ? 'month' : dateRange === '90d' ? 'quarter' : 'year'},
          with {leadStats.meetingsScheduled} meetings scheduled. Your top lead source is {getTopLeadSource()},
          accounting for {Math.round(leadSourcesData.find(s => s.source === getTopLeadSource())?.count / totalLeads * 100) || 0}% of all leads.
        </p>
      </DashboardSection>

      {/* Lead Statistics Section */}
      <DashboardSection title="Lead Statistics">
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>NEW LEADS</h3>
            <div className={styles.value}>{getLeadStats().newLeads}</div>
          </div>
          <div className={styles.statCard}>
            <h3>QUALIFIED LEADS</h3>
            <div className={styles.value}>{getLeadStats().qualifiedLeads}</div>
          </div>
          <div className={styles.statCard}>
            <h3>MEETINGS SCHEDULED</h3>
            <div className={styles.value}>{getLeadStats().meetingsScheduled}</div>
          </div>
          <div className={styles.statCard}>
            <h3>PROPOSALS SENT</h3>
            <div className={styles.value}>{getLeadStats().proposalsSent}</div>
          </div>
          <div className={styles.statCard}>
            <h3>AVG LEAD VALUE</h3>
            <div className={styles.value}>${getLeadStats().avgValue.toLocaleString()}</div>
          </div>
        </div>
      </DashboardSection>

      {/* File Uploader */}
      {showUploader && (
        <FileUploader
          onFileUploaded={handleLeadsUploaded}
          validateCSV={validateLeadsCSV}
          processData={processLeadsData}
          generateTemplate={generateLeadsCSVTemplate}
          templateFileName="leads_template.csv"
        />
      )}

      {/* Sales Pipeline Section */}
      <DashboardSection
        title="Sales Pipeline"
        actions={leadsTableActions}
      >
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th onClick={() => requestSort('name')}>
                  Name
                </th>
                <th onClick={() => requestSort('company')}>
                  Company
                </th>
                <th onClick={() => requestSort('status')}>
                  Status
                </th>
                <th onClick={() => requestSort('value')}>
                  Value
                </th>
                <th onClick={() => requestSort('lastContact')}>
                  Last Contact
                </th>
                <th onClick={() => requestSort('source')}>
                  Source
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map(lead => (
                <tr key={lead.id} onClick={() => handleLeadClick(lead.id)}>
                  <td>{lead.name}</td>
                  <td>{lead.company}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[getStatusColorClass(lead.status)]}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td>${lead.value.toLocaleString()}</td>
                  <td>{new Date(lead.lastContact).toLocaleDateString()}</td>
                  <td>{lead.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardSection>

      {/* Shortcuts Section */}
      <DashboardSection title="Shortcuts">
        <div className={styles.shortcutsGrid}>
          <div className={styles.shortcutCard} onClick={() => handleShortcutClick('create-lead')}>
            <div className={styles.shortcutIcon}><FaUserPlus /></div>
            <div className={styles.shortcutTitle}>Create Lead</div>
          </div>
          <div className={styles.shortcutCard} onClick={() => handleShortcutClick('schedule-meeting')}>
            <div className={styles.shortcutIcon}><FaCalendarAlt /></div>
            <div className={styles.shortcutTitle}>Schedule Meeting</div>
          </div>
          <div className={styles.shortcutCard} onClick={() => handleShortcutClick('blog')}>
            <div className={styles.shortcutIcon}><FaEdit /></div>
            <div className={styles.shortcutTitle}>Create Blog</div>
          </div>
          <div className={styles.shortcutCard} onClick={() => handleShortcutClick('ad')}>
            <div className={styles.shortcutIcon}><FaAd /></div>
            <div className={styles.shortcutTitle}>Create Ad</div>
          </div>
        </div>
      </DashboardSection>
    </div>
  );
};

export default LeadsDashboard;