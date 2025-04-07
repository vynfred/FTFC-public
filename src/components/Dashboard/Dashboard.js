import React from 'react';
import { FaCalendarAlt, FaFileContract, FaLightbulb, FaPencilAlt, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDateRange } from '../../context/DateRangeContext';
import { useStatsView } from '../../context/StatsViewContext';
import Container from '../ui/layout/Container';
import Grid from '../ui/layout/Grid';

const Dashboard = () => {
  const { dateRange } = useDateRange();
  const { viewCompanyStats } = useStatsView();

  // Get data based on selected date range
  const getData = () => {
    switch(dateRange) {
      case 'Today':
        return {
          meetings: [
            { id: 'm1', title: 'Client Onboarding - TechStart Inc', time: '10:00 AM', type: 'Video Call' },
            { id: 'm2', title: 'Investor Pitch - Capital Partners', time: '2:30 PM', type: 'In-Person' },
            { id: 'm3', title: 'Partner Strategy - Alliance Group', time: '4:00 PM', type: 'Phone Call' },
          ],
          metrics: viewCompanyStats
            ? [
                { label: 'NEW LEADS', value: '3', change: '+2', positive: true },
                { label: 'CLOSE RATE', value: '20%', change: '+5%', positive: true },
                { label: 'POTENTIAL TO ACTUAL', value: '65%', change: '+8%', positive: true },
                { label: 'REVENUE', value: '$2.5K', change: '+10%', positive: true },
                { label: 'PIPELINE VALUE', value: '$1.4M', change: '+0.5%', positive: true },
              ]
            : [
                { label: 'NEW LEADS', value: '1', change: '+1', positive: true },
                { label: 'CLOSE RATE', value: '15%', change: '+3%', positive: true },
                { label: 'POTENTIAL TO ACTUAL', value: '42%', change: '+5%', positive: true },
                { label: 'REVENUE', value: '$0.8K', change: '+5%', positive: true },
                { label: 'PIPELINE VALUE', value: '$320K', change: '+0.2%', positive: true },
              ],
          salesGoal: viewCompanyStats
            ? { current: 2500, target: 8000, progress: 31.25 }
            : { current: 800, target: 3000, progress: 26.7 }
        };
      case 'Last 7 Days':
        return {
          meetings: [
            { id: 'm1', title: 'Client Onboarding - TechStart Inc', time: '10:00 AM', type: 'Video Call' },
            { id: 'm2', title: 'Investor Pitch - Capital Partners', time: '2:30 PM', type: 'In-Person' },
            { id: 'm3', title: 'Partner Strategy - Alliance Group', time: '4:00 PM', type: 'Phone Call' },
          ],
          metrics: viewCompanyStats
            ? [
                { label: 'NEW LEADS', value: '12', change: '+4', positive: true },
                { label: 'CLOSE RATE', value: '16%', change: '+2%', positive: true },
                { label: 'POTENTIAL TO ACTUAL', value: '52%', change: '+6%', positive: true },
                { label: 'REVENUE', value: '$14K', change: '+8%', positive: true },
                { label: 'PIPELINE VALUE', value: '$1.2M', change: '+3%', positive: true },
              ]
            : [
                { label: 'NEW LEADS', value: '5', change: '+2', positive: true },
                { label: 'CLOSE RATE', value: '12%', change: '+1%', positive: true },
                { label: 'POTENTIAL TO ACTUAL', value: '35%', change: '+3%', positive: true },
                { label: 'REVENUE', value: '$4.5K', change: '+6%', positive: true },
                { label: 'PIPELINE VALUE', value: '$380K', change: '+2%', positive: true },
              ],
          salesGoal: viewCompanyStats
            ? { current: 14000, target: 40000, progress: 35 }
            : { current: 4500, target: 15000, progress: 30 }
        };
      case 'This Month':
        return {
          meetings: [
            { id: 'm1', title: 'Client Onboarding - TechStart Inc', time: '10:00 AM', type: 'Video Call' },
            { id: 'm2', title: 'Investor Pitch - Capital Partners', time: '2:30 PM', type: 'In-Person' },
            { id: 'm3', title: 'Partner Strategy - Alliance Group', time: '4:00 PM', type: 'Phone Call' },
          ],
          metrics: viewCompanyStats
            ? [
                { label: 'NEW LEADS', value: '20', change: '+15%', positive: true },
                { label: 'CLOSE RATE', value: '19%', change: '+4%', positive: true },
                { label: 'POTENTIAL TO ACTUAL', value: '58%', change: '+7%', positive: true },
                { label: 'REVENUE', value: '$68K', change: '+12%', positive: true },
                { label: 'PIPELINE VALUE', value: '$1.3M', change: '+6%', positive: true },
              ]
            : [
                { label: 'NEW LEADS', value: '8', change: '+10%', positive: true },
                { label: 'CLOSE RATE', value: '14%', change: '+2%', positive: true },
                { label: 'POTENTIAL TO ACTUAL', value: '38%', change: '+4%', positive: true },
                { label: 'REVENUE', value: '$22K', change: '+8%', positive: true },
                { label: 'PIPELINE VALUE', value: '$430K', change: '+4%', positive: true },
              ],
          salesGoal: viewCompanyStats
            ? { current: 68000, target: 100000, progress: 68 }
            : { current: 22000, target: 35000, progress: 62.8 }
        };
      case 'Last Month':
        return {
          meetings: [
            { id: 'm1', title: 'Client Onboarding - TechStart Inc', time: '10:00 AM', type: 'Video Call' },
            { id: 'm2', title: 'Investor Pitch - Capital Partners', time: '2:30 PM', type: 'In-Person' },
            { id: 'm3', title: 'Partner Strategy - Alliance Group', time: '4:00 PM', type: 'Phone Call' },
          ],
          metrics: viewCompanyStats
            ? [
                { label: 'NEW LEADS', value: '28', change: '+8%', positive: true },
                { label: 'CLOSE RATE', value: '17%', change: '+1%', positive: true },
                { label: 'POTENTIAL TO ACTUAL', value: '70%', change: '+10%', positive: true },
                { label: 'REVENUE', value: '$95K', change: '+5%', positive: true },
                { label: 'PIPELINE VALUE', value: '$1.25M', change: '+5%', positive: true },
              ]
            : [
                { label: 'NEW LEADS', value: '10', change: '+5%', positive: true },
                { label: 'CLOSE RATE', value: '13%', change: '+0.5%', positive: true },
                { label: 'POTENTIAL TO ACTUAL', value: '45%', change: '+5%', positive: true },
                { label: 'REVENUE', value: '$32K', change: '+3%', positive: true },
                { label: 'PIPELINE VALUE', value: '$410K', change: '+3%', positive: true },
              ],
          salesGoal: viewCompanyStats
            ? { current: 95000, target: 95000, progress: 100 }
            : { current: 32000, target: 32000, progress: 100 }
        };
      default: // Last 30 Days or any other
        return {
          meetings: [
    { id: 'm1', title: 'Client Onboarding - TechStart Inc', time: '10:00 AM', type: 'Video Call' },
    { id: 'm2', title: 'Investor Pitch - Capital Partners', time: '2:30 PM', type: 'In-Person' },
    { id: 'm3', title: 'Partner Strategy - Alliance Group', time: '4:00 PM', type: 'Phone Call' },
          ],
          metrics: viewCompanyStats
            ? [
    { label: 'NEW LEADS', value: '24', change: '+12%', positive: true },
    { label: 'CLOSE RATE', value: '18%', change: '+3%', positive: true },
                { label: 'POTENTIAL TO ACTUAL', value: '62%', change: '+9%', positive: true },
    { label: 'REVENUE', value: '$86K', change: '+15%', positive: true },
    { label: 'PIPELINE VALUE', value: '$1.4M', change: '+8%', positive: true },
              ]
            : [
                { label: 'NEW LEADS', value: '9', change: '+7%', positive: true },
                { label: 'CLOSE RATE', value: '15%', change: '+2%', positive: true },
                { label: 'POTENTIAL TO ACTUAL', value: '40%', change: '+6%', positive: true },
                { label: 'REVENUE', value: '$28K', change: '+10%', positive: true },
                { label: 'PIPELINE VALUE', value: '$450K', change: '+5%', positive: true },
              ],
          salesGoal: viewCompanyStats
            ? { current: 86000, target: 120000, progress: 71.6 }
            : { current: 28000, target: 40000, progress: 70 }
        };
    }
  };

  const data = getData();
  const { meetings, metrics, salesGoal } = data;

  // Static data that doesn't change with date range
  const leadStats = [
    { label: 'Open Leads', value: '42' },
    { label: 'Qualified Leads', value: '18' },
    { label: 'Conversion Rate', value: '22%' },
  ];

  const stageTimings = [
    { stage: 'Lead to Consultation', days: 3 },
    { stage: 'Consultation to Intake', days: 5 },
    { stage: 'Intake to Evaluation', days: 7 },
    { stage: 'Evaluation to Proposal', days: 4 },
    { stage: 'Proposal to Close', days: 5 },
  ];

  const lossAnalysis = [
    { reason: 'Budget Constraints', percentage: 35 },
    { reason: 'Needs Mismatch', percentage: 28 },
    { reason: 'Chose Competitor', percentage: 18 },
    { reason: 'No Decision', percentage: 12 },
    { reason: 'Timing Issues', percentage: 7 },
  ];

  const actionRequired = [
    { lead: 'Acme Corp', stage: 'Proposal', value: '$12,500', days: 7, action: 'Follow-up call' },
    { lead: 'Tech Solutions', stage: 'Intake Form', value: '$8,200', days: 5, action: 'Send reminder' },
    { lead: 'Global Services', stage: 'Evaluation', value: '$15,000', days: 2, action: 'Complete review' },
  ];

  const leadSources = [
    { name: 'Website', percentage: 42 },
    { name: 'Referrals', percentage: 28 },
    { name: 'Social Media', percentage: 18 },
    { name: 'Events', percentage: 12 },
  ];

  const shortcuts = [
    { title: 'Create Lead', icon: <FaUserPlus />, link: '/dashboard/leads/create' },
    { title: 'Send SOW', icon: <FaFileContract />, link: '#' },
    { title: 'Create Blog', icon: <FaPencilAlt />, link: '/dashboard/blog/create' },
    { title: 'Create Ad', icon: <FaLightbulb />, link: '/dashboard/ads/create' },
  ];

  return (
    <Container fluid className="dashboard-page">
      {/* AI Summary Section */}
      <Container className="summary-section">
        <div className="ai-summary-wrapper">
          <p className="ai-summary">
          Welcome back! Today you have 3 client meetings scheduled. TechStart Inc is ready to sign their contract, and Capital Partners is considering increasing their investment by $250K. Your lead volume has increased by 12% this week, with website conversions showing the highest growth. The sales team is at 72% of this month's target with 10 days remaining.
          </p>
        </div>
      </Container>

      {/* Upcoming Meetings Section */}
      <Container className="dashboard-section">
        <h2 className="section-title">Upcoming Meetings</h2>
        <Grid columns={1} gap="md" className="meetings-container">
          {meetings.map((meeting) => (
            <Link to={`/dashboard/meetings/${meeting.id}`} key={meeting.id} className="meeting-link">
              <div className="meeting-card">
                <div className="meeting-info">
                  <h3>{meeting.title}</h3>
                  <div className="meeting-time">
                    <FaCalendarAlt style={{ marginRight: '6px' }} />
                    {meeting.time}
                  </div>
                  <div className="meeting-type">{meeting.type}</div>
                </div>
              </div>
            </Link>
          ))}
        </Grid>
      </Container>

      {/* Company Vitals Section */}
      <Container className="dashboard-section">
        <h2 className="section-title">Company Vitals</h2>
        <Grid columns={2} mdColumns={2} smColumns={1} gap="md" className="metrics-grid">
          {metrics.map((metric, index) => (
            <div className="metric-card" key={index}>
              <div className="metric-label">{metric.label}</div>
              <div className="metric-value">{metric.value}</div>
              <div className={`metric-change ${metric.positive ? 'positive' : 'negative'}`}>
                {metric.change}
              </div>
            </div>
          ))}
        </Grid>
      </Container>

      {/* Sales Goal Section */}
      <Container className="dashboard-section">
        <h2 className="section-title">Sales Goal</h2>
        <div className="sales-goal-container">
          <div className="sales-goal-amount">${salesGoal.current.toLocaleString()} / ${salesGoal.target.toLocaleString()}</div>
          <div className="progress-text">{salesGoal.progress.toFixed(1)}% of {dateRange || 'Last 30 Days'} goal</div>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${salesGoal.progress}%` }}></div>
          </div>
        </div>
      </Container>

      {/* Lead Analytics Section */}
      <Container className="dashboard-section">
        <h2 className="section-title">Lead Analytics</h2>
        <div className="lead-analytics-container">
          {/* Top-Level KPIs */}
          <Grid columns={3} mdColumns={3} smColumns={1} gap="md" className="lead-stats">
            {leadStats.map((stat, index) => (
              <div className="lead-stat" key={index}>
                <div className="lead-stat-value">{stat.value}</div>
                <div className="lead-stat-label">{stat.label}</div>
              </div>
            ))}
          </Grid>

          {/* Stage Timing Analysis */}
          <div className="stage-timing-section">
            <h3 className="subsection-title">Stage Timing (Avg Days)</h3>
            {stageTimings.map((item, index) => (
              <div className="stage-timing-item" key={index}>
                <div className="stage-name">{item.stage}</div>
                <div className="stage-bar-container">
                  <div className="stage-bar" style={{ width: `${(item.days / 10) * 100}%` }}></div>
                </div>
                <div className="stage-days">{item.days} days</div>
              </div>
            ))}
          </div>

          {/* Loss Analysis */}
          <div className="loss-analysis-section">
            <h3 className="subsection-title">Loss Analysis</h3>
            {lossAnalysis.map((item, index) => (
              <div className="loss-analysis-item" key={index}>
                <div className="loss-reason">{item.reason}</div>
                <div className="loss-bar-container">
                  <div className="loss-bar" style={{ width: `${item.percentage}%` }}></div>
                </div>
                <div className="loss-percentage">{item.percentage}%</div>
              </div>
            ))}
          </div>

          {/* Action Required */}
          <div className="action-required-section">
            <h3 className="subsection-title">Action Required</h3>
            <div className="action-table">
              <div className="action-header">
                <div className="action-cell">Lead</div>
                <div className="action-cell">Stage</div>
                <div className="action-cell">Value</div>
                <div className="action-cell">Days Idle</div>
                <div className="action-cell">Next Step</div>
              </div>
              {actionRequired.map((item, index) => (
                <div className="action-row" key={index}>
                  <div className="action-cell">{item.lead}</div>
                  <div className="action-cell">{item.stage}</div>
                  <div className="action-cell">{item.value}</div>
                  <div className="action-cell">{item.days}</div>
                  <div className="action-cell">{item.action}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Sources */}
          <div className="lead-source-section">
            <h3 className="subsection-title">Lead Sources</h3>
            {leadSources.map((source, index) => (
              <div className="lead-source-item" key={index}>
                <div className="lead-source-name">{source.name}</div>
                <div className="lead-source-bar-container">
                  <div className="lead-source-bar" style={{ width: `${source.percentage}%` }}></div>
                </div>
                <div className="lead-source-percent">{source.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* Shortcut Links Section */}
      <Container className="dashboard-section">
        <h2 className="section-title">Quick Actions</h2>
        <Grid columns={4} mdColumns={2} smColumns={1} gap="md" className="shortcuts-grid">
          {shortcuts.map((shortcut, index) => (
            <Link to={shortcut.link} key={index} className="shortcut-card">
              <div className="shortcut-icon">{shortcut.icon}</div>
              <h3 className="shortcut-title">{shortcut.title}</h3>
            </Link>
          ))}
        </Grid>
      </Container>
    </Container>
  );
};

export default Dashboard;