import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaSave, FaTrash, FaChartLine } from 'react-icons/fa';
import DashboardSection from '../shared/DashboardSection';
import styles from './CampaignDetail.module.css';

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCampaign, setEditedCampaign] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        // In a real app, this would fetch from Firebase
        // For now, we'll use mock data
        const mockCampaign = {
          id: parseInt(id),
          name: 'Summer Sale',
          status: 'Active',
          description: 'Promotional campaign for summer products with special discounts and offers.',
          startDate: '2024-06-01',
          endDate: '2024-08-31',
          budget: 5000,
          spent: 2750,
          leads: 142,
          conversions: 28,
          roi: 3.2,
          channels: ['Email', 'Social Media', 'Google Ads'],
          targetAudience: 'Small business owners, age 25-45',
          goals: 'Generate 200 leads, achieve 30% conversion rate',
          createdBy: 'John Doe',
          createdDate: '2024-05-15',
          lastUpdated: '2024-06-10',
          metrics: {
            impressions: 25000,
            clicks: 3200,
            ctr: 12.8,
            cpc: 0.86,
            conversionRate: 4.4
          },
          assets: [
            { name: 'Summer_Banner_1.jpg', type: 'Image', url: 'https://via.placeholder.com/800x200' },
            { name: 'Summer_Promo_Email.html', type: 'Email Template', url: '#' },
            { name: 'Summer_Sale_Video.mp4', type: 'Video', url: '#' }
          ]
        };
        
        setCampaign(mockCampaign);
        setEditedCampaign(mockCampaign);
      } catch (err) {
        console.error('Error fetching campaign:', err);
        setError('Failed to load campaign');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // In a real app, this would update the campaign in Firebase
      // For now, we'll just update our local state
      setCampaign(editedCampaign);
      setIsEditing(false);
      // Show success message or notification
    } catch (err) {
      console.error('Error saving campaign:', err);
      // Show error message
    }
  };

  const handleCancel = () => {
    setEditedCampaign(campaign);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        // In a real app, this would delete the campaign from Firebase
        // For now, we'll just navigate back
        navigate('/dashboard/marketing');
        // Show success message or notification
      } catch (err) {
        console.error('Error deleting campaign:', err);
        // Show error message
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCampaign(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className={styles.campaignDetail}>
        <div className={styles.loading}>Loading campaign...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.campaignDetail}>
        <div className={styles.error}>{error}</div>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/dashboard/marketing')}
        >
          <FaArrowLeft /> Back to Marketing
        </button>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className={styles.campaignDetail}>
        <div className={styles.error}>Campaign not found</div>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/dashboard/marketing')}
        >
          <FaArrowLeft /> Back to Marketing
        </button>
      </div>
    );
  }

  return (
    <div className={styles.campaignDetail}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/dashboard/marketing')}
        >
          <FaArrowLeft /> Back to Marketing
        </button>
        <div className={styles.actions}>
          {isEditing ? (
            <>
              <button 
                className={`${styles.actionButton} ${styles.saveButton}`}
                onClick={handleSave}
              >
                <FaSave /> Save
              </button>
              <button 
                className={styles.actionButton}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button 
                className={styles.actionButton}
                onClick={handleEdit}
              >
                <FaEdit /> Edit
              </button>
              <button 
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={handleDelete}
              >
                <FaTrash /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      <DashboardSection title={isEditing ? 'Edit Campaign' : 'Campaign Details'}>
        <div className={styles.campaignContent}>
          {isEditing ? (
            <div className={styles.editForm}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Campaign Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editedCampaign.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={editedCampaign.status}
                    onChange={handleInputChange}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="budget">Budget ($)</label>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={editedCampaign.budget}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={editedCampaign.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={editedCampaign.startDate}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="endDate">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={editedCampaign.endDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="channels">Channels (comma-separated)</label>
                <input
                  type="text"
                  id="channels"
                  name="channels"
                  value={editedCampaign.channels.join(', ')}
                  onChange={(e) => {
                    const channelsArray = e.target.value.split(',').map(channel => channel.trim());
                    setEditedCampaign(prev => ({
                      ...prev,
                      channels: channelsArray
                    }));
                  }}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="targetAudience">Target Audience</label>
                <textarea
                  id="targetAudience"
                  name="targetAudience"
                  value={editedCampaign.targetAudience}
                  onChange={handleInputChange}
                  rows="2"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="goals">Goals</label>
                <textarea
                  id="goals"
                  name="goals"
                  value={editedCampaign.goals}
                  onChange={handleInputChange}
                  rows="2"
                />
              </div>
            </div>
          ) : (
            <>
              <div className={styles.campaignHeader}>
                <h1 className={styles.campaignTitle}>{campaign.name}</h1>
                <div className={styles.campaignMeta}>
                  <span className={`${styles.campaignStatus} ${styles[`status${campaign.status}`]}`}>{campaign.status}</span>
                  <span className={styles.campaignDate}>
                    {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className={styles.campaignDescription}>
                <p>{campaign.description}</p>
              </div>
              
              <div className={styles.campaignStats}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>${campaign.budget.toLocaleString()}</div>
                  <div className={styles.statLabel}>Budget</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>${campaign.spent.toLocaleString()}</div>
                  <div className={styles.statLabel}>Spent</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{campaign.leads}</div>
                  <div className={styles.statLabel}>Leads</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{campaign.conversions}</div>
                  <div className={styles.statLabel}>Conversions</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{campaign.roi}x</div>
                  <div className={styles.statLabel}>ROI</div>
                </div>
              </div>
              
              <div className={styles.campaignDetails}>
                <div className={styles.detailSection}>
                  <h3 className={styles.sectionTitle}>Campaign Details</h3>
                  <div className={styles.detailGrid}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Channels:</span>
                      <div className={styles.channelTags}>
                        {campaign.channels.map((channel, index) => (
                          <span key={index} className={styles.channelTag}>{channel}</span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Target Audience:</span>
                      <span className={styles.detailValue}>{campaign.targetAudience}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Goals:</span>
                      <span className={styles.detailValue}>{campaign.goals}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Created By:</span>
                      <span className={styles.detailValue}>{campaign.createdBy}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Created Date:</span>
                      <span className={styles.detailValue}>{new Date(campaign.createdDate).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Last Updated:</span>
                      <span className={styles.detailValue}>{new Date(campaign.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.detailSection}>
                  <h3 className={styles.sectionTitle}>Performance Metrics</h3>
                  <div className={styles.metricsGrid}>
                    <div className={styles.metricCard}>
                      <div className={styles.metricValue}>{campaign.metrics.impressions.toLocaleString()}</div>
                      <div className={styles.metricLabel}>Impressions</div>
                    </div>
                    <div className={styles.metricCard}>
                      <div className={styles.metricValue}>{campaign.metrics.clicks.toLocaleString()}</div>
                      <div className={styles.metricLabel}>Clicks</div>
                    </div>
                    <div className={styles.metricCard}>
                      <div className={styles.metricValue}>{campaign.metrics.ctr}%</div>
                      <div className={styles.metricLabel}>CTR</div>
                    </div>
                    <div className={styles.metricCard}>
                      <div className={styles.metricValue}>${campaign.metrics.cpc}</div>
                      <div className={styles.metricLabel}>CPC</div>
                    </div>
                    <div className={styles.metricCard}>
                      <div className={styles.metricValue}>{campaign.metrics.conversionRate}%</div>
                      <div className={styles.metricLabel}>Conv. Rate</div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.detailSection}>
                  <h3 className={styles.sectionTitle}>Campaign Assets</h3>
                  <div className={styles.assetsTable}>
                    <div className={styles.assetHeader}>
                      <div className={styles.assetCell}>Name</div>
                      <div className={styles.assetCell}>Type</div>
                      <div className={styles.assetCell}>Actions</div>
                    </div>
                    {campaign.assets.map((asset, index) => (
                      <div key={index} className={styles.assetRow}>
                        <div className={styles.assetCell}>{asset.name}</div>
                        <div className={styles.assetCell}>{asset.type}</div>
                        <div className={styles.assetCell}>
                          <a href={asset.url} target="_blank" rel="noopener noreferrer" className={styles.assetLink}>
                            View
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DashboardSection>
    </div>
  );
};

export default CampaignDetail;
