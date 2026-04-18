<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6 relative overflow-hidden">
    <!-- Background Decor for Desktop -->
    <div class="hidden lg:block absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 origin-top-right"></div>

    <div class="w-full max-w-md lg:max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden relative z-10 flex flex-col lg:flex-row min-h-[600px]">
      
      <!-- Branding Side (Visible on Desktop) -->
      <div class="hidden lg:flex w-1/2 bg-gray-900 p-16 flex-col justify-between relative overflow-hidden">
         <div class="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
          <div class="relative z-10 text-white">
             <!-- Dynamic Logo -->
             <div v-if="brandingStore.fullLogoUrl" class="mb-8">
               <img :src="brandingStore.fullLogoUrl" class="h-20 w-auto object-contain rounded-2xl shadow-premium border-2 border-primary/20 bg-white/10 p-2" />
             </div>
             
             <h2 class="text-4xl font-black tracking-tight leading-tight" v-html="formattedBrandName"></h2>
             <p class="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mt-4">Cita Rasa Autentik Minang</p>
          </div>
         <div class="relative z-10">
            <div class="w-12 h-1 bg-primary mb-6"></div>
            <p class="text-sm font-medium text-gray-400 leading-relaxed">Selamat datang di sistem manajemen terpadu. Silakan masuk untuk memulai pesanan atau mengelola operasional restoran.</p>
         </div>
      </div>

      <!-- Form Side -->
      <div class="flex-1 p-10 md:p-16 flex flex-col">
        <!-- Back for Mobile -->
        <button @click="router.back()" class="lg:hidden self-start p-2 -ml-2 text-gray-400 hover:text-primary transition-colors mb-8">
          <i class="fa-solid fa-arrow-left text-xl"></i>
        </button>

        <div class="mb-12">
          <h1 class="text-3xl font-black text-gray-900 tracking-tight">Portal <span class="text-primary">Otentikasi</span></h1>
          <p class="text-gray-400 font-bold mt-2 text-[10px] uppercase tracking-widest">Silakan masuk dengan email terdaftar</p>
        </div>

        <form @submit.prevent="handleLogin" class="flex-1 flex flex-col gap-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Identity</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <i class="fa-solid fa-envelope"></i>
              </div>
              <input 
                type="email" 
                v-model="email" 
                placeholder="email@example.com"
                class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all"
                required 
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Access Key</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <i class="fa-solid fa-lock"></i>
              </div>
              <input 
                type="password" 
                v-model="password" 
                placeholder="••••••••"
                class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all"
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-base shadow-xl hover:bg-primary transition-all flex justify-center items-center gap-3 disabled:bg-gray-400 active:scale-95 mt-4 uppercase tracking-widest"
          >
            <div v-if="isLoading" class="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>{{ isLoading ? 'Verifikasi...' : 'Masuk Sekarang' }}</span>
          </button>
        </form>

        <div class="mt-8 pt-8 border-t border-gray-50 text-center">
          <p class="text-gray-400 font-bold text-xs">Belum terdaftar? <router-link to="/register" class="text-primary font-black ml-1 uppercase tracking-wider underline underline-offset-4">Daftar Akun</router-link></p>
        </div>
      </div>
    </div>

    <NotificationToast ref="toast" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useBrandingStore } from '../stores/branding';
import { computed } from 'vue';
import NotificationToast from '../components/NotificationToast.vue';

const brandingStore = useBrandingStore();

const formattedBrandName = computed(() => {
  const name = brandingStore.restaurantName || 'RM Siantar Minang';
  const words = name.split(' ');
  if (words.length <= 1) return name;
  const lastWord = words.pop();
  return `${words.join(' ')}<br/><span class="text-primary">${lastWord}</span>`;
});

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
      toast.value?.display('Otentikasi berhasil!');
      
      const rolePathMap = {
        ADMIN: '/staff/admin',
        KASIR: '/staff/cashier',
        KITCHEN: '/staff/kitchen',
        DRIVER: '/staff/admin',
      };

      setTimeout(() => {
        if (authStore.isStaff) {
          router.push(rolePathMap[authStore.userRole] || '/staff/admin');
        } else {
          router.push(route.query.redirect || '/menu');
        }
      }, 800);
    } else {
      toast.value?.display('Email atau password tidak dikenali.', 'error');
    }
  } catch (err) {
    toast.value?.display('Terjadi gangguan jaringan.', 'error');
  } finally {
    isLoading.value = false;
  }
};
</script>
