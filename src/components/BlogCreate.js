import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase-config';
import { Editor } from '@tinymce/tinymce-react';

const BlogCreate = () => {
  const [post, setPost] = useState({
    title: '',
    description: '',
    content: '',
    author: '',
    mainImage: null,
    socialImage: null,
    mainImageAlt: '',
    socialImageAlt: '',
    tags: [],
    category: '',
    datePublished: new Date().toISOString(),
    lastModified: new Date().toISOString()
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Upload image if exists
      let imageUrl = '';
      if (post.mainImage) {
        const storage = getStorage();
        const imageRef = ref(storage, `blog/${post.mainImage.name}`);
        await uploadBytes(imageRef, post.mainImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Create schema markup
      const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.description,
        "image": imageUrl,
        "author": {
          "@type": "Person",
          "name": post.author
        },
        "datePublished": post.datePublished,
        "dateModified": post.lastModified,
        "publisher": {
          "@type": "Organization",
          "name": "First Time Founder Capital",
          "logo": {
            "@type": "ImageObject",
            "url": "https://yourwebsite.com/logo.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://yourwebsite.com/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`
        }
      };

      // Save to Firestore
      await addDoc(collection(db, 'blog'), {
        ...post,
        featuredImage: imageUrl,
        schema: schema,
        slug: post.title.toLowerCase().replace(/\s+/g, '-'),
        createdAt: new Date()
      });

      // Reset form
      setPost({
        title: '',
        description: '',
        content: '',
        author: '',
        mainImage: null,
        socialImage: null,
        mainImageAlt: '',
        socialImageAlt: '',
        tags: [],
        category: '',
        datePublished: new Date().toISOString(),
        lastModified: new Date().toISOString()
      });

      setSuccessMessage('Post created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      console.error('Error creating blog post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="blog-create-container">
      <h1>Create Blog Post</h1>
      <form onSubmit={handleSubmit} className="blog-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={post.title}
            onChange={(e) => setPost({...post, title: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Meta Description</label>
          <textarea
            value={post.description}
            onChange={(e) => setPost({...post, description: e.target.value})}
            maxLength="160"
            required
          />
          <span className="helper-text">Maximum 160 characters for SEO</span>
        </div>

        <div className="form-group">
          <label>Content</label>
          <Editor
            apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
            value={post.content}
            onEditorChange={(content) => setPost({...post, content})}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
              ],
              toolbar: 'undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | image | removeformat | help',
              images_upload_handler: async (blobInfo, progress) => {
                try {
                  const file = blobInfo.blob();
                  const storage = getStorage();
                  const imageRef = ref(storage, `blog/inline/${file.name}`);
                  await uploadBytes(imageRef, file);
                  const url = await getDownloadURL(imageRef);
                  return url;
                } catch (error) {
                  console.error('Error uploading image:', error);
                  throw new Error('Image upload failed');
                }
              }
            }}
          />
        </div>

        <div className="form-group">
          <label>Main Featured Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPost({...post, mainImage: e.target.files[0]})}
          />
          <input
            type="text"
            placeholder="Alt text for main image"
            value={post.mainImageAlt}
            onChange={(e) => setPost({...post, mainImageAlt: e.target.value})}
          />
          <span className="helper-text">Recommended size: 1600x900px</span>
        </div>

        <div className="form-group">
          <label>Social Share Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPost({...post, socialImage: e.target.files[0]})}
          />
          <input
            type="text"
            placeholder="Alt text for social image"
            value={post.socialImageAlt}
            onChange={(e) => setPost({...post, socialImageAlt: e.target.value})}
          />
          <span className="helper-text">Recommended size: 1200x630px</span>
        </div>

        <div className="form-group">
          <label>Author</label>
          <input
            type="text"
            value={post.author}
            onChange={(e) => setPost({...post, author: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={post.category}
            onChange={(e) => setPost({...post, category: e.target.value})}
            required
          >
            <option value="">Select a category</option>
            <option value="Fundraising">Fundraising</option>
            <option value="Startups">Startups</option>
            <option value="Strategy">Strategy</option>
          </select>
        </div>

        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input
            type="text"
            value={post.tags.join(', ')}
            onChange={(e) => setPost({
              ...post, 
              tags: e.target.value.split(',').map(tag => tag.trim())
            })}
            placeholder="e.g. Fundraising, Pitch Deck, Strategy"
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
    </div>
  );
};

export default BlogCreate; 