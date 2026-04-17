<template>
  <nav
    v-if="isVisible"
    class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/80 backdrop-blur-xl border-t border-gray-100 flex items-center justify-around px-2 py-3 z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-[32px]"
  >
    <router-link
      to="/"
      class="flex flex-col items-center gap-1 px-4 py-1 transition-all relative group"
      active-class="text-primary"
    >
      <div
        class="text-gray-400 group-[.text-primary]:text-primary group-[.text-primary]:scale-110 group-hover:scale-110 group-active:scale-90 transition-all duration-300"
      >
        <i
          class="fa-solid fa-house text-xl transition-transform group-hover:scale-110"
        ></i>
      </div>
      <span
        class="text-[9px] font-black uppercase tracking-widest text-gray-400 group-[.text-primary]:text-primary"
        >Home</span
      >
      <div
        v-if="route.path === '/'"
        class="absolute -top-3 w-1 h-1 bg-primary rounded-full"
      ></div>
    </router-link>

    <router-link
      to="/menu"
      class="flex flex-col items-center gap-1 px-4 py-1 transition-all relative group"
      active-class="text-primary"
    >
      <div
        class="text-gray-400 group-[.text-primary]:text-primary group-[.text-primary]:scale-110 group-hover:scale-110 group-active:scale-90 transition-all duration-300"
      >
        <i
          class="fa-solid fa-utensils text-xl transition-transform group-hover:scale-110"
        ></i>
      </div>
      <span
        class="text-[9px] font-black uppercase tracking-widest text-gray-400 group-[.text-primary]:text-primary"
        >Menu</span
      >
      <div
        v-if="route.path === '/menu'"
        class="absolute -top-3 w-1 h-1 bg-primary rounded-full"
      ></div>
    </router-link>

    <router-link
      to="/history"
      class="flex flex-col items-center gap-1 px-4 py-1 transition-all relative group"
      active-class="text-primary"
    >
      <div
        class="text-gray-400 group-[.text-primary]:text-primary group-[.text-primary]:scale-110 group-hover:scale-110 group-active:scale-90 transition-all duration-300"
      >
        <i
          class="fa-solid fa-history text-xl transition-transform group-hover:scale-110"
        ></i>
      </div>
      <span
        class="text-[9px] font-black uppercase tracking-widest text-gray-400 group-[.text-primary]:text-primary"
        >Pesanan</span
      >
      <div
        v-if="route.path === '/history'"
        class="absolute -top-3 w-1 h-1 bg-primary rounded-full"
      ></div>
    </router-link>

    <router-link
      v-if="isStaff"
      to="/staff"
      class="flex flex-col items-center gap-1 px-4 py-1 transition-all relative group"
      active-class="text-primary"
    >
      <div
        class="text-gray-400 group-[.text-primary]:text-primary group-[.text-primary]:scale-110 group-hover:scale-110 group-active:scale-90 transition-all duration-300"
      >
        <i
          class="fa-solid fa-user-shield text-xl transition-transform group-hover:scale-110"
        ></i>
      </div>
      <span
        class="text-[9px] font-black uppercase tracking-widest text-gray-400 group-[.text-primary]:text-primary"
        >Staff</span
      >
      <div
        v-if="route.path === '/staff'"
        class="absolute -top-3 w-1 h-1 bg-primary rounded-full"
      ></div>
    </router-link>

    <router-link
      v-else
      :to="authStore.isAuthenticated ? '/profile' : '/login'"
      class="flex flex-col items-center gap-1 px-4 py-1 transition-all relative group"
      active-class="text-primary"
    >
      <div
        class="text-gray-400 group-[.text-primary]:text-primary group-[.text-primary]:scale-110 group-hover:scale-110 group-active:scale-90 transition-all duration-300"
      >
        <i
          class="fa-solid fa-user text-xl transition-transform group-hover:scale-110"
        ></i>
      </div>
      <span
        class="text-[9px] font-black uppercase tracking-widest text-gray-400 group-[.text-primary]:text-primary"
        >Profil</span
      >
      <div
        v-if="['/profile', '/login', '/register'].includes(route.path)"
        class="absolute -top-3 w-1 h-1 bg-primary rounded-full"
      ></div>
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";

const route = useRoute();
const authStore = useAuthStore();

const isVisible = computed(() => {
  return !["Login", "Register"].includes(route.name);
});

const isStaff = computed(() => {
  return (
    authStore.isAuthenticated &&
    ["ADMIN", "KITCHEN", "KASIR"].includes(authStore.user?.role)
  );
});
</script>

<style scoped></style>
