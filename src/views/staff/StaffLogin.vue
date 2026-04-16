<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center p-6 relative overflow-hidden">
    <!-- Background Abstract shapes -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -ml-48 -mb-48"></div>

    <div class="w-full max-w-lg relative z-10">
      <div class="bg-white rounded-[40px] shadow-2xl overflow-hidden p-10 md:p-16 border border-white/20">
        <div class="flex flex-col items-center mb-12">
          <div class="bg-primary p-4 rounded-3xl shadow-premium mb-6 scale-110">
            <i class="fa-solid fa-user-shield text-white text-3xl"></i>
          </div>
          <h1 class="text-3xl font-black text-gray-900 tracking-tight text-center">Rumah Makan<br/><span class="text-primary">Siantar Minang</span></h1>
          <div class="mt-4 px-4 py-1.5 bg-gray-100 rounded-lg">
             <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Internal Staff Access Only</p>
          </div>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-2">
            <label class="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">Credential Identity (Email)</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                 <i class="fa-solid fa-envelope text-lg"></i>
              </div>
              <input 
                type="email" 
                v-model="email" 
                required
                placeholder="Identitas email Anda"
                class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">Secured Access Key</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                 <i class="fa-solid fa-lock text-lg"></i>
              </div>
              <input 
                type="password" 
                v-model="password" 
                required
                placeholder="••••••••••••"
                class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-base shadow-xl hover:bg-primary hover:text-white hover:scale-[1.02] transition-all flex justify-center items-center gap-3 disabled:bg-gray-400 active:scale-95 mt-10 uppercase tracking-widest"
          >
            <div v-if="isLoading" class="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>{{ isLoading ? 'Verifikasi...' : 'Masuk Portal Staff' }}</span>
          </button>
        </form>

        <p class="mt-12 text-center text-xs font-bold text-gray-400 leading-relaxed uppercase tracking-tighter">
          Mengalami kendala akses?<br/>
          <span class="text-gray-300">Hubungi Administrator IT RM Siantar Minang</span>
        </p>
      </div>

      <div class="mt-8 flex justify-center gap-8 text-white/30 font-black text-[10px] uppercase tracking-[0.3em]">
        <span>Encrypted</span>
        <span>Secure</span>
        <span>Desktop Only</span>
      </div>
    </div>
    
    <NotificationToast ref="toast" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import NotificationToast from '../../components/NotificationToast.vue';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const toast = ref(null);

const handleLogin = async () => {
  isLoading.value = true;
  const success = await authStore.login(email.value, password.value);
  
  if (success) {
    const role = authStore.user.role;
    if (['ADMIN', 'KASIR', 'KITCHEN'].includes(role)) {
      toast.value?.display('Otentikasi Berhasil, Selamat Datang!');
      setTimeout(() => {
        if (role === 'ADMIN') router.push('/staff/admin');
        else if (role === 'KASIR') router.push('/staff/cashier');
        else if (role === 'KITCHEN') router.push('/staff/kitchen');
      }, 1000);
    } else {
      authStore.logout();
      toast.value?.display('Maaf, akun Anda tidak memiliki akses ke Portal Staff.', 'error');
      isLoading.value = false;
    }
  } else {
    toast.value?.display('Identitas atau Kunci Akses tidak valid.', 'error');
    isLoading.value = false;
  }
};
</script>
