import React from 'react';
import InvestorForm from './InvestorForm';

const Investor = () => {
  return (
    <div className="investor-page">
      <div className="page-header">
        <h1>Become an Investor</h1>
        <p>Join our network of strategic investors supporting the next generation of innovative startups</p>
      </div>

      <section className="investor-benefits">
        <h2>Why Partner With Us</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <h3>Curated Deal Flow</h3>
            <p>Access to pre-vetted startups that have gone through our rigorous selection process</p>
          </div>
          <div className="benefit-card">
            <h3>Early Access</h3>
            <p>Be among the first to see promising investment opportunities in emerging markets</p>
          </div>
          <div className="benefit-card">
            <h3>Expert Due Diligence</h3>
            <p>Benefit from our comprehensive analysis and industry expertise</p>
          </div>
          <div className="benefit-card">
            <h3>Co-Investment Opportunities</h3>
            <p>Partner with other experienced investors in our network</p>
          </div>
        </div>
      </section>

      <section className="investment-process">
        <h2>Our Investment Process</h2>
        <div className="process-steps">
          <div className="step">
            <span className="step-number">1</span>
            <h3>Initial Screening</h3>
            <p>We carefully evaluate each startup based on market potential, team, and traction</p>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <h3>Due Diligence</h3>
            <p>Thorough analysis of business model, financials, and growth strategy</p>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <h3>Investment Committee</h3>
            <p>Presentation to our investment committee for final approval</p>
          </div>
          <div className="step">
            <span className="step-number">4</span>
            <h3>Deal Execution</h3>
            <p>Structured investment process with clear terms and documentation</p>
          </div>
        </div>
      </section>

      <section className="investor-form-section">
        <h2>Join Our Investor Network</h2>
        <InvestorForm />
      </section>
    </div>
  );
};

export default Investor; 