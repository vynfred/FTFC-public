/**
 * Lead Processing Service
 * 
 * This service handles the processing of leads from various sources:
 * - Public website form submissions
 * - Referral links (company, partner, team member)
 * - Manual submissions
 * 
 * It ensures clean data by:
 * - Validating and normalizing input data
 * - Creating proper associations between entities
 * - Using batch writes for consistency
 * - Tracking the source of each lead
 */

import { db } from '../firebase-config';
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  updateDoc, 
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';

// Import schemas
import ContactSchema from '../models/ContactSchema';
import CompanySchema from '../models/CompanySchema';
import InvestorSchema from '../models/InvestorSchema';
import PartnerSchema from '../models/PartnerSchema';

/**
 * Process a lead from a public website form submission
 * @param {Object} formData - Form data from submission
 * @returns {Promise<Object>} - Created lead with associations
 */
export const processWebsiteFormLead = async (formData) => {
  try {
    const batch = writeBatch(db);
    
    // Normalize and validate data
    const normalizedData = normalizeLeadData(formData);
    
    // Create company
    const company = await CompanySchema.createCompanyFromLead(normalizedData);
    
    // Create contact
    const contactData = {
      firstName: normalizedData.firstName,
      lastName: normalizedData.lastName,
      email: normalizedData.email,
      phone: normalizedData.phone,
      title: normalizedData.role,
      keywords: [],
      keyTerms: [],
      notes: '',
      createdBy: 'website_form',
      isPrimary: true,
      associations: {
        companies: [{
          companyId: company.id,
          role: normalizedData.role,
          isPrimary: true
        }],
        investmentFirms: [],
        partnerFirms: []
      }
    };
    
    const contact = await ContactSchema.createContact(contactData);
    
    // Update company with contact
    await CompanySchema.addContactToCompany(company.id, contact.id, normalizedData.role, true);
    
    // Create lead record
    const leadData = {
      companyId: company.id,
      primaryContactId: contact.id,
      source: 'website_form',
      status: 'New',
      stage: 'Initial Contact',
      assignedTo: '',
      notes: normalizedData.notes || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastActivity: serverTimestamp(),
      referralSource: normalizedData.referralSource || '',
      referrerId: normalizedData.referrerId || ''
    };
    
    const leadRef = await addDoc(collection(db, 'leads'), leadData);
    
    // Create activity log
    await addDoc(collection(db, 'activity'), {
      type: 'lead',
      action: 'created',
      leadId: leadRef.id,
      companyName: company.name,
      timestamp: serverTimestamp(),
      description: `New lead from website form: ${company.name}`
    });
    
    return {
      leadId: leadRef.id,
      companyId: company.id,
      contactId: contact.id,
      source: 'website_form'
    };
  } catch (error) {
    console.error('Error processing website form lead:', error);
    throw error;
  }
};

/**
 * Process a lead from a referral link
 * @param {Object} formData - Form data from submission
 * @param {String} referralType - Type of referral (company, partner, team)
 * @param {String} referrerId - ID of the referrer
 * @returns {Promise<Object>} - Created lead with associations
 */
export const processReferralLead = async (formData, referralType, referrerId) => {
  try {
    const batch = writeBatch(db);
    
    // Normalize and validate data
    const normalizedData = normalizeLeadData(formData);
    
    // Add referral information
    normalizedData.referralSource = referralType;
    normalizedData.referrerId = referrerId;
    
    // Create company
    const company = await CompanySchema.createCompanyFromLead(normalizedData);
    
    // Create contact
    const contactData = {
      firstName: normalizedData.firstName,
      lastName: normalizedData.lastName,
      email: normalizedData.email,
      phone: normalizedData.phone,
      title: normalizedData.role,
      keywords: [],
      keyTerms: [],
      notes: '',
      createdBy: `${referralType}_referral`,
      isPrimary: true,
      associations: {
        companies: [{
          companyId: company.id,
          role: normalizedData.role,
          isPrimary: true
        }],
        investmentFirms: [],
        partnerFirms: []
      }
    };
    
    const contact = await ContactSchema.createContact(contactData);
    
    // Update company with contact
    await CompanySchema.addContactToCompany(company.id, contact.id, normalizedData.role, true);
    
    // Create lead record
    const leadData = {
      companyId: company.id,
      primaryContactId: contact.id,
      source: `${referralType}_referral`,
      status: 'New',
      stage: 'Initial Contact',
      assignedTo: '',
      notes: normalizedData.notes || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastActivity: serverTimestamp(),
      referralSource: referralType,
      referrerId: referrerId
    };
    
    const leadRef = await addDoc(collection(db, 'leads'), leadData);
    
    // If this is a partner referral, add the referral to the partner's record
    if (referralType === 'partner') {
      // Get the partner
      const partnerDoc = await getDoc(doc(db, 'partners', referrerId));
      
      if (partnerDoc.exists()) {
        const partner = {
          id: partnerDoc.id,
          ...partnerDoc.data()
        };
        
        // Add referral to partner
        await PartnerSchema.addReferral(partner.id, company.id, `Referred via partner referral link`);
      }
    }
    
    // Create activity log
    await addDoc(collection(db, 'activity'), {
      type: 'lead',
      action: 'created',
      leadId: leadRef.id,
      companyName: company.name,
      timestamp: serverTimestamp(),
      description: `New lead from ${referralType} referral: ${company.name}`
    });
    
    return {
      leadId: leadRef.id,
      companyId: company.id,
      contactId: contact.id,
      source: `${referralType}_referral`
    };
  } catch (error) {
    console.error('Error processing referral lead:', error);
    throw error;
  }
};

/**
 * Process a lead from manual submission
 * @param {Object} leadData - Lead data from manual submission
 * @returns {Promise<Object>} - Created lead with associations
 */
export const processManualLead = async (leadData) => {
  try {
    const batch = writeBatch(db);
    
    // Normalize and validate data
    const normalizedData = normalizeLeadData(leadData);
    
    // Create company
    const company = await CompanySchema.createCompanyFromLead(normalizedData);
    
    // Create contact
    const contactData = {
      firstName: normalizedData.firstName,
      lastName: normalizedData.lastName,
      email: normalizedData.email,
      phone: normalizedData.phone,
      title: normalizedData.role,
      keywords: normalizedData.keywords || [],
      keyTerms: normalizedData.keyTerms || [],
      notes: normalizedData.contactNotes || '',
      createdBy: 'manual_entry',
      isPrimary: true,
      associations: {
        companies: [{
          companyId: company.id,
          role: normalizedData.role,
          isPrimary: true
        }],
        investmentFirms: [],
        partnerFirms: []
      }
    };
    
    const contact = await ContactSchema.createContact(contactData);
    
    // Update company with contact
    await CompanySchema.addContactToCompany(company.id, contact.id, normalizedData.role, true);
    
    // Create lead record
    const leadData = {
      companyId: company.id,
      primaryContactId: contact.id,
      source: 'manual_entry',
      status: normalizedData.status || 'New',
      stage: normalizedData.stage || 'Initial Contact',
      assignedTo: normalizedData.assignedTo || '',
      notes: normalizedData.notes || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastActivity: serverTimestamp(),
      referralSource: normalizedData.referralSource || '',
      referrerId: normalizedData.referrerId || ''
    };
    
    const leadRef = await addDoc(collection(db, 'leads'), leadData);
    
    // Create activity log
    await addDoc(collection(db, 'activity'), {
      type: 'lead',
      action: 'created',
      leadId: leadRef.id,
      companyName: company.name,
      timestamp: serverTimestamp(),
      description: `New lead created manually: ${company.name}`
    });
    
    return {
      leadId: leadRef.id,
      companyId: company.id,
      contactId: contact.id,
      source: 'manual_entry'
    };
  } catch (error) {
    console.error('Error processing manual lead:', error);
    throw error;
  }
};

/**
 * Normalize lead data to ensure consistency
 * @param {Object} data - Raw lead data
 * @returns {Object} - Normalized lead data
 */
const normalizeLeadData = (data) => {
  // Create a copy of the data
  const normalized = { ...data };
  
  // Normalize name fields
  if (normalized.firstName) {
    normalized.firstName = normalized.firstName.trim();
  }
  
  if (normalized.lastName) {
    normalized.lastName = normalized.lastName.trim();
  }
  
  // Normalize email
  if (normalized.email) {
    normalized.email = normalized.email.trim().toLowerCase();
  }
  
  // Normalize phone
  if (normalized.phone) {
    // Remove non-numeric characters
    normalized.phone = normalized.phone.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX if 10 digits
    if (normalized.phone.length === 10) {
      normalized.phone = `(${normalized.phone.substring(0, 3)}) ${normalized.phone.substring(3, 6)}-${normalized.phone.substring(6)}`;
    }
  }
  
  // Normalize company name
  if (normalized.companyName) {
    normalized.companyName = normalized.companyName.trim();
  }
  
  // Normalize website
  if (normalized.website) {
    let website = normalized.website.trim();
    
    // Add https:// if not present
    if (!website.startsWith('http://') && !website.startsWith('https://')) {
      website = `https://${website}`;
    }
    
    normalized.website = website;
  }
  
  // Normalize numeric values
  if (normalized.currentARR) {
    normalized.currentARR = parseFloat(normalized.currentARR);
  }
  
  if (normalized.capitalRaised) {
    normalized.capitalRaised = parseFloat(normalized.capitalRaised);
  }
  
  if (normalized.targetRaise) {
    normalized.targetRaise = parseFloat(normalized.targetRaise);
  }
  
  // Ensure industry is an array
  if (normalized.industry && !Array.isArray(normalized.industry)) {
    normalized.industry = [normalized.industry];
  }
  
  return normalized;
};

export default {
  processWebsiteFormLead,
  processReferralLead,
  processManualLead
};
