import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase-config';
import { createMeetEvent, listUpcomingEvents } from '../../services/googleIntegration';
import LoadingSpinner from '../common/LoadingSpinner';
import styles from './Calendar.module.css';
import DashboardSection from './DashboardSection';

const Calendar = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [userTokens, setUserTokens] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    attendees: ''
  });
  const [clients, setClients] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [partners, setPartners] = useState([]);
  const [showNewEventForm, setShowNewEventForm] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [eventCreated, setEventCreated] = useState(false);

  // Fetch user's Google tokens
  useEffect(() => {
    const fetchUserTokens = async () => {
      try {
        if (!currentUser) return;

        // First check localStorage for tokens (from GoogleCalendarConnect)
        const localTokens = localStorage.getItem('googleTokens');
        const calendarConnected = localStorage.getItem('googleCalendarConnected');

        if (localTokens && calendarConnected === 'true') {
          const parsedTokens = JSON.parse(localTokens);
          setUserTokens(parsedTokens);
          setGoogleConnected(true);
          console.log('Calendar: Google Calendar is connected');
          return; // If we found tokens in localStorage, no need to check Firestore
        }

        // If no tokens in localStorage, check Firestore
        const userRef = collection(db, 'users');
        const q = query(userRef, where('uid', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          if (userData.tokens) {
            setUserTokens(userData.tokens);
            setGoogleConnected(true);
            // Also store in localStorage for consistency
            localStorage.setItem('googleTokens', JSON.stringify(userData.tokens));
          }
        }
      } catch (err) {
        console.error('Error fetching user tokens:', err);
        setError('Failed to fetch Google connection status');
      }
    };

    fetchUserTokens();
  }, [currentUser]);

  // Fetch calendar events
  useEffect(() => {
    const fetchEvents = async () => {
      if (!userTokens) return;

      try {
        setLoading(true);
        const eventsList = await listUpcomingEvents(userTokens, 20);
        setEvents(eventsList || []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to fetch calendar events');
      } finally {
        setLoading(false);
      }
    };

    if (googleConnected && userTokens) {
      fetchEvents();
    } else {
      setLoading(false);
    }
  }, [googleConnected, userTokens]);

  // Fetch clients, investors, and partners for the attendee dropdown
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        // Fetch clients
        const clientsRef = collection(db, 'clients');
        const clientsSnapshot = await getDocs(clientsRef);
        const clientsList = clientsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setClients(clientsList);

        // Fetch investors
        const investorsRef = collection(db, 'investors');
        const investorsSnapshot = await getDocs(investorsRef);
        const investorsList = investorsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setInvestors(investorsList);

        // Fetch partners
        const partnersRef = collection(db, 'partners');
        const partnersSnapshot = await getDocs(partnersRef);
        const partnersList = partnersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPartners(partnersList);
      } catch (err) {
        console.error('Error fetching contacts:', err);
      }
    };

    fetchContacts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    if (!userTokens) {
      setError('Google Calendar not connected');
      return;
    }

    try {
      setCreatingEvent(true);

      // Format attendees as array
      const attendeesList = newEvent.attendees
        .split(',')
        .map(email => email.trim())
        .filter(email => email);

      const eventDetails = {
        title: newEvent.title,
        description: newEvent.description,
        start: new Date(newEvent.start).toISOString(),
        end: new Date(newEvent.end).toISOString(),
        attendees: attendeesList
      };

      const createdEvent = await createMeetEvent(userTokens, eventDetails);

      // Reset form and show success message
      setNewEvent({
        title: '',
        description: '',
        start: '',
        end: '',
        attendees: ''
      });

      setEventCreated(true);
      setTimeout(() => setEventCreated(false), 3000);

      // Refresh events list
      const updatedEvents = await listUpcomingEvents(userTokens, 20);
      setEvents(updatedEvents || []);

      // Hide form after successful creation
      setShowNewEventForm(false);
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Failed to create event');
    } finally {
      setCreatingEvent(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
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
          <p>Google Calendar is not connected. Please connect your Google account in your profile settings.</p>
          <a href="/dashboard/settings" className={styles.connectButton}>Go to Settings</a>
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

      {eventCreated && (
        <div className={styles.successMessage}>
          <p>Event created successfully!</p>
        </div>
      )}

      <div className={styles.calendarHeader}>
        <h2>Upcoming Events</h2>
        <button
          className={styles.newEventButton}
          onClick={() => setShowNewEventForm(!showNewEventForm)}
        >
          {showNewEventForm ? 'Cancel' : 'New Event'}
        </button>
      </div>

      {showNewEventForm && (
        <div className={styles.newEventFormContainer}>
          <h3>Create New Meeting</h3>
          <form onSubmit={handleCreateEvent} className={styles.newEventForm}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
                required
                placeholder="Meeting title"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={newEvent.description}
                onChange={handleInputChange}
                placeholder="Meeting description"
                rows="3"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="start">Start Time</label>
                <input
                  type="datetime-local"
                  id="start"
                  name="start"
                  value={newEvent.start}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="end">End Time</label>
                <input
                  type="datetime-local"
                  id="end"
                  name="end"
                  value={newEvent.end}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="attendees">Attendees (comma-separated emails)</label>
              <input
                type="text"
                id="attendees"
                name="attendees"
                value={newEvent.attendees}
                onChange={handleInputChange}
                placeholder="email1@example.com, email2@example.com"
              />
            </div>

            <div className={styles.contactsContainer}>
              <div className={styles.contactsSection}>
                <h4>Clients</h4>
                <div className={styles.contactsList}>
                  {clients.map(client => (
                    <div
                      key={client.id}
                      className={styles.contactItem}
                      onClick={() => {
                        const email = client.email;
                        if (email) {
                          const currentAttendees = newEvent.attendees ? newEvent.attendees.split(',').map(e => e.trim()) : [];
                          if (!currentAttendees.includes(email)) {
                            const updatedAttendees = [...currentAttendees, email].join(', ');
                            setNewEvent(prev => ({ ...prev, attendees: updatedAttendees }));
                          }
                        }
                      }}
                    >
                      {client.name || client.companyName} {client.email ? `(${client.email})` : ''}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.contactsSection}>
                <h4>Investors</h4>
                <div className={styles.contactsList}>
                  {investors.map(investor => (
                    <div
                      key={investor.id}
                      className={styles.contactItem}
                      onClick={() => {
                        const email = investor.email;
                        if (email) {
                          const currentAttendees = newEvent.attendees ? newEvent.attendees.split(',').map(e => e.trim()) : [];
                          if (!currentAttendees.includes(email)) {
                            const updatedAttendees = [...currentAttendees, email].join(', ');
                            setNewEvent(prev => ({ ...prev, attendees: updatedAttendees }));
                          }
                        }
                      }}
                    >
                      {investor.name || investor.companyName} {investor.email ? `(${investor.email})` : ''}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.contactsSection}>
                <h4>Partners</h4>
                <div className={styles.contactsList}>
                  {partners.map(partner => (
                    <div
                      key={partner.id}
                      className={styles.contactItem}
                      onClick={() => {
                        const email = partner.email;
                        if (email) {
                          const currentAttendees = newEvent.attendees ? newEvent.attendees.split(',').map(e => e.trim()) : [];
                          if (!currentAttendees.includes(email)) {
                            const updatedAttendees = [...currentAttendees, email].join(', ');
                            setNewEvent(prev => ({ ...prev, attendees: updatedAttendees }));
                          }
                        }
                      }}
                    >
                      {partner.name || partner.companyName} {partner.email ? `(${partner.email})` : ''}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setShowNewEventForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={creatingEvent}
              >
                {creatingEvent ? 'Creating...' : 'Create Meeting'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.eventsContainer}>
        {events.length === 0 ? (
          <p className={styles.noEvents}>No upcoming events found.</p>
        ) : (
          <div className={styles.eventsList}>
            {events.map((event, index) => (
              <div key={event.id || index} className={styles.eventCard}>
                <div className={styles.eventHeader}>
                  <h3 className={styles.eventTitle}>{event.summary}</h3>
                  {event.hangoutLink && (
                    <a
                      href={event.hangoutLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.meetLink}
                    >
                      Join Meet
                    </a>
                  )}
                </div>

                <div className={styles.eventTime}>
                  <div className={styles.eventTimeItem}>
                    <span className={styles.eventTimeLabel}>Start:</span>
                    <span>{formatDateTime(event.start.dateTime || event.start.date)}</span>
                  </div>
                  <div className={styles.eventTimeItem}>
                    <span className={styles.eventTimeLabel}>End:</span>
                    <span>{formatDateTime(event.end.dateTime || event.end.date)}</span>
                  </div>
                </div>

                {event.description && (
                  <div className={styles.eventDescription}>
                    <p>{event.description}</p>
                  </div>
                )}

                {event.attendees && event.attendees.length > 0 && (
                  <div className={styles.eventAttendees}>
                    <h4>Attendees:</h4>
                    <ul>
                      {event.attendees.map((attendee, idx) => (
                        <li key={idx} className={styles.attendeeItem}>
                          {attendee.email}
                          {attendee.responseStatus === 'accepted' && <span className={styles.statusAccepted}>✓</span>}
                          {attendee.responseStatus === 'declined' && <span className={styles.statusDeclined}>✗</span>}
                          {attendee.responseStatus === 'tentative' && <span className={styles.statusTentative}>?</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardSection>
  );
};

export default Calendar;
