<template>
  <div class="min-h-screen" style="background: #f8f9fb;">
    <!-- Top Navbar -->
    <header class="cashier-header fixed top-0 left-0 right-0 z-50 flex items-stretch" style="height: 64px;">

      <!-- Brand -->
      <div class="flex items-center gap-3 px-5 border-r border-gray-100 flex-shrink-0">
          <div class="h-10 w-10 bg-primary/20 p-2 rounded-xl flex items-center justify-center overflow-hidden">
            <template v-if="brandingStore.fullLogoUrl">
              <img :src="brandingStore.fullLogoUrl" class="w-full h-full object-contain" />
            </template>
            <i v-else class="fa-solid fa-cash-register text-primary"></i>
          </div>
          <div>
            <h1 class="font-black text-sm tracking-tight leading-none text-gray-900 uppercase">Cashier POS</h1>
            <p class="text-[9px] font-bold text-gray-400 uppercase mt-1 tracking-widest">{{ brandingStore.restaurantName }}</p>
          </div>
        </div>

      <!-- "Semua Tagihan" & "Reservasi" — Fixed, never scrolls -->
      <div v-if="route.path !== '/staff/cashier/pos'" class="flex items-center px-3 border-r border-gray-100 flex-shrink-0 gap-2">
        <button
          @click="$router.push('/staff/cashier'); selectedOrderId = null; searchQuery = ''"
          class="flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap"
          :class="route.path === '/staff/cashier' && selectedOrderId === null
            ? 'bg-gray-900 text-white shadow-md'
            : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'"
        >
          <i class="fa-solid fa-list-ul mr-1.5"></i>
          Semua Tagihan
          <span v-if="pendingCount > 0" class="ml-2 bg-primary text-white text-[8px] px-1.5 py-0.5 rounded-md font-black">
            {{ pendingCount }}
          </span>
        </button>

        <button
          @click="$router.push('/staff/cashier/reservations'); selectedOrderId = null; searchQuery = ''"
          class="flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap"
          :class="route.path === '/staff/cashier/reservations'
            ? 'bg-gray-900 text-white shadow-md'
            : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'"
        >
          <i class="fa-solid fa-calendar-check mr-1.5"></i>
          Reservasi
          <span v-if="pendingReservationsCount > 0" class="ml-2 bg-amber-500 text-white text-[8px] px-1.5 py-0.5 rounded-md font-black">
            {{ pendingReservationsCount }}
          </span>
        </button>
      </div>

      <!-- Scrollable customer tabs -->
      <div v-if="route.path === '/staff/cashier'" class="flex-1 flex items-center overflow-x-auto scrollbar-hide px-3 gap-2 min-w-0">
        <button
          v-for="order in visibleTabs"
          :key="order.id"
          @click="selectedOrderId = order.id"
          class="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border"
          :class="selectedOrderId === order.id
            ? 'bg-gray-900 text-white border-gray-900 shadow-md'
            : 'text-gray-500 border-gray-150 bg-white hover:border-gray-300 hover:text-gray-800'"
        >
          <!-- Avatar initial -->
          <div
            class="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black flex-shrink-0"
            :class="selectedOrderId === order.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'"
          >
            {{ (order.address || order.user?.name || 'G').charAt(0).toUpperCase() }}
          </div>
          <span>{{ (order.address || order.user?.name || 'Guest').split(' ')[0] }}</span>
          <span class="opacity-50 font-bold">·</span>
          <span class="opacity-50 font-bold">#{{ order.id }}</span>
          <!-- unpaid badge -->
          <span
            v-if="hasUnpaid(order)"
            class="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"
          ></span>
          <span
            v-else
            class="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"
          ></span>
        </button>

        <div v-if="filteredOrders.length > 10" class="flex-shrink-0 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-400 text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
          +{{ filteredOrders.length - 10 }} tagihan
        </div>

        <div v-if="filteredOrders.length === 0 && searchQuery" class="text-gray-300 text-[9px] font-black uppercase tracking-widest whitespace-nowrap flex-shrink-0">
          Tidak ada hasil: "{{ searchQuery }}"
        </div>
        <div v-else-if="allBillingOrders.length === 0" class="text-gray-300 text-[9px] font-black uppercase tracking-widest whitespace-nowrap flex-shrink-0">
          Tidak ada tagihan aktif
        </div>
      </div>

      <!-- Spacer when middle is hidden -->
      <div v-if="route.path === '/staff/cashier/pos'" class="flex-1"></div>

      <!-- Search + Date + Profile -->
      <div class="flex items-center gap-3 px-4 border-l border-gray-100 flex-shrink-0">

        <!-- Search -->
        <div v-if="route.path !== '/staff/cashier/pos'" class="relative">
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-[10px]"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari pelanggan..."
            class="cashier-search pl-8 pr-3 py-2 text-[10px] font-bold"
            style="width: 160px;"
          />
        </div>

        <!-- Date/Time -->
        <div class="text-right hidden md:block flex-shrink-0">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ formattedDate }}</p>
          <p class="text-xs font-black text-gray-900">{{ formattedTime }}</p>
        </div>

        <div class="w-px h-8 bg-gray-100 flex-shrink-0"></div>

        <!-- Profile Dropdown -->
        <div class="relative flex-shrink-0" ref="dropdownRef">
          <button
            @click="dropdownOpen = !dropdownOpen"
            class="flex items-center gap-2 bg-gray-50 border border-gray-150 rounded-xl px-3 py-2 transition-all hover:bg-white hover:border-gray-200"
            :class="{ 'border-gray-900 ring-2 ring-gray-900/10': dropdownOpen }"
          >
            <div class="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
              <i class="fa-solid fa-user-tie text-white text-xs"></i>
            </div>
            <span class="text-gray-700 text-[10px] font-black uppercase tracking-widest hidden sm:block max-w-[80px] truncate">{{ user?.name?.split(' ')[0] }}</span>
            <i class="fa-solid fa-chevron-down text-gray-300 text-[10px]" :class="{ 'rotate-180': dropdownOpen }"></i>
          </button>

          <transition name="dropdown">
            <div v-if="dropdownOpen" class="absolute top-full right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden py-2">
              <div class="px-5 py-4 border-b border-gray-50">
                <p class="text-xs font-black text-gray-900">{{ user?.name }}</p>
                <p class="text-[9px] font-bold text-primary uppercase tracking-widest mt-0.5">{{ user?.role }}</p>
              </div>
              <div class="px-2 mt-1">
                <router-link
                  to="/staff/profile"
                  @click="dropdownOpen = false"
                  class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
                >
                  <i class="fa-solid fa-id-card text-blue-400"></i>
                  Profil Saya
                </router-link>
                <button
                  @click="handleLogout"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-400 hover:bg-red-50 transition-all"
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
        <component
          :is="Component"
          :selected-order-id="selectedOrderId"
          :orders="filteredOrders"
          :search-query="searchQuery"
          @refresh="fetchOrders"
          @select-order="selectedOrderId = $event"
        />
      </router-view>
    </main>

    <NotificationToast ref="cashierToast" position="top-right" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, provide } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter, useRoute } from 'vue-router';
import { useBrandingStore } from '../stores/branding';
import api from '../services/api';
import NotificationToast from '../components/NotificationToast.vue';

const brandingStore = useBrandingStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const user = authStore.user;

const dropdownOpen = ref(false);
const dropdownRef = ref(null);
const selectedOrderId = ref(null);
const orders = ref([]);
const searchQuery = ref('');
const cashierToast = ref(null);
provide('cashierToast', cashierToast);

// Current clock
const now = ref(new Date());
let clockInterval;
const formattedDate = computed(() =>
  new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(now.value)
);
const formattedTime = computed(() =>
  new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now.value)
);

// All billing orders (include both unpaid and recently paid)
const allBillingOrders = computed(() =>
  orders.value.filter(o =>
    o.status !== 'CANCELLED' &&
    (o.payments?.some(p => p.status === 'UNPAID') ||
     (o.status === 'COMPLETED' && isToday(o.updatedAt)))
  )
);

// Pending count badge
const pendingCount = computed(() =>
  orders.value.filter(o => o.payments?.some(p => p.status === 'UNPAID')).length
);

// Filtered by search
const filteredOrders = computed(() => {
  if (!searchQuery.value.trim()) return allBillingOrders.value;
  const q = searchQuery.value.toLowerCase();
  return allBillingOrders.value.filter(o =>
    (o.address || o.user?.name || '').toLowerCase().includes(q) ||
    String(o.id).includes(q)
  );
});

// Top 10 for tabs
const visibleTabs = computed(() => filteredOrders.value.slice(0, 10));

const hasUnpaid = (order) => order.payments?.some(p => p.status === 'UNPAID');

const isToday = (ds) => new Date(ds).toDateString() === new Date().toDateString();

const fetchOrders = async () => {
  try {
    const res = await api.get('/orders/all');
    orders.value = res.data;
  } catch (e) {
    console.error('Cashier fetch error', e);
  }
};

const pendingReservationsCount = ref(0);
const fetchPendingReservations = async () => {
  try {
    const res = await api.get('/reservations');
    pendingReservationsCount.value = res.data.filter(r => r.status === 'PENDING').length;
  } catch (e) {
    console.error('Cashier fetch reservations error', e);
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
  fetchPendingReservations();
  pollInterval = setInterval(() => {
    fetchOrders();
    fetchPendingReservations();
  }, 10000);
  clockInterval = setInterval(() => { now.value = new Date(); }, 1000);
  document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
  clearInterval(pollInterval);
  clearInterval(clockInterval);
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.cashier-header {
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid #f0f0f3;
  box-shadow: 0 1px 0 rgba(0,0,0,0.04);
}
.border-gray-150 { border-color: #ebebf0; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.dropdown-enter-active { transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.dropdown-leave-active { transition: all 0.15s ease-in; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-8px) scale(0.96); }
.rotate-180 { transform: rotate(180deg); transition: transform .2s ease; }

.cashier-search {
  background: #f5f5f8;
  border: 1px solid #ebebf0;
  border-radius: 10px;
  color: #111;
  outline: none;
  transition: all .2s ease;
}
.cashier-search::placeholder { color: #bbb; }
.cashier-search:focus {
  border-color: rgba(227, 30, 36, 0.4);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(227, 30, 36, 0.08);
}
</style>
