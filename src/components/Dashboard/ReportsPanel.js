import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-config';

const ReportsPanel = () => {
  const [reportType, setReportType] = useState('leads');
  const [dateRange, setDateRange] = useState('week');
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      // Implement report generation logic based on reportType and dateRange
      const reportData = await fetchReportData(reportType, dateRange);
      // Generate CSV or PDF
      downloadReport(reportData);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reports-panel">
      <h2>Generate Reports</h2>
      
      <div className="report-options">
        <div className="option-group">
          <label>Report Type</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="leads">Leads Report</option>
            <option value="investors">Investors Report</option>
            <option value="financial">Financial Report</option>
            <option value="activity">Activity Report</option>
          </select>
        </div>

        <div className="option-group">
          <label>Time Range</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        <button 
          className="generate-report-btn"
          onClick={generateReport}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>
    </div>
  );
};

export default ReportsPanel; 