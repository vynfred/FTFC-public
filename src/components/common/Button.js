import React from 'react';
import styles from './Button.module.css';

/**
 * Button component with various styles and options
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button style variant: 'primary', 'secondary', 'outline', 'text'
 * @param {string} props.size - Button size: 'small', 'medium', 'large'
 * @param {React.ReactNode} props.iconLeft - Icon to display on the left
 * @param {React.ReactNode} props.iconRight - Icon to display on the right
 * @param {boolean} props.fullWidth - Whether the button should take full width
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {string} props.className - Additional CSS class names
 * @param {Function} props.onClick - Click handler
 * @param {string} props.type - Button type: 'button', 'submit', 'reset'
 * @param {string} props.ariaLabel - Accessibility label
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ariaLabel,
  ...rest
}) => {
  // Determine CSS classes based on props
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    disabled ? styles.disabled : '',
    (iconLeft || iconRight) ? styles.withIcon : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...rest}
    >
      {iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}
      {children}
      {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
    </button>
  );
};

export default Button;