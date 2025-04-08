/**
 * Investor Schema
 * 
 * This schema defines the structure for investors in the FTFC application.
 * Investors are contacts who can be independent or associated with investment firms.
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
 * Investor Schema Structure
 * 
 * contactId: String - Reference to contact
 * isIndependent: Boolean - Whether they're independent or firm-associated
 * firmId: String - Reference to investment firm (if applicable)
 * investmentPreferences: {
 *   industries: [String] - Preferred industries
 *   stages: [String] - Preferred stages
 *   checkSize: {
 *     min: Number - Minimum check size
 *     max: Number - Maximum check size
 *   }
 * }
 * investments: [{
 *   companyId: String - Reference to company
 *   amount: Number - Investment amount
 *   date: Timestamp - Investment date
 *   round: String - Funding round
 * }]
 * status: String - Investor status (e.g., Active, Inactive)
 * createdAt: Timestamp - Creation timestamp
 * updatedAt: Timestamp - Last update timestamp
 * createdBy: String - User who created the investor
 */

// Collection name
const INVESTORS_COLLECTION = 'investors';

/**
 * Create a new investor
 * @param {Object} investorData - Investor data
 * @returns {Promise<Object>} - Created investor with ID
 */
export const createInvestor = async (investorData) => {
  try {
    // Add timestamps
    const investorWithTimestamps = {
      ...investorData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Add to Firestore
    const docRef = await addDoc(collection(db, INVESTORS_COLLECTION), investorWithTimestamps);
    
    return {
      id: docRef.id,
      ...investorData
    };
  } catch (error) {
    console.error('Error creating investor:', error);
    throw error;
  }
};

/**
 * Get an investor by ID
 * @param {String} investorId - Investor ID
 * @returns {Promise<Object|null>} - Investor data or null if not found
 */
export const getInvestorById = async (investorId) => {
  try {
    const investorDoc = await getDoc(doc(db, INVESTORS_COLLECTION, investorId));
    
    if (investorDoc.exists()) {
      return {
        id: investorDoc.id,
        ...investorDoc.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting investor:', error);
    throw error;
  }
};

/**
 * Get an investor by contact ID
 * @param {String} contactId - Contact ID
 * @returns {Promise<Object|null>} - Investor data or null if not found
 */
export const getInvestorByContactId = async (contactId) => {
  try {
    const q = query(
      collection(db, INVESTORS_COLLECTION),
      where('contactId', '==', contactId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting investor by contact ID:', error);
    throw error;
  }
};

/**
 * Update an investor
 * @param {String} investorId - Investor ID
 * @param {Object} investorData - Updated investor data
 * @returns {Promise<void>}
 */
export const updateInvestor = async (investorId, investorData) => {
  try {
    // Add updated timestamp
    const updatedData = {
      ...investorData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(doc(db, INVESTORS_COLLECTION, investorId), updatedData);
  } catch (error) {
    console.error('Error updating investor:', error);
    throw error;
  }
};

/**
 * Delete an investor
 * @param {String} investorId - Investor ID
 * @returns {Promise<void>}
 */
export const deleteInvestor = async (investorId) => {
  try {
    await deleteDoc(doc(db, INVESTORS_COLLECTION, investorId));
  } catch (error) {
    console.error('Error deleting investor:', error);
    throw error;
  }
};

/**
 * Get investors by firm ID
 * @param {String} firmId - Investment firm ID
 * @returns {Promise<Array>} - Array of investors
 */
export const getInvestorsByFirm = async (firmId) => {
  try {
    const q = query(
      collection(db, INVESTORS_COLLECTION),
      where('firmId', '==', firmId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting investors by firm:', error);
    throw error;
  }
};

/**
 * Get independent investors
 * @returns {Promise<Array>} - Array of independent investors
 */
export const getIndependentInvestors = async () => {
  try {
    const q = query(
      collection(db, INVESTORS_COLLECTION),
      where('isIndependent', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting independent investors:', error);
    throw error;
  }
};

/**
 * Add an investment to an investor
 * @param {String} investorId - Investor ID
 * @param {String} companyId - Company ID
 * @param {Number} amount - Investment amount
 * @param {String} round - Funding round
 * @returns {Promise<void>}
 */
export const addInvestment = async (investorId, companyId, amount, round) => {
  try {
    // Get the investor
    const investor = await getInvestorById(investorId);
    
    if (!investor) {
      throw new Error(`Investor with ID ${investorId} not found`);
    }
    
    // Add the investment
    const updatedInvestments = investor.investments || [];
    
    updatedInvestments.push({
      companyId,
      amount,
      date: serverTimestamp(),
      round
    });
    
    await updateDoc(doc(db, INVESTORS_COLLECTION, investorId), {
      investments: updatedInvestments,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding investment:', error);
    throw error;
  }
};

/**
 * Create an investor from contact
 * @param {String} contactId - Contact ID
 * @param {Boolean} isIndependent - Whether the investor is independent
 * @param {String} firmId - Investment firm ID (if applicable)
 * @param {Object} investmentPreferences - Investment preferences
 * @returns {Promise<Object>} - Created investor
 */
export const createInvestorFromContact = async (contactId, isIndependent, firmId, investmentPreferences) => {
  try {
    // Check if investor already exists for this contact
    const existingInvestor = await getInvestorByContactId(contactId);
    
    if (existingInvestor) {
      throw new Error(`Investor already exists for contact with ID ${contactId}`);
    }
    
    // Create investor data
    const investorData = {
      contactId,
      isIndependent,
      firmId: isIndependent ? null : firmId,
      investmentPreferences: investmentPreferences || {
        industries: [],
        stages: [],
        checkSize: {
          min: null,
          max: null
        }
      },
      investments: [],
      status: 'Active',
      createdBy: 'manual_entry'
    };
    
    return await createInvestor(investorData);
  } catch (error) {
    console.error('Error creating investor from contact:', error);
    throw error;
  }
};

export default {
  createInvestor,
  getInvestorById,
  getInvestorByContactId,
  updateInvestor,
  deleteInvestor,
  getInvestorsByFirm,
  getIndependentInvestors,
  addInvestment,
  createInvestorFromContact
};
