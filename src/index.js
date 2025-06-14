import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { AuthProvider } from './context/AuthContext';
import { StatsViewProvider } from './context/StatsViewContext';
import { ThemeProvider } from './context/ThemeContext';

// Import our consolidated CSS
import './styles/index.css';

// Import Chart.js configuration if it exists
try {
  require('./config/chartConfig');
} catch(e) {
  console.warn('Chart config not found:', e);
}

// Import icons to ensure they're available globally
import './components/icons';

// Import and initialize GlobalFaSearch to fix the FaSearch reference error
import initGlobalFaSearch from './components/common/GlobalFaSearch';
initGlobalFaSearch();

// Import App
import App from './App';

// Create root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render app with BrowserRouter
root.render(
  <React.StrictMode>
    <AuthProvider>
      <StatsViewProvider>
        <ThemeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </StatsViewProvider>
    </AuthProvider>
  </React.StrictMode>
);

// Register service worker for PWA functionality
// This will only activate for team members on dashboard routes
// Public pages will function as a normal website
serviceWorkerRegistration.register({
  onSuccess: (registration) => {
    console.log('PWA successfully registered for team dashboard');
  },
  onUpdate: (registration) => {
    console.log('New PWA content is available. Please refresh the page.');
  }
});