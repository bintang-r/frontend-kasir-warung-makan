<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
    <router-link to="/" class="flex items-center gap-2">
      <div class="bg-primary p-2 rounded-xl shadow-premium">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-5 h-5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      <div>
        <h1 class="text-sm font-black text-gray-900 leading-none">Siantar <span class="text-primary">Minang</span></h1>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Restaurant</p>
      </div>
    </router-link>

    <div class="flex items-center gap-4">
      <!-- Notification Icon -->
      <button @click="notificationStore.toggleDrawer" class="relative p-2 text-gray-400 hover:text-primary transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7c0-2.432-1.336-4.542-3.32-5.655a1.185 1.185 0 00-1.879.168 12.01 12.01 0 00-2.8 0 1.185 1.185 0 00-1.879-.168A5.968 5.968 0 006 9.05v.7c0 1.63-.448 3.153-1.233 4.456a23.85 23.85 0 005.454 1.311m4.948 1.482a8.967 8.967 0 01-18 0M10.5 21.75a2.25 2.25 0 004.5 0" />
        </svg>
        <span v-if="notificationStore.unreadCount > 0" class="absolute top-2 right-2 w-4 h-4 bg-primary text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">
          {{ notificationStore.unreadCount > 9 ? '9+' : notificationStore.unreadCount }}
        </span>
      </button>

      <!-- Cart Icon with Badge -->
      <button @click="cartStore.toggleCart" class="relative p-2.5 bg-gray-50 text-gray-800 rounded-2xl hover:bg-gray-100 transition-all border border-gray-100 group">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <div v-if="cartStore.totalItems > 0" class="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-black min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center shadow-lg animate-bounce-subtle border-2 border-white">
          {{ cartStore.totalItems > 99 ? '99+' : cartStore.totalItems }}
        </div>
      </button>

      <!-- Account / Avatar -->
      <router-link :to="authStore.isAuthenticated ? '/profile' : '/login'" class="p-0.5 rounded-2xl border-2 border-gray-100 active:scale-95 transition-all">
         <div class="w-9 h-9 bg-secondary-surface rounded-[14px] flex items-center justify-center text-secondary overflow-hidden">
            <template v-if="authStore.isAuthenticated">
               <span class="font-black text-xs uppercase">{{ authStore.user?.name?.charAt(0) }}</span>
            </template>
            <template v-else>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                 <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
               </svg>
            </template>
         </div>
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';

const cartStore = useCartStore();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();
</script>

<style scoped>
@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
.animate-bounce-subtle {
  animation: bounce-subtle 2s infinite ease-in-out;
}
</style>
