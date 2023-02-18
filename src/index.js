import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import App from './App';
import axios from 'axios';
import {API_BASE_URL} from "./constants";

axios.defaults.baseURL = API_BASE_URL+"/api/admin/";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
