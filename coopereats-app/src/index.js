// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebaseConfig';
import { Provider } from "react-redux";
import store from './store.js'

// Initialize Firebase only once here
const app = initializeApp(firebaseConfig);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Provider>
);

reportWebVitals();
