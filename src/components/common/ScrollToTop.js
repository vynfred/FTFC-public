import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component that aggressively scrolls to the top of the page on route change
 * This component should be placed inside the Router component in App.js
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediate scroll
    window.scrollTo(0, 0);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

    // Set multiple timeouts to ensure it works
    const timeoutIds = [];
    for (let i = 0; i < 10; i++) {
      timeoutIds.push(
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }, i * 100) // 0ms, 100ms, 200ms, etc.
      );
    }

    return () => timeoutIds.forEach(id => clearTimeout(id));
  }, [pathname]);

  return null;
};

export default ScrollToTop;
