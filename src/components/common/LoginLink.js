import React from 'react';
import { Link } from 'react-router-dom';

/**
 * LoginLink component that scrolls to the top of the page when clicked
 *
 * @param {Object} props - Component props
 * @param {string} props.to - The path to navigate to
 * @param {React.ReactNode} props.children - The link text or content
 * @param {Object} props.style - Optional style object
 * @param {string} props.className - Optional CSS class name
 */
const LoginLink = ({ to, children, style, className, ...rest }) => {
  const handleClick = (e) => {
    // Force scroll to top immediately
    window.scrollTo(0, 0);

    // Set multiple timeouts to ensure it works after navigation
    // This is a more aggressive approach to ensure scrolling works
    setTimeout(() => window.scrollTo(0, 0), 0);
    setTimeout(() => window.scrollTo(0, 0), 50);
    setTimeout(() => window.scrollTo(0, 0), 100);
    setTimeout(() => window.scrollTo(0, 0), 200);
    setTimeout(() => window.scrollTo(0, 0), 300);
    setTimeout(() => window.scrollTo(0, 0), 500);
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      style={style}
      className={className}
      {...rest}
    >
      {children}
    </Link>
  );
};

export default LoginLink;
