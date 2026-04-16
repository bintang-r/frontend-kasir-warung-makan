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
                      <img :src="menu.image || 'https://via.placeholder.com/100'" class="w-14 h-14 rounded-2xl object-cover shadow-sm grayscale group-hover:grayscale-0 transition-all border border-gray-100" />
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
                      <button @click="handleDelete(menu.id)" class="p-2.5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
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
                   <div class="space-y-2">
                      <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">URL Foto Menu</label>
                      <input v-model="form.image" class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all" />
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
    
    <NotificationToast ref="toast" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../../services/api';
import NotificationToast from '../../components/NotificationToast.vue';

const menus = ref([]);
const categories = ref([]);
const selectedCategory = ref(null);
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const toast = ref(null);

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
      if (form.value.id) {
         await api.put(`/menus/${form.value.id}`, form.value);
         toast.value?.display('Data menu berhasil diperbarui');
      } else {
         await api.post('/menus', form.value);
         toast.value?.display('Menu baru berhasil ditambahkan');
      }
      isModalOpen.value = false;
      fetchData();
   } catch (err) {
      console.error('Submit failed', err);
      toast.value?.display('Gagal menyimpan data', 'error');
   } finally {
      isSubmitting.value = false;
   }
};

const handleDelete = async (id) => {
   if (!confirm('Apakah Anda yakin ingin menghapus menu ini?')) return;
   try {
      await api.delete(`/menus/${id}`);
      toast.value?.display('Menu berhasil dihapus');
      fetchData();
   } catch (err) {
      console.error('Delete failed', err);
      toast.value?.display('Hapus gagal', 'error');
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
