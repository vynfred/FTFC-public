import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaGoogle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase-config';
import { exchangeCodeForTokens, initializeGoogleClient, listCalendarEvents } from '../../services/googleIntegration';
import LoadingSpinner from '../common/LoadingSpinner';
import styles from './CalendarView.module.css';
import DashboardSection from './DashboardSection';

/**
 * CalendarView component for displaying a full calendar with Google Calendar events
 */
const CalendarView = () => {
  const { user } = useAuth();
  const currentUser = user;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [userTokens, setUserTokens] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', or 'day'
  const [showAllEvents, setShowAllEvents] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Get start and end dates for the current view
  const getDateRange = useCallback(() => {
    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);

    if (viewMode === 'month') {
      startDate.setDate(1); // First day of month
      startDate.setHours(0, 0, 0, 0);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0); // Last day of month
      endDate.setHours(23, 59, 59, 999);
    } else if (viewMode === 'week') {
      const day = startDate.getDay();
      startDate.setDate(startDate.getDate() - day); // First day of week (Sunday)
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(startDate.getDate() + 6); // Last day of week (Saturday)
      endDate.setHours(23, 59, 59, 999);
    } else if (viewMode === 'day') {
      // For day view, start and end are the same day
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    }

    return { startDate, endDate };
  }, [currentDate, viewMode]);

  // Check for OAuth callback code in URL
  useEffect(() => {
    const handleOAuthCallback = async () => {
      // const urlParams = new URLSearchParams(location.search);
      // const code = urlParams.get('code');

      // if (code) {
      setLoading(true);
      setError(null);

      try {
        console.log('Received OAuth callback code, exchanging for tokens...');

        // Exchange code for tokens
        const tokens = await exchangeCodeForTokens();

        if (tokens && currentUser) {
          // Save tokens to user document in Firestore
          await setDoc(doc(db, 'users', currentUser.uid), {
            tokens,
            lastUpdated: new Date().toISOString()
          }, { merge: true });

          // Also store tokens in localStorage for consistency with GoogleCalendarConnect
          localStorage.setItem('googleTokens', JSON.stringify(tokens));
          localStorage.setItem('googleCalendarConnected', 'true');

          setUserTokens(tokens);
          setGoogleConnected(true);

          // Get the return path from localStorage or use default
          const returnPath = localStorage.getItem('googleAuthReturnPath') || '/dashboard/calendar';
          console.log('CalendarView: Return path:', returnPath);

          // Remove code from URL and navigate to return path
          navigate(returnPath, { replace: true });

          // Clear the return path
          localStorage.removeItem('googleAuthReturnPath');
        }
      } catch (err) {
        console.error('Error exchanging code for tokens:', err);
        setError('Failed to connect to Google Calendar. Please try again.');
      } finally {
        setLoading(false);
        setIsConnecting(false);
      }
      // }
    };

    handleOAuthCallback();
  }, [location, currentUser, navigate]);

  // Fetch user's Google tokens
  useEffect(() => {
    const fetchUserTokens = async () => {
      console.log('Fetching user...', currentUser);
      try {
        if (!currentUser) {
          console.log('No current user logged in.');
          setError('User not logged in.');
          return;
        }

        console.log('Checking for Google tokens...');

        // First check localStorage for tokens (from GoogleCalendarConnect)
        const localTokens = localStorage.getItem('googleTokens');
        const calendarConnected = localStorage.getItem('googleCalendarConnected');
        console.log('Local storage tokens:', localTokens ? 'Found' : 'Not found');
        console.log('Calendar connected flag:', calendarConnected);

        if (localTokens && calendarConnected === 'true') {
          const parsedTokens = JSON.parse(localTokens);
          console.log('Parsed tokens from localStorage:', parsedTokens);
          setUserTokens(parsedTokens);
          setGoogleConnected(true);
          console.log('Set googleConnected to TRUE from localStorage tokens');
          return; // If we found tokens in localStorage, no need to check Firestore
        }

        // If no tokens in localStorage, check Firestore
        console.log('Checking Firestore for tokens...');
        // const userRef = collection(db, 'users');
        // const q = query(userRef, where('uid', '==', currentUser.uid));
        // const querySnapshot = await getDocs(q);


        const userRef = collection(db, 'users'); // ✅ db must be initialized from getFirestore(app)
        const q = query(userRef, where('uid', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot, 'querySnapshot')




        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          console.log('Firestore user data:', userData);
          if (userData.tokens) {
            console.log('Found tokens in Firestore:', userData.tokens);
            setUserTokens(userData.tokens);
            setGoogleConnected(true);
            console.log('Set googleConnected to TRUE from Firestore tokens');
            // Also store in localStorage for consistency
            localStorage.setItem('googleTokens', JSON.stringify(userData.tokens));
          } else {
            console.log('No tokens found in Firestore.');
            setError('No tokens found. Please reconnect to Google Calendar.');
          }
        } else {
          console.log('No user document found in Firestore.');
          setError('No user document found. Please reconnect to Google Calendar.');
        }
      } catch (err) {
        console.error('Error fetching user tokens:', err);
        setError('Failed to fetch Google connection status. Please try again.');
      }
    };

    fetchUserTokens();
  }, [currentUser, googleConnected]);

  // Fetch calendar events
  useEffect(() => {
    const fetchEvents = async () => {
      console.log('Attempting to fetch events, userTokens:', userTokens ? 'Present' : 'Missing');
      if (!userTokens) return;

      try {
        setLoading(true);
        console.log('Setting loading to true, googleConnected:', googleConnected);

        // Get date range for current view
        const { startDate, endDate } = getDateRange();
        console.log('Date range:', { startDate, endDate });

        // Get events from Google Calendar
        console.log('Calling listCalendarEvents with tokens:', userTokens);
        const eventsList = await listCalendarEvents(
          userTokens,
          startDate,
          endDate,
          showAllEvents
        );

        console.log('Received events:', eventsList ? eventsList.length : 0);
        setEvents(eventsList || []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to fetch calendar events');
      } finally {
        setLoading(false);
        console.log('Setting loading to false');
      }
    };

    console.log('Calendar events effect running, googleConnected:', googleConnected, 'userTokens:', userTokens ? 'Present' : 'Missing');
    if (googleConnected && userTokens) {
      console.log('Conditions met, fetching events');
      fetchEvents();
    } else {
      console.log('Conditions not met, not fetching events');
      setLoading(false);
    }
  }, [googleConnected, userTokens, getDateRange, showAllEvents]);

  // New effect to fetch events directly when accessing the calendar URL
  useEffect(() => {
    const fetchEventsDirectly = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Fetching events directly without OAuth code...');

        if (googleConnected && userTokens) {
          // Get date range for current view
          const { startDate, endDate } = getDateRange();

          // Fetch events from Google Calendar
          const eventsList = await listCalendarEvents(
            userTokens,
            startDate,
            endDate,
            showAllEvents
          );

          console.log('Fetched events:', eventsList);
          setEvents(eventsList || []);
        } else {
          console.log('User is not connected to Google Calendar.');
          setError('Please connect to Google Calendar to view events.');
        }
      } catch (err) {
        console.error('Error fetching events directly:', err);
        setError('Failed to fetch calendar events. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventsDirectly();
  }, [googleConnected, userTokens, getDateRange, showAllEvents]);

  // Connect to Google Calendar
  const connectToGoogle = async (setIsConnecting, setError) => {
    setIsConnecting(true);
    try {
      const data = await initializeGoogleClient();
      console.log(data, 'Connected to Google Calendar');
      setGoogleConnected(true); // Update state to render the calendar
    } catch (err) {
      console.error('Google Calendar auth failed:', err);
      setError('Failed to connect to Google Calendar');
    } finally {
      setIsConnecting(false);
    }
  };
  // Navigate to previous period
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  // Navigate to next period
  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get events for a specific day
  const getEventsForDay = (day) => {
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    return events.filter(event => {
      const eventStart = new Date(event.start.dateTime || event.start.date);
      return eventStart >= dayStart && eventStart <= dayEnd;
    });
  };

  // Generate days for month view
  const generateMonthDays = () => {
    const { startDate } = getDateRange();
    const year = startDate.getFullYear();
    const month = startDate.getMonth();

    // Get first day of month and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Get day of week for first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();

    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek;

    // Calculate total days to show (previous month + current month + next month)
    const totalDays = 42; // 6 rows of 7 days

    // Generate array of days
    const days = [];

    // Add days from previous month
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();

    for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
      const date = new Date(year, month - 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        events: getEventsForDay(date)
      });
    }

    // Add days from current month
    const currentMonthDays = lastDay.getDate();
    const today = new Date();

    for (let i = 1; i <= currentMonthDays; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday:
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear(),
        events: getEventsForDay(date)
      });
    }

    // Add days from next month
    const remainingDays = totalDays - days.length;

    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        events: getEventsForDay(date)
      });
    }

    return days;
  };

  // Generate days for week view
  const generateWeekDays = () => {
    const { startDate } = getDateRange();
    const days = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      days.push({
        date,
        isToday:
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear(),
        events: getEventsForDay(date)
      });
    }

    return days;
  };

  // Render month view
  const renderMonthView = () => {
    const days = generateMonthDays();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className={styles.monthView}>
        <div className={styles.weekDays}>
          {weekDays.map(day => (
            <div key={day} className={styles.weekDay}>{day}</div>
          ))}
        </div>
        <div className={styles.monthGrid}>
          {days.map((day, index) => (
            <div
              key={index}
              className={`${styles.day} ${!day.isCurrentMonth ? styles.otherMonth : ''} ${day.isToday ? styles.today : ''}`}
            >
              <div className={styles.dayHeader}>
                <span className={styles.dayNumber}>{day.date.getDate()}</span>
              </div>
              <div className={styles.dayEvents}>
                {day.events.slice(0, 3).map((event, idx) => (
                  <div key={idx} className={styles.eventItem} title={event.summary}>
                    <div className={styles.eventTime}>
                      {event.start.dateTime ? formatTime(event.start.dateTime) : 'All day'}
                    </div>
                    <div className={styles.eventTitle}>{event.summary}</div>
                  </div>
                ))}
                {day.events.length > 3 && (
                  <div className={styles.moreEvents}>
                    +{day.events.length - 3} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render week view
  const renderWeekView = () => {
    const days = generateWeekDays();
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className={styles.weekView}>
        <div className={styles.weekHeader}>
          <div className={styles.timeColumn}></div>
          {days.map((day, index) => (
            <div
              key={index}
              className={`${styles.weekDay} ${day.isToday ? styles.today : ''}`}
            >
              <div className={styles.weekDayName}>
                {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className={styles.weekDayNumber}>
                {day.date.getDate()}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.weekGrid}>
          <div className={styles.timeColumn}>
            {hours.map(hour => (
              <div key={hour} className={styles.timeSlot}>
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
            ))}
          </div>
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className={styles.dayColumn}>
              {hours.map(hour => {
                const hourEvents = day.events.filter(event => {
                  if (!event.start.dateTime) return false; // Skip all-day events
                  const eventHour = new Date(event.start.dateTime).getHours();
                  return eventHour === hour;
                });

                return (
                  <div key={hour} className={styles.hourSlot}>
                    {hourEvents.map((event, eventIndex) => (
                      <div key={eventIndex} className={styles.weekEventItem} title={event.summary}>
                        <div className={styles.weekEventTime}>
                          {formatTime(event.start.dateTime)}
                        </div>
                        <div className={styles.weekEventTitle}>
                          {event.summary}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render day view
  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayEvents = getEventsForDay(currentDate);

    return (
      <div className={styles.dayView}>
        <div className={styles.dayHeader}>
          <div className={styles.dayDate}>
            {formatDate(currentDate)}
          </div>
        </div>
        <div className={styles.dayGrid}>
          <div className={styles.timeColumn}>
            {hours.map(hour => (
              <div key={hour} className={styles.timeSlot}>
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
            ))}
          </div>
          <div className={styles.eventsColumn}>
            {hours.map(hour => {
              const hourEvents = dayEvents.filter(event => {
                if (!event.start.dateTime) return false; // Skip all-day events
                const eventHour = new Date(event.start.dateTime).getHours();
                return eventHour === hour;
              });

              return (
                <div key={hour} className={styles.hourSlot}>
                  {hourEvents.map((event, eventIndex) => (
                    <div key={eventIndex} className={styles.dayEventItem} title={event.summary}>
                      <div className={styles.dayEventTime}>
                        {formatTime(event.start.dateTime)} - {formatTime(event.end.dateTime)}
                      </div>
                      <div className={styles.dayEventTitle}>
                        {event.summary}
                      </div>
                      {event.description && (
                        <div className={styles.dayEventDescription}>
                          {event.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Get view title based on current date and view mode
  const getViewTitle = () => {
    if (viewMode === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (viewMode === 'week') {
      const { startDate, endDate } = getDateRange();
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    } else if (viewMode === 'day') {
      return formatDate(currentDate);
    }
  };

  if (loading) {
    return (
      <DashboardSection title="Calendar">
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
          <p>Loading calendar events...</p>
        </div>
      </DashboardSection>
    );
  }

  if (!googleConnected) {
    return (
      <DashboardSection title="Calendar">
        <div className={styles.notConnectedContainer}>
          <h2>Connect to Google Calendar</h2>
          <p>To view your calendar events, please connect your Google Calendar account.</p>
          <button
            className={styles.connectButton}
            onClick={() => connectToGoogle(setIsConnecting, setError)}
            disabled={isConnecting}
          >
            <FaGoogle style={{ marginRight: '8px' }} />
            {isConnecting ? 'Connecting...' : 'Connect Google Calendar'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </DashboardSection>
    );
  }

  return (
    <DashboardSection title="Calendar">
      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className={styles.calendarHeader}>
        <div className={styles.calendarTitle}>
          <h2>{getViewTitle()}</h2>
        </div>

        <div className={styles.calendarControls}>
          <button className={styles.todayButton} onClick={goToToday}>
            Today
          </button>

          <div className={styles.navigationButtons}>
            <button className={styles.navButton} onClick={goToPrevious}>
              <FaChevronLeft />
            </button>
            <button className={styles.navButton} onClick={goToNext}>
              <FaChevronRight />
            </button>
          </div>

          <div className={styles.viewButtons}>
            <button
              className={`${styles.viewButton} ${viewMode === 'month' ? styles.activeView : ''}`}
              onClick={() => setViewMode('month')}
            >
              Month
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'week' ? styles.activeView : ''}`}
              onClick={() => setViewMode('week')}
            >
              Week
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'day' ? styles.activeView : ''}`}
              onClick={() => setViewMode('day')}
            >
              Day
            </button>
          </div>

          <div className={styles.filterToggle}>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={showAllEvents}
                onChange={() => setShowAllEvents(!showAllEvents)}
              />
              Show all events
            </label>
          </div>
        </div>
      </div>

      <div className={styles.calendarContainer}>
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderDayView()}
      </div>
    </DashboardSection>
  );
};

export default CalendarView;
