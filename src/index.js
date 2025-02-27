import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/styles.css';
import App from './App';
import { validateEnv } from './utils/validateEnv';

const container = document.getElementById('root');
const root = createRoot(container);

if (!validateEnv()) {
  throw new Error('Missing required environment variables');
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 