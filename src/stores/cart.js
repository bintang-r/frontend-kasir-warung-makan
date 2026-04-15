import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

export const useCartStore = defineStore('cart', () => {
  const items = ref([]);
  const id = ref(null);
  const isCartOpen = ref(false);

  // Backend returns 'qty', normalize to handle both
  const getQty = (item) => item.qty ?? item.quantity ?? 0;

  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + getQty(item), 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => {
      const price = Number(item.menu?.price || 0);
      return total + (price * getQty(item));
    }, 0);
  });

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      id.value = response.data.id;
      items.value = response.data.items || [];
    } catch (e) {
      console.error('Error fetching cart', e);
    }
  };

  const addItem = async (menuId, quantity = 1) => {
    try {
      await api.post('/cart/add', { menuId: menuId.toString(), qty: quantity });
      await fetchCart();
      isCartOpen.value = true;
    } catch (e) {
      console.error('Error adding item', e);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      await removeItem(itemId);
      return;
    }
    try {
      // Optimistic update for instant UI response
      const item = items.value.find(i => i.id == itemId);
      if (item) item.qty = quantity;

      await api.post(`/cart/update/${itemId}`, { qty: quantity });
      await fetchCart(); // Sync with backend
    } catch (e) {
      console.error('Error updating quantity', e);
      await fetchCart(); // Revert on error
    }
  };

  const removeItem = async (itemId) => {
    try {
      // Optimistic update
      items.value = items.value.filter(i => i.id != itemId);

      await api.delete(`/cart/remove/${itemId}`);
      await fetchCart(); // Sync with backend
    } catch (e) {
      console.error('Error removing item', e);
      await fetchCart();
    }
  };

  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value;
  };

  const closeCart = () => {
    isCartOpen.value = false;
  };

  const clearCartLocally = () => {
    items.value = [];
    id.value = null;
  };

  return {
    items,
    id,
    isCartOpen,
    totalItems,
    totalPrice,
    getQty,
    fetchCart,
    addItem,
    updateQuantity,
    removeItem,
    toggleCart,
    closeCart,
    clearCartLocally
  };
});
