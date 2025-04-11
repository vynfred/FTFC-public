/**
 * Client Service
 * 
 * This service handles client-related operations:
 * - Creating new clients
 * - Converting leads to clients
 * - Managing client data
 */

import { db } from '../firebase-config';
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  updateDoc, 
  query,
  where,
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Create a new client
 * @param {Object} clientData - Client data
 * @returns {Promise<Object>} - Created client with ID
 */
export const createClient = async (clientData) => {
  try {
    // Add timestamps
    const clientWithTimestamps = {
      ...clientData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Add to Firestore
    const docRef = await addDoc(collection(db, 'clients'), clientWithTimestamps);
    
    // Create activity log
    await addDoc(collection(db, 'activity'), {
      type: 'client',
      action: 'created',
      clientId: docRef.id,
      companyName: clientData.companyName || 'New Client',
      timestamp: serverTimestamp(),
      description: `New client created: ${clientData.companyName || 'New Client'}`
    });
    
    return {
      id: docRef.id,
      ...clientData
    };
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

/**
 * Convert a lead to a client
 * @param {String} leadId - Lead ID
 * @param {Object} additionalData - Additional client data
 * @returns {Promise<Object>} - Created client with ID
 */
export const convertLeadToClient = async (leadId, additionalData = {}) => {
  try {
    // Get the lead
    const leadDoc = await getDoc(doc(db, 'leads', leadId));
    
    if (!leadDoc.exists()) {
      throw new Error(`Lead not found: ${leadId}`);
    }
    
    const leadData = leadDoc.data();
    
    // Get the company
    const companyDoc = await getDoc(doc(db, 'companies', leadData.companyId));
    
    if (!companyDoc.exists()) {
      throw new Error(`Company not found: ${leadData.companyId}`);
    }
    
    const companyData = companyDoc.data();
    
    // Get the contact
    const contactDoc = await getDoc(doc(db, 'contacts', leadData.primaryContactId));
    
    if (!contactDoc.exists()) {
      throw new Error(`Contact not found: ${leadData.primaryContactId}`);
    }
    
    const contactData = contactDoc.data();
    
    // Create client data
    const clientData = {
      companyId: leadData.companyId,
      contactId: leadData.primaryContactId,
      leadId: leadId,
      companyName: companyData.name,
      contactName: `${contactData.firstName} ${contactData.lastName}`,
      email: contactData.email,
      phone: contactData.phone,
      status: 'Active',
      source: leadData.source,
      referralSource: leadData.referralSource || '',
      referrerId: leadData.referrerId || '',
      owner: additionalData.owner || leadData.assignedTo || '',
      goals: additionalData.goals || [],
      milestones: [
        {
          title: 'Initial Consultation',
          completed: true,
          date: new Date().toISOString()
        },
        ...(additionalData.milestones || [])
      ],
      documents: [],
      transcripts: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: additionalData.createdBy || 'lead_conversion'
    };
    
    // Create the client
    const clientRef = await addDoc(collection(db, 'clients'), clientData);
    
    // Update the lead to mark it as converted
    await updateDoc(doc(db, 'leads', leadId), {
      status: 'Converted',
      stage: 'Client',
      clientId: clientRef.id,
      conversionDate: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Create activity logs
    await addDoc(collection(db, 'activity'), {
      type: 'lead',
      action: 'converted',
      leadId: leadId,
      clientId: clientRef.id,
      companyName: companyData.name,
      timestamp: serverTimestamp(),
      description: `Lead converted to client: ${companyData.name}`
    });
    
    await addDoc(collection(db, 'activity'), {
      type: 'client',
      action: 'created',
      clientId: clientRef.id,
      companyName: companyData.name,
      timestamp: serverTimestamp(),
      description: `New client created from lead: ${companyData.name}`
    });
    
    return {
      id: clientRef.id,
      ...clientData
    };
  } catch (error) {
    console.error('Error converting lead to client:', error);
    throw error;
  }
};

/**
 * Get client by ID
 * @param {String} clientId - Client ID
 * @returns {Promise<Object>} - Client data
 */
export const getClientById = async (clientId) => {
  try {
    const clientDoc = await getDoc(doc(db, 'clients', clientId));
    
    if (!clientDoc.exists()) {
      throw new Error(`Client not found: ${clientId}`);
    }
    
    return {
      id: clientDoc.id,
      ...clientDoc.data()
    };
  } catch (error) {
    console.error('Error getting client:', error);
    throw error;
  }
};

/**
 * Update client
 * @param {String} clientId - Client ID
 * @param {Object} clientData - Client data to update
 * @returns {Promise<Object>} - Updated client
 */
export const updateClient = async (clientId, clientData) => {
  try {
    // Add updated timestamp
    const clientWithTimestamp = {
      ...clientData,
      updatedAt: serverTimestamp()
    };
    
    // Update in Firestore
    await updateDoc(doc(db, 'clients', clientId), clientWithTimestamp);
    
    // Create activity log
    await addDoc(collection(db, 'activity'), {
      type: 'client',
      action: 'updated',
      clientId: clientId,
      companyName: clientData.companyName || 'Client',
      timestamp: serverTimestamp(),
      description: `Client updated: ${clientData.companyName || 'Client'}`
    });
    
    return {
      id: clientId,
      ...clientData
    };
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
};

/**
 * Get all clients
 * @returns {Promise<Array>} - Array of clients
 */
export const getAllClients = async () => {
  try {
    const clientsSnapshot = await getDocs(collection(db, 'clients'));
    
    const clients = [];
    
    clientsSnapshot.forEach((doc) => {
      clients.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return clients;
  } catch (error) {
    console.error('Error getting clients:', error);
    throw error;
  }
};

/**
 * Add a goal to a client
 * @param {String} clientId - Client ID
 * @param {Object} goal - Goal data
 * @returns {Promise<Object>} - Updated client
 */
export const addGoalToClient = async (clientId, goal) => {
  try {
    // Get the client
    const clientDoc = await getDoc(doc(db, 'clients', clientId));
    
    if (!clientDoc.exists()) {
      throw new Error(`Client not found: ${clientId}`);
    }
    
    const clientData = clientDoc.data();
    
    // Add the goal
    const goals = clientData.goals || [];
    goals.push({
      ...goal,
      id: Date.now().toString(), // Simple ID generation
      createdAt: new Date().toISOString()
    });
    
    // Update the client
    await updateDoc(doc(db, 'clients', clientId), {
      goals,
      updatedAt: serverTimestamp()
    });
    
    // Create activity log
    await addDoc(collection(db, 'activity'), {
      type: 'client',
      action: 'goal_added',
      clientId: clientId,
      companyName: clientData.companyName || 'Client',
      timestamp: serverTimestamp(),
      description: `Goal added to client: ${goal.title}`
    });
    
    return {
      id: clientId,
      ...clientData,
      goals
    };
  } catch (error) {
    console.error('Error adding goal to client:', error);
    throw error;
  }
};

/**
 * Add a milestone to a client
 * @param {String} clientId - Client ID
 * @param {Object} milestone - Milestone data
 * @returns {Promise<Object>} - Updated client
 */
export const addMilestoneToClient = async (clientId, milestone) => {
  try {
    // Get the client
    const clientDoc = await getDoc(doc(db, 'clients', clientId));
    
    if (!clientDoc.exists()) {
      throw new Error(`Client not found: ${clientId}`);
    }
    
    const clientData = clientDoc.data();
    
    // Add the milestone
    const milestones = clientData.milestones || [];
    milestones.push({
      ...milestone,
      id: Date.now().toString(), // Simple ID generation
      createdAt: new Date().toISOString()
    });
    
    // Update the client
    await updateDoc(doc(db, 'clients', clientId), {
      milestones,
      updatedAt: serverTimestamp()
    });
    
    // Create activity log
    await addDoc(collection(db, 'activity'), {
      type: 'client',
      action: 'milestone_added',
      clientId: clientId,
      companyName: clientData.companyName || 'Client',
      timestamp: serverTimestamp(),
      description: `Milestone added to client: ${milestone.title}`
    });
    
    return {
      id: clientId,
      ...clientData,
      milestones
    };
  } catch (error) {
    console.error('Error adding milestone to client:', error);
    throw error;
  }
};

export default {
  createClient,
  convertLeadToClient,
  getClientById,
  updateClient,
  getAllClients,
  addGoalToClient,
  addMilestoneToClient
};
