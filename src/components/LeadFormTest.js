import React from 'react';
import LeadForm from './LeadForm';

const LeadFormTest = () => {
  return (
    <div className="lead-form-test-container">
      <h1>Lead Intake Form Test</h1>
      <p>This page is for testing the enhanced lead intake form with improved validation and error handling.</p>
      
      <div className="form-container">
        <LeadForm />
      </div>
      
      <style jsx>{`
        .lead-form-test-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        
        h1 {
          text-align: center;
          margin-bottom: 10px;
        }
        
        p {
          text-align: center;
          margin-bottom: 40px;
          color: #4a5568;
        }
        
        .form-container {
          max-width: 800px;
          margin: 0 auto;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 30px;
        }
      `}</style>
    </div>
  );
};

export default LeadFormTest;
