import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import { App } from './App';
import { AuthProvider } from './hooks/useAuth';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Theme preset={presetGpnDefault}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </Theme>
  </React.StrictMode>
);
