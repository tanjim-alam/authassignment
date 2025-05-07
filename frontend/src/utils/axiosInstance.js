import axios from 'axios';
// https://authassignment-production.up.railway.app/
// http://localhost:8000/api
const axiosInstance = axios.create({
  baseURL: 'https://authassignment-production.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
