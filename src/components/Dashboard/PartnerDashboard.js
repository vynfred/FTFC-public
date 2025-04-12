import React, { useEffect, useState } from 'react';
import { FaChartBar, FaHandshake, FaMoneyBillWave, FaSort, FaSortDown, FaSortUp, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { partnersData } from '../../data/testData';
import DashboardSection from '../shared/DashboardSection';
import styles from './PartnerDashboard.module.css';

const PartnerDashboard = () => {
  const navigate = useNavigate();

  // State for partners data
  const [partners, setPartners] = useState(partnersData);
  const [filteredPartners, setFilteredPartners] = useState(partnersData);

  // State for sorting
  const [sortConfig, setSortConfig] = useState({
    key: 'referrals',
    direction: 'desc'
  });

  // State for filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Effect to filter and sort partners
  useEffect(() => {
    let result = [...partners];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(partner =>
        partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.contactName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(partner => partner.status === filterStatus);
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

    setFilteredPartners(result);
  }, [partners, searchTerm, filterStatus, sortConfig]);

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
      case 'Inactive':
        return styles.statusInactive;
      default:
        return styles.statusNeutral;
    }
  };

  // Function to handle partner click
  const handlePartnerClick = (id) => {
    navigate(`/dashboard/partners/${id}`);
  };

  // Function to handle create partner
  const handleCreatePartner = () => {
    navigate('/dashboard/partners/create');
  };

  // Table actions component for the partners table
  const partnersTableActions = (
    <>
      <div className="filter-container">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search partners..."
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
            <option value="Inactive">Inactive</option>
          </select>
          <button className="action-button primary-button" onClick={handleCreatePartner}>
            <FaUserPlus /> Add Partner
          </button>
        </div>
      </div>
    </>
  );

  // Calculate partner statistics
  const totalPartners = partners.length;
  const activePartners = partners.filter(partner => partner.status === 'Active').length;
  const totalReferrals = partners.reduce((sum, partner) => sum + partner.referrals, 0);
  const totalCommission = partners.reduce((sum, partner) => {
    const commissionValue = parseFloat(partner.commission.replace(/[^0-9.-]+/g, ''));
    return sum + commissionValue;
  }, 0);

  return (
    <div className="dashboard-container">
      {/* Partner Statistics Section */}
      <DashboardSection title="Partner Overview">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FaUserPlus />
            </div>
            <div className="stat-content">
              <h3>Total Partners</h3>
              <p className="stat-value">{totalPartners}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaChartBar />
            </div>
            <div className="stat-content">
              <h3>Active Partners</h3>
              <p className="stat-value">{activePartners}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaHandshake />
            </div>
            <div className="stat-content">
              <h3>Total Referrals</h3>
              <p className="stat-value">{totalReferrals}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaMoneyBillWave />
            </div>
            <div className="stat-content">
              <h3>Total Commission</h3>
              <p className="stat-value">${totalCommission.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </DashboardSection>

      {/* Partners Table Section */}
      <DashboardSection
        title="Partners"
        actions={partnersTableActions}
      >
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('name')}>
                  Name {getSortIcon('name')}
                </th>
                <th onClick={() => requestSort('type')}>
                  Type {getSortIcon('type')}
                </th>
                <th onClick={() => requestSort('status')}>
                  Status {getSortIcon('status')}
                </th>
                <th onClick={() => requestSort('referrals')}>
                  Referrals {getSortIcon('referrals')}
                </th>
                <th onClick={() => requestSort('lastReferral')}>
                  Last Referral {getSortIcon('lastReferral')}
                </th>
                <th onClick={() => requestSort('commission')}>
                  Commission {getSortIcon('commission')}
                </th>
                <th onClick={() => requestSort('contactName')}>
                  Contact {getSortIcon('contactName')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPartners.map(partner => (
                <tr key={partner.id} onClick={() => handlePartnerClick(partner.id)}>
                  <td>{partner.name}</td>
                  <td>{partner.type}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusColorClass(partner.status)}`}>
                      {partner.status}
                    </span>
                  </td>
                  <td>{partner.referrals}</td>
                  <td>{new Date(partner.lastReferral).toLocaleDateString()}</td>
                  <td>{partner.commission}</td>
                  <td>{partner.contactName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardSection>
    </div>
  );
};

export default PartnerDashboard;
