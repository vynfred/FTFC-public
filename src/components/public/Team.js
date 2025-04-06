import React from 'react';
import { Link } from 'react-router-dom';

const Team = () => {
  return (
    <div className="team-page">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Our Team</h1>
          <p className="page-subtitle">Meet the experts behind FTFC's success.</p>
        </div>
      </section>
      
      <section className="team-section">
        <div className="container">
          <div className="team-intro">
            <h2 className="section-title">Leadership Team</h2>
            <p className="team-description">
              Our leadership team brings decades of experience in finance, technology, and business development. Together, they guide FTFC's mission to provide innovative funding solutions for businesses of all sizes.
            </p>
          </div>
          
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <img src="/images/team-member-1.jpg" alt="John Smith" />
              </div>
              <div className="member-info">
                <h3 className="member-name">John Smith</h3>
                <p className="member-role">CEO & Co-Founder</p>
                <p className="member-bio">
                  John has over 15 years of experience in finance and venture capital. He previously worked at Goldman Sachs and founded two successful startups before co-founding FTFC in 2015.
                </p>
                <div className="member-social">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">Twitter</a>
                </div>
              </div>
            </div>
            
            <div className="team-member">
              <div className="member-image">
                <img src="/images/team-member-2.jpg" alt="Sarah Johnson" />
              </div>
              <div className="member-info">
                <h3 className="member-name">Sarah Johnson</h3>
                <p className="member-role">COO & Co-Founder</p>
                <p className="member-bio">
                  Sarah brings 12 years of operational experience from her time at McKinsey and as COO of a fintech startup that was acquired in 2018. She oversees all operational aspects of FTFC.
                </p>
                <div className="member-social">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">Twitter</a>
                </div>
              </div>
            </div>
            
            <div className="team-member">
              <div className="member-image">
                <img src="/images/team-member-3.jpg" alt="Michael Chen" />
              </div>
              <div className="member-info">
                <h3 className="member-name">Michael Chen</h3>
                <p className="member-role">CTO</p>
                <p className="member-bio">
                  Michael is a technology leader with experience at Google and several fintech startups. He specializes in building secure and scalable financial platforms and leads FTFC's tech team.
                </p>
                <div className="member-social">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">GitHub</a>
                </div>
              </div>
            </div>
            
            <div className="team-member">
              <div className="member-image">
                <img src="/images/team-member-4.jpg" alt="Emily Rodriguez" />
              </div>
              <div className="member-info">
                <h3 className="member-name">Emily Rodriguez</h3>
                <p className="member-role">CFO</p>
                <p className="member-bio">
                  Emily is a certified CPA with 10 years of experience in financial management for both startups and established companies in the financial sector. She manages FTFC's finances and investor relations.
                </p>
                <div className="member-social">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="team-section">
        <div className="container">
          <div className="team-intro">
            <h2 className="section-title">Financial Advisors</h2>
            <p className="team-description">
              Our team of experienced financial advisors works directly with clients to understand their needs and develop customized funding solutions.
            </p>
          </div>
          
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <img src="/images/team-member-5.jpg" alt="David Wilson" />
              </div>
              <div className="member-info">
                <h3 className="member-name">David Wilson</h3>
                <p className="member-role">Senior Financial Advisor</p>
                <p className="member-bio">
                  David specializes in startup funding and has helped over 50 companies secure Series A and B funding rounds. He has a background in venture capital and investment banking.
                </p>
                <div className="member-social">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
                </div>
              </div>
            </div>
            
            <div className="team-member">
              <div className="member-image">
                <img src="/images/team-member-6.jpg" alt="Jessica Lee" />
              </div>
              <div className="member-info">
                <h3 className="member-name">Jessica Lee</h3>
                <p className="member-role">Financial Advisor</p>
                <p className="member-bio">
                  Jessica focuses on small business loans and working capital solutions. She has helped hundreds of small businesses optimize their cash flow and secure the funding they need to grow.
                </p>
                <div className="member-social">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
                </div>
              </div>
            </div>
            
            <div className="team-member">
              <div className="member-image">
                <img src="/images/team-member-7.jpg" alt="Robert Taylor" />
              </div>
              <div className="member-info">
                <h3 className="member-name">Robert Taylor</h3>
                <p className="member-role">Financial Advisor</p>
                <p className="member-bio">
                  Robert specializes in mergers and acquisitions, helping businesses navigate the complex process of buying or selling a company. He has over 8 years of experience in M&A transactions.
                </p>
                <div className="member-social">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
                </div>
              </div>
            </div>
            
            <div className="team-member">
              <div className="member-image">
                <img src="/images/team-member-8.jpg" alt="Amanda Patel" />
              </div>
              <div className="member-info">
                <h3 className="member-name">Amanda Patel</h3>
                <p className="member-role">Financial Advisor</p>
                <p className="member-bio">
                  Amanda focuses on investment strategies for businesses looking to maximize their returns. She has a background in asset management and helps clients develop customized investment plans.
                </p>
                <div className="member-social">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="join-team-section">
        <div className="container">
          <div className="join-team-content">
            <h2 className="join-title">Join Our Team</h2>
            <p className="join-description">
              We're always looking for talented individuals who are passionate about finance, technology, and helping businesses succeed. Check out our current openings or send us your resume.
            </p>
            <div className="join-buttons">
              <a href="/careers" className="primary-button">View Openings</a>
              <a href="/contact" className="secondary-button">Contact Us</a>
            </div>
          </div>
        </div>
      </section>
      
      <style jsx>{`
        .team-page {
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
        
        .team-section {
          padding: 80px 0;
          background-color: #ffffff;
        }
        
        .team-section:nth-child(odd) {
          background-color: #f8fafc;
        }
        
        .team-intro {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 60px;
        }
        
        .section-title {
          font-size: 36px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 20px;
        }
        
        .team-description {
          color: #64748b;
          font-size: 18px;
          line-height: 1.6;
        }
        
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 40px;
        }
        
        .team-member {
          display: flex;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .team-member:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        .member-image {
          width: 180px;
          height: 220px;
          overflow: hidden;
        }
        
        .member-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .member-info {
          flex: 1;
          padding: 20px;
        }
        
        .member-name {
          font-size: 20px;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 8px 0;
        }
        
        .member-role {
          font-size: 16px;
          color: #f59e0b;
          margin: 0 0 16px 0;
        }
        
        .member-bio {
          color: #64748b;
          margin: 0 0 16px 0;
          line-height: 1.6;
        }
        
        .member-social {
          display: flex;
          gap: 12px;
        }
        
        .social-link {
          color: #0f172a;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        
        .social-link:hover {
          color: #f59e0b;
        }
        
        .join-team-section {
          padding: 80px 0;
          background-color: #0f172a;
          color: #ffffff;
          text-align: center;
        }
        
        .join-team-content {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .join-title {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 20px;
        }
        
        .join-description {
          font-size: 18px;
          color: #94a3b8;
          margin-bottom: 40px;
          line-height: 1.6;
        }
        
        .join-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
        }
        
        .primary-button, .secondary-button {
          display: inline-block;
          padding: 14px 32px;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        
        .primary-button {
          background-color: #f59e0b;
          color: #0f172a;
        }
        
        .primary-button:hover {
          background-color: #d97706;
        }
        
        .secondary-button {
          background-color: transparent;
          border: 1px solid #f59e0b;
          color: #f59e0b;
        }
        
        .secondary-button:hover {
          background-color: rgba(245, 158, 11, 0.1);
        }
        
        @media (max-width: 768px) {
          .page-title {
            font-size: 36px;
          }
          
          .section-title {
            font-size: 30px;
          }
          
          .team-grid {
            grid-template-columns: 1fr;
          }
          
          .team-member {
            flex-direction: column;
          }
          
          .member-image {
            width: 100%;
            height: 300px;
          }
          
          .join-buttons {
            flex-direction: column;
            gap: 16px;
          }
          
          .primary-button, .secondary-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Team;
