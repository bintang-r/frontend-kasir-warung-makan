<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
    <router-link to="/" class="flex items-center gap-2">
      <div class="bg-primary p-2 rounded-xl shadow-premium">
        <i class="fa-solid fa-utensils text-white text-lg"></i>
      </div>
      <div>
        <h1 class="text-sm font-black text-gray-900 leading-none">Siantar <span class="text-primary">Minang</span></h1>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Restaurant</p>
      </div>
    </router-link>

    <div class="flex items-center gap-4">
      <!-- Notification Icon -->
      <button @click="notificationStore.toggleDrawer" class="relative p-2.5 bg-gray-50 text-gray-800 rounded-2xl hover:bg-gray-100 transition-all border border-gray-100 group">
        <i class="fa-solid fa-bell text-lg group-hover:scale-110 transition-transform"></i>
        <div v-if="notificationStore.unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center shadow-lg animate-bounce-subtle border-2 border-white">
          {{ notificationStore.unreadCount > 9 ? '9+' : notificationStore.unreadCount }}
        </div>
      </button>

      <!-- Cart Icon with Badge -->
      <button @click="cartStore.toggleCart" class="relative p-2.5 bg-gray-50 text-gray-800 rounded-2xl hover:bg-gray-100 transition-all border border-gray-100 group">
        <i class="fa-solid fa-shopping-cart text-lg group-hover:scale-110 transition-transform"></i>
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
               <i class="fa-solid fa-user text-lg"></i>
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
