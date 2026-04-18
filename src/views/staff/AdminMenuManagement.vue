<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
       <div>
          <h2 class="text-2xl font-black text-gray-900 tracking-tight">Katalog Menu</h2>
          <p class="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest">Master data makanan dan minuman</p>
       </div>
       <div class="flex gap-4">
           <button @click="openImportModal" class="bg-gray-100 text-gray-700 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
              <i class="fa-solid fa-file-excel text-green-600"></i> Import Excel
           </button>
           <button @click="openModal()" class="bg-primary text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              <i class="fa-solid fa-plus mr-2"></i> Tambah Menu Baru
           </button>
       </div>
    </div>

    <!-- Categories Summary -->
    <div class="flex overflow-x-auto gap-4 pb-2 scrollbar-hide">
       <button 
          v-for="cat in categories" :key="cat.id"
          class="flex-shrink-0 px-6 py-3 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all"
          :class="selectedCategory === cat.id ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'"
          @click="selectedCategory = cat.id"
       >
          {{ cat.name }}
       </button>
    </div>

    <!-- Menus Table -->
    <div class="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden p-10">
       <div class="overflow-x-auto">
          <table class="w-full text-left">
             <thead>
                <tr class="border-b border-gray-50">
                   <th class="pb-6 w-10">
                     <input type="checkbox" class="w-4 h-4 accent-primary rounded" :checked="allSelected" @change="toggleSelectAll" />
                   </th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Foto</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Menu</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Kategori</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Harga</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                   <th class="pb-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Aksi</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-gray-50">
                <tr v-for="menu in filteredMenus" :key="menu.id" class="group hover:bg-gray-50/50 transition-colors" :class="selectedIds.includes(menu.id) ? 'bg-primary/5' : ''">
                   <td class="py-6">
                     <input type="checkbox" class="w-4 h-4 accent-primary rounded" :value="menu.id" v-model="selectedIds" />
                   </td>
                   <td class="py-6">
                      <img :src="getImageUrl(menu.image)" class="w-14 h-14 rounded-2xl object-cover shadow-sm grayscale group-hover:grayscale-0 transition-all border border-gray-100" />
                   </td>
                   <td class="py-6">
                      <p class="font-black text-gray-900 text-sm tracking-tight">{{ menu.name }}</p>
                      <p class="text-[10px] font-bold text-gray-400 line-clamp-1 max-w-[200px]">{{ menu.description || 'Tidak ada deskripsi' }}</p>
                      <span v-if="menu.isPopular" class="inline-block mt-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md text-[8px] font-black uppercase"><i class="fa-solid fa-fire mr-1"></i> Rekomendasi</span>
                   </td>
                   <td class="py-6">
                      <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">{{ menu.category?.name }}</span>
                   </td>
                   <td class="py-6 font-black text-gray-900 text-sm">Rp {{ formatPrice(menu.price) }}</td>
                   <td class="py-6 text-center">
                      <span :class="menu.isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'" class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                         {{ menu.isAvailable ? 'Tersedia' : 'Habis' }}
                      </span>
                   </td>
                   <td class="py-6 text-right space-x-2">
                      <button @click="openModal(menu)" class="p-2.5 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50(rounded-xl transition-all"><i class="fa-solid fa-pen-to-square"></i></button>
                      <button @click="confirmDelete(menu)" class="p-2.5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><i class="fa-solid fa-trash-can"></i></button>
                   </td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>

    <!-- Bulk Action Bar -->
     <transition name="slide-up">
       <div v-if="selectedIds.length > 0" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 rounded-[28px] px-8 py-5 flex items-center gap-6 shadow-2xl shadow-gray-900/40 border border-white/10">
         <div class="flex items-center gap-3">
           <div class="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white font-black text-sm">{{ selectedIds.length }}</div>
           <span class="text-white font-bold text-sm">menu dipilih</span>
         </div>
         <div class="w-px h-8 bg-white/10"></div>
         <button @click="confirmBulkDelete" class="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95">
           <i class="fa-solid fa-trash-can"></i> Hapus Terpilih
         </button>
         <button @click="selectedIds = []" class="text-gray-400 hover:text-white transition-colors p-2">
           <i class="fa-solid fa-xmark"></i>
         </button>
       </div>
     </transition>

     <!-- Import Excel Modal -->
     <div v-if="isImportModalOpen" class="fixed inset-0 z-[130] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm shadow-2xl" @click="isImportModalOpen = false"></div>
        <div class="bg-white w-full max-w-md rounded-[40px] shadow-2xl relative z-10 p-10 animate-scale-in">
           <div class="flex justify-between items-start mb-8">
              <div>
                 <h3 class="text-2xl font-black text-gray-900 tracking-tight">Import Data Menu</h3>
                 <p class="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Unggah file Excel .xlsx</p>
              </div>
              <button @click="isImportModalOpen = false" class="text-gray-400 hover:text-red-500 transition-colors"><i class="fa-solid fa-xmark text-xl"></i></button>
           </div>
           
           <div class="space-y-6">
              <button @click="downloadTemplate" class="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2 hover:bg-green-50 hover:border-green-300 hover:text-green-600 transition-all group">
                 <i class="fa-solid fa-download text-2xl text-gray-300 group-hover:text-green-500"></i>
                 <span class="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-green-600">Download Template Excel</span>
              </button>
 
              <div class="relative group">
                 <input type="file" @change="handleExcelUpload" accept=".xlsx, .xls" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                 <div class="w-full py-6 rounded-2xl bg-gray-50 border-2 border-gray-100 flex flex-col items-center justify-center gap-3 transition-all group-hover:border-primary">
                    <div class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-primary">
                       <i class="fa-solid fa-file-import text-xl"></i>
                    </div>
                    <div class="text-center">
                       <p class="text-xs font-black text-gray-900">{{ uploadedExcelFile ? uploadedExcelFile.name : 'Pilih File Excel' }}</p>
                       <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{{ uploadedExcelFile ? 'Siap diproses' : 'Klik atau drag file ke sini' }}</p>
                    </div>
                 </div>
              </div>
 
              <button 
                 @click="processImport" 
                 :disabled="!uploadedExcelFile || isImporting"
                 class="w-full bg-gray-900 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-primary transition-all flex justify-center items-center gap-3 disabled:bg-gray-400 uppercase tracking-widest text-xs"
              >
                 <div v-if="isImporting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                 <span>{{ isImporting ? 'Memproses...' : 'Mulai Import' }}</span>
              </button>
           </div>
        </div>
     </div>

    <!-- Modals and Form (Same as Before) -->
    <div v-if="isModalOpen" class="fixed inset-0 z-[120] flex items-center justify-center p-6">
       <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm shadow-2xl" @click="isModalOpen = false"></div>
       <div class="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-scale-in">
          <div class="p-12">
             <div class="flex justify-between items-start mb-10">
                <div>
                   <h3 class="text-3xl font-black text-gray-900 tracking-tight">{{ form.id ? 'Perbarui Menu' : 'Tambah Menu Baru' }}</h3>
                   <p class="text-xs font-bold text-primary uppercase tracking-widest mt-1">Lengkapi informasi detail produk</p>
                </div>
                <button @click="isModalOpen = false" class="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                   <i class="fa-solid fa-xmark"></i>
                </button>
             </div>

             <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Foto Upload -->
                <div class="col-span-2 md:col-span-1 space-y-4">
                   <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Foto Produk</label>
                   <div class="relative group h-64 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 overflow-hidden flex flex-col items-center justify-center transition-all hover:border-primary/50 hover:bg-primary/5 cursor-pointer">
                      <img v-if="imagePreview || form.image" :src="imagePreview || getImageUrl(form.image)" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div class="relative z-10 flex flex-col items-center gap-3 p-4 text-center transition-opacity" :class="{'opacity-0 group-hover:opacity-100': imagePreview || form.image}">
                         <div class="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center text-primary mb-2">
                            <i class="fa-solid fa-camera text-2xl"></i>
                         </div>
                         <div>
                            <p class="text-xs font-black text-gray-900">{{ imagePreview || form.image ? 'Ganti Foto' : 'Pilih Foto Utama' }}</p>
                            <p class="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">Format: JPG, PNG, WEBP</p>
                         </div>
                      </div>
                      <input type="file" @change="handleFileChange" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer z-20" />
                   </div>
                </div>

                <!-- Input Fields -->
                <div class="col-span-2 md:col-span-1 space-y-6">
                   <div class="space-y-2">
                      <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Nama Lengkap Menu</label>
                      <input v-model="form.name" required class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all shadow-inner" placeholder="Cth: Nasi Padang Rendang" />
                   </div>
                   
                   <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-2">
                         <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Harga (Rp)</label>
                         <input v-model="form.price" type="number" required class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all shadow-inner" placeholder="0" />
                      </div>
                      <div class="space-y-2">
                         <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Pilih Kategori</label>
                         <div class="relative">
                            <select v-model="form.categoryId" required class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 px-6 pr-10 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all shadow-inner appearance-none">
                               <option value="" disabled>Kategori...</option>
                               <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                            </select>
                            <i class="fa-solid fa-chevron-down text-[10px] text-gray-400 absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none"></i>
                         </div>
                      </div>
                   </div>

                   <div class="flex gap-6 pt-4 px-2">
                      <div class="flex items-center gap-3">
                         <input type="checkbox" v-model="form.isAvailable" id="isAvailable" class="w-5 h-5 accent-primary rounded" />
                         <label for="isAvailable" class="text-xs font-bold text-gray-600">Menu Tersedia Hari Ini</label>
                      </div>
                      <div class="flex items-center gap-3">
                         <input type="checkbox" v-model="form.isPopular" id="isPopular" class="w-5 h-5 accent-primary rounded" />
                         <label for="isPopular" class="text-xs font-bold text-gray-600">Rekomendasi Populer</label>
                      </div>
                   </div>
                </div>

                <div class="col-span-2 space-y-2">
                   <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Deskripsi Singkat</label>
                   <textarea v-model="form.description" rows="3" class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all shadow-inner resize-none"></textarea>
                </div>

                <div class="col-span-2 pt-6 border-t border-gray-50">
                   <button 
                      type="submit" 
                      :disabled="isSubmitting"
                      class="w-full bg-gray-900 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-primary transition-all flex justify-center items-center gap-3 disabled:bg-gray-400 active:scale-95 uppercase tracking-widest"
                   >
                      <i class="fa-solid fa-cloud-arrow-up"></i>
                      <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan Data' }}</span>
                   </button>
                </div>
             </form>
          </div>
       </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="isDeleteModalOpen" class="fixed inset-0 z-[130] flex items-center justify-center p-6">
       <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm shadow-2xl" @click="isDeleteModalOpen = false"></div>
       <div class="bg-white w-full max-w-md rounded-[32px] shadow-2xl relative z-10 overflow-hidden animate-scale-in p-8 text-center">
          <div class="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
             <i class="fa-solid fa-triangle-exclamation text-2xl"></i>
          </div>
          <h3 class="text-2xl font-black text-gray-900 tracking-tight mb-2">{{ isBulkDelete ? `Hapus ${selectedIds.length} Menu?` : 'Hapus Menu?' }}</h3>
          <p class="text-sm font-medium text-gray-500 mb-8 leading-relaxed">
             <span v-if="isBulkDelete">Anda akan menghapus <strong>{{ selectedIds.length }} menu</strong> sekaligus. Data yang dihapus tidak dapat dikembalikan.</span>
             <span v-else>Apakah Anda yakin ingin menghapus <strong>{{ menuToDelete?.name }}</strong>? Data yang dihapus tidak dapat dikembalikan.</span>
          </p>
          <div class="flex gap-4">
             <button @click="isDeleteModalOpen = false" class="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all text-xs uppercase tracking-widest">
                Batal
             </button>
             <button @click="executeDelete" class="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl transition-all text-xs uppercase tracking-widest shadow-lg shadow-red-500/30">
                Ya, Hapus
             </button>
          </div>
       </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted, computed, inject } from 'vue';
import api, { getImageUrl } from '../../services/api';
import * as XLSX from 'xlsx';

const menus = ref([]);
const categories = ref([]);
const selectedCategory = ref(null);
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const isDeleteModalOpen = ref(false);
const menuToDelete = ref(null);
const selectedIds = ref([]);
const isBulkDelete = ref(false);

const staffToast = inject('staffToast');

const imagePreview = ref(null);
const selectedFile = ref(null);

/* Excel Import Refs & Handlers */
const isImportModalOpen = ref(false);
const uploadedExcelFile = ref(null);
const isImporting = ref(false);

const openImportModal = () => {
   uploadedExcelFile.value = null;
   isImportModalOpen.value = true;
};

const downloadTemplate = () => {
   // Ambil ID kategori pertama yang tersedia sebagai default, atau 1 jika kosong
   const defaultCategoryId = categories.value.length > 0 ? categories.value[0].id : 1;
   
   // Sheet 1: Template Data Menu
   const worksheet = XLSX.utils.json_to_sheet([
      { name: 'Contoh Menu', description: 'Nasi goreng mantap', price: 25000, categoryId: Number(defaultCategoryId), isAvailable: true, isPopular: true },
      { name: 'Es Teh Manis', description: 'Teh manis dingin', price: 5000, categoryId: Number(defaultCategoryId), isAvailable: true, isPopular: false }
   ]);

   // Sheet 2: Referensi Kategori
   const categoryRefData = categories.value.map(cat => ({
      'Gunakan Text ID Ini di Kolom categoryId': Number(cat.id),
      'Untuk Kategori': cat.name
   }));
   if (categoryRefData.length === 0) {
      categoryRefData.push({ 'Gunakan Text ID Ini di Kolom categoryId': 1, 'Untuk Kategori': 'Belum ada kategori sistem' });
   }
   const worksheetRefs = XLSX.utils.json_to_sheet(categoryRefData);

   // Buat Workbook dan gabungkan kedua sheet
   const workbook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, worksheet, 'Data_Menu');
   XLSX.utils.book_append_sheet(workbook, worksheetRefs, 'Referensi_Kategori');
   
   XLSX.writeFile(workbook, 'Template_Import_Menu.xlsx');
};

const handleExcelUpload = (e) => {
   const file = e.target.files[0];
   if (file) {
     if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
       uploadedExcelFile.value = file;
     } else {
       staffToast.value?.display('Harap unggah file berformat .xlsx atau .xls', 'warning');
     }
   }
};

const processImport = async () => {
   if (!uploadedExcelFile.value) return;
   isImporting.value = true;

   try {
      const reader = new FileReader();
      reader.onload = async (e) => {
         const data = new Uint8Array(e.target.result);
         const workbook = XLSX.read(data, { type: 'array' });
         const sheetName = workbook.SheetNames[0];
         const worksheet = workbook.Sheets[sheetName];
         const jsonData = XLSX.utils.sheet_to_json(worksheet);

         if (jsonData.length === 0) {
            staffToast.value?.display('File Excel kosong.', 'error');
            isImporting.value = false;
            return;
         }

         try {
            const res = await api.post('/menus/bulk-import', { data: jsonData });
            staffToast.value?.display(`${res.data.count} menu berhasil diimpor`, 'success', 'Import Sukses');
            isImportModalOpen.value = false;
            fetchMenus();
         } catch (err) {
            console.error(err);
            staffToast.value?.display('Gagal memproses data import ke server.', 'error');
         } finally {
            isImporting.value = false;
         }
      };
      reader.readAsArrayBuffer(uploadedExcelFile.value);
   } catch (err) {
      staffToast.value?.display('Gagal membaca file Excel.', 'error');
      isImporting.value = false;
   }
};
/* End Excel */

const handleFileChange = (e) => {
   const file = e.target.files[0];
   if (file) {
      selectedFile.value = file;
      imagePreview.value = URL.createObjectURL(file);
   }
};

const form = ref({
   id: null,
   name: '',
   categoryId: '',
   price: 0,
   description: '',
   image: '',
   isAvailable: true,
   isPopular: false
});

const filteredMenus = computed(() => {
   if (!selectedCategory.value) return menus.value;
   return menus.value.filter(m => m.categoryId === selectedCategory.value);
});

const allSelected = computed(() => {
  if (filteredMenus.value.length === 0) return false;
  return filteredMenus.value.every(m => selectedIds.value.includes(m.id));
});

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedIds.value = [];
  } else {
    selectedIds.value = filteredMenus.value.map(m => m.id);
  }
};

const fetchMenus = async () => {
   try {
      const res = await api.get('/menus');
      menus.value = res.data;
   } catch (err) {
      console.error(err);
   }
};

const fetchCategories = async () => {
   try {
      const res = await api.get('/categories');
      categories.value = res.data;
   } catch (err) {
      console.error(err);
   }
};

const openModal = (menu = null) => {
   imagePreview.value = null;
   selectedFile.value = null;
   if (menu) {
      form.value = { ...menu };
   } else {
      form.value = {
         id: null,
         name: '',
         categoryId: selectedCategory.value || '',
         price: 0,
         description: '',
         image: '',
         isAvailable: true,
         isPopular: false
      };
   }
   isModalOpen.value = true;
};

const handleSubmit = async () => {
   isSubmitting.value = true;
   try {
      const formData = new FormData();
      Object.keys(form.value).forEach(key => {
         if (key === 'image' && selectedFile.value) {
            formData.append('image', selectedFile.value);
         } else if (form.value[key] !== null) {
            formData.append(key, form.value[key]);
         }
      });

      if (form.value.id) {
         await api.put(`/menus/${form.value.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
         });
         staffToast.value?.display('Informasi menu berhasil diperbarui.', 'success', 'Update Berhasil');
      } else {
         await api.post('/menus', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
         });
         staffToast.value?.display('Menu baru berhasil ditambahkan.', 'success', 'Publikasi Sukses');
      }
      isModalOpen.value = false;
      fetchMenus();
   } catch (err) {
      console.error(err);
      staffToast.value?.display('Gagal menyimpan data menu.', 'error');
   } finally {
      isSubmitting.value = false;
   }
};

const confirmDelete = (menu) => {
   isBulkDelete.value = false;
   menuToDelete.value = menu;
   isDeleteModalOpen.value = true;
};

const confirmBulkDelete = () => {
   isBulkDelete.value = true;
   isDeleteModalOpen.value = true;
};

const executeDelete = async () => {
   isDeleteModalOpen.value = false;
   try {
      if (isBulkDelete.value) {
         await api.post('/menus/bulk-delete', { ids: selectedIds.value.map(String) });
         staffToast.value?.display(`${selectedIds.value.length} menu berhasil dihapus.`, 'info', 'Operasi Selesai');
         selectedIds.value = [];
      } else {
         if (!menuToDelete.value) return;
         await api.delete(`/menus/${menuToDelete.value.id}`);
         staffToast.value?.display('Menu telah dihapus secara permanen.', 'info', 'Penghapusan Sukses');
      }
      fetchMenus();
   } catch (err) {
      console.error('Delete failed', err);
      staffToast.value?.display('Gagal melakukan penghapusan.', 'error');
   } finally {
      menuToDelete.value = null;
   }
};

const formatPrice = (price) => {
   return new Intl.NumberFormat('id-ID').format(price);
};

onMounted(() => {
   fetchMenus();
   fetchCategories();
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.animate-scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateX(-50%) translateY(30px); }
</style>
