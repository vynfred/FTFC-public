import React, { useEffect, useState } from 'react';
import { FaChartLine, FaHandshake } from 'react-icons/fa';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import InvestmentProspectus from '../common/InvestmentProspectus';
import MeetingSection from '../common/MeetingSection';
import ReferralLink from '../common/ReferralLink';
import TeamMemberCard from '../common/TeamMemberCard';
import MeetingTranscriptList from '../meetings/MeetingTranscriptList';
import styles from './Portal.module.css';

const InvestorPortal = () => {
  const { user, hasRole, USER_ROLES } = useAuth();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [prospectusNotes, setProspectusNotes] = useState('');

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Set page title
    document.title = 'FTFC | Investor Portal';
  }, []);

  // Security check - only investors can access this portal
  if (!hasRole(USER_ROLES.INVESTOR)) {
    return <Navigate to="/investor-login" replace />;
  }

  // Sample data - in a real app, this would come from your backend
  const investorData = {
    name: 'Jane Investor',
    activeInvestments: 5,
    pendingDeals: 3,
    assignedTeamMember: {
      name: 'Sarah Johnson',
      title: 'Investment Relations Manager',
      email: 'sarah.johnson@ftfc.com',
      phone: '(555) 987-6543',
      imageSrc: '/images/team-member-2.jpg'
    },
    // Upcoming meeting - set to null to show the booking button
    upcomingMeeting: null, // This will show the "Book a Meeting" button
    // Investment prospectus from investor detail page
    investmentProspectus: {
      investmentFocus: ['SaaS', 'FinTech', 'HealthTech'],
      investmentSize: '$500K - $2M',
      preferredStages: ['Seed', 'Series A'],
      geographicFocus: 'North America, Europe',
      expectedReturns: '3-5x within 5 years',
      investmentHorizon: '5-7 years',
      notes: 'Looking for companies with strong founding teams and clear product-market fit. Particularly interested in B2B SaaS with recurring revenue models.'
    },
    opportunities: [
      {
        id: 'opp1',
        companyName: 'TechStart Inc.',
        stage: 'Series A',
        description: 'AI-powered customer service platform with 200% YoY growth',
        seeking: '$2.5M',
        valuation: '$12M',
        industry: 'SaaS'
      },
      {
        id: 'opp2',
        companyName: 'HealthSync',
        stage: 'Seed',
        description: 'Remote patient monitoring platform for chronic conditions',
        seeking: '$1.2M',
        valuation: '$6M',
        industry: 'HealthTech'
      },
      {
        id: 'opp3',
        companyName: 'FinSecure',
        stage: 'Series A',
        description: 'Blockchain-based identity verification for financial institutions',
        seeking: '$3M',
        valuation: '$15M',
        industry: 'FinTech'
      }
    ],
    portfolio: [
      {
        companyName: 'DataViz Analytics',
        investmentDate: 'Jan 2022',
        amount: '$750K',
        status: 'Active',
        performance: '+15%'
      },
      {
        companyName: 'CloudScale',
        investmentDate: 'Aug 2021',
        amount: '$1.2M',
        status: 'Active',
        performance: '+22%'
      },
      {
        companyName: 'SecureAuth',
        investmentDate: 'Mar 2021',
        amount: '$500K',
        status: 'Active',
        performance: '+8%'
      }
    ]
  };

  const handleBookMeeting = () => {
    setShowBookingModal(true);
    // In a real app, you would open a booking modal or redirect to a booking page
    console.log('Book meeting clicked');
  };

  const handleSaveNotes = (notes) => {
    setProspectusNotes(notes);
    // In a real app, you would save this to the backend
    console.log('Saving notes:', notes);
  };

  return (
    <div className={styles.portalContainer}>
      <div className={styles.portalHeader}>
        <h1>Welcome to Your Investor Portal</h1>
        <p>Manage your investments and discover new opportunities</p>
      </div>

      <div className={styles.portalContent}>
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Overview</h2>

          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <FaChartLine />
              </div>
              <div className={styles.metricContent}>
                <h3>Active Investments</h3>
                <p className={styles.metricValue}>{investorData.activeInvestments}</p>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <FaHandshake />
              </div>
              <div className={styles.metricContent}>
                <h3>Pending Deals</h3>
                <p className={styles.metricValue}>{investorData.pendingDeals}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Prospectus Section */}
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Your Investment Profile</h2>
          <InvestmentProspectus
            prospectus={investorData.investmentProspectus}
            onSaveNotes={handleSaveNotes}
          />
        </div>

        {/* Meeting Section */}
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Meetings</h2>
          <MeetingSection
            meeting={investorData.upcomingMeeting}
            onBookMeeting={handleBookMeeting}
          />
        </div>

        {/* Meeting Transcripts Section */}
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Meeting Transcripts</h2>
          <MeetingTranscriptList
            entityType="investor"
            entityId={user?.uid || '123'}
            readOnly={true}
          />
        </div>

        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Investment Opportunities</h2>

          <div className={styles.opportunitiesList}>
            {investorData.opportunities.map((opportunity) => (
              <div key={opportunity.id} className={styles.opportunityCard}>
                <div className={styles.opportunityHeader}>
                  <h3>{opportunity.companyName}</h3>
                  <span className={styles.opportunityStage}>{opportunity.stage}</span>
                </div>
                <p className={styles.opportunityDescription}>{opportunity.description}</p>
                <div className={styles.opportunityDetails}>
                  <div className={styles.opportunityDetail}>
                    <span className={styles.detailLabel}>Industry:</span>
                    <span className={styles.detailValue}>{opportunity.industry}</span>
                  </div>
                  <div className={styles.opportunityDetail}>
                    <span className={styles.detailLabel}>Seeking:</span>
                    <span className={styles.detailValue}>{opportunity.seeking}</span>
                  </div>
                  <div className={styles.opportunityDetail}>
                    <span className={styles.detailLabel}>Valuation:</span>
                    <span className={styles.detailValue}>{opportunity.valuation}</span>
                  </div>
                </div>
                <button className={styles.viewDetailsButton}>View Details</button>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Your Investments</h2>

          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Investment Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Performance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {investorData.portfolio.map((investment, index) => (
                  <tr key={index}>
                    <td>{investment.companyName}</td>
                    <td>{investment.investmentDate}</td>
                    <td>{investment.amount}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles.statusActive}`}>
                        {investment.status}
                      </span>
                    </td>
                    <td className={styles.performancePositive}>{investment.performance}</td>
                    <td>
                      <button className={styles.actionButton}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Help expand our network</h2>
          <ReferralLink
            userId={user?.uid || 'investor123'}
            type="investor"
            title="Your Investor Referral Link"
          />
        </div>

        {/* Team Member Card Section */}
        <div className={styles.portalSection}>
          <h2 className={styles.sectionTitle}>Your FTFC Advisor</h2>
          <TeamMemberCard
            name={investorData.assignedTeamMember.name}
            title={investorData.assignedTeamMember.title}
            email={investorData.assignedTeamMember.email}
            phone={investorData.assignedTeamMember.phone}
            imageSrc={investorData.assignedTeamMember.imageSrc}
          />
        </div>
      </div>
    </div>
  );
};

export default InvestorPortal;
