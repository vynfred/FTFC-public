import React from 'react';
import ConsultationCTA from './ConsultationCTA';

const About = () => {
  return (
    <>
      <header className="page-header">
        <h1>The Man Behind the Business</h1>
      </header>

      <section className="about-section">
        <div className="about-content">
          <p>I'm a driven and ambitious entrepreneur with a diverse background that fuels my passion for making a positive impact. As a founder, consultant, and startup mentor, I've honed a unique set of skills and experiences that shape my approach to business and leadership.</p>
          
          <p>From CEO & Co-Founder of an entertainment startup to principal consultant, I've learned invaluable lessons. Strategic partnerships, effective communication, and innovative thinking are cornerstones of my success.</p>
          
          <p>My commitment extends beyond professional pursuits. I actively mentor for organizations like Techstars, Founder Institute, Northeastern's accelerator, and others.</p>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
};

export default About; 