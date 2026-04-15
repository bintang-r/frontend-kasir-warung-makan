<template>
  <div v-if="cartStore.totalItems > 0" class="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-40 transform transition-transform duration-300">
    <div class="flex justify-between items-center mb-3">
      <div>
        <span class="text-xs text-gray-500 block">Total Pesanan</span>
        <span class="font-bold text-lg text-gray-800">{{ cartStore.totalItems }} Items</span>
      </div>
      <div class="text-right">
        <span class="text-xs text-gray-500 block">Total Harga</span>
        <span class="font-bold text-lg text-primary">Rp {{ formatPrice(cartStore.totalPrice) }}</span>
      </div>
    </div>
    <button @click="goToCheckout" class="w-full bg-primary text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-primary-hover transition-colors flex justify-center items-center gap-2">
      <span>Checkout Sekarang</span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const router = useRouter();

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price);
};

const goToCheckout = () => {
  router.push('/checkout');
};
</script>
