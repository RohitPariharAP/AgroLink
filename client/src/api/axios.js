// client/src/api/axios.js
import axios from 'axios';

const API = axios.create({
  // Swap out the localhost link for your new live backend!
  baseURL: 'https://agrolink-fnwu.onrender.com/api', 
});

// Automatically attach the JWT token to every request if the user is logged in
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;