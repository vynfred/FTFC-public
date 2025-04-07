import React from 'react';
import styles from './Card.module.css';

/**
 * Card component with various styles and options
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.variant - Card style variant: 'default', 'light', 'primary', 'secondary'
 * @param {string} props.size - Card size: 'small', 'medium', 'large', 'full'
 * @param {string} props.title - Card title
 * @param {string} props.subtitle - Card subtitle
 * @param {React.ReactNode} props.headerActions - Actions to display in the header
 * @param {React.ReactNode} props.footer - Footer content
 * @param {string} props.imageSrc - Image source URL
 * @param {string} props.imageAlt - Image alt text
 * @param {boolean} props.horizontal - Whether to use horizontal layout
 * @param {boolean} props.hoverable - Whether to show hover effects
 * @param {string} props.className - Additional CSS class names
 * @param {Function} props.onClick - Click handler
 */
const Card = ({
  children,
  variant = 'default',
  size = 'medium',
  title,
  subtitle,
  headerActions,
  footer,
  imageSrc,
  imageAlt = '',
  horizontal = false,
  hoverable = false,
  className = '',
  onClick,
  ...rest
}) => {
  // Determine CSS classes based on props
  const cardClasses = [
    styles.card,
    styles[variant],
    styles[size],
    horizontal ? styles.horizontal : '',
    hoverable ? styles.hoverable : '',
    imageSrc ? styles.withImage : '',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div 
      className={cardClasses} 
      onClick={handleClick}
      {...rest}
    >
      {imageSrc && (
        <img 
          src={imageSrc} 
          alt={imageAlt} 
          className={styles.image} 
        />
      )}
      
      {(title || subtitle || headerActions) && (
        <div className={styles.header}>
          <div>
            {title && <h3 className={styles.title}>{title}</h3>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {headerActions && (
            <div className={styles.headerActions}>
              {headerActions}
            </div>
          )}
        </div>
      )}
      
      <div className={styles.body}>
        {children}
      </div>
      
      {footer && (
        <div className={styles.footer}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
