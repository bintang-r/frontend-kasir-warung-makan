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
           <div v-for="cat in categories" :key="cat.id" class="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex justify-between items-center group hover:bg-white hover:border-primary transition-all" :class="selectedCatIds.includes(cat.id) ? 'ring-2 ring-primary bg-primary/5' : ''">
              <div class="flex items-center gap-4">
                 <input type="checkbox" class="w-4 h-4 accent-primary rounded" :value="cat.id" v-model="selectedCatIds" />
                 <div class="w-2 h-10 bg-primary group-hover:scale-y-110 transition-transform rounded-full"></div>
                 <span class="font-black text-gray-900 uppercase tracking-widest text-sm">{{ cat.name }}</span>
              </div>
              <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button @click="openCategoryModal(cat)" class="p-2.5 bg-white shadow-sm text-gray-400 hover:text-blue-600 rounded-xl"><i class="fa-solid fa-pen"></i></button>
                  <button @click="confirmDelete('category', cat)" class="p-2.5 bg-white shadow-sm text-gray-400 hover:text-red-600 rounded-xl"><i class="fa-solid fa-trash"></i></button>
              </div>
           </div>
        </div>
      </div>

      <!-- Tables Management -->
      <div class="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col h-[600px]">
        <div class="flex justify-between items-center mb-10">
           <div>
             <h3 class="text-2xl font-black text-gray-900 tracking-tight">Meja &amp; QR Code</h3>
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
                    <p class="text-[10px] font-bold text-gray-500 mt-0.5">Kapasitas: {{ table.capacity }} Orang</p>
                    <p class="text-[9px] font-black uppercase tracking-tighter mt-1" :class="table.status === 'AKTIF' ? 'text-green-500' : 'text-red-500'">Status: {{ table.status }}</p>
                 </div>
              </div>
              <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button @click="openTableModal(table)" class="p-2.5 bg-white shadow-sm text-gray-400 hover:text-blue-600 rounded-xl"><i class="fa-solid fa-pen"></i></button>
                  <button @click="confirmDelete('table', table)" class="p-2.5 bg-white shadow-sm text-gray-400 hover:text-red-600 rounded-xl"><i class="fa-solid fa-trash"></i></button>
              </div>
           </div>
        </div>
      </div>
    </div>

    <!-- Bulk Action Bar for Categories -->
    <transition name="slide-up">
      <div v-if="selectedCatIds.length > 0" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 rounded-[28px] px-8 py-5 flex items-center gap-6 shadow-2xl shadow-gray-900/40 border border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white font-black text-sm">{{ selectedCatIds.length }}</div>
          <span class="text-white font-bold text-sm">kategori dipilih</span>
        </div>
        <div class="w-px h-8 bg-white/10"></div>
        <button @click="confirmBulkDelete" class="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95">
          <i class="fa-solid fa-trash-can"></i> Hapus Terpilih
        </button>
        <button @click="selectedCatIds = []" class="text-gray-400 hover:text-white transition-colors p-2"><i class="fa-solid fa-xmark"></i></button>
      </div>
    </transition>

    <!-- Category Modal -->
    <div v-if="categoryModalOpen" class="fixed inset-0 z-[130] flex items-center justify-center p-6">
       <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="categoryModalOpen = false"></div>
       <div class="bg-white w-full max-w-sm rounded-[40px] shadow-2xl relative z-10 p-10 animate-scale-in">
          <h3 class="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">Kelola Kategori</h3>
          <input v-model="categoryForm.name" placeholder="Nama Kategori Baru" class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all mb-6" />
          <button @click="submitCategory" class="w-full bg-primary text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest">{{ categoryForm.id ? 'Perbarui' : 'Tambahkan' }}</button>
       </div>
    </div>

    <!-- Table Modal -->
    <div v-if="tableModalOpen" class="fixed inset-0 z-[130] flex items-center justify-center p-6">
       <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="tableModalOpen = false"></div>
       <div class="bg-white w-full max-w-sm rounded-[40px] shadow-2xl relative z-10 p-10 animate-scale-in">
          <h3 class="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">Kelola Meja</h3>
          <div class="space-y-4 mb-6">
             <input v-model="tableForm.name" placeholder="E.g. Meja 01" class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-gray-900 outline-none transition-all" />
             <input type="number" v-model="tableForm.capacity" placeholder="Kapasitas (Orang)" class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-gray-900 outline-none transition-all" />
             <select v-model="tableForm.status" class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 px-6 text-sm font-bold appearance-none">
                <option value="AKTIF">AKTIF</option>
                <option value="NONAKTIF">NONAKTIF</option>
             </select>
          </div>
          <button @click="submitTable" class="w-full bg-gray-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest">{{ tableForm.id ? 'Perbarui' : 'Tambahkan' }}</button>
       </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteModalOpen" class="fixed inset-0 z-[140] flex items-center justify-center p-6">
       <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm shadow-2xl" @click="deleteModalOpen = false"></div>
       <div class="bg-white w-full max-w-md rounded-[32px] shadow-2xl relative z-10 overflow-hidden animate-scale-in p-8 text-center">
          <div class="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
             <i class="fa-solid fa-triangle-exclamation text-2xl"></i>
          </div>
          <h3 class="text-2xl font-black text-gray-900 tracking-tight mb-2">{{ isBulkDelete ? `Hapus ${selectedCatIds.length} Kategori?` : `Hapus ${deleteType === 'category' ? 'Kategori' : 'Meja'}?` }}</h3>
          <p class="text-sm font-medium text-gray-500 mb-8 leading-relaxed">
             <span v-if="isBulkDelete">Anda akan menghapus <strong>{{ selectedCatIds.length }} kategori</strong> beserta seluruh menu di dalamnya secara permanen.</span>
             <span v-else>
               Apakah Anda yakin ingin menghapus <strong>{{ itemToDelete?.name }}</strong>?
               <span v-if="deleteType === 'category'" class="block mt-2">Menghapus kategori juga akan menghapus seluruh menu yang ada di dalamnya secara permanen.</span>
               <span v-else class="block mt-2">Data pesanan yang terkait meja ini akan tetap ada namun status mejanya akan dilepas.</span>
             </span>
          </p>
          <div class="flex gap-4">
             <button @click="deleteModalOpen = false" class="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all text-xs uppercase tracking-widest">Batal</button>
             <button @click="executeDelete" class="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl transition-all text-xs uppercase tracking-widest shadow-lg shadow-red-500/30">Ya, Hapus</button>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import api from '../../services/api';

const categories = ref([]);
const tables = ref([]);
const selectedCatIds = ref([]);
const isBulkDelete = ref(false);

const staffToast = inject('staffToast');

const categoryModalOpen = ref(false);
const categoryForm = ref({ id: null, name: '' });

const tableModalOpen = ref(false);
const tableForm = ref({ id: null, name: '', capacity: 4, status: 'AKTIF' });

const deleteModalOpen = ref(false);
const deleteType = ref('');
const itemToDelete = ref(null);

const fetchData = async () => {
   try {
      const [cRes, tRes] = await Promise.all([api.get('/categories'), api.get('/tables')]);
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

const openTableModal = (table = null) => {
   tableForm.value = table ? { ...table } : { id: null, name: '', capacity: 4, status: 'AKTIF' };
   tableModalOpen.value = true;
};

const submitTable = async () => {
   try {
      if (tableForm.value.id) await api.put(`/tables/${tableForm.value.id}`, tableForm.value);
      else await api.post('/tables', tableForm.value);
      staffToast.value?.display('Data meja pelanggan berhasil diperbarui', 'success', 'Update Infrastruktur');
      tableModalOpen.value = false;
      fetchData();
   } catch (err) { staffToast.value?.display('Gagal memperbarui data meja.', 'error'); }
};

const confirmDelete = (type, item) => {
   isBulkDelete.value = false;
   deleteType.value = type;
   itemToDelete.value = item;
   deleteModalOpen.value = true;
};

const confirmBulkDelete = () => {
   isBulkDelete.value = true;
   deleteType.value = 'category';
   deleteModalOpen.value = true;
};

const executeDelete = async () => {
   deleteModalOpen.value = false;
   try {
      if (isBulkDelete.value) {
         await api.post('/categories/bulk-delete', { ids: selectedCatIds.value.map(String) });
         staffToast.value?.display(`${selectedCatIds.value.length} kategori berhasil dihapus.`, 'info', 'Bulk Delete');
         selectedCatIds.value = [];
      } else {
         const id = itemToDelete.value.id;
         const type = deleteType.value;
         if (type === 'category') {
            await api.delete(`/categories/${id}`);
            staffToast.value?.display('Kategori dan seluruh menu terkait telah dihapus.', 'info', 'Operasi Selesai');
         } else {
            await api.delete(`/tables/${id}`);
            staffToast.value?.display('Data meja telah dihapus dari sistem.', 'info', 'Operasi Selesai');
         }
      }
      fetchData();
   } catch (err) {
      staffToast.value?.display(`Gagal menghapus ${deleteType.value === 'category' ? 'kategori' : 'meja'}.`, 'error');
   } finally { itemToDelete.value = null; }
};

onMounted(fetchData);
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateX(-50%) translateY(30px); }
</style>
