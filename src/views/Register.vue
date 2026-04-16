<template>
  <div class="min-h-screen flex flex-col px-8 pt-12">
    <!-- Close Button -->
    <button @click="router.back()" class="self-start p-2 -ml-2 text-gray-400 hover:text-primary transition-colors">
      <i class="fa-solid fa-xmark text-xl"></i>
    </button>

    <div class="mt-8">
      <h1 class="text-4xl font-black text-gray-900 tracking-tight">Daftar <span class="text-primary">Akun</span></h1>
      <p class="text-gray-400 font-bold mt-2 text-sm uppercase tracking-widest">Bergabung dengan RM Siantar Minang</p>
    </div>

    <form @submit.prevent="handleRegister" class="mt-12 flex flex-col gap-5">
      <div class="space-y-2">
        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
            <i class="fa-solid fa-user"></i>
          </div>
          <input 
            type="text" 
            v-model="name" 
            placeholder="Nama lengkap Anda"
            class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all"
            required 
          />
        </div>
      </div>

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
      <p class="text-gray-400 font-bold text-sm">Sudah punya akun? <router-link to="/login" class="text-primary font-black ml-1 uppercase tracking-wider underline underline-offset-4">Masuk Di Sini</router-link></p>
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
    toast.value?.display('Password minimal 6 karakter.', 'error');
    return;
  }

  isLoading.value = true;
  try {
    const response = await api.post('/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value
    });
    
    toast.value?.display('Akun berhasil dibuat! Silakan masuk.');
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  } catch (err) {
    const message = err.response?.data?.message || 'Gagal mendaftar, coba email lain.';
    toast.value?.display(message, 'error');
  } finally {
    isLoading.value = false;
  }
};
</script>
