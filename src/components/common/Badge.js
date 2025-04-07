import React from 'react';
import styles from './Badge.module.css';

/**
 * Badge component for displaying status, counts, or labels
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} props.variant - Badge style variant: 'primary', 'secondary', 'success', 'warning', 'danger', 'info', 'light', 'dark'
 * @param {string} props.size - Badge size: 'small', 'medium', 'large'
 * @param {React.ReactNode} props.iconLeft - Icon to display on the left
 * @param {React.ReactNode} props.iconRight - Icon to display on the right
 * @param {boolean} props.pill - Whether to use pill shape (more rounded)
 * @param {boolean} props.square - Whether to use square shape (less rounded)
 * @param {boolean} props.dot - Whether to display as a dot (no content)
 * @param {string} props.className - Additional CSS class names
 */
const Badge = ({
  children,
  variant = 'primary',
  size = 'medium',
  iconLeft,
  iconRight,
  pill = false,
  square = false,
  dot = false,
  className = '',
  ...rest
}) => {
  // Determine CSS classes based on props
  const badgeClasses = [
    styles.badge,
    styles[variant],
    styles[size],
    pill ? styles.pill : '',
    square ? styles.square : '',
    dot ? styles.dot : '',
    (iconLeft || iconRight) && !dot ? styles.withIcon : '',
    className
  ].filter(Boolean).join(' ');

  // If it's a dot badge, don't render children
  if (dot) {
    return <span className={badgeClasses} {...rest} />;
  }

  return (
    <span className={badgeClasses} {...rest}>
      {iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}
      {children}
      {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
    </span>
  );
};

export default Badge;
