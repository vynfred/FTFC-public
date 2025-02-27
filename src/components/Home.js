import React from 'react';
import { Link } from 'react-router-dom';
import ConsultationCTA from './ConsultationCTA';

const Home = () => {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Accelerate Your Startup's Fundraising Success with First Time Founder Capital</h1>
        <p>
          We believe in empowering startups to succeed through strong relationships, 
          transparent communication, and a passion for innovation. Every great idea 
          deserves a chance to be realized, and we're here to help make that happen.
        </p>
      </header>

      <section className="home-section">
        <h2>Who we are</h2>
        <p>
          FTFC was founded by a serial entrepreneur with a track record of raising 
          capital for three companies and mentoring for leading accelerators. With 
          exposure to hundreds, if not thousands, of startups, we have a deep 
          understanding of success in the current landscape.
        </p>
      </section>

      <section className="home-section">
        <h2>What we do</h2>
        <p>
          At FTFC, we are dedicated to helping startups overcome the challenges of 
          fundraising and achieve their full potential. Our mission is to offer 
          tailored strategies, hands-on support, and curated access to investors to 
          ensure that each client reaches their goals and secures the funding they 
          need to thrive.
        </p>
        <Link to="/services" className="btn">Learn More</Link>
      </section>

      <ConsultationCTA />
    </div>
  );
};

export default Home; 