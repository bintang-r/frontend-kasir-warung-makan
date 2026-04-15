<template>
  <div class="bg-gray-50/50 min-h-screen pb-32">
    <!-- Header is now in App.vue (TopBar) -->

    <!-- Welcome Message -->
    <div class="px-6 pt-6 pb-2">
       <h2 class="text-sm font-black text-primary uppercase tracking-[0.2em]">Salamaik Datang</h2>
       <p class="text-2xl font-black text-gray-900 leading-tight mt-1">Nio makan apo dunsanak hari ko?</p>
    </div>

    <!-- Promo Banner Slider (Mock) -->
    <div class="px-6 py-4">
      <div class="relative h-44 w-full bg-gradient-to-br from-primary to-primary-dark rounded-3xl shadow-premium overflow-hidden group">
        <div class="absolute inset-0 opacity-10 flex flex-wrap gap-4 p-4 grayscale pointer-events-none">
           <div v-for="n in 20" :key="n" class="w-12 h-12 border-2 border-white rounded-lg rotate-45"></div>
        </div>
        <div class="relative h-full flex flex-col justify-center p-8 text-white">
          <span class="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit">Promo Hari Ini</span>
          <h2 class="text-2xl font-extrabold mt-2 leading-tight">Diskon 30%<br/>Paket Rendang</h2>
          <p class="text-white/70 text-xs mt-2 font-medium">Khusus pemesanan melalui App & QR</p>
        </div>
        <div class="absolute -right-10 bottom-0 opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-700">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-64 h-64">
             <path fill-rule="evenodd" d="M12.964 2.815a.75.75 0 00-1.928 0l-2.43 6.925H3.25a.75.75 0 00-.51 1.348l5.302 4.458-2.02 6.54a.75.75 0 001.157.841L12 19.012l4.82 3.911a.75.75 0 001.159-.84l-2.022-6.54 5.303-4.459a.75.75 0 00-.51-1.347h-5.356l-2.43-6.926z" clip-rule="evenodd" />
           </svg>
        </div>
      </div>
    </div>

    <!-- Quick Actions (Tab Style) -->
    <div class="grid grid-cols-2 gap-4 px-6 mt-4">
      <router-link to="/menu" class="bg-white p-4 rounded-3xl shadow-card border border-gray-100 flex flex-col items-center justify-center gap-3 active:scale-95 transition-all">
        <div class="bg-primary-surface p-4 rounded-2xl text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <span class="font-bold text-gray-800 text-sm">Pesan Dine-In</span>
      </router-link>
      <router-link to="/menu?orderType=DELIVERY" class="bg-white p-4 rounded-3xl shadow-card border border-gray-100 flex flex-col items-center justify-center gap-3 active:scale-95 transition-all">
        <div class="bg-secondary-surface p-4 rounded-2xl text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
        </div>
        <span class="font-bold text-gray-800 text-sm">Antar (Delivery)</span>
      </router-link>
    </div>

    <!-- Category Section -->
    <div class="mt-10">
      <div class="px-6 flex justify-between items-end mb-4">
        <h2 class="text-xl font-bold text-gray-900">Kategori Menu</h2>
        <router-link to="/menu" class="text-primary text-xs font-bold uppercase tracking-widest hover:underline">Semua</router-link>
      </div>
      
      <div v-if="isLoading" class="flex gap-4 px-6 overflow-x-hidden">
        <div v-for="n in 4" :key="n" class="bg-gray-200 h-10 w-28 rounded-2xl animate-pulse"></div>
      </div>
      
      <div v-else class="flex overflow-x-auto gap-4 px-6 pb-2 scrollbar-hide">
        <div 
          v-for="cat in categories" 
          :key="cat.id" 
          @click="router.push(`/menu?categoryId=${cat.id}`)"
          class="flex-shrink-0 bg-white rounded-2xl shadow-card border border-gray-100 flex items-center gap-3 px-5 py-3 hover:bg-primary-surface hover:border-primary/20 transition-all cursor-pointer group active:scale-95"
        >
          <div class="w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
          <span class="font-bold text-gray-700 text-sm whitespace-nowrap group-hover:text-primary">{{ cat.name }}</span>
        </div>
      </div>
    </div>

    <!-- Recommendations Section -->
    <div class="mt-10 px-6">
      <div class="flex justify-between items-end mb-4">
        <h2 class="text-xl font-bold text-gray-900">Rekomendasi Favorit</h2>
        <span class="text-gray-400 text-xs font-medium">Banyak dipesan</span>
      </div>
      
      <div v-if="popularMenus.length === 0 && !isLoading" class="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-50">
        <p class="text-sm font-bold text-gray-500 uppercase tracking-widest">Memuat Menu...</p>
      </div>

      <div v-else class="grid grid-cols-1 gap-4">
         <MenuCard 
           v-for="menu in popularMenus" 
           :key="menu.id" 
           :menu="menu" 
         />
      </div>
    </div>

    <!-- Local Info Card -->
    <div class="px-6 mt-10">
      <div class="bg-white rounded-3xl p-6 shadow-card border border-gray-100 overflow-hidden relative">
        <h3 class="font-black text-gray-900 text-lg leading-tight">Makan Kenyang,<br/>Hati Sanang!</h3>
        <p class="text-gray-500 text-xs mt-2 max-w-[160px]">Layanan dine-in kami menggunakan sistem pembayaran digital yang aman dan cepat.</p>
        <div class="mt-4 flex gap-4">
           <div class="flex flex-col">
             <span class="text-[10px] font-black uppercase text-gray-300">Operational</span>
             <span class="text-xs font-bold text-accent">OPEN NOW</span>
           </div>
           <div class="flex flex-col border-l border-gray-100 pl-4">
             <span class="text-[10px] font-black uppercase text-gray-300">Rating</span>
             <span class="text-xs font-bold text-gray-700">⭐ 4.9 (2k+)</span>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import MenuCard from '../components/MenuCard.vue';

const categories = ref([]);
const popularMenus = ref([]);
const isLoading = ref(true);
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  try {
    const [catRes, menuRes] = await Promise.all([
      api.get('/categories'),
      api.get('/menus') // We'll filter this since there's no specific popular endpoint yet
    ]);
    categories.value = catRes.data;
    // Filter menus that have isPopular: true
    popularMenus.value = menuRes.data
      .filter(m => m.isPopular === true || m.isPopular === 'true')
      .slice(0, 4);
  } catch (err) {
    console.error('Failed to load home data', err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

<style scoped>
</style>
