import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDateRange } from '../../context/DateRangeContext';
import { useStatsView } from '../../context/StatsViewContext';

const PrivateTopNav = () => {
  const { dateRange, setDateRange, dateRanges } = useDateRange();
  const { viewCompanyStats, setViewCompanyStats } = useStatsView();

  return (
    <div className="top-nav">
      <div className="logo">
        <Link to="/dashboard">FTFC</Link>
      </div>

      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search..." />
      </div>

      <div className="nav-controls">
        <div className="date-range-selector">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="date-range-select"
          >
            {dateRanges.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        <div className="stats-toggle">
          <button
            className={`stats-button ${viewCompanyStats ? 'active' : ''}`}
            onClick={() => setViewCompanyStats(!viewCompanyStats)}
          >
            Company Stats
          </button>
        </div>
      </div>

      <style>{`
        .top-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          height: 60px;
          background-color: #0f172a;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }

        .logo a {
          font-size: 24px;
          font-weight: 700;
          color: #f59e0b;
          text-decoration: none;
        }

        .search-bar {
          display: flex;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          padding: 6px 12px;
          margin: 0 20px;
          flex: 1;
          max-width: 400px;
        }

        .search-icon {
          color: #94a3b8;
          margin-right: 8px;
        }

        .search-bar input {
          background: transparent;
          border: none;
          color: #ffffff;
          outline: none;
          width: 100%;
        }

        .search-bar input::placeholder {
          color: #94a3b8;
        }

        .nav-controls {
          display: flex;
          align-items: center;
        }

        .date-range-selector {
          margin-right: 16px;
        }

        .date-range-select {
          background-color: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: none;
          border-radius: 4px;
          padding: 6px 12px;
          outline: none;
          cursor: pointer;
        }

        .stats-toggle {
          margin-right: 16px;
        }

        .stats-button {
          background-color: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: none;
          border-radius: 4px;
          padding: 6px 12px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .stats-button.active {
          background-color: #f59e0b;
          color: #0f172a;
        }

        .stats-button:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .stats-button.active:hover {
          background-color: #e08e0b;
        }
      `}</style>
    </div>
  );
};

export default PrivateTopNav;
