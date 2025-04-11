/**
 * Calendly Integration Service
 * 
 * This service handles integration with Calendly API:
 * - Fetching scheduled events
 * - Creating webhook subscriptions
 * - Processing webhook events
 * 
 * It provides methods for:
 * - Getting user's scheduled events
 * - Creating webhook subscriptions
 * - Processing webhook events
 */

import axios from 'axios';

// Calendly API base URL
const CALENDLY_API_BASE_URL = 'https://api.calendly.com';

// Create Calendly API client
const createCalendlyClient = () => {
  return axios.create({
    baseURL: CALENDLY_API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${process.env.REACT_APP_CALENDLY_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
};

/**
 * Get user information
 * @returns {Promise<Object>} - User information
 */
export const getUserInfo = async () => {
  const client = createCalendlyClient();
  
  try {
    const response = await client.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Error getting Calendly user info:', error);
    throw error;
  }
};

/**
 * Get user's scheduled events
 * @param {String} userId - Calendly user ID
 * @param {Object} params - Query parameters (count, page_token, status, etc.)
 * @returns {Promise<Object>} - Scheduled events
 */
export const getScheduledEvents = async (userId, params = {}) => {
  const client = createCalendlyClient();
  
  try {
    const response = await client.get(`/scheduled_events`, {
      params: {
        user: userId,
        ...params
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting scheduled events:', error);
    throw error;
  }
};

/**
 * Get event details
 * @param {String} eventUuid - Event UUID
 * @returns {Promise<Object>} - Event details
 */
export const getEventDetails = async (eventUuid) => {
  const client = createCalendlyClient();
  
  try {
    const response = await client.get(`/scheduled_events/${eventUuid}`);
    return response.data;
  } catch (error) {
    console.error('Error getting event details:', error);
    throw error;
  }
};

/**
 * Get event invitees
 * @param {String} eventUuid - Event UUID
 * @returns {Promise<Object>} - Event invitees
 */
export const getEventInvitees = async (eventUuid) => {
  const client = createCalendlyClient();
  
  try {
    const response = await client.get(`/scheduled_events/${eventUuid}/invitees`);
    return response.data;
  } catch (error) {
    console.error('Error getting event invitees:', error);
    throw error;
  }
};

/**
 * Create webhook subscription
 * @param {String} url - Webhook URL
 * @param {Array} events - Events to subscribe to
 * @param {String} scope - Scope of the webhook (organization or user)
 * @param {String} scopeId - ID of the scope
 * @returns {Promise<Object>} - Webhook subscription
 */
export const createWebhookSubscription = async (url, events, scope, scopeId) => {
  const client = createCalendlyClient();
  
  try {
    const response = await client.post('/webhook_subscriptions', {
      url,
      events,
      scope,
      organization: scope === 'organization' ? scopeId : undefined,
      user: scope === 'user' ? scopeId : undefined
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating webhook subscription:', error);
    throw error;
  }
};

/**
 * List webhook subscriptions
 * @param {String} scope - Scope of the webhook (organization or user)
 * @param {String} scopeId - ID of the scope
 * @returns {Promise<Object>} - Webhook subscriptions
 */
export const listWebhookSubscriptions = async (scope, scopeId) => {
  const client = createCalendlyClient();
  
  try {
    const response = await client.get('/webhook_subscriptions', {
      params: {
        organization: scope === 'organization' ? scopeId : undefined,
        user: scope === 'user' ? scopeId : undefined
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error listing webhook subscriptions:', error);
    throw error;
  }
};

/**
 * Delete webhook subscription
 * @param {String} webhookUuid - Webhook UUID
 * @returns {Promise<void>}
 */
export const deleteWebhookSubscription = async (webhookUuid) => {
  const client = createCalendlyClient();
  
  try {
    await client.delete(`/webhook_subscriptions/${webhookUuid}`);
  } catch (error) {
    console.error('Error deleting webhook subscription:', error);
    throw error;
  }
};

/**
 * Process webhook event
 * @param {Object} event - Webhook event
 * @returns {Object} - Processed event data
 */
export const processWebhookEvent = (event) => {
  // Verify webhook signature (in a real implementation)
  // ...
  
  const eventType = event.payload.event;
  const eventData = event.payload.data;
  
  switch (eventType) {
    case 'invitee.created':
      return {
        type: 'invitee_created',
        data: eventData
      };
    case 'invitee.canceled':
      return {
        type: 'invitee_canceled',
        data: eventData
      };
    case 'routing_form_submission.created':
      return {
        type: 'form_submission',
        data: eventData
      };
    default:
      return {
        type: 'unknown',
        data: eventData
      };
  }
};
