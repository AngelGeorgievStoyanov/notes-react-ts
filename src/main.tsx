import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoot from './AppRoot';
import './index.css';
import { LoginProvider } from './components/LoginContext';
import ErrorBoundary from './utils/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LoginProvider>
      <ErrorBoundary>
        <AppRoot />
      </ErrorBoundary>
    </LoginProvider>
  </React.StrictMode>,
);
