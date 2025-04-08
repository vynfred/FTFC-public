import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaChartBar, FaExchangeAlt, FaSort, FaSortDown, FaSortUp, FaUpload, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useStatsView } from '../../context/StatsViewContext';
// CSS is now imported globally
import { generateInvestorsCSVTemplate, processInvestorsData, validateInvestorsCSV } from '../../utils/csvUtils';
import FileUploader from '../common/FileUploader';
import DashboardSection from '../shared/DashboardSection';

const InvestorDashboard = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInvestors, setFilteredInvestors] = useState([]);
  const [showUploader, setShowUploader] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [investorTimeframe, setInvestorTimeframe] = useState('monthly');
  const { showMyStats } = useStatsView();

  // Example investors data
  const [allInvestors, setAllInvestors] = useState([
    { id: 1, name: 'Alex Morgan', firm: 'Morgan Ventures', email: 'alex@morganventures.com', phone: '(555) 123-4567', status: 'Active', investmentRange: '$250K-$1M', lastContact: '2024-03-01', preferredStage: 'Seed', preferredIndustries: ['SaaS', 'Fintech'], assignedTo: 'John Doe', totalInvested: 750000, deals: 3 },
    { id: 2, name: 'Sarah Chen', firm: 'Horizon Capital', email: 'sarah@horizoncap.com', phone: '(555) 234-5678', status: 'Active', investmentRange: '$1M-$5M', lastContact: '2024-03-02', preferredStage: 'Series A', preferredIndustries: ['Healthcare', 'AI'], assignedTo: 'Jane Smith', totalInvested: 3500000, deals: 4 },
    { id: 3, name: 'Michael Johnson', firm: 'Johnson Partners', email: 'michael@johnsonpartners.com', phone: '(555) 345-6789', status: 'Inactive', investmentRange: '$100K-$500K', lastContact: '2024-02-15', preferredStage: 'Pre-seed', preferredIndustries: ['E-commerce', 'Mobile'], assignedTo: 'John Doe', totalInvested: 350000, deals: 2 },
    { id: 4, name: 'Emily Davis', firm: 'Davis Investments', email: 'emily@davisinv.com', phone: '(555) 456-7890', status: 'Active', investmentRange: '$500K-$2M', lastContact: '2024-03-04', preferredStage: 'Seed', preferredIndustries: ['Cleantech', 'SaaS'], assignedTo: 'John Doe', totalInvested: 1200000, deals: 3 },
    { id: 5, name: 'David Wilson', firm: 'Wilson Group', email: 'david@wilsongroup.com', phone: '(555) 567-8901', status: 'Prospective', investmentRange: '$1M-$10M', lastContact: '2024-03-05', preferredStage: 'Series A', preferredIndustries: ['Fintech', 'AI'], assignedTo: 'Jane Smith', totalInvested: 0, deals: 0 },
    { id: 6, name: 'Jennifer Lee', firm: 'Innovative Capital', email: 'jennifer@innovativecap.com', phone: '(555) 678-9012', status: 'Active', investmentRange: '$2M-$8M', lastContact: '2024-03-06', preferredStage: 'Series B', preferredIndustries: ['Healthcare', 'Enterprise'], assignedTo: 'John Doe', totalInvested: 5500000, deals: 4 },
    { id: 7, name: 'Robert Taylor', firm: 'Taylor Investments', email: 'robert@taylorinv.com', phone: '(555) 789-0123', status: 'Active', investmentRange: '$250K-$1M', lastContact: '2024-03-07', preferredStage: 'Seed', preferredIndustries: ['Consumer', 'Retail'], assignedTo: 'Jane Smith', totalInvested: 850000, deals: 2 },
    { id: 8, name: 'Lisa Anderson', firm: 'Anderson Ventures', email: 'lisa@andersonventures.com', phone: '(555) 890-1234', status: 'Prospective', investmentRange: '$500K-$3M', lastContact: '2024-03-08', preferredStage: 'Seed', preferredIndustries: ['Edtech', 'SaaS'], assignedTo: 'John Doe', totalInvested: 0, deals: 0 }
  ]);

  // Example upcoming meetings
  const [upcomingMeetings, setUpcomingMeetings] = useState([
    { id: 1, investorName: 'Alex Morgan', firm: 'Morgan Ventures', date: '2024-03-15T14:00:00', type: 'Initial Meeting', purpose: 'Discuss investment opportunities' },
    { id: 2, investorName: 'Sarah Chen', firm: 'Horizon Capital', date: '2024-03-16T10:30:00', type: 'Follow-up', purpose: 'Review portfolio companies' },
    { id: 3, investorName: 'David Wilson', firm: 'Wilson Group', date: '2024-03-18T16:00:00', type: 'Pitch Session', purpose: 'Present startup opportunities' },
    { id: 4, investorName: 'Jennifer Lee', firm: 'Innovative Capital', date: '2024-03-20T11:00:00', type: 'Deal Review', purpose: 'Discuss funding terms' }
  ]);

  // Example potential pairings
  const [potentialPairings, setPotentialPairings] = useState([
    { id: 1, investorName: 'Alex Morgan', firm: 'Morgan Ventures', leadName: 'TechFlow Solutions', industry: 'SaaS', stage: 'Seed', matchScore: 95, investmentSize: '$500K', status: 'Not Contacted' },
    { id: 2, investorName: 'Sarah Chen', firm: 'Horizon Capital', leadName: 'MedTech Innovations', industry: 'Healthcare', stage: 'Series A', matchScore: 92, investmentSize: '$2M', status: 'Not Contacted' },
    { id: 3, investorName: 'Emily Davis', firm: 'Davis Investments', leadName: 'EcoEnergy', industry: 'Cleantech', stage: 'Seed', matchScore: 88, investmentSize: '$750K', status: 'Not Contacted' },
    { id: 4, investorName: 'David Wilson', firm: 'Wilson Group', leadName: 'FinanceAI', industry: 'Fintech', stage: 'Series A', matchScore: 85, investmentSize: '$1.5M', status: 'Not Contacted' }
  ]);

  // Get investors for stats based on filter
  const getInvestorsForStats = () => {
    return showMyStats
      ? allInvestors.filter(investor => investor.assignedTo === 'John Doe')
      : allInvestors;
  };

  // Calculate investor statistics
  const getInvestorStats = () => {
    const investors = getInvestorsForStats();
    return {
      activeInvestors: investors.filter(investor => investor.status === 'Active').length,
      prospectiveInvestors: investors.filter(investor => investor.status === 'Prospective').length,
      inactiveInvestors: investors.filter(investor => investor.status === 'Inactive').length,
      totalInvested: investors.reduce((sum, investor) => sum + investor.totalInvested, 0),
      totalDeals: investors.reduce((sum, investor) => sum + investor.deals, 0),
      avgDealSize: investors.reduce((sum, investor) => sum + investor.totalInvested, 0) /
                  (investors.reduce((sum, investor) => sum + investor.deals, 0) || 1)
    };
  };

  const investorStats = getInvestorStats();

  // Industry preference data for the graph
  const getIndustryPreferences = () => {
    const investors = getInvestorsForStats();
    const industryCounts = {};

    investors.forEach(investor => {
      investor.preferredIndustries.forEach(industry => {
        if (industryCounts[industry]) {
          industryCounts[industry]++;
        } else {
          industryCounts[industry] = 1;
        }
      });
    });

    return Object.keys(industryCounts).map(industry => ({
      industry,
      count: industryCounts[industry]
    })).sort((a, b) => b.count - a.count);
  };

  const industryPreferences = getIndustryPreferences();

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

  // Filter and sort investors when filter state or sort config changes
  useEffect(() => {
    let filtered = [...allInvestors];

    // Filter by assignment
    if (showMyStats) {
      filtered = filtered.filter(investor => investor.assignedTo === 'John Doe');
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(investor => investor.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(investor =>
        investor.name.toLowerCase().includes(term) ||
        investor.firm.toLowerCase().includes(term) ||
        investor.email.toLowerCase().includes(term)
      );
    }

    // Sort the filtered investors
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

    setFilteredInvestors(filtered);
  }, [allInvestors, showMyStats, filterStatus, searchTerm, sortConfig]);

  // Initial data fetch
  useEffect(() => {
    // In a real app, you would fetch data based on a fixed date range
    console.log(`Fetching investor data for fixed date range (30d)`);
    // For now, we'll just use our static data
  }, []);

  const handleInvestorClick = (investorId) => {
    navigate(`/dashboard/investors/${investorId}`);
  };

  const handleCreateInvestor = () => {
    navigate('/dashboard/investors/create');
  };

  const handleToggleUploader = () => {
    setShowUploader(!showUploader);
  };

  const handleInvestorsUploaded = (newInvestors) => {
    // In a real app, you would send these to your backend
    // For now, we'll just add them to our local state
    setAllInvestors(prevInvestors => [...prevInvestors, ...newInvestors]);

    // Hide the uploader after successful upload
    setTimeout(() => {
      setShowUploader(false);
    }, 3000);
  };

  // Function to determine status color class
  const getStatusColorClass = (status) => {
    switch(status) {
      case 'Active':
        return 'status-active';
      case 'Prospective':
        return 'status-prospective';
      case 'Inactive':
        return 'status-inactive';
      case 'Not Contacted':
        return 'status-new';
      default:
        return '';
    }
  };

  // Function to get color for industry bars
  const getIndustryColor = (industry) => {
    const colorMap = {
      'SaaS': '#3498db',
      'Fintech': '#2ecc71',
      'Healthcare': '#9b59b6',
      'AI': '#e74c3c',
      'E-commerce': '#f39c12',
      'Mobile': '#1abc9c',
      'Cleantech': '#27ae60',
      'Enterprise': '#8e44ad',
      'Consumer': '#d35400',
      'Retail': '#16a085',
      'Edtech': '#2980b9'
    };

    return colorMap[industry] || '#95a5a6';
  };

  // Function to get top industry
  const getTopIndustry = () => {
    const industryCounts = {};
    getInvestorsForStats().forEach(investor => {
      investor.preferredIndustries.forEach(industry => {
        if (industryCounts[industry]) {
          industryCounts[industry]++;
        } else {
          industryCounts[industry] = 1;
        }
      });
    });
    const sortedIndustries = Object.entries(industryCounts).sort((a, b) => b[1] - a[1]);
    return sortedIndustries.length > 0 ? sortedIndustries[0][0] : 'None';
  };

  // Format meeting date
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

  // Handle shortcut clicks
  const handleShortcutClick = (type) => {
    switch (type) {
      case 'create-investor':
        navigate('/dashboard/investors/create');
        break;
      case 'schedule-meeting':
        navigate('/dashboard/calendar');
        break;
      case 'investor-match':
        // Navigate to investor matching tool
        break;
      case 'report':
        navigate('/dashboard/reports');
        break;
      default:
        break;
    }
  };

  return (
    <>
      <h1 className="dashboard-title">Investors</h1>
      {/* Summary Section */}
      <DashboardSection>
        <p className="summary-text">
          You have {investorStats.activeInvestors} active investors with a total investment of ${investorStats.totalInvested.toLocaleString()} across {investorStats.totalDeals} deals.
          The average deal size is ${Math.round(investorStats.avgDealSize).toLocaleString()}.
          There are {investorStats.prospectiveInvestors} prospective investors in your pipeline.
          Focus on the {getTopIndustry()} sector which has the highest investor interest.
        </p>
      </DashboardSection>

      {/* Investor Statistics Section */}
      <DashboardSection title="Investor Statistics">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>ACTIVE INVESTORS</h3>
            <div className="value">{investorStats.activeInvestors}</div>
          </div>
          <div className="stat-card">
            <h3>TOTAL INVESTED</h3>
            <div className="value">${investorStats.totalInvested.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <h3>TOTAL DEALS</h3>
            <div className="value">{investorStats.totalDeals}</div>
          </div>
          <div className="stat-card">
            <h3>AVG DEAL SIZE</h3>
            <div className="value">${Math.round(investorStats.avgDealSize).toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <h3>PROSPECTIVE</h3>
            <div className="value">{investorStats.prospectiveInvestors}</div>
          </div>
        </div>
      </DashboardSection>

      {/* Industry Preferences Section */}
      <DashboardSection title="Industry Preferences">
        <div className="chart-container">
          <div className="bar-graph" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {industryPreferences.map((item, index) => (
              <div className="bar-item" key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', height: '30px' }}>
                <div className="bar-label" style={{ width: '100px', color: '#94a3b8', fontSize: '14px', flexShrink: 0 }}>{item.industry}</div>
                <div className="bar-container" style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative' }}>
                  <div
                    className="bar"
                    style={{
                      height: '20px',
                      width: `${(item.count / Math.max(...industryPreferences.map(d => d.count))) * 100}%`,
                      minWidth: '30px',
                      backgroundColor: getIndustryColor(item.industry),
                      borderRadius: '4px'
                    }}
                  ></div>
                  <div className="bar-value" style={{ marginLeft: '8px', color: '#ffffff', fontSize: '14px' }}>{item.count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardSection>

      {/* Investor List Section */}
      <DashboardSection
        title="Investor List"
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
                <option value="Prospective">Prospective</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="action-button-container">
              <button className="create-button" onClick={handleCreateInvestor}>
                <FaUserPlus /> Create Investor
              </button>
              <button className="create-button upload-button" onClick={handleToggleUploader}>
                <FaUpload /> {showUploader ? 'Hide Uploader' : 'Upload Investors'}
              </button>
            </div>
          </>
        }
      >
        <div className="table-container">
          <table className="data-table investor-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>
                  Name {getSortIcon('name')}
                </th>
                <th onClick={() => requestSort('firm')} style={{ cursor: 'pointer' }}>
                  Firm {getSortIcon('firm')}
                </th>
                <th onClick={() => requestSort('status')} style={{ cursor: 'pointer' }}>
                  Status {getSortIcon('status')}
                </th>
                <th onClick={() => requestSort('investmentRange')} style={{ cursor: 'pointer' }}>
                  Investment Range {getSortIcon('investmentRange')}
                </th>
                <th onClick={() => requestSort('preferredStage')} style={{ cursor: 'pointer' }}>
                  Stage {getSortIcon('preferredStage')}
                </th>
                <th onClick={() => requestSort('totalInvested')} style={{ cursor: 'pointer' }}>
                  Total Invested {getSortIcon('totalInvested')}
                </th>
                <th onClick={() => requestSort('deals')} style={{ cursor: 'pointer' }}>
                  Deals {getSortIcon('deals')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredInvestors.map(investor => (
                <tr key={investor.id} onClick={() => handleInvestorClick(investor.id)}>
                  <td>{investor.name}</td>
                  <td>{investor.firm}</td>
                  <td>
                    <span className={`status-badge ${getStatusColorClass(investor.status)}`}>
                      {investor.status}
                    </span>
                  </td>
                  <td>{investor.investmentRange}</td>
                  <td>{investor.preferredStage}</td>
                  <td>${investor.totalInvested.toLocaleString()}</td>
                  <td>{investor.deals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardSection>

      {/* Shortcuts Section */}
      <DashboardSection title="Shortcuts">
        <div className="shortcuts-grid">
          <div className="shortcut-card" onClick={() => handleShortcutClick('create-investor')}>
            <div className="shortcut-icon"><FaUserPlus /></div>
            <div className="shortcut-title">Create Investor</div>
          </div>
          <div className="shortcut-card" onClick={() => handleShortcutClick('schedule-meeting')}>
            <div className="shortcut-icon"><FaCalendarAlt /></div>
            <div className="shortcut-title">Schedule Meeting</div>
          </div>
          <div className="shortcut-card" onClick={() => handleShortcutClick('investor-match')}>
            <div className="shortcut-icon"><FaExchangeAlt /></div>
            <div className="shortcut-title">Match Investor</div>
          </div>
          <div className="shortcut-card" onClick={() => handleShortcutClick('report')}>
            <div className="shortcut-icon"><FaChartBar /></div>
            <div className="shortcut-title">Investor Report</div>
          </div>
        </div>
      </DashboardSection>

      {/* File Uploader */}
      {showUploader && (
        <FileUploader
          onFileUploaded={handleInvestorsUploaded}
          validateCSV={validateInvestorsCSV}
          processData={processInvestorsData}
          generateTemplate={generateInvestorsCSVTemplate}
          templateFileName="investors_template.csv"
        />
      )}
    </>
  );
};

export default InvestorDashboard;