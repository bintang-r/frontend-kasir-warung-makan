import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  const token = ref(localStorage.getItem('token') || null);
  const guestToken = ref(localStorage.getItem('guest_token') || null);

  const isAuthenticated = computed(() => !!token.value);
  const isGuest = computed(() => !!guestToken.value);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;
      
      token.value = data.access_token;
      user.value = data.user;
      
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Clear guest session if logging in explicitly
      clearGuestSession();
      return true;
    } catch (e) {
      console.error('Login failed', e);
      return false;
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const setGuestSession = (newGuestToken) => {
    guestToken.value = newGuestToken;
    localStorage.setItem('guest_token', newGuestToken);
    
    // Clear user session if setting guest session
    logout();
  };

  const clearGuestSession = () => {
    guestToken.value = null;
    localStorage.removeItem('guest_token');
  };

  return {
    user,
    token,
    guestToken,
    isAuthenticated,
    isGuest,
    login,
    logout,
    setGuestSession,
    clearGuestSession,
  };
});
