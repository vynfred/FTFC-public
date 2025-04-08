import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Services.module.css';

const Services = () => {
  return (
    <div className={styles.servicesPage}>
      <section className={styles.pageHeader}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>Our Services</h1>
          <p className={styles.pageSubtitle}>Comprehensive financial solutions for businesses at every stage.</p>
        </div>
      </section>

      <section className={styles.servicesOverview}>
        <div className={styles.container}>
          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard} id="startup-funding">
              <h2 className={styles.serviceTitle}>Startup Funding</h2>
              <p className={styles.serviceDescription}>
                We help early-stage startups secure the capital they need to launch and grow. Our extensive network of angel investors, venture capitalists, and private equity firms allows us to match startups with the right funding partners.
              </p>
              <ul className={styles.serviceFeatures}>
                <li>Seed funding for early-stage startups</li>
                <li>Series A, B, and C funding connections</li>
                <li>Pitch deck preparation and investor readiness</li>
                <li>Valuation assistance and term sheet negotiation</li>
              </ul>

            </div>

            <div className={styles.serviceCard} id="growth-capital">
              <h2 className={styles.serviceTitle}>Growth Capital</h2>
              <p className={styles.serviceDescription}>
                Access the capital you need to scale your business through equity investments, revenue-based financing, and strategic partnerships tailored to your growth stage.
              </p>
              <ul className={styles.serviceFeatures}>
                <li>Series A, B, and C funding rounds</li>
                <li>Revenue-based financing options</li>
                <li>Strategic partnership opportunities</li>
                <li>Flexible capital solutions for scaling</li>
              </ul>
            </div>

            <div className={styles.serviceCard} id="venture-capital">
              <h2 className={styles.serviceTitle}>Venture Capital</h2>
              <p className={styles.serviceDescription}>
                For high-growth startups with innovative business models, we provide access to venture capital firms looking for the next big opportunity. Our VC connections span various industries and investment stages.
              </p>
              <ul className={styles.serviceFeatures}>
                <li>Connections to industry-specific VC firms</li>
                <li>Strategic guidance for scaling rapidly</li>
                <li>Due diligence preparation</li>
                <li>Post-funding growth strategy</li>
              </ul>
            </div>

            <div className={styles.serviceCard} id="financial-consulting">
              <h2 className={styles.serviceTitle}>Financial Consulting</h2>
              <p className={styles.serviceDescription}>
                Our team of financial experts provides strategic advice to optimize your business finances, improve cash flow, and prepare for future growth or funding rounds.
              </p>
              <ul className={styles.serviceFeatures}>
                <li>Financial modeling and projections</li>
                <li>Cash flow optimization strategies</li>
                <li>Expense reduction analysis</li>
                <li>Financial health assessment</li>
              </ul>
            </div>

            <div className={styles.serviceCard} id="investment-strategies">
              <h2 className={styles.serviceTitle}>Investment Strategies</h2>
              <p className={styles.serviceDescription}>
                For businesses looking to invest their capital wisely, we develop customized investment strategies that balance growth, risk, and liquidity needs.
              </p>
              <ul className={styles.serviceFeatures}>
                <li>Short and long-term investment planning</li>
                <li>Risk assessment and management</li>
                <li>Diversification strategies</li>
                <li>Regular portfolio review and optimization</li>
              </ul>
            </div>

            <div className={styles.serviceCard} id="merger-acquisition">
              <h2 className={styles.serviceTitle}>Merger & Acquisition</h2>
              <p className={styles.serviceDescription}>
                Whether you're looking to acquire another business or prepare for an exit, our M&A services guide you through the complex process from valuation to closing.
              </p>
              <ul className={styles.serviceFeatures}>
                <li>Business valuation and deal structuring</li>
                <li>Target identification and screening</li>
                <li>Due diligence coordination</li>
                <li>Post-merger integration planning</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="process-section">
        <div className="container">
          <h2 className="section-title">Our Process</h2>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3 className="step-title">Initial Consultation</h3>
              <p className="step-description">
                We begin with a thorough assessment of your business, financial situation, and goals to understand your specific needs.
              </p>
            </div>

            <div className="process-step">
              <div className="step-number">2</div>
              <h3 className="step-title">Strategy Development</h3>
              <p className="step-description">
                Our team develops a customized funding or financial strategy tailored to your business objectives and market conditions.
              </p>
            </div>

            <div className="process-step">
              <div className="step-number">3</div>
              <h3 className="step-title">Preparation & Positioning</h3>
              <p className="step-description">
                We help prepare all necessary documentation and position your business optimally for the selected funding approach.
              </p>
            </div>

            <div className="process-step">
              <div className="step-number">4</div>
              <h3 className="step-title">Execution</h3>
              <p className="step-description">
                Our team guides you through the execution phase, whether it's pitching to investors, applying for loans, or implementing financial strategies.
              </p>
            </div>

            <div className="process-step">
              <div className="step-number">5</div>
              <h3 className="step-title">Ongoing Support</h3>
              <p className="step-description">
                We provide continued support and advice to help you manage your new capital effectively and prepare for future growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Clients Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">
                  "FTFC helped us secure our Series A funding in record time. Their connections and guidance throughout the process were invaluable."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-image">
                  <img src="/images/testimonial-1.jpg" alt="Sarah Chen" />
                </div>
                <div className="author-info">
                  <h4 className="author-name">Sarah Chen</h4>
                  <p className="author-role">CEO, TechStart Inc.</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">
                  "The business loan we secured through FTFC allowed us to expand our operations and increase revenue by 40% in just one year."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-image">
                  <img src="/images/testimonial-2.jpg" alt="Marcus Johnson" />
                </div>
                <div className="author-info">
                  <h4 className="author-name">Marcus Johnson</h4>
                  <p className="author-role">Owner, Johnson Manufacturing</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">
                  "The financial consulting services from FTFC transformed our cash flow management and helped us prepare for a successful acquisition."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-image">
                  <img src="/images/testimonial-3.jpg" alt="Lisa Rodriguez" />
                </div>
                <div className="author-info">
                  <h4 className="author-name">Lisa Rodriguez</h4>
                  <p className="author-role">CFO, Global Solutions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Explore Your Funding Options?</h2>
            <p className="cta-description">
              Schedule a free consultation with our financial experts today.
            </p>
            <Link to="/consultation" className="cta-button">Book a Consultation</Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .services-page {
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

        .services-overview {
          padding: 80px 0;
          background-color: #ffffff;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
        }

        .service-card {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .service-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .service-title {
          font-size: 24px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 16px;
        }

        .service-description {
          color: #64748b;
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .service-features {
          color: #64748b;
          padding-left: 20px;
          margin-bottom: 30px;
        }

        .service-features li {
          margin-bottom: 8px;
        }

        .service-button {
          display: inline-block;
          background-color: #f59e0b;
          color: #0f172a;
          padding: 10px 20px;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 600;
          transition: background-color 0.2s ease;
        }

        .service-button:hover {
          background-color: #d97706;
        }

        .section-title {
          font-size: 36px;
          font-weight: 700;
          color: #0f172a;
          text-align: center;
          margin-bottom: 60px;
        }

        .process-section {
          padding: 80px 0;
          background-color: #f8fafc;
        }

        .process-steps {
          display: flex;
          justify-content: space-between;
          position: relative;
          max-width: 900px;
          margin: 0 auto;
        }

        .process-steps::before {
          content: '';
          position: absolute;
          top: 40px;
          left: 40px;
          right: 40px;
          height: 2px;
          background-color: #e2e8f0;
          z-index: 1;
        }

        .process-step {
          position: relative;
          z-index: 2;
          text-align: center;
          width: 160px;
        }

        .step-number {
          width: 60px;
          height: 60px;
          background-color: #f59e0b;
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
          margin: 0 auto 20px;
        }

        .step-title {
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 12px;
        }

        .step-description {
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
        }

        .testimonials-section {
          padding: 80px 0;
          background-color: #ffffff;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .testimonial-card {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .testimonial-content {
          margin-bottom: 20px;
        }

        .testimonial-text {
          color: #0f172a;
          font-style: italic;
          line-height: 1.6;
          position: relative;
        }

        .testimonial-text::before {
          content: '"';
          font-size: 60px;
          color: #f59e0b;
          position: absolute;
          top: -30px;
          left: -10px;
          opacity: 0.2;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
        }

        .author-image {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 16px;
        }

        .author-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .author-name {
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 4px 0;
        }

        .author-role {
          font-size: 14px;
          color: #64748b;
          margin: 0;
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

          .section-title {
            font-size: 30px;
          }

          .process-steps {
            flex-direction: column;
            align-items: center;
          }

          .process-steps::before {
            display: none;
          }

          .process-step {
            margin-bottom: 40px;
            width: 100%;
            max-width: 300px;
          }

          .cta-title {
            font-size: 30px;
          }
        }
      `}</style>
    </div>
  );
};

export default Services;
