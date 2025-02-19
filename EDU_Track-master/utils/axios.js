import axios from 'axios';
import { getToken } from './auth'; // Import the updated getToken from auth.js

const instance = axios.create({
  baseURL: 'http://localhost:8081', // Your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  const token = getToken();  // Get the token from sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
