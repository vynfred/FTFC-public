/**
 * Meeting to Lead Service
 * 
 * This service handles the conversion of meeting data to lead data.
 * It extracts relevant information from meetings and prepares it for lead creation.
 */

import { db } from '../firebase-config';
import { 
  collection, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { processManualLead } from './LeadProcessingService';

/**
 * Extract lead data from meeting data
 * @param {Object} meetingData - Meeting data
 * @returns {Object} - Extracted lead data
 */
export const extractLeadDataFromMeeting = (meetingData) => {
  // Extract attendee information
  const externalAttendees = meetingData.attendees?.filter(
    attendee => !attendee.email.endsWith('@ftfc.co')
  ) || [];
  
  // Get the first external attendee as the primary contact
  const primaryAttendee = externalAttendees.length > 0 ? externalAttendees[0] : null;
  
  // Extract company name from meeting title or attendee email domain
  let companyName = '';
  if (meetingData.relatedTo) {
    companyName = meetingData.relatedTo;
  } else if (primaryAttendee?.email) {
    // Extract domain from email and use as company name
    const emailParts = primaryAttendee.email.split('@');
    if (emailParts.length > 1) {
      const domain = emailParts[1];
      // Convert domain to company name (e.g., "example.com" -> "Example")
      companyName = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
    }
  }
  
  // Extract name from attendee
  let firstName = '';
  let lastName = '';
  if (primaryAttendee?.displayName) {
    const nameParts = primaryAttendee.displayName.split(' ');
    firstName = nameParts[0] || '';
    lastName = nameParts.slice(1).join(' ') || '';
  }
  
  // Prepare lead data
  return {
    // Personal Info
    firstName,
    lastName,
    email: primaryAttendee?.email || '',
    phone: '',
    role: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    },
    
    // Company Info
    companyName,
    industry: '',
    teamSize: '',
    revenueStatus: '',
    currentARR: '',
    
    // Fundraising Info
    capitalRaised: '',
    targetRaise: '',
    timeline: '',
    pitchDeck: {
      file: null,
      link: ''
    },
    
    // Referral Info
    referralSource: 'meeting',
    referrerId: meetingData.id,
    referrerName: '',
    
    // Additional Info
    notes: `Created from meeting: ${meetingData.title}\nDate: ${meetingData.date}\nTime: ${meetingData.startTime} - ${meetingData.endTime}`,
    meetingId: meetingData.id,
    meetingSummary: meetingData.summary || '',
    meetingTranscript: meetingData.transcript || ''
  };
};

/**
 * Create a lead from meeting data
 * @param {Object} meetingData - Meeting data
 * @param {Object} additionalData - Additional lead data
 * @returns {Promise<Object>} - Created lead
 */
export const createLeadFromMeeting = async (meetingData, additionalData = {}) => {
  try {
    // Extract lead data from meeting
    const extractedData = extractLeadDataFromMeeting(meetingData);
    
    // Merge extracted data with additional data
    const leadData = {
      ...extractedData,
      ...additionalData,
      source: 'meeting',
      status: 'New',
      stage: 'Initial Contact'
    };
    
    // Process the lead
    const result = await processManualLead(leadData);
    
    // Update the meeting to link it to the lead
    if (meetingData.id) {
      const meetingRef = doc(db, 'meetings', meetingData.id);
      await updateDoc(meetingRef, {
        leadId: result.leadId,
        leadCreatedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    // Create activity log
    await addDoc(collection(db, 'activity'), {
      type: 'lead',
      action: 'created',
      leadId: result.leadId,
      companyName: leadData.companyName,
      meetingId: meetingData.id,
      timestamp: serverTimestamp(),
      description: `New lead created from meeting: ${meetingData.title}`
    });
    
    return result;
  } catch (error) {
    console.error('Error creating lead from meeting:', error);
    throw error;
  }
};

export default {
  extractLeadDataFromMeeting,
  createLeadFromMeeting
};
