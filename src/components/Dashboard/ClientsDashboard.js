import {
    ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title,
    Tooltip
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { FaBullseye, FaChartBar, FaFileAlt, FaSort, FaSortDown, FaSortUp, FaUpload, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useStatsView } from '../../context/StatsViewContext';
// CSS is now imported globally
import { clientsData } from '../../data/testData';
import { generateClientsCSVTemplate, processClientsData, validateClientsCSV } from '../../utils/csvUtils';
import FileUploader from '../common/FileUploader';
import DashboardSection from '../shared/DashboardSection';
import styles from './ClientsDashboard.module.css';

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
    const ctx = chart.canvas.getContext('2d');
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};

const ClientsDashboard = () => {
  const navigate = useNavigate();
  const { statsView } = useStatsView();
  
  // State for clients data
  const [clients, setClients] = useState(clientsData);
  const [filteredClients, setFilteredClients] = useState(clientsData);
  
  // State for sorting
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc'
  });
  
  // State for filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // State for file uploader
  const [showUploader, setShowUploader] = useState(false);
  
  // Effect to filter and sort clients
  useEffect(() => {
    let result = [...clients];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(client => client.status === filterStatus);
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
    
    setFilteredClients(result);
  }, [clients, searchTerm, filterStatus, sortConfig]);
  
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
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return styles.statusActive;
      case 'At Risk':
        return styles.statusAtRisk;
      default:
        return styles.statusInactive;
    }
  };
  
  // Function to handle client click
  const handleClientClick = (id) => {
    navigate(`/dashboard/clients/${id}`);
  };
  
  // Function to handle create client
  const handleCreateClient = () => {
    navigate('/dashboard/clients/create');
  };
  
  // Function to handle toggle uploader
  const handleToggleUploader = () => {
    setShowUploader(!showUploader);
  };
  
  // Function to handle file upload
  const handleFileUpload = (file) => {
    // In a real app, this would process the file and update the database
    console.log('File uploaded:', file);
    
    // For demo purposes, we'll just close the uploader
    setShowUploader(false);
  };
  
  // Function to handle download template
  const handleDownloadTemplate = () => {
    generateClientsCSVTemplate();
  };
  
  // Table actions component for the clients table
  const clientsTableActions = (
    <>
      <div className={styles.searchFilterContainer}>
        <input
          type="text"
          placeholder="Search clients..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={styles.statusFilter}
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="At Risk">At Risk</option>
        </select>
      </div>
      <div className={styles.actionButtonContainer}>
        <button className={styles.createButton} onClick={handleCreateClient}>
          <FaUserPlus /> Create Client
        </button>
        <button className={styles.createButton} onClick={handleToggleUploader}>
          <FaUpload /> Import
        </button>
      </div>
    </>
  );
  
  // Calculate client statistics
  const totalClients = clients.length;
  const activeClients = clients.filter(client => client.status === 'Active').length;
  const atRiskClients = clients.filter(client => client.status === 'At Risk').length;
  
  return (
    <div className={styles.clientsDashboard}>
      {/* Client Statistics Section */}
      <DashboardSection title="Client Overview">
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaUserPlus />
            </div>
            <div className={styles.statContent}>
              <h3>Total Clients</h3>
              <p className={styles.statValue}>{totalClients}</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaChartBar />
            </div>
            <div className={styles.statContent}>
              <h3>Active Clients</h3>
              <p className={styles.statValue}>{activeClients}</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaBullseye />
            </div>
            <div className={styles.statContent}>
              <h3>At Risk Clients</h3>
              <p className={styles.statValue}>{atRiskClients}</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaFileAlt />
            </div>
            <div className={styles.statContent}>
              <h3>Documents</h3>
              <p className={styles.statValue}>{totalClients * 3}</p>
            </div>
          </div>
        </div>
      </DashboardSection>
      
      {/* Clients Table Section */}
      <DashboardSection
        title="Clients"
        actions={clientsTableActions}
      >
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
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
                <th onClick={() => requestSort('industry')}>
                  Industry {getSortIcon('industry')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(client => (
                <tr key={client.id} onClick={() => handleClientClick(client.id)}>
                  <td>{client.name}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </td>
                  <td>{client.revenue}</td>
                  <td>{new Date(client.lastContact).toLocaleDateString()}</td>
                  <td>
                    <div className={styles.progressContainer}>
                      <div 
                        className={styles.progressBar} 
                        style={{ width: client.milestoneStatus }}
                      ></div>
                      <span className={styles.progressText}>{client.milestoneStatus}</span>
                    </div>
                  </td>
                  <td>{client.industry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardSection>
      
      {/* File Uploader Modal */}
      {showUploader && (
        <FileUploader
          title="Import Clients"
          acceptedFileTypes=".csv"
          onUpload={handleFileUpload}
          onClose={() => setShowUploader(false)}
          onDownloadTemplate={handleDownloadTemplate}
          validateFile={validateClientsCSV}
          processFile={processClientsData}
        />
      )}
    </div>
  );
};

export default ClientsDashboard;
