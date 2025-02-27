import React from 'react';
import { Link } from 'react-router-dom';

const ConsultationCTA = () => {
  return (
    <section className="cta-section">
      <div className="container">
        <h2>Ready to Accelerate Your Fundraising Journey?</h2>
        <p>
          Schedule your free consultation today and let's discuss how we can help your startup succeed.
          Our expert team is ready to guide you through the process.
        </p>
        <Link to="/consultation" className="cta-button">
          Request Free Consultation
        </Link>
      </div>
    </section>
  );
};

export default ConsultationCTA; 