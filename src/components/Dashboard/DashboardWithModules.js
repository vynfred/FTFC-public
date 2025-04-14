import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaFileContract, FaLightbulb, FaPencilAlt, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDateRange } from '../../context/DateRangeContext';
import { useStatsView } from '../../context/StatsViewContext';
import { db } from '../../firebase-config';
import Container from '../ui/layout/Container';
import Grid from '../ui/layout/Grid';
import styles from './Dashboard.module.css';

const DashboardWithModules = () => {
  const { dateRange } = useDateRange();
  const { viewCompanyStats } = useStatsView();

  // State for dashboard data
  const [meetings, setMeetings] = useState([]);
  const [metrics, setMetrics] = useState([
    { label: 'New Leads', value: '0', positive: true, change: '0%' },
    { label: 'Conversion Rate', value: '0%', positive: true, change: '0%' },
    { label: 'Revenue', value: '$0', positive: true, change: '0%' },
    { label: 'Potential to Actual', value: '0%', positive: true, change: '0%' },
  ]);
  const [salesGoal, setSalesGoal] = useState({
    current: 0,
    target: 100000,
    progress: 0
  });
  const [leadStats, setLeadStats] = useState([
    { label: 'Total Leads', value: '0' },
    { label: 'Qualified Leads', value: '0' },
    { label: 'Conversion Rate', value: '0%' },
  ]);
  const [leadSources, setLeadSources] = useState([
    { name: 'Website', percentage: 0 },
    { name: 'Referral', percentage: 0 },
    { name: 'Social', percentage: 0 },
    { name: 'Other', percentage: 0 },
  ]);
  const [lossReasons, setLossReasons] = useState([
    { reason: 'Price', percentage: 0 },
    { reason: 'Competitor', percentage: 0 },
    { reason: 'Timing', percentage: 0 },
    { reason: 'Other', percentage: 0 },
  ]);
  const [actionsRequired, setActionsRequired] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch meetings
        const meetingsQuery = query(collection(db, 'meetings'), orderBy('date', 'desc'), limit(5));
        const meetingsSnapshot = await getDocs(meetingsQuery);
        const meetingsList = meetingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          title: doc.data().title || 'Untitled Meeting',
          time: doc.data().time || 'No time specified',
          type: doc.data().type || 'No type specified'
        }));
        setMeetings(meetingsList.length > 0 ? meetingsList : []);

        // Fetch leads for metrics
        const leadsQuery = query(collection(db, 'leads'));
        const leadsSnapshot = await getDocs(leadsQuery);
        const leadsList = leadsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Calculate metrics
        const totalLeads = leadsList.length;
        const qualifiedLeads = leadsList.filter(lead => lead.status === 'Qualified').length;
        const conversionRate = totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : '0';

        // Update metrics
        setMetrics([
          { label: 'New Leads', value: totalLeads.toString(), positive: true, change: '+0%' },
          { label: 'Conversion Rate', value: `${conversionRate}%`, positive: true, change: '+0%' },
          { label: 'Revenue', value: '$0', positive: true, change: '+0%' },
          { label: 'Potential to Actual', value: '0%', positive: true, change: '+0%' },
        ]);

        // Update lead stats
        setLeadStats([
          { label: 'Total Leads', value: totalLeads.toString() },
          { label: 'Qualified Leads', value: qualifiedLeads.toString() },
          { label: 'Conversion Rate', value: `${conversionRate}%` },
        ]);

        // Fetch actions required (tasks)
        const tasksQuery = query(collection(db, 'tasks'), limit(3));
        const tasksSnapshot = await getDocs(tasksQuery);
        const tasksList = tasksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          client: doc.data().client || 'Unknown Client',
          action: doc.data().action || 'No action specified',
          deadline: doc.data().deadline || 'No deadline'
        }));
        setActionsRequired(tasksList.length > 0 ? tasksList : []);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange, viewCompanyStats]);

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
