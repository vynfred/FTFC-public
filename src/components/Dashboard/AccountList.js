import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { collection, getDocs, query, updateDoc, doc } from 'firebase/firestore';
import LoadingSpinner from '../LoadingSpinner';

function AccountList() {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const statusOptions = [
    'Initial Meeting Booked',
    'Initial Meeting Completed',
    'In Progress',
    'Close Won',
    'Close Lost',
    'Completed'
  ];

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const q = query(collection(db, 'leads'));
      const querySnapshot = await getDocs(q);
      const accountList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        status: doc.data().status || 'Initial Meeting Booked',
        lastContacted: doc.data().lastContacted?.toDate() || null
      }));
      setAccounts(accountList);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAccountStatus = async (accountId, newStatus) => {
    try {
      const accountRef = doc(db, 'leads', accountId);
      await updateDoc(accountRef, {
        status: newStatus,
        lastContacted: new Date()
      });
      fetchAccounts(); // Refresh the list
    } catch (error) {
      console.error('Error updating account status:', error);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="account-list">
      <h2>Lead Accounts</h2>
      <div className="account-grid">
        {accounts.map(account => (
          <div key={account.id} className={`account-card status-${account.status.toLowerCase().replace(/\s+/g, '-')}`}>
            <div className="account-header">
              <h3>{account.companyVision}</h3>
              <select
                value={account.status}
                onChange={(e) => updateAccountStatus(account.id, e.target.value)}
                className="status-select"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <p><strong>Industry:</strong> {account.industry}</p>
            <p><strong>Team Size:</strong> {account.teamSize}</p>
            <p><strong>Revenue Status:</strong> {account.revenueStatus}</p>
            {account.revenueStatus === 'post-revenue' && (
              <p><strong>Current ARR:</strong> {account.currentARR}</p>
            )}
            <p><strong>Capital Raised:</strong> {account.capitalRaised}</p>
            <p><strong>Target Raise:</strong> {account.targetRaise}</p>
            <p><strong>Stage:</strong> {account.preparationStage}</p>
            <p><strong>Last Contacted:</strong> {
              account.lastContacted 
                ? new Date(account.lastContacted).toLocaleDateString()
                : 'Not contacted yet'
            }</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AccountList; 