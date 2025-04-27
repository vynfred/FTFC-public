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

// Import App
import App from './App';

// Create root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render app with BrowserRouter
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
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