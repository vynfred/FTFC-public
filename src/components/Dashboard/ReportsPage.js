import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { format } from 'date-fns';
import { CSVLink } from 'react-csv';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Logo from '../../assets/logo';

// Add Chart.js registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ReportsPage = () => {
  const [reportType, setReportType] = useState('leads');
  const [dateRange, setDateRange] = useState('week');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState('line');
  const [chartData, setChartData] = useState(null);

  const generateReport = async () => {
    setLoading(true);
    try {
      let data = [];
      const startDate = getStartDate(dateRange);
      
      switch(reportType) {
        case 'leads':
          data = await fetchLeadsReport(startDate);
          break;
        case 'investors':
          data = await fetchInvestorsReport(startDate);
          break;
        case 'pipeline':
          data = await fetchPipelineReport();
          break;
        default:
          break;
      }
      
      setReportData(data);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = (range) => {
    const date = new Date();
    switch(range) {
      case 'week':
        date.setDate(date.getDate() - 7);
        break;
      case 'month':
        date.setMonth(date.getMonth() - 1);
        break;
      case 'quarter':
        date.setMonth(date.getMonth() - 3);
        break;
      case 'year':
        date.setFullYear(date.getFullYear() - 1);
        break;
      default:
        break;
    }
    return date;
  };

  const fetchLeadsReport = async (startDate) => {
    const leadsQuery = query(
      collection(db, 'leads'),
      where('createdAt', '>=', startDate),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(leadsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: format(doc.data().createdAt.toDate(), 'yyyy-MM-dd')
    }));
  };

  const fetchInvestorsReport = async (startDate) => {
    const investorsQuery = query(
      collection(db, 'investors'),
      where('createdAt', '>=', startDate),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(investorsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: format(doc.data().createdAt.toDate(), 'yyyy-MM-dd')
    }));
  };

  const fetchPipelineReport = async () => {
    const leadsQuery = query(collection(db, 'leads'));
    const snapshot = await getDocs(leadsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      lastUpdated: doc.data().lastUpdated ? 
        format(doc.data().lastUpdated.toDate(), 'yyyy-MM-dd') : 'N/A'
    }));
  };

  useEffect(() => {
    if (reportData.length > 0) {
      prepareChartData();
    }
  }, [reportData]);

  const prepareChartData = () => {
    switch(reportType) {
      case 'leads':
        prepareLeadsChartData();
        break;
      case 'investors':
        prepareInvestorsChartData();
        break;
      case 'pipeline':
        preparePipelineChartData();
        break;
      default:
        break;
    }
  };

  const prepareLeadsChartData = () => {
    const dates = [...new Set(reportData.map(item => item.createdAt))].sort();
    const data = dates.map(date => 
      reportData.filter(item => item.createdAt === date).length
    );

    setChartData({
      labels: dates,
      datasets: [{
        label: 'New Leads',
        data: data,
        borderColor: '#C6A052',
        backgroundColor: 'rgba(198, 160, 82, 0.2)',
      }]
    });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `${reportType}-report-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  return (
    <div className="reports-page">
      <div className="report-branding">
        <Logo />
        <h2 className="report-title">Analytics & Reports</h2>
      </div>

      <h2>Generate Reports</h2>
      
      <div className="reports-controls">
        <div className="control-group">
          <label>Report Type</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="leads">Leads Report</option>
            <option value="investors">Investors Report</option>
            <option value="pipeline">Pipeline Report</option>
          </select>
        </div>

        <div className="control-group">
          <label>Date Range</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        <button 
          className="generate-button"
          onClick={generateReport}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {reportData.length > 0 && (
        <>
          <div className="report-results">
            <div className="report-header">
              <h3>Report Results</h3>
              <div className="export-options">
                <CSVLink 
                  data={reportData}
                  filename={`${reportType}-report-${format(new Date(), 'yyyy-MM-dd')}.csv`}
                  className="export-button"
                >
                  Export CSV
                </CSVLink>
                <button onClick={exportToExcel} className="export-button export-excel">
                  Export Excel
                </button>
                <PDFDownloadLink
                  document={<ReportPDF data={reportData} type={reportType} />}
                  fileName={`${reportType}-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`}
                  className="export-button export-pdf"
                >
                  Export PDF
                </PDFDownloadLink>
              </div>
            </div>

            {chartData && (
              <div className="chart-container">
                <div className="chart-header">
                  <h3>Visual Analytics</h3>
                  <div className="chart-type-selector">
                    <button
                      className={`chart-type-button ${chartType === 'line' ? 'active' : ''}`}
                      onClick={() => setChartType('line')}
                    >
                      Line
                    </button>
                    <button
                      className={`chart-type-button ${chartType === 'bar' ? 'active' : ''}`}
                      onClick={() => setChartType('bar')}
                    >
                      Bar
                    </button>
                    <button
                      className={`chart-type-button ${chartType === 'pie' ? 'active' : ''}`}
                      onClick={() => setChartType('pie')}
                    >
                      Pie
                    </button>
                  </div>
                </div>
                <div style={{ height: '400px' }}>
                  {chartType === 'line' && <Line data={chartData} options={chartOptions} />}
                  {chartType === 'bar' && <Bar data={chartData} options={chartOptions} />}
                  {chartType === 'pie' && <Pie data={chartData} options={chartOptions} />}
                </div>
              </div>
            )}

            <div className="report-table-container">
              <table className="report-table">
                <thead>
                  <tr>
                    {Object.keys(reportData[0]).map(key => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, i) => (
                        <td key={i}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsPage; 