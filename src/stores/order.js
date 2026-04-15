import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';

export const useOrderStore = defineStore('order', () => {
  const currentOrder = ref(null);
  const orderHistory = ref([]);

  const placeOrder = async (cartId, orderType) => {
    try {
      const response = await api.post('/orders', { cartId: cartId.toString(), orderType });
      currentOrder.value = response.data;
      return currentOrder.value;
    } catch (e) {
      console.error('Error placing order', e);
      throw e;
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const response = await api.get('/orders/history');
      orderHistory.value = response.data;
    } catch (e) {
      console.error('Error fetching order history', e);
    }
  };

  const getOrderById = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      currentOrder.value = response.data;
      return response.data;
    } catch (e) {
      console.error(`Error fetching order ${orderId}`, e);
    }
  };

  return {
    currentOrder,
    orderHistory,
    placeOrder,
    fetchOrderHistory,
    getOrderById
  };
});
