import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './components/app';
import './index.css';

import { ToastContainer } from 'react-toastify';

import MoviesProvider from './hooks/useMovies';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <MoviesProvider>
    <App />
    <ToastContainer />
  </MoviesProvider>
);
