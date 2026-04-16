<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <div class="mb-10">
      <h1 class="text-3xl font-black text-gray-900 tracking-tight">Manajemen <span class="text-primary">Profil Staff</span></h1>
      <p class="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Kelola informasi identitas dan keamanan akun Anda</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Info Sidebar -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-gray-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          
          <div class="relative z-10 flex flex-col items-center text-center">
            <div class="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center text-4xl font-black mb-6 shadow-xl shadow-primary/30">
              {{ authStore.user?.name?.charAt(0).toUpperCase() }}
            </div>
            <h2 class="text-xl font-black truncate w-full">{{ authStore.user?.name }}</h2>
            <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">{{ authStore.user?.role }}</p>
            
            <div class="w-full h-px bg-white/10 my-6"></div>
            
            <div class="w-full space-y-3">
              <div class="flex items-center gap-3 text-left">
                <i class="fa-solid fa-envelope text-primary text-xs"></i>
                <span class="text-[11px] font-medium text-gray-400 truncate">{{ authStore.user?.email }}</span>
              </div>
              <div class="flex items-center gap-3 text-left">
                <i class="fa-solid fa-calendar-check text-primary text-xs"></i>
                <span class="text-[11px] font-medium text-gray-400">Aktif sejak {{ formattedJoinDate }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 border border-blue-100 rounded-2xl p-6">
           <div class="flex gap-4">
              <i class="fa-solid fa-shield-halved text-blue-500 text-xl"></i>
              <div>
                 <p class="text-xs font-black text-blue-900 uppercase tracking-widest mb-1">Keamanan Akun</p>
                 <p class="text-[10px] font-medium text-blue-700 leading-relaxed">Pastikan password Anda kuat dan sulit menebak. Jangan bagikan akun staff Anda kepada orang lain.</p>
              </div>
           </div>
        </div>
      </div>

      <!-- Main Form -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-[40px] shadow-sm border border-gray-100 p-10">
          <form @submit.prevent="handleUpdate" class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Nama Lengkap</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                    <i class="fa-solid fa-user"></i>
                  </div>
                  <input 
                    v-model="form.name"
                    type="text" 
                    required
                    class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all"
                    placeholder="Nama tampilan staff"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Alamat Email</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                    <i class="fa-solid fa-envelope"></i>
                  </div>
                  <input 
                    v-model="form.email"
                    type="email" 
                    required
                    class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all"
                    placeholder="email@work.com"
                  />
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Ganti Password (Biarkan kosong jika tidak ingin ganti)</label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <i class="fa-solid fa-lock"></i>
                </div>
                <input 
                  v-model="form.password"
                  type="password" 
                  class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div class="pt-6 border-t border-gray-50 flex justify-end">
              <button 
                type="submit" 
                :disabled="isLoading"
                class="bg-gray-900 border-none text-white px-10 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-3 disabled:bg-gray-300 active:scale-95 shadow-xl shadow-gray-900/10"
              >
                <div v-if="isLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{{ isLoading ? 'Menyimpan...' : 'Simpan Perubahan Profil' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <NotificationToast ref="toast" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useAuthStore } from '../../stores/auth';
import api from '../../services/api';
import NotificationToast from '../../components/NotificationToast.vue';

const authStore = useAuthStore();
const isLoading = ref(false);
const toast = ref(null);

const form = reactive({
  name: '',
  email: '',
  password: ''
});

const formattedJoinDate = computed(() => {
  if (!authStore.user?.createdAt) return '-';
  return new Intl.DateTimeFormat('id-ID', {
     month: 'long',
     year: 'numeric'
  }).format(new Date(authStore.user.createdAt));
});

onMounted(() => {
  if (authStore.user) {
    form.name = authStore.user.name;
    form.email = authStore.user.email;
  }
});

const handleUpdate = async () => {
  if (!form.name || !form.email) {
    toast.value?.display('Nama dan Email harus diisi', 'error');
    return;
  }

  isLoading.value = true;
  try {
    const updateData = {
      name: form.name,
      email: form.email
    };
    if (form.password) {
      if (form.password.length < 6) {
        toast.value?.display('Password minimal 6 karakter', 'error');
        isLoading.value = false;
        return;
      }
      updateData.password = form.password;
    }

    const response = await api.patch('/users/me', updateData);
    
    // Update local store
    authStore.user = { ...authStore.user, ...response.data };
    localStorage.setItem('user', JSON.stringify(authStore.user));
    
    toast.value?.display('Profil Anda berhasil diperbarui! ✨');
    form.password = '';
  } catch (err) {
    console.error(err);
    toast.value?.display('Gagal memperbarui profil. Silakan coba lagi.', 'error');
  } finally {
    isLoading.value = false;
  }
};
</script>
