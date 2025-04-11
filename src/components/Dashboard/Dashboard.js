import React from 'react';
import { FaCalendarAlt, FaFileContract, FaLightbulb, FaPencilAlt, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDateRange } from '../../context/DateRangeContext';
import { useStatsView } from '../../context/StatsViewContext';
import Container from '../ui/layout/Container';
import Grid from '../ui/layout/Grid';
import styles from './Dashboard.module.css';
import DashboardSection from './DashboardSection';

const SalesDashboard = () => {
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
    <Container fluid className={styles.dashboardPage}>
      {/* AI Summary Section */}
      <DashboardSection>
        <div className={styles.aiSummaryWrapper}>
          <p className={styles.aiSummary}>
          Welcome back! Today you have 3 client meetings scheduled. TechStart Inc is ready to sign their contract, and Capital Partners is considering increasing their investment by $250K. Your lead volume has increased by 12% this week, with website conversions showing the highest growth. The sales team is at 72% of this month's target with 10 days remaining.
          </p>
        </div>
      </DashboardSection>

      {/* Upcoming Meetings Section */}
      <DashboardSection title="Upcoming Meetings">
        <Grid columns={1} gap="md" className={styles.meetingsContainer}>
          {meetings.map((meeting) => (
            <Link to={`/dashboard/meetings/${meeting.id}`} key={meeting.id} className={styles.meetingLink}>
              <div className={styles.meetingCard}>
                <div className={styles.meetingInfo}>
                  <h3>{meeting.title}</h3>
                  <div className={styles.meetingTime}>
                    <FaCalendarAlt style={{ marginRight: '6px' }} />
                    {meeting.time}
                  </div>
                  <div className={styles.meetingType}>{meeting.type}</div>
                </div>
              </div>
            </Link>
          ))}
        </Grid>
      </DashboardSection>

      {/* Action Required Section */}
      <DashboardSection title="Action Required">
        <div className={styles.actionTable}>
          <div className={styles.actionHeader}>
            <div className={styles.actionCell}>Lead</div>
            <div className={styles.actionCell}>Stage</div>
            <div className={styles.actionCell}>Value</div>
            <div className={styles.actionCell}>Days Idle</div>
            <div className={styles.actionCell}>Next Step</div>
          </div>
          {actionRequired.map((item, index) => (
            <div className={styles.actionRow} key={index}>
              <div className={styles.actionCell}>{item.lead}</div>
              <div className={styles.actionCell}>{item.stage}</div>
              <div className={styles.actionCell}>{item.value}</div>
              <div className={styles.actionCell}>{item.days}</div>
              <div className={styles.actionCell}>{item.action}</div>
            </div>
          ))}
        </div>
      </DashboardSection>

      {/* Company Vitals Section */}
      <DashboardSection title="Company Vitals">
        <Grid columns={2} mdColumns={2} smColumns={1} gap="md" className={styles.metricsGrid}>
          {metrics.map((metric, index) => (
            <div className={styles.metricCard} key={index}>
              <div className={styles.metricLabel}>{metric.label}</div>
              <div className={styles.metricValue}>{metric.value}</div>
              <div className={`${styles.metricChange} ${metric.positive ? styles.positive : styles.negative}`}>
                {metric.change}
              </div>
            </div>
          ))}
        </Grid>
      </DashboardSection>

      {/* Sales Goal Section */}
      <DashboardSection title="Sales Goal">
        <div className={styles.salesGoalContainer}>
          <div className={styles.salesGoalAmount}>${salesGoal.current.toLocaleString()} / ${salesGoal.target.toLocaleString()}</div>
          <div className={styles.progressText}>{salesGoal.progress.toFixed(1)}% of {dateRange || 'Last 30 Days'} goal</div>
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar} style={{ width: `${salesGoal.progress}%` }}></div>
          </div>
        </div>
      </DashboardSection>

      {/* Lead Analytics Section */}
      <DashboardSection title="Lead Analytics">
        <div className={styles.leadAnalyticsContainer}>
          {/* Top-Level KPIs */}
          <Grid columns={3} mdColumns={3} smColumns={1} gap="md" className={styles.leadStats}>
            {leadStats.map((stat, index) => (
              <div className={styles.leadStat} key={index}>
                <div className={styles.leadStatValue}>{stat.value}</div>
                <div className={styles.leadStatLabel}>{stat.label}</div>
              </div>
            ))}
          </Grid>

          {/* Stage Timing Analysis */}
          <div className={styles.stageTimingSection}>
            <h3 className={styles.subsectionTitle}>Stage Timing (Avg Days)</h3>
            {stageTimings.map((item, index) => (
              <div className={styles.stageTimingItem} key={index}>
                <div className={styles.stageName}>{item.stage}</div>
                <div className={styles.stageBarContainer}>
                  <div className={styles.stageBar} style={{ width: `${(item.days / 10) * 100}%` }}></div>
                </div>
                <div className={styles.stageDays}>{item.days} days</div>
              </div>
            ))}
          </div>

          {/* Loss Analysis */}
          <div className={styles.lossAnalysisSection}>
            <h3 className={styles.subsectionTitle}>Loss Analysis</h3>
            {lossAnalysis.map((item, index) => (
              <div className={styles.lossAnalysisItem} key={index}>
                <div className={styles.lossReason}>{item.reason}</div>
                <div className={styles.lossBarContainer}>
                  <div className={styles.lossBar} style={{ width: `${item.percentage}%` }}></div>
                </div>
                <div className={styles.lossPercentage}>{item.percentage}%</div>
              </div>
            ))}
          </div>

          {/* Lead Sources */}
          <div className={styles.leadSourceSection}>
            <h3 className={styles.subsectionTitle}>Lead Sources</h3>
            {leadSources.map((source, index) => (
              <div className={styles.leadSourceItem} key={index}>
                <div className={styles.leadSourceName}>{source.name}</div>
                <div className={styles.leadSourceBarContainer}>
                  <div className={styles.leadSourceBar} style={{ width: `${source.percentage}%` }}></div>
                </div>
                <div className={styles.leadSourcePercent}>{source.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      </DashboardSection>

      {/* Shortcut Links Section */}
      <DashboardSection title="Quick Actions">
        <Grid columns={4} mdColumns={2} smColumns={1} gap="md" className={styles.shortcutsGrid}>
          {shortcuts.map((shortcut, index) => (
            <Link to={shortcut.link} key={index} className={styles.shortcutCard}>
              <div className={styles.shortcutIcon}>{shortcut.icon}</div>
              <h3 className={styles.shortcutTitle}>{shortcut.title}</h3>
            </Link>
          ))}
        </Grid>
      </DashboardSection>
    </Container>
  );
};

export default SalesDashboard;