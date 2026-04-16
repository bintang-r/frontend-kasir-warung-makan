import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

export const useAuthStore = defineStore('auth', () => {
  let storedUser = localStorage.getItem('user');
  if (storedUser === 'undefined') storedUser = null;
  const user = ref(storedUser ? JSON.parse(storedUser) : null);
  const token = ref(localStorage.getItem('token') || null);
  const guestToken = ref(localStorage.getItem('guest_token') || null);

  const isAuthenticated = computed(() => !!token.value);
  const isGuest = computed(() => !!guestToken.value);
  const isStaff = computed(() => {
    return user.value && ['ADMIN', 'KASIR', 'KITCHEN', 'DRIVER'].includes(user.value.role);
  });
  const isCustomer = computed(() => {
    return user.value && user.value.role === 'CUSTOMER';
  });
  const userRole = computed(() => user.value?.role || (isGuest.value ? 'GUEST' : null));

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;
      
      if (!data.access_token) {
        throw new Error('No access token received');
      }

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
    isStaff,
    isCustomer,
    userRole,
    login,
    logout,
    setGuestSession,
    clearGuestSession,
  };
});
