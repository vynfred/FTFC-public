import React, { useEffect, useState } from 'react';
import { FaChartBar, FaHandshake, FaMoneyBillWave, FaSort, FaSortDown, FaSortUp, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { investorsData } from '../../data/testData';
import DashboardSection from '../shared/DashboardSection';
import styles from './InvestorDashboard.module.css';

const InvestorDashboard = () => {
  const navigate = useNavigate();

  // State for investors data
  const [investors, setInvestors] = useState(investorsData);
  const [filteredInvestors, setFilteredInvestors] = useState(investorsData);

  // State for sorting
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc'
  });

  // State for filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Effect to filter and sort investors
  useEffect(() => {
    let result = [...investors];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(investor =>
        investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.preferredStage.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(investor => investor.status === filterStatus);
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

    setFilteredInvestors(result);
  }, [investors, searchTerm, filterStatus, sortConfig]);

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
      case 'Active':
        return styles.statusActive;
      case 'Interested':
        return styles.statusInterested;
      case 'Not Interested':
        return styles.statusNotInterested;
      default:
        return styles.statusNeutral;
    }
  };

  // Function to handle investor click
  const handleInvestorClick = (id) => {
    navigate(`/dashboard/investors/${id}`);
  };

  // Function to handle create investor
  const handleCreateInvestor = () => {
    navigate('/dashboard/investors/create');
  };

  // Table actions component for the investors table
  const investorsTableActions = (
    <>
      <div className="filter-container">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search investors..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-actions">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-button"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Interested">Interested</option>
            <option value="Not Interested">Not Interested</option>
          </select>
          <button className="action-button primary-button" onClick={handleCreateInvestor}>
            <FaUserPlus /> Add Investor
          </button>
        </div>
      </div>
    </>
  );

  // Calculate investor statistics
  const totalInvestors = investors.length;
  const activeInvestors = investors.filter(investor => investor.status === 'Active').length;
  const totalInvested = investors.reduce((sum, investor) => sum + investor.totalInvested, 0);
  const totalDeals = investors.reduce((sum, investor) => sum + investor.deals, 0);

  return (
    <div className="dashboard-container">
      {/* Investor Statistics Section */}
      <DashboardSection title="Investor Overview">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FaUserPlus />
            </div>
            <div className="stat-content">
              <h3>Total Investors</h3>
              <p className="stat-value">{totalInvestors}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaChartBar />
            </div>
            <div className="stat-content">
              <h3>Active Investors</h3>
              <p className="stat-value">{activeInvestors}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaMoneyBillWave />
            </div>
            <div className="stat-content">
              <h3>Total Invested</h3>
              <p className="stat-value">${(totalInvested / 1000000).toFixed(1)}M</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaHandshake />
            </div>
            <div className="stat-content">
              <h3>Total Deals</h3>
              <p className="stat-value">{totalDeals}</p>
            </div>
          </div>
        </div>
      </DashboardSection>

      {/* Investors Table Section */}
      <DashboardSection
        title="Investors"
        actions={investorsTableActions}
      >
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('name')}>
                  Name {getSortIcon('name')}
                </th>
                <th onClick={() => requestSort('firm')}>
                  Firm {getSortIcon('firm')}
                </th>
                <th onClick={() => requestSort('status')}>
                  Status {getSortIcon('status')}
                </th>
                <th onClick={() => requestSort('investmentRange')}>
                  Investment Range {getSortIcon('investmentRange')}
                </th>
                <th onClick={() => requestSort('preferredStage')}>
                  Stage {getSortIcon('preferredStage')}
                </th>
                <th onClick={() => requestSort('totalInvested')}>
                  Total Invested {getSortIcon('totalInvested')}
                </th>
                <th onClick={() => requestSort('deals')}>
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
    </div>
  );
};

export default InvestorDashboard;
