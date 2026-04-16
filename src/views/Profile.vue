<template>
  <div class="bg-[#fafafa] min-h-screen pb-40">
    <!-- Header -->
    <div class="px-6 pt-12 pb-6 bg-white/80 backdrop-blur-xl sticky top-0 z-30 border-b border-gray-100 flex items-center justify-between">
      <div class="flex items-center gap-4">
         <button @click="router.back()" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all active:scale-90">
            <i class="fa-solid fa-chevron-left"></i>
         </button>
         <div>
            <h1 class="text-xl font-black text-gray-900 leading-none">Pengaturan <span class="text-primary">Profil</span></h1>
            <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Kelola identitas dan keamanan akun</p>
         </div>
      </div>
      <button @click="handleLogout" class="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center active:scale-95 transition-all">
         <i class="fa-solid fa-power-off"></i>
      </button>
    </div>

    <!-- Content -->
    <div class="px-6 mt-8 max-w-lg mx-auto space-y-8">
      <!-- Identity Card -->
      <div class="bg-gray-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
         <div class="absolute -right-16 -top-16 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
         <div class="flex items-center gap-6 relative z-10">
            <div class="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[28px] flex items-center justify-center text-3xl font-black text-white border border-white/10 shadow-inner">
               {{ authStore.user?.name?.charAt(0).toUpperCase() }}
            </div>
            <div>
               <h2 class="text-2xl font-black tracking-tight">{{ authStore.user?.name }}</h2>
               <p class="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mt-1">{{ authStore.user?.email }}</p>
               <div class="mt-4 inline-flex items-center px-3 py-1 bg-primary rounded-lg text-[8px] font-black uppercase tracking-widest">
                  {{ authStore.user?.role }}
               </div>
            </div>
         </div>
      </div>

      <!-- Update Form -->
      <div class="space-y-6">
         <h3 class="font-black text-[10px] text-gray-400 uppercase tracking-[0.2em] px-2">Informasi Personal</h3>
         
         <div class="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-gray-200/40 space-y-8">
            <div class="space-y-2">
               <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
               <div class="relative">
                  <i class="fa-solid fa-user absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"></i>
                  <input v-model="form.name" class="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-6 text-sm font-black focus:bg-white focus:border-primary transition-all outline-none" />
               </div>
            </div>

            <div class="space-y-2">
               <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Alamat Email</label>
               <div class="relative">
                  <i class="fa-solid fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"></i>
                  <input v-model="form.email" class="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-6 text-sm font-black focus:bg-white focus:border-primary transition-all outline-none" />
               </div>
            </div>

            <div class="pt-4 border-t border-gray-50">
               <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kredensial Login</label>
               <div class="relative mt-2">
                  <i class="fa-solid fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"></i>
                  <input v-model="form.password" type="password" placeholder="Ganti password (opsional)" class="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-6 text-sm font-black focus:bg-white focus:border-primary transition-all outline-none" />
               </div>
            </div>
         </div>

         <button 
           @click="handleUpdate"
           :disabled="loading"
           class="w-full bg-gray-900 text-white h-16 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 hover:bg-primary"
         >
           <span v-if="!loading">Perbarui Profil</span>
           <div v-else class="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
         </button>
      </div>

      <!-- Statistics (Static for aesthetics) -->
      <div class="grid grid-cols-2 gap-4">
         <div class="bg-white p-6 rounded-[32px] border border-gray-100 flex flex-col items-center">
            <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Order</p>
            <p class="text-xl font-black text-gray-900">12</p>
         </div>
         <div class="bg-white p-6 rounded-[32px] border border-gray-100 flex flex-col items-center">
            <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Loyalty Points</p>
            <p class="text-xl font-black text-primary">850</p>
         </div>
      </div>
    </div>

    <NotificationToast ref="toastRef" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import api from '../services/api';
import NotificationToast from '../components/NotificationToast.vue';

const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);
const toastRef = ref(null);

const form = reactive({
  name: '',
  email: '',
  password: ''
});

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }
  if (authStore.user) {
    form.name = authStore.user.name;
    form.email = authStore.user.email;
  }
});

const handleUpdate = async () => {
  loading.value = true;
  try {
    const updateData = { name: form.name, email: form.email };
    if (form.password) updateData.password = form.password;

    const response = await api.patch('/users/me', updateData);
    
    // Sync store and session
    const updatedUser = { ...authStore.user, ...response.data };
    authStore.user = updatedUser;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    toastRef.value?.display('Profil berhasil diperbarui! ✨');
    form.password = '';
  } catch (e) {
    toastRef.value?.display('Gagal memperbarui profil.', 'error');
  } finally {
    loading.value = false;
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
