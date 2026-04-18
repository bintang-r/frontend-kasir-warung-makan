<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-72 bg-gray-900 text-white flex flex-col shadow-2xl z-50 fixed h-full transition-all">
      <div class="px-8 py-10 border-b border-white/10">
        <div class="flex items-center gap-3">
          <div class="bg-primary p-2 rounded-xl shadow-premium w-12 h-12 flex items-center justify-center overflow-hidden">
            <template v-if="brandingStore.fullLogoUrl">
              <img :src="brandingStore.fullLogoUrl" class="w-full h-full object-contain" />
            </template>
            <template v-else>
              <i class="fa-solid fa-cloud-sun text-white text-lg"></i>
            </template>
          </div>
          <div>
            <h1 class="font-black text-sm tracking-tight leading-none">STAFF <span class="text-primary">PORTAL</span></h1>
            <p class="text-[9px] font-bold text-gray-500 uppercase mt-1 tracking-widest">{{ brandingStore.restaurantName }}</p>
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

      <!-- Navigation and Brand handled above -->
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
          
          <!-- Profile Dropdown -->
          <div class="relative" ref="dropdownRef">
             <button 
               @click="toggleProfileDropdown"
               class="flex items-center gap-3 pl-4 pr-1.5 py-1.5 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white hover:border-primary transition-all group"
               :class="{ 'border-primary ring-4 ring-primary/10': profileDropdownOpen }"
             >
                <div class="text-right hidden sm:block">
                   <p class="text-[10px] font-black text-gray-900 uppercase tracking-tighter leading-none">{{ user?.name }}</p>
                   <p class="text-[8px] font-bold text-primary uppercase tracking-widest mt-1">{{ user?.role }}</p>
                </div>
                <div class="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center shadow-lg group-hover:bg-primary transition-colors">
                   <i class="fa-solid fa-user-tie text-sm"></i>
                </div>
             </button>

             <!-- Dropdown Menu -->
             <transition name="dropdown">
                <div v-if="profileDropdownOpen" class="absolute top-full right-0 mt-4 w-64 bg-white rounded-[32px] border border-gray-100 shadow-2xl overflow-hidden z-50 py-3">
                   <div class="px-6 py-4 border-b border-gray-50 mb-3 sm:hidden">
                      <p class="text-xs font-black text-gray-900">{{ user?.name }}</p>
                      <p class="text-[9px] font-bold text-primary tracking-widest uppercase">{{ user?.role }}</p>
                   </div>
                   
                   <div class="px-3 space-y-1">
                      <router-link 
                        @click="closeProfileDropdown"
                        to="/staff/profile" 
                        class="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
                      >
                         <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                            <i class="fa-solid fa-id-card"></i>
                         </div>
                         Profil Saya
                      </router-link>
                      
                      <button 
                        @click="handleLogout"
                        class="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-xs font-bold text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
                      >
                         <div class="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                            <i class="fa-solid fa-right-from-bracket"></i>
                         </div>
                         Keluar Sesi
                      </button>
                   </div>
                </div>
             </transition>
          </div>
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

    <!-- Premium Staff Toast -->
    <NotificationToast ref="staffToast" position="top-right" />
  </div>
</template>

<script setup>
import { computed, ref, provide, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useBrandingStore } from '../../stores/branding';
import NotificationToast from '../components/NotificationToast.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const brandingStore = useBrandingStore();
const user = authStore.user;

const staffToast = ref(null);
provide('staffToast', staffToast);

// Dropdown Logic
const profileDropdownOpen = ref(false);
const dropdownRef = ref(null);

const toggleProfileDropdown = () => {
  profileDropdownOpen.value = !profileDropdownOpen.value;
};

const closeProfileDropdown = () => {
  profileDropdownOpen.value = false;
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeProfileDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

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
  
  if (user?.role === 'SUPERADMIN' || user?.role === 'ADMIN') {
    items.push(
      { name: 'Dashboard Admin', path: '/staff/admin', icon: 'fa-solid fa-chart-pie' },
      { name: 'Pantau Pesanan', path: '/staff/admin/orders', icon: 'fa-solid fa-receipt' },
      { name: 'Riwayat Transaksi', path: '/staff/admin/payments', icon: 'fa-solid fa-file-invoice-dollar' },
      { name: 'Kelola Menu', path: '/staff/admin/menus', icon: 'fa-solid fa-utensils' },
      { name: 'Kategori & Meja', path: '/staff/admin/infrastructure', icon: 'fa-solid fa-layer-group' },
      { name: 'Manajemen User', path: '/staff/admin/users', icon: 'fa-solid fa-users-gear' },
      { name: 'Ulasan Pelanggan', path: '/staff/admin/reviews', icon: 'fa-solid fa-star-half-stroke' },
      { name: 'Promo & Voucher', path: '/staff/admin/promos', icon: 'fa-solid fa-ticket' },
      { name: 'Identitas Warung', path: '/staff/admin/branding', icon: 'fa-solid fa-store' },
      { name: 'Integrasi WhatsApp', path: '/staff/admin/whatsapp', icon: 'fa-brands fa-whatsapp' }
    );

    if (user?.role === 'SUPERADMIN') {
      items.push(
        { name: 'Audit & System', path: '/staff/superadmin/audit', icon: 'fa-solid fa-shield-halved' }
      );
    }
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

/* Dropdown Animation */
.dropdown-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.7, 0, 0.84, 0);
}
.dropdown-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(5px) scale(0.98);
}
</style>
