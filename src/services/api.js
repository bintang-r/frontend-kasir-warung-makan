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

export default api;
