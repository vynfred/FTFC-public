import React, { useState, useEffect } from 'react';
import { FaCheck, FaExclamationCircle, FaSlack, FaSpinner } from 'react-icons/fa';
import { 
  getSlackConfig, 
  saveSlackConfig, 
  testSlackWebhook,
  NOTIFICATION_TYPES
} from '../../services/slackIntegration';
import styles from './IntegrationSettings.module.css';

/**
 * Slack Integration Settings Component
 * 
 * This component allows administrators to configure Slack integration settings.
 */
const SlackIntegrationSettings = () => {
  const [config, setConfig] = useState({
    enabled: false,
    webhookUrl: '',
    defaultChannel: 'general',
    channels: {},
    notificationTypes: {}
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [testResult, setTestResult] = useState(null);
  
  // Notification type options
  const notificationTypeOptions = [
    { id: NOTIFICATION_TYPES.NEW_LEAD, label: 'New Lead Received' },
    { id: NOTIFICATION_TYPES.LEAD_UPDATED, label: 'Lead Updated' },
    { id: NOTIFICATION_TYPES.NEW_CLIENT, label: 'New Client Added' },
    { id: NOTIFICATION_TYPES.NEW_INVESTOR, label: 'New Investor Added' },
    { id: NOTIFICATION_TYPES.NEW_PARTNER, label: 'New Partner Added' },
    { id: NOTIFICATION_TYPES.MEETING_SCHEDULED, label: 'Meeting Scheduled' },
    { id: NOTIFICATION_TYPES.MEETING_CANCELED, label: 'Meeting Canceled' },
    { id: NOTIFICATION_TYPES.DOCUMENT_UPLOADED, label: 'Document Uploaded' },
    { id: NOTIFICATION_TYPES.MILESTONE_COMPLETED, label: 'Milestone Completed' },
    { id: NOTIFICATION_TYPES.TRANSCRIPT_CREATED, label: 'Meeting Transcript Available' },
    { id: NOTIFICATION_TYPES.ACTION_ITEM_CREATED, label: 'Action Item Created' },
    { id: NOTIFICATION_TYPES.ACTION_ITEM_COMPLETED, label: 'Action Item Completed' },
    { id: NOTIFICATION_TYPES.REFERRAL_RECEIVED, label: 'Referral Received' }
  ];
  
  // Load Slack configuration
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const slackConfig = await getSlackConfig();
        setConfig(slackConfig);
      } catch (err) {
        console.error('Error loading Slack config:', err);
        setError('Failed to load Slack configuration');
      } finally {
        setLoading(false);
      }
    };
    
    loadConfig();
  }, []);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setConfig(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle notification type toggle
  const handleNotificationTypeToggle = (typeId) => {
    setConfig(prev => ({
      ...prev,
      notificationTypes: {
        ...prev.notificationTypes,
        [typeId]: !prev.notificationTypes[typeId]
      }
    }));
  };
  
  // Handle channel change for notification type
  const handleChannelChange = (typeId, value) => {
    setConfig(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [typeId]: value
      }
    }));
  };
  
  // Test Slack webhook
  const handleTestWebhook = async () => {
    try {
      setTesting(true);
      setTestResult(null);
      setError(null);
      
      if (!config.webhookUrl) {
        setError('Please enter a webhook URL');
        return;
      }
      
      const result = await testSlackWebhook(config.webhookUrl);
      
      if (result.success) {
        setTestResult({
          success: true,
          message: 'Webhook test successful! Check your Slack channel for the test message.'
        });
      } else {
        setTestResult({
          success: false,
          message: `Webhook test failed: ${result.error}`
        });
      }
    } catch (err) {
      console.error('Error testing webhook:', err);
      setTestResult({
        success: false,
        message: `Error: ${err.message}`
      });
    } finally {
      setTesting(false);
    }
  };
  
  // Save configuration
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      await saveSlackConfig(config);
      
      setSuccess('Slack configuration saved successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving Slack config:', err);
      setError(`Failed to save configuration: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.spinner} />
        <p>Loading Slack configuration...</p>
      </div>
    );
  }
  
  return (
    <div className={styles.integrationSettings}>
      <div className={styles.integrationHeader}>
        <FaSlack className={styles.integrationIcon} />
        <h2>Slack Integration</h2>
      </div>
      
      <p className={styles.integrationDescription}>
        Configure Slack notifications for important events in the FTFC application.
        Notifications will be sent to the specified Slack channels.
      </p>
      
      {error && (
        <div className={styles.errorMessage}>
          <FaExclamationCircle className={styles.errorIcon} />
          {error}
        </div>
      )}
      
      {success && (
        <div className={styles.successMessage}>
          <FaCheck className={styles.successIcon} />
          {success}
        </div>
      )}
      
      <div className={styles.formSection}>
        <div className={styles.formGroup}>
          <label className={styles.toggleLabel}>
            <span>Enable Slack Integration</span>
            <div className={styles.toggleSwitch}>
              <input
                type="checkbox"
                name="enabled"
                checked={config.enabled}
                onChange={handleInputChange}
              />
              <span className={styles.toggleSlider}></span>
            </div>
          </label>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="webhookUrl">Slack Webhook URL</label>
          <div className={styles.webhookInputGroup}>
            <input
              type="text"
              id="webhookUrl"
              name="webhookUrl"
              value={config.webhookUrl}
              onChange={handleInputChange}
              placeholder="https://hooks.slack.com/services/..."
              disabled={!config.enabled}
            />
            <button
              className={styles.testButton}
              onClick={handleTestWebhook}
              disabled={!config.enabled || !config.webhookUrl || testing}
            >
              {testing ? <FaSpinner className={styles.spinner} /> : 'Test'}
            </button>
          </div>
          <p className={styles.fieldHint}>
            Create a webhook URL in your Slack workspace by creating an app and adding an Incoming Webhook.
          </p>
          
          {testResult && (
            <div className={`${styles.testResult} ${testResult.success ? styles.testSuccess : styles.testError}`}>
              {testResult.success ? (
                <FaCheck className={styles.testResultIcon} />
              ) : (
                <FaExclamationCircle className={styles.testResultIcon} />
              )}
              {testResult.message}
            </div>
          )}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="defaultChannel">Default Channel</label>
          <input
            type="text"
            id="defaultChannel"
            name="defaultChannel"
            value={config.defaultChannel}
            onChange={handleInputChange}
            placeholder="general"
            disabled={!config.enabled}
          />
          <p className={styles.fieldHint}>
            The default channel to send notifications to if no specific channel is configured.
          </p>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h3>Notification Settings</h3>
        <p className={styles.sectionDescription}>
          Configure which events trigger Slack notifications and which channels they are sent to.
        </p>
        
        <div className={styles.notificationGrid}>
          <div className={styles.notificationHeader}>
            <span>Event</span>
            <span>Enabled</span>
            <span>Channel</span>
          </div>
          
          {notificationTypeOptions.map(option => (
            <div key={option.id} className={styles.notificationRow}>
              <span className={styles.notificationLabel}>{option.label}</span>
              <div className={styles.notificationToggle}>
                <input
                  type="checkbox"
                  id={`notification-${option.id}`}
                  checked={!!config.notificationTypes[option.id]}
                  onChange={() => handleNotificationTypeToggle(option.id)}
                  disabled={!config.enabled}
                />
                <label htmlFor={`notification-${option.id}`} className={styles.toggleSlider}></label>
              </div>
              <div className={styles.notificationChannel}>
                <input
                  type="text"
                  value={config.channels[option.id] || ''}
                  onChange={(e) => handleChannelChange(option.id, e.target.value)}
                  placeholder={config.defaultChannel}
                  disabled={!config.enabled || !config.notificationTypes[option.id]}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.formActions}>
        <button
          className={styles.saveButton}
          onClick={handleSave}
          disabled={saving || !config.enabled}
        >
          {saving ? <FaSpinner className={styles.spinner} /> : 'Save Configuration'}
        </button>
      </div>
    </div>
  );
};

export default SlackIntegrationSettings;
