import React from 'react';
import { Link } from 'react-router-dom';
import { createTestPost } from '../utils/createTestPost';

const AdminPortal = () => {
  return (
    <div className="admin-portal">
      <h1>Admin Portal</h1>
      
      <section className="admin-section">
        <h2>Blog Management</h2>
        <div className="admin-actions">
          <Link to="/admin/blog/create" className="admin-button">
            Create New Post
          </Link>
          <button 
            onClick={createTestPost}
            className="admin-button secondary"
          >
            Create Test Post
          </button>
        </div>
      </section>
      
      {/* Other admin sections */}
    </div>
  );
};

export default AdminPortal; 