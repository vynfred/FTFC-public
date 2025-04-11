/**
 * Milestone Service
 * 
 * This service handles milestone-related operations:
 * - Creating milestones
 * - Updating milestones
 * - Completing milestones
 * - Retrieving milestones
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
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { callFunction } from '../firebase-config';
import { EMAIL_TYPES } from './emailService';

// Milestone status options
export const MILESTONE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed'
};

/**
 * Create a new milestone
 * @param {Object} milestoneData - Milestone data
 * @param {String} entityType - Type of entity (client, investor, partner)
 * @param {String} entityId - ID of the entity
 * @returns {Promise<Object>} - Created milestone with ID
 */
export const createMilestone = async (milestoneData, entityType, entityId) => {
  try {
    // Validate required fields
    if (!milestoneData.title) {
      throw new Error('Milestone title is required');
    }
    
    if (!entityType || !entityId) {
      throw new Error('Entity type and ID are required');
    }
    
    // Get the entity to ensure it exists and to get additional data
    const entityRef = doc(db, `${entityType}s`, entityId);
    const entityDoc = await getDoc(entityRef);
    
    if (!entityDoc.exists()) {
      throw new Error(`${entityType} not found: ${entityId}`);
    }
    
    const entityData = entityDoc.data();
    
    // Create milestone data with timestamps and entity info
    const milestone = {
      ...milestoneData,
      id: Date.now().toString(), // Simple ID generation
      entityType,
      entityId,
      entityName: entityData.companyName || entityData.name || 'Unknown',
      status: milestoneData.status || MILESTONE_STATUS.PENDING,
      completed: milestoneData.status === MILESTONE_STATUS.COMPLETED,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Get existing milestones from the entity
    const existingMilestones = entityData.milestones || [];
    
    // Add the new milestone
    const updatedMilestones = [...existingMilestones, milestone];
    
    // Update the entity with the new milestone
    await updateDoc(entityRef, {
      milestones: updatedMilestones,
      updatedAt: serverTimestamp()
    });
    
    // Create activity log
    await addDoc(collection(db, 'activity'), {
      type: entityType,
      action: 'milestone_created',
      entityId,
      entityType,
      entityName: entityData.companyName || entityData.name || 'Unknown',
      milestoneId: milestone.id,
      milestoneName: milestone.title,
      timestamp: serverTimestamp(),
      description: `New milestone created: ${milestone.title}`
    });
    
    return milestone;
  } catch (error) {
    console.error('Error creating milestone:', error);
    throw error;
  }
};

/**
 * Update a milestone
 * @param {String} entityType - Type of entity (client, investor, partner)
 * @param {String} entityId - ID of the entity
 * @param {String} milestoneId - ID of the milestone
 * @param {Object} milestoneData - Updated milestone data
 * @returns {Promise<Object>} - Updated milestone
 */
export const updateMilestone = async (entityType, entityId, milestoneId, milestoneData) => {
  try {
    // Validate required fields
    if (!milestoneData.title) {
      throw new Error('Milestone title is required');
    }
    
    if (!entityType || !entityId || !milestoneId) {
      throw new Error('Entity type, entity ID, and milestone ID are required');
    }
    
    // Get the entity to ensure it exists and to get the milestones
    const entityRef = doc(db, `${entityType}s`, entityId);
    const entityDoc = await getDoc(entityRef);
    
    if (!entityDoc.exists()) {
      throw new Error(`${entityType} not found: ${entityId}`);
    }
    
    const entityData = entityDoc.data();
    const milestones = entityData.milestones || [];
    
    // Find the milestone to update
    const milestoneIndex = milestones.findIndex(m => m.id === milestoneId);
    
    if (milestoneIndex === -1) {
      throw new Error(`Milestone not found: ${milestoneId}`);
    }
    
    // Check if the milestone is being completed
    const wasCompleted = milestones[milestoneIndex].completed;
    const isBeingCompleted = milestoneData.status === MILESTONE_STATUS.COMPLETED && !wasCompleted;
    
    // Update the milestone
    const updatedMilestone = {
      ...milestones[milestoneIndex],
      ...milestoneData,
      completed: milestoneData.status === MILESTONE_STATUS.COMPLETED,
      updatedAt: serverTimestamp()
    };
    
    // Update the milestones array
    const updatedMilestones = [...milestones];
    updatedMilestones[milestoneIndex] = updatedMilestone;
    
    // Update the entity with the updated milestones
    await updateDoc(entityRef, {
      milestones: updatedMilestones,
      updatedAt: serverTimestamp()
    });
    
    // Create activity log
    await addDoc(collection(db, 'activity'), {
      type: entityType,
      action: isBeingCompleted ? 'milestone_completed' : 'milestone_updated',
      entityId,
      entityType,
      entityName: entityData.companyName || entityData.name || 'Unknown',
      milestoneId,
      milestoneName: updatedMilestone.title,
      timestamp: serverTimestamp(),
      description: isBeingCompleted
        ? `Milestone completed: ${updatedMilestone.title}`
        : `Milestone updated: ${updatedMilestone.title}`
    });
    
    // If the milestone is being completed, send a notification
    if (isBeingCompleted) {
      await sendMilestoneCompletionNotification(entityType, entityId, updatedMilestone);
    }
    
    return updatedMilestone;
  } catch (error) {
    console.error('Error updating milestone:', error);
    throw error;
  }
};

/**
 * Delete a milestone
 * @param {String} entityType - Type of entity (client, investor, partner)
 * @param {String} entityId - ID of the entity
 * @param {String} milestoneId - ID of the milestone
 * @returns {Promise<void>}
 */
export const deleteMilestone = async (entityType, entityId, milestoneId) => {
  try {
    // Validate required fields
    if (!entityType || !entityId || !milestoneId) {
      throw new Error('Entity type, entity ID, and milestone ID are required');
    }
    
    // Get the entity to ensure it exists and to get the milestones
    const entityRef = doc(db, `${entityType}s`, entityId);
    const entityDoc = await getDoc(entityRef);
    
    if (!entityDoc.exists()) {
      throw new Error(`${entityType} not found: ${entityId}`);
    }
    
    const entityData = entityDoc.data();
    const milestones = entityData.milestones || [];
    
    // Find the milestone to delete
    const milestoneIndex = milestones.findIndex(m => m.id === milestoneId);
    
    if (milestoneIndex === -1) {
      throw new Error(`Milestone not found: ${milestoneId}`);
    }
    
    const deletedMilestone = milestones[milestoneIndex];
    
    // Remove the milestone from the array
    const updatedMilestones = milestones.filter(m => m.id !== milestoneId);
    
    // Update the entity with the updated milestones
    await updateDoc(entityRef, {
      milestones: updatedMilestones,
      updatedAt: serverTimestamp()
    });
    
    // Create activity log
    await addDoc(collection(db, 'activity'), {
      type: entityType,
      action: 'milestone_deleted',
      entityId,
      entityType,
      entityName: entityData.companyName || entityData.name || 'Unknown',
      milestoneId,
      milestoneName: deletedMilestone.title,
      timestamp: serverTimestamp(),
      description: `Milestone deleted: ${deletedMilestone.title}`
    });
  } catch (error) {
    console.error('Error deleting milestone:', error);
    throw error;
  }
};

/**
 * Complete a milestone
 * @param {String} entityType - Type of entity (client, investor, partner)
 * @param {String} entityId - ID of the entity
 * @param {String} milestoneId - ID of the milestone
 * @param {Object} completionData - Additional data for completion (notes, etc.)
 * @returns {Promise<Object>} - Updated milestone
 */
export const completeMilestone = async (entityType, entityId, milestoneId, completionData = {}) => {
  try {
    // Update the milestone with completed status
    return await updateMilestone(entityType, entityId, milestoneId, {
      ...completionData,
      status: MILESTONE_STATUS.COMPLETED,
      completedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error completing milestone:', error);
    throw error;
  }
};

/**
 * Get milestones for an entity
 * @param {String} entityType - Type of entity (client, investor, partner)
 * @param {String} entityId - ID of the entity
 * @returns {Promise<Array>} - Array of milestones
 */
export const getMilestones = async (entityType, entityId) => {
  try {
    // Validate required fields
    if (!entityType || !entityId) {
      throw new Error('Entity type and ID are required');
    }
    
    // Get the entity to ensure it exists and to get the milestones
    const entityRef = doc(db, `${entityType}s`, entityId);
    const entityDoc = await getDoc(entityRef);
    
    if (!entityDoc.exists()) {
      throw new Error(`${entityType} not found: ${entityId}`);
    }
    
    const entityData = entityDoc.data();
    const milestones = entityData.milestones || [];
    
    // Sort milestones by status (pending, in-progress, completed) and then by date
    return milestones.sort((a, b) => {
      // First sort by status
      const statusOrder = {
        [MILESTONE_STATUS.PENDING]: 0,
        [MILESTONE_STATUS.IN_PROGRESS]: 1,
        [MILESTONE_STATUS.COMPLETED]: 2
      };
      
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      
      if (statusDiff !== 0) {
        return statusDiff;
      }
      
      // Then sort by date (if available)
      if (a.date && b.date) {
        return new Date(a.date) - new Date(b.date);
      }
      
      return 0;
    });
  } catch (error) {
    console.error('Error getting milestones:', error);
    throw error;
  }
};

/**
 * Send a notification when a milestone is completed
 * @param {String} entityType - Type of entity (client, investor, partner)
 * @param {String} entityId - ID of the entity
 * @param {Object} milestone - Milestone data
 * @returns {Promise<void>}
 */
const sendMilestoneCompletionNotification = async (entityType, entityId, milestone) => {
  try {
    // Get the entity to get contact information
    const entityRef = doc(db, `${entityType}s`, entityId);
    const entityDoc = await getDoc(entityRef);
    
    if (!entityDoc.exists()) {
      throw new Error(`${entityType} not found: ${entityId}`);
    }
    
    const entityData = entityDoc.data();
    
    // Get the email address to send the notification to
    const email = entityData.email;
    
    if (!email) {
      console.log(`No email found for ${entityType} ${entityId}`);
      return;
    }
    
    // Get the next milestone (if any)
    const milestones = entityData.milestones || [];
    const nextMilestone = milestones.find(m => 
      m.status !== MILESTONE_STATUS.COMPLETED && m.id !== milestone.id
    );
    
    // Format completion date
    const completionDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Generate portal link
    const portalLink = `https://ftfc-start.web.app/${entityType}-portal`;
    
    // Send email notification
    await callFunction('sendCustomEmail', {
      email,
      type: EMAIL_TYPES.MILESTONE_COMPLETED,
      data: {
        milestoneName: milestone.title,
        completionDate,
        nextMilestone: nextMilestone ? nextMilestone.title : 'None',
        portalLink
      }
    });
  } catch (error) {
    console.error('Error sending milestone completion notification:', error);
    // Don't throw the error, as this is a non-critical operation
  }
};

export default {
  createMilestone,
  updateMilestone,
  deleteMilestone,
  completeMilestone,
  getMilestones,
  MILESTONE_STATUS
};
