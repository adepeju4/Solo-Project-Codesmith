import React from 'react';
import { render } from 'react-dom';
import App from './components/App.js';
import { ErrorBoundary } from './ErrorBoundary.js';

render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);
