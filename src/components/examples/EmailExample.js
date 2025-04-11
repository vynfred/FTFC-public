import React, { useState } from 'react';
import { sendCustomEmail, EMAIL_TYPES } from '../../services/emailService';

/**
 * Example component demonstrating email functionality
 */
const EmailExample = () => {
  const [email, setEmail] = useState('');
  const [emailType, setEmailType] = useState(EMAIL_TYPES.WELCOME);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // Prepare email data based on selected type
      let emailData = {};
      
      switch (emailType) {
        case EMAIL_TYPES.WELCOME:
          emailData = { name };
          break;
        case EMAIL_TYPES.MEETING_SCHEDULED:
          emailData = {
            meetingTitle: 'Example Meeting',
            meetingDate: 'Monday, January 1, 2024',
            meetingTime: '10:00 AM',
            duration: 60,
            location: 'Virtual',
            meetingLink: 'https://meet.google.com/example',
            calendarLink: 'https://calendar.google.com/example'
          };
          break;
        case EMAIL_TYPES.DOCUMENT_UPLOADED:
          emailData = {
            documentName: 'Example Document.pdf',
            uploadedBy: 'John Doe',
            uploadDate: 'January 1, 2024',
            documentLink: 'https://ftfc-start.web.app/documents/example'
          };
          break;
        default:
          emailData = { name };
      }
      
      // Send email
      const response = await sendCustomEmail(email, emailType, emailData);
      setResult(response);
    } catch (err) {
      console.error('Error sending email:', err);
      setError(err.message || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Send Test Email</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Recipient Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email Type</label>
          <select
            value={emailType}
            onChange={(e) => setEmailType(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            {Object.entries(EMAIL_TYPES).map(([key, value]) => (
              <option key={key} value={value}>
                {key.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
        
        {emailType === EMAIL_TYPES.WELCOME && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Recipient Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Sending...' : 'Send Email'}
        </button>
      </form>
      
      {result && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
          <p className="font-bold">Success!</p>
          <p>Email sent successfully.</p>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default EmailExample;
