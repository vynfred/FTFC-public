import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaSave, FaTrash } from 'react-icons/fa';
import DashboardSection from '../shared/DashboardSection';
import styles from './BlogDetail.module.css';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBlog, setEditedBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        // In a real app, this would fetch from Firebase
        // For now, we'll use mock data
        const mockBlog = {
          id: parseInt(id),
          title: '10 Ways to Improve Your Digital Marketing',
          type: 'Blog Post',
          content: `
            <h2>Introduction</h2>
            <p>Digital marketing is constantly evolving, and staying ahead of the curve is essential for businesses looking to maintain a competitive edge. This blog post explores ten effective strategies to enhance your digital marketing efforts and drive better results.</p>
            
            <h2>1. Develop a Comprehensive Strategy</h2>
            <p>Before diving into tactics, it's crucial to have a well-defined digital marketing strategy. This should align with your overall business goals and include specific, measurable objectives for each channel.</p>
            
            <h2>2. Optimize for Mobile</h2>
            <p>With mobile devices accounting for over 50% of web traffic, ensuring your website and content are mobile-friendly is no longer optional. Responsive design, fast loading times, and mobile-specific features are essential.</p>
            
            <h2>3. Leverage Data Analytics</h2>
            <p>Data-driven decision making is at the heart of effective digital marketing. Utilize tools like Google Analytics to track performance, identify trends, and make informed adjustments to your strategy.</p>
            
            <h2>4. Personalize User Experiences</h2>
            <p>Personalization can significantly improve engagement and conversion rates. Use customer data to deliver tailored content, product recommendations, and marketing messages.</p>
            
            <h2>5. Embrace Video Content</h2>
            <p>Video continues to dominate online content consumption. Incorporate video into your content strategy across platforms to increase engagement and convey complex information more effectively.</p>
          `,
          publishDate: '2024-03-01',
          author: 'John Doe',
          views: 1250,
          shares: 85,
          leads: 37,
          tags: ['Digital Marketing', 'SEO', 'Content Strategy'],
          featuredImage: 'https://via.placeholder.com/800x400',
          status: 'Published',
          metaDescription: 'Learn ten effective strategies to improve your digital marketing efforts and drive better results for your business.',
          lastUpdated: '2024-03-05'
        };
        
        setBlog(mockBlog);
        setEditedBlog(mockBlog);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // In a real app, this would update the blog in Firebase
      // For now, we'll just update our local state
      setBlog(editedBlog);
      setIsEditing(false);
      // Show success message or notification
    } catch (err) {
      console.error('Error saving blog:', err);
      // Show error message
    }
  };

  const handleCancel = () => {
    setEditedBlog(blog);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        // In a real app, this would delete the blog from Firebase
        // For now, we'll just navigate back
        navigate('/dashboard/marketing');
        // Show success message or notification
      } catch (err) {
        console.error('Error deleting blog:', err);
        // Show error message
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBlog(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className={styles.blogDetail}>
        <div className={styles.loading}>Loading blog post...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.blogDetail}>
        <div className={styles.error}>{error}</div>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/dashboard/marketing')}
        >
          <FaArrowLeft /> Back to Marketing
        </button>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={styles.blogDetail}>
        <div className={styles.error}>Blog post not found</div>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/dashboard/marketing')}
        >
          <FaArrowLeft /> Back to Marketing
        </button>
      </div>
    );
  }

  return (
    <div className={styles.blogDetail}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/dashboard/marketing')}
        >
          <FaArrowLeft /> Back to Marketing
        </button>
        <div className={styles.actions}>
          {isEditing ? (
            <>
              <button 
                className={`${styles.actionButton} ${styles.saveButton}`}
                onClick={handleSave}
              >
                <FaSave /> Save
              </button>
              <button 
                className={styles.actionButton}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button 
                className={styles.actionButton}
                onClick={handleEdit}
              >
                <FaEdit /> Edit
              </button>
              <button 
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={handleDelete}
              >
                <FaTrash /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      <DashboardSection title={isEditing ? 'Edit Blog Post' : 'Blog Post Details'}>
        <div className={styles.blogContent}>
          {isEditing ? (
            <div className={styles.editForm}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editedBlog.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="type">Type</label>
                  <select
                    id="type"
                    name="type"
                    value={editedBlog.type}
                    onChange={handleInputChange}
                  >
                    <option value="Blog Post">Blog Post</option>
                    <option value="Whitepaper">Whitepaper</option>
                    <option value="Case Study">Case Study</option>
                    <option value="Webinar">Webinar</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={editedBlog.status}
                    onChange={handleInputChange}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="metaDescription">Meta Description</label>
                <textarea
                  id="metaDescription"
                  name="metaDescription"
                  value={editedBlog.metaDescription}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={editedBlog.content}
                  onChange={handleInputChange}
                  rows="15"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="tags">Tags (comma-separated)</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={editedBlog.tags.join(', ')}
                  onChange={(e) => {
                    const tagsArray = e.target.value.split(',').map(tag => tag.trim());
                    setEditedBlog(prev => ({
                      ...prev,
                      tags: tagsArray
                    }));
                  }}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="featuredImage">Featured Image URL</label>
                <input
                  type="text"
                  id="featuredImage"
                  name="featuredImage"
                  value={editedBlog.featuredImage}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          ) : (
            <>
              <div className={styles.blogHeader}>
                <h1 className={styles.blogTitle}>{blog.title}</h1>
                <div className={styles.blogMeta}>
                  <span className={styles.blogType}>{blog.type}</span>
                  <span className={styles.blogDate}>Published: {new Date(blog.publishDate).toLocaleDateString()}</span>
                  <span className={styles.blogAuthor}>By: {blog.author}</span>
                </div>
                <div className={styles.blogStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Views:</span>
                    <span className={styles.statValue}>{blog.views.toLocaleString()}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Shares:</span>
                    <span className={styles.statValue}>{blog.shares}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Leads:</span>
                    <span className={styles.statValue}>{blog.leads}</span>
                  </div>
                </div>
                {blog.featuredImage && (
                  <div className={styles.featuredImage}>
                    <img src={blog.featuredImage} alt={blog.title} />
                  </div>
                )}
                <div className={styles.blogTags}>
                  {blog.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
              
              <div 
                className={styles.blogBody}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
              
              <div className={styles.blogFooter}>
                <div className={styles.metaInfo}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Status:</span>
                    <span className={`${styles.metaValue} ${styles[`status${blog.status}`]}`}>{blog.status}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Last Updated:</span>
                    <span className={styles.metaValue}>{new Date(blog.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DashboardSection>
    </div>
  );
};

export default BlogDetail;
