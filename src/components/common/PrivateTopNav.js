import React from 'react';
import { FaBars, FaSearch } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useDateRange } from '../../context/DateRangeContext';
import { useStatsView } from '../../context/StatsViewContext';
import styles from './PrivateTopNav.module.css';

const PrivateTopNav = ({ toggleMobileMenu }) => {
  const { dateRange, setDateRange, dateRanges } = useDateRange();
  const { viewCompanyStats, setViewCompanyStats } = useStatsView();
  const location = useLocation();
  const pathname = location.pathname;

  // Define which pages should show date range selector and stats toggle
  const showDateRange = [
    '/dashboard',
    '/dashboard/marketing',
    '/dashboard/leads',
    '/dashboard/clients',
    '/dashboard/investors'
  ].some(path => pathname === path || pathname.startsWith(`${path}/`));

  // Define which pages should show stats toggle
  const showStatsToggle = [
    '/dashboard',
    '/dashboard/marketing',
    '/dashboard/leads',
    '/dashboard/clients',
    '/dashboard/investors'
  ].some(path => pathname === path || pathname.startsWith(`${path}/`));

  return (
    <div className={styles.topNav}>
      <div className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
        <FaBars />
      </div>

      <div className={styles.logo}>
        <Link to="/dashboard">FTFC</Link>
      </div>

      <div className={styles.searchBar}>
        <FaSearch className={styles.searchIcon} />
        <input type="text" placeholder="Search..." />
      </div>

      <div className={styles.navControls}>
        {showDateRange && (
          <div className={styles.dateRangeSelector}>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className={styles.dateRangeSelect}
            >
              {dateRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
        )}

        {showStatsToggle && (
          <div className={styles.statsToggle}>
            <div className={styles.toggleButtons}>
              <button
                className={`${styles.statsButton} ${viewCompanyStats ? styles.active : ''}`}
                onClick={() => setViewCompanyStats(true)}
              >
                Company
              </button>
              <button
                className={`${styles.statsButton} ${!viewCompanyStats ? styles.active : ''}`}
                onClick={() => setViewCompanyStats(false)}
              >
                My Stats
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivateTopNav;
