import {
    ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title,
    Tooltip
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { FaBullseye, FaChartBar, FaFileAlt, FaSort, FaSortDown, FaSortUp, FaUpload, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useStatsView } from '../../context/StatsViewContext';
// CSS is now imported globally
import { generateClientsCSVTemplate, processClientsData, validateClientsCSV } from '../../utils/csvUtils';
import FileUploader from '../common/FileUploader';
import DashboardSection from '../shared/DashboardSection';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Add custom plugin for chart background
const customCanvasBackgroundColor = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = '#142b47';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};

const ClientsDashboard = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [showUploader, setShowUploader] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const { showMyStats } = useStatsView();
  const [showAllMilestones, setShowAllMilestones] = useState(false);
  const [showAllClients, setShowAllClients] = useState(false);

  // Example clients data
  const [allClients, setAllClients] = useState([
    { id: 1, name: 'Acme Corp', industry: 'Technology', revenue: 125000, status: 'Active', startDate: '2023-01-15', accountManager: 'Jane Smith', lastActivity: '2024-03-05', serviceType: 'Marketing', contractEndDate: '2024-12-31' },
    { id: 2, name: 'Tech Innovators', industry: 'Technology', revenue: 175000, status: 'Active', startDate: '2023-02-21', accountManager: 'John Doe', lastActivity: '2024-03-07', serviceType: 'Web Development', contractEndDate: '2024-09-30' },
    { id: 3, name: 'Growth Ventures', industry: 'Finance', revenue: 200000, status: 'Active', startDate: '2022-11-08', accountManager: 'Jane Smith', lastActivity: '2024-03-01', serviceType: 'Full Service', contractEndDate: '2025-01-31' },
    { id: 4, name: 'Davis Enterprises', industry: 'Healthcare', revenue: 150000, status: 'Active', startDate: '2022-08-17', accountManager: 'John Doe', lastActivity: '2024-03-03', serviceType: 'SEO', contractEndDate: '2024-07-31' },
    { id: 5, name: 'Wilson & Co', industry: 'Retail', revenue: 95000, status: 'At Risk', startDate: '2023-04-05', accountManager: 'Jane Smith', lastActivity: '2024-02-15', serviceType: 'Marketing', contractEndDate: '2024-05-31' },
    { id: 6, name: 'Innovative Solutions', industry: 'Technology', revenue: 220000, status: 'Active', startDate: '2022-05-12', accountManager: 'John Doe', lastActivity: '2024-03-04', serviceType: 'Full Service', contractEndDate: '2025-04-30' },
    { id: 7, name: 'Taylor Technologies', industry: 'Technology', revenue: 190000, status: 'Active', startDate: '2022-09-28', accountManager: 'Jane Smith', lastActivity: '2024-03-02', serviceType: 'Web Development', contractEndDate: '2024-08-31' },
    { id: 8, name: 'Anderson Group', industry: 'Manufacturing', revenue: 170000, status: 'Active', startDate: '2023-03-17', accountManager: 'John Doe', lastActivity: '2024-03-06', serviceType: 'SEO', contractEndDate: '2025-02-28' },
    { id: 9, name: 'Martin Media', industry: 'Media', revenue: 210000, status: 'At Risk', startDate: '2022-07-09', accountManager: 'John Doe', lastActivity: '2024-02-20', serviceType: 'Marketing', contractEndDate: '2024-06-30' },
    { id: 10, name: 'White Enterprises', industry: 'Finance', revenue: 180000, status: 'Active', startDate: '2023-05-22', accountManager: 'Jane Smith', lastActivity: '2024-03-01', serviceType: 'Full Service', contractEndDate: '2025-05-31' }
  ]);

  // Calculate average milestone completion percentage
  const calculateAvgMilestoneCompletion = () => {
    if (allClients.length === 0) return 0;

    const completionRates = allClients.map(client => {
      if (client.milestonesAssigned === 0) return 0;
      return Math.round((client.milestonesCompleted / client.milestonesAssigned) * 100);
    });

    const sum = completionRates.reduce((total, rate) => total + rate, 0);
    return Math.round(sum / completionRates.length);
  };

  // Calculate actual/potential percentage for closed and finished projects
  const calculateActualPotentialPercentage = () => {
    // Filter for completed projects only
    const completedClients = allClients.filter(client => client.status === 'Completed');

    if (completedClients.length === 0) return 0;

    // Calculate the percentage of milestones completed compared to what was set up
    const totalMilestonesAssigned = completedClients.reduce((sum, client) => sum + client.milestonesAssigned, 0);
    const totalMilestonesCompleted = completedClients.reduce((sum, client) => sum + client.milestonesCompleted, 0);

    return totalMilestonesAssigned === 0 ? 0 : Math.round((totalMilestonesCompleted / totalMilestonesAssigned) * 100);
  };

  // Get clients for stats based on filter
  const getClientsForStats = () => {
    return showMyStats
      ? allClients.filter(client => client.accountManager === 'John Doe')
      : allClients;
  };

  // Calculate client statistics
  const getClientStats = () => {
    const clients = getClientsForStats();
    return {
      totalClients: clients.length,
      activeClients: clients.filter(client => client.status === 'Active').length,
      atRiskClients: clients.filter(client => client.status === 'At Risk').length,
      newClients: clients.filter(client => {
        const startDate = new Date(client.startDate);
        const now = new Date();
        const monthsAgo = new Date(now);

        // Using fixed date range (30d)
        switch('30d') {
          case '7d':
            monthsAgo.setDate(now.getDate() - 7);
            break;
          case '30d':
            monthsAgo.setDate(now.getDate() - 30);
            break;
          case '90d':
            monthsAgo.setDate(now.getDate() - 90);
            break;
          case '1y':
            monthsAgo.setFullYear(now.getFullYear() - 1);
            break;
          default:
            monthsAgo.setMonth(now.getMonth() - 1);
        }

        return startDate >= monthsAgo;
      }).length,
      totalRevenue: clients.reduce((sum, client) => sum + client.revenue, 0),
      avgRevenue: Math.round(clients.reduce((sum, client) => sum + client.revenue, 0) / (clients.length || 1))
    };
  };

  const clientStats = getClientStats();

  // Calculate hours since last contact
  const getHoursSinceLastContact = (lastContactDate) => {
    const lastContact = new Date(lastContactDate);
    const now = new Date();
    const diffMs = now - lastContact;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    return diffHours;
  };

  // Format last contact time
  const formatLastContact = (hours) => {
    if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} day${days === 1 ? '' : 's'} ago`;
    }
  };

  // Calculate hours since milestone update
  const getHoursSinceMilestoneUpdate = (milestoneLastUpdated) => {
    const lastUpdate = new Date(milestoneLastUpdated);
    const now = new Date();
    const diffMs = now - lastUpdate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    return diffHours;
  };

  // Format the time since milestone was updated
  const formatMilestoneOpenTime = ({ lastMilestoneUpdated }) => {
    if (!lastMilestoneUpdated) return 'Not started';

    const hours = getHoursSinceMilestoneUpdate(lastMilestoneUpdated);

    if (hours < 24) {
      return `${Math.round(hours)} hours`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} day${days !== 1 ? 's' : ''}`;
    }
  };

  // Get milestone status class based on time since last update
  const getMilestoneOpenTimeClass = ({ lastMilestoneUpdated }) => {
    if (!lastMilestoneUpdated) return '';

    const hours = getHoursSinceMilestoneUpdate(lastMilestoneUpdated);

    if (hours < 24) {
      return 'milestone-recent';
    } else if (hours < 72) {
      return 'milestone-moderate';
    } else {
      return 'milestone-overdue';
    }
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

  // Function to count clients by status
  const getClientStatusData = () => {
    const clients = getClientsForStats();
    const statusCounts = {};

    clients.forEach(client => {
      if (statusCounts[client.status]) {
        statusCounts[client.status]++;
      } else {
        statusCounts[client.status] = 1;
      }
    });

    return Object.keys(statusCounts).map(status => ({
      status,
      count: statusCounts[status]
    })).sort((a, b) => b.count - a.count);
  };

  const clientStatusData = getClientStatusData();

  // Calculate total clients for percentages
  const totalClients = clientStatusData.reduce((sum, item) => sum + item.count, 0);

  // Function to get color for client status
  const getStatusColor = (status) => {
    switch(status) {
      case 'Active':
        return '#4CAF50'; // Green
      case 'At Risk':
        return '#FFC107'; // Yellow
      case 'Completed':
        return '#2196F3'; // Blue
      case 'Delinquent':
        return '#F44336'; // Red
      case 'In Progress':
        return '#4CAF50'; // Green
      case 'Pending':
        return '#FFC107'; // Yellow
      default:
        return '#9E9E9E'; // Grey
    }
  };

  // Function to determine status color class for milestones
  const getStatusColorClass = (status) => {
    if (!status) return '';

    const lowerStatus = status.toLowerCase();
    switch(lowerStatus) {
      case 'active':
        return 'status-active';
      case 'at risk':
        return 'status-at-risk';
      case 'paused':
        return 'status-paused';
      case 'completed':
        return 'status-completed';
      case 'in progress':
        return 'status-in-progress';
      case 'open':
        return 'status-open';
      case 'pending':
        return 'status-prospective';
      case 'delayed':
        return 'status-delayed';
      default:
        return '';
    }
  };

  // Filter and sort clients when filter state or sort config changes
  useEffect(() => {
    let filtered = [...allClients];

    // Filter by assignment
    if (showMyStats) {
      filtered = filtered.filter(client => client.accountManager === 'John Doe');
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(client => client.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(term) ||
        client.industry.toLowerCase().includes(term) ||
        client.serviceType.toLowerCase().includes(term)
      );
    }

    // Sort the filtered clients
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        // Handle date sorting
        if (sortConfig.key === 'startDate' || sortConfig.key === 'lastActivity') {
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

    setFilteredClients(filtered);
  }, [allClients, showMyStats, filterStatus, searchTerm, sortConfig]);

  // Initial data fetch
  useEffect(() => {
    // In a real app, you would fetch data based on a fixed date range
    console.log(`Fetching client data for fixed date range (30d)`);
    // For now, we'll just use our static data
  }, []);

  const handleClientClick = (id) => {
    navigate(`/dashboard/clients/${id}`);
  };

  const handleCreateClient = () => {
    navigate('/dashboard/clients/create');
  };

  const handleToggleUploader = () => {
    setShowUploader(!showUploader);
  };

  const handleClientsUploaded = (newClients) => {
    // In a real app, you would send these to your backend
    // For now, we'll just add them to our local state
    setAllClients(prevClients => [...prevClients, ...newClients]);

    // Hide the uploader after successful upload
    setTimeout(() => {
      setShowUploader(false);
    }, 3000);
  };

  // Get open milestones data
  const getOpenMilestonesData = () => {
    // Create an array to store additional sample milestones
    const additionalMilestones = [
      {
        id: "m101",
        clientName: "Tech Solutions Inc",
        clientId: "c101",
        title: "Website Redesign",
        dueDate: "2025-03-25",
        status: "In Progress",
        lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "Jane Smith"
      },
      {
        id: "m102",
        clientName: "Growth Ventures LLC",
        clientId: "c102",
        title: "SEO Optimization",
        dueDate: "2025-04-10",
        status: "Pending",
        lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "Jane Smith"
      },
      {
        id: "m103",
        clientName: "Innovate Health",
        clientId: "c103",
        title: "Feature Implementation",
        dueDate: "2025-03-30",
        status: "In Progress",
        lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "John Doe"
      },
      {
        id: "m104",
        clientName: "EcoSolutions",
        clientId: "c104",
        title: "Content Creation",
        dueDate: "2025-04-15",
        status: "Pending",
        lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "Jane Smith"
      }
    ];

    // Array to store all open milestones
    const openMilestones = [...additionalMilestones];

    // Add milestones for some of the clients
    allClients.forEach(client => {
      if (client.milestones && client.milestones.some(m => m.status !== "Completed")) {
        const incompleteMilestone = client.milestones.find(m => m.status !== "Completed");
        if (incompleteMilestone) {
          openMilestones.push({
            id: `m${openMilestones.length + 1}`,
            clientName: client.name,
            clientId: client.id,
            title: incompleteMilestone.title,
            dueDate: incompleteMilestone.dueDate,
            status: incompleteMilestone.status,
            lastUpdated: incompleteMilestone.lastUpdated || new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
            assignedTo: client.assignedTo || (Math.random() > 0.5 ? "Jane Smith" : "John Doe")
          });
        }
      }
    });

    return openMilestones;
  };

  const openMilestones = getOpenMilestonesData();

  // Define pendingMilestones as well to fix the reference error
  const pendingMilestones = openMilestones;

  // Toggle showing all milestones
  const toggleMilestonesDisplay = () => {
    setShowAllMilestones(!showAllMilestones);

    // If we're going to show all milestones, smoothly scroll to ensure the container is visible
    if (!showAllMilestones) {
      setTimeout(() => {
        const container = document.querySelector('.graph-container');
        if (container) {
          container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  // Service type data for the pie chart
  const getServiceTypeData = () => {
    const clients = getClientsForStats();
    const serviceTypeCounts = {};
    const serviceTypeRevenue = {};

    clients.forEach(client => {
      if (serviceTypeCounts[client.serviceType]) {
        serviceTypeCounts[client.serviceType]++;
        serviceTypeRevenue[client.serviceType] += client.revenue;
      } else {
        serviceTypeCounts[client.serviceType] = 1;
        serviceTypeRevenue[client.serviceType] = client.revenue;
      }
    });

    return Object.keys(serviceTypeCounts).map(service => ({
      service,
      count: serviceTypeCounts[service],
      revenue: serviceTypeRevenue[service]
    })).sort((a, b) => b.revenue - a.revenue);
  };

  const serviceTypeData = getServiceTypeData();

  // Calculate total clients for percentages
  const totalServiceTypeClients = serviceTypeData.reduce((sum, item) => sum + item.count, 0);

  // Prepare data for the service types pie chart
  const prepareServiceTypeChartData = () => {
    const labels = serviceTypeData.map(item => item.service);
    const data = serviceTypeData.map(item => item.revenue);
    const backgroundColor = serviceTypeData.map((item, index) => {
      const colors = ['#3498db', '#2ecc71', '#9b59b6', '#e74c3c', '#f39c12', '#1abc9c'];
      return colors[index % colors.length];
    });

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

  // Function to get color for service type
  const getServiceColor = (service) => {
    const colorMap = {
      'Technology': '#3498db',
      'Finance': '#2ecc71',
      'Marketing': '#9b59b6',
      'Healthcare': '#e74c3c',
      'Retail': '#f39c12',
      'Manufacturing': '#1abc9c'
    };

    return colorMap[service] || '#95a5a6';
  };

  // Get client activity data
  const getClientActivityData = () => {
    // Simulate activity data for 6 months
    const today = new Date();
    const months = [];
    const clientActivity = [];
    const revenue = [];

    for (let i = 5; i >= 0; i--) {
      const month = new Date(today);
      month.setMonth(today.getMonth() - i);
      const monthName = month.toLocaleString('default', { month: 'short' });
      months.push(monthName);

      // Generate random activity number (this would come from real data)
      const activity = Math.floor(Math.random() * 50) + 30;
      clientActivity.push(activity);

      // Generate random revenue (this would come from real data)
      const monthlyRevenue = Math.floor(Math.random() * 100000) + 80000;
      revenue.push(monthlyRevenue);
    }

    return { months, clientActivity, revenue };
  };

  const clientActivityData = getClientActivityData();

  // Prepare data for the client activity line chart
  const prepareClientActivityChartData = () => {
    return {
      labels: clientActivityData.months,
      datasets: [
        {
          label: 'Client Activity',
          data: clientActivityData.clientActivity,
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          tension: 0.4,
          pointBackgroundColor: '#3498db',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true
        },
        {
          label: 'Revenue',
          data: clientActivityData.revenue,
          borderColor: '#2ecc71',
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          tension: 0.4,
          pointBackgroundColor: '#2ecc71',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          yAxisID: 'y1'
        }
      ]
    };
  };

  // Table actions component for the clients table
  const clientsTableActions = (
    <>
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search clients..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="At Risk">At Risk</option>
        </select>
      </div>
      <div className="action-button-container">
        <button className="create-button" onClick={handleCreateClient}>
          <FaUserPlus /> Create Client
        </button>
        <button className="create-button upload-button" onClick={handleToggleUploader}>
          <FaUpload /> Upload Clients
        </button>
      </div>
    </>
  );

  // Navigate to shortcuts
  const handleShortcutClick = (type) => {
    switch (type) {
      case 'create-client':
        navigate('/dashboard/clients/create');
        break;
      case 'create-invoice':
        navigate('/dashboard/invoices/create');
        break;
      case 'schedule-meeting':
        navigate('/dashboard/calendar');
        break;
      case 'create-proposal':
        navigate('/dashboard/proposals/create');
        break;
      default:
        break;
    }
  };

  return (
    <>
      <h1 className="dashboard-title">Clients</h1>
      {/* Summary Section */}
      <DashboardSection>
        <p className="summary-text">
          You have {clientStats.totalClients} clients, with {clientStats.activeClients} active and {clientStats.atRiskClients} at risk.
          {clientStats.newClients} new clients were added in the past month.
          Total client revenue is ${clientStats.totalRevenue.toLocaleString()} with an average of ${clientStats.avgRevenue.toLocaleString()} per client.
        </p>
      </DashboardSection>

      {/* Client Statistics Section */}
      <DashboardSection title="Client Statistics">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>ACTIVE CLIENTS</h3>
            <div className="value">{clientStats.activeClients}</div>
          </div>
          <div className="stat-card">
            <h3>AT RISK CLIENTS</h3>
            <div className="value">{clientStats.atRiskClients}</div>
          </div>
          <div className="stat-card">
            <h3>NEW CLIENTS</h3>
            <div className="value">{clientStats.newClients}</div>
          </div>
          <div className="stat-card">
            <h3>TOTAL REVENUE</h3>
            <div className="value">${clientStats.totalRevenue.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <h3>AVG REVENUE / CLIENT</h3>
            <div className="value">${clientStats.avgRevenue.toLocaleString()}</div>
          </div>
        </div>
      </DashboardSection>

      {/* Client List Section */}
      <DashboardSection
        title="Client List"
        actions={
          <>
            <div className="search-filter-container">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="status-filter"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="At Risk">At Risk</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="action-button-container">
              <button className="create-button" onClick={handleCreateClient}>
                <FaUserPlus /> Create Client
              </button>
              <button className="create-button upload-button" onClick={handleToggleUploader}>
                <FaUpload /> {showUploader ? 'Hide Uploader' : 'Upload Clients'}
              </button>
            </div>
          </>
        }
      >
        <div className="table-container">
          <table className="data-table client-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('name')}>
                  Name {getSortIcon('name')}
                </th>
                <th onClick={() => requestSort('status')}>
                  Status {getSortIcon('status')}
                </th>
                <th onClick={() => requestSort('revenue')}>
                  Revenue {getSortIcon('revenue')}
                </th>
                <th onClick={() => requestSort('lastContact')}>
                  Last Contact {getSortIcon('lastContact')}
                </th>
                <th onClick={() => requestSort('milestoneStatus')}>
                  Milestone Status {getSortIcon('milestoneStatus')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(client => (
                <tr key={client.id} onClick={() => handleClientClick(client.id)}>
                  <td>{client.name}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </td>
                  <td>${client.revenue.toLocaleString()}</td>
                  <td>{formatLastContact(getHoursSinceLastContact(client.lastContact))}</td>
                  <td>
                    <span className={`${getMilestoneOpenTimeClass(client)}`}>
                    {formatMilestoneOpenTime(client)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardSection>

      {/* Shortcuts Section */}
      <DashboardSection title="Shortcuts">
        <div className="shortcuts-grid">
          <div className="shortcut-card" onClick={() => handleShortcutClick('create-client')}>
            <div className="shortcut-icon"><FaUserPlus /></div>
            <div className="shortcut-title">Create Client</div>
          </div>
          <div className="shortcut-card" onClick={() => handleShortcutClick('milestone')}>
            <div className="shortcut-icon"><FaBullseye /></div>
            <div className="shortcut-title">Add Milestone</div>
          </div>
          <div className="shortcut-card" onClick={() => handleShortcutClick('invoice')}>
            <div className="shortcut-icon"><FaFileAlt /></div>
            <div className="shortcut-title">Create Invoice</div>
          </div>
          <div className="shortcut-card" onClick={() => handleShortcutClick('report')}>
            <div className="shortcut-icon"><FaChartBar /></div>
            <div className="shortcut-title">Client Report</div>
        </div>
      </div>
      </DashboardSection>

      {/* File Uploader */}
      {showUploader && (
        <FileUploader
          onFileUploaded={handleClientsUploaded}
          validateCSV={validateClientsCSV}
          processData={processClientsData}
          generateTemplate={generateClientsCSVTemplate}
          templateFileName="clients_template.csv"
        />
      )}
    </>
  );
};

export default ClientsDashboard;