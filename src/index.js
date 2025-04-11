import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();