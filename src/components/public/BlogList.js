import React, { useState } from 'react';
import { FaCalendarAlt, FaTag, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { SearchBar } from '../ui/form';

const BlogList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sample blog data
  const blogPosts = [
    {
      id: 1,
      title: 'How to Secure Seed Funding for Your Startup',
      excerpt: 'Learn the essential steps to prepare your startup for seed funding and attract the right investors.',
      author: 'John Smith',
      date: 'June 15, 2023',
      category: 'Startup Funding',
      image: '/images/blog-1.jpg',
      slug: 'how-to-secure-seed-funding'
    },
    {
      id: 2,
      title: 'Understanding SBA Loans: A Complete Guide',
      excerpt: 'Everything you need to know about Small Business Administration loans and how to qualify for them.',
      author: 'Sarah Johnson',
      date: 'June 8, 2023',
      category: 'Business Loans',
      image: '/images/blog-2.jpg',
      slug: 'understanding-sba-loans'
    },
    {
      id: 3,
      title: 'The Pros and Cons of Venture Capital Funding',
      excerpt: 'Explore the advantages and disadvantages of seeking venture capital for your business growth.',
      author: 'Michael Chen',
      date: 'May 30, 2023',
      category: 'Venture Capital',
      image: '/images/blog-3.jpg',
      slug: 'pros-cons-venture-capital'
    },
    {
      id: 4,
      title: '5 Cash Flow Management Strategies for Small Businesses',
      excerpt: 'Effective techniques to optimize your cash flow and ensure financial stability for your small business.',
      author: 'Emily Rodriguez',
      date: 'May 22, 2023',
      category: 'Financial Management',
      image: '/images/blog-4.jpg',
      slug: 'cash-flow-management-strategies'
    },
    {
      id: 5,
      title: 'How to Prepare Your Business for an Acquisition',
      excerpt: 'Key steps to take when preparing your company for a successful acquisition or merger.',
      author: 'David Wilson',
      date: 'May 15, 2023',
      category: 'Mergers & Acquisitions',
      image: '/images/blog-5.jpg',
      slug: 'prepare-business-acquisition'
    },
    {
      id: 6,
      title: 'Investment Strategies for Business Growth',
      excerpt: 'Smart investment approaches to fuel your business growth and maximize returns.',
      author: 'Jessica Lee',
      date: 'May 8, 2023',
      category: 'Investment Strategies',
      image: '/images/blog-6.jpg',
      slug: 'investment-strategies-growth'
    }
  ];

  // Get unique categories
  const categories = ['All', ...new Set(blogPosts.map(post => post.category))];

  // Filter posts based on search term and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="blog-list-page">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">FTFC Blog</h1>
          <p className="page-subtitle">Insights, tips, and news from the world of business funding.</p>
        </div>
      </section>

      <section className="blog-content">
        <div className="container">
          <div className="blog-filters">
            <div className="search-bar">
              <SearchBar
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="blog-search"
              />
            </div>

            <div className="category-filter">
              <span className="filter-label">Filter by:</span>
              <div className="category-buttons">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="blog-grid">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <div className="blog-card" key={post.id}>
                  <div className="blog-image">
                    <img src={post.image} alt={post.title} />
                    <div className="blog-category">
                      <FaTag className="category-icon" />
                      <span>{post.category}</span>
                    </div>
                  </div>
                  <div className="blog-content">
                    <h2 className="blog-title">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <div className="blog-meta">
                      <div className="meta-item">
                        <FaUser className="meta-icon" />
                        <span>{post.author}</span>
                      </div>
                      <div className="meta-item">
                        <FaCalendarAlt className="meta-icon" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <p className="blog-excerpt">{post.excerpt}</p>
                    <Link to={`/blog/${post.slug}`} className="read-more">
                      Read More
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <h3>No articles found</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>

          <div className="pagination">
            <button className="pagination-button active">1</button>
            <button className="pagination-button">2</button>
            <button className="pagination-button">3</button>
            <button className="pagination-button next">Next</button>
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
        .blog-list-page {
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

        .blog-content {
          padding: 80px 0;
          background-color: #ffffff;
        }

        .blog-filters {
          margin-bottom: 40px;
        }

        .search-bar {
          position: relative;
          max-width: 500px;
          margin-bottom: 20px;
        }

        /* Styles for the SearchBar component in blog */
        .blog-search {
          width: 100%;
          max-width: 500px;
        }

        /* Legacy styles for backward compatibility */
        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
        }

        .search-bar input {
          width: 100%;
          padding: 12px 12px 12px 44px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 16px;
          color: #0f172a;
        }

        .search-bar input:focus {
          outline: none;
          border-color: #f59e0b;
        }

        .category-filter {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .filter-label {
          font-weight: 500;
          color: #0f172a;
        }

        .category-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .category-button {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 8px 16px;
          font-size: 14px;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .category-button:hover {
          background-color: #f1f5f9;
          color: #0f172a;
        }

        .category-button.active {
          background-color: #f59e0b;
          border-color: #f59e0b;
          color: #ffffff;
        }

        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 30px;
          margin-bottom: 60px;
        }

        .blog-card {
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .blog-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .blog-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .blog-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .blog-card:hover .blog-image img {
          transform: scale(1.05);
        }

        .blog-category {
          position: absolute;
          top: 16px;
          right: 16px;
          background-color: rgba(15, 23, 42, 0.8);
          color: #ffffff;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
        }

        .category-icon {
          margin-right: 6px;
          font-size: 10px;
        }

        .blog-content {
          padding: 24px;
        }

        .blog-title {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 16px 0;
          line-height: 1.4;
        }

        .blog-title a {
          color: #0f172a;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .blog-title a:hover {
          color: #f59e0b;
        }

        .blog-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          color: #64748b;
          font-size: 14px;
        }

        .meta-icon {
          margin-right: 6px;
          font-size: 12px;
        }

        .blog-excerpt {
          color: #334155;
          margin: 0 0 20px 0;
          line-height: 1.6;
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

        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 0;
          color: #64748b;
        }

        .no-results h3 {
          font-size: 24px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 12px;
        }

        .pagination {
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .pagination-button {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          color: #64748b;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pagination-button:hover {
          background-color: #f1f5f9;
          color: #0f172a;
        }

        .pagination-button.active {
          background-color: #f59e0b;
          border-color: #f59e0b;
          color: #ffffff;
        }

        .pagination-button.next {
          width: auto;
          padding: 0 16px;
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

        @media (max-width: 768px) {
          .page-title {
            font-size: 36px;
          }

          .blog-grid {
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

export default BlogList;
