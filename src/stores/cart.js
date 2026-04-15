import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

export const useCartStore = defineStore('cart', () => {
  const items = ref([]);
  const id = ref(null);

  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => {
      // Handle the nested menu item pricing structure
      return total + (item.menu?.price * item.quantity);
    }, 0);
  });

  const fetchCart = async () => {
    try {
      const response = await api.get('/carts');
      id.value = response.data.id;
      items.value = response.data.items || [];
    } catch (e) {
      console.error('Error fetching cart', e);
    }
  };

  const addItem = async (menuId, quantity = 1) => {
    try {
      await api.post('/carts/add', { menuId, qty: quantity });
      await fetchCart(); // Refresh cart to get actual DB state
    } catch (e) {
      console.error('Error adding item', e);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/carts/remove/${itemId}`);
      await fetchCart(); // Refresh cart
    } catch (e) {
      console.error('Error removing item', e);
    }
  };

  const clearCartLocally = () => {
    items.value = [];
    id.value = null;
  };

  return {
    items,
    id,
    totalItems,
    totalPrice,
    fetchCart,
    addItem,
    removeItem,
    clearCartLocally
  };
});
