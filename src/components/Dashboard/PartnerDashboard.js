import React, { useEffect, useState } from 'react';
import { FaBuilding, FaChartLine, FaCheck, FaCopy, FaEdit, FaEye, FaFilter, FaHandshake, FaSearch, FaSort, FaSortDown, FaSortUp, FaUpload, FaUserFriends, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useStatsView } from '../../context/StatsViewContext';
import './DashboardStyles.css';
// CSS is now imported globally
import FileUploader from '../common/FileUploader';
import DashboardSection from '../shared/DashboardSection';

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [copiedLink, setCopiedLink] = useState(null);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [filteredReferrals, setFilteredReferrals] = useState([]);
  const [showUploader, setShowUploader] = useState(false);
  const { viewCompanyStats } = useStatsView();

  // Example partners data
  const [allPartners, setAllPartners] = useState([
    { id: 1, name: 'Alex Morgan', company: 'Morgan Consulting', email: 'alex@morganconsulting.com', phone: '(555) 123-4567', status: 'Active', totalReferrals: 12, successfulReferrals: 8, commissionEarned: 24000, lastActive: '2024-03-01', assignedTo: 'John Doe' },
    { id: 2, name: 'Sarah Chen', company: 'Chen Partners', email: 'sarah@chenpartners.com', phone: '(555) 234-5678', status: 'Active', totalReferrals: 9, successfulReferrals: 6, commissionEarned: 18000, lastActive: '2024-03-02', assignedTo: 'Jane Smith' },
    { id: 3, name: 'Michael Johnson', company: 'Johnson Group', email: 'michael@johnsongroup.com', phone: '(555) 345-6789', status: 'Inactive', totalReferrals: 5, successfulReferrals: 2, commissionEarned: 6000, lastActive: '2024-02-15', assignedTo: 'John Doe' },
    { id: 4, name: 'Emily Davis', company: 'Davis Connections', email: 'emily@davisconnections.com', phone: '(555) 456-7890', status: 'Active', totalReferrals: 15, successfulReferrals: 10, commissionEarned: 30000, lastActive: '2024-03-04', assignedTo: 'John Doe' },
    { id: 5, name: 'David Wilson', company: 'Wilson Associates', email: 'david@wilsonassociates.com', phone: '(555) 567-8901', status: 'Prospective', totalReferrals: 0, successfulReferrals: 0, commissionEarned: 0, lastActive: '2024-03-05', assignedTo: 'Jane Smith' },
  ]);

  // Example referrals data
  const [allReferrals, setAllReferrals] = useState([
    { id: 1, clientName: 'Tech Solutions Inc', referredBy: 'Alex Morgan', referralDate: '2024-02-10', status: 'Converted', value: 150000, commissionPaid: 7500, type: 'Client', assignedTo: 'John Doe' },
    { id: 2, name: 'Growth Ventures LLC', referredBy: 'Sarah Chen', referralDate: '2024-02-15', status: 'In Progress', value: 85000, commissionPaid: 0, type: 'Client', assignedTo: 'Jane Smith' },
    { id: 3, name: 'Morgan Ventures', referredBy: 'Emily Davis', referralDate: '2024-02-20', status: 'Converted', value: 200000, commissionPaid: 10000, type: 'Investor', assignedTo: 'John Doe' },
    { id: 4, name: 'Global Retail Partners', referredBy: 'Alex Morgan', referralDate: '2024-02-25', status: 'Converted', value: 120000, commissionPaid: 6000, type: 'Client', assignedTo: 'John Doe' },
    { id: 5, name: 'Horizon Capital', referredBy: 'Emily Davis', referralDate: '2024-03-01', status: 'In Progress', value: 300000, commissionPaid: 0, type: 'Investor', assignedTo: 'Jane Smith' },
    { id: 6, name: 'NextGen Software', referredBy: 'Sarah Chen', referralDate: '2024-03-05', status: 'In Progress', value: 95000, commissionPaid: 0, type: 'Client', assignedTo: 'Jane Smith' },
    { id: 7, name: 'Davis Investments', referredBy: 'Emily Davis', referralDate: '2024-03-10', status: 'Converted', value: 175000, commissionPaid: 8750, type: 'Investor', assignedTo: 'John Doe' },
  ]);

  // Example partner groups data
  const [partnerGroups, setPartnerGroups] = useState([
    { id: 1, name: 'Tech Advisors', members: 12, focus: 'Technology Startups', totalReferrals: 45, successRate: 78 },
    { id: 2, name: 'Finance Network', members: 8, focus: 'Financial Services', totalReferrals: 32, successRate: 65 },
    { id: 3, name: 'Healthcare Connections', members: 15, focus: 'Healthcare & Biotech', totalReferrals: 38, successRate: 72 },
    { id: 4, name: 'Retail Alliance', members: 10, focus: 'Retail & E-commerce', totalReferrals: 28, successRate: 60 },
  ]);

  // Initial data fetch
  useEffect(() => {
    // In a real app, you would fetch data based on a fixed date range
    console.log(`Fetching partner data for fixed date range (30d)`);
    // For now, we'll just use our static data
  }, []);

  // Get partners for stats based on filter
  const getPartnersForStats = () => {
    return !viewCompanyStats
      ? allPartners.filter(partner => partner.assignedTo === 'John Doe')
      : allPartners;
  };

  // Calculate partner statistics
  const getPartnerStats = () => {
    const partners = getPartnersForStats();
    return {
      activePartners: partners.filter(partner => partner.status === 'Active').length,
      totalReferrals: partners.reduce((sum, partner) => sum + partner.totalReferrals, 0),
      successfulReferrals: partners.reduce((sum, partner) => sum + partner.successfulReferrals, 0),
      totalCommission: partners.reduce((sum, partner) => sum + partner.commissionEarned, 0),
      conversionRate: partners.reduce((sum, partner) => sum + partner.successfulReferrals, 0) /
                     (partners.reduce((sum, partner) => sum + partner.totalReferrals, 0) || 1) * 100
    };
  };

  const partnerStats = getPartnerStats();

  // Get referrals for stats based on filter
  const getReferralsForStats = () => {
    return !viewCompanyStats
      ? allReferrals.filter(referral => referral.assignedTo === 'John Doe')
      : allReferrals;
  };

  // Calculate referral statistics
  const getReferralStats = () => {
    const referrals = getReferralsForStats();
    return {
      totalReferrals: referrals.length,
      convertedReferrals: referrals.filter(referral => referral.status === 'Converted').length,
      inProgressReferrals: referrals.filter(referral => referral.status === 'In Progress').length,
      totalValue: referrals.reduce((sum, referral) => sum + referral.value, 0),
      totalCommissionPaid: referrals.reduce((sum, referral) => sum + referral.commissionPaid, 0),
      clientReferrals: referrals.filter(referral => referral.type === 'Client').length,
      investorReferrals: referrals.filter(referral => referral.type === 'Investor').length
    };
  };

  const referralStats = getReferralStats();

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

  // Filter and sort partners and referrals when filter state or sort config changes
  useEffect(() => {
    // Filter partners
    let filtered = [...allPartners];

    // Filter by assignment
    if (!viewCompanyStats) {
      filtered = filtered.filter(partner => partner.assignedTo === 'John Doe');
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(partner => partner.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(partner =>
        partner.name.toLowerCase().includes(term) ||
        partner.company.toLowerCase().includes(term) ||
        partner.email.toLowerCase().includes(term)
      );
    }

    // Sort the filtered partners
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        // Handle date sorting
        if (sortConfig.key === 'lastActive') {
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

    setFilteredPartners(filtered);

    // Filter referrals
    let filteredReferralsList = [...allReferrals];

    // Filter by assignment
    if (!viewCompanyStats) {
      filteredReferralsList = filteredReferralsList.filter(referral => referral.assignedTo === 'John Doe');
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredReferralsList = filteredReferralsList.filter(referral =>
        referral.clientName?.toLowerCase().includes(term) ||
        referral.name?.toLowerCase().includes(term) ||
        referral.referredBy.toLowerCase().includes(term)
      );
    }

    // Sort the filtered referrals
    if (sortConfig.key) {
      filteredReferralsList.sort((a, b) => {
        // Handle date sorting
        if (sortConfig.key === 'referralDate') {
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

    setFilteredReferrals(filteredReferralsList);
  }, [allPartners, allReferrals, viewCompanyStats, filterStatus, searchTerm, sortConfig]);

  // Handle partner click
  const handlePartnerClick = (partnerId) => {
    navigate(`/dashboard/partners/${partnerId}`);
  };

  // Handle referral click
  const handleReferralClick = (referral) => {
    if (referral.type === 'Client') {
      navigate(`/dashboard/clients/${referral.id}`);
    } else if (referral.type === 'Investor') {
      navigate(`/dashboard/investors/${referral.id}`);
    }
  };

  // Handle group click
  const handleGroupClick = (groupId) => {
    navigate(`/dashboard/partner-groups/${groupId}`);
  };

  // Handle create partner
  const handleCreatePartner = () => {
    navigate('/dashboard/partners/create');
  };

  // Handle create group
  const handleCreateGroup = () => {
    navigate('/dashboard/partner-groups/create');
  };

  // Generate referral link
  const generateReferralLink = (type) => {
    const baseUrl = window.location.origin;
    const userId = 'JohnDoe'; // This would come from the authenticated user
    const currentDate = new Date().toISOString().split('T')[0];

    if (type === 'client') {
      return `${baseUrl}/intake/client/${userId}?utm_source=referral&utm_medium=dashboard&utm_campaign=client_intake&utm_content=${userId}&utm_term=${currentDate}`;
    } else if (type === 'investor') {
      return `${baseUrl}/intake/investor/${userId}?utm_source=referral&utm_medium=dashboard&utm_campaign=investor_intake&utm_content=${userId}&utm_term=${currentDate}`;
    } else if (type === 'partner') {
      return `${baseUrl}/intake/partner/${userId}?utm_source=referral&utm_medium=dashboard&utm_campaign=partner_agreement&utm_content=${userId}&utm_term=${currentDate}`;
    }

    return '';
  };

  // Function to determine status color class
  const getStatusColorClass = (status) => {
    switch(status) {
      case 'Active':
        return 'status-active';
      case 'Inactive':
        return 'status-inactive';
      case 'Prospective':
        return 'status-prospective';
      case 'Converted':
        return 'status-completed';
      case 'In Progress':
        return 'status-scheduled';
      default:
        return '';
    }
  };

  // Handle copying referral link to clipboard
  const handleCopyLink = (type) => {
    const link = generateReferralLink(type);
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopiedLink(type);
        setTimeout(() => setCopiedLink(null), 3000); // Reset after 3 seconds
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
      });
  };

  // Handle partner CSV upload
  const handlePartnerCSVUpload = (file) => {
    console.log("Partner CSV uploaded:", file);
    // Process the CSV file
    // In a real app, you would parse the CSV and update the partners list
    setShowUploader(false);
    // Simulating added partners
    alert("CSV uploaded successfully");
  };

  // Handle download template
  const handleDownloadTemplate = () => {
    // In a real app, you would generate a CSV template file
    console.log("Downloading template...");
    const template = "Name,Company,Email,Phone,Status\nJohn Doe,Acme Inc,john@acme.com,(555) 123-4567,Active";
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "partner_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Get row class for partner row based on status
  const getRowClass = (status) => {
    switch (status) {
      case 'Active':
        return 'row-active';
      case 'Inactive':
        return 'row-inactive';
      case 'Prospective':
        return 'row-pending';
      default:
        return '';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Get row class for referral row based on status
  const getReferralRowClass = (status) => {
    switch (status) {
      case 'Converted':
        return 'row-success';
      case 'In Progress':
        return 'row-pending';
      default:
        return '';
    }
  };

  return (
    <>
      <div className="partners-header">
        <h1>Partners</h1>
      </div>
      {/* AI Summary */}
      <DashboardSection>
        <p className="summary-text">
          You have {partnerStats.activePartners} active partners who have generated {partnerStats.totalReferrals} referrals with a conversion rate of {Math.round(partnerStats.conversionRate)}%. This has resulted in ${partnerStats.totalCommission.toLocaleString()} in commissions paid. The Tech Advisors group has the highest success rate at 78%. Focus on nurturing your {referralStats.inProgressReferrals} in-progress referrals to increase your conversion rate.
        </p>
      </DashboardSection>

      {/* Stats Grid */}
      <DashboardSection title="Partner Metrics">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>ACTIVE PARTNERS</h3>
            <div className="value">{partnerStats.activePartners}</div>
          </div>
          <div className="stat-card">
            <h3>TOTAL REFERRALS</h3>
            <div className="value">{partnerStats.totalReferrals}</div>
          </div>
          <div className="stat-card">
            <h3>CONVERSION RATE</h3>
            <div className="value">{Math.round(partnerStats.conversionRate)}%</div>
          </div>
          <div className="stat-card">
            <h3>TOTAL COMMISSION</h3>
            <div className="value">${partnerStats.totalCommission.toLocaleString()}</div>
          </div>
        </div>
      </DashboardSection>

      {/* Partners Table */}
      <DashboardSection title="Partners"
        actions={
          <div className="table-actions">
            <button className="action-button" onClick={() => setShowUploader(!showUploader)}>
              <FaUpload /> Import CSV
            </button>
            <button className="action-button" onClick={() => navigate('/dashboard/create-partner')}>
              <FaUserPlus /> Add Partner
            </button>
          </div>
        }>
        {showUploader && (
          <div className="csv-uploader">
            <FileUploader
              onUpload={handlePartnerCSVUpload}
              onCancel={() => setShowUploader(false)}
              onDownloadTemplate={() => handleDownloadTemplate()}
              acceptedFileTypes=".csv"
              maxFileSizeMB={5}
            />
          </div>
        )}

        <div className="table-filters">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search partners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <FaFilter className="filter-icon" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Partners</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Prospective">Prospective</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table partner-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('name')}>
                  Partner Name {getSortIcon('name')}
                </th>
                <th onClick={() => requestSort('company')}>
                  Company {getSortIcon('company')}
                </th>
                <th onClick={() => requestSort('status')}>
                  Status {getSortIcon('status')}
                </th>
                <th onClick={() => requestSort('totalReferrals')}>
                  Referrals {getSortIcon('totalReferrals')}
                </th>
                <th onClick={() => requestSort('commissionEarned')}>
                  Commission {getSortIcon('commissionEarned')}
                </th>
                <th onClick={() => requestSort('lastActive')}>
                  Last Active {getSortIcon('lastActive')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPartners.map(partner => (
                <tr key={partner.id} className={getRowClass(partner.status)}>
                  <td>{partner.name}</td>
                  <td>{partner.company}</td>
                  <td>
                    <span className={`status-badge ${partner.status.toLowerCase()}`}>
                      {partner.status}
                    </span>
                  </td>
                  <td>{partner.totalReferrals}</td>
                  <td>${partner.commissionEarned.toLocaleString()}</td>
                  <td>{formatDate(partner.lastActive)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-button" onClick={() => navigate(`/dashboard/partner/${partner.id}`)}>
                        <FaEye />
                      </button>
                      <button className="icon-button" onClick={() => navigate(`/dashboard/partner/${partner.id}/edit`)}>
                        <FaEdit />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardSection>

      {/* Referrals Table */}
      <DashboardSection title="Recent Referrals"
        actions={
          <button className="action-button" onClick={() => navigate('/dashboard/referrals')}>
            <FaHandshake /> View All
          </button>
        }>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Referred By</th>
                <th>Date</th>
                <th>Status</th>
                <th>Value</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReferrals.slice(0, 5).map(referral => (
                <tr key={referral.id} className={getReferralRowClass(referral.status)}>
                  <td>{referral.name || referral.clientName}</td>
                  <td>{referral.referredBy}</td>
                  <td>{formatDate(referral.referralDate)}</td>
                  <td>
                    <span className={`status-badge ${referral.status.toLowerCase().replace(' ', '-')}`}>
                      {referral.status}
                    </span>
                  </td>
                  <td>${referral.value.toLocaleString()}</td>
                  <td>{referral.type}</td>
                  <td>
                    <button className="icon-button" onClick={() => navigate(`/dashboard/${referral.type.toLowerCase()}/${referral.id}`)}>
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardSection>

      {/* Referral Links */}
      <DashboardSection title="Referral Links">
        <div className="referral-links-container">
          <div className="referral-link-card">
            <h3><FaUserFriends /> Client Referral</h3>
            <div className="link-container">
              <input
                type="text"
                value={`https://ftfc.com/client-intake?ref=johndoe`}
                readOnly
                className="link-input"
              />
              <button
                className="copy-button"
                onClick={() => handleCopyLink('client')}
              >
                {copiedLink === 'client' ? <FaCheck /> : <FaCopy />}
              </button>
            </div>
            <p className="link-description">Share this link with potential clients to track your referrals.</p>
          </div>

          <div className="referral-link-card">
            <h3><FaChartLine /> Investor Referral</h3>
            <div className="link-container">
              <input
                type="text"
                value={`https://ftfc.com/investor-intake?ref=johndoe`}
                readOnly
                className="link-input"
              />
              <button
                className="copy-button"
                onClick={() => handleCopyLink('investor')}
              >
                {copiedLink === 'investor' ? <FaCheck /> : <FaCopy />}
              </button>
            </div>
            <p className="link-description">Share this link with potential investors to track your referrals.</p>
          </div>

          <div className="referral-link-card">
            <h3><FaBuilding /> Partner Referral</h3>
            <div className="link-container">
              <input
                type="text"
                value={`https://ftfc.com/partner-intake?ref=johndoe`}
                readOnly
                className="link-input"
              />
              <button
                className="copy-button"
                onClick={() => handleCopyLink('partner')}
              >
                {copiedLink === 'partner' ? <FaCheck /> : <FaCopy />}
              </button>
            </div>
            <p className="link-description">Share this link with potential partners to grow your network.</p>
          </div>
        </div>
      </DashboardSection>
    </>
  );
};

export default PartnerDashboard;