<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header Banner -->
    <div class="bg-primary text-white p-6 rounded-b-3xl shadow-md">
      <h1 class="text-2xl font-bold mb-2">RM Siantar Minang</h1>
      <p class="text-white/80 text-sm">Masakan Padang Asli Terlezat. Silakan pesan menu favorit Anda.</p>
    </div>

    <div class="p-4 mt-2">
      <!-- Quick Actions -->
      <div class="flex gap-4 mb-8">
        <router-link to="/menu" class="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
          <div class="bg-red-50 p-3 rounded-full text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <span class="font-semibold text-gray-800 text-sm">Pesan Dine-In</span>
        </router-link>
        <button class="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors opacity-60 cursor-not-allowed">
          <div class="bg-blue-50 p-3 rounded-full text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
          <span class="font-semibold text-gray-800 text-sm">Delivery (Soon)</span>
        </button>
      </div>

      <div class="mb-4">
        <h2 class="text-lg font-bold text-gray-800 mb-3">Kategori Pilihan</h2>
        
        <div v-if="isLoading" class="flex justify-center p-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        
        <div v-else class="flex overflow-x-auto gap-3 pb-2 scrollbar-none">
          <div v-for="cat in categories" :key="cat.id" class="flex-shrink-0 bg-white rounded-lg shadow-sm border border-gray-100 px-4 py-2 hover:bg-red-50 hover:border-red-100 cursor-pointer">
            <span class="font-medium inline-block text-gray-700 text-sm whitespace-nowrap">{{ cat.name }}</span>
          </div>
          <div v-if="categories.length === 0" class="text-gray-400 text-sm p-2">Belum ada kategori.</div>
        </div>
      </div>
      
      <div class="mt-8 bg-orange-50 p-4 rounded-xl border border-orange-100">
        <h3 class="font-bold text-orange-800">Cek Meja QR</h3>
        <p class="text-sm text-orange-700 mt-1">Scan QR Code di meja Anda menggunakan kamera HP untuk langsung memesan tanpa antri kasir!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const categories = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const res = await api.get('/categories');
    categories.value = res.data;
  } catch (err) {
    console.error('Failed to load categories', err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-none {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>

