import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaChartBar, FaExchangeAlt, FaSort, FaSortDown, FaSortUp, FaUpload, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useStatsView } from '../../context/StatsViewContext';
import { generateInvestorsCSVTemplate, processInvestorsData, validateInvestorsCSV } from '../../utils/csvUtils';
import FileUploader from '../common/FileUploader';
import DashboardSection from '../shared/DashboardSection';
import Container from '../ui/layout/Container';
import Grid from '../ui/layout/Grid';
import styles from './InvestorDashboard.module.css';

const InvestorDashboardWithModules = ({ dateRange = '7d' }) => {
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

  // Filter data based on dateRange
  useEffect(() => {
    // In a real app, you would fetch data based on the dateRange
    console.log(`Fetching investor data for date range: ${dateRange}`);
    // For now, we'll just use our static data
  }, [dateRange]);

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
        return styles.statusActive;
      case 'Prospective':
        return styles.statusProspective;
      case 'Inactive':
        return styles.statusInactive;
      case 'Not Contacted':
        return styles.statusNew;
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
    <Container fluid>
      {/* Summary Section */}
      <DashboardSection title="Summary">
        <p className={styles.summaryText}>
          You have {investorStats.activeInvestors} active investors with a total investment of ${investorStats.totalInvested.toLocaleString()} across {investorStats.totalDeals} deals.
          The average deal size is ${Math.round(investorStats.avgDealSize).toLocaleString()}.
          There are {investorStats.prospectiveInvestors} prospective investors in your pipeline.
          Focus on the {getTopIndustry()} sector which has the highest investor interest.
        </p>
      </DashboardSection>

      {/* Investor Statistics Section */}
      <DashboardSection title="Investor Statistics">
        <Grid columns={5} mdColumns={3} smColumns={2} gap="md" className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>ACTIVE INVESTORS</h3>
            <div className={styles.value}>{investorStats.activeInvestors}</div>
          </div>
          <div className={styles.statCard}>
            <h3>TOTAL INVESTED</h3>
            <div className={styles.value}>${investorStats.totalInvested.toLocaleString()}</div>
          </div>
          <div className={styles.statCard}>
            <h3>TOTAL DEALS</h3>
            <div className={styles.value}>{investorStats.totalDeals}</div>
          </div>
          <div className={styles.statCard}>
            <h3>AVG DEAL SIZE</h3>
            <div className={styles.value}>${Math.round(investorStats.avgDealSize).toLocaleString()}</div>
          </div>
          <div className={styles.statCard}>
            <h3>PROSPECTIVE</h3>
            <div className={styles.value}>{investorStats.prospectiveInvestors}</div>
          </div>
        </Grid>
      </DashboardSection>

      {/* Upcoming Meetings Section */}
      <DashboardSection title="Upcoming Meetings">
        <div className={styles.meetingsContainer}>
          {upcomingMeetings.length > 0 ? (
            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Investor</th>
                    <th>Firm</th>
                    <th>Date & Time</th>
                    <th>Type</th>
                    <th>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingMeetings.map(meeting => (
                    <tr key={meeting.id}>
                      <td>{meeting.investorName}</td>
                      <td>{meeting.firm}</td>
                      <td>{formatMeetingDate(meeting.date)}</td>
                      <td>{meeting.type}</td>
                      <td>{meeting.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.noDataMessage}>
              <p>No upcoming meetings scheduled</p>
            </div>
          )}
        </div>
      </DashboardSection>

      {/* Industry Preferences Section */}
      <DashboardSection title="Industry Preferences">
        <div className={styles.chartContainer}>
          <div className={styles.barGraph}>
            {industryPreferences.map((item, index) => (
              <div className={styles.barItem} key={index}>
                <div className={styles.barLabel}>{item.industry}</div>
                <div className={styles.barContainer}>
                  <div
                    className={styles.bar}
                    style={{
                      width: `${(item.count / Math.max(...industryPreferences.map(d => d.count))) * 100}%`,
                      backgroundColor: getIndustryColor(item.industry)
                    }}
                  ></div>
                  <div className={styles.barValue}>{item.count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardSection>

      {/* Investor Pairing Tool Section */}
      <DashboardSection title="Investor Pairing Tool">
        <div className={styles.pairingContainer}>
          <p>Based on investor preferences and lead profiles, here are the top potential matches:</p>
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Investor</th>
                  <th>Firm</th>
                  <th>Lead</th>
                  <th>Industry</th>
                  <th>Stage</th>
                  <th>Match Score</th>
                  <th>Investment Size</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {potentialPairings.map(pairing => (
                  <tr key={pairing.id}>
                    <td>{pairing.investorName}</td>
                    <td>{pairing.firm}</td>
                    <td>{pairing.leadName}</td>
                    <td>{pairing.industry}</td>
                    <td>{pairing.stage}</td>
                    <td><strong>{pairing.matchScore}%</strong></td>
                    <td>{pairing.investmentSize}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusColorClass(pairing.status)}`}>
                        {pairing.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardSection>

      {/* Investor List Section */}
      <DashboardSection
        title="Investor List"
        actions={
          <>
            <div className={styles.searchFilterContainer}>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={styles.statusFilter}
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Prospective">Prospective</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className={styles.actionButtonContainer}>
              <button className={styles.createButton} onClick={handleCreateInvestor}>
                <FaUserPlus /> Create Investor
              </button>
              <button className={`${styles.createButton} ${styles.uploadButton}`} onClick={handleToggleUploader}>
                <FaUpload /> {showUploader ? 'Hide Uploader' : 'Upload Investors'}
              </button>
            </div>
          </>
        }
      >
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
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
                    <span className={`${styles.statusBadge} ${getStatusColorClass(investor.status)}`}>
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
        <Grid columns={4} mdColumns={2} smColumns={1} gap="md" className={styles.shortcutsGrid}>
          <div className={styles.shortcutCard} onClick={() => handleShortcutClick('create-investor')}>
            <div className={styles.shortcutIcon}><FaUserPlus /></div>
            <div className={styles.shortcutTitle}>Create Investor</div>
          </div>
          <div className={styles.shortcutCard} onClick={() => handleShortcutClick('schedule-meeting')}>
            <div className={styles.shortcutIcon}><FaCalendarAlt /></div>
            <div className={styles.shortcutTitle}>Schedule Meeting</div>
          </div>
          <div className={styles.shortcutCard} onClick={() => handleShortcutClick('investor-match')}>
            <div className={styles.shortcutIcon}><FaExchangeAlt /></div>
            <div className={styles.shortcutTitle}>Match Investor</div>
          </div>
          <div className={styles.shortcutCard} onClick={() => handleShortcutClick('report')}>
            <div className={styles.shortcutIcon}><FaChartBar /></div>
            <div className={styles.shortcutTitle}>Investor Report</div>
          </div>
        </Grid>
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
    </Container>
  );
};

export default InvestorDashboardWithModules;
