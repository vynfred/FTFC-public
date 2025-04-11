import React, { useEffect, useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { getUserInfo } from '../../services/calendlyIntegration';
import { getStoredTokens } from '../../services/googleIntegration';
import styles from './Integrations.module.css';

/**
 * Calendly Booking Link Component
 *
 * This component displays a Calendly booking link for clients, investors, or partners
 * to schedule meetings with team members.
 */
const CalendlyBookingLink = ({
  teamMemberId,
  teamMemberName,
  entityType, // 'client', 'investor', or 'partner'
  entityId,
  entityName
}) => {
  const [calendlyUrl, setCalendlyUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);

  // Check if Google Calendar is connected
  useEffect(() => {
    const tokens = getStoredTokens();
    setIsGoogleConnected(!!tokens);
  }, []);

  // Fetch Calendly URL on component mount
  useEffect(() => {
    const fetchCalendlyUrl = async () => {
      try {
        setIsLoading(true);
        
        // In a real implementation, you would fetch the team member's Calendly URL from your database
        // For now, we'll use a mock URL
        
        // Mock data - in a real app, this would come from your database
        const mockTeamMembers = {
          '1': {
            name: 'John Doe',
            calendlyUrl: 'https://calendly.com/johndoe/30min'
          },
          '2': {
            name: 'Jane Smith',
            calendlyUrl: 'https://calendly.com/janesmith/30min'
          },
          '3': {
            name: 'Bob Johnson',
            calendlyUrl: 'https://calendly.com/bobjohnson/30min'
          }
        };
        
        // Get the team member's Calendly URL
        const teamMember = mockTeamMembers[teamMemberId];
        
        if (!teamMember) {
          throw new Error(`Team member not found: ${teamMemberId}`);
        }
        
        // Construct the Calendly URL with UTM parameters and prefill information
        let url = `${teamMember.calendlyUrl}?utm_source=ftfc&utm_medium=portal&utm_campaign=${entityType}_portal`;
        
        // Add prefill information if available
        if (entityName) {
          url += `&name=${encodeURIComponent(entityName)}`;
        }
        
        // Add custom questions for entity tracking
        url += `&custom_question_1=${encodeURIComponent('Entity Type')}&custom_answer_1=${encodeURIComponent(entityType)}`;
        url += `&custom_question_2=${encodeURIComponent('Entity ID')}&custom_answer_2=${encodeURIComponent(entityId)}`;
        
        setCalendlyUrl(url);
      } catch (error) {
        console.error('Error fetching Calendly URL:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (teamMemberId) {
      fetchCalendlyUrl();
    }
  }, [teamMemberId, entityType, entityId, entityName]);
  
  if (isLoading) {
    return <div className={styles.loading}>Loading booking link...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }
  
  if (!calendlyUrl) {
    return <div className={styles.noLink}>No booking link available</div>;
  }
  
  return (
    <div className={styles.calendlyBookingLink}>
      <h3 className={styles.bookingTitle}>
        <FaCalendarAlt className={styles.bookingIcon} />
        Schedule a Meeting with {teamMemberName}
      </h3>
      
      <p className={styles.bookingDescription}>
        Click the button below to schedule a meeting at a time that works for you.
      </p>
      
      <a
        href={calendlyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.bookingButton}
      >
        Schedule Meeting
      </a>
      
      {isGoogleConnected && (
        <p className={styles.googleConnected}>
          Your Google Calendar is connected. Meetings will be automatically added to your calendar.
        </p>
      )}
    </div>
  );
};

export default CalendlyBookingLink;
