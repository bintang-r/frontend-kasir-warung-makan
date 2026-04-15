<template>
  <div class="p-4 relative min-h-screen pb-24">
    <div class="flex justify-between items-center mb-6 pt-2">
      <h2 class="text-2xl font-bold text-gray-800">Daftar Menu</h2>
      <!-- Basic Search Icon Placeholder -->
      <button class="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>

    <!-- Menu Grid -->
    <div v-else-if="menus.length > 0" class="grid grid-cols-2 gap-4">
      <MenuCard 
        v-for="menu in menus" 
        :key="menu.id" 
        :menu="menu" 
        @add-to-cart="handleAddToCart"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20 text-gray-500">
      <p>Menu tidak tersedia saat ini.</p>
    </div>

    <!-- Notification Toast -->
    <NotificationToast ref="toast" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import { useCartStore } from '../stores/cart';
import MenuCard from '../components/MenuCard.vue';
import NotificationToast from '../components/NotificationToast.vue';

const menus = ref([]);
const isLoading = ref(true);
const toast = ref(null);
const cartStore = useCartStore();

const fetchMenus = async () => {
  try {
    isLoading.value = true;
    const response = await api.get('/menus');
    
    // Convert BigInt to string if needed, although axios might receive it as string or number from NestJS
    menus.value = response.data;
  } catch (error) {
    console.error('Failed to fetch menus:', error);
    toast.value?.display('Gagal memuat menu dari server', 'error');
  } finally {
    isLoading.value = false;
  }
};

const handleAddToCart = async (menu) => {
  try {
    // Add to pinia cart store -> calls backend
    await cartStore.addItem(menu.id, 1);
    toast.value?.display(`${menu.name} ditambahkan ke keranjang`, 'success');
  } catch (error) {
    toast.value?.display('Gagal menambahkan ke keranjang', 'error');
  }
};

onMounted(() => {
  fetchMenus();
  // Fetch existing cart if any
  cartStore.fetchCart();
});
</script>
