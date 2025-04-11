import React from 'react';

/**
 * FTFC Logo Component
 * @param {Object} props - Component props
 * @param {string} props.color - Logo color
 * @param {number} props.size - Logo size
 * @returns {JSX.Element} - Logo component
 */
const FTFCLogo = ({ color = '#f59e0b', size = 192 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 192 192"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="192" height="192" rx="32" fill={color} />
      <text
        x="96"
        y="112"
        fontFamily="Arial, sans-serif"
        fontSize="72"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        FTFC
      </text>
    </svg>
  );
};

export default FTFCLogo;
