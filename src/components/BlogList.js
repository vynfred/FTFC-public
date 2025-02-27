import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { calculateReadTime } from '../utils/readTime';
import LoadingSpinner from './LoadingSpinner';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'blog'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const fetchedPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        }));
        setPosts(fetchedPosts);

        // Extract unique categories
        const uniqueCategories = [...new Set(fetchedPosts.map(post => post.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const sharePost = (platform, post) => {
    const url = `https://yourwebsite.com/blog/${post.slug}`;
    const text = post.title;

    switch(platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`);
        break;
      default:
        break;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="blog-list-container">
      <div className="page-header">
        <h1>Blog</h1>
        <p>Insights and strategies for startup success</p>
      </div>

      <div className="blog-categories">
        <button 
          className={`category-button ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All Posts
        </button>
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
      
      <div className="blog-grid">
        {filteredPosts.map(post => (
          <article key={post.id} className="blog-card">
            {post.mainImage && (
              <img 
                src={post.mainImage} 
                alt={post.mainImageAlt || post.title} 
                className="blog-card-image"
              />
            )}
            <div className="blog-card-content">
              <div className="blog-category-tag">{post.category}</div>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              <div className="blog-meta">
                <span>{post.createdAt?.toLocaleDateString()}</span>
                <span>·</span>
                <span>By {post.author}</span>
              </div>
              <Link to={`/blog/${post.slug}`} className="read-more">
                Read More →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogList; 