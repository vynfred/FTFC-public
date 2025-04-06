import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="privacy-page">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Privacy Policy</h1>
          <p className="page-subtitle">Last updated: June 1, 2023</p>
        </div>
      </section>
      
      <section className="privacy-content">
        <div className="container">
          <div className="content-wrapper">
            <div className="introduction">
              <p>
                At Financial Technology Funding Corporation (FTFC), we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
              <p>
                Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site or use our services.
              </p>
            </div>
            
            <div className="policy-section">
              <h2 className="section-title">Information We Collect</h2>
              <p>
                We may collect information about you in a variety of ways. The information we may collect includes:
              </p>
              <h3 className="subsection-title">Personal Data</h3>
              <p>
                Personally identifiable information, such as your name, email address, telephone number, and company information that you voluntarily give to us when you register with us or when you choose to participate in various activities related to our services. You are under no obligation to provide us with personal information, but your refusal to do so may prevent you from using certain features of our services.
              </p>
              <h3 className="subsection-title">Derivative Data</h3>
              <p>
                Information our servers automatically collect when you access our website, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the website.
              </p>
              <h3 className="subsection-title">Financial Data</h3>
              <p>
                Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services.
              </p>
            </div>
            
            <div className="policy-section">
              <h2 className="section-title">Use of Your Information</h2>
              <p>
                Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via our website to:
              </p>
              <ul className="policy-list">
                <li>Create and manage your account.</li>
                <li>Process your transactions.</li>
                <li>Send you email newsletters, if you have opted in to receive them.</li>
                <li>Respond to your inquiries and customer service requests.</li>
                <li>Deliver targeted advertising, newsletters, and other information regarding promotions and our website to you.</li>
                <li>Administer sweepstakes, promotions, and contests.</li>
                <li>Compile anonymous statistical data and analysis for use internally or with third parties.</li>
                <li>Increase the efficiency and operation of our website.</li>
                <li>Monitor and analyze usage and trends to improve your experience with our website.</li>
                <li>Notify you of updates to our website.</li>
                <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
              </ul>
            </div>
            
            <div className="policy-section">
              <h2 className="section-title">Disclosure of Your Information</h2>
              <p>
                We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
              </p>
              <h3 className="subsection-title">By Law or to Protect Rights</h3>
              <p>
                If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
              </p>
              <h3 className="subsection-title">Third-Party Service Providers</h3>
              <p>
                We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
              </p>
              <h3 className="subsection-title">Marketing Communications</h3>
              <p>
                With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes.
              </p>
              <h3 className="subsection-title">Business Transfers</h3>
              <p>
                If we or our subsidiaries are involved in a merger, acquisition, or asset sale, your information may be transferred as part of that transaction.
              </p>
            </div>
            
            <div className="policy-section">
              <h2 className="section-title">Security of Your Information</h2>
              <p>
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
              </p>
            </div>
            
            <div className="policy-section">
              <h2 className="section-title">Your Rights</h2>
              <p>
                You have certain rights regarding the personal information we collect about you:
              </p>
              <ul className="policy-list">
                <li>The right to access personal information we hold about you.</li>
                <li>The right to request that we correct any personal information we hold about you that is inaccurate or incomplete.</li>
                <li>The right to request that we erase your personal information in certain circumstances.</li>
                <li>The right to restrict or object to our processing of your personal information.</li>
                <li>The right to request that we provide you with your personal information and, if possible, to transmit that information directly to another data controller.</li>
              </ul>
            </div>
            
            <div className="policy-section">
              <h2 className="section-title">Contact Us</h2>
              <p>
                If you have questions or comments about this Privacy Policy, please contact us at:
              </p>
              <div className="contact-info">
                <p>Financial Technology Funding Corporation</p>
                <p>123 Finance Street, San Francisco, CA 94105</p>
                <p>Email: privacy@ftfc.com</p>
                <p>Phone: +1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <style jsx>{`
        .privacy-page {
          padding-top: 80px;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .page-header {
          background-color: #0f172a;
          padding: 60px 0;
          text-align: center;
          color: #ffffff;
        }
        
        .page-title {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 16px;
        }
        
        .page-subtitle {
          font-size: 16px;
          color: #94a3b8;
        }
        
        .privacy-content {
          padding: 60px 0;
          background-color: #ffffff;
        }
        
        .content-wrapper {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .introduction {
          margin-bottom: 40px;
        }
        
        .introduction p {
          color: #334155;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        
        .policy-section {
          margin-bottom: 40px;
        }
        
        .section-title {
          font-size: 24px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .subsection-title {
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
          margin: 20px 0 10px;
        }
        
        .policy-section p {
          color: #334155;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        
        .policy-list {
          padding-left: 20px;
          margin-bottom: 20px;
        }
        
        .policy-list li {
          color: #334155;
          line-height: 1.6;
          margin-bottom: 10px;
        }
        
        .contact-info {
          background-color: #f8fafc;
          padding: 20px;
          border-radius: 8px;
        }
        
        .contact-info p {
          margin: 5px 0;
        }
        
        @media (max-width: 768px) {
          .page-title {
            font-size: 30px;
          }
          
          .section-title {
            font-size: 22px;
          }
          
          .subsection-title {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Privacy;
