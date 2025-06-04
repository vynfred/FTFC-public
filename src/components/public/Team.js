import React from 'react';
import { FaLinkedin } from 'react-icons/fa';

const Team = () => {
  return (
    <div className="team-page">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Our Team</h1>
          <p className="page-subtitle">Meet the experts behind FTFC success.</p>
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
                <img src="/assets/images/teams/MikeSpidaliere.jpeg" alt="John Smith" />
              </div>
              <div className="member-info">
                <h3 className="member-name">Mike Spidaliere</h3>
                <p className="member-role">CEO & Partner, FTFC</p>
                <p className="member-bio">
                  Mike is a serial founder with a track record of launching and fundraising for companies across entertainment, cannabis, physical spaces, and food tech. After navigating the fundraising journey firsthand, he launched FTFC with one mission: to help other founders not just understand the capital-raising process—but master it.
                  Since founding FTFC, Mike has helped startups across industries raise millions, built a vetted network of 600+ investors, and mentored rising founders through top accelerators like Techstars and Founder Institute. He’s also brought together a powerhouse team of experienced entrepreneurs, all united around one goal: bridging the gap between founders and funders.

                </p>
                <div className="member-social">
                  <a href="https://www.linkedin.com/in/michaelspidaliere" target="_blank" rel="noopener noreferrer" className="social-link"> <FaLinkedin /></a>
                </div>
              </div>
            </div>

            <div className="team-member">
              <div className="member-image">
                <img src="/images/team-member-2.jpg" alt="Jason Zuker" />
              </div>
              <div className="member-info">
                <h3 className="member-name">Jason Zuker</h3>
                {/* <p className="member-role">Founder-turned-strategic advisor</p> */}
                <p className="member-bio">
                  Founder-turned-strategic advisor with a polymathic background spanning human & machine intelligence, venture building, media, and advanced technology. He is an international scholar laureate and self-ascribed mad-scientist developing a reputation for manifesting uniquely valuable solutions. With experience scaling companies, building technology, and securing funding, he’s passionate about leveraging his unique talent and network to bridge the gap between founders and investors at FTFC.
                </p>
                <div className="member-social">
                  <a href="https://www.linkedin.com/in/jasonzuker" target="_blank" rel="noopener noreferrer" className="social-link"> <FaLinkedin /></a>
                </div>
              </div>
            </div>

            <div className="team-member">
              <div className="member-image">
                <img src="/images/team-member-3.jpg" alt="Jake Kerr" />
              </div>
              <div className="member-info">
                <h3 className="member-name">Jake Kerr</h3>
                {/* <p className="member-role">CTO</p> */}
                <p className="member-bio">
                  Jake, a molecular biologist, entrepreneur, and investor with extensive healthcare expertise, co-founded Bright Yeti, Inc., an early-stage plant biology company focused on bioelectromagnetics, and later served as a senior venture analyst for the University of Colorado Care Innovation Fund, supporting biotech and digital health ventures. Currently, as CEO and founder of 39North Health Plans, he has built a high-performance provider network offering members $0 care for most services. Passionate about advancing healthcare technologies, Jake joined FTFC to consult and advise companies, leveraging his diverse experience to help patients access cutting-edge tools and improve their lives in a rapidly evolving industry.

                </p>
                {/* <div className="member-social">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">GitHub</a>
                </div> */}
              </div>
            </div>

            <div className="team-member">
              <div className="member-image">
                <img src="/images/team-member-4.jpg" alt="Wilfred Hirst" />
              </div>
              <div className="member-info">
                <h3 className="member-name">Wilfred Hirst</h3>
                {/* <p className="member-role">CFO</p> */}
                <p className="member-bio">
                  Wilfred Hirst is a creative strategist, entrepreneur, and super connector who blends artistic insight with sharp business expertise to guide first-time founders in building innovative, market-leading startups. As co-founder of VONA with Sigur Rós, he launched a pioneering CBD and wellness venture, scaling it to serve customers in the US, Hong Kong, UK, and Taiwan, demonstrating his ability to shape and thrive in emerging markets. An accomplished artist in music and visual arts, Wilfred brings originality and creative problem-solving to his strategic work. Wilfred joined First Time Founder Capital to connect people and help early-stage entrepreneurs leveraging his unique blend of creative, entrepreneurial, and SaaS expertise to help founders turn bold ideas into successful ventures and stay ahead of market trends.
                </p>
                {/* <div className="member-social">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
                </div> */}
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
          display: flex;
          align-items: center;
          flex-direction: row;
          gap: 5px;
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
