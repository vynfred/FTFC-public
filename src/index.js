import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Import our consolidated CSS
import './styles/index.css';

// Import Chart.js configuration if it exists
try {
  require('./config/chartConfig');
} catch(e) {
  console.warn('Chart config not found:', e);
}

// Import app and providers
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { DateRangeProvider } from './context/DateRangeContext';
import { StatsViewProvider } from './context/StatsViewContext';

// Create root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render app
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DateRangeProvider>
          <StatsViewProvider>
            <App />
          </StatsViewProvider>
        </DateRangeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);