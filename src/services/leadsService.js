/**
 * Leads Service
 *
 * This service handles operations related to leads in the Firestore database.
 * It includes schema validation for all database operations.
 */

import {
    addDoc, collection, deleteDoc, doc, getDoc,
    getDocs, limit, orderBy, query, serverTimestamp, startAfter, updateDoc, where
} from 'firebase/firestore';
import { db } from '../firebase-config';
import { LEAD_STATUS, PAGINATION } from '../utils/constants';
import { leadSchema, validateData } from '../utils/validation';

/**
 * Create a new lead
 * @param {Object} leadData - The lead data to create
 * @returns {Promise<Object>} The created lead with ID
 */
export const createLead = async (leadData) => {
  try {
    // Sanitize input data
    const sanitizedData = sanitizeFormData(leadData, ['notes']);

    // Validate lead data against schema
    const validation = await validateData(leadSchema, sanitizedData);

    if (!validation.isValid) {
      throw new ValidationError('Invalid lead data', validation.errors, 'leads/validation-error');
    }

    // Set default values
    const dataToSave = {
      ...validation.data,
      status: validation.data.status || LEAD_STATUS.NEW,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Add document to Firestore
    const leadsRef = collection(db, 'leads');
    const docRef = await addDoc(leadsRef, dataToSave);

    return {
      id: docRef.id,
      ...dataToSave,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error) {
    // Handle and rethrow the error
    const processedError = handleError(error);
    throw processedError;
  }
};

/**
 * Get a lead by ID
 * @param {string} leadId - The lead ID
 * @returns {Promise<Object>} The lead data
 */
export const getLeadById = async (leadId) => {
  try {
    const docRef = doc(db, 'leads', leadId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new NotFoundError(`Lead with ID ${leadId} not found`, 'leads/not-found');
    }

    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  } catch (error) {
    // Handle and rethrow the error
    const processedError = handleError(error);
    throw processedError;
  }
};

/**
 * Get leads with pagination
 * @param {Object} options - Query options
 * @param {string} options.status - Filter by status
 * @param {string} options.assignedTo - Filter by assigned user
 * @param {number} options.pageSize - Number of leads per page
 * @param {Object} options.startAfterDoc - Document to start after for pagination
 * @returns {Promise<Object>} The leads and pagination info
 */
export const getLeads = async (options = {}) => {
  try {
    const {
      status,
      assignedTo,
      pageSize = PAGINATION.DEFAULT_PAGE_SIZE,
      startAfterDoc = null
    } = options;

    // Build query
    let leadsQuery = collection(db, 'leads');
    const queryConstraints = [];

    // Add filters
    if (status) {
      queryConstraints.push(where('status', '==', status));
    }

    if (assignedTo) {
      queryConstraints.push(where('assignedTo', '==', assignedTo));
    }

    // Add sorting and pagination
    queryConstraints.push(orderBy('createdAt', 'desc'));
    queryConstraints.push(limit(pageSize));

    // Add startAfter if provided
    if (startAfterDoc) {
      const startAfterDocRef = doc(db, 'leads', startAfterDoc);
      const startAfterDocSnap = await getDoc(startAfterDocRef);

      if (startAfterDocSnap.exists()) {
        queryConstraints.push(startAfter(startAfterDocSnap));
      }
    }

    // Execute query
    const q = query(leadsQuery, ...queryConstraints);
    const querySnapshot = await getDocs(q);

    // Process results
    const leads = [];
    querySnapshot.forEach((doc) => {
      leads.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Get last document for pagination
    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    return {
      leads,
      pagination: {
        hasMore: leads.length === pageSize,
        lastDocId: lastDoc ? lastDoc.id : null
      }
    };
  } catch (error) {
    console.error('Error getting leads:', error);
    throw error;
  }
};

/**
 * Update a lead
 * @param {string} leadId - The lead ID
 * @param {Object} leadData - The lead data to update
 * @returns {Promise<Object>} The updated lead
 */
export const updateLead = async (leadId, leadData) => {
  try {
    // Get current lead data
    const currentLead = await getLeadById(leadId);

    // Sanitize input data
    const sanitizedData = sanitizeFormData(leadData, ['notes']);

    // Merge with new data
    const mergedData = {
      ...currentLead,
      ...sanitizedData,
      id: undefined // Remove ID from data to update
    };

    // Validate merged data
    const validation = await validateData(leadSchema, mergedData);

    if (!validation.isValid) {
      throw new Error(`Validation error: ${JSON.stringify(validation.errors)}`);
    }

    // Add timestamp
    const dataToUpdate = {
      ...validation.data,
      updatedAt: serverTimestamp()
    };

    // Update document
    const docRef = doc(db, 'leads', leadId);
    await updateDoc(docRef, dataToUpdate);

    return {
      id: leadId,
      ...dataToUpdate,
      updatedAt: new Date()
    };
  } catch (error) {
    console.error(`Error updating lead ${leadId}:`, error);
    throw error;
  }
};

/**
 * Delete a lead
 * @param {string} leadId - The lead ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteLead = async (leadId) => {
  try {
    const docRef = doc(db, 'leads', leadId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Error deleting lead ${leadId}:`, error);
    throw error;
  }
};

/**
 * Convert a lead to a client
 * @param {string} leadId - The lead ID
 * @param {Object} additionalData - Additional client data
 * @returns {Promise<Object>} The created client
 */
export const convertLeadToClient = async (leadId, additionalData = {}) => {
  try {
    // Get lead data
    const lead = await getLeadById(leadId);

    // Sanitize additional data
    const sanitizedAdditionalData = sanitizeFormData(additionalData, ['notes']);

    // Create client data
    const clientData = {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      notes: lead.notes,
      assignedTo: lead.assignedTo,
      source: 'lead_conversion',
      leadId: leadId,
      status: 'active',
      ...sanitizedAdditionalData
    };

    // Create client
    const clientsRef = collection(db, 'clients');
    const clientDocRef = await addDoc(clientsRef, {
      ...clientData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Update lead status
    await updateLead(leadId, { status: LEAD_STATUS.WON, convertedToClientId: clientDocRef.id });

    return {
      id: clientDocRef.id,
      ...clientData
    };
  } catch (error) {
    console.error(`Error converting lead ${leadId} to client:`, error);
    throw error;
  }
};
