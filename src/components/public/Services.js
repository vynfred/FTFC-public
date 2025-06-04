import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Services.module.css';

const Services = () => {
  return (
    <div className={styles.servicesPage}>
      <section className={styles.pageHeader}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>Services</h1>
          <p className={styles.pageSubtitle}>We offer bespoke programs tailored to your needs, focusing on maximizing fundraising impact. Whether you require short-term guidance or long-term support, we'll create a package that ensures your great ideas and passionate team aren't limited by financial constraints.</p>
        </div>
      </section>

      <section className={styles.servicesOverview}>
        <div className={styles.container}>
          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard} id="startup-funding">
              <h2 className={styles.serviceTitle}>Fundraising Strategy</h2>
              <p className={styles.serviceDescription}>
                We craft a customized approach tailored to your specific business, stage, and target investors, then develop an organized roadmap that guides you through every step of your fundraising journey with clarity and confidence.
              </p>
            </div>

            <div className={styles.serviceCard} id="growth-capital">
              <h2 className={styles.serviceTitle}>Pitch Deck Creation & Optimization</h2>
              <p className={styles.serviceDescription}>
                We enhance both your pitch deck and presentation delivery to maximize investor appeal, refining your narrative structure, visual design, and storytelling.
              </p>
            </div>

            <div className={styles.serviceCard} id="venture-capital">
              <h2 className={styles.serviceTitle}>Access to FTFC’s Curated Investor Network</h2>
              <p className={styles.serviceDescription}>
                FTFC has meticulously curated a network of over 600 active investors, from angels to VCS, Family Offices and Corporate Venture Capital funds. We work with you to identify highly strategic value-add investors for your startup, then make warm introductions.
              </p>
            </div>

            <div className={styles.serviceCard} id="financial-consulting">
              <h2 className={styles.serviceTitle}>Streamlined Fundraising Systems and Proven Resources</h2>
              <p className={styles.serviceDescription}>
                We equip you with the infrastructure to fundraise efficiently and effectively. From battle-tested templates to proven preparation processes and pitch materials, everything you need is organized, accessible, and ready to deploy.
              </p>
            </div>

            <div className={styles.serviceCard} id="investment-strategies">
              <h2 className={styles.serviceTitle}>Advising and Coaching</h2>
              <p className={styles.serviceDescription}>
                We offer direct, no-fluff guidance from seasoned operators who’ve raised, built, and scaled. Whether you're navigating strategy, storytelling, or tough decisions, we’re in it with you.
              </p>
            </div>

            <div className={styles.serviceCard} id="merger-acquisition">
              <h2 className={styles.serviceTitle}>Partnerships</h2>
              <p className={styles.serviceDescription}>
                Access a vetted network of partners across tech, AI, legal, hiring, finance, and more. We connect you with the right experts at the right time—so you can move faster and smarter.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="transform-startup-section">
        <div className="container">
          <h2 className="section-title-transform-startup">Transform Your Startup Into an Investment-Ready Company</h2>
          <p className={styles.serviceDescription}>At First Time Founder Capital, we specialize in preparing startups for Pre-seed, Seed, and Series A funding rounds. We bridge the gap between having a great idea and securing institutional investment. We're not investors ourselves—we're your strategic partners who prepare you for the investors you'll meet.</p>
        </div>
      </section>
      <section className="what-we-do-section">
        <div className="container">
          <h2 className="section-title-what-we-do">What We Do</h2>
          <section className={styles.whatWeDoOverview}>
            <div className={styles.container}>
              <div className={styles.servicesGrid}>
                <div className={styles.serviceCard} id="startup-funding">
                  <h2 className={styles.serviceTitle}>Investment Readiness Assessment</h2>
                  <p className={styles.serviceDescription}>
                    We conduct comprehensive evaluations of your business model, financials, market positioning, and growth strategy. Our assessment identifies exactly what investors will be looking for and highlights areas that need strengthening before you start fundraising.
                  </p>
                </div>

                <div className={styles.serviceCard} id="growth-capital">
                  <h2 className={styles.serviceTitle}>Pitch Deck Development</h2>
                  <p className={styles.serviceDescription}>
                    Your pitch deck is often your first impression with investors. We help craft compelling narratives that clearly communicate your value proposition, market opportunity, and growth potential while addressing the key questions investors always ask.
                  </p>
                </div>

                <div className={styles.serviceCard} id="venture-capital">
                  <h2 className={styles.serviceTitle}>Go-to-Market Strategy Refinement</h2>
                  <p className={styles.serviceDescription}>
                    Investors want to see a clear path to customer acquisition and revenue growth. We work with you to develop and refine your go-to-market strategy, ensuring it's both executable and scalable.
                  </p>
                </div>

                <div className={styles.serviceCard} id="financial-consulting">
                  <h2 className={styles.serviceTitle}>Founder & Team Positioning</h2>
                  <p className={styles.serviceDescription}>
                    We help position you and your team as the right founders to execute on this opportunity. This includes refining your story, highlighting relevant experience, and identifying any key hires needed to strengthen investor confidence.
                  </p>
                </div>

                <div className={styles.serviceCard} id="investment-strategies">
                  <h2 className={styles.serviceTitle}>Stage-Specific Fundraising Strategy</h2>
                  <p className={styles.serviceDescription}>
                    We tailor our approach based on your funding stage. Pre-seed companies need different preparation than Series A companies. We understand the unique metrics, milestones, and investor expectations for each stage and help you meet them.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <p className={styles.serviceDescription}> <strong>Pre-seed Focus:</strong>Product-market fit validation, early traction metrics, founding team story</p>
              <p className={styles.serviceDescription}><strong>Seed Focus:</strong>Revenue growth, customer acquisition, market expansion strategy</p>
              <p className={styles.serviceDescription}><strong>A Focus:</strong>Scalable business model, clear unit economics, path to profitability</p>
            </div>
          </section>
        </div>
      </section>
      <section className="who-we-work-with-section">
        <div className="container">
          <h2 className="section-title-what-we-do">Who We Work With</h2>
          <p className={styles.serviceDescription}>
            We specialize in working with first-time founders preparing for Pre-seed, Seed, or Series A rounds who have:
          </p>
          <ul className={styles.serviceDescription}>
            <li>A validated business model or strong product-market fit signals</li>
            <li>Early revenue or clear path to monetization (varies by stage)</li>
            <li>Ambition to scale and build a venture-backable business</li>
            <li>Commitment to the institutional fundraising process</li>
            <li>Businesses in any vertical except pharmaceuticals/drug development</li>
          </ul>
        </div>
      </section>
      <section className="what-we-do-section">
        <div className="container">
          <h2 className="section-title-what-we-do">Our Approach</h2>

          <ul className={styles.serviceDescription}>
            <li><strong>Discovery & Assessment: </strong>Deep dive into your business, team, and current state of investment readiness</li>
            <li><strong>Strategy Development: </strong>Create customized roadmap addressing gaps and building on strengths</li>
            <li><strong>Implementation Support: </strong>Hands-on guidance as you execute improvements and prepare materials</li>
            <li><strong>Pre-Launch Review: </strong>Final preparation and practice before you begin investor outreach</li>
          </ul>
        </div>
      </section>
      <section className="who-we-work-with-section">
        <div className="container">
          <h2 className="section-title-what-we-do">Why Choose FTFC</h2>

          <ul className={styles.serviceDescription}>
            <li><strong>Founder-Focused Perspective: </strong>We understand the unique challenges first-time founders face because we've been there ourselves.</li>
            <li><strong>Stage-Specific Expertise: </strong>We understand the nuanced differences between Pre-seed, Seed, and Series A requirements and tailor our approach accordingly.</li>
            <li><strong>Cross-Industry Experience: </strong>From SaaS to consumer products to deep tech, we've helped startups across every major vertical (except pharma) prepare for institutional funding.</li>
            <li><strong>Investor-Informed Approach: </strong>Our strategies are based on real investor feedback and what actually works in today's funding environment across different stages and sectors.</li>
            <li><strong>No Conflicts of Interest: </strong>Since we're not investors, our only goal is your success—not protecting our own investment thesis.</li>
            <li><strong>Proven Process: </strong>Our systematic approach has helped dozens of startups successfully raise their first institutional rounds.</li>
          </ul>
        </div>
      </section>
      <section className="what-we-do-section">
        <div className="container">
          <h2 className="section-title-what-we-do">Ready to Become Investment-Ready?</h2>
          <p className={styles.serviceDescription}>
            The difference between fundable and unfundable companies often comes down to preparation and presentation. Let us help you position your startup for fundraising success.
          </p>
          <p className={styles.serviceDescription}>
            Contact us to schedule a consultation and learn how we can help transform your startup into an investment-ready company.
          </p>

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
        .section-title-transform-startup {
          font-size: 36px;
          font-weight: 700;
          color: #0f172a;
          text-align: center;
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
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
        .transform-startup-section {
          padding: 40px 0;
          background-color: #f8fafc;
        }
        .what-we-do-section {
          padding: 40px 0;
          background-color: #ffffff;
        }
        .who-we-work-with-section {
          padding: 40px 0;
          background-color: #f8fafc;
        }
        strong{
          font-weight: 900
        }
        .mt-5 {
          margin-top:15px
        }
        .section-title-what-we-do{
          font-size: 36px;
          font-weight: 700;
          color: #0f172a;
          text-align: center;
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        ul {
          list-style-type: disc; 
          padding-left: 1.5rem; 
          margin: 1rem 0;
        }
        
      `}</style>
    </div>
  );
};

export default Services;
