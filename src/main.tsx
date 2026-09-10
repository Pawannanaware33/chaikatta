import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// Ensure dark class is removed and clean up legacy theme storage
if (typeof document !== 'undefined') {
  document.documentElement.classList.remove('dark');
}
if (typeof localStorage !== 'undefined') {
  localStorage.removeItem('chai_katta_theme');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
