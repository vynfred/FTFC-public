import React, { createContext, useContext, useState } from 'react';

// Create context
const DateRangeContext = createContext();

// Custom hook to use the context
export const useDateRange = () => useContext(DateRangeContext);

// Provider component
export const DateRangeProvider = ({ children }) => {
  const [dateRange, setDateRange] = useState('Today');

  // Available date ranges
  const dateRanges = ['Today', 'Last 7 Days', 'This Month', 'Last Month', 'Last 30 Days', 'Custom'];

  return (
    <DateRangeContext.Provider value={{ dateRange, setDateRange, dateRanges }}>
      {children}
    </DateRangeContext.Provider>
  );
};
