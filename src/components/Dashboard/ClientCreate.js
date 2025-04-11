import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import DashboardSection from '../shared/DashboardSection';
import { createClient } from '../../services/ClientService';
import styles from './DetailPages.module.css';

const ClientCreate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [clientData, setClientData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    size: '',
    status: 'Active',
    owner: '',
    notes: '',
    goals: [],
    milestones: [
      {
        title: 'Initial Consultation',
        description: 'Discuss client needs and objectives',
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      }
    ]
  });
  
  // New goal state
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target: '',
    current: '',
    progress: 0
  });
  
  // New milestone state
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    status: 'pending',
    date: new Date().toISOString().split('T')[0]
  });
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle new goal input change
  const handleGoalInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle new milestone input change
  const handleMilestoneInputChange = (e) => {
    const { name, value } = e.target;
    setNewMilestone(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Add new goal
  const handleAddGoal = () => {
    if (!newGoal.title) return;
    
    setClientData(prev => ({
      ...prev,
      goals: [
        ...prev.goals,
        {
          ...newGoal,
          id: Date.now().toString(),
          progress: parseInt(newGoal.progress) || 0
        }
      ]
    }));
    
    // Reset new goal form
    setNewGoal({
      title: '',
      description: '',
      target: '',
      current: '',
      progress: 0
    });
  };
  
  // Add new milestone
  const handleAddMilestone = () => {
    if (!newMilestone.title) return;
    
    setClientData(prev => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        {
          ...newMilestone,
          id: Date.now().toString()
        }
      ]
    }));
    
    // Reset new milestone form
    setNewMilestone({
      title: '',
      description: '',
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    });
  };
  
  // Remove goal
  const handleRemoveGoal = (goalId) => {
    setClientData(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal.id !== goalId)
    }));
  };
  
  // Remove milestone
  const handleRemoveMilestone = (milestoneId) => {
    setClientData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(milestone => milestone.id !== milestoneId)
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!clientData.companyName || !clientData.contactName || !clientData.email) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create client
      const client = await createClient(clientData);
      
      setSuccess(true);
      
      // Redirect to client detail page after a short delay
      setTimeout(() => {
        navigate(`/dashboard/clients/${client.id}`);
      }, 1500);
    } catch (err) {
      console.error('Error creating client:', err);
      setError(`Error creating client: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={styles.detailPage}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/dashboard/clients')}
        >
          <FaArrowLeft /> Back to Clients
        </button>
        <div className={styles.actions}>
          <button 
            className={`${styles.actionButton} ${styles.saveButton}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <FaSave /> {isSubmitting ? 'Creating...' : 'Create Client'}
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => navigate('/dashboard/clients')}
            disabled={isSubmitting}
          >
            <FaTimes /> Cancel
          </button>
        </div>
      </div>
      
      <DashboardSection title="Create New Client">
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        
        {success && (
          <div className={styles.successMessage}>
            Client created successfully! Redirecting...
          </div>
        )}
        
        <form className={styles.createForm} onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <h3>Company Information</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="companyName">Company Name *</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={clientData.companyName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={clientData.website}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="industry">Industry</label>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  value={clientData.industry}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="size">Company Size</label>
                <select
                  id="size"
                  name="size"
                  value={clientData.size}
                  onChange={handleInputChange}
                >
                  <option value="">Select Size</option>
                  <option value="Small (1-49 employees)">Small (1-49 employees)</option>
                  <option value="Medium (50-250 employees)">Medium (50-250 employees)</option>
                  <option value="Large (250+ employees)">Large (250+ employees)</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h3>Contact Information</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="contactName">Contact Name *</label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={clientData.contactName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={clientData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={clientData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="owner">Assigned To</label>
                <input
                  type="text"
                  id="owner"
                  name="owner"
                  value={clientData.owner}
                  onChange={handleInputChange}
                  placeholder="Team member email"
                />
              </div>
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h3>Client Status</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={clientData.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="At Risk">At Risk</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={clientData.notes}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h3>Goals</h3>
            
            <div className={styles.goalsList}>
              {clientData.goals.map((goal, index) => (
                <div key={goal.id || index} className={styles.goalItem}>
                  <div className={styles.goalHeader}>
                    <h4>{goal.title}</h4>
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => handleRemoveGoal(goal.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <p>{goal.description}</p>
                  <div className={styles.goalMetrics}>
                    <span>Target: {goal.target}</span>
                    <span>Current: {goal.current}</span>
                    <span>Progress: {goal.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.addItemForm}>
              <h4>Add New Goal</h4>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="goalTitle">Title</label>
                  <input
                    type="text"
                    id="goalTitle"
                    name="title"
                    value={newGoal.title}
                    onChange={handleGoalInputChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="goalDescription">Description</label>
                  <input
                    type="text"
                    id="goalDescription"
                    name="description"
                    value={newGoal.description}
                    onChange={handleGoalInputChange}
                  />
                </div>
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="goalTarget">Target</label>
                  <input
                    type="text"
                    id="goalTarget"
                    name="target"
                    value={newGoal.target}
                    onChange={handleGoalInputChange}
                    placeholder="e.g. $1,000,000"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="goalCurrent">Current</label>
                  <input
                    type="text"
                    id="goalCurrent"
                    name="current"
                    value={newGoal.current}
                    onChange={handleGoalInputChange}
                    placeholder="e.g. $250,000"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="goalProgress">Progress (%)</label>
                  <input
                    type="number"
                    id="goalProgress"
                    name="progress"
                    value={newGoal.progress}
                    onChange={handleGoalInputChange}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              
              <button
                type="button"
                className={styles.addButton}
                onClick={handleAddGoal}
                disabled={!newGoal.title}
              >
                <FaPlus /> Add Goal
              </button>
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h3>Milestones</h3>
            
            <div className={styles.milestonesList}>
              {clientData.milestones.map((milestone, index) => (
                <div key={milestone.id || index} className={styles.milestoneItem}>
                  <div className={styles.milestoneHeader}>
                    <h4>{milestone.title}</h4>
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => handleRemoveMilestone(milestone.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <p>{milestone.description}</p>
                  <div className={styles.milestoneDetails}>
                    <span className={`${styles.milestoneStatus} ${styles[milestone.status]}`}>
                      {milestone.status}
                    </span>
                    <span className={styles.milestoneDate}>
                      {milestone.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.addItemForm}>
              <h4>Add New Milestone</h4>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="milestoneTitle">Title</label>
                  <input
                    type="text"
                    id="milestoneTitle"
                    name="title"
                    value={newMilestone.title}
                    onChange={handleMilestoneInputChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="milestoneDescription">Description</label>
                  <input
                    type="text"
                    id="milestoneDescription"
                    name="description"
                    value={newMilestone.description}
                    onChange={handleMilestoneInputChange}
                  />
                </div>
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="milestoneStatus">Status</label>
                  <select
                    id="milestoneStatus"
                    name="status"
                    value={newMilestone.status}
                    onChange={handleMilestoneInputChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="milestoneDate">Target Date</label>
                  <input
                    type="date"
                    id="milestoneDate"
                    name="date"
                    value={newMilestone.date}
                    onChange={handleMilestoneInputChange}
                  />
                </div>
              </div>
              
              <button
                type="button"
                className={styles.addButton}
                onClick={handleAddMilestone}
                disabled={!newMilestone.title}
              >
                <FaPlus /> Add Milestone
              </button>
            </div>
          </div>
        </form>
      </DashboardSection>
    </div>
  );
};

export default ClientCreate;
