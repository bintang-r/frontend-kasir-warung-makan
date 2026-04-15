<template>
  <div class="bg-gray-50/30 min-h-screen pb-32">
    <!-- Header -->
    <div class="px-6 pt-12 pb-6 bg-white sticky top-0 z-30 border-b border-gray-100 flex items-center justify-between">
      <div>
        <h1 class="text-xl font-black text-gray-900 leading-none">Profil <span class="text-primary">Ambo</span></h1>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Kelola Akun Dunsanak</p>
      </div>
      <button @click="handleLogout" class="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
      </button>
    </div>

    <!-- Content -->
    <div class="px-6 mt-8">
      <!-- User Card -->
      <div v-if="authStore.user" class="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm relative overflow-hidden mb-8">
         <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
         
         <div class="flex items-center gap-6 relative z-10">
            <div class="w-20 h-20 bg-primary text-white rounded-3xl flex items-center justify-center text-3xl font-black shadow-lg shadow-primary/20">
               {{ authStore.user?.name?.charAt(0).toUpperCase() }}
            </div>
            <div>
               <h2 class="text-2xl font-black text-gray-900 leading-tight">{{ authStore.user?.name }}</h2>
               <p class="text-sm font-bold text-gray-400 mt-1">{{ authStore.user?.email }}</p>
               <div class="mt-2 inline-flex items-center px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  {{ authStore.user?.role }}
               </div>
            </div>
         </div>
      </div>

      <!-- Settings Form -->
      <div class="space-y-6">
        <h3 class="font-black text-xs text-gray-400 uppercase tracking-widest px-1">Pengaturan Profil</h3>
        
        <div class="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm space-y-6">
           <!-- Name -->
           <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Nama Lengkap</label>
              <input 
                v-model="form.name"
                type="text" 
                class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 text-sm font-bold transition-all"
                placeholder="Namo sanak..."
              />
           </div>

           <!-- Email -->
           <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Alamat Email</label>
              <input 
                v-model="form.email"
                type="email" 
                class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 text-sm font-bold transition-all"
                placeholder="Email sanak..."
              />
           </div>

           <!-- Password -->
           <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Ganti Password (Opsional)</label>
              <input 
                v-model="form.password"
                type="password" 
                class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 text-sm font-bold transition-all"
                placeholder="••••••••"
              />
              <p class="text-[9px] text-gray-400 mt-2 px-1 italic">Kosongan se kalau indak nio ganti password.</p>
           </div>
        </div>

        <!-- Submit -->
        <button 
          @click="handleUpdate"
          :disabled="loading"
          class="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50"
        >
          <span v-if="!loading">Simpan Parubahan</span>
          <span v-else class="flex items-center justify-center gap-2">
             <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
             Menyimpan...
          </span>
        </button>
      </div>
    </div>

    <!-- Notification Toast -->
    <transition
      enter-active-class="transition duration-300 ease-out translate-y-4"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in opacity-100"
      leave-to-class="opacity-0"
    >
       <div v-if="toast" class="fixed bottom-32 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest z-50 shadow-2xl">
          {{ toast }}
       </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import api from '../services/api';

const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);
const toast = ref('');

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
    const updateData = {
      name: form.name,
      email: form.email
    };
    if (form.password) {
      updateData.password = form.password;
    }

    const response = await api.patch('/users/me', updateData);
    
    // Update local store AND persist to localStorage
    const updatedUser = { ...authStore.user, ...response.data };
    authStore.user = updatedUser;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    toast.value = 'Profil alah berhasil diupdate! ✨';
    form.password = '';
    setTimeout(() => toast.value = '', 3000);
  } catch (e) {
    console.error(e);
    toast.value = 'Maaf, gagal mengupdate profil. ❌';
    setTimeout(() => toast.value = '', 3000);
  } finally {
    loading.value = false;
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
</style>
