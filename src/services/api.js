import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const guestToken = localStorage.getItem('guest_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (guestToken) {
    config.headers.Authorization = `Bearer ${guestToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
    
    if (error.response?.status === 401 && !isAuthPage) {
      localStorage.removeItem('token');
      localStorage.removeItem('guest_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const getImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/600x400?text=RM+Siantar+Minang';
  if (url.startsWith('http')) return url;
  // Ensure the relative path starts correctly
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${BASE_URL}${path}`;
};

export default api;
