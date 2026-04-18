import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';

export const useOrderStore = defineStore('order', () => {
  const currentOrder = ref(null);
  const orderHistory = ref([]);

  const placeOrder = async (cartId, orderType, address, tableId) => {
    try {
      const response = await api.post('/orders', { 
        cartId: cartId.toString(), 
        orderType,
        address,
        tableId: tableId?.toString()
      });
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

  const confirmReceived = async (orderId) => {
    try {
      const response = await api.put(`/orders/${orderId}/received`);
      currentOrder.value = response.data;
      return response.data;
    } catch (e) {
      console.error('Error confirming receipt', e);
      throw e;
    }
  };

  const submitReview = async (orderId, rating, comment) => {
    try {
      const response = await api.post(`/orders/${orderId}/review`, { rating, comment });
      return response.data;
    } catch (e) {
      console.error('Error submitting review', e);
      throw e;
    }
  };

  const processPayment = async (orderId, method, amount) => {
    try {
      const response = await api.post('/payments/process', { 
        orderId: orderId.toString(), 
        method, 
        amount 
      });
      return response.data;
    } catch (e) {
      console.error('Error processing payment', e);
      throw e;
    }
  };

  const verifyVoucher = async (code) => {
    try {
      const response = await api.get(`/promos/vouchers/verify/${code}`);
      return response.data;
    } catch (e) {
      console.error('Error verifying voucher', e);
      throw e;
    }
  };

  return {
    currentOrder,
    orderHistory,
    placeOrder,
    fetchOrderHistory,
    getOrderById,
    confirmReceived,
    submitReview,
    processPayment,
    verifyVoucher
  };
});
