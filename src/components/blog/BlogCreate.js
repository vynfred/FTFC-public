import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaSave, FaTimes } from 'react-icons/fa';
import { db } from '../../firebase-config';
import BlogEditor from './BlogEditor';
import styles from './Blog.module.css';

/**
 * BlogCreate component for creating new blog posts
 */
const BlogCreate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [post, setPost] = useState({
    title: '',
    description: '',
    content: '',
    author: '',
    category: '',
    tags: [],
    datePublished: new Date().toISOString(),
    mainImage: null,
    mainImageAlt: '',
    socialImage: null,
    socialImageAlt: ''
  });

  // Handle post data changes
  const handlePostChange = (updatedPost) => {
    setPost(updatedPost);
  };

  // Generate a slug from the title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  // Upload images to Firebase Storage
  const uploadImages = async () => {
    const storage = getStorage();
    const uploadPromises = [];
    const uploadedUrls = {};

    // Upload main image if exists
    if (post.mainImage) {
      const mainImageRef = ref(storage, `blog/featured/${Date.now()}-${post.mainImage.name}`);
      const mainImageUpload = uploadBytes(mainImageRef, post.mainImage).then(async () => {
        const url = await getDownloadURL(mainImageRef);
        uploadedUrls.mainImageUrl = url;
      });
      uploadPromises.push(mainImageUpload);
    }

    // Upload social image if exists
    if (post.socialImage) {
      const socialImageRef = ref(storage, `blog/social/${Date.now()}-${post.socialImage.name}`);
      const socialImageUpload = uploadBytes(socialImageRef, post.socialImage).then(async () => {
        const url = await getDownloadURL(socialImageRef);
        uploadedUrls.socialImageUrl = url;
      });
      uploadPromises.push(socialImageUpload);
    }

    await Promise.all(uploadPromises);
    return uploadedUrls;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!post.title || !post.content) {
      setError('Title and content are required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Upload images
      const uploadedUrls = await uploadImages();
      
      // Generate slug
      const slug = generateSlug(post.title);
      
      // Create post document
      const postData = {
        title: post.title,
        description: post.description,
        content: post.content,
        author: post.author,
        category: post.category,
        tags: post.tags,
        datePublished: post.datePublished,
        mainImageUrl: uploadedUrls.mainImageUrl || null,
        mainImageAlt: post.mainImageAlt,
        socialImageUrl: uploadedUrls.socialImageUrl || null,
        socialImageAlt: post.socialImageAlt,
        slug,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'blog'), postData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/blog');
      }, 2000);
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Error creating post: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.blogCreateContainer}>
      <h1>Create New Blog Post</h1>
      
      {error && (
        <div className={styles.error}>{error}</div>
      )}
      
      {success && (
        <div className={styles.successMessage}>
          Post created successfully! Redirecting...
        </div>
      )}
      
      <form className={styles.blogForm} onSubmit={handleSubmit}>
        <BlogEditor
          post={post}
          onChange={handlePostChange}
          isSubmitting={isSubmitting}
        />
        
        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || !post.title || !post.content}
          >
            <FaSave /> {isSubmitting ? 'Creating...' : 'Create Post'}
          </button>
          
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate('/admin/blog')}
            disabled={isSubmitting}
          >
            <FaTimes /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogCreate;
