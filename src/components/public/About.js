import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="about-page">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">About FTFC</h1>
          <p className="page-subtitle">Learn about our mission, vision, and the team behind FTFC.</p>
        </div>
      </section>
      
      <section className="about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <h2 className="section-title">Our Story</h2>
              <p className="about-text">
                Financial Technology Funding Corporation (FTFC) was founded in 2015 with a simple mission: to bridge the gap between innovative businesses and the capital they need to grow.
              </p>
              <p className="about-text">
                Our founders, having experienced firsthand the challenges of securing funding for their own ventures, recognized the need for a more accessible, transparent, and efficient funding process for startups and small businesses.
              </p>
              <p className="about-text">
                Today, FTFC has helped over 500 businesses secure more than $100 million in funding, and we continue to expand our services to meet the evolving needs of entrepreneurs and business owners.
              </p>
            </div>
            <div className="about-image">
              <img src="/images/about-image.jpg" alt="FTFC Team" />
            </div>
          </div>
        </div>
      </section>
      
      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-card">
              <h3 className="mission-title">Our Mission</h3>
              <p className="mission-text">
                To empower entrepreneurs and business owners by providing access to capital, resources, and expertise that enable them to build successful and sustainable businesses.
              </p>
            </div>
            <div className="mission-card">
              <h3 className="mission-title">Our Vision</h3>
              <p className="mission-text">
                To create a world where every viable business idea has the opportunity to thrive, regardless of the founder's background or connections.
              </p>
            </div>
            <div className="mission-card">
              <h3 className="mission-title">Our Values</h3>
              <ul className="values-list">
                <li>Integrity in all our dealings</li>
                <li>Transparency throughout the funding process</li>
                <li>Innovation in financial solutions</li>
                <li>Inclusivity for all entrepreneurs</li>
                <li>Excellence in service delivery</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <section className="team-section">
        <div className="container">
          <h2 className="section-title">Our Leadership Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <img src="/images/team-member-1.jpg" alt="John Smith" />
              </div>
              <h3 className="member-name">John Smith</h3>
              <p className="member-role">CEO & Co-Founder</p>
              <p className="member-bio">
                John has over 15 years of experience in finance and venture capital. He previously worked at Goldman Sachs and founded two successful startups.
              </p>
            </div>
            
            <div className="team-member">
              <div className="member-image">
                <img src="/images/team-member-2.jpg" alt="Sarah Johnson" />
              </div>
              <h3 className="member-name">Sarah Johnson</h3>
              <p className="member-role">COO & Co-Founder</p>
              <p className="member-bio">
                Sarah brings 12 years of operational experience from her time at McKinsey and as COO of a fintech startup that was acquired in 2018.
              </p>
            </div>
            
            <div className="team-member">
              <div className="member-image">
                <img src="/images/team-member-3.jpg" alt="Michael Chen" />
              </div>
              <h3 className="member-name">Michael Chen</h3>
              <p className="member-role">CTO</p>
              <p className="member-bio">
                Michael is a technology leader with experience at Google and several fintech startups. He specializes in building secure and scalable financial platforms.
              </p>
            </div>
            
            <div className="team-member">
              <div className="member-image">
                <img src="/images/team-member-4.jpg" alt="Emily Rodriguez" />
              </div>
              <h3 className="member-name">Emily Rodriguez</h3>
              <p className="member-role">CFO</p>
              <p className="member-bio">
                Emily is a certified CPA with 10 years of experience in financial management for both startups and established companies in the financial sector.
              </p>
            </div>
          </div>
          
          <div className="team-cta">
            <Link to="/team" className="team-button">Meet the Full Team</Link>
          </div>
        </div>
      </section>
      
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Work With Us?</h2>
            <p className="cta-description">
              Schedule a free consultation with our financial experts today.
            </p>
            <Link to="/consultation" className="cta-button">Book a Consultation</Link>
          </div>
        </div>
      </section>
      
      <style jsx>{`
        .about-page {
          padding-top: 80px;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .page-header {
          background-color: #0f172a;
          padding: 80px 0;
          text-align: center;
          color: #ffffff;
        }
        
        .page-title {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 16px;
        }
        
        .page-subtitle {
          font-size: 20px;
          color: #94a3b8;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .about-section {
          padding: 80px 0;
          background-color: #ffffff;
        }
        
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        
        .section-title {
          font-size: 36px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 30px;
        }
        
        .about-text {
          color: #64748b;
          margin-bottom: 20px;
          line-height: 1.6;
        }
        
        .about-image img {
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .mission-section {
          padding: 80px 0;
          background-color: #f8fafc;
        }
        
        .mission-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }
        
        .mission-card {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .mission-title {
          font-size: 24px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 20px;
        }
        
        .mission-text {
          color: #64748b;
          line-height: 1.6;
        }
        
        .values-list {
          color: #64748b;
          padding-left: 20px;
          line-height: 1.8;
        }
        
        .values-list li {
          margin-bottom: 8px;
        }
        
        .team-section {
          padding: 80px 0;
          background-color: #ffffff;
          text-align: center;
        }
        
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          margin-bottom: 40px;
        }
        
        .team-member {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .team-member:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        .member-image {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 auto 20px;
        }
        
        .member-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .member-name {
          font-size: 20px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 8px;
        }
        
        .member-role {
          font-size: 16px;
          color: #f59e0b;
          margin-bottom: 16px;
        }
        
        .member-bio {
          color: #64748b;
          line-height: 1.6;
          text-align: left;
        }
        
        .team-button {
          display: inline-block;
          background-color: #0f172a;
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          transition: background-color 0.2s ease;
        }
        
        .team-button:hover {
          background-color: #1e293b;
        }
        
        .cta-section {
          background-color: #0f172a;
          padding: 80px 0;
          text-align: center;
          color: #ffffff;
        }
        
        .cta-title {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 20px;
        }
        
        .cta-description {
          font-size: 18px;
          color: #94a3b8;
          margin-bottom: 40px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .cta-button {
          display: inline-block;
          background-color: #f59e0b;
          color: #0f172a;
          padding: 14px 32px;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          transition: background-color 0.2s ease;
        }
        
        .cta-button:hover {
          background-color: #d97706;
        }
        
        @media (max-width: 768px) {
          .page-title {
            font-size: 36px;
          }
          
          .about-grid {
            grid-template-columns: 1fr;
          }
          
          .about-image {
            order: -1;
          }
          
          .section-title {
            font-size: 30px;
          }
          
          .cta-title {
            font-size: 30px;
          }
        }
      `}</style>
    </div>
  );
};

export default About;
