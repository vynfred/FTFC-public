/**
 * Company Schema
 * 
 * This schema defines the structure for companies in the FTFC application.
 * Companies can have multiple contacts, with one designated as primary.
 */

import { db } from '../firebase-config';
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';

/**
 * Company Schema Structure
 * 
 * id: String - Unique identifier
 * name: String - Company name
 * website: String - Website URL
 * industry: [String] - Industries
 * description: String - Company description
 * logo: String - Logo URL
 * stage: String - Company stage (e.g., Seed, Series A)
 * foundedYear: Number - Year founded
 * teamSize: Number - Team size
 * revenueStatus: String - Revenue status (e.g., Pre-revenue, Revenue generating)
 * currentARR: Number - Current annual recurring revenue
 * capitalRaised: Number - Total capital raised
 * targetRaise: Number - Target raise amount
 * timeline: String - Fundraising timeline
 * pitchDeck: {
 *   url: String - URL to pitch deck
 *   link: String - External link to pitch deck
 * }
 * status: String - Company status (e.g., Active, Inactive)
 * createdAt: Timestamp - Creation timestamp
 * updatedAt: Timestamp - Last update timestamp
 * createdBy: String - User who created the company
 * contacts: [{
 *   contactId: String - Reference to contact
 *   isPrimary: Boolean - Whether this is the primary contact
 *   role: String - Role at the company
 * }]
 */

// Collection name
const COMPANIES_COLLECTION = 'companies';

/**
 * Create a new company
 * @param {Object} companyData - Company data
 * @returns {Promise<Object>} - Created company with ID
 */
export const createCompany = async (companyData) => {
  try {
    // Add timestamps
    const companyWithTimestamps = {
      ...companyData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Add to Firestore
    const docRef = await addDoc(collection(db, COMPANIES_COLLECTION), companyWithTimestamps);
    
    return {
      id: docRef.id,
      ...companyData
    };
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
};

/**
 * Get a company by ID
 * @param {String} companyId - Company ID
 * @returns {Promise<Object|null>} - Company data or null if not found
 */
export const getCompanyById = async (companyId) => {
  try {
    const companyDoc = await getDoc(doc(db, COMPANIES_COLLECTION, companyId));
    
    if (companyDoc.exists()) {
      return {
        id: companyDoc.id,
        ...companyDoc.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting company:', error);
    throw error;
  }
};

/**
 * Update a company
 * @param {String} companyId - Company ID
 * @param {Object} companyData - Updated company data
 * @returns {Promise<void>}
 */
export const updateCompany = async (companyId, companyData) => {
  try {
    // Add updated timestamp
    const updatedData = {
      ...companyData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(doc(db, COMPANIES_COLLECTION, companyId), updatedData);
  } catch (error) {
    console.error('Error updating company:', error);
    throw error;
  }
};

/**
 * Delete a company
 * @param {String} companyId - Company ID
 * @returns {Promise<void>}
 */
export const deleteCompany = async (companyId) => {
  try {
    await deleteDoc(doc(db, COMPANIES_COLLECTION, companyId));
  } catch (error) {
    console.error('Error deleting company:', error);
    throw error;
  }
};

/**
 * Add a contact to a company
 * @param {String} companyId - Company ID
 * @param {String} contactId - Contact ID
 * @param {String} role - Role at the company
 * @param {Boolean} isPrimary - Whether this is the primary contact
 * @returns {Promise<void>}
 */
export const addContactToCompany = async (companyId, contactId, role, isPrimary = false) => {
  try {
    const batch = writeBatch(db);
    
    // Get the company
    const company = await getCompanyById(companyId);
    
    if (!company) {
      throw new Error(`Company with ID ${companyId} not found`);
    }
    
    // If this contact is set as primary, update all other contacts to not be primary
    if (isPrimary && company.contacts && company.contacts.length > 0) {
      const updatedContacts = company.contacts.map(contact => ({
        ...contact,
        isPrimary: contact.contactId === contactId ? true : false
      }));
      
      // Add the new contact if it doesn't exist
      if (!updatedContacts.some(contact => contact.contactId === contactId)) {
        updatedContacts.push({
          contactId,
          role,
          isPrimary
        });
      }
      
      batch.update(doc(db, COMPANIES_COLLECTION, companyId), {
        contacts: updatedContacts,
        updatedAt: serverTimestamp()
      });
    } else {
      // Just add the new contact
      const updatedContacts = company.contacts || [];
      
      // Check if contact already exists
      const existingContactIndex = updatedContacts.findIndex(contact => contact.contactId === contactId);
      
      if (existingContactIndex >= 0) {
        // Update existing contact
        updatedContacts[existingContactIndex] = {
          ...updatedContacts[existingContactIndex],
          role,
          isPrimary
        };
      } else {
        // Add new contact
        updatedContacts.push({
          contactId,
          role,
          isPrimary
        });
      }
      
      batch.update(doc(db, COMPANIES_COLLECTION, companyId), {
        contacts: updatedContacts,
        updatedAt: serverTimestamp()
      });
    }
    
    // Commit the batch
    await batch.commit();
  } catch (error) {
    console.error('Error adding contact to company:', error);
    throw error;
  }
};

/**
 * Remove a contact from a company
 * @param {String} companyId - Company ID
 * @param {String} contactId - Contact ID
 * @returns {Promise<void>}
 */
export const removeContactFromCompany = async (companyId, contactId) => {
  try {
    // Get the company
    const company = await getCompanyById(companyId);
    
    if (!company) {
      throw new Error(`Company with ID ${companyId} not found`);
    }
    
    // Remove the contact
    const updatedContacts = (company.contacts || []).filter(contact => contact.contactId !== contactId);
    
    await updateDoc(doc(db, COMPANIES_COLLECTION, companyId), {
      contacts: updatedContacts,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error removing contact from company:', error);
    throw error;
  }
};

/**
 * Set a contact as primary for a company
 * @param {String} companyId - Company ID
 * @param {String} contactId - Contact ID
 * @returns {Promise<void>}
 */
export const setContactAsPrimary = async (companyId, contactId) => {
  try {
    // Get the company
    const company = await getCompanyById(companyId);
    
    if (!company) {
      throw new Error(`Company with ID ${companyId} not found`);
    }
    
    // Update contacts
    const updatedContacts = (company.contacts || []).map(contact => ({
      ...contact,
      isPrimary: contact.contactId === contactId
    }));
    
    await updateDoc(doc(db, COMPANIES_COLLECTION, companyId), {
      contacts: updatedContacts,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error setting contact as primary:', error);
    throw error;
  }
};

/**
 * Create a company from lead data
 * @param {Object} leadData - Lead data from form submission
 * @returns {Promise<Object>} - Created company
 */
export const createCompanyFromLead = async (leadData) => {
  try {
    // Extract company information from lead data
    const companyData = {
      name: leadData.companyName,
      website: leadData.website || '',
      industry: Array.isArray(leadData.industry) ? leadData.industry : [leadData.industry],
      description: leadData.vision || '',
      logo: '',
      stage: '',
      foundedYear: null,
      teamSize: leadData.teamSize || null,
      revenueStatus: leadData.revenueStatus || '',
      currentARR: leadData.currentARR ? parseFloat(leadData.currentARR) : null,
      capitalRaised: leadData.capitalRaised ? parseFloat(leadData.capitalRaised) : null,
      targetRaise: leadData.targetRaise ? parseFloat(leadData.targetRaise) : null,
      timeline: leadData.timeline || '',
      pitchDeck: {
        url: leadData.pitchDeck?.url || '',
        link: leadData.pitchDeck?.link || ''
      },
      status: 'Active',
      createdBy: 'lead_form',
      contacts: [] // Will be populated after contact creation
    };
    
    return await createCompany(companyData);
  } catch (error) {
    console.error('Error creating company from lead:', error);
    throw error;
  }
};

export default {
  createCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
  addContactToCompany,
  removeContactFromCompany,
  setContactAsPrimary,
  createCompanyFromLead
};
