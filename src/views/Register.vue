<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6 relative overflow-hidden">
    <!-- Background Decor for Desktop -->
    <div class="hidden lg:block absolute top-0 left-0 w-1/2 h-full bg-primary/5 skew-x-12 origin-top-left"></div>

    <div class="w-full max-w-md lg:max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden relative z-10 flex flex-col lg:flex-row-reverse min-h-[600px]">
      
      <!-- Branding Side (Visible on Desktop) -->
      <div class="hidden lg:flex w-1/2 bg-gray-900 p-16 flex-col justify-between relative overflow-hidden">
         <div class="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
         <div class="relative z-10 text-white">
            <h2 class="text-4xl font-black tracking-tight leading-tight">Mulai<br/><span class="text-primary">Petualangan Rasa</span></h2>
            <p class="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mt-4">Pendaftaran Pelanggan Baru</p>
         </div>
         <div class="relative z-10">
            <div class="w-12 h-1 bg-primary mb-6"></div>
            <p class="text-sm font-medium text-gray-400 leading-relaxed">Bergabunglah dengan ribuan pecinta kuliner Minang lainnya. Dapatkan akses ke promo eksklusif dan riwayat pesanan personal Anda.</p>
         </div>
      </div>

      <!-- Form Side -->
      <div class="flex-1 p-10 md:p-16 flex flex-col">
        <!-- Back for Mobile -->
        <button @click="router.back()" class="lg:hidden self-start p-2 -ml-2 text-gray-400 hover:text-primary transition-colors mb-8">
          <i class="fa-solid fa-arrow-left text-xl"></i>
        </button>

        <div class="mb-12">
          <h1 class="text-3xl font-black text-gray-900 tracking-tight">Daftar <span class="text-primary">Akun</span></h1>
          <p class="text-gray-400 font-bold mt-2 text-[10px] uppercase tracking-widest">Lengkapi data diri anda dibawah ini</p>
        </div>

        <form @submit.prevent="handleRegister" class="flex-1 flex flex-col gap-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Identity</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <i class="fa-solid fa-user"></i>
              </div>
              <input 
                type="text" 
                v-model="name" 
                placeholder="Nama Lengkap Anda"
                class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all"
                required 
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
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
            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Secure Password</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <i class="fa-solid fa-lock"></i>
              </div>
              <input 
                type="password" 
                v-model="password" 
                placeholder="Min. 6 karakter"
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
            <span>{{ isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang' }}</span>
          </button>
        </form>

        <div class="mt-8 pt-8 border-t border-gray-50 text-center">
          <p class="text-gray-400 font-bold text-xs">Sudah punya akun? <router-link to="/login" class="text-primary font-black ml-1 uppercase tracking-wider underline underline-offset-4">Masuk Di Sini</router-link></p>
        </div>
      </div>
    </div>

    <NotificationToast ref="toast" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import NotificationToast from '../components/NotificationToast.vue';

const router = useRouter();
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
    await api.post('/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value
    });
    
    toast.value?.display('Akun berhasil dibuat! Mengalihkan...');
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  } catch (err) {
    const message = err.response?.data?.message || 'Gagal mendaftar, email mungkin sudah ada.';
    toast.value?.display(message, 'error');
  } finally {
    isLoading.value = false;
  }
};
</script>
