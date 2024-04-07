import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './components/app';
import { ToastContainer } from 'react-toastify';
import MoviesProvider from './hooks/useMovies';
import { Provider } from 'react-redux';
import { createStore } from './store/createStore';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
const store = createStore();

root.render(
  <Provider store={store}>
    <App />
    <ToastContainer />
  </Provider>
);
