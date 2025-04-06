import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Innovative Funding Solutions for Your Business</h1>
            <p className="hero-subtitle">
              FTFC helps startups and small businesses secure the funding they need to grow and succeed.
            </p>
            <div className="hero-buttons">
              <Link to="/consultation" className="primary-button">Get Started</Link>
              <Link to="/services" className="secondary-button">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose FTFC?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3 className="feature-title">Startup Funding</h3>
              <p className="feature-description">
                We connect promising startups with investors who believe in their vision.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3 className="feature-title">Business Loans</h3>
              <p className="feature-description">
                Access competitive business loans tailored to your specific needs.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Financial Consulting</h3>
              <p className="feature-description">
                Expert advice to optimize your financial strategy and maximize growth.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3 className="feature-title">Investor Matching</h3>
              <p className="feature-description">
                We match your business with the right investors for long-term success.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Take Your Business to the Next Level?</h2>
            <p className="cta-description">
              Schedule a free consultation with our financial experts today.
            </p>
            <Link to="/consultation" className="cta-button">Book a Consultation</Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .home-page {
          padding-top: 60px; /* Match the header height */
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .hero-section {
          background-color: #0f172a;
          background-image: linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.9)), url('/images/hero-bg.jpg');
          background-size: cover;
          background-position: center;
          padding: 120px 0;
          text-align: center;
          color: #ffffff;
          width: 100%;
        }

        .hero-title {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 20px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-subtitle {
          font-size: 20px;
          color: #94a3b8;
          margin-bottom: 40px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-buttons {
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

        .features-section {
          padding: 80px 0;
          background-color: #ffffff;
        }

        .section-title {
          font-size: 36px;
          font-weight: 700;
          color: #0f172a;
          text-align: center;
          margin-bottom: 60px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
        }

        .feature-card {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .feature-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .feature-title {
          font-size: 20px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 16px;
        }

        .feature-description {
          color: #64748b;
          line-height: 1.6;
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
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
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
          .hero-title {
            font-size: 36px;
          }

          .hero-subtitle {
            font-size: 18px;
          }

          .hero-buttons {
            flex-direction: column;
            gap: 16px;
          }

          .primary-button, .secondary-button {
            width: 100%;
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

export default Home;
