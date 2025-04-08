/**
 * Partner Schema
 * 
 * This schema defines the structure for partners in the FTFC application.
 * Partners are contacts who can be independent or associated with partner firms.
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
 * Partner Schema Structure
 * 
 * contactId: String - Reference to contact
 * isIndependent: Boolean - Whether they're independent or firm-associated
 * firmId: String - Reference to partner firm (if applicable)
 * partnerType: String - Type of partner
 * specialties: [String] - Areas of specialty
 * referrals: [{
 *   companyId: String - Reference to company
 *   date: Timestamp - Referral date
 *   status: String - Status of the referral
 *   notes: String - Notes about the referral
 * }]
 * commissionRate: Number - Commission rate percentage
 * totalCommission: Number - Total commission earned
 * status: String - Partner status (e.g., Active, Inactive)
 * createdAt: Timestamp - Creation timestamp
 * updatedAt: Timestamp - Last update timestamp
 * createdBy: String - User who created the partner
 */

// Collection name
const PARTNERS_COLLECTION = 'partners';

/**
 * Create a new partner
 * @param {Object} partnerData - Partner data
 * @returns {Promise<Object>} - Created partner with ID
 */
export const createPartner = async (partnerData) => {
  try {
    // Add timestamps
    const partnerWithTimestamps = {
      ...partnerData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Add to Firestore
    const docRef = await addDoc(collection(db, PARTNERS_COLLECTION), partnerWithTimestamps);
    
    return {
      id: docRef.id,
      ...partnerData
    };
  } catch (error) {
    console.error('Error creating partner:', error);
    throw error;
  }
};

/**
 * Get a partner by ID
 * @param {String} partnerId - Partner ID
 * @returns {Promise<Object|null>} - Partner data or null if not found
 */
export const getPartnerById = async (partnerId) => {
  try {
    const partnerDoc = await getDoc(doc(db, PARTNERS_COLLECTION, partnerId));
    
    if (partnerDoc.exists()) {
      return {
        id: partnerDoc.id,
        ...partnerDoc.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting partner:', error);
    throw error;
  }
};

/**
 * Get a partner by contact ID
 * @param {String} contactId - Contact ID
 * @returns {Promise<Object|null>} - Partner data or null if not found
 */
export const getPartnerByContactId = async (contactId) => {
  try {
    const q = query(
      collection(db, PARTNERS_COLLECTION),
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
    console.error('Error getting partner by contact ID:', error);
    throw error;
  }
};

/**
 * Update a partner
 * @param {String} partnerId - Partner ID
 * @param {Object} partnerData - Updated partner data
 * @returns {Promise<void>}
 */
export const updatePartner = async (partnerId, partnerData) => {
  try {
    // Add updated timestamp
    const updatedData = {
      ...partnerData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(doc(db, PARTNERS_COLLECTION, partnerId), updatedData);
  } catch (error) {
    console.error('Error updating partner:', error);
    throw error;
  }
};

/**
 * Delete a partner
 * @param {String} partnerId - Partner ID
 * @returns {Promise<void>}
 */
export const deletePartner = async (partnerId) => {
  try {
    await deleteDoc(doc(db, PARTNERS_COLLECTION, partnerId));
  } catch (error) {
    console.error('Error deleting partner:', error);
    throw error;
  }
};

/**
 * Get partners by firm ID
 * @param {String} firmId - Partner firm ID
 * @returns {Promise<Array>} - Array of partners
 */
export const getPartnersByFirm = async (firmId) => {
  try {
    const q = query(
      collection(db, PARTNERS_COLLECTION),
      where('firmId', '==', firmId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting partners by firm:', error);
    throw error;
  }
};

/**
 * Get independent partners
 * @returns {Promise<Array>} - Array of independent partners
 */
export const getIndependentPartners = async () => {
  try {
    const q = query(
      collection(db, PARTNERS_COLLECTION),
      where('isIndependent', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting independent partners:', error);
    throw error;
  }
};

/**
 * Add a referral to a partner
 * @param {String} partnerId - Partner ID
 * @param {String} companyId - Company ID
 * @param {String} notes - Notes about the referral
 * @returns {Promise<void>}
 */
export const addReferral = async (partnerId, companyId, notes = '') => {
  try {
    // Get the partner
    const partner = await getPartnerById(partnerId);
    
    if (!partner) {
      throw new Error(`Partner with ID ${partnerId} not found`);
    }
    
    // Add the referral
    const updatedReferrals = partner.referrals || [];
    
    updatedReferrals.push({
      companyId,
      date: serverTimestamp(),
      status: 'New',
      notes
    });
    
    await updateDoc(doc(db, PARTNERS_COLLECTION, partnerId), {
      referrals: updatedReferrals,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding referral:', error);
    throw error;
  }
};

/**
 * Update referral status
 * @param {String} partnerId - Partner ID
 * @param {String} companyId - Company ID
 * @param {String} status - New status
 * @returns {Promise<void>}
 */
export const updateReferralStatus = async (partnerId, companyId, status) => {
  try {
    // Get the partner
    const partner = await getPartnerById(partnerId);
    
    if (!partner) {
      throw new Error(`Partner with ID ${partnerId} not found`);
    }
    
    // Update the referral status
    const updatedReferrals = (partner.referrals || []).map(referral => {
      if (referral.companyId === companyId) {
        return {
          ...referral,
          status
        };
      }
      return referral;
    });
    
    await updateDoc(doc(db, PARTNERS_COLLECTION, partnerId), {
      referrals: updatedReferrals,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating referral status:', error);
    throw error;
  }
};

/**
 * Create a partner from contact
 * @param {String} contactId - Contact ID
 * @param {Boolean} isIndependent - Whether the partner is independent
 * @param {String} firmId - Partner firm ID (if applicable)
 * @param {String} partnerType - Type of partner
 * @param {Array} specialties - Areas of specialty
 * @returns {Promise<Object>} - Created partner
 */
export const createPartnerFromContact = async (contactId, isIndependent, firmId, partnerType, specialties) => {
  try {
    // Check if partner already exists for this contact
    const existingPartner = await getPartnerByContactId(contactId);
    
    if (existingPartner) {
      throw new Error(`Partner already exists for contact with ID ${contactId}`);
    }
    
    // Create partner data
    const partnerData = {
      contactId,
      isIndependent,
      firmId: isIndependent ? null : firmId,
      partnerType: partnerType || 'Referral',
      specialties: specialties || [],
      referrals: [],
      commissionRate: 10, // Default 10%
      totalCommission: 0,
      status: 'Active',
      createdBy: 'manual_entry'
    };
    
    return await createPartner(partnerData);
  } catch (error) {
    console.error('Error creating partner from contact:', error);
    throw error;
  }
};

export default {
  createPartner,
  getPartnerById,
  getPartnerByContactId,
  updatePartner,
  deletePartner,
  getPartnersByFirm,
  getIndependentPartners,
  addReferral,
  updateReferralStatus,
  createPartnerFromContact
};
