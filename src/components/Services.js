import React from 'react';
import ConsultationCTA from './ConsultationCTA';

const Services = () => {
  return (
    <>
      <header className="page-header">
        <h1>Below is a rundown of our services</h1>
        <p>We offer bespoke programs tailored to your needs, focusing on maximizing fundraising impact.</p>
      </header>

      <section className="services-section">
        <div className="service-category">
          <h2>Fundraising Strategy</h2>
          <ul className="service-list">
            <li>Craft a personalized approach to attract the right investors</li>
            <li>Structured Process for your fundraising journey</li>
            <li>Strategic planning and timeline development</li>
          </ul>
        </div>

        <div className="service-category">
          <h2>Personalized Deliverables</h2>
          <ul className="service-list">
            <li>Pitch Deck Development and Refinement</li>
            <li>Data Room Preparation and Organization</li>
            <li>Financial Model Review and Optimization</li>
          </ul>
        </div>

        <div className="service-category">
          <h2>Content Strategy</h2>
          <ul className="service-list">
            <li>Compelling Narrative Development</li>
            <li>Investment Thesis Refinement</li>
            <li>Market Positioning Strategy</li>
          </ul>
        </div>

        <div className="service-category">
          <h2>Extra Services</h2>
          <ul className="service-list">
            <li>Access to Network of Active Investors</li>
            <li>Operational Partnership Opportunities</li>
            <li>Ongoing Advisory Support</li>
          </ul>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
};

export default Services; 