import {
    ArcElement, BarElement, CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, Title,
    Tooltip
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDateRange } from '../../context/DateRangeContext';
import { useStatsView } from '../../context/StatsViewContext';
import DashboardSection from '../shared/DashboardSection';
import styles from './MarketingDashboard.module.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MarketingDashboard = () => {
  const navigate = useNavigate();
  const { dateRange } = useDateRange();
  const { viewCompanyStats, setViewCompanyStats } = useStatsView();
  // Force company stats view for Marketing Dashboard
  useEffect(() => {
    setViewCompanyStats(true);
  }, [setViewCompanyStats]);
  const [graphSource, setGraphSource] = useState('all');
  const [trafficType, setTrafficType] = useState('leads'); // 'leads' or 'investors'
  const [showMyContentOnly, setShowMyContentOnly] = useState(false);
  const [showMyCampaignsOnly, setShowMyCampaignsOnly] = useState(false);
  const [contentSearchTerm, setContentSearchTerm] = useState('');
  const [campaignSearchTerm, setCampaignSearchTerm] = useState('');
  const [filteredContent, setFilteredContent] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [contentSortConfig, setContentSortConfig] = useState({ key: null, direction: 'ascending' });
  const [campaignSortConfig, setCampaignSortConfig] = useState({ key: null, direction: 'ascending' });
  const [copiedLink, setCopiedLink] = useState(null);
  const [leaderboardTimeframe, setLeaderboardTimeframe] = useState('all'); // 'all', 'month', 'quarter', 'year'
  const [leaderboardType, setLeaderboardType] = useState('total'); // 'total', 'clients', 'investors', 'partners'
  const [graphData, setGraphData] = useState({
    organicData: [],
    paidData: [],
    labels: [],
    datasets: []
  });
  const [showAllMilestones, setShowAllMilestones] = useState(false);
  const [trafficData, setTrafficData] = useState({});
  const [conversionData, setConversionData] = useState({});
  const [socialMediaData, setSocialMediaData] = useState({});
  const [campaignData, setCampaignData] = useState([]);
  const [contentData, setContentData] = useState([]);
  const [socialChartType, setSocialChartType] = useState('cards');

  // Example content data
  const allContent = [
    { id: 1, title: 'How to Scale Your Startup', type: 'Blog Post', views: 1250, conversions: 15, publishDate: '2024-02-15', author: 'John Doe' },
    { id: 2, title: 'Investor Relations Best Practices', type: 'Blog Post', views: 980, conversions: 8, publishDate: '2024-02-28', author: 'Jane Smith' },
    { id: 3, title: 'Fundraising Strategies for 2024', type: 'Whitepaper', views: 750, conversions: 25, publishDate: '2024-03-05', author: 'John Doe' },
    { id: 4, title: 'Client Success Story: Tech Solutions', type: 'Case Study', views: 620, conversions: 12, publishDate: '2024-03-10', author: 'John Doe' },
    { id: 5, title: 'Market Trends in Venture Capital', type: 'Blog Post', views: 1100, conversions: 10, publishDate: '2024-03-18', author: 'Jane Smith' },
  ];

  // Example campaign data
  const allCampaigns = [
    { id: 1, name: 'Q1 Lead Generation', platform: 'LinkedIn', budget: 5000, spent: 4200, leads: 45, status: 'Active', manager: 'John Doe', clicks: 12500, impressions: 150000, ctr: 8.33, cpl: 93.33 },
    { id: 2, name: 'Investor Outreach', platform: 'Email', budget: 2000, spent: 1800, leads: 28, status: 'Active', manager: 'Jane Smith', clicks: 8400, impressions: 105000, ctr: 8.0, cpl: 64.29 },
    { id: 3, name: 'Content Promotion', platform: 'Facebook', budget: 3500, spent: 3500, leads: 32, status: 'Completed', manager: 'John Doe', clicks: 9800, impressions: 125000, ctr: 7.84, cpl: 109.38 },
    { id: 4, name: 'Startup Conference', platform: 'Event', budget: 8000, spent: 4000, leads: 15, status: 'In Progress', manager: 'John Doe', clicks: 6200, impressions: 80000, ctr: 7.75, cpl: 266.67 },
    { id: 5, name: 'SEO Campaign', platform: 'Google', budget: 4500, spent: 2200, leads: 22, status: 'Active', manager: 'Jane Smith', clicks: 7800, impressions: 95000, ctr: 8.21, cpl: 100.0 },
  ];

  // Marketing metrics for summary and stats
  const trafficTrend = 'up'; // 'up' or 'down'
  const trafficChangePercent = 15; // percentage change
  const topContent = allContent.sort((a, b) => b.views - a.views)[0] || { title: 'No content', views: 0, conversions: 0 };
  const topCampaign = allCampaigns.sort((a, b) => b.leads - a.leads)[0] || { name: 'No campaign', leads: 0 };
  const websiteVisitors = 12500;
  const conversionRate = 3.2;
  const leadsGenerated = 400;
  const costPerLead = 45;
  const socialEngagement = 8750;

  // Example referral tracking data - this would come from your database in a real app
  const referralData = [
    { id: 1, userName: 'John Doe', userId: 'user123', clientReferrals: 12, investorReferrals: 8, partnerReferrals: 5, totalReferrals: 25, date: '2024-03-15' },
    { id: 2, userName: 'Jane Smith', userId: 'user456', clientReferrals: 9, investorReferrals: 15, partnerReferrals: 3, totalReferrals: 27, date: '2024-02-20' },
    { id: 3, userName: 'Robert Johnson', userId: 'user789', clientReferrals: 7, investorReferrals: 4, partnerReferrals: 8, totalReferrals: 19, date: '2024-01-10' },
    { id: 4, userName: 'Emily Davis', userId: 'user101', clientReferrals: 14, investorReferrals: 6, partnerReferrals: 2, totalReferrals: 22, date: '2023-12-05' },
    { id: 5, userName: 'Michael Brown', userId: 'user202', clientReferrals: 5, investorReferrals: 10, partnerReferrals: 7, totalReferrals: 22, date: '2023-11-15' },
  ];

  // Website traffic data for different timeframes, sources, and traffic types
  const trafficDataSets = {
    leads: {
      '7d': {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        all: {
          organic: [120, 140, 130, 150, 160, 120, 110],
          paid: [80, 90, 85, 95, 100, 80, 75],
          social: [50, 60, 55, 65, 70, 50, 45],
          direct: [30, 35, 32, 38, 40, 30, 28]
        }
      },
      '30d': {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        all: {
          organic: [800, 850, 900, 950],
          paid: [600, 650, 700, 750],
          social: [300, 350, 400, 450],
          direct: [200, 250, 300, 350]
        }
      },
      '90d': {
        labels: ['Jan', 'Feb', 'Mar'],
        all: {
          organic: [1200, 1500, 1800],
          paid: [800, 1000, 1200],
          social: [500, 600, 700],
          direct: [300, 400, 500]
        }
      },
      '1y': {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        all: {
          organic: [1000, 1200, 1500, 1800, 2000, 2200, 2400, 2600, 2800, 3000, 3200, 3400],
          paid: [700, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800],
          social: [400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500],
          direct: [200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300]
        }
      }
    },
    investors: {
      '7d': {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        all: {
          organic: [90, 110, 105, 120, 130, 95, 85],
          paid: [60, 70, 65, 75, 80, 60, 55],
          social: [40, 45, 42, 50, 55, 40, 35],
          direct: [25, 30, 28, 32, 35, 25, 22]
        }
      },
      '30d': {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        all: {
          organic: [600, 650, 700, 750],
          paid: [450, 500, 550, 600],
          social: [250, 300, 350, 400],
          direct: [150, 200, 250, 300]
        }
      },
      '90d': {
        labels: ['Jan', 'Feb', 'Mar'],
        all: {
          organic: [900, 1100, 1300],
          paid: [600, 800, 1000],
          social: [400, 500, 600],
          direct: [200, 300, 400]
        }
      },
      '1y': {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        all: {
          organic: [800, 900, 1100, 1300, 1500, 1700, 1900, 2100, 2300, 2500, 2700, 2900],
          paid: [500, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600],
          social: [300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400],
          direct: [150, 250, 350, 450, 550, 650, 750, 850, 950, 1050, 1150, 1250]
        }
      }
    }
  };

  // Get current data based on selected date range and traffic type
  // Make sure we have a valid date range key
  const validDateRange = ['7d', '30d', '90d', '1y'].includes(dateRange) ? dateRange : '7d';
  const currentTrafficData = trafficDataSets[trafficType][validDateRange];
  const currentLabels = currentTrafficData?.labels || [];
  const currentData = currentTrafficData?.all || {};

  // Calculate max value for y-axis scaling
  const maxValue = Object.values(currentData).length > 0
    ? Math.max(...Object.values(currentData).flatMap(arr => arr || []))
    : 100; // Default value if no data

  // Generate y-axis labels based on max value
  const yAxisLabels = [
    Math.round(maxValue).toLocaleString(),
    Math.round(maxValue * 0.75).toLocaleString(),
    Math.round(maxValue * 0.5).toLocaleString(),
    Math.round(maxValue * 0.25).toLocaleString(),
    '0'
  ];

  // Get color for traffic source
  const getSourceColor = (source) => {
    const colorMap = {
      'organic': '#2ecc71',
      'paid': '#3498db',
      'social': '#9b59b6',
      'direct': '#e74c3c'
    };
    return colorMap[source] || '#95a5a6';
  };

  // Helper function to get line points for graph
  const getLinePoints = (data, maxValue) => {
    return data.map(value => (value / maxValue) * 100);
  };

  // Get current user info from localStorage or use defaults
  const getUserInfo = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      return {
        name: user.name || 'John Doe',
        id: user.uid || '1'
      };
    } catch (error) {
      console.error('Error parsing user data:', error);
      return { name: 'John Doe', id: '1' };
    }
  };

  const { name, id: userId } = getUserInfo();

  const yearlyGoalProgress = 72; // Example yearly progress percentage
  const yearlyGoalAmount = 500000; // $500K yearly goal for marketing
  const achievedAmount = 360000; // $360K achieved (72% of $500K)

  // Update chart data when source, date range, or traffic type changes
  useEffect(() => {
    // In a real app, this would fetch data from Google Analytics API
    // For now, we'll use our mock data but structure it to match GA data format
    // Make sure we have a valid date range key
    const validDateRange = ['7d', '30d', '90d', '1y'].includes(dateRange) ? dateRange : '7d';
    const timeframeData = trafficDataSets[trafficType][validDateRange];

    if (!timeframeData) {
      console.error(`No data found for traffic type ${trafficType} and date range ${validDateRange}`);
      return;
    }

    const labels = timeframeData.labels || [];
    const allData = timeframeData.all || {};

    let datasets = [];

    if (graphSource === 'all') {
      // Add all data sources
      Object.keys(allData).forEach(key => {
        datasets.push({
          label: key.charAt(0).toUpperCase() + key.slice(1),
          data: allData[key] || [],
          backgroundColor: `${getSourceColor(key)}20`,
          borderColor: getSourceColor(key),
          borderWidth: 2,
          pointBackgroundColor: getSourceColor(key),
          pointRadius: 4,
          tension: 0.3,
          fill: true
        });
      });
    } else if (allData[graphSource]) {
      // Add only selected source if it exists
      datasets.push({
        label: graphSource.charAt(0).toUpperCase() + graphSource.slice(1),
        data: allData[graphSource],
        backgroundColor: `${getSourceColor(graphSource)}20`,
        borderColor: getSourceColor(graphSource),
        borderWidth: 2,
        pointBackgroundColor: getSourceColor(graphSource),
        pointRadius: 4,
        tension: 0.3,
        fill: true
      });
    }

    setGraphData({
      organicData: allData.organic || [],
      paidData: allData.paid || [],
      labels,
      datasets
    });
  }, [dateRange, trafficType]);

  // Sort content function
  const requestContentSort = (key) => {
    let direction = 'ascending';
    if (contentSortConfig.key === key && contentSortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setContentSortConfig({ key, direction });
  };

  // Sort campaigns function
  const requestCampaignSort = (key) => {
    let direction = 'ascending';
    if (campaignSortConfig.key === key && campaignSortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setCampaignSortConfig({ key, direction });
  };

  // Get sort icon for content table
  const getContentSortIcon = (key) => {
    if (contentSortConfig.key !== key) {
      return <FaSort />;
    }
    return contentSortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />;
  };

  // Get sort icon for campaign table
  const getCampaignSortIcon = (key) => {
    if (campaignSortConfig.key !== key) {
      return <FaSort />;
    }
    return campaignSortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />;
  };

  // Generate referral link with UTM parameters
  const generateReferralLink = (type) => {
    const baseUrl = window.location.origin;

    if (type === 'client') {
      return `${baseUrl}/intake/client/${userId}?utm_source=referral&utm_medium=dashboard&utm_campaign=client_referral&utm_content=${userId}`;
    } else if (type === 'investor') {
      return `${baseUrl}/intake/investor/${userId}?utm_source=referral&utm_medium=dashboard&utm_campaign=investor_referral&utm_content=${userId}`;
    } else if (type === 'partner') {
      return `${baseUrl}/intake/partner/${userId}?utm_source=referral&utm_medium=dashboard&utm_campaign=partner_agreement&utm_content=${userId}`;
    }
    return '';
  };

  // Copy to clipboard function
  const copyToClipboard = (type) => {
    const link = generateReferralLink(type);
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopiedLink(type);
        setTimeout(() => setCopiedLink(null), 3000); // Reset after 3 seconds
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  // Filter content and campaigns when filter state changes
  useEffect(() => {
    // Filter content
    let contentToFilter = allContent;
    if (showMyContentOnly) {
      contentToFilter = allContent.filter(content => content.author === name);
    }

    // Filter by search term
    if (contentSearchTerm) {
      const term = contentSearchTerm.toLowerCase();
      contentToFilter = contentToFilter.filter(content =>
        content.title.toLowerCase().includes(term) ||
        content.type.toLowerCase().includes(term)
      );
    }

    // Sort content if sort config is set
    if (contentSortConfig.key) {
      contentToFilter = [...contentToFilter].sort((a, b) => {
        if (a[contentSortConfig.key] < b[contentSortConfig.key]) {
          return contentSortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[contentSortConfig.key] > b[contentSortConfig.key]) {
          return contentSortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredContent(contentToFilter);

    // Filter campaigns
    let campaignsToFilter = allCampaigns;
    if (showMyCampaignsOnly) {
      campaignsToFilter = allCampaigns.filter(campaign => campaign.manager === name);
    }

    // Filter by search term
    if (campaignSearchTerm) {
      const term = campaignSearchTerm.toLowerCase();
      campaignsToFilter = campaignsToFilter.filter(campaign =>
        campaign.name.toLowerCase().includes(term) ||
        campaign.platform.toLowerCase().includes(term)
      );
    }

    // Sort campaigns if sort config is set
    if (campaignSortConfig.key) {
      campaignsToFilter = [...campaignsToFilter].sort((a, b) => {
        if (a[campaignSortConfig.key] < b[campaignSortConfig.key]) {
          return campaignSortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[campaignSortConfig.key] > b[campaignSortConfig.key]) {
          return campaignSortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredCampaigns(campaignsToFilter);
  }, [showMyContentOnly, showMyCampaignsOnly, contentSortConfig, campaignSortConfig, contentSearchTerm, campaignSearchTerm, name]);

  const handleContentClick = (contentId) => {
    navigate(`/dashboard/marketing/content/${contentId}`);
  };

  const handleCampaignClick = (campaignId) => {
    navigate(`/dashboard/marketing/campaigns/${campaignId}`);
  };

  const handleShortcutClick = (type) => {
    switch (type) {
      case 'create-campaign':
        navigate('/dashboard/marketing/create-campaign');
        break;
      case 'create-blog':
        navigate('/dashboard/marketing/create-blog');
        break;
      case 'create-ad':
        navigate('/dashboard/marketing/create-ad');
        break;
      case 'referral-links':
        // Show referral links modal or navigate to referral links page
        console.log('Referral links clicked');
        break;
      default:
        console.log('Unknown shortcut type:', type);
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  // Function to determine status color class
  const getStatusColorClass = (status) => {
    switch(status) {
      case 'Active':
        return 'status-active';
      case 'In Progress':
        return 'status-scheduled';
      case 'Completed':
        return 'status-completed';
      case 'Paused':
        return 'status-hold';
      default:
        return '';
    }
  };

  // Filter referral data by timeframe
  const getFilteredReferralData = () => {
    if (leaderboardTimeframe === 'all') {
      return referralData;
    }

    const now = new Date();
    let cutoffDate = new Date();

    if (leaderboardTimeframe === 'month') {
      // Last 30 days
      cutoffDate.setDate(now.getDate() - 30);
    } else if (leaderboardTimeframe === 'quarter') {
      // Last 90 days
      cutoffDate.setDate(now.getDate() - 90);
    } else if (leaderboardTimeframe === 'year') {
      // Last 365 days
      cutoffDate.setDate(now.getDate() - 365);
    }

    return referralData.filter(user => {
      const referralDate = new Date(user.date);
      return referralDate >= cutoffDate;
    });
  };

  // Get leaderboard title based on timeframe
  const getLeaderboardTitle = () => {
    return 'Referral Leaderboard';
  };

  // Function to handle copying referral links
  const handleCopyLink = (type) => {
    copyToClipboard(type);
  };

  // Toggle between leads and investors traffic data
  const toggleTrafficType = () => {
    setTrafficType(trafficType === 'leads' ? 'investors' : 'leads');
  };

  // Fetch content and campaigns from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, this would fetch data from Firebase
        // For now, we'll use our mock data
        setFilteredContent(allContent);
        setFilteredCampaigns(allCampaigns);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Get marketing milestones data
  const getMarketingMilestonesData = () => {
    // Create an array to store marketing milestones
    const marketingMilestones = [
      {
        id: "m101",
        clientName: "Tech Solutions Inc",
        clientId: "c101",
        title: "Website Redesign",
        dueDate: "2025-03-25",
        status: "In Progress",
        lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "Jane Smith"
      },
      {
        id: "m102",
        clientName: "Growth Ventures LLC",
        clientId: "c102",
        title: "SEO Optimization",
        dueDate: "2025-04-10",
        status: "Pending",
        lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "Jane Smith"
      },
      {
        id: "m103",
        clientName: "Innovate Health",
        clientId: "c103",
        title: "Feature Implementation",
        dueDate: "2025-03-30",
        status: "In Progress",
        lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "John Doe"
      },
      {
        id: "m104",
        clientName: "EcoSolutions",
        clientId: "c104",
        title: "Content Creation",
        dueDate: "2025-04-15",
        status: "Pending",
        lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "Jane Smith"
      }
    ];

    return marketingMilestones;
  };

  const marketingMilestones = getMarketingMilestonesData();

  // Toggle showing all milestones
  const toggleMilestonesDisplay = () => {
    setShowAllMilestones(!showAllMilestones);

    // If we're going to show all milestones, smoothly scroll to ensure the container is visible
    if (!showAllMilestones) {
      setTimeout(() => {
        const container = document.querySelector('.graph-container');
        if (container) {
          container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  // Get milestone open time class based on last update time
  const getMilestoneOpenTimeClass = ({ lastMilestoneUpdated }) => {
    if (!lastMilestoneUpdated) return '';

    const lastUpdated = new Date(lastMilestoneUpdated);
    const now = new Date();
    const diffInDays = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24));

    if (diffInDays < 3) {
      return 'milestone-recent';
    } else if (diffInDays < 7) {
      return 'milestone-moderate';
    } else {
      return 'milestone-overdue';
    }
  };

  // Format milestone open time
  const formatMilestoneOpenTime = ({ lastMilestoneUpdated }) => {
    if (!lastMilestoneUpdated) return 'Unknown';

    const lastUpdated = new Date(lastMilestoneUpdated);
    const now = new Date();
    const diffInDays = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return '1 day';
    } else {
      return `${diffInDays} days`;
    }
  };

  // Handle client click for milestone
  const handleClientClick = (clientId) => {
    navigate(`/dashboard/clients/${clientId}`);
  };

  useEffect(() => {
    // In a real app, you would fetch data from your API based on the dateRange
    // For now, we'll just generate some example data

    // Generate example website traffic data
    generateTrafficData();

    // Generate example conversion data
    generateConversionData();

    // Generate example social media data
    generateSocialMediaData();

    // Generate example campaign data
    generateCampaignData();

    // Generate example content data
    generateContentData();

  }, [dateRange, showMyStats]);

  const generateTrafficData = () => {
    const today = new Date();
    const labels = [];
    const directData = [];
    const organicData = [];
    const referralData = [];
    const socialData = [];

    // Generate data for the past X days based on dateRange
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 365;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      // Format the date as 'MM/DD'
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
      labels.push(formattedDate);

      // Generate random traffic numbers with some variations
      const baseDirect = Math.floor(Math.random() * 100) + 50;
      const baseOrganic = Math.floor(Math.random() * 200) + 100;
      const baseReferral = Math.floor(Math.random() * 80) + 30;
      const baseSocial = Math.floor(Math.random() * 150) + 70;

      // Add some weekly patterns (weekends have less traffic)
      const dayOfWeek = date.getDay();
      const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1;

      directData.push(Math.round(baseDirect * weekendFactor));
      organicData.push(Math.round(baseOrganic * weekendFactor));
      referralData.push(Math.round(baseReferral * weekendFactor));
      socialData.push(Math.round(baseSocial * weekendFactor));
    }

    setTrafficData({
      labels,
      datasets: [
        {
          label: 'Direct',
          data: directData,
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Organic Search',
          data: organicData,
          borderColor: '#2ecc71',
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Referral',
          data: referralData,
          borderColor: '#e74c3c',
          backgroundColor: 'rgba(231, 76, 60, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Social',
          data: socialData,
          borderColor: '#9b59b6',
          backgroundColor: 'rgba(155, 89, 182, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    });
  };

  const generateConversionData = () => {
    const today = new Date();
    const labels = [];
    const visitsData = [];
    const leadsData = [];
    const conversionsData = [];
    const rateData = [];

    // Generate data for the past X days based on dateRange
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 365;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      // Format the date as 'MM/DD'
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
      labels.push(formattedDate);

      // Generate random conversion numbers
      const visits = Math.floor(Math.random() * 500) + 200;
      const leads = Math.floor(Math.random() * 50) + 10;
      const conversions = Math.floor(Math.random() * 20) + 5;

      // Calculate conversion rate
      const rate = (conversions / visits) * 100;

      visitsData.push(visits);
      leadsData.push(leads);
      conversionsData.push(conversions);
      rateData.push(rate.toFixed(2));
    }

    setConversionData({
      labels,
      visits: visitsData,
      leads: leadsData,
      conversions: conversionsData,
      rates: rateData,
      datasets: [
        {
          label: 'Conversion Rate (%)',
          data: rateData,
          borderColor: '#f39c12',
          backgroundColor: 'rgba(243, 156, 18, 0.1)',
          tension: 0.4,
          fill: true,
          yAxisID: 'y'
        },
        {
          label: 'Visits',
          data: visitsData,
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          tension: 0.4,
          fill: false,
          yAxisID: 'y1'
        }
      ]
    });
  };

  const generateSocialMediaData = () => {
    // Generate example social media engagement data with more detailed metrics
    const platformNames = ['LinkedIn', 'Twitter', 'Facebook', 'Instagram', 'YouTube'];

    // Create platform objects with expanded metrics
    const platforms = platformNames.map(name => {
      const baseFollowers = {
        'LinkedIn': Math.floor(Math.random() * 5000) + 3000,
        'Twitter': Math.floor(Math.random() * 3000) + 2000,
        'Facebook': Math.floor(Math.random() * 4000) + 2500,
        'Instagram': Math.floor(Math.random() * 2500) + 1500,
        'YouTube': Math.floor(Math.random() * 1000) + 500
      }[name];

      const baseEngagement = {
        'LinkedIn': Math.floor(Math.random() * 2000) + 1000,
        'Twitter': Math.floor(Math.random() * 1500) + 800,
        'Facebook': Math.floor(Math.random() * 1200) + 600,
        'Instagram': Math.floor(Math.random() * 1800) + 900,
        'YouTube': Math.floor(Math.random() * 800) + 400
      }[name];

      // Generate monthly data for the past 6 months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const monthlyData = months.map((month, index) => {
        // Simulate growth over time
        const growthFactor = 1 + (index * 0.05);
        return {
          month,
          followers: Math.floor(baseFollowers * growthFactor),
          engagement: Math.floor(baseEngagement * growthFactor),
          posts: Math.floor(Math.random() * 15) + 5,
          clicks: Math.floor(Math.random() * 500) + 200,
          impressions: Math.floor(Math.random() * 10000) + 5000,
          leads: Math.floor(Math.random() * 20) + 5
        };
      });

      // Calculate growth percentage based on first and last month
      const firstMonth = monthlyData[0];
      const lastMonth = monthlyData[monthlyData.length - 1];
      const followerGrowth = ((lastMonth.followers - firstMonth.followers) / firstMonth.followers * 100).toFixed(1);
      const engagementGrowth = ((lastMonth.engagement - firstMonth.engagement) / firstMonth.engagement * 100).toFixed(1);

      return {
        name,
        followers: lastMonth.followers,
        engagement: lastMonth.engagement,
        clicks: lastMonth.clicks,
        impressions: lastMonth.impressions,
        leads: lastMonth.leads,
        posts: lastMonth.posts,
        followerGrowth: parseFloat(followerGrowth),
        engagementGrowth: parseFloat(engagementGrowth),
        engagementRate: ((lastMonth.engagement / lastMonth.impressions) * 100).toFixed(1),
        monthlyData
      };
    });

    // Sort platforms by engagement
    const sortedPlatforms = [...platforms].sort((a, b) => b.engagement - a.engagement);

    // Prepare data for pie chart
    const pieChartData = {
      labels: sortedPlatforms.map(p => p.name),
      datasets: [
        {
          data: sortedPlatforms.map(p => p.engagement),
          backgroundColor: [
            '#0077b5', // LinkedIn
            '#1da1f2', // Twitter
            '#3b5998', // Facebook
            '#e1306c', // Instagram
            '#ff0000'  // YouTube
          ],
          borderColor: '#112240',
          borderWidth: 2,
          hoverOffset: 10
        }
      ]
    };

    // Prepare data for line chart showing growth over time
    const lineChartData = {
      labels: platforms[0].monthlyData.map(d => d.month),
      datasets: platformNames.map((name, index) => {
        const platform = platforms.find(p => p.name === name);
        const colors = ['#0077b5', '#1da1f2', '#3b5998', '#e1306c', '#ff0000'];

        return {
          label: name,
          data: platform.monthlyData.map(m => m.followers),
          borderColor: colors[index],
          backgroundColor: `${colors[index]}20`,
          tension: 0.3,
          fill: false,
          pointRadius: 3
        };
      })
    };

    // Prepare data for bar chart showing engagement by platform
    const barChartData = {
      labels: sortedPlatforms.map(p => p.name),
      datasets: [
        {
          label: 'Engagement',
          data: sortedPlatforms.map(p => p.engagement),
          backgroundColor: sortedPlatforms.map((p, i) => {
            const colors = ['#0077b5', '#1da1f2', '#3b5998', '#e1306c', '#ff0000'];
            return colors[platformNames.indexOf(p.name)];
          }),
          borderWidth: 0
        }
      ]
    };

    setSocialMediaData({
      platforms: sortedPlatforms,
      pieChartData,
      lineChartData,
      barChartData,
      months: platforms[0].monthlyData.map(d => d.month)
    });
  };

  const generateCampaignData = () => {
    // Generate example campaign performance data
    const campaigns = [
      {
        id: 1,
        name: 'Summer Sale',
        status: 'Active',
        budget: 5000,
        spent: 2750,
        leads: 142,
        conversions: 28,
        roi: 3.2
      },
      {
        id: 2,
        name: 'Product Launch',
        status: 'Active',
        budget: 8000,
        spent: 6400,
        leads: 215,
        conversions: 47,
        roi: 2.8
      },
      {
        id: 3,
        name: 'Holiday Promotion',
        status: 'Scheduled',
        budget: 10000,
        spent: 0,
        leads: 0,
        conversions: 0,
        roi: 0
      },
      {
        id: 4,
        name: 'Referral Program',
        status: 'Active',
        budget: 3000,
        spent: 1800,
        leads: 95,
        conversions: 31,
        roi: 4.1
      },
      {
        id: 5,
        name: 'Spring Event',
        status: 'Completed',
        budget: 4500,
        spent: 4500,
        leads: 178,
        conversions: 42,
        roi: 3.5
      }
    ];

    setCampaignData(campaigns);
  };

  const generateContentData = () => {
    // Generate example content performance data
    const content = [
      {
        id: 1,
        title: '10 Ways to Improve Your Digital Marketing',
        type: 'Blog Post',
        date: '2024-03-01',
        views: 1250,
        shares: 85,
        leads: 37,
        author: 'John Doe'
      },
      {
        id: 2,
        title: 'Ultimate Guide to SEO in 2024',
        type: 'Whitepaper',
        date: '2024-02-15',
        views: 980,
        shares: 103,
        leads: 52,
        author: 'Jane Smith'
      },
      {
        id: 3,
        title: 'How to Create High-Converting Landing Pages',
        type: 'Blog Post',
        date: '2024-03-05',
        views: 870,
        shares: 62,
        leads: 29,
        author: 'John Doe'
      },
      {
        id: 4,
        title: 'Email Marketing Best Practices',
        type: 'Webinar',
        date: '2024-02-28',
        views: 1420,
        shares: 126,
        leads: 64,
        author: 'Jane Smith'
      },
      {
        id: 5,
        title: 'Social Media Strategy for B2B Companies',
        type: 'Case Study',
        date: '2024-03-10',
        views: 720,
        shares: 48,
        leads: 31,
        author: 'John Doe'
      }
    ];

    setContentData(content);
  };

  // Calculate total website traffic
  const calculateTotalTraffic = () => {
    if (!trafficData.datasets) return 0;

    let total = 0;

    // Sum up the last day's traffic from all sources
    const lastDayIndex = trafficData.datasets[0].data.length - 1;

    trafficData.datasets.forEach(dataset => {
      total += dataset.data[lastDayIndex];
    });

    return total;
  };

  // Calculate average conversion rate
  const calculateAvgConversionRate = () => {
    if (!conversionData.rates) return 0;

    const sum = conversionData.rates.reduce((acc, rate) => acc + parseFloat(rate), 0);
    return (sum / conversionData.rates.length).toFixed(2);
  };

  // Calculate total social engagements
  const calculateTotalSocialEngagements = () => {
    if (!socialMediaData.engagements) return 0;

    return socialMediaData.engagements.reduce((acc, engagement) => acc + engagement, 0);
  };

  // Calculate total leads from campaigns
  const calculateTotalCampaignLeads = () => {
    if (!campaignData.length) return 0;

    return campaignData.reduce((acc, campaign) => acc + campaign.leads, 0);
  };

  // Calculate total content views
  const calculateTotalContentViews = () => {
    if (!contentData.length) return 0;

    return contentData.reduce((acc, content) => acc + content.views, 0);
  };

  // Get date range display text
  const getDateRangeText = () => {
    switch(dateRange) {
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 90 Days';
      case '1y': return 'Last Year';
      default: return 'Last 7 Days';
    }
  };

  // Get view type text
  const getViewTypeText = () => {
    return showMyStats ? 'My Marketing' : 'Company Marketing';
  };

  return (
    <div className={styles.marketingDashboard}>
      <div className={styles.marketingHeader}>
        <h1>Marketing</h1>
        <div className={styles.marketingSubheader}>
          <span>{getViewTypeText()} • {getDateRangeText()}</span>
        </div>
      </div>

      {/* Marketing Summary Section */}
      <DashboardSection>
        <p className={styles.summaryText}>
          Your marketing efforts have generated {websiteVisitors.toLocaleString()} website visitors and {leadsGenerated} new leads in the {getDateRangeText().toLowerCase()}.
          The average conversion rate is {conversionRate}%, with a cost per lead of ${costPerLead}.
          Your top performing campaign is "{topCampaign.name}" with {topCampaign.leads} leads generated.
        </p>
      </DashboardSection>

      {/* Marketing Statistics Section */}
      <DashboardSection title="Marketing Statistics">
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>WEBSITE VISITORS</h3>
            <div className={styles.value}>{websiteVisitors.toLocaleString()}</div>
            <div className={`${styles.change} ${trafficTrend === 'up' ? styles.positive : styles.negative}`}>
              {trafficTrend === 'up' ? '+' : '-'}{trafficChangePercent}%
            </div>
          </div>
          <div className={styles.statCard}>
            <h3>CONVERSION RATE</h3>
            <div className={styles.value}>{conversionRate}%</div>
          </div>
          <div className={styles.statCard}>
            <h3>LEADS GENERATED</h3>
            <div className={styles.value}>{leadsGenerated}</div>
          </div>
          <div className={styles.statCard}>
            <h3>COST PER LEAD</h3>
            <div className={styles.value}>${costPerLead}</div>
          </div>
        </div>
      </DashboardSection>

      {/* Traffic Sources Section */}
      <DashboardSection title="Traffic Sources">
        <div className={styles.trafficSourcesContainer}>
          <div className={styles.trafficControls}>
            <div className={styles.trafficTypeSelector}>
              <button
                className={`${styles.trafficTypeButton} ${trafficType === 'leads' ? styles.active : ''}`}
                onClick={() => setTrafficType('leads')}
              >
                Lead Traffic
              </button>
              <button
                className={`${styles.trafficTypeButton} ${trafficType === 'investors' ? styles.active : ''}`}
                onClick={() => setTrafficType('investors')}
              >
                Investor Traffic
              </button>
            </div>
            <div className={styles.sourceSelector}>
              <button
                className={`${styles.sourceButton} ${graphSource === 'all' ? styles.active : ''}`}
                onClick={() => setGraphSource('all')}
              >
                All Sources
              </button>
              <button
                className={`${styles.sourceButton} ${graphSource === 'organic' ? styles.active : ''}`}
                onClick={() => setGraphSource('organic')}
              >
                Organic
              </button>
              <button
                className={`${styles.sourceButton} ${graphSource === 'paid' ? styles.active : ''}`}
                onClick={() => setGraphSource('paid')}
              >
                Paid
              </button>
              <button
                className={`${styles.sourceButton} ${graphSource === 'social' ? styles.active : ''}`}
                onClick={() => setGraphSource('social')}
              >
                Social
              </button>
              <button
                className={`${styles.sourceButton} ${graphSource === 'referral' ? styles.active : ''}`}
                onClick={() => setGraphSource('referral')}
              >
                Referral
              </button>
            </div>
          </div>
          <div className={styles.chartContainer}>
            {/* Chart would be rendered here */}
          </div>
        </div>
      </DashboardSection>

      {/* Campaign Performance Section */}
      <DashboardSection title="Campaign Performance">
        <div className={styles.tableContainer}>
          <table className={styles.campaignTable}>
            <thead>
              <tr>
                <th onClick={() => requestCampaignSort('name')}>
                  Campaign Name
                </th>
                <th onClick={() => requestCampaignSort('status')}>
                  Status
                </th>
                <th onClick={() => requestCampaignSort('leads')}>
                  Leads
                </th>
                <th onClick={() => requestCampaignSort('conversion')}>
                  Conversion
                </th>
                <th onClick={() => requestCampaignSort('cost')}>
                  Cost
                </th>
                <th onClick={() => requestCampaignSort('roi')}>
                  ROI
                </th>
              </tr>
            </thead>
            <tbody>
              {allCampaigns.map(campaign => (
                <tr key={campaign.id} onClick={() => handleCampaignClick(campaign.id)}>
                  <td className={styles.campaignName}>{campaign.name}</td>
                  <td>
                    <span className={`${styles.campaignStatus} ${styles[`status${campaign.status.replace(' ', '')}`]}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td>{campaign.leads || 0}</td>
                  <td>{campaign.conversion || 0}%</td>
                  <td>${campaign.cost ? campaign.cost.toLocaleString() : '0'}</td>
                  <td>{campaign.roi || 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardSection>

      {/* Content Performance Section */}
      <DashboardSection title="Content Performance">
        <div className={styles.tableContainer}>
          <table className={styles.contentTable}>
            <thead>
              <tr>
                <th onClick={() => requestContentSort('title')}>
                  Title
                </th>
                <th onClick={() => requestContentSort('type')}>
                  Type
                </th>
                <th onClick={() => requestContentSort('views')}>
                  Views
                </th>
                <th onClick={() => requestContentSort('conversions')}>
                  Conversions
                </th>
                <th onClick={() => requestContentSort('conversionRate')}>
                  Conv. Rate
                </th>
                <th onClick={() => requestContentSort('publishDate')}>
                  Published
                </th>
              </tr>
            </thead>
            <tbody>
              {allContent.map(content => (
                <tr key={content.id} onClick={() => handleContentClick(content.id)}>
                  <td className={styles.contentTitle}>{content.title}</td>
                  <td>
                    <span className={`${styles.contentType} ${styles[`type${content.type}`]}`}>
                      {content.type}
                    </span>
                  </td>
                  <td>{content.views ? content.views.toLocaleString() : '0'}</td>
                  <td>{content.conversions || 0}</td>
                  <td>{content.views && content.conversions ? ((content.conversions / content.views) * 100).toFixed(1) : '0'}%</td>
                  <td>{new Date(content.publishDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardSection>
    </div>
  );
};

export default MarketingDashboard;