<template>
  <div class="space-y-10">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Categories Management -->
      <div class="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col h-[600px]">
        <div class="flex justify-between items-center mb-10">
           <div>
             <h3 class="text-2xl font-black text-gray-900 tracking-tight">Kategori Menu</h3>
             <p class="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Klasifikasi produk makanan</p>
           </div>
           <button @click="openCategoryModal()" class="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-premium">
              <i class="fa-solid fa-folder-plus text-xl"></i>
           </button>
        </div>

        <div class="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
           <div v-for="cat in categories" :key="cat.id" class="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex justify-between items-center group hover:bg-white hover:border-primary transition-all">
              <div class="flex items-center gap-4">
                 <div class="w-2 h-10 bg-primary group-hover:scale-y-110 transition-transform rounded-full"></div>
                 <span class="font-black text-gray-900 uppercase tracking-widest text-sm">{{ cat.name }}</span>
              </div>
              <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button @click="openCategoryModal(cat)" class="p-2.5 bg-white shadow-sm text-gray-400 hover:text-blue-600 rounded-xl"><i class="fa-solid fa-pen"></i></button>
                 <button @click="handleDeleteCategory(cat.id)" class="p-2.5 bg-white shadow-sm text-gray-400 hover:text-red-600 rounded-xl"><i class="fa-solid fa-trash"></i></button>
              </div>
           </div>
        </div>
      </div>

      <!-- Tables Management -->
      <div class="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col h-[600px]">
        <div class="flex justify-between items-center mb-10">
           <div>
             <h3 class="text-2xl font-black text-gray-900 tracking-tight">Meja & QR Code</h3>
             <p class="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Manajemen area makan pelanggan</p>
           </div>
           <button @click="openTableModal()" class="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-primary transition-all shadow-premium">
              <i class="fa-solid fa-plus text-xl"></i>
           </button>
        </div>

        <div class="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
           <div v-for="table in tables" :key="table.id" class="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex justify-between items-center group hover:bg-white hover:border-gray-900 transition-all">
              <div class="flex items-center gap-5">
                 <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm">
                    <i class="fa-solid fa-qrcode text-xl text-gray-900"></i>
                 </div>
                 <div>
                    <span class="font-black text-gray-900 uppercase tracking-widest text-sm">{{ table.name }}</span>
                    <p class="text-[9px] font-black uppercase tracking-tighter" :class="table.status === 'AKTIF' ? 'text-green-500' : 'text-red-500'">Status: {{ table.status }}</p>
                 </div>
              </div>
              <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button @click="openTableModal(table)" class="p-2.5 bg-white shadow-sm text-gray-400 hover:text-blue-600 rounded-xl"><i class="fa-solid fa-pen"></i></button>
                 <button @click="handleDeleteTable(table.id)" class="p-2.5 bg-white shadow-sm text-gray-400 hover:text-red-600 rounded-xl"><i class="fa-solid fa-trash"></i></button>
              </div>
           </div>
        </div>
      </div>
    </div>

    <!-- Modals (Simplified versions for brevity) -->
    <div v-if="categoryModalOpen" class="fixed inset-0 z-[130] flex items-center justify-center p-6">
       <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="categoryModalOpen = false"></div>
       <div class="bg-white w-full max-w-sm rounded-[40px] shadow-2xl relative z-10 p-10 animate-scale-in">
          <h3 class="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">Kelola Kategori</h3>
          <input v-model="categoryForm.name" placeholder="Nama Kategori Baru" class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all mb-6" />
          <button @click="submitCategory" class="w-full bg-primary text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest">{{ categoryForm.id ? 'Perbarui' : 'Tambahkan' }}</button>
       </div>
    </div>

    <div v-if="tableModalOpen" class="fixed inset-0 z-[130] flex items-center justify-center p-6">
       <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="tableModalOpen = false"></div>
       <div class="bg-white w-full max-w-sm rounded-[40px] shadow-2xl relative z-10 p-10 animate-scale-in">
          <h3 class="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">Kelola Meja</h3>
          <div class="space-y-4 mb-6">
             <input v-model="tableForm.name" placeholder="E.g. Meja 01" class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-gray-900 outline-none transition-all" />
             <select v-model="tableForm.status" class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 px-6 text-sm font-bold appearance-none">
                <option value="AKTIF">AKTIF</option>
                <option value="NONAKTIF">NONAKTIF</option>
             </select>
          </div>
          <button @click="submitTable" class="w-full bg-gray-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest">{{ tableForm.id ? 'Perbarui' : 'Tambahkan' }}</button>
       </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import api from '../../services/api';

const categories = ref([]);
const tables = ref([]);

const staffToast = inject('staffToast');

const categoryModalOpen = ref(false);
const categoryForm = ref({ id: null, name: '' });

const tableModalOpen = ref(false);
const tableForm = ref({ id: null, name: '', status: 'AKTIF' });

const fetchData = async () => {
   try {
      const [cRes, tRes] = await Promise.all([
         api.get('/categories'),
         api.get('/tables')
      ]);
      categories.value = cRes.data;
      tables.value = tRes.data;
   } catch (err) { console.error(err); }
};

const openCategoryModal = (cat = null) => {
   categoryForm.value = cat ? { ...cat } : { id: null, name: '' };
   categoryModalOpen.value = true;
};

const submitCategory = async () => {
   try {
      if (categoryForm.value.id) await api.put(`/categories/${categoryForm.value.id}`, categoryForm.value);
      else await api.post('/categories', categoryForm.value);
      staffToast.value?.display('Data kategori menu berhasil diperbarui', 'success', 'Update Infrastruktur');
      categoryModalOpen.value = false;
      fetchData();
   } catch (err) { staffToast.value?.display('Gagal memperbarui kategori.', 'error'); }
};

const handleDeleteCategory = async (id) => {
   if (!confirm('Hapus kategori ini?')) return;
   try { 
      await api.delete(`/categories/${id}`); 
      staffToast.value?.display('Kategori telah dihapus.', 'info', 'Operasi Data');
      fetchData(); 
   } catch (e) { staffToast.value?.display('Gagal menghapus kategori.', 'error'); }
};

const openTableModal = (table = null) => {
   tableForm.value = table ? { ...table } : { id: null, name: '', status: 'AKTIF' };
   tableModalOpen.value = true;
};

const submitTable = async () => {
   try {
      if (tableForm.value.id) await api.put(`/tables/${tableForm.value.id}`, tableForm.value);
      else await api.post('/tables', tableForm.value);
      staffToast.value?.display('Informasi meja berhasil diperbarui', 'success', 'Update Meja');
      tableModalOpen.value = false;
      fetchData();
   } catch (err) { staffToast.value?.display('Gagal memperbarui data meja.', 'error'); }
};

const handleDeleteTable = async (id) => {
   if (!confirm('Hapus meja ini?')) return;
   try { 
      await api.delete(`/tables/${id}`); 
      staffToast.value?.display('Meja telah dihapus dari sistem.', 'info', 'Operasi Data');
      fetchData(); 
   } catch (e) { staffToast.value?.display('Gagal menghapus meja.', 'error'); }
};

onMounted(fetchData);
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
</style>
