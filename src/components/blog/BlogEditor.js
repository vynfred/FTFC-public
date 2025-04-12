import { Editor } from '@tinymce/tinymce-react';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useRef, useState } from 'react';
import { FaCalendarAlt, FaEye, FaEyeSlash, FaImage, FaTimes } from 'react-icons/fa';
import styles from './BlogEditor.module.css';

/**
 * BlogEditor component for creating and editing blog posts
 *
 * @param {Object} props
 * @param {Object} props.post - The blog post data
 * @param {Function} props.onChange - Function called when post data changes
 * @param {boolean} props.isSubmitting - Whether the form is submitting
 */
const BlogEditor = ({ post, onChange, isSubmitting = false }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef(null);
  const socialImageInputRef = useRef(null);

  // Handle content change
  const handleEditorChange = (content) => {
    onChange({ ...post, content });
  };

  // Handle image upload in the editor
  const handleEditorImageUpload = async (blobInfo, progress) => {
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
  };

  // Handle main image upload
  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, or WEBP)');
        return;
      }

      onChange({ ...post, mainImage: file });

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...post, mainImage: file, mainImagePreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle social image upload
  const handleSocialImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, or WEBP)');
        return;
      }

      // Validate dimensions for social sharing (ideal: 1200x630)
      const img = new Image();
      img.onload = () => {
        if (img.width < 1200 || img.height < 630) {
          alert('For best results on social media, image should be at least 1200x630 pixels');
        }

        onChange({ ...post, socialImage: file, socialImagePreview: img.src });
      };

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle tag input
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  // Handle tag input keydown
  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  // Add a tag
  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !post.tags.includes(tag)) {
      onChange({ ...post, tags: [...post.tags, tag] });
      setTagInput('');
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove) => {
    onChange({
      ...post,
      tags: post.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div>
      {/* Title */}
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.formLabel}>Title</label>
        <input
          id="title"
          type="text"
          value={post.title}
          onChange={(e) => onChange({ ...post, title: e.target.value })}
          placeholder="Enter post title"
          className={styles.formInput}
          disabled={isSubmitting}
          required
        />
      </div>

      {/* Meta Description */}
      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.formLabel}>
          Meta Description
        </label>
        <textarea
          id="description"
          value={post.description}
          onChange={(e) => onChange({ ...post, description: e.target.value })}
          placeholder="Enter meta description (max 160 characters)"
          className={`${styles.formTextarea} ${post.description.length > 155 ? styles.warningLength : ''}`}
          maxLength="160"
          disabled={isSubmitting}
          required
        />
        <span className={`${styles.helperText} ${post.description.length > 155 ? styles.warningText : ''}`}>
          {post.description.length}/160 characters (for SEO)
          {post.description.length > 155 && <span> - Approaching limit</span>}
        </span>
        <span className={styles.seoTip}>
          A good meta description summarizes the content and includes relevant keywords.
        </span>
      </div>

      {/* Content Editor */}
      <div className={styles.editorContainer}>
        <label className={styles.editorLabel}>Content</label>
        <div className={styles.editorWrapper}>
          <Editor
            apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
            value={post.content}
            onEditorChange={handleEditorChange}
            disabled={isSubmitting}
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
              images_upload_handler: handleEditorImageUpload,
              content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 16px; color: #f8f9fa; }',
              skin: 'oxide-dark',
              content_css: 'dark'
            }}
          />
        </div>
      </div>

      {/* Main Featured Image */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Main Featured Image</label>
        <div className={styles.imagePreview}>
          {post.mainImagePreview ? (
            <img src={post.mainImagePreview} alt="Featured" />
          ) : (
            <div className={styles.imagePreviewPlaceholder}>
              No image selected
            </div>
          )}
        </div>
        <button
          type="button"
          className={styles.imageUploadButton}
          onClick={() => fileInputRef.current.click()}
          disabled={isSubmitting}
        >
          <FaImage className={styles.imageUploadIcon} />
          Select Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleMainImageUpload}
          className={styles.imageInput}
          disabled={isSubmitting}
        />
        <input
          type="text"
          placeholder="Alt text for main image"
          value={post.mainImageAlt || ''}
          onChange={(e) => onChange({ ...post, mainImageAlt: e.target.value })}
          className={styles.formInput}
          disabled={isSubmitting}
        />
        <span className={styles.helperText}>Recommended size: 1600x900px</span>
      </div>

      {/* Social Share Image */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Social Share Image</label>
        <div className={styles.imagePreview}>
          {post.socialImagePreview ? (
            <img src={post.socialImagePreview} alt="Social" />
          ) : (
            <div className={styles.imagePreviewPlaceholder}>
              No image selected
            </div>
          )}
        </div>
        <button
          type="button"
          className={styles.imageUploadButton}
          onClick={() => socialImageInputRef.current.click()}
          disabled={isSubmitting}
        >
          <FaImage className={styles.imageUploadIcon} />
          Select Image
        </button>
        <input
          ref={socialImageInputRef}
          type="file"
          accept="image/*"
          onChange={handleSocialImageUpload}
          className={styles.imageInput}
          disabled={isSubmitting}
        />
        <input
          type="text"
          placeholder="Alt text for social image"
          value={post.socialImageAlt || ''}
          onChange={(e) => onChange({ ...post, socialImageAlt: e.target.value })}
          className={styles.formInput}
          disabled={isSubmitting}
        />
        <span className={styles.helperText}>Recommended size: 1200x630px</span>
      </div>

      {/* Author */}
      <div className={styles.formGroup}>
        <label htmlFor="author" className={styles.formLabel}>Author</label>
        <input
          id="author"
          type="text"
          value={post.author}
          onChange={(e) => onChange({ ...post, author: e.target.value })}
          placeholder="Enter author name"
          className={styles.formInput}
          disabled={isSubmitting}
          required
        />
      </div>

      {/* Category */}
      <div className={styles.formGroup}>
        <label htmlFor="category" className={styles.formLabel}>Category</label>
        <select
          id="category"
          value={post.category}
          onChange={(e) => onChange({ ...post, category: e.target.value })}
          className={styles.categorySelect}
          disabled={isSubmitting}
          required
        >
          <option value="">Select a category</option>
          <option value="Fundraising">Fundraising</option>
          <option value="Startups">Startups</option>
          <option value="Strategy">Strategy</option>
          <option value="Venture Capital">Venture Capital</option>
          <option value="Growth">Growth</option>
        </select>
      </div>

      {/* Tags */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Tags</label>
        <div className={styles.tagsInput}>
          {post.tags.map((tag, index) => (
            <div key={index} className={styles.tag}>
              <span className={styles.tagText}>{tag}</span>
              <button
                type="button"
                className={styles.removeTag}
                onClick={() => removeTag(tag)}
                disabled={isSubmitting}
              >
                <FaTimes />
              </button>
            </div>
          ))}
          <div className={styles.tagInputWrapper}>
            <input
              type="text"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagInputKeyDown}
              onBlur={addTag}
              placeholder={post.tags.length === 0 ? "Add tags (press Enter)" : ""}
              className={styles.tagInput}
              disabled={isSubmitting}
            />
          </div>
        </div>
        <span className={styles.helperText}>
          Press Enter or comma to add a tag
        </span>
      </div>

      {/* Publication Date */}
      <div className={styles.formGroup}>
        <label htmlFor="datePublished" className={styles.formLabel}>
          Publication Date
        </label>
        <div className={styles.datePickerContainer}>
          <input
            id="datePublished"
            type="date"
            value={post.datePublished ? post.datePublished.split('T')[0] : ''}
            onChange={(e) => onChange({
              ...post,
              datePublished: e.target.value ? new Date(e.target.value).toISOString() : new Date().toISOString()
            })}
            className={styles.datePicker}
            disabled={isSubmitting}
          />
          <FaCalendarAlt className={styles.datePickerIcon} />
        </div>
      </div>

      {/* Preview Toggle */}
      {post.title && post.content && (
        <div className={styles.previewContainer}>
          <div className={styles.previewHeader}>
            <h3 className={styles.previewTitle}>Preview</h3>
            <button
              type="button"
              className={styles.previewToggle}
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? (
                <>
                  <FaEyeSlash />
                  Hide Preview
                </>
              ) : (
                <>
                  <FaEye />
                  Show Preview
                </>
              )}
            </button>
          </div>

          {showPreview && (
            <div className={styles.previewContent}>
              {post.mainImagePreview && (
                <div className={styles.previewImage}>
                  <img src={post.mainImagePreview} alt={post.mainImageAlt || post.title} />
                </div>
              )}
              <h1 className={styles.previewPostTitle}>{post.title}</h1>
              <div className={styles.previewMeta}>
                <span>By {post.author}</span>
                <span>•</span>
                <span>
                  {new Date(post.datePublished).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                {post.category && (
                  <>
                    <span>•</span>
                    <span>{post.category}</span>
                  </>
                )}
              </div>
              <div
                className={styles.previewBody}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogEditor;
