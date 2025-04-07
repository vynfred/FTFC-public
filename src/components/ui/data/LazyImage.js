import React, { useState, useRef, useEffect } from 'react';
import { FaImage, FaExclamationTriangle } from 'react-icons/fa';
import styles from './LazyImage.module.css';

/**
 * LazyImage component for optimized image loading
 * 
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Image alt text
 * @param {string} props.aspectRatio - Aspect ratio ('1x1', '4x3', '16x9', '3x4', '9x16')
 * @param {string} props.placeholderSrc - Placeholder image source URL
 * @param {React.ReactNode} props.placeholderContent - Custom placeholder content
 * @param {React.ReactNode} props.errorContent - Custom error content
 * @param {Function} props.onLoad - Function called when image loads
 * @param {Function} props.onError - Function called when image fails to load
 * @param {string} props.className - Additional CSS class names
 */
const LazyImage = ({
  src,
  alt = '',
  aspectRatio,
  placeholderSrc,
  placeholderContent,
  errorContent,
  onLoad,
  onError,
  className = '',
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);
  
  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad();
    }
  };
  
  // Handle image error
  const handleError = () => {
    setHasError(true);
    if (onError) {
      onError();
    }
  };
  
  // Set up Intersection Observer for lazy loading
  useEffect(() => {
    if (!imgRef.current) return;
    
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Set the src attribute to load the image
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          
          // Disconnect the observer after the image is in view
          observerRef.current.disconnect();
        }
      });
    }, {
      rootMargin: '200px 0px', // Start loading when image is 200px from viewport
      threshold: 0.01
    });
    
    observerRef.current.observe(imgRef.current);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src]);
  
  // Determine container classes
  const containerClasses = [
    styles.container,
    aspectRatio ? styles[`aspect${aspectRatio}`] : '',
    className
  ].filter(Boolean).join(' ');
  
  // Determine image classes
  const imageClasses = [
    styles.image,
    isLoaded ? styles.loaded : ''
  ].filter(Boolean).join(' ');
  
  // Determine placeholder classes
  const placeholderClasses = [
    styles.placeholder,
    isLoaded ? styles.placeholderHidden : ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className={containerClasses}>
      {/* Main image */}
      <img
        ref={imgRef}
        data-src={src}
        alt={alt}
        className={imageClasses}
        onLoad={handleLoad}
        onError={handleError}
        {...rest}
      />
      
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div className={placeholderClasses}>
          {placeholderContent || (
            placeholderSrc ? (
              <img src={placeholderSrc} alt="Loading" />
            ) : (
              <FaImage size={24} />
            )
          )}
        </div>
      )}
      
      {/* Error state */}
      {hasError && (
        <div className={styles.error}>
          {errorContent || (
            <>
              <FaExclamationTriangle className={styles.errorIcon} />
              <span className={styles.errorText}>Failed to load image</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LazyImage;
