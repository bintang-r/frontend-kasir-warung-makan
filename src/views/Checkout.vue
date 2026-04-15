<template>
  <div class="p-4 bg-gray-50 min-h-screen pb-24">
    <div class="flex items-center mb-6 pt-2">
      <router-link to="/cart" class="p-2 -ml-2 text-gray-500 hover:text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </router-link>
      <h2 class="text-xl font-bold ml-2">Checkout</h2>
    </div>

    <!-- Tipe Pesanan -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
      <h3 class="font-bold text-gray-800 mb-3">Tipe Pesanan</h3>
      <div class="grid grid-cols-2 gap-3">
        <label class="border rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer transition-colors" :class="orderType === 'DINE_IN' ? 'border-primary bg-red-50 text-primary' : 'border-gray-200 text-gray-600'">
          <input type="radio" v-model="orderType" value="DINE_IN" class="hidden" />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
          <span class="font-semibold text-sm text-center">Makan di Tempat<br/><span v-if="authStore.tableId" class="text-xs font-normal">(Meja {{ authStore.tableId }})</span></span>
        </label>
        
        <label class="border rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer transition-colors" :class="orderType === 'TAKEAWAY' ? 'border-primary bg-red-50 text-primary' : 'border-gray-200 text-gray-600'">
          <input type="radio" v-model="orderType" value="TAKEAWAY" class="hidden" />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <span class="font-semibold text-sm">Bungkus</span>
        </label>
      </div>
    </div>

    <!-- Ringkasan -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
      <h3 class="font-bold text-gray-800 mb-3 border-b pb-2">Ringkasan Pembayaran</h3>
      <div class="flex justify-between font-bold text-lg text-gray-800 mt-2">
        <span>Total Dibayar</span>
        <span class="text-primary">Rp {{ formatPrice(cartStore.totalPrice) }}</span>
      </div>
    </div>

    <!-- Bottom Action -->
    <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 p-4 z-40">
      <button @click="submitOrder" :disabled="isSubmitting" class="w-full bg-primary text-white py-3.5 rounded-xl font-semibold shadow-md hover:bg-primary-hover transition-colors flex justify-center items-center gap-2 disabled:bg-gray-400">
        <div v-if="isSubmitting" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span>{{ isSubmitting ? 'Memproses...' : 'Buat Pesanan' }}</span>
      </button>
    </div>
    
    <NotificationToast ref="toast" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { useOrderStore } from '../stores/order';
import NotificationToast from '../components/NotificationToast.vue';

const cartStore = useCartStore();
const authStore = useAuthStore();
const orderStore = useOrderStore();
const router = useRouter();

const toast = ref(null);
const orderType = ref('DINE_IN');
const isSubmitting = ref(false);

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price);
};

onMounted(() => {
  if (cartStore.items.length === 0) {
    router.push('/cart');
  }
});

const submitOrder = async () => {
  if (!cartStore.id) return;
  
  isSubmitting.value = true;
  try {
    const order = await orderStore.placeOrder(cartStore.id, orderType.value);
    cartStore.clearCartLocally();
    toast.value?.display('Pesanan berhasil dibuat!');
    
    setTimeout(() => {
      router.replace('/order-status?id=' + order.id);
    }, 1500);
  } catch (err) {
    console.error('Checkout error:', err);
    toast.value?.display('Gagal membuat pesanan', 'error');
    isSubmitting.value = false;
  }
};
</script>
