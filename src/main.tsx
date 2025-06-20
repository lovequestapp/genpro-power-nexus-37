
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Basic error handler for external scripts only
const handleGlobalError = (event: ErrorEvent) => {
  // Only suppress known external script errors
  if (event.filename && (
    event.filename.includes('share-modal.js') ||
    event.filename.includes('chrome-extension') ||
    event.filename.includes('moz-extension') ||
    event.filename.includes('safari-extension') ||
    event.filename.includes('edge-extension')
  )) {
    console.warn('Suppressed external script error:', event.error);
    event.preventDefault();
    return false;
  }
  return true;
};

// Add minimal error handling
if (typeof window !== 'undefined') {
  window.addEventListener('error', handleGlobalError, true);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
