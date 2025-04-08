/**
 * Investment Firm Schema
 * 
 * This schema defines the structure for investment firms in the FTFC application.
 * Investment firms can have multiple contacts and investors.
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
 * Investment Firm Schema Structure
 * 
 * id: String - Unique identifier
 * name: String - Firm name
 * website: String - Website URL
 * description: String - Description
 * logo: String - Logo URL
 * fundSize: Number - Fund size
 * investmentRange: {
 *   min: Number - Minimum investment amount
 *   max: Number - Maximum investment amount
 * }
 * focusIndustries: [String] - Industries of focus
 * focusStages: [String] - Investment stages
 * status: String - Firm status (e.g., Active, Inactive)
 * createdAt: Timestamp - Creation timestamp
 * updatedAt: Timestamp - Last update timestamp
 * createdBy: String - User who created the firm
 * contacts: [{
 *   contactId: String - Reference to contact
 *   isPrimary: Boolean - Whether this is the primary contact
 *   role: String - Role at the firm
 * }]
 * investors: [{
 *   contactId: String - Reference to investor contact
 *   role: String - Role (e.g., Partner, Associate)
 *   investmentPreferences: {
 *     industries: [String] - Preferred industries
 *     stages: [String] - Preferred stages
 *     checkSize: {
 *       min: Number - Minimum check size
 *       max: Number - Maximum check size
 *     }
 *   }
 * }]
 */

// Collection name
const INVESTMENT_FIRMS_COLLECTION = 'investmentFirms';

/**
 * Create a new investment firm
 * @param {Object} firmData - Investment firm data
 * @returns {Promise<Object>} - Created investment firm with ID
 */
export const createInvestmentFirm = async (firmData) => {
  try {
    // Add timestamps
    const firmWithTimestamps = {
      ...firmData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Add to Firestore
    const docRef = await addDoc(collection(db, INVESTMENT_FIRMS_COLLECTION), firmWithTimestamps);
    
    return {
      id: docRef.id,
      ...firmData
    };
  } catch (error) {
    console.error('Error creating investment firm:', error);
    throw error;
  }
};

/**
 * Get an investment firm by ID
 * @param {String} firmId - Investment firm ID
 * @returns {Promise<Object|null>} - Investment firm data or null if not found
 */
export const getInvestmentFirmById = async (firmId) => {
  try {
    const firmDoc = await getDoc(doc(db, INVESTMENT_FIRMS_COLLECTION, firmId));
    
    if (firmDoc.exists()) {
      return {
        id: firmDoc.id,
        ...firmDoc.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting investment firm:', error);
    throw error;
  }
};

/**
 * Update an investment firm
 * @param {String} firmId - Investment firm ID
 * @param {Object} firmData - Updated investment firm data
 * @returns {Promise<void>}
 */
export const updateInvestmentFirm = async (firmId, firmData) => {
  try {
    // Add updated timestamp
    const updatedData = {
      ...firmData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(doc(db, INVESTMENT_FIRMS_COLLECTION, firmId), updatedData);
  } catch (error) {
    console.error('Error updating investment firm:', error);
    throw error;
  }
};

/**
 * Delete an investment firm
 * @param {String} firmId - Investment firm ID
 * @returns {Promise<void>}
 */
export const deleteInvestmentFirm = async (firmId) => {
  try {
    await deleteDoc(doc(db, INVESTMENT_FIRMS_COLLECTION, firmId));
  } catch (error) {
    console.error('Error deleting investment firm:', error);
    throw error;
  }
};

/**
 * Add a contact to an investment firm
 * @param {String} firmId - Investment firm ID
 * @param {String} contactId - Contact ID
 * @param {String} role - Role at the firm
 * @param {Boolean} isPrimary - Whether this is the primary contact
 * @returns {Promise<void>}
 */
export const addContactToInvestmentFirm = async (firmId, contactId, role, isPrimary = false) => {
  try {
    const batch = writeBatch(db);
    
    // Get the investment firm
    const firm = await getInvestmentFirmById(firmId);
    
    if (!firm) {
      throw new Error(`Investment firm with ID ${firmId} not found`);
    }
    
    // If this contact is set as primary, update all other contacts to not be primary
    if (isPrimary && firm.contacts && firm.contacts.length > 0) {
      const updatedContacts = firm.contacts.map(contact => ({
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
      
      batch.update(doc(db, INVESTMENT_FIRMS_COLLECTION, firmId), {
        contacts: updatedContacts,
        updatedAt: serverTimestamp()
      });
    } else {
      // Just add the new contact
      const updatedContacts = firm.contacts || [];
      
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
      
      batch.update(doc(db, INVESTMENT_FIRMS_COLLECTION, firmId), {
        contacts: updatedContacts,
        updatedAt: serverTimestamp()
      });
    }
    
    // Commit the batch
    await batch.commit();
  } catch (error) {
    console.error('Error adding contact to investment firm:', error);
    throw error;
  }
};

/**
 * Remove a contact from an investment firm
 * @param {String} firmId - Investment firm ID
 * @param {String} contactId - Contact ID
 * @returns {Promise<void>}
 */
export const removeContactFromInvestmentFirm = async (firmId, contactId) => {
  try {
    // Get the investment firm
    const firm = await getInvestmentFirmById(firmId);
    
    if (!firm) {
      throw new Error(`Investment firm with ID ${firmId} not found`);
    }
    
    // Remove the contact
    const updatedContacts = (firm.contacts || []).filter(contact => contact.contactId !== contactId);
    
    await updateDoc(doc(db, INVESTMENT_FIRMS_COLLECTION, firmId), {
      contacts: updatedContacts,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error removing contact from investment firm:', error);
    throw error;
  }
};

/**
 * Add an investor to an investment firm
 * @param {String} firmId - Investment firm ID
 * @param {String} contactId - Contact ID of the investor
 * @param {String} role - Role at the firm
 * @param {Object} investmentPreferences - Investment preferences
 * @returns {Promise<void>}
 */
export const addInvestorToFirm = async (firmId, contactId, role, investmentPreferences) => {
  try {
    // Get the investment firm
    const firm = await getInvestmentFirmById(firmId);
    
    if (!firm) {
      throw new Error(`Investment firm with ID ${firmId} not found`);
    }
    
    // Add the investor
    const updatedInvestors = firm.investors || [];
    
    // Check if investor already exists
    const existingInvestorIndex = updatedInvestors.findIndex(investor => investor.contactId === contactId);
    
    if (existingInvestorIndex >= 0) {
      // Update existing investor
      updatedInvestors[existingInvestorIndex] = {
        ...updatedInvestors[existingInvestorIndex],
        role,
        investmentPreferences
      };
    } else {
      // Add new investor
      updatedInvestors.push({
        contactId,
        role,
        investmentPreferences
      });
    }
    
    await updateDoc(doc(db, INVESTMENT_FIRMS_COLLECTION, firmId), {
      investors: updatedInvestors,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding investor to firm:', error);
    throw error;
  }
};

/**
 * Remove an investor from an investment firm
 * @param {String} firmId - Investment firm ID
 * @param {String} contactId - Contact ID of the investor
 * @returns {Promise<void>}
 */
export const removeInvestorFromFirm = async (firmId, contactId) => {
  try {
    // Get the investment firm
    const firm = await getInvestmentFirmById(firmId);
    
    if (!firm) {
      throw new Error(`Investment firm with ID ${firmId} not found`);
    }
    
    // Remove the investor
    const updatedInvestors = (firm.investors || []).filter(investor => investor.contactId !== contactId);
    
    await updateDoc(doc(db, INVESTMENT_FIRMS_COLLECTION, firmId), {
      investors: updatedInvestors,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error removing investor from firm:', error);
    throw error;
  }
};

export default {
  createInvestmentFirm,
  getInvestmentFirmById,
  updateInvestmentFirm,
  deleteInvestmentFirm,
  addContactToInvestmentFirm,
  removeContactFromInvestmentFirm,
  addInvestorToFirm,
  removeInvestorFromFirm
};
