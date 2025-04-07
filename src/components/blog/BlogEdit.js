import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaSave, FaTimes } from 'react-icons/fa';
import { db } from '../../firebase-config';
import BlogEditor from './BlogEditor';
import styles from './Blog.module.css';

/**
 * BlogEdit component for editing existing blog posts
 */
const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
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

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'blog', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const postData = docSnap.data();
          
          // Create image previews if URLs exist
          let mainImagePreview = null;
          let socialImagePreview = null;
          
          if (postData.mainImageUrl) {
            mainImagePreview = postData.mainImageUrl;
          }
          
          if (postData.socialImageUrl) {
            socialImagePreview = postData.socialImageUrl;
          }
          
          setPost({
            ...postData,
            tags: postData.tags || [],
            mainImagePreview,
            socialImagePreview
          });
        } else {
          setError('Post not found');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Error fetching post: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);

  // Handle post data changes
  const handlePostChange = (updatedPost) => {
    setPost(updatedPost);
  };

  // Upload images to Firebase Storage
  const uploadImages = async () => {
    const storage = getStorage();
    const uploadPromises = [];
    const uploadedUrls = {};

    // Upload main image if it's a File object (new upload)
    if (post.mainImage instanceof File) {
      const mainImageRef = ref(storage, `blog/featured/${Date.now()}-${post.mainImage.name}`);
      const mainImageUpload = uploadBytes(mainImageRef, post.mainImage).then(async () => {
        const url = await getDownloadURL(mainImageRef);
        uploadedUrls.mainImageUrl = url;
      });
      uploadPromises.push(mainImageUpload);
    } else if (post.mainImagePreview) {
      // Keep existing URL
      uploadedUrls.mainImageUrl = post.mainImagePreview;
    }

    // Upload social image if it's a File object (new upload)
    if (post.socialImage instanceof File) {
      const socialImageRef = ref(storage, `blog/social/${Date.now()}-${post.socialImage.name}`);
      const socialImageUpload = uploadBytes(socialImageRef, post.socialImage).then(async () => {
        const url = await getDownloadURL(socialImageRef);
        uploadedUrls.socialImageUrl = url;
      });
      uploadPromises.push(socialImageUpload);
    } else if (post.socialImagePreview) {
      // Keep existing URL
      uploadedUrls.socialImageUrl = post.socialImagePreview;
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
      
      // Update post document
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
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(doc(db, 'blog', id), postData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/blog');
      }, 2000);
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Error updating post: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading post...</div>;
  }

  return (
    <div className={styles.blogCreateContainer}>
      <h1>Edit Blog Post</h1>
      
      {error && (
        <div className={styles.error}>{error}</div>
      )}
      
      {success && (
        <div className={styles.successMessage}>
          Post updated successfully! Redirecting...
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
            <FaSave /> {isSubmitting ? 'Updating...' : 'Update Post'}
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

export default BlogEdit;
