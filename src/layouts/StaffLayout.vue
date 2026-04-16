<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-72 bg-gray-900 text-white flex flex-col shadow-2xl z-50 fixed h-full transition-all">
      <div class="px-8 py-10 border-b border-white/10">
        <div class="flex items-center gap-3">
          <div class="bg-primary p-2 rounded-xl shadow-premium">
            <i class="fa-solid fa-cloud-sun text-white text-lg"></i>
          </div>
          <div>
            <h1 class="font-black text-sm tracking-tight leading-none">STAFF <span class="text-primary">PORTAL</span></h1>
            <p class="text-[9px] font-bold text-gray-500 uppercase mt-1 tracking-widest">RM Siantar Minang</p>
          </div>
        </div>
      </div>

      <nav class="flex-1 px-4 py-8 space-y-2 overflow-y-auto scrollbar-hide">
        <div class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-4 mb-4">Main Navigation</div>
        
        <router-link 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-4 px-4 py-3 rounded-xl transition-all group font-bold text-sm"
          :class="route.path === item.path ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'"
        >
          <div :class="route.path === item.path ? 'text-white' : 'text-gray-600 group-hover:text-primary transition-colors'">
            <i :class="item.icon"></i>
          </div>
          {{ item.name }}
        </router-link>
      </nav>

      <!-- Account / Logout -->
      <div class="p-6 border-t border-white/5 bg-black/20">
          <div class="overflow-hidden">
            <p class="font-black text-white text-sm truncate uppercase tracking-tighter">{{ user?.name }}</p>
            <p class="text-[10px] font-black text-primary/80 uppercase tracking-widest">{{ user?.role }}</p>
          </div>
        </div>
        
        <router-link 
          to="/staff/profile"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs mb-4 border border-white/5 hover:bg-white/5"
          :class="route.path === '/staff/profile' ? 'bg-primary/10 text-primary border-primary/20' : 'text-gray-400 hover:text-white'"
        >
          <i class="fa-solid fa-id-card-clip"></i>
          Manajemen Profil
        </router-link>

        <button 
          @click="handleLogout"
          class="w-full bg-white/5 hover:bg-red-500/10 hover:text-red-500 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all text-gray-400 flex items-center justify-center gap-3 border border-white/5"
        >
          <i class="fa-solid fa-right-from-bracket"></i>
          Keluar Sesi
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 ml-72 min-h-screen">
      <!-- Navbar (Internal) -->
      <header class="bg-white/80 backdrop-blur-md border-b border-gray-100 px-10 py-6 sticky top-0 z-40 flex justify-between items-center shadow-sm">
        <h2 class="text-xl font-black text-gray-900 tracking-tight">{{ currentRouteName }}</h2>
        <div class="flex items-center gap-6">
          <div class="hidden md:flex flex-col items-end">
             <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ formattedDate }}</p>
             <p class="text-xs font-bold text-gray-600">Pelayanan Aktif</p>
          </div>
          <div class="w-px h-8 bg-gray-100"></div>
          <button class="relative text-gray-400 hover:text-primary transition-colors">
            <i class="fa-solid fa-bell text-xl"></i>
            <span class="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>

      <div class="p-10">
        <router-view v-slot="{ Component }">
          <transition 
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-4"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const user = authStore.user;

const currentRouteName = computed(() => {
  return route.meta.title || 'Dashboard';
});

const formattedDate = computed(() => {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'full'
  }).format(new Date());
});

const navItems = computed(() => {
  const items = [];
  
  if (user?.role === 'ADMIN') {
    items.push(
      { name: 'Dashboard Admin', path: '/staff/admin', icon: 'fa-solid fa-chart-pie' },
      { name: 'Pantau Pesanan', path: '/staff/admin/orders', icon: 'fa-solid fa-receipt' },
      { name: 'Riwayat Transaksi', path: '/staff/admin/payments', icon: 'fa-solid fa-file-invoice-dollar' },
      { name: 'Kelola Menu', path: '/staff/admin/menus', icon: 'fa-solid fa-utensils' },
      { name: 'Kategori & Meja', path: '/staff/admin/infrastructure', icon: 'fa-solid fa-layer-group' },
      { name: 'Manajemen User', path: '/staff/admin/users', icon: 'fa-solid fa-users-gear' },
      { name: 'Ulasan Pelanggan', path: '/staff/admin/reviews', icon: 'fa-solid fa-star-half-stroke' },
      { name: 'Promo & Voucher', path: '/staff/admin/promos', icon: 'fa-solid fa-ticket' },
      { name: 'Audit & System', path: '/staff/admin/system', icon: 'fa-solid fa-shield-halved' }
    );
  } else if (user?.role === 'KASIR') {
    items.push(
      { name: 'Kasir Panel', path: '/staff/cashier', icon: 'fa-solid fa-cash-register' }
    );
  } else if (user?.role === 'KITCHEN') {
    items.push(
      { name: 'Dapur Aktif', path: '/staff/kitchen', icon: 'fa-solid fa-fire-burner' }
    );
  }
  
  return items;
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
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
</style>
