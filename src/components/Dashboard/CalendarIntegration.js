import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaPlus, FaVideo } from 'react-icons/fa';
import GoogleCalendarConnect from '../integrations/GoogleCalendarConnect';
import MeetingHistory from '../integrations/MeetingHistoryUpdated';
import MeetingScheduler from '../integrations/MeetingScheduler';
import styles from './Dashboard.module.css';

/**
 * Calendar Integration Component for Team Dashboard
 *
 * This component allows team members to:
 * - Connect their Google Calendar
 * - Schedule meetings with clients/investors/partners
 * - View their meeting history
 */
const CalendarIntegration = () => {
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [showMeetingScheduler, setShowMeetingScheduler] = useState(false);
  const [clientList, setClientList] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');

  // Fetch client list on component mount
  useEffect(() => {
    // In a real app, this would fetch from your backend
    const fetchClients = async () => {
      // Mock data
      const mockClients = [
        { id: '1', name: 'Acme Corp', email: 'contact@acmecorp.com' },
        { id: '2', name: 'Globex Industries', email: 'info@globex.com' },
        { id: '3', name: 'Initech', email: 'support@initech.com' },
        { id: '4', name: 'Umbrella Corp', email: 'contact@umbrella.com' }
      ];

      setClientList(mockClients);
    };

    fetchClients();
  }, []);

  // Handle calendar connection
  const handleCalendarConnect = (tokens, profile) => {
    setIsCalendarConnected(true);
  };

  // Handle calendar disconnection
  const handleCalendarDisconnect = () => {
    setIsCalendarConnected(false);
    setShowMeetingScheduler(false);
  };

  // Handle meeting scheduled
  const handleMeetingScheduled = (event) => {
    setShowMeetingScheduler(false);
    // In a real app, you would update the meeting data
  };

  // Handle client selection
  const handleClientSelect = (e) => {
    setSelectedClient(e.target.value);
  };

  // Get selected client email
  const getSelectedClientEmail = () => {
    if (!selectedClient) return '';

    const client = clientList.find(c => c.id === selectedClient);
    return client ? client.email : '';
  };

  return (
    <div className={styles.calendarIntegrationContainer}>
      <div className={styles.sectionHeader}>
        <h2>
          <FaCalendarAlt className={styles.headerIcon} />
          Calendar Integration
        </h2>
        <p>Connect your Google Calendar to schedule and manage client meetings</p>
      </div>

      <div className={styles.calendarConnectSection}>
        <GoogleCalendarConnect
          onConnect={handleCalendarConnect}
          onDisconnect={handleCalendarDisconnect}
        />
      </div>

      {isCalendarConnected && (
        <>
          <div className={styles.meetingActionsSection}>
            <div className={styles.sectionHeader}>
              <h3>
                <FaVideo className={styles.headerIcon} />
                Schedule Client Meetings
              </h3>
            </div>

            <div className={styles.clientSelectContainer}>
              <label htmlFor="clientSelect">Select a client to schedule a meeting with:</label>
              <select
                id="clientSelect"
                value={selectedClient}
                onChange={handleClientSelect}
                className={styles.clientSelect}
              >
                <option value="">-- Select a client --</option>
                {clientList.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>

              <button
                className={styles.scheduleButton}
                onClick={() => setShowMeetingScheduler(!showMeetingScheduler)}
                disabled={!selectedClient}
              >
                <FaPlus className={styles.buttonIcon} />
                {showMeetingScheduler ? 'Hide Scheduler' : 'Schedule Meeting'}
              </button>
            </div>

            {showMeetingScheduler && selectedClient && (
              <div className={styles.meetingSchedulerContainer}>
                <MeetingScheduler
                  onScheduled={handleMeetingScheduled}
                  contactEmail={getSelectedClientEmail()}
                  entityType="client"
                  entityId={selectedClient}
                  entityName={clientList.find(c => c.id === selectedClient)?.name || ''}
                />
              </div>
            )}
          </div>

          <div className={styles.meetingHistorySection}>
            <div className={styles.sectionHeader}>
              <h3>Your Meeting History</h3>
            </div>
            <MeetingHistory
              entityType={selectedClient ? 'client' : null}
              entityId={selectedClient}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CalendarIntegration;
