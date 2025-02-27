import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase-config';
import { calculateReadTime } from '../utils/readTime';
import { Helmet } from 'react-helmet';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const BlogPost = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, 'blog'), where('slug', '==', slug));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setPost({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        } else {
          setError('Post not found');
        }
      } catch (err) {
        setError('Error loading post');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      if (post?.category) {
        const q = query(
          collection(db, 'blog'),
          where('category', '==', post.category),
          where('slug', '!=', slug),
          limit(3)
        );
        const snapshot = await getDocs(q);
        setRelatedPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    };

    if (post) fetchRelatedPosts();
  }, [post, slug]);

  const sharePost = (platform) => {
    const url = window.location.href;
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
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!post) return <div className="not-found">Post not found</div>;

  return (
    <>
      <Helmet>
        <title>{post.title} | FTFC Blog</title>
        <meta name="description" content={post.description} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        {post.featuredImage && <meta property="og:image" content={post.featuredImage} />}
        <script type="application/ld+json">
          {JSON.stringify(post.schema)}
        </script>
      </Helmet>
      <article className="blog-post">
        {post.featuredImage && (
          <img src={post.featuredImage} alt={post.title} className="blog-hero-image" />
        )}
        <div className="blog-post-content">
          <h1>{post.title}</h1>
          <div className="blog-meta-top">
            <span>{new Date(post.createdAt.toDate()).toLocaleDateString()}</span>
            <span>·</span>
            <span>{calculateReadTime(post.content)} min read</span>
            <span>·</span>
            <span>By {post.author}</span>
          </div>
          <div 
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className="blog-share">
            <h3>Share this post</h3>
            <div className="share-buttons">
              <button onClick={() => sharePost('facebook')}><FaFacebookF /></button>
              <button onClick={() => sharePost('twitter')}><FaTwitter /></button>
              <button onClick={() => sharePost('linkedin')}><FaLinkedinIn /></button>
            </div>
          </div>
          {relatedPosts.length > 0 && (
            <div className="related-posts">
              <h3>Related Posts</h3>
              <div className="blog-grid">
                {relatedPosts.map(relatedPost => (
                  <article key={relatedPost.id} className="blog-card">
                    {/* Similar to BlogList card content */}
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
};

export default BlogPost; 