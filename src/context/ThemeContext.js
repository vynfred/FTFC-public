import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const ThemeContext = createContext();

// Custom hook to use the context
export const useTheme = () => useContext(ThemeContext);

// Provider component
export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to 'dark'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  });

  // Update document theme attribute when theme changes
  useEffect(() => {
    if (theme === 'system') {
      // Use system preference
      document.documentElement.removeAttribute('data-theme');
    } else {
      // Use selected theme
      document.documentElement.setAttribute('data-theme', theme);
    }
    // Save theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'light';
      return 'dark'; // Default to dark if theme is something else
    });
  };

  // Set a specific theme
  const setSpecificTheme = (newTheme) => {
    if (['light', 'dark', 'high-contrast', 'system'].includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setSpecificTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
