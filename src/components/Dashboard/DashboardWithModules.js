import React from 'react';
import { FaCalendarAlt, FaFileContract, FaLightbulb, FaPencilAlt, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDateRange } from '../../context/DateRangeContext';
import { useStatsView } from '../../context/StatsViewContext';
import Container from '../ui/layout/Container';
import Grid from '../ui/layout/Grid';
import styles from './Dashboard.module.css';

const DashboardWithModules = () => {
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
          ],
          metrics: [
            { label: 'New Leads', value: '12', positive: true, change: '+20%' },
            { label: 'Conversion Rate', value: '5.2%', positive: true, change: '+1.1%' },
            { label: 'Revenue', value: '$24,500', positive: true, change: '+15%' },
            { label: 'Potential to Actual', value: '68%', positive: true, change: '+5%' },
          ],
          salesGoal: {
            current: 175000,
            target: 250000,
            progress: 70
          },
          leadStats: [
            { label: 'Total Leads', value: '145' },
            { label: 'Qualified Leads', value: '89' },
            { label: 'Conversion Rate', value: '12.4%' },
          ],
          leadSources: [
            { name: 'Website', percentage: 45 },
            { name: 'Referral', percentage: 30 },
            { name: 'Social', percentage: 15 },
            { name: 'Other', percentage: 10 },
          ],
          lossReasons: [
            { reason: 'Price', percentage: 40 },
            { reason: 'Competitor', percentage: 25 },
            { reason: 'Timing', percentage: 20 },
            { reason: 'Other', percentage: 15 },
          ],
          actionsRequired: [
            { client: 'TechStart Inc', action: 'Contract Review', deadline: 'Today' },
            { client: 'Global Ventures', action: 'Follow-up Call', deadline: 'Tomorrow' },
            { client: 'Innovate LLC', action: 'Proposal Update', deadline: 'Sep 15' },
          ]
        };
      case 'This Week':
        return {
          meetings: [
            { id: 'm1', title: 'Client Onboarding - TechStart Inc', time: 'Today, 10:00 AM', type: 'Video Call' },
            { id: 'm2', title: 'Investor Pitch - Capital Partners', time: 'Today, 2:30 PM', type: 'In-Person' },
            { id: 'm3', title: 'Product Demo - Innovate LLC', time: 'Tomorrow, 11:00 AM', type: 'Video Call' },
            { id: 'm4', title: 'Strategy Session - Internal', time: 'Friday, 9:00 AM', type: 'In-Person' },
          ],
          metrics: [
            { label: 'New Leads', value: '45', positive: true, change: '+15%' },
            { label: 'Conversion Rate', value: '4.8%', positive: false, change: '-0.5%' },
            { label: 'Revenue', value: '$86,200', positive: true, change: '+12%' },
            { label: 'Potential to Actual', value: '72%', positive: true, change: '+8%' },
          ],
          salesGoal: {
            current: 175000,
            target: 250000,
            progress: 70
          },
          leadStats: [
            { label: 'Total Leads', value: '145' },
            { label: 'Qualified Leads', value: '89' },
            { label: 'Conversion Rate', value: '12.4%' },
          ],
          leadSources: [
            { name: 'Website', percentage: 45 },
            { name: 'Referral', percentage: 30 },
            { name: 'Social', percentage: 15 },
            { name: 'Other', percentage: 10 },
          ],
          lossReasons: [
            { reason: 'Price', percentage: 40 },
            { reason: 'Competitor', percentage: 25 },
            { reason: 'Timing', percentage: 20 },
            { reason: 'Other', percentage: 15 },
          ],
          actionsRequired: [
            { client: 'TechStart Inc', action: 'Contract Review', deadline: 'Today' },
            { client: 'Global Ventures', action: 'Follow-up Call', deadline: 'Tomorrow' },
            { client: 'Innovate LLC', action: 'Proposal Update', deadline: 'Sep 15' },
          ]
        };
      case 'This Month':
      default:
        return {
          meetings: [
            { id: 'm1', title: 'Client Onboarding - TechStart Inc', time: 'Today, 10:00 AM', type: 'Video Call' },
            { id: 'm2', title: 'Investor Pitch - Capital Partners', time: 'Today, 2:30 PM', type: 'In-Person' },
            { id: 'm3', title: 'Product Demo - Innovate LLC', time: 'Tomorrow, 11:00 AM', type: 'Video Call' },
          ],
          metrics: [
            { label: 'New Leads', value: '187', positive: true, change: '+22%' },
            { label: 'Conversion Rate', value: '5.4%', positive: true, change: '+0.8%' },
            { label: 'Revenue', value: '$342,500', positive: true, change: '+18%' },
            { label: 'Potential to Actual', value: '75%', positive: true, change: '+10%' },
          ],
          salesGoal: {
            current: 175000,
            target: 250000,
            progress: 70
          },
          leadStats: [
            { label: 'Total Leads', value: '145' },
            { label: 'Qualified Leads', value: '89' },
            { label: 'Conversion Rate', value: '12.4%' },
          ],
          leadSources: [
            { name: 'Website', percentage: 45 },
            { name: 'Referral', percentage: 30 },
            { name: 'Social', percentage: 15 },
            { name: 'Other', percentage: 10 },
          ],
          lossReasons: [
            { reason: 'Price', percentage: 40 },
            { reason: 'Competitor', percentage: 25 },
            { reason: 'Timing', percentage: 20 },
            { reason: 'Other', percentage: 15 },
          ],
          actionsRequired: [
            { client: 'TechStart Inc', action: 'Contract Review', deadline: 'Today' },
            { client: 'Global Ventures', action: 'Follow-up Call', deadline: 'Tomorrow' },
            { client: 'Innovate LLC', action: 'Proposal Update', deadline: 'Sep 15' },
          ]
        };
    }
  };

  // Get data for the selected date range
  const data = getData();

  // Destructure data
  const { meetings, metrics, salesGoal, leadStats, leadSources, lossReasons, actionsRequired } = data;

  // Quick action shortcuts
  const shortcuts = [
    { title: 'Add Lead', icon: <FaUserPlus />, link: '/dashboard/leads/new' },
    { title: 'Create Contract', icon: <FaFileContract />, link: '/dashboard/contracts/new' },
    { title: 'Schedule Meeting', icon: <FaCalendarAlt />, link: '/dashboard/meetings/new' },
    { title: 'Add Note', icon: <FaPencilAlt />, link: '/dashboard/notes/new' },
    { title: 'Create Proposal', icon: <FaLightbulb />, link: '/dashboard/proposals/new' },
  ];

  return (
    <Container fluid className={styles.dashboardPage}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Sales</h1>
      </div>
      {/* AI Summary Section */}
      <Container className={styles.summarySection}>
        <div className={styles.aiSummaryWrapper}>
          <p className={styles.aiSummary}>
          Welcome back! Today you have 3 client meetings scheduled. TechStart Inc is ready to sign their contract, and Capital Partners is considering increasing their investment by $250K. Your lead volume has increased by 12% this week, with website conversions showing the highest growth. The sales team is at 72% of this month's target with 10 days remaining.
          </p>
        </div>
      </Container>

      {/* Upcoming Meetings Section */}
      <Container className={styles.dashboardSection}>
        <h2 className={styles.sectionTitle}>Upcoming Meetings</h2>
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
      </Container>

      {/* Action Required Section */}
      <Container className={styles.dashboardSection}>
        <h2 className={styles.sectionTitle}>Action Required</h2>
        <div className={styles.actionTable}>
          <div className={styles.actionHeader}>
            <div className={styles.actionCell}>Client</div>
            <div className={styles.actionCell}>Action</div>
            <div className={styles.actionCell}>Deadline</div>
          </div>
          {actionsRequired.map((action, index) => (
            <div className={styles.actionRow} key={index}>
              <div className={styles.actionCell}>{action.client}</div>
              <div className={styles.actionCell}>{action.action}</div>
              <div className={styles.actionCell}>{action.deadline}</div>
            </div>
          ))}
        </div>
      </Container>

      {/* Company Vitals Section */}
      <Container className={styles.dashboardSection}>
        <h2 className={styles.sectionTitle}>Company Vitals</h2>
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
      </Container>

      {/* Sales Goal Section */}
      <Container className={styles.dashboardSection}>
        <h2 className={styles.sectionTitle}>Sales Goal</h2>
        <div className={styles.salesGoalContainer}>
          <div className={styles.salesGoalAmount}>${salesGoal.current.toLocaleString()} / ${salesGoal.target.toLocaleString()}</div>
          <div className={styles.progressText}>{salesGoal.progress.toFixed(1)}% of {dateRange || 'Last 30 Days'} goal</div>
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar} style={{ width: `${salesGoal.progress}%` }}></div>
          </div>
        </div>
      </Container>

      {/* Lead Analytics Section */}
      <Container className={styles.dashboardSection}>
        <h2 className={styles.sectionTitle}>Lead Analytics</h2>
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

          {/* Lead Sources */}
          <div className={styles.leadSourceSection}>
            <h3 className={styles.subsectionTitle}>Lead Sources</h3>
            {leadSources.map((source, index) => (
              <div className={styles.leadSourceItem} key={index}>
                <div className={styles.leadSourceName}>{source.name}</div>
                <div className={styles.leadSourceBarContainer}>
                  <div
                    className={styles.leadSourceBar}
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
                <div className={styles.leadSourcePercent}>{source.percentage}%</div>
              </div>
            ))}
          </div>

          {/* Loss Analysis */}
          <div className={styles.lossAnalysisSection}>
            <h3 className={styles.subsectionTitle}>Loss Analysis</h3>
            {lossReasons.map((loss, index) => (
              <div className={styles.lossAnalysisItem} key={index}>
                <div className={styles.lossReason}>{loss.reason}</div>
                <div className={styles.lossBarContainer}>
                  <div
                    className={styles.lossBar}
                    style={{ width: `${loss.percentage}%` }}
                  ></div>
                </div>
                <div className={styles.lossPercentage}>{loss.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* Shortcut Links Section */}
      <Container className={styles.dashboardSection}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <Grid columns={4} mdColumns={2} smColumns={1} gap="md" className={styles.shortcutsGrid}>
          {shortcuts.map((shortcut, index) => (
            <Link to={shortcut.link} key={index} className={styles.shortcutCard}>
              <div className={styles.shortcutIcon}>{shortcut.icon}</div>
              <h3 className={styles.shortcutTitle}>{shortcut.title}</h3>
            </Link>
          ))}
        </Grid>
      </Container>
    </Container>
  );
};

export default DashboardWithModules;
