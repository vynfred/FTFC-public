import React, { createContext, useContext, useState } from 'react';

// Create context
const StatsViewContext = createContext();

// Custom hook to use the context
export const useStatsView = () => useContext(StatsViewContext);

// Provider component
export const StatsViewProvider = ({ children }) => {
  const [viewCompanyStats, setViewCompanyStats] = useState(true);

  return (
    <StatsViewContext.Provider value={{ viewCompanyStats, setViewCompanyStats }}>
      {children}
    </StatsViewContext.Provider>
  );
};
