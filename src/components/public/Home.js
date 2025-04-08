import React from 'react';
import { FaChartLine, FaHandshake, FaRocket } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.homePage}>
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Innovative Funding Solutions for Your Business</h1>
            <p className={styles.heroSubtitle}>
              FTFC helps startups and small businesses secure the funding they need to grow and succeed.
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
          <div className={styles.featuresGrid}>
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
          </div>
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
