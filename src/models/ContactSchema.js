/**
 * Contact Schema
 * 
 * This schema defines the structure for contacts in the FTFC application.
 * Contacts can be associated with companies, investment firms, and partner firms.
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
 * Contact Schema Structure
 * 
 * id: String - Unique identifier
 * firstName: String - First name
 * lastName: String - Last name
 * email: String - Email address
 * phone: String - Phone number
 * title: String - Job title
 * profileImage: String - URL to profile image
 * bio: String - Short biography
 * keywords: [String] - Array of keywords/tags
 * keyTerms: [String] - Array of key terms
 * notes: String - General notes
 * createdAt: Timestamp - Creation timestamp
 * updatedAt: Timestamp - Last update timestamp
 * createdBy: String - User who created the contact
 * isPrimary: Boolean - Whether this is a primary contact
 * associations: {
 *   companies: [{
 *     companyId: String - Reference to company
 *     role: String - Role at the company
 *     isPrimary: Boolean - Whether this is their primary company
 *   }],
 *   investmentFirms: [{
 *     firmId: String - Reference to investment firm
 *     role: String - Role at the firm
 *     isPrimary: Boolean - Whether this is their primary firm
 *   }],
 *   partnerFirms: [{
 *     firmId: String - Reference to partner firm
 *     role: String - Role at the firm
 *     isPrimary: Boolean - Whether this is their primary firm
 *   }]
 * }
 */

// Collection name
const CONTACTS_COLLECTION = 'contacts';

/**
 * Create a new contact
 * @param {Object} contactData - Contact data
 * @returns {Promise<Object>} - Created contact with ID
 */
export const createContact = async (contactData) => {
  try {
    // Add timestamps
    const contactWithTimestamps = {
      ...contactData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Add to Firestore
    const docRef = await addDoc(collection(db, CONTACTS_COLLECTION), contactWithTimestamps);
    
    return {
      id: docRef.id,
      ...contactData
    };
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
};

/**
 * Get a contact by ID
 * @param {String} contactId - Contact ID
 * @returns {Promise<Object|null>} - Contact data or null if not found
 */
export const getContactById = async (contactId) => {
  try {
    const contactDoc = await getDoc(doc(db, CONTACTS_COLLECTION, contactId));
    
    if (contactDoc.exists()) {
      return {
        id: contactDoc.id,
        ...contactDoc.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting contact:', error);
    throw error;
  }
};

/**
 * Update a contact
 * @param {String} contactId - Contact ID
 * @param {Object} contactData - Updated contact data
 * @returns {Promise<void>}
 */
export const updateContact = async (contactId, contactData) => {
  try {
    // Add updated timestamp
    const updatedData = {
      ...contactData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(doc(db, CONTACTS_COLLECTION, contactId), updatedData);
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
};

/**
 * Delete a contact
 * @param {String} contactId - Contact ID
 * @returns {Promise<void>}
 */
export const deleteContact = async (contactId) => {
  try {
    await deleteDoc(doc(db, CONTACTS_COLLECTION, contactId));
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
};

/**
 * Get contacts by company ID
 * @param {String} companyId - Company ID
 * @returns {Promise<Array>} - Array of contacts
 */
export const getContactsByCompany = async (companyId) => {
  try {
    const q = query(
      collection(db, CONTACTS_COLLECTION),
      where('associations.companies', 'array-contains', { companyId })
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting contacts by company:', error);
    throw error;
  }
};

/**
 * Get contacts by investment firm ID
 * @param {String} firmId - Investment firm ID
 * @returns {Promise<Array>} - Array of contacts
 */
export const getContactsByInvestmentFirm = async (firmId) => {
  try {
    const q = query(
      collection(db, CONTACTS_COLLECTION),
      where('associations.investmentFirms', 'array-contains', { firmId })
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting contacts by investment firm:', error);
    throw error;
  }
};

/**
 * Get contacts by partner firm ID
 * @param {String} firmId - Partner firm ID
 * @returns {Promise<Array>} - Array of contacts
 */
export const getContactsByPartnerFirm = async (firmId) => {
  try {
    const q = query(
      collection(db, CONTACTS_COLLECTION),
      where('associations.partnerFirms', 'array-contains', { firmId })
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting contacts by partner firm:', error);
    throw error;
  }
};

/**
 * Search contacts by keywords or key terms
 * @param {Array<String>} terms - Keywords or key terms to search for
 * @returns {Promise<Array>} - Array of matching contacts
 */
export const searchContactsByTerms = async (terms) => {
  try {
    const keywordsQuery = query(
      collection(db, CONTACTS_COLLECTION),
      where('keywords', 'array-contains-any', terms)
    );
    
    const keyTermsQuery = query(
      collection(db, CONTACTS_COLLECTION),
      where('keyTerms', 'array-contains-any', terms)
    );
    
    const [keywordsSnapshot, keyTermsSnapshot] = await Promise.all([
      getDocs(keywordsQuery),
      getDocs(keyTermsQuery)
    ]);
    
    // Combine results and remove duplicates
    const keywordResults = keywordsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    const keyTermResults = keyTermsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Combine and remove duplicates
    const allResults = [...keywordResults];
    keyTermResults.forEach(contact => {
      if (!allResults.some(c => c.id === contact.id)) {
        allResults.push(contact);
      }
    });
    
    return allResults;
  } catch (error) {
    console.error('Error searching contacts by terms:', error);
    throw error;
  }
};

/**
 * Set a contact as primary for a company
 * @param {String} contactId - Contact ID
 * @param {String} companyId - Company ID
 * @returns {Promise<void>}
 */
export const setContactAsPrimaryForCompany = async (contactId, companyId) => {
  try {
    const batch = writeBatch(db);
    
    // First, get all contacts for this company
    const companyContacts = await getContactsByCompany(companyId);
    
    // Update all contacts to not be primary
    companyContacts.forEach(contact => {
      if (contact.id !== contactId) {
        const updatedAssociations = {
          ...contact.associations,
          companies: contact.associations.companies.map(company => {
            if (company.companyId === companyId) {
              return { ...company, isPrimary: false };
            }
            return company;
          })
        };
        
        batch.update(doc(db, CONTACTS_COLLECTION, contact.id), {
          associations: updatedAssociations,
          updatedAt: serverTimestamp()
        });
      }
    });
    
    // Update the selected contact to be primary
    const selectedContact = await getContactById(contactId);
    if (selectedContact) {
      const updatedAssociations = {
        ...selectedContact.associations,
        companies: selectedContact.associations.companies.map(company => {
          if (company.companyId === companyId) {
            return { ...company, isPrimary: true };
          }
          return company;
        })
      };
      
      batch.update(doc(db, CONTACTS_COLLECTION, contactId), {
        associations: updatedAssociations,
        updatedAt: serverTimestamp()
      });
    }
    
    // Commit the batch
    await batch.commit();
  } catch (error) {
    console.error('Error setting contact as primary for company:', error);
    throw error;
  }
};

/**
 * Create a contact from lead data
 * @param {Object} leadData - Lead data from form submission
 * @returns {Promise<Object>} - Created contact
 */
export const createContactFromLead = async (leadData) => {
  try {
    // Extract contact information from lead data
    const contactData = {
      firstName: leadData.firstName,
      lastName: leadData.lastName,
      email: leadData.email,
      phone: leadData.phone,
      title: leadData.role,
      keywords: [],
      keyTerms: [],
      notes: '',
      createdBy: 'lead_form',
      isPrimary: true,
      associations: {
        companies: [{
          companyId: leadData.companyId || null, // Will be set after company creation
          role: leadData.role,
          isPrimary: true
        }],
        investmentFirms: [],
        partnerFirms: []
      }
    };
    
    return await createContact(contactData);
  } catch (error) {
    console.error('Error creating contact from lead:', error);
    throw error;
  }
};

export default {
  createContact,
  getContactById,
  updateContact,
  deleteContact,
  getContactsByCompany,
  getContactsByInvestmentFirm,
  getContactsByPartnerFirm,
  searchContactsByTerms,
  setContactAsPrimaryForCompany,
  createContactFromLead
};
