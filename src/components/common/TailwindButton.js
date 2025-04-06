import React from 'react';

const TailwindButton = ({ children, onClick, variant = 'primary', className = '' }) => {
  // Define variant classes
  const variantClasses = {
    primary: 'bg-primary text-bg-dark hover:bg-primary/90',
    secondary: 'bg-secondary text-white hover:bg-secondary/90',
    outline: 'bg-transparent border border-primary text-primary hover:bg-primary/10',
    dark: 'bg-bg-dark text-white border border-white/10 hover:bg-bg-light'
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded font-semibold transition-all transform hover:-translate-y-0.5 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default TailwindButton;
