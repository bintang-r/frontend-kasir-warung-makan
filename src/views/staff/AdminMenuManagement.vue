<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
       <div>
          <h2 class="text-2xl font-black text-gray-900 tracking-tight">Katalog Menu</h2>
          <p class="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest">Master data makanan dan minuman</p>
       </div>
       <button @click="openModal()" class="bg-primary text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
          <i class="fa-solid fa-plus mr-2"></i> Tambah Menu Baru
       </button>
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
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Foto</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Menu</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Kategori</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Harga</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                   <th class="pb-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Aksi</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-gray-50">
                <tr v-for="menu in filteredMenus" :key="menu.id" class="group hover:bg-gray-50/50 transition-colors">
                   <td class="py-6">
                      <img :src="getImageUrl(menu.image)" class="w-14 h-14 rounded-2xl object-cover shadow-sm grayscale group-hover:grayscale-0 transition-all border border-gray-100" />
                   </td>
                   <td class="py-6">
                      <p class="font-black text-gray-900 text-sm tracking-tight">{{ menu.name }}</p>
                      <p class="text-[10px] font-bold text-gray-400 line-clamp-1 max-w-[200px]">{{ menu.description || 'Tidak ada deskripsi' }}</p>
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
                      <button @click="openModal(menu)" class="p-2.5 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                         <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button @click="confirmDelete(menu)" class="p-2.5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                         <i class="fa-solid fa-trash-can"></i>
                      </button>
                   </td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>

    <!-- Menu Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-[120] flex items-center justify-center p-6">
       <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm shadow-2xl" @click="isModalOpen = false"></div>
       <div class="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-scale-in">
          <div class="p-12">
             <div class="flex justify-between items-start mb-10">
                <div>
                   <h3 class="text-3xl font-black text-gray-900 tracking-tight">{{ form.id ? 'Edit Menu' : 'Tambah Menu Baru' }}</h3>
                   <p class="text-xs font-bold text-primary uppercase tracking-widest mt-1">Lengkapi informasi katalog menu</p>
                </div>
                <button @click="isModalOpen = false" class="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                   <i class="fa-solid fa-xmark"></i>
                </button>
             </div>

             <form @submit.prevent="handleSubmit" class="grid grid-cols-2 gap-8">
                <div class="space-y-6">
                   <div class="space-y-2">
                      <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Nama Produk</label>
                      <input v-model="form.name" required class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all" />
                   </div>
                   <div class="space-y-2">
                      <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Kategori</label>
                      <select v-model="form.categoryId" required class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all appearance-none">
                         <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                      </select>
                   </div>
                   <div class="space-y-2">
                      <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Harga (Rp)</label>
                      <input type="number" v-model="form.price" required class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all" />
                   </div>
                </div>
                
                <div class="space-y-6">
                    <div class="space-y-4">
                       <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Foto Produk</label>
                       
                       <div class="relative group h-48 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 overflow-hidden flex flex-col items-center justify-center transition-all hover:border-primary/50">
                          <img v-if="imagePreview || form.image" :src="imagePreview || getImageUrl(form.image)" class="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
                          <div class="relative z-10 flex flex-col items-center gap-2 p-4 text-center" :class="{'opacity-0 group-hover:opacity-100 transition-opacity': imagePreview || form.image}">
                             <div class="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-primary mb-2">
                                <i class="fa-solid fa-camera-retro text-xl"></i>
                             </div>
                             <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">{{ (imagePreview || form.image) ? 'Ganti Foto' : 'Pilih Foto' }}</p>
                          </div>
                          <input type="file" @change="handleFileChange" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer z-20" />
                       </div>
                    </div>
                   <div class="space-y-2">
                      <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Atur Status</label>
                      <div class="flex gap-4">
                         <button type="button" @click="form.isAvailable = true" :class="form.isAvailable ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'" class="flex-1 py-3 rounded-xl font-bold text-[10px] uppercase transition-all tracking-widest">Tersedia</button>
                         <button type="button" @click="form.isAvailable = false" :class="!form.isAvailable ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400'" class="flex-1 py-3 rounded-xl font-bold text-[10px] uppercase transition-all tracking-widest">Habis</button>
                      </div>
                   </div>
                   <div class="flex items-center gap-4 pt-2">
                      <input type="checkbox" v-model="form.isPopular" id="isPopular" class="w-5 h-5 accent-primary" />
                      <label for="isPopular" class="text-xs font-bold text-gray-600">Jadikan Rekomendasi Populer</label>
                   </div>
                </div>

                <div class="col-span-2 space-y-2">
                   <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Deskripsi Singkat</label>
                   <textarea v-model="form.description" rows="3" class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all resize-none"></textarea>
                </div>

                <div class="col-span-2 pt-6">
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
          <div class="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
             <i class="fa-solid fa-triangle-exclamation text-3xl"></i>
          </div>
          <h3 class="text-2xl font-black text-gray-900 tracking-tight mb-2">Hapus Menu?</h3>
          <p class="text-sm font-medium text-gray-500 mb-8 leading-relaxed">
             Apakah Anda yakin ingin menghapus data <strong>{{ menuToDelete?.name }}</strong>? Data yang dihapus tidak dapat dikembalikan, dan seluruh riwayat pesanan yang terkait dengan menu ini ikut terhapus otomatis.
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

const menus = ref([]);
const categories = ref([]);
const selectedCategory = ref(null);
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const isDeleteModalOpen = ref(false);
const menuToDelete = ref(null);

const staffToast = inject('staffToast');

const imagePreview = ref(null);
const selectedFile = ref(null);

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

const fetchData = async () => {
   try {
      const [mRes, cRes] = await Promise.all([
         api.get('/menus'),
         api.get('/categories')
      ]);
      menus.value = mRes.data;
      categories.value = cRes.data;
   } catch (err) {
      console.error('Fetch data failed', err);
   }
};

const openModal = (menu = null) => {
   imagePreview.value = null;
   selectedFile.value = null;
   if (menu) {
      form.value = { ...menu, categoryId: menu.categoryId.toString() };
   } else {
      form.value = { id: null, name: '', categoryId: categories.value[0]?.id.toString() || '', price: 0, description: '', image: '', isAvailable: true, isPopular: false };
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
         } else if (form.value[key] !== null && form.value[key] !== undefined) {
            formData.append(key, form.value[key]);
         }
      });

      if (form.value.id) {
         await api.put(`/menus/${form.value.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
         });
         staffToast.value?.display('Katalog menu berhasil diperbarui', 'success', 'Update Berhasil');
      } else {
         await api.post('/menus', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
         });
         staffToast.value?.display('Menu baru telah ditambahkan ke katalog', 'success', 'Menu Baru');
      }
      isModalOpen.value = false;
      fetchData();
   } catch (err) {
      console.error('Submit failed', err);
      staffToast.value?.display('Terjadi kesalahan saat menyimpan data menu.', 'error');
   } finally {
      isSubmitting.value = false;
   }
};

const confirmDelete = (menu) => {
   menuToDelete.value = menu;
   isDeleteModalOpen.value = true;
};

const executeDelete = async () => {
   if (!menuToDelete.value) return;
   
   const id = menuToDelete.value.id;
   isDeleteModalOpen.value = false;
   
   try {
      await api.delete(`/menus/${id}`);
      staffToast.value?.display('Item menu telah dihapus secara permanen beserta data terkait.', 'info', 'Hapus Data');
      fetchData();
   } catch (err) {
      console.error('Delete failed', err);
      staffToast.value?.display('Gagal menghapus entitas menu.', 'error');
   } finally {
      menuToDelete.value = null;
   }
};

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price);

onMounted(fetchData);
</script>

<style scoped>
.animate-scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
