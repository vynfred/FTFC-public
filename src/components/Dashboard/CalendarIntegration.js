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

  // Fetch client list on component mount and check calendar connection
  useEffect(() => {
    // Check both localStorage and sessionStorage for redundancy
    const localStorageConnected = localStorage.getItem('googleCalendarConnected') === 'true';
    const sessionStorageConnected = sessionStorage.getItem('googleCalendarConnected') === 'true';
    const calendarConnected = localStorageConnected || sessionStorageConnected;

    console.log('CalendarIntegration: Initial check - Calendar connected:', calendarConnected);
    console.log('CalendarIntegration: localStorage connected:', localStorageConnected);
    console.log('CalendarIntegration: sessionStorage connected:', sessionStorageConnected);

    // If connected in one storage but not the other, sync them
    if (localStorageConnected && !sessionStorageConnected) {
      sessionStorage.setItem('googleCalendarConnected', 'true');
    } else if (!localStorageConnected && sessionStorageConnected) {
      localStorage.setItem('googleCalendarConnected', 'true');
    }

    if (calendarConnected) {
      setIsCalendarConnected(true);
      console.log('CalendarIntegration: Setting isCalendarConnected to TRUE on mount');
    }

    // Check URL parameters for auth state
    const urlParams = new URLSearchParams(window.location.search);
    const authParam = urlParams.get('auth');
    if (authParam) {
      console.log('CalendarIntegration: Detected auth parameter in URL, setting connected state');
      setIsCalendarConnected(true);
      localStorage.setItem('googleCalendarConnected', 'true');
      sessionStorage.setItem('googleCalendarConnected', 'true');
    }

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

  // Listen for changes to localStorage and sessionStorage
  useEffect(() => {
    // Create a storage event listener to detect changes from other tabs/windows
    const handleStorageChange = (event) => {
      if (event.key === 'googleCalendarConnected') {
        const isConnected = event.newValue === 'true';
        console.log('CalendarIntegration: Storage event - Calendar connected changed to:', isConnected);
        setIsCalendarConnected(isConnected);

        // Sync the other storage
        if (event.storageArea === localStorage) {
          sessionStorage.setItem('googleCalendarConnected', event.newValue);
        } else if (event.storageArea === sessionStorage) {
          localStorage.setItem('googleCalendarConnected', event.newValue);
        }
      }
    };

    // Add event listener
    window.addEventListener('storage', handleStorageChange);

    // Check connection status every 2 seconds (as a fallback)
    const intervalId = setInterval(() => {
      // Check both localStorage and sessionStorage
      const localStorageConnected = localStorage.getItem('googleCalendarConnected') === 'true';
      const sessionStorageConnected = sessionStorage.getItem('googleCalendarConnected') === 'true';
      const calendarConnected = localStorageConnected || sessionStorageConnected;

      if (calendarConnected !== isCalendarConnected) {
        console.log('CalendarIntegration: Interval check - Calendar connected changed to:', calendarConnected);
        console.log('CalendarIntegration: localStorage connected:', localStorageConnected);
        console.log('CalendarIntegration: sessionStorage connected:', sessionStorageConnected);

        // Sync storages if they're different
        if (localStorageConnected && !sessionStorageConnected) {
          sessionStorage.setItem('googleCalendarConnected', 'true');
        } else if (!localStorageConnected && sessionStorageConnected) {
          localStorage.setItem('googleCalendarConnected', 'true');
        }

        setIsCalendarConnected(calendarConnected);
      }
    }, 2000);

    // Check if we just returned from OAuth flow
    const checkOAuthReturn = () => {
      // Check URL for OAuth callback indicators
      const url = window.location.href;
      if (url.includes('/dashboard/calendar') && (url.includes('state=') || url.includes('auth='))) {
        console.log('CalendarIntegration: Detected return from OAuth flow or auth parameter');

        // Force set the connection flag
        localStorage.setItem('googleCalendarConnected', 'true');
        sessionStorage.setItem('googleCalendarConnected', 'true');
        setIsCalendarConnected(true);
        console.log('CalendarIntegration: Force set connection flags after OAuth return');
      }
    };

    // Run the check once on mount
    checkOAuthReturn();

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [isCalendarConnected]);

  // Handle calendar connection
  const handleCalendarConnect = (tokens, profile) => {
    console.log('CalendarIntegration: handleCalendarConnect called');
    // Set both localStorage and sessionStorage flags
    localStorage.setItem('googleCalendarConnected', 'true');
    sessionStorage.setItem('googleCalendarConnected', 'true');
    setIsCalendarConnected(true);
    console.log('CalendarIntegration: Connection flags set in handleCalendarConnect');
  };

  // Handle calendar disconnection
  const handleCalendarDisconnect = () => {
    console.log('CalendarIntegration: handleCalendarDisconnect called');
    // Clear both localStorage and sessionStorage flags
    localStorage.removeItem('googleCalendarConnected');
    sessionStorage.removeItem('googleCalendarConnected');
    setIsCalendarConnected(false);
    setShowMeetingScheduler(false);
    console.log('CalendarIntegration: Connection flags cleared in handleCalendarDisconnect');
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
