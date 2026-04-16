<template>
  <div class="min-h-screen flex flex-col px-8 pt-12">
    <!-- Close Button -->
    <button @click="router.back()" class="self-start p-2 -ml-2 text-gray-400 hover:text-primary transition-colors">
      <i class="fa-solid fa-xmark text-xl"></i>
    </button>

    <div class="mt-8">
      <h1 class="text-4xl font-black text-gray-900 tracking-tight">Selamat <span class="text-primary">Datang</span></h1>
      <p class="text-gray-400 font-bold mt-2 text-sm uppercase tracking-widest">Silakan masuk untuk memesan</p>
    </div>

    <form @submit.prevent="handleLogin" class="mt-12 flex flex-col gap-6">
      <div class="space-y-2">
        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
            <i class="fa-solid fa-envelope"></i>
          </div>
          <input 
            type="email" 
            v-model="email" 
            placeholder="contoh@laman.com"
            class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all"
            required 
          />
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Password</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
            <i class="fa-solid fa-lock"></i>
          </div>
          <input 
            type="password" 
            v-model="password" 
            placeholder="••••••••"
            class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all"
            required 
          />
        </div>
      </div>

      <div class="flex justify-between items-center px-2">
        <label class="flex items-center gap-2 cursor-pointer group">
          <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <span class="text-xs font-bold text-gray-400 group-hover:text-gray-600 transition-colors">Ingat saya</span>
        </label>
          <button type="button" class="text-xs font-black text-primary uppercase tracking-wider">Lupa Password?</button>
      </div>

      <button 
        type="submit" 
        :disabled="isLoading"
        class="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-premium hover:bg-primary-dark transition-all flex justify-center items-center gap-3 disabled:bg-gray-400 active:scale-95 mt-4"
      >
        <div v-if="isLoading" class="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
        <span>{{ isLoading ? 'Memproses...' : 'Masuk Sekarang' }}</span>
      </button>
    </form>

    <div class="mt-auto pb-12 text-center">
      <p class="text-gray-400 font-bold text-sm">Belum punya akun? <router-link to="/register" class="text-primary font-black ml-1 uppercase tracking-wider underline underline-offset-4">Daftar Sini</router-link></p>
    </div>

    <NotificationToast ref="toast" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import NotificationToast from '../components/NotificationToast.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const toast = ref(null);

const handleLogin = async () => {
  isLoading.value = true;
  try {
    const success = await authStore.login(email.value, password.value);
    if (success) {
      toast.value?.display('Selamat Datang!');
      const redirectPath = route.query.redirect || '/';
      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);
    } else {
      toast.value?.display('Email atau password salah.', 'error');
    }
  } catch (err) {
    toast.value?.display('Terjadi kesalahan, coba lagi.', 'error');
  } finally {
    isLoading.value = false;
  }
};
</script>
