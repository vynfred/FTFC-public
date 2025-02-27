import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { createTestPost } from '../utils/createTestPost';

const BlogManage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'blog'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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

  if (loading) return <div className="loading">Loading posts...</div>;

  return (
    <div className="blog-manage">
      <div className="blog-manage-header">
        <h2>Manage Blog Posts</h2>
        <Link to="/admin/blog/create" className="dashboard-button primary">
          <FaPlus /> Create New Post
        </Link>
        <button 
          onClick={createTestPost}
          className="dashboard-button primary"
        >
          Create Test Post
        </button>
      </div>

      <div className="blog-manage-list">
        {posts.map(post => (
          <div key={post.id} className="blog-manage-item">
            <div className="blog-manage-content">
              <h3>{post.title}</h3>
              <div className="blog-manage-meta">
                <span>Published: {new Date(post.createdAt?.toDate()).toLocaleDateString()}</span>
                <span>·</span>
                <span>By {post.author}</span>
              </div>
            </div>
            <div className="blog-manage-actions">
              <Link 
                to={`/admin/blog/edit/${post.id}`} 
                className="dashboard-button secondary"
              >
                <FaEdit /> Edit
              </Link>
              <button 
                onClick={() => handleDelete(post.id)}
                className="dashboard-button danger"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogManage; 