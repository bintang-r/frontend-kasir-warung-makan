<template>
  <div class="bg-gray-50/50 min-h-screen pb-32">
    <!-- Header is now in App.vue (TopBar) -->

    <!-- Welcome Message -->
    <div class="px-6 pt-6 pb-2">
       <h2 class="text-sm font-black text-primary uppercase tracking-[0.2em]">Selamat Datang</h2>
       <p class="text-2xl font-black text-gray-900 leading-tight mt-1">Mau makan apa hari ini?</p>
    </div>

    <!-- Active Order Card -->
    <div v-if="activeOrder" class="px-6 py-4 animate-down">
      <div 
        @click="router.push(`/order-status?id=${activeOrder.id}`)"
        class="bg-gray-900 rounded-[32px] p-6 shadow-xl relative overflow-hidden group cursor-pointer active:scale-95 transition-all"
      >
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-colors"></div>
        
        <div class="flex justify-between items-start relative z-10">
           <div>
              <p class="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Pesanan Aktif</p>
              <h3 class="text-xl font-black text-white mt-1">#{{ activeOrder.id.toString() }}</h3>
           </div>
           <div class="flex flex-col items-end">
              <span class="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase rounded-lg tracking-widest shadow-lg shadow-primary/20">
                 {{ formatStatus(activeOrder.status) }}
              </span>
              <span class="text-[9px] text-white/40 font-bold mt-2 uppercase tracking-widest">{{ activeOrder.items.length }} Items</span>
           </div>
        </div>

        <div class="mt-6 flex items-center justify-between relative z-10">
           <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                 <span class="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              </div>
              <p class="text-xs font-bold text-white/80">Lacak perkembangan pesanan Anda...</p>
           </div>
           <div class="text-white group-hover:translate-x-1 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
           </div>
        </div>
      </div>
    </div>

    <!-- Promo Banner Carousel -->
    <div class="px-6 py-4">
      <div v-if="isLoading" class="w-full aspect-[2/1] bg-gray-200 rounded-3xl animate-pulse"></div>
      <div v-else-if="promos.length === 0" class="w-full aspect-[2/1] bg-gray-200 rounded-3xl flex items-center justify-center text-gray-400 font-medium">
        Tidak ada promo saat ini
      </div>
      <div v-else class="relative w-full aspect-[2/1] rounded-3xl shadow-premium overflow-hidden group">
        <!-- Slides container -->
        <div 
          class="flex w-full h-full transition-transform duration-500 ease-out"
          :style="{ transform: `translateX(-${currentPromoIndex * 100}%)` }"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div 
            v-for="(promo, index) in promos" 
            :key="promo.id"
            class="w-full h-full flex-shrink-0 relative"
          >
            <img v-if="promo.image" :src="promo.image" alt="Promo" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
              <i class="fa-solid fa-image text-5xl text-gray-300"></i>
            </div>
            <!-- Overlay Content (optional if Title exists) -->
            <div v-if="promo.title" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
              <h3 class="font-bold text-lg leading-tight">{{ promo.title }}</h3>
              <p v-if="promo.description" class="text-xs text-white/80 line-clamp-1">{{ promo.description }}</p>
            </div>
          </div>
        </div>
        <!-- Indicators -->
        <div class="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          <button 
            v-for="(_, index) in promos" 
            :key="index"
            @click="currentPromoIndex = index"
            class="h-1.5 rounded-full transition-all duration-300"
            :class="index === currentPromoIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'"
          ></button>
        </div>
      </div>
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
          @click="router.push(`/menu?category=${cat.id}`)"
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
           @add-to-cart="handleAddToCart"
         />
      </div>
    </div>

    <!-- Local Info Card -->
    <div class="px-6 mt-10">
      <div class="bg-white rounded-3xl p-6 shadow-card border border-gray-100 overflow-hidden relative">
        <h3 class="font-black text-gray-900 text-lg leading-tight">Makan Kenyang,<br/>Hati Senang!</h3>
        <p class="text-gray-500 text-xs mt-2 max-w-[160px]">Layanan dine-in kami menggunakan sistem pembayaran digital yang aman dan cepat.</p>
        <div class="mt-4 flex gap-4">
           <div class="flex flex-col">
             <span class="text-[10px] font-black uppercase text-gray-300">Operational</span>
             <span class="text-xs font-bold text-accent">OPEN NOW</span>
           </div>
           <div class="flex flex-col border-l border-gray-100 pl-4">
             <span class="text-[10px] font-black uppercase text-gray-300">Rating</span>
             <span class="text-xs font-bold text-gray-700"><i class="fa-solid fa-star text-yellow-400 text-[10px] mr-1"></i> 4.9 (2k+)</span>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';
import MenuCard from '../components/MenuCard.vue';

const categories = ref([]);
const popularMenus = ref([]);
const promos = ref([]);
const isLoading = ref(true);
const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();
const activeOrder = ref(null);

// Carousel Logic
const currentPromoIndex = ref(0);
let autoSlideInterval = null;
let touchStartX = 0;
let touchEndX = 0;

const startAutoSlide = () => {
  stopAutoSlide();
  if (promos.value.length > 1) {
    autoSlideInterval = setInterval(() => {
      currentPromoIndex.value = (currentPromoIndex.value + 1) % promos.value.length;
    }, 4000);
  }
};

const stopAutoSlide = () => {
  if (autoSlideInterval) clearInterval(autoSlideInterval);
};

const handleTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX;
  stopAutoSlide();
};

const handleTouchMove = (e) => {
  touchEndX = e.changedTouches[0].screenX;
};

const handleTouchEnd = () => {
  if (touchStartX - touchEndX > 50) {
    // Swipe left
    currentPromoIndex.value = (currentPromoIndex.value + 1) % promos.value.length;
  } else if (touchEndX - touchStartX > 50) {
    // Swipe right
    currentPromoIndex.value = (currentPromoIndex.value - 1 + promos.value.length) % promos.value.length;
  }
  startAutoSlide();
};

const handleAddToCart = (item) => {
  cartStore.addItem(item.id);
};

onMounted(async () => {
  try {
    const [catRes, menuRes, promoRes] = await Promise.all([
      api.get('/categories'),
      api.get('/menus'),
      api.get('/promos').catch(() => ({ data: [] }))
    ]);
    categories.value = catRes.data;
    popularMenus.value = menuRes.data
      .filter(m => m.isPopular === true || m.isPopular === 'true')
      .slice(0, 4);
      
    promos.value = promoRes.data || [];
    if (promos.value.length > 0) startAutoSlide();

    // Fetch active orders
    const ordersRes = await api.get('/orders');
    const active = (ordersRes.data || []).find(o => !['COMPLETED', 'CANCELLED'].includes(o.status));
    if (active) activeOrder.value = active;
  } catch (err) {
    console.error('Failed to load home data', err);
  } finally {
    isLoading.value = false;
  }
});

onUnmounted(() => {
  stopAutoSlide();
});
const formatStatus = (status) => {
  const statuses = {
    PENDING: 'Sedang Antre',
    CONFIRMED: 'Dikonfirmasi',
    COOKING: 'Sedang Dimasak',
    READY: 'Siap Saji'
  };
  return statuses[status] || status;
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.animate-down {
  animation: slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
