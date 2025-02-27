import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { collection, addDoc, getDocs, query } from 'firebase/firestore';
import Papa from 'papaparse';

function InvestorList() {
  const [investors, setInvestors] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchInvestors();
  }, []);

  const fetchInvestors = async () => {
    const q = query(collection(db, 'investors'));
    const querySnapshot = await getDocs(q);
    const investorList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setInvestors(investorList);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          try {
            for (const investor of results.data) {
              await addDoc(collection(db, 'investors'), {
                name: investor.name,
                email: investor.email,
                firm: investor.firm,
                checkSize: investor.checkSize,
                tags: investor.tags?.split(',').map(tag => tag.trim()) || [],
                phone: investor.phone,
                notes: investor.notes
              });
            }
            fetchInvestors();
          } catch (error) {
            console.error('Error importing investors:', error);
          } finally {
            setIsUploading(false);
          }
        }
      });
    }
  };

  return (
    <div className="investor-list">
      <div className="controls">
        <h2>Investor List</h2>
        <div className="import-section">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <p className="help-text">
            Upload CSV with columns: name, email, firm, checkSize, tags, phone, notes
          </p>
        </div>
      </div>

      <div className="investor-grid">
        {investors.map(investor => (
          <div key={investor.id} className="investor-card">
            <h3>{investor.name}</h3>
            <p><strong>Firm:</strong> {investor.firm}</p>
            <p><strong>Check Size:</strong> {investor.checkSize}</p>
            <p><strong>Email:</strong> {investor.email}</p>
            <p><strong>Phone:</strong> {investor.phone}</p>
            <div className="tags">
              {investor.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            <p className="notes">{investor.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InvestorList; 