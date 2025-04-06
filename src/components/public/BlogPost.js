import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaTag, FaFacebook, FaTwitter, FaLinkedin, FaArrowLeft } from 'react-icons/fa';

const BlogPost = () => {
  const { slug } = useParams();
  
  // Sample blog posts data
  const blogPosts = {
    'how-to-secure-seed-funding': {
      title: 'How to Secure Seed Funding for Your Startup',
      author: 'John Smith',
      date: 'June 15, 2023',
      category: 'Startup Funding',
      image: '/images/blog-1.jpg',
      content: `
        <p>Securing seed funding is a critical milestone for any startup. It provides the necessary capital to move from the idea stage to building a minimum viable product (MVP) and acquiring initial customers. However, the process can be challenging, especially for first-time founders.</p>
        
        <h2>What is Seed Funding?</h2>
        <p>Seed funding is typically the first official equity funding stage. It represents the first official money that a business venture raises; some companies never extend beyond seed funding into Series A rounds or beyond.</p>
        
        <p>You can think of the seed funding stage as the time when a company's founders are getting their operations off the ground. The name of the funding round reflects this developmental stage. Seed funding helps a company grow from a seedling to a sapling before it's ready for venture capital funding.</p>
        
        <h2>Preparing for Seed Funding</h2>
        <p>Before approaching investors, you need to ensure your startup is ready for funding. Here are the key steps to prepare:</p>
        
        <h3>1. Develop a Solid Business Plan</h3>
        <p>Your business plan should clearly articulate your value proposition, target market, competitive landscape, go-to-market strategy, and financial projections. Investors want to see that you have a clear vision for your company and a realistic plan for achieving it.</p>
        
        <h3>2. Build a Minimum Viable Product (MVP)</h3>
        <p>Having a working prototype or MVP demonstrates that your idea is more than just a concept. It shows investors that you can execute and that there's potential for your product in the market.</p>
        
        <h3>3. Assemble a Strong Team</h3>
        <p>Investors often say they invest in people, not just ideas. Having a talented and committed founding team with complementary skills is crucial for securing seed funding.</p>
        
        <h3>4. Show Traction</h3>
        <p>Even at the seed stage, investors want to see some evidence that your product or service has market potential. This could be in the form of user signups, letters of intent from potential customers, or early revenue.</p>
        
        <h2>Finding the Right Investors</h2>
        <p>Not all investors are a good fit for your startup. It's important to target investors who:</p>
        
        <ul>
          <li>Have experience in your industry</li>
          <li>Typically invest in companies at your stage</li>
          <li>Can provide the amount of funding you need</li>
          <li>Offer value beyond just capital (e.g., connections, expertise)</li>
        </ul>
        
        <p>Research potential investors thoroughly and try to get warm introductions whenever possible. Cold outreach can work, but it's generally less effective.</p>
        
        <h2>Crafting a Compelling Pitch</h2>
        <p>Your pitch should be concise, compelling, and tailored to your audience. A typical seed funding pitch deck includes:</p>
        
        <ol>
          <li>Problem: What problem are you solving?</li>
          <li>Solution: How does your product or service solve this problem?</li>
          <li>Market Opportunity: How big is the market?</li>
          <li>Business Model: How will you make money?</li>
          <li>Traction: What progress have you made so far?</li>
          <li>Competition: Who are your competitors and how are you different?</li>
          <li>Team: Who are the key team members and what experience do they bring?</li>
          <li>Financials: What are your projections for the next 18-24 months?</li>
          <li>Ask: How much are you raising and how will you use the funds?</li>
        </ol>
        
        <h2>Understanding Term Sheets</h2>
        <p>If an investor is interested in funding your startup, they will present you with a term sheet. This document outlines the terms and conditions of the investment. Key terms to understand include:</p>
        
        <ul>
          <li>Valuation: Pre-money vs. post-money valuation</li>
          <li>Equity: How much of your company you're giving up</li>
          <li>Liquidation Preference: What happens if the company is sold or liquidated</li>
          <li>Board Seats: How much control the investor will have</li>
          <li>Pro-rata Rights: The investor's right to participate in future funding rounds</li>
        </ul>
        
        <p>It's advisable to have an experienced attorney review any term sheet before signing.</p>
        
        <h2>Conclusion</h2>
        <p>Securing seed funding is a significant milestone for any startup, but it's just the beginning of your journey. The capital you raise should be used strategically to achieve key milestones that will position your company for future growth and additional funding rounds if needed.</p>
        
        <p>Remember, the goal isn't just to raise money, but to find the right partners who believe in your vision and can help you build a successful company.</p>
      `,
      relatedPosts: [
        {
          id: 2,
          title: 'Understanding SBA Loans: A Complete Guide',
          slug: 'understanding-sba-loans'
        },
        {
          id: 3,
          title: 'The Pros and Cons of Venture Capital Funding',
          slug: 'pros-cons-venture-capital'
        },
        {
          id: 6,
          title: 'Investment Strategies for Business Growth',
          slug: 'investment-strategies-growth'
        }
      ]
    },
    // Other blog posts would be defined here
  };
  
  const post = blogPosts[slug];
  
  if (!post) {
    return (
      <div className="not-found">
        <h1>Blog Post Not Found</h1>
        <p>The blog post you are looking for does not exist or has been moved.</p>
        <Link to="/blog" className="back-link">
          <FaArrowLeft className="back-icon" />
          Back to Blog
        </Link>
      </div>
    );
  }
  
  return (
    <div className="blog-post-page">
      <section className="post-header" style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url(${post.image})` }}>
        <div className="container">
          <div className="post-category">
            <FaTag className="category-icon" />
            <span>{post.category}</span>
          </div>
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <div className="meta-item">
              <FaUser className="meta-icon" />
              <span>{post.author}</span>
            </div>
            <div className="meta-item">
              <FaCalendarAlt className="meta-icon" />
              <span>{post.date}</span>
            </div>
          </div>
        </div>
      </section>
      
      <section className="post-content">
        <div className="container">
          <div className="content-wrapper">
            <div className="social-share">
              <span className="share-label">Share:</span>
              <div className="share-buttons">
                <a href="#" className="share-button facebook">
                  <FaFacebook />
                </a>
                <a href="#" className="share-button twitter">
                  <FaTwitter />
                </a>
                <a href="#" className="share-button linkedin">
                  <FaLinkedin />
                </a>
              </div>
            </div>
            
            <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }}></div>
            
            <div className="post-tags">
              <span className="tags-label">Tags:</span>
              <div className="tags-list">
                <a href="#" className="tag">Startup</a>
                <a href="#" className="tag">Funding</a>
                <a href="#" className="tag">Investors</a>
                <a href="#" className="tag">Business Growth</a>
              </div>
            </div>
            
            <div className="author-bio">
              <div className="author-image">
                <img src="/images/author.jpg" alt={post.author} />
              </div>
              <div className="author-info">
                <h3 className="author-name">{post.author}</h3>
                <p className="author-role">Financial Advisor at FTFC</p>
                <p className="author-description">
                  John specializes in startup funding and has helped over 50 companies secure Series A and B funding rounds. He has a background in venture capital and investment banking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="related-posts">
        <div className="container">
          <h2 className="section-title">Related Articles</h2>
          <div className="related-grid">
            {post.relatedPosts.map(relatedPost => (
              <div className="related-card" key={relatedPost.id}>
                <h3 className="related-title">
                  <Link to={`/blog/${relatedPost.slug}`}>{relatedPost.title}</Link>
                </h3>
                <Link to={`/blog/${relatedPost.slug}`} className="read-more">
                  Read More
                </Link>
              </div>
            ))}
          </div>
          
          <div className="back-to-blog">
            <Link to="/blog" className="back-link">
              <FaArrowLeft className="back-icon" />
              Back to Blog
            </Link>
          </div>
        </div>
      </section>
      
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2 className="newsletter-title">Subscribe to Our Newsletter</h2>
            <p className="newsletter-description">
              Get the latest articles, funding tips, and financial insights delivered to your inbox.
            </p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit" className="subscribe-button">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
      
      <style jsx>{`
        .blog-post-page {
          padding-top: 80px;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .post-header {
          background-color: #0f172a;
          background-size: cover;
          background-position: center;
          padding: 100px 0;
          text-align: center;
          color: #ffffff;
        }
        
        .post-category {
          display: inline-flex;
          align-items: center;
          background-color: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 20px;
        }
        
        .category-icon {
          margin-right: 6px;
          font-size: 12px;
        }
        
        .post-title {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 20px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .post-meta {
          display: flex;
          justify-content: center;
          gap: 20px;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          color: #94a3b8;
          font-size: 16px;
        }
        
        .meta-icon {
          margin-right: 6px;
          font-size: 14px;
        }
        
        .post-content {
          padding: 80px 0;
          background-color: #ffffff;
        }
        
        .content-wrapper {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .social-share {
          display: flex;
          align-items: center;
          margin-bottom: 40px;
        }
        
        .share-label {
          font-weight: 500;
          color: #0f172a;
          margin-right: 12px;
        }
        
        .share-buttons {
          display: flex;
          gap: 8px;
        }
        
        .share-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          color: #ffffff;
          font-size: 16px;
          transition: opacity 0.2s ease;
        }
        
        .share-button:hover {
          opacity: 0.8;
        }
        
        .facebook {
          background-color: #1877f2;
        }
        
        .twitter {
          background-color: #1da1f2;
        }
        
        .linkedin {
          background-color: #0a66c2;
        }
        
        .post-body {
          color: #334155;
          line-height: 1.8;
          font-size: 18px;
        }
        
        .post-body h2 {
          font-size: 28px;
          font-weight: 700;
          color: #0f172a;
          margin: 40px 0 20px;
        }
        
        .post-body h3 {
          font-size: 22px;
          font-weight: 600;
          color: #0f172a;
          margin: 30px 0 15px;
        }
        
        .post-body p {
          margin-bottom: 20px;
        }
        
        .post-body ul, .post-body ol {
          margin-bottom: 20px;
          padding-left: 20px;
        }
        
        .post-body li {
          margin-bottom: 10px;
        }
        
        .post-tags {
          display: flex;
          align-items: center;
          margin: 40px 0;
          flex-wrap: wrap;
        }
        
        .tags-label {
          font-weight: 500;
          color: #0f172a;
          margin-right: 12px;
        }
        
        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .tag {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 6px 12px;
          font-size: 14px;
          color: #64748b;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        
        .tag:hover {
          background-color: #f1f5f9;
          color: #0f172a;
        }
        
        .author-bio {
          display: flex;
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 30px;
          margin-top: 60px;
        }
        
        .author-image {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 20px;
        }
        
        .author-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .author-name {
          font-size: 20px;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 4px 0;
        }
        
        .author-role {
          font-size: 16px;
          color: #f59e0b;
          margin: 0 0 12px 0;
        }
        
        .author-description {
          color: #64748b;
          margin: 0;
          line-height: 1.6;
        }
        
        .related-posts {
          padding: 80px 0;
          background-color: #f8fafc;
        }
        
        .section-title {
          font-size: 36px;
          font-weight: 700;
          color: #0f172a;
          text-align: center;
          margin-bottom: 40px;
        }
        
        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-bottom: 40px;
        }
        
        .related-card {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .related-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        .related-title {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 20px 0;
          line-height: 1.4;
        }
        
        .related-title a {
          color: #0f172a;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        
        .related-title a:hover {
          color: #f59e0b;
        }
        
        .read-more {
          display: inline-block;
          color: #f59e0b;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        
        .read-more:hover {
          color: #d97706;
        }
        
        .back-to-blog {
          text-align: center;
        }
        
        .back-link {
          display: inline-flex;
          align-items: center;
          color: #0f172a;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        
        .back-link:hover {
          color: #f59e0b;
        }
        
        .back-icon {
          margin-right: 8px;
        }
        
        .newsletter-section {
          background-color: #0f172a;
          padding: 80px 0;
          text-align: center;
          color: #ffffff;
        }
        
        .newsletter-content {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .newsletter-title {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 16px;
        }
        
        .newsletter-description {
          font-size: 18px;
          color: #94a3b8;
          margin-bottom: 30px;
        }
        
        .newsletter-form {
          display: flex;
          max-width: 500px;
          margin: 0 auto;
        }
        
        .newsletter-form input {
          flex: 1;
          padding: 14px;
          border: none;
          border-radius: 4px 0 0 4px;
          font-size: 16px;
        }
        
        .newsletter-form input:focus {
          outline: none;
        }
        
        .subscribe-button {
          background-color: #f59e0b;
          color: #0f172a;
          border: none;
          border-radius: 0 4px 4px 0;
          padding: 0 24px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .subscribe-button:hover {
          background-color: #d97706;
        }
        
        .not-found {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
          padding: 0 20px;
        }
        
        .not-found h1 {
          font-size: 36px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 16px;
        }
        
        .not-found p {
          color: #64748b;
          margin-bottom: 30px;
        }
        
        @media (max-width: 768px) {
          .post-title {
            font-size: 32px;
          }
          
          .post-body {
            font-size: 16px;
          }
          
          .post-body h2 {
            font-size: 24px;
          }
          
          .post-body h3 {
            font-size: 20px;
          }
          
          .author-bio {
            flex-direction: column;
            text-align: center;
          }
          
          .author-image {
            margin: 0 auto 20px;
          }
          
          .related-grid {
            grid-template-columns: 1fr;
          }
          
          .newsletter-form {
            flex-direction: column;
            gap: 12px;
          }
          
          .newsletter-form input {
            border-radius: 4px;
          }
          
          .subscribe-button {
            width: 100%;
            border-radius: 4px;
            padding: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogPost;
