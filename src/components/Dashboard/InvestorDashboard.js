import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FaChartBar, FaHandshake, FaMoneyBillWave, FaSort, FaSortDown, FaSortUp, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase-config';
import SimpleSearch from '../common/SimpleSearch';
import DashboardSection from '../shared/DashboardSection';
import styles from './InvestorDashboard.module.css';

const InvestorDashboard = () => {
  const navigate = useNavigate();

  // State for investors data
  const [investors, setInvestors] = useState([]);
  const [filteredInvestors, setFilteredInvestors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch investors from Firebase
  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        setLoading(true);
        const investorsQuery = query(collection(db, 'investors'));
        const snapshot = await getDocs(investorsQuery);
        const investorsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Ensure all required fields have default values
          name: doc.data().name || 'Unnamed Investor',
          firm: doc.data().firm || 'Unknown Firm',
          status: doc.data().status || 'Active',
          investmentRange: doc.data().investmentRange || 'Unknown',
          preferredStage: doc.data().preferredStage || 'Unknown',
          totalInvested: doc.data().totalInvested || 0,
          deals: doc.data().deals || 0
        }));
        setInvestors(investorsList);
        setFilteredInvestors(investorsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching investors:', error);
        setLoading(false);
      }
    };

    fetchInvestors();
  }, []);

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
          <SimpleSearch
            placeholder="Search investors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="simple-search"
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
              {filteredInvestors.length > 0 ? (
                filteredInvestors.map(investor => (
                  <tr key={investor.id} onClick={() => handleInvestorClick(investor.id)}>
                    <td>{investor.name || 'N/A'}</td>
                    <td>{investor.firm || 'N/A'}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusColorClass(investor.status)}`}>
                        {investor.status || 'N/A'}
                      </span>
                    </td>
                    <td>{investor.investmentRange || 'N/A'}</td>
                    <td>{investor.preferredStage || 'N/A'}</td>
                    <td>{investor.totalInvested !== undefined ? `$${investor.totalInvested.toLocaleString()}` : 'N/A'}</td>
                    <td>{investor.deals !== undefined ? investor.deals : 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr className="empty-table-row">
                  <td colSpan="7" className="empty-table-cell">
                    <div className="empty-table-message">
                      <p>No investors present</p>
                      <button className="action-button primary-button" onClick={handleCreateInvestor}>
                        <FaUserPlus /> Add Investor
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DashboardSection>
    </div>
  );
};

export default InvestorDashboard;
