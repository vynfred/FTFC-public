import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { addDoc, collection, getDocs, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase-config';
import styles from './DetailPages.module.css';

const ProposalCreate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [clients, setClients] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [proposalData, setProposalData] = useState({
    title: '',
    clientId: '',
    clientName: '',
    leadId: '',
    leadName: '',
    value: '',
    status: 'Draft',
    validUntil: '',
    description: '',
    services: [],
    terms: '',
    notes: ''
  });
  
  // New service state
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    quantity: 1,
    price: 0
  });
  
  // Fetch clients and leads for selection
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch clients
        const clientsQuery = query(collection(db, 'clients'));
        const clientsSnapshot = await getDocs(clientsQuery);
        const clientsList = clientsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setClients(clientsList);
        
        // Fetch leads
        const leadsQuery = query(collection(db, 'leads'));
        const leadsSnapshot = await getDocs(leadsQuery);
        const leadsList = leadsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLeads(leadsList);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProposalData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle client selection
  const handleClientSelect = (e) => {
    const clientId = e.target.value;
    if (!clientId) {
      setProposalData(prev => ({
        ...prev,
        clientId: '',
        clientName: ''
      }));
      return;
    }
    
    const selectedClient = clients.find(client => client.id === clientId);
    if (selectedClient) {
      setProposalData(prev => ({
        ...prev,
        clientId,
        clientName: selectedClient.companyName || `${selectedClient.firstName} ${selectedClient.lastName}`,
        leadId: '',
        leadName: ''
      }));
    }
  };
  
  // Handle lead selection
  const handleLeadSelect = (e) => {
    const leadId = e.target.value;
    if (!leadId) {
      setProposalData(prev => ({
        ...prev,
        leadId: '',
        leadName: ''
      }));
      return;
    }
    
    const selectedLead = leads.find(lead => lead.id === leadId);
    if (selectedLead) {
      setProposalData(prev => ({
        ...prev,
        leadId,
        leadName: selectedLead.companyName || `${selectedLead.firstName} ${selectedLead.lastName}`,
        clientId: '',
        clientName: ''
      }));
    }
  };
  
  // Handle new service input change
  const handleServiceInputChange = (e) => {
    const { name, value } = e.target;
    setNewService(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? parseFloat(value) : value
    }));
  };
  
  // Handle adding service
  const handleAddService = () => {
    if (!newService.name) return;
    
    setProposalData(prev => ({
      ...prev,
      services: [...prev.services, { ...newService, id: Date.now().toString() }]
    }));
    
    // Reset new service form
    setNewService({
      name: '',
      description: '',
      quantity: 1,
      price: 0
    });
  };
  
  // Handle removing service
  const handleRemoveService = (id) => {
    setProposalData(prev => ({
      ...prev,
      services: prev.services.filter(service => service.id !== id)
    }));
  };
  
  // Calculate total value
  const calculateTotal = () => {
    return proposalData.services.reduce((total, service) => {
      return total + (service.quantity * service.price);
    }, 0);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!proposalData.title || (!proposalData.clientId && !proposalData.leadId)) {
      setError('Please fill in all required fields and add at least one recipient (client or lead)');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Calculate total value
      const totalValue = calculateTotal();
      
      // Format proposal data
      const formattedProposal = {
        ...proposalData,
        value: totalValue,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      };
      
      // Create proposal in Firestore
      const docRef = await addDoc(collection(db, 'proposals'), formattedProposal);
      
      setSuccess(true);
      
      // Redirect to proposal detail page after a short delay
      setTimeout(() => {
        navigate(`/dashboard/proposals/${docRef.id}`);
      }, 1500);
    } catch (err) {
      console.error('Error creating proposal:', err);
      setError(`Error creating proposal: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={styles.detailPage}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/dashboard')}
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
        <div className={styles.actions}>
          <button 
            className={`${styles.actionButton} ${styles.saveButton}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <FaSave /> {isSubmitting ? 'Creating...' : 'Create Proposal'}
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => navigate('/dashboard')}
            disabled={isSubmitting}
          >
            <FaTimes /> Cancel
          </button>
        </div>
      </div>
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      {success ? (
        <div className={styles.successMessage}>
          <h3>Proposal Created Successfully!</h3>
          <p>Redirecting to proposal details...</p>
        </div>
      ) : (
        <form className={styles.createForm} onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <h3>Proposal Details</h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="title">Proposal Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={proposalData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="clientId">Client</label>
                <select
                  id="clientId"
                  value={proposalData.clientId}
                  onChange={handleClientSelect}
                  disabled={!!proposalData.leadId || loading}
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.companyName || `${client.firstName} ${client.lastName}`}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="leadId">Lead</label>
                <select
                  id="leadId"
                  value={proposalData.leadId}
                  onChange={handleLeadSelect}
                  disabled={!!proposalData.clientId || loading}
                >
                  <option value="">Select a lead</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id}>
                      {lead.companyName || `${lead.firstName} ${lead.lastName}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={proposalData.status}
                  onChange={handleInputChange}
                >
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Viewed">Viewed</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="validUntil">Valid Until</label>
                <input
                  type="date"
                  id="validUntil"
                  name="validUntil"
                  value={proposalData.validUntil}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={proposalData.description}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h3>Services</h3>
            
            {proposalData.services.length > 0 && (
              <div className={styles.servicesTable}>
                <div className={styles.servicesHeader}>
                  <div className={styles.serviceNameHeader}>Service</div>
                  <div className={styles.serviceDescriptionHeader}>Description</div>
                  <div className={styles.serviceQuantityHeader}>Qty</div>
                  <div className={styles.servicePriceHeader}>Price</div>
                  <div className={styles.serviceTotalHeader}>Total</div>
                  <div className={styles.serviceActionsHeader}></div>
                </div>
                
                {proposalData.services.map(service => (
                  <div key={service.id} className={styles.serviceRow}>
                    <div className={styles.serviceName}>{service.name}</div>
                    <div className={styles.serviceDescription}>{service.description}</div>
                    <div className={styles.serviceQuantity}>{service.quantity}</div>
                    <div className={styles.servicePrice}>${service.price.toFixed(2)}</div>
                    <div className={styles.serviceTotal}>${(service.quantity * service.price).toFixed(2)}</div>
                    <div className={styles.serviceActions}>
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => handleRemoveService(service.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className={styles.servicesTotalRow}>
                  <div className={styles.servicesTotalLabel}>Total</div>
                  <div className={styles.servicesTotalValue}>${calculateTotal().toFixed(2)}</div>
                </div>
              </div>
            )}
            
            <div className={styles.addServiceSection}>
              <h4>Add Service</h4>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="serviceName">Service Name</label>
                  <input
                    type="text"
                    id="serviceName"
                    name="name"
                    value={newService.name}
                    onChange={handleServiceInputChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="serviceDescription">Description</label>
                  <input
                    type="text"
                    id="serviceDescription"
                    name="description"
                    value={newService.description}
                    onChange={handleServiceInputChange}
                  />
                </div>
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="serviceQuantity">Quantity</label>
                  <input
                    type="number"
                    id="serviceQuantity"
                    name="quantity"
                    min="1"
                    value={newService.quantity}
                    onChange={handleServiceInputChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="servicePrice">Price ($)</label>
                  <input
                    type="number"
                    id="servicePrice"
                    name="price"
                    min="0"
                    step="0.01"
                    value={newService.price}
                    onChange={handleServiceInputChange}
                  />
                </div>
              </div>
              
              <button
                type="button"
                className={styles.addButton}
                onClick={handleAddService}
                disabled={!newService.name}
              >
                <FaPlus /> Add Service
              </button>
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h3>Terms and Conditions</h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="terms">Terms</label>
              <textarea
                id="terms"
                name="terms"
                rows="4"
                value={proposalData.terms}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h3>Additional Notes</h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                rows="4"
                value={proposalData.notes}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProposalCreate;
