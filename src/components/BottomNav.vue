<template>
  <nav v-if="isVisible" class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/80 backdrop-blur-xl border-t border-gray-100 flex items-center justify-around px-2 py-3 z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-[32px]">
    <router-link 
      to="/" 
      class="flex flex-col items-center gap-1 px-4 py-1 transition-all relative group"
      active-class="text-primary"
    >
      <div class="text-gray-400 group-[.text-primary]:text-primary group-[.text-primary]:scale-110 group-hover:scale-110 group-active:scale-90 transition-all duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      </div>
      <span class="text-[9px] font-black uppercase tracking-widest text-gray-400 group-[.text-primary]:text-primary">Home</span>
      <div v-if="route.path === '/'" class="absolute -top-3 w-1 h-1 bg-primary rounded-full"></div>
    </router-link>

    <router-link 
      to="/menu" 
      class="flex flex-col items-center gap-1 px-4 py-1 transition-all relative group"
      active-class="text-primary"
    >
      <div class="text-gray-400 group-[.text-primary]:text-primary group-[.text-primary]:scale-110 group-hover:scale-110 group-active:scale-90 transition-all duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </div>
      <span class="text-[9px] font-black uppercase tracking-widest text-gray-400 group-[.text-primary]:text-primary">Menu</span>
      <div v-if="route.path === '/menu'" class="absolute -top-3 w-1 h-1 bg-primary rounded-full"></div>
    </router-link>

    <router-link 
      to="/history" 
      class="flex flex-col items-center gap-1 px-4 py-1 transition-all relative group"
      active-class="text-primary"
    >
      <div class="text-gray-400 group-[.text-primary]:text-primary group-[.text-primary]:scale-110 group-hover:scale-110 group-active:scale-90 transition-all duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <span class="text-[9px] font-black uppercase tracking-widest text-gray-400 group-[.text-primary]:text-primary">Pesanan</span>
      <div v-if="route.path === '/history'" class="absolute -top-3 w-1 h-1 bg-primary rounded-full"></div>
    </router-link>

    <router-link 
      v-if="isStaff"
      to="/staff" 
      class="flex flex-col items-center gap-1 px-4 py-1 transition-all relative group"
      active-class="text-primary"
    >
      <div class="text-gray-400 group-[.text-primary]:text-primary group-[.text-primary]:scale-110 group-hover:scale-110 group-active:scale-90 transition-all duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      </div>
      <span class="text-[9px] font-black uppercase tracking-widest text-gray-400 group-[.text-primary]:text-primary">Staff</span>
      <div v-if="route.path === '/staff'" class="absolute -top-3 w-1 h-1 bg-primary rounded-full"></div>
    </router-link>

    <router-link 
      v-else
      :to="authStore.isAuthenticated ? '/profile' : '/login'" 
      class="flex flex-col items-center gap-1 px-4 py-1 transition-all relative group"
      active-class="text-primary"
    >
      <div class="text-gray-400 group-[.text-primary]:text-primary group-[.text-primary]:scale-110 group-hover:scale-110 group-active:scale-90 transition-all duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      </div>
      <span class="text-[9px] font-black uppercase tracking-widest text-gray-400 group-[.text-primary]:text-primary">Profil</span>
      <div v-if="['/profile', '/login', '/register'].includes(route.path)" class="absolute -top-3 w-1 h-1 bg-primary rounded-full"></div>
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const authStore = useAuthStore();

const isVisible = computed(() => {
  return !['Login', 'Register'].includes(route.name);
});

const isStaff = computed(() => {
  return authStore.isAuthenticated && ['ADMIN', 'KITCHEN', 'KASIR'].includes(authStore.user?.role);
});
</script>

<style scoped>
</style>
