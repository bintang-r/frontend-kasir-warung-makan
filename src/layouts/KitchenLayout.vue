<template>
  <div class="min-h-screen" style="background: #0f0f0f;">
    <!-- Top Navbar -->
    <header class="kitchen-header fixed top-0 left-0 right-0 z-50 flex items-stretch" style="height: 64px;">

      <!-- Brand (fixed left) -->
      <div class="flex items-center gap-3 px-5 border-r border-white/10 flex-shrink-0">
        <div class="bg-primary p-1.5 rounded-lg">
          <i class="fa-solid fa-fire-burner text-white text-sm"></i>
        </div>
        <div>
          <p class="text-[9px] font-black text-white/30 uppercase tracking-widest leading-none">DAPUR</p>
          <p class="text-sm font-black text-white leading-none">KITCHEN</p>
        </div>
      </div>

      <!-- "Semua Pesanan" button — FIXED, never scrolls -->
      <div class="flex items-center px-2 border-r border-white/10 flex-shrink-0">
        <button
          @click="selectedOrderId = null; searchQuery = ''"
          class="flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap"
          :class="selectedOrderId === null ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-white/40 hover:text-white hover:bg-white/5'"
        >
          <i class="fa-solid fa-border-all mr-1.5"></i>
          Semua Pesanan
        </button>
      </div>

      <!-- Scrollable order tabs (top 10, filtered by search) -->
      <div class="flex-1 flex items-center overflow-x-auto scrollbar-hide px-2 gap-1 min-w-0">
        <button
          v-for="order in visibleOrderTabs"
          :key="order.id"
          @click="selectedOrderId = order.id"
          class="flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap relative"
          :class="selectedOrderId === order.id
            ? 'bg-white text-gray-900 shadow-lg'
            : 'text-white/40 hover:text-white hover:bg-white/5'"
        >
          <span
            class="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
            :class="statusDot(order.status)"
          ></span>
          <i class="fa-solid fa-bowl-food mr-1.5 text-[9px]"></i>
          #{{ order.id }}
          <span class="ml-1 opacity-50 text-[9px]">{{ (order.user?.name || 'Guest').split(' ')[0] }}</span>
        </button>

        <!-- Overflow badge -->
        <div
          v-if="filteredActiveOrders.length > 10"
          class="flex-shrink-0 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/30 text-[9px] font-black uppercase tracking-widest whitespace-nowrap"
        >
          +{{ filteredActiveOrders.length - 10 }} lainnya
        </div>

        <div v-if="filteredActiveOrders.length === 0 && searchQuery && activeOrders.length > 0" class="px-3 text-white/20 text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
          Tidak ada hasil untuk "{{ searchQuery }}"
        </div>
        <div v-if="activeOrders.length === 0" class="px-3 text-white/20 text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
          Tidak ada pesanan aktif
        </div>
      </div>

      <!-- Search + Live + Profile (fixed right) -->
      <div class="flex items-center gap-3 px-4 border-l border-white/10 flex-shrink-0">

        <!-- Search input -->
        <div class="relative">
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-[10px]"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari pelanggan..."
            class="kitchen-search pl-8 pr-3 py-2 text-[10px] font-bold"
            style="width: 160px;"
          />
        </div>

        <!-- Live indicator -->
        <div class="flex items-center gap-1.5 text-white/25 text-[9px] font-black uppercase tracking-widest flex-shrink-0">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          LIVE
        </div>

        <!-- Profile Dropdown -->
        <div class="relative flex-shrink-0" ref="dropdownRef">
          <button
            @click="dropdownOpen = !dropdownOpen"
            class="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-2 transition-all"
            :class="{ 'border-primary ring-2 ring-primary/20': dropdownOpen }"
          >
            <div class="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <i class="fa-solid fa-user-chef text-white text-xs"></i>
            </div>
            <span class="text-white/80 text-[10px] font-black uppercase tracking-widest hidden sm:block max-w-[80px] truncate">{{ user?.name?.split(' ')[0] }}</span>
            <i class="fa-solid fa-chevron-down text-white/30 text-[10px]" :class="{ 'rotate-180': dropdownOpen }"></i>
          </button>

          <transition name="dropdown">
            <div v-if="dropdownOpen" class="absolute top-full right-0 mt-3 w-56 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden py-2">
              <div class="px-5 py-4 border-b border-white/10">
                <p class="text-xs font-black text-white">{{ user?.name }}</p>
                <p class="text-[9px] font-bold text-primary uppercase tracking-widest mt-0.5">{{ user?.role }}</p>
              </div>
              <div class="px-2 mt-1">
                <router-link
                  to="/staff/profile"
                  @click="dropdownOpen = false"
                  class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-white/60 hover:bg-white/5 hover:text-white transition-all"
                >
                  <i class="fa-solid fa-id-card text-blue-400"></i>
                  Profil Saya
                </router-link>
                <button
                  @click="handleLogout"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all"
                >
                  <i class="fa-solid fa-right-from-bracket"></i>
                  Keluar
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="pt-16 min-h-screen">
      <router-view v-slot="{ Component }">
        <transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-3"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <component
            :is="Component"
            :selected-order-id="selectedOrderId"
            :orders="filteredActiveOrders"
            :search-query="searchQuery"
            @refresh="fetchOrders"
          />
        </transition>
      </router-view>
    </main>

    <NotificationToast ref="kitchenToast" position="top-right" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, provide } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import api from '../services/api';
import NotificationToast from '../components/NotificationToast.vue';

const authStore = useAuthStore();
const router = useRouter();
const user = authStore.user;

const dropdownOpen = ref(false);
const dropdownRef = ref(null);
const selectedOrderId = ref(null);
const orders = ref([]);
const searchQuery = ref('');
const kitchenToast = ref(null);
provide('kitchenToast', kitchenToast);

// All active orders
const activeOrders = computed(() =>
  orders.value.filter(o => ['PENDING', 'CONFIRMED', 'COOKING', 'READY'].includes(o.status))
);

// Filtered by search query
const filteredActiveOrders = computed(() => {
  if (!searchQuery.value.trim()) return activeOrders.value;
  const q = searchQuery.value.toLowerCase();
  return activeOrders.value.filter(o =>
    (o.user?.name || '').toLowerCase().includes(q)
  );
});

// Top 10 for tabs in navbar
const visibleOrderTabs = computed(() => filteredActiveOrders.value.slice(0, 10));

const statusDot = (status) => ({
  'bg-blue-400 animate-pulse': status === 'CONFIRMED',
  'bg-orange-400 animate-bounce': status === 'COOKING',
  'bg-emerald-400': status === 'READY',
  'bg-yellow-400 animate-pulse': status === 'PENDING',
});

const fetchOrders = async () => {
  try {
    const res = await api.get('/orders/all');
    orders.value = res.data;
  } catch (e) {
    console.error('Failed to load kitchen orders', e);
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const handleClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false;
  }
};

let pollInterval;
onMounted(() => {
  fetchOrders();
  pollInterval = setInterval(fetchOrders, 8000);
  document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
  clearInterval(pollInterval);
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.kitchen-header {
  background: rgba(10, 10, 10, 0.97);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.dropdown-enter-active { transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.dropdown-leave-active { transition: all 0.15s ease-in; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-8px) scale(0.96); }
.rotate-180 { transform: rotate(180deg); transition: transform .2s ease; }

.kitchen-search {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #fff;
  outline: none;
  transition: all .2s ease;
}
.kitchen-search::placeholder { color: rgba(255,255,255,.2); }
.kitchen-search:focus {
  border-color: rgba(227, 30, 36, 0.5);
  background: rgba(255, 255, 255, 0.07);
  box-shadow: 0 0 0 3px rgba(227, 30, 36, 0.1);
}
</style>
