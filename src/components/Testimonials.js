import React from 'react';
import ConsultationCTA from './ConsultationCTA';

const Testimonials = () => {
  return (
    <>
      <header className="page-header">
        <h1>What founders and investors have said</h1>
      </header>
      
      <section className="testimonials-section">
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p>"This guy is a fundraising guru. He came in and helped shape our data room, assessed our deliverables, and introduced us to a highly strategic investor that closed our round! I would recommend him to any CEO looking to position themselves for a successful raise!"</p>
            <div className="testimonial-author">CEO, Techstars '22 alumni</div>
          </div>

          <div className="testimonial-card">
            <p>"Working with Michael has been incredible. He's extremely knowledgeable about startups and the venture capital ecosystem."</p>
            <div className="testimonial-author">GP of emerging fund</div>
          </div>

          <div className="testimonial-card">
            <p>"Michael has been instrumental in our company, not only as a resource for fundraising but someone who deeply cares about the success of our company."</p>
            <div className="testimonial-author">Ryan Csrnko, CEO of Grôth</div>
          </div>

          <div className="testimonial-card">
            <p>"Michael went out of his way to help my startup. He made numerous introductions to new investors that helped us raise our seed round."</p>
            <div className="testimonial-author">Stephen Gillis, Chief of Staff at serviceMob</div>
          </div>
        </div>
      </section>
      
      <ConsultationCTA />
    </>
  );
};

export default Testimonials; 