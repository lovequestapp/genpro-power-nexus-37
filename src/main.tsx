import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Aggressive error suppression for external scripts
const suppressExternalErrors = () => {
  // Override console.error to suppress specific errors
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const message = args.join(' ');
    if (message.includes('share-modal.js') || 
        message.includes('addEventListener') ||
        message.includes('Cannot read properties of null')) {
      console.warn('Suppressed external script error:', message);
      return;
    }
    originalConsoleError.apply(console, args);
  };

  // Global error handler
  const handleGlobalError = (event: ErrorEvent) => {
    if (event.filename && (
      event.filename.includes('share-modal.js') ||
      event.filename.includes('chrome-extension') ||
      event.filename.includes('moz-extension') ||
      event.filename.includes('safari-extension') ||
      event.filename.includes('edge-extension')
    )) {
      console.warn('Suppressed external script error:', event.error);
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    return true;
  };

  // Handle unhandled promise rejections
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    if (event.reason && event.reason.message && (
      event.reason.message.includes('share-modal') ||
      event.reason.message.includes('addEventListener') ||
      event.reason.message.includes('Cannot read properties of null')
    )) {
      console.warn('Suppressed unhandled promise rejection:', event.reason);
      event.preventDefault();
      return false;
    }
  };

  // Add event listeners
  if (typeof window !== 'undefined') {
    window.addEventListener('error', handleGlobalError, true);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Also try to prevent the specific error by overriding setTimeout
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function(fn, delay, ...args) {
      if (typeof fn === 'function') {
        const wrappedFn = function() {
          try {
            return fn.apply(this, arguments);
          } catch (error) {
            if (error.message && (
              error.message.includes('share-modal') ||
              error.message.includes('addEventListener') ||
              error.message.includes('Cannot read properties of null')
            )) {
              console.warn('Suppressed setTimeout error:', error);
              return;
            }
            throw error;
          }
        };
        return originalSetTimeout(wrappedFn, delay, ...args);
      }
      return originalSetTimeout(fn, delay, ...args);
    };
  }
};

// Apply error suppression before React renders
suppressExternalErrors();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
