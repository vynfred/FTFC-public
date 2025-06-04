import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.homePage}>
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Accelerate Your Startup's Fundraising Success with First Time Founder Capital</h1>
            <p className={styles.heroSubtitle}>
              At FTFC, we are dedicated to helping startups overcome the challenges of fundraising and achieve their full potential.
            </p>
            <div className={styles.heroButtons}>
              <Link to="/consultation" className={styles.primaryButton}>Get Started</Link>
              <Link to="/services" className={styles.secondaryButton}>Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Why Choose FTFC?</h2>
          <p className={styles.whyWeChooseFTFC}>We are a team of fellow founders who have successfully raised capital across sectors like healthcare, CPG, platforms, and physical spaces. We’ve mentored with top accelerators and serve on multiple startup advisory boards. Through building, advising, and evaluating startups, we’ve developed deep insights into what drives success.</p>
          {/* <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><FaRocket /></div>
              <h3 className={styles.featureTitle}>Startup Funding</h3>
              <p className={styles.featureDescription}>
                We connect promising startups with investors who believe in their vision.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><FaUserTie /></div>
              <h3 className={styles.featureTitle}>Investor Matching</h3>
              <p className={styles.featureDescription}>
                We connect you with the right investors who align with your business goals.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><FaChartLine /></div>
              <h3 className={styles.featureTitle}>Financial Consulting</h3>
              <p className={styles.featureDescription}>
                Expert advice to optimize your financial strategy and maximize growth.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><FaHandshake /></div>
              <h3 className={styles.featureTitle}>Investor Matching</h3>
              <p className={styles.featureDescription}>
                We match your business with the right investors for long-term success.
              </p>
            </div>
          </div> */}
        </div>
      </section>

      <section className={styles.serviceSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Services</h2>
        </div>
        <section className={styles.servicesOverview}>
          <div className={styles.container}>
            <div className={styles.servicesGrid}>
              <div className={styles.serviceCard} id="startup-funding">
                <h2 className={styles.serviceTitle}>Fundraising Strategy</h2>
                <p className={styles.serviceDescription}>
                  Craft a personalized approach to attract the right investors.
                </p>
              </div>

              <div className={styles.serviceCard} id="growth-capital">
                <h2 className={styles.serviceTitle}>Pitch Deck Creation & Optimization</h2>
                <p className={styles.serviceDescription}>
                  Enhance your pitch and deck to increase investor appeal.
                </p>
              </div>

              <div className={styles.serviceCard} id="venture-capital">
                <h2 className={styles.serviceTitle}>Access to FTFC’s Curated Investor Network</h2>
                <p className={styles.serviceDescription}>
                  Warm intros to aligned strategic investors form our network of over 600+
                </p>
              </div>

              <div className={styles.serviceCard} id="financial-consulting">
                <h2 className={styles.serviceTitle}>Fundraising Systems and Proven Resources</h2>
                <p className={styles.serviceDescription}>
                  Access to battle tested templates, processes, and systems.
                </p>
              </div>

              <div className={styles.serviceCard} id="investment-strategies">
                <h2 className={styles.serviceTitle}>Advising and Coaching</h2>
                <p className={styles.serviceDescription}>
                  Hands-on advising and coaching from VC-backed operators.
                </p>
              </div>

              <div className={styles.serviceCard} id="merger-acquisition">
                <h2 className={styles.serviceTitle}>Partnerships</h2>
                <p className={styles.serviceDescription}>
                  Access our trusted partners across every startup need.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>CTA</h2>
          <h2 className={styles.sectionSubTitleBold}>Maximize your fundraising potential with our expert guidance.</h2>

          <p className={styles.sectionSubTitle}>Secure your funding with confidence. Get ahead of the game and schedule a consultation to learn more about how our expert fundraising services can help your startup.</p>
        </div>
      </section>
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Take Your Business to the Next Level?</h2>
            <p className={styles.ctaDescription}>
              Schedule a free consultation with our financial experts today.
            </p>
            <Link to="/consultation" className={styles.ctaButton}>Book a Consultation</Link>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;
