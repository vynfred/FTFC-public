import { collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaEye, FaFilter, FaPlus, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { db } from '../../firebase-config';
import { SearchBar } from '../ui/form';
import styles from './Blog.module.css';

/**
 * BlogManage component for managing blog posts
 */
const BlogManage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);

  // Fetch posts from Firestore
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'blog'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(fetchedPosts);
      setFilteredPosts(fetchedPosts);

      // Extract unique categories
      const uniqueCategories = [...new Set(fetchedPosts.map(post => post.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter posts when search term or category changes
  useEffect(() => {
    if (posts.length > 0) {
      let filtered = [...posts];

      // Apply search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(post =>
          post.title?.toLowerCase().includes(term) ||
          post.content?.toLowerCase().includes(term) ||
          post.author?.toLowerCase().includes(term)
        );
      }

      // Apply category filter
      if (categoryFilter) {
        filtered = filtered.filter(post => post.category === categoryFilter);
      }

      setFilteredPosts(filtered);
    }
  }, [searchTerm, categoryFilter, posts]);

  // Handle post deletion
  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteDoc(doc(db, 'blog', postId));
        await fetchPosts(); // Refresh the list
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      return new Date(timestamp.toDate()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <div className={styles.blogManage}>
      <div className={styles.blogManageHeader}>
        <h2>Manage Blog Posts</h2>
        <Link to="/admin/blog/create" className={`${styles.dashboardButton} ${styles.primary}`}>
          <FaPlus /> Create New Post
        </Link>
      </div>

      <div className={styles.blogFilters}>
        <div className={styles.searchBar}>
          <SearchBar
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.blogSearch}
          />
        </div>

        {categories.length > 0 && (
          <div className={styles.categoryFilter}>
            <span className={styles.filterLabel}>
              <FaFilter /> Filter by:
            </span>
            <div className={styles.categoryButtons}>
              <button
                className={`${styles.categoryButton} ${!categoryFilter ? styles.categoryButtonActive : ''}`}
                onClick={() => setCategoryFilter('')}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  className={`${styles.categoryButton} ${categoryFilter === category ? styles.categoryButtonActive : ''}`}
                  onClick={() => setCategoryFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className={styles.loading}>Loading posts...</div>
      ) : filteredPosts.length > 0 ? (
        <div className={styles.blogManageList}>
          {filteredPosts.map(post => (
            <div key={post.id} className={styles.blogManageItem}>
              <div className={styles.blogManageContent}>
                <h3>{post.title}</h3>
                <div className={styles.blogManageMeta}>
                  <span>Published: {formatDate(post.createdAt)}</span>
                  <span>·</span>
                  <span>By {post.author}</span>
                  {post.category && (
                    <>
                      <span>·</span>
                      <span>Category: {post.category}</span>
                    </>
                  )}
                </div>
              </div>
              <div className={styles.blogManageActions}>
                <Link
                  to={`/blog/${post.slug || post.id}`}
                  target="_blank"
                  className={`${styles.dashboardButton} ${styles.secondary}`}
                >
                  <FaEye /> View
                </Link>
                <Link
                  to={`/admin/blog/edit/${post.id}`}
                  className={`${styles.dashboardButton} ${styles.secondary}`}
                >
                  <FaEdit /> Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className={`${styles.dashboardButton} ${styles.danger}`}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <h3 className={styles.noResultsTitle}>No posts found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default BlogManage;
