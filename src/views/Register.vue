<template>
  <div class="min-h-screen flex flex-col px-8 pt-12">
    <!-- Close Button -->
    <button @click="router.back()" class="self-start p-2 -ml-2 text-gray-400 hover:text-primary transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <div class="mt-8">
      <h1 class="text-4xl font-black text-gray-900 tracking-tight">Daftar <span class="text-primary">Akun</span></h1>
      <p class="text-gray-400 font-bold mt-2 text-sm uppercase tracking-widest">Bagabung jo RM Siantar Minang</p>
    </div>

    <form @submit.prevent="handleRegister" class="mt-12 flex flex-col gap-5">
      <div class="space-y-2">
        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.105a8.25 8.25 0 0115.782 0l0 .01a.75.75 0 01-.437.695A18.682 18.682 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" />
            </svg>
          </div>
          <input 
            type="text" 
            v-model="name" 
            placeholder="Namo langkok dunsanak"
            class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all"
            required 
          />
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <input 
            type="password" 
            v-model="password" 
            placeholder="Buat password minimal 6 karakter"
            class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all"
            required 
          />
        </div>
      </div>

      <button 
        type="submit" 
        :disabled="isLoading"
        class="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-premium hover:bg-primary-dark transition-all flex justify-center items-center gap-3 disabled:bg-gray-400 active:scale-95 mt-4"
      >
        <div v-if="isLoading" class="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
        <span>{{ isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang' }}</span>
      </button>
    </form>

    <div class="mt-auto pb-12 text-center">
      <p class="text-gray-400 font-bold text-sm">Alah punyo akun? <router-link to="/login" class="text-primary font-black ml-1 uppercase tracking-wider underline underline-offset-4">Masuak Siko</router-link></p>
    </div>

    <NotificationToast ref="toast" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';
import NotificationToast from '../components/NotificationToast.vue';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const toast = ref(null);

const handleRegister = async () => {
  if (password.value.length < 6) {
    toast.value?.display('Password minimal 6 karakter dunsanak.', 'error');
    return;
  }

  isLoading.value = true;
  try {
    const response = await api.post('/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value
    });
    
    toast.value?.display('Akun barhasil dibuek! Silakan masuak.');
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  } catch (err) {
    const message = err.response?.data?.message || 'Gagal mendaftar, cubo email lain.';
    toast.value?.display(message, 'error');
  } finally {
    isLoading.value = false;
  }
};
</script>
