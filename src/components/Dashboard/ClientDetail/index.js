import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { getClientById, updateClient } from '../../../services/ClientService';
import { completeMilestone, createMilestone, deleteMilestone, MILESTONE_STATUS, updateMilestone } from '../../../services/MilestoneService';
import DashboardSection from '../../shared/DashboardSection';
import styles from '../DetailPages.module.css';
import ClientDocuments from './ClientDocuments';
import ClientHeader from './ClientHeader';
import ClientMeetings from './ClientMeetings';
import ClientMilestones from './ClientMilestones';
import ClientOverview from './ClientOverview';
import ClientTabs from './ClientTabs';

/**
 * Client detail page component
 * Refactored to use smaller, focused components
 */
const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Milestone state
  const [milestones, setMilestones] = useState([]);
  const [milestonesLoading, setMilestonesLoading] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState(null);
  const [milestoneError, setMilestoneError] = useState(null);
  const [isSubmittingMilestone, setIsSubmittingMilestone] = useState(false);

  // Toast notifications
  const { showSuccess, showError } = useToast();

  // Mock documents data
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Client Contract.pdf', type: 'PDF', size: '2.4 MB', uploadDate: '2024-02-10', uploadedBy: 'John Doe' },
    { id: 2, name: 'Project Proposal.docx', type: 'DOCX', size: '1.8 MB', uploadDate: '2024-01-25', uploadedBy: 'Jane Smith' },
    { id: 3, name: 'Requirements Specification.xlsx', type: 'XLSX', size: '3.2 MB', uploadDate: '2024-02-15', uploadedBy: 'John Doe' }
  ]);

  // Mock meetings data
  const [meetings, setMeetings] = useState([
    { id: 1, title: 'Project Kickoff Meeting', date: '2024-02-20', time: '10:00 AM', attendees: ['John Doe', 'Jane Smith', 'Client Team'], notes: 'Discussed project timeline and deliverables' },
    { id: 2, title: 'Weekly Progress Update', date: '2024-02-27', time: '11:00 AM', attendees: ['John Doe', 'Client Team'], notes: 'Reviewed progress on phase 1 tasks' },
    { id: 3, title: 'Design Review', date: '2024-03-05', time: '2:00 PM', attendees: ['Jane Smith', 'Design Team', 'Client Team'], notes: 'Presented initial designs and gathered feedback' }
  ]);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);

        // Fetch client data from Firestore
        const clientData = await getClientById(id);

        if (!clientData) {
          throw new Error('Client not found');
        }

        setClient(clientData);
        setEditedClient(clientData);

        // Set milestones from client data
        if (clientData.milestones && Array.isArray(clientData.milestones)) {
          setMilestones(clientData.milestones);
        }
      } catch (err) {
        console.error('Error fetching client:', err);
        setError(`Failed to load client details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Save to Firestore
      await updateClient(id, editedClient);

      // Update local state
      setClient(editedClient);
      setIsEditing(false);

      showSuccess('Client updated successfully');
    } catch (err) {
      console.error('Error updating client:', err);
      showError(`Error updating client: ${err.message}`);
    }
  };

  const handleCancel = () => {
    setEditedClient(client);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedClient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Milestone functions
  const handleAddMilestone = () => {
    setCurrentMilestone(null);
    setMilestoneError(null);
    setShowMilestoneModal(true);
  };

  const handleEditMilestone = (milestone) => {
    setCurrentMilestone(milestone);
    setMilestoneError(null);
    setShowMilestoneModal(true);
  };

  const handleCloseMilestoneModal = () => {
    setShowMilestoneModal(false);
    setCurrentMilestone(null);
    setMilestoneError(null);
  };

  const handleMilestoneSubmit = async (formData) => {
    setIsSubmittingMilestone(true);
    setMilestoneError(null);

    try {
      if (currentMilestone) {
        // Update existing milestone
        const updatedMilestone = await updateMilestone('client', id, currentMilestone.id, formData);

        // Update local state
        setMilestones(prevMilestones =>
          prevMilestones.map(m => m.id === currentMilestone.id ? updatedMilestone : m)
        );

        showSuccess('Milestone updated successfully');
      } else {
        // Create new milestone
        const newMilestone = await createMilestone(formData, 'client', id);

        // Update local state
        setMilestones(prevMilestones => [...prevMilestones, newMilestone]);

        showSuccess('Milestone created successfully');
      }

      // Close the modal
      handleCloseMilestoneModal();
    } catch (err) {
      console.error('Error saving milestone:', err);
      setMilestoneError(`Error saving milestone: ${err.message}`);
      showError(`Error saving milestone: ${err.message}`);
    } finally {
      setIsSubmittingMilestone(false);
    }
  };

  const handleDeleteMilestone = async (milestone) => {
    if (!window.confirm(`Are you sure you want to delete the milestone "${milestone.title}"?`)) {
      return;
    }

    try {
      await deleteMilestone('client', id, milestone.id);

      // Update local state
      setMilestones(prevMilestones => prevMilestones.filter(m => m.id !== milestone.id));

      showSuccess('Milestone deleted successfully');
    } catch (err) {
      console.error('Error deleting milestone:', err);
      showError(`Error deleting milestone: ${err.message}`);
    }
  };

  const handleMilestoneStatusChange = async (milestone, newStatus) => {
    try {
      const isCompleting = newStatus === MILESTONE_STATUS.COMPLETED && milestone.status !== MILESTONE_STATUS.COMPLETED;

      let updatedMilestone;

      if (isCompleting) {
        // Complete the milestone
        updatedMilestone = await completeMilestone('client', id, milestone.id, {
          completedAt: new Date().toISOString()
        });

        showSuccess(`Milestone "${milestone.title}" marked as completed`);
      } else {
        // Update the status
        updatedMilestone = await updateMilestone('client', id, milestone.id, {
          status: newStatus
        });

        showSuccess(`Milestone status updated to "${newStatus}"`);
      }

      // Update local state
      setMilestones(prevMilestones =>
        prevMilestones.map(m => m.id === milestone.id ? updatedMilestone : m)
      );
    } catch (err) {
      console.error('Error updating milestone status:', err);
      showError(`Error updating milestone status: ${err.message}`);
    }
  };

  const handleScheduleMeeting = () => {
    // In a real app, this would open a meeting scheduler
    console.log('Schedule meeting for client:', client.name);
  };

  const handleUploadDocument = () => {
    // In a real app, this would open a file upload dialog
    console.log('Upload document for client:', client.name);
  };

  if (loading) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.loading}>Loading client details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.error}>{error}</div>
        <button
          className={styles.backButton}
          onClick={() => navigate('/dashboard/clients')}
        >
          <FaArrowLeft /> Back to Clients
        </button>
      </div>
    );
  }

  if (!client) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.error}>Client not found</div>
        <button
          className={styles.backButton}
          onClick={() => navigate('/dashboard/clients')}
        >
          <FaArrowLeft /> Back to Clients
        </button>
      </div>
    );
  }

  return (
    <div className={styles.detailPage}>
      <ClientHeader
        client={client}
        isEditing={isEditing}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onScheduleMeeting={handleScheduleMeeting}
        onUploadDocument={handleUploadDocument}
      />

      <DashboardSection title={client.name}>
        <div className={styles.clientStatus}>
          <span className={`${styles.statusBadge} ${styles[client.status.toLowerCase()]}`}>
            {client.status}
          </span>
          <span className={styles.assignedTo}>Assigned to: {client.assignedTo}</span>
        </div>

        <div className={styles.tabsContainer}>
          <ClientTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className={styles.tabContent}>
            {activeTab === 'overview' && (
              <ClientOverview
                client={client}
                isEditing={isEditing}
                editedClient={editedClient}
                onInputChange={handleInputChange}
              />
            )}

            {activeTab === 'milestones' && (
              <ClientMilestones
                milestones={milestones}
                milestonesLoading={milestonesLoading}
                showMilestoneModal={showMilestoneModal}
                currentMilestone={currentMilestone}
                isSubmittingMilestone={isSubmittingMilestone}
                milestoneError={milestoneError}
                onAddMilestone={handleAddMilestone}
                onEditMilestone={handleEditMilestone}
                onDeleteMilestone={handleDeleteMilestone}
                onStatusChange={handleMilestoneStatusChange}
                onCloseMilestoneModal={handleCloseMilestoneModal}
                onSubmitMilestone={handleMilestoneSubmit}
              />
            )}

            {activeTab === 'documents' && (
              <ClientDocuments
                documents={documents}
                onUploadDocument={handleUploadDocument}
              />
            )}

            {activeTab === 'meetings' && (
              <ClientMeetings
                meetings={meetings}
                onScheduleMeeting={handleScheduleMeeting}
              />
            )}
          </div>
        </div>
      </DashboardSection>
    </div>
  );
};

export default ClientDetail;
