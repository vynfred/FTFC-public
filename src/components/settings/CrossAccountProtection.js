import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaCheck, FaTimes, FaSync, FaExclamationTriangle } from 'react-icons/fa';
import { functions } from '../../firebase-config';
import { httpsCallable } from 'firebase/functions';

/**
 * Cross-Account Protection Settings Component
 * 
 * This component allows administrators to configure and manage
 * Google's Cross-Account Protection (RISC) integration.
 */
const CrossAccountProtection = () => {
  const [status, setStatus] = useState('unknown');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [testResult, setTestResult] = useState(null);

  // Function to register the RISC endpoint
  const registerEndpoint = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const registerRiscEndpoint = httpsCallable(functions, 'registerRiscEndpoint');
      const result = await registerRiscEndpoint();
      
      if (result.data.success) {
        setStatus('configured');
        setEndpoint(result.data.endpoint);
        setMessage('Cross-Account Protection has been successfully configured.');
      } else {
        setError('Failed to configure Cross-Account Protection.');
      }
    } catch (err) {
      console.error('Error registering RISC endpoint:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to test the RISC event stream
  const testEventStream = async () => {
    setLoading(true);
    setTestResult(null);
    setError('');
    
    try {
      const testRiscEventStream = httpsCallable(functions, 'testRiscEventStream');
      const result = await testRiscEventStream();
      
      if (result.data.success) {
        setTestResult({
          success: true,
          state: result.data.state,
          timestamp: new Date().toISOString()
        });
        setMessage('Test verification event sent successfully. Check your logs to confirm receipt.');
      } else {
        setTestResult({
          success: false,
          error: 'Failed to send test event'
        });
      }
    } catch (err) {
      console.error('Error testing RISC event stream:', err);
      setError(`Error: ${err.message}`);
      setTestResult({
        success: false,
        error: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <FaShieldAlt className="text-blue-600 text-2xl mr-2" />
        <h2 className="text-xl font-semibold">Cross-Account Protection</h2>
      </div>
      
      <p className="text-gray-600 mb-4">
        Cross-Account Protection improves security by receiving notifications from Google when 
        users' Google Accounts experience security events, such as being compromised or disabled.
      </p>
      
      <div className="bg-gray-50 p-4 rounded-md mb-4">
        <h3 className="font-medium mb-2">Status</h3>
        <div className="flex items-center">
          {status === 'configured' ? (
            <>
              <FaCheck className="text-green-500 mr-2" />
              <span className="text-green-700">Configured</span>
            </>
          ) : status === 'unknown' ? (
            <>
              <FaExclamationTriangle className="text-yellow-500 mr-2" />
              <span className="text-yellow-700">Not Configured</span>
            </>
          ) : (
            <>
              <FaTimes className="text-red-500 mr-2" />
              <span className="text-red-700">Not Configured</span>
            </>
          )}
        </div>
        
        {endpoint && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">Endpoint: {endpoint}</p>
          </div>
        )}
      </div>
      
      <div className="flex flex-col space-y-4">
        <button
          onClick={registerEndpoint}
          disabled={loading || status === 'configured'}
          className={`flex items-center justify-center px-4 py-2 rounded-md ${
            loading || status === 'configured'
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? (
            <>
              <FaSync className="animate-spin mr-2" />
              Configuring...
            </>
          ) : status === 'configured' ? (
            'Already Configured'
          ) : (
            'Configure Cross-Account Protection'
          )}
        </button>
        
        {status === 'configured' && (
          <button
            onClick={testEventStream}
            disabled={loading}
            className={`flex items-center justify-center px-4 py-2 rounded-md ${
              loading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {loading ? (
              <>
                <FaSync className="animate-spin mr-2" />
                Testing...
              </>
            ) : (
              'Test Configuration'
            )}
          </button>
        )}
      </div>
      
      {message && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}
      
      {testResult && (
        <div className={`mt-4 p-3 rounded-md ${
          testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <h4 className="font-medium mb-1">Test Result</h4>
          {testResult.success ? (
            <>
              <p>Verification event sent successfully.</p>
              <p className="text-sm">State: {testResult.state}</p>
              <p className="text-sm">Timestamp: {testResult.timestamp}</p>
            </>
          ) : (
            <p>Failed to send verification event: {testResult.error}</p>
          )}
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-600">
        <h4 className="font-medium mb-1">How it works</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>When a user's Google Account experiences a security event (like being compromised), Google sends a notification to your app.</li>
          <li>Your app can then take appropriate action, such as signing the user out of all sessions or temporarily disabling their account.</li>
          <li>This helps prevent security breaches that could occur through compromised Google Accounts.</li>
        </ul>
      </div>
    </div>
  );
};

export default CrossAccountProtection;
