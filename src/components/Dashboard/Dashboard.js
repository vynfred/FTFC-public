import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaFileContract, FaLightbulb, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDateRange } from '../../context/DateRangeContext';
import { useStatsView } from '../../context/StatsViewContext';
import { db } from '../../firebase-config';
import Grid from '../ui/layout/Grid';
import styles from './Dashboard.module.css';
import DashboardSection from './DashboardSection';
import './DashboardStyles.css';

const SalesDashboard = () => {
  const { dateRange } = useDateRange();
  const { viewCompanyStats } = useStatsView();

  // State for dashboard data
  const [meetings, setMeetings] = useState([]);
  const [metrics, setMetrics] = useState(viewCompanyStats
    ? [
        { label: 'NEW LEADS', value: '0', change: '0%', positive: true },
        { label: 'CLOSE RATE', value: '0%', change: '0%', positive: true },
        { label: 'POTENTIAL TO ACTUAL', value: '0%', change: '0%', positive: true },
        { label: 'REVENUE', value: '$0', change: '0%', positive: true },
        { label: 'PIPELINE VALUE', value: '$0', change: '0%', positive: true },
      ]
    : [
        { label: 'NEW LEADS', value: '0', change: '0%', positive: true },
        { label: 'CLOSE RATE', value: '0%', change: '0%', positive: true },
        { label: 'POTENTIAL TO ACTUAL', value: '0%', change: '0%', positive: true },
        { label: 'REVENUE', value: '$0', change: '0%', positive: true },
        { label: 'PIPELINE VALUE', value: '$0', change: '0%', positive: true },
      ]);
  const [salesGoal, setSalesGoal] = useState(viewCompanyStats
    ? { current: 0, target: 100000, progress: 0 }
    : { current: 0, target: 50000, progress: 0 });
  const [loading, setLoading] = useState(true);

  // Fetch data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch meetings with error handling
        let meetingsList = [];
        try {
          const meetingsQuery = query(collection(db, 'meetings'), orderBy('date', 'desc'), limit(5));
          const meetingsSnapshot = await getDocs(meetingsQuery);
          meetingsList = meetingsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            title: doc.data().title || 'Untitled Meeting',
            time: doc.data().time || 'No time specified',
            type: doc.data().type || 'No type specified'
          }));
        } catch (meetingsError) {
          console.error('Error fetching meetings:', meetingsError);
          // Continue with empty meetings list
        }
        setMeetings(meetingsList.length > 0 ? meetingsList : []);

        // Fetch leads for metrics with error handling
        let leadsList = [];
        try {
          const leadsQuery = query(collection(db, 'leads'));
          const leadsSnapshot = await getDocs(leadsQuery);
          leadsList = leadsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        } catch (leadsError) {
          console.error('Error fetching leads:', leadsError);
          // Continue with empty leads list
        }

        // Calculate metrics
        const totalLeads = leadsList.length;
        const qualifiedLeads = leadsList.filter(lead => lead.status === 'Qualified').length;
        const conversionRate = totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : '0';

        // Update metrics based on viewCompanyStats
        if (viewCompanyStats) {
          setMetrics([
            { label: 'NEW LEADS', value: totalLeads.toString(), change: '+0%', positive: true },
            { label: 'CLOSE RATE', value: `${conversionRate}%`, change: '+0%', positive: true },
            { label: 'POTENTIAL TO ACTUAL', value: '0%', change: '+0%', positive: true },
            { label: 'REVENUE', value: '$0', change: '+0%', positive: true },
            { label: 'PIPELINE VALUE', value: '$0', change: '+0%', positive: true },
          ]);
          setSalesGoal({
            current: 0,
            target: 100000,
            progress: 0
          });
        } else {
          setMetrics([
            { label: 'NEW LEADS', value: totalLeads.toString(), change: '+0%', positive: true },
            { label: 'CLOSE RATE', value: `${conversionRate}%`, change: '+0%', positive: true },
            { label: 'POTENTIAL TO ACTUAL', value: '0%', change: '+0%', positive: true },
            { label: 'REVENUE', value: '$0', change: '+0%', positive: true },
            { label: 'PIPELINE VALUE', value: '$0', change: '+0%', positive: true },
          ]);
          setSalesGoal({
            current: 0,
            target: 50000,
            progress: 0
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange, viewCompanyStats]);

  // Static data that doesn't change with date range
  const leadStats = [
    { label: 'Open Leads', value: '0' },
    { label: 'Qualified Leads', value: '0' },
    { label: 'Conversion Rate', value: '0%' },
  ];

  const stageTimings = [
    { stage: 'Lead to Consultation', days: 0 },
    { stage: 'Consultation to Intake', days: 0 },
    { stage: 'Intake to Evaluation', days: 0 },
    { stage: 'Evaluation to Proposal', days: 0 },
    { stage: 'Proposal to Close', days: 0 },
  ];

  const lossAnalysis = [
    { reason: 'Budget Constraints', percentage: 0 },
    { reason: 'Needs Mismatch', percentage: 0 },
    { reason: 'Chose Competitor', percentage: 0 },
    { reason: 'No Decision', percentage: 0 },
    { reason: 'Timing Issues', percentage: 0 },
  ];

  const actionRequired = [
    { lead: '', stage: '', value: '', days: 0, action: '' },
  ];

  const leadSources = [
    { name: 'Website', percentage: 0 },
    { name: 'Referrals', percentage: 0 },
    { name: 'Social Media', percentage: 0 },
    { name: 'Events', percentage: 0 },
  ];

  const shortcuts = [
    { title: 'Add Lead', icon: <FaUserPlus />, link: '/dashboard/leads/new' },
    { title: 'Add Contact', icon: <FaUserPlus />, link: '/dashboard/contacts/new' },
    { title: 'Schedule Meeting', icon: <FaCalendarAlt />, link: '/dashboard/meetings/new' },
    { title: 'Create Proposal', icon: <FaFileContract />, link: '/dashboard/proposals/new' },
    { title: 'Create Campaign', icon: <FaLightbulb />, link: '/dashboard/marketing/campaigns/new' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>

      {/* Quick Actions Section */}
      <DashboardSection title="Quick Actions">
        <div className={styles.shortcutsContainer}>
          {shortcuts.map((shortcut, index) => (
            <Link key={index} to={shortcut.link} className={styles.shortcutCard}>
              <div className={styles.shortcutIcon}>{shortcut.icon}</div>
              <div className={styles.shortcutTitle}>{shortcut.title}</div>
            </Link>
          ))}
        </div>
      </DashboardSection>

      {/* Metrics Section */}
      <DashboardSection title="Key Metrics">
        <div className={styles.metricsContainer}>
          {metrics.map((metric, index) => (
            <div key={index} className={styles.metricCard}>
              <div className={styles.metricLabel}>{metric.label}</div>
              <div className={styles.metricValue}>{metric.value}</div>
              <div className={`${styles.metricChange} ${metric.positive ? styles.positive : styles.negative}`}>
                {metric.change}
              </div>
            </div>
          ))}
        </div>
      </DashboardSection>

      {/* Sales Goal Section */}
      <DashboardSection title="Sales Goal">
        <div className={styles.salesGoalContainer}>
          <div className={styles.goalText}>
            ${salesGoal.current.toLocaleString()} / ${salesGoal.target.toLocaleString()}
          </div>
          <div className={styles.goalBarContainer}>
            <div
              className={styles.goalBar}
              style={{ width: `${salesGoal.progress}%` }}
            ></div>
          </div>
          <div className={styles.goalPercentage}>{salesGoal.progress.toFixed(1)}% of {dateRange} goal</div>
        </div>
      </DashboardSection>

      {/* Upcoming Meetings Section */}
      <DashboardSection
        title="Upcoming Meetings"
        actions={
          <Link to="/dashboard/calendar" className="view-all-link">
            View All
          </Link>
        }
      >
        <div className={styles.meetingsContainer}>
          {meetings.length > 0 ? (
            meetings.map((meeting, index) => (
              <div key={index} className={styles.meetingCard}>
                <div className={styles.meetingTitle}>{meeting.title}</div>
                <div className={styles.meetingDetails}>
                  <span className={styles.meetingTime}>{meeting.time}</span>
                  <span className={styles.meetingType}>{meeting.type}</span>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noMeetings}>No upcoming meetings</div>
          )}
        </div>
      </DashboardSection>

      {/* Lead Stats Section */}
      <Grid columns={2}>
        <DashboardSection title="Lead Statistics">
          <div className={styles.leadStatsContainer}>
            {leadStats.map((stat, index) => (
              <div key={index} className={styles.leadStatCard}>
                <div className={styles.leadStatLabel}>{stat.label}</div>
                <div className={styles.leadStatValue}>{stat.value}</div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection title="Lead Sources">
          <div className={styles.leadSourcesContainer}>
            {leadSources.map((source, index) => (
              <div key={index} className={styles.leadSourceItem}>
                <div className={styles.leadSourceName}>{source.name}</div>
                <div className={styles.leadSourceBarContainer}>
                  <div
                    className={styles.leadSourceBar}
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
                <div className={styles.leadSourcePercentage}>{source.percentage}%</div>
              </div>
            ))}
          </div>
        </DashboardSection>
      </Grid>

      {/* Pipeline and Loss Analysis Section */}
      <Grid columns={2}>
        <DashboardSection title="Pipeline Stage Timing">
          <div className={styles.stageTimingContainer}>
            {stageTimings.map((item, index) => (
              <div key={index} className={styles.stageTimingItem}>
                <div className={styles.stageTimingName}>{item.stage}</div>
                <div className={styles.stageTimingBarContainer}>
                  <div
                    className={styles.stageTimingBar}
                    style={{ width: `${(item.days / 10) * 100}%` }}
                  ></div>
                </div>
                <div className={styles.stageTimingDays}>{item.days} days</div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection title="Loss Analysis">
          <div className={styles.lossAnalysisContainer}>
            {lossAnalysis.map((item, index) => (
              <div key={index} className={styles.lossAnalysisItem}>
                <div className={styles.lossAnalysisReason}>{item.reason}</div>
                <div className={styles.lossAnalysisBarContainer}>
                  <div
                    className={styles.lossAnalysisBar}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className={styles.lossAnalysisPercentage}>{item.percentage}%</div>
              </div>
            ))}
          </div>
        </DashboardSection>
      </Grid>

      {/* Action Required Section */}
      <DashboardSection title="Action Required">
        <div className={styles.actionRequiredContainer}>
          <table className={styles.actionRequiredTable}>
            <thead>
              <tr>
                <th>Lead</th>
                <th>Stage</th>
                <th>Value</th>
                <th>Days in Stage</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {actionRequired.map((item, index) => (
                <tr key={index}>
                  <td>{item.lead}</td>
                  <td>{item.stage}</td>
                  <td>{item.value}</td>
                  <td>{item.days}</td>
                  <td>{item.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardSection>
    </div>
  );
};

export default SalesDashboard;
