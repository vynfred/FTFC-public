import React from 'react';
import { FaChartBar, FaChartLine, FaChartPie, FaUsers } from 'react-icons/fa';
import { useDateRange } from '../../context/DateRangeContext';
import { useStatsView } from '../../context/StatsViewContext';

const Analytics = () => {
  const { dateRange } = useDateRange();
  const { viewCompanyStats } = useStatsView();

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-section">
        <h2 className="section-title">Analytics Overview</h2>
        <div className="analytics-content">
          <p>Detailed analytics for {viewCompanyStats ? 'company' : 'your'} performance during {dateRange}.</p>
          <div className="analytics-placeholder">
            <FaChartBar className="placeholder-icon" />
            <p>Analytics charts and data will be displayed here.</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Performance Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">
              <FaUsers />
            </div>
            <div className="metric-content">
              <h3 className="metric-title">Lead Conversion</h3>
              <p className="metric-value">24.8%</p>
              <p className="metric-change positive">+3.2%</p>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">
              <FaChartLine />
            </div>
            <div className="metric-content">
              <h3 className="metric-title">Revenue Growth</h3>
              <p className="metric-value">12.5%</p>
              <p className="metric-change positive">+2.1%</p>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">
              <FaChartPie />
            </div>
            <div className="metric-content">
              <h3 className="metric-title">Market Share</h3>
              <p className="metric-value">8.3%</p>
              <p className="metric-change positive">+0.7%</p>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">
              <FaUsers />
            </div>
            <div className="metric-content">
              <h3 className="metric-title">Customer Retention</h3>
              <p className="metric-value">92.1%</p>
              <p className="metric-change positive">+1.5%</p>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .analytics-dashboard {
          width: 100%;
        }
        
        .analytics-content {
          padding: 16px;
        }
        
        .analytics-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 60px 20px;
          margin-top: 20px;
        }
        
        .placeholder-icon {
          font-size: 48px;
          color: #94a3b8;
          margin-bottom: 16px;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          padding: 16px;
        }
        
        .metric-card {
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 16px;
          display: flex;
          align-items: center;
        }
        
        .metric-icon {
          width: 48px;
          height: 48px;
          background-color: rgba(245, 158, 11, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f59e0b;
          font-size: 24px;
          margin-right: 16px;
        }
        
        .metric-content {
          flex: 1;
        }
        
        .metric-title {
          font-size: 14px;
          color: #94a3b8;
          margin: 0 0 8px 0;
          font-weight: 500;
        }
        
        .metric-value {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 4px 0;
        }
        
        .metric-change {
          font-size: 14px;
          font-weight: 500;
          margin: 0;
        }
        
        .positive {
          color: #10b981;
        }
        
        .negative {
          color: #ef4444;
        }
      `}</style>
    </div>
  );
};

export default Analytics;
