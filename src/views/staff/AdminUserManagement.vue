<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
       <div>
          <h2 class="text-2xl font-black text-gray-900 tracking-tight">Manajemen User & Staff</h2>
          <p class="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest">Kelola akun pelanggan dan akses internal staff</p>
       </div>
       <div class="flex gap-4">
          <div class="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100 flex items-center gap-3">
             <i class="fa-solid fa-users text-primary"></i>
             <span class="text-sm font-black text-gray-900">{{ users.length }} <span class="text-[10px] text-gray-400 uppercase ml-1">Total Entitas</span></span>
          </div>
       </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden p-10">
       <div class="overflow-x-auto">
          <table class="w-full text-left">
             <thead>
                <tr class="border-b border-gray-50">
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Inisial</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Identitas User</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Terdaftar</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Otoritas Role</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Sejak</th>
                   <th class="pb-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Aksi</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-gray-50">
                <tr v-for="user in users" :key="user.id" class="group hover:bg-gray-50/50 transition-colors">
                   <td class="py-6">
                      <div class="w-10 h-10 rounded-xl bg-gray-100 font-black text-sm flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">
                         {{ user.name?.charAt(0) }}
                      </div>
                   </td>
                   <td class="py-6">
                      <p class="font-black text-gray-900 text-sm tracking-tight capitalize">{{ user.name }}</p>
                   </td>
                   <td class="py-6 text-sm font-bold text-gray-500">{{ user.email }}</td>
                   <td class="py-6 text-center">
                      <span :class="getRoleClass(user.role)" class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                         {{ user.role }}
                      </span>
                   </td>
                   <td class="py-6 text-center text-[10px] font-bold text-gray-400">{{ formatDate(user.createdAt) }}</td>
                   <td class="py-6 text-right">
                      <button @click="openModal(user)" class="p-2.5 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                         <i class="fa-solid fa-user-pen"></i>
                      </button>
                   </td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-[120] flex items-center justify-center p-6">
       <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm shadow-2xl" @click="isModalOpen = false"></div>
       <div class="bg-white w-full max-w-md rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-scale-in">
          <div class="p-12">
             <div class="flex justify-between items-start mb-10">
                <div>
                   <h3 class="text-3xl font-black text-gray-900 tracking-tight">Update Otoritas</h3>
                   <p class="text-xs font-bold text-primary uppercase tracking-widest mt-1">Ubah peran dan akses user</p>
                </div>
                <button @click="isModalOpen = false" class="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                   <i class="fa-solid fa-xmark"></i>
                </button>
             </div>

             <form @submit.prevent="handleSubmit" class="space-y-8">
                <div class="space-y-2">
                   <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pilih Role Baru</label>
                   <div class="grid grid-cols-2 gap-4">
                      <button 
                         v-for="role in availableRoles" :key="role"
                         type="button"
                         @click="form.role = role"
                         :class="form.role === role ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-white text-gray-400'"
                         class="p-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all text-center"
                      >
                         {{ role }}
                      </button>
                   </div>
                </div>

                <div class="pt-6 border-t border-gray-50">
                   <button 
                      type="submit" 
                      :disabled="isSubmitting"
                      class="w-full bg-gray-900 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-primary transition-all flex justify-center items-center gap-3 disabled:bg-gray-400 active:scale-95 uppercase tracking-widest"
                   >
                      <div v-if="isSubmitting" class="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{{ isSubmitting ? 'Memproses...' : 'Simpan Perubahan Role' }}</span>
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
import { ref, onMounted } from 'vue';
import api from '../../services/api';
import NotificationToast from '../../components/NotificationToast.vue';

const users = ref([]);
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const toast = ref(null);
const availableRoles = ['CUSTOMER', 'ADMIN', 'KASIR', 'KITCHEN', 'DRIVER'];

const form = ref({
   id: null,
   role: ''
});

const fetchUsers = async () => {
   try {
      const res = await api.get('/users');
      users.value = res.data;
   } catch (err) {
      console.error('Fetch users failed', err);
   }
};

const openModal = (user) => {
   form.value = { id: user.id.toString(), role: user.role };
   isModalOpen.value = true;
};

const handleSubmit = async () => {
   isSubmitting.value = true;
   try {
      await api.patch(`/users/${form.value.id}`, { role: form.value.role }); 
      
      toast.value?.display('Otoritas user berhasil diperbarui');
      isModalOpen.value = false;
      fetchUsers();
   } catch (err) {
      console.error('Update failed', err);
      toast.value?.display('Gagal memperbarui role', 'error');
   } finally {
      isSubmitting.value = false;
   }
};

const getRoleClass = (role) => {
   const classes = {
      ADMIN: 'bg-primary text-white shadow-lg shadow-primary/20',
      KASIR: 'bg-blue-600 text-white shadow-lg shadow-blue-200',
      KITCHEN: 'bg-orange-500 text-white shadow-lg shadow-orange-100',
      DRIVER: 'bg-emerald-600 text-white shadow-lg shadow-emerald-100',
      CUSTOMER: 'bg-gray-100 text-gray-500'
   };
   return classes[role] || 'bg-gray-50';
};

const formatDate = (date) => new Intl.DateTimeFormat('id-ID').format(new Date(date));

onMounted(fetchUsers);
</script>

<style scoped>
.animate-scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
