<template>
  <div class="space-y-10">
    <div class="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
       <div>
          <h2 class="text-2xl font-black text-gray-900 tracking-tight">Pusat Pemasaran</h2>
          <p class="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest">Kelola kampanye promo dan voucher diskon</p>
       </div>
       <div class="flex p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
          <button @click="activeTab = 'promos'" :class="activeTab === 'promos' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'" class="px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">Banner Promo</button>
          <button @click="activeTab = 'vouchers'" :class="activeTab === 'vouchers' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'" class="px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">Kupon Voucher</button>
       </div>
       <button @click="openModal()" class="bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-primary transition-all active:scale-95">
          <i class="fa-solid fa-plus mr-2"></i> {{ activeTab === 'promos' ? 'Tambah Banner' : 'Buat Voucher' }}
       </button>
    </div>

    <!-- Promo Banners List -->
    <div v-if="activeTab === 'promos'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
       <div v-for="promo in promos" :key="promo.id" class="group bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-2xl transition-all border-b-4 border-b-transparent hover:border-b-primary" :class="selectedPromoIds.includes(promo.id) ? 'ring-2 ring-primary' : ''">
          <div class="h-48 overflow-hidden relative">
             <img :src="getImageUrl(promo.image)" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
             <div class="absolute top-4 left-4"><input type="checkbox" class="w-5 h-5 accent-primary rounded shadow-lg" :value="promo.id" v-model="selectedPromoIds" /></div>
             <div class="absolute top-4 right-4">
                <span :class="promo.isActive ? 'bg-green-500' : 'bg-red-500'" class="px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest shadow-lg">{{ promo.isActive ? 'Aktif' : 'Non-Aktif' }}</span>
             </div>
          </div>
          <div class="p-8 flex-1 flex flex-col">
             <h4 class="text-lg font-black text-gray-900 leading-tight mb-2">{{ promo.title }}</h4>
             <p class="text-xs font-medium text-gray-400 line-clamp-2 mb-6">{{ promo.description }}</p>
             <div class="mt-auto flex gap-3">
                <button @click="openModal(promo)" class="flex-1 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 py-3 rounded-xl transition-all"><i class="fa-solid fa-edit"></i></button>
                <button @click="confirmDelete('promo', promo)" class="flex-1 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 py-3 rounded-xl transition-all"><i class="fa-solid fa-trash"></i></button>
             </div>
          </div>
       </div>
    </div>

    <!-- Vouchers List -->
    <div v-else class="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden p-10">
       <div class="overflow-x-auto">
          <table class="w-full text-left">
             <thead>
                <tr class="border-b border-gray-50">
                   <th class="pb-6 w-10"><input type="checkbox" class="w-4 h-4 accent-primary rounded" :checked="allVouchersSelected" @change="toggleSelectAllVouchers" /></th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Kode Kupon</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nilai Diskon</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Tgl Kadaluarsa</th>
                   <th class="pb-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Aksi</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-gray-50">
                <tr v-for="v in vouchers" :key="v.id" class="group hover:bg-gray-50/50 transition-colors" :class="selectedVoucherIds.includes(v.id) ? 'bg-primary/5' : ''">
                   <td class="py-6"><input type="checkbox" class="w-4 h-4 accent-primary rounded" :value="v.id" v-model="selectedVoucherIds" /></td>
                   <td class="py-6">
                      <div class="bg-gray-100 px-4 py-2 rounded-xl border border-dashed border-gray-300 inline-block font-black text-gray-900 text-sm tracking-widest uppercase">{{ v.code }}</div>
                   </td>
                   <td class="py-6 font-black text-primary text-sm">Rp {{ formatPrice(v.discount) }}</td>
                   <td class="py-6 text-center text-xs font-bold" :class="isExpired(v.expiredAt) ? 'text-red-500' : 'text-gray-500'">
                      {{ formatDate(v.expiredAt) }}
                      <span v-if="isExpired(v.expiredAt)" class="ml-1 text-[8px] font-black uppercase tracking-tighter">Expired</span>
                   </td>
                   <td class="py-6 text-right space-x-2">
                      <button @click="openModal(v)" class="p-2.5 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><i class="fa-solid fa-pen-to-square"></i></button>
                      <button @click="confirmDelete('voucher', v)" class="p-2.5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><i class="fa-solid fa-trash-can"></i></button>
                   </td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>

    <!-- Bulk Action Bar -->
    <transition name="slide-up">
      <div v-if="currentSelectedIds.length > 0" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 rounded-[28px] px-8 py-5 flex items-center gap-6 shadow-2xl shadow-gray-900/40 border border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white font-black text-sm">{{ currentSelectedIds.length }}</div>
          <span class="text-white font-bold text-sm">{{ activeTab === 'promos' ? 'promo' : 'voucher' }} dipilih</span>
        </div>
        <div class="w-px h-8 bg-white/10"></div>
        <button @click="confirmBulkDelete" class="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95">
          <i class="fa-solid fa-trash-can"></i> Hapus Terpilih
        </button>
        <button @click="clearSelection" class="text-gray-400 hover:text-white transition-colors p-2"><i class="fa-solid fa-xmark"></i></button>
      </div>
    </transition>

    <!-- Universal Marketing Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-[120] flex items-center justify-center p-6">
       <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="isModalOpen = false"></div>
       <div class="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-scale-in">
          <div class="p-12">
             <div class="flex justify-between items-start mb-8">
                <h3 class="text-2xl font-black text-gray-900 tracking-tight">{{ form.id ? 'Perbarui Data' : 'Data Marketing Baru' }}</h3>
                <button @click="isModalOpen = false" class="text-gray-400 hover:text-red-500 transition-colors"><i class="fa-solid fa-xmark text-xl"></i></button>
             </div>
             <form @submit.prevent="handleSubmit" class="space-y-6">
                <div v-if="activeTab === 'promos'" class="space-y-6">
                   <div class="space-y-2">
                      <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Judul Kampanye</label>
                      <input v-model="form.title" required class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-primary transition-all shadow-inner" />
                   </div>
                   <div class="space-y-4">
                      <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Banner Campaign</label>
                      <div class="relative group h-48 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 overflow-hidden flex flex-col items-center justify-center transition-all hover:border-primary/50 shadow-inner">
                         <img v-if="imagePreview || form.image" :src="imagePreview || getImageUrl(form.image)" class="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
                         <div class="relative z-10 flex flex-col items-center gap-2 p-4 text-center" :class="{'opacity-0 group-hover:opacity-100 transition-opacity': imagePreview || form.image}">
                            <div class="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-primary mb-2"><i class="fa-solid fa-image text-xl"></i></div>
                            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">{{ (imagePreview || form.image) ? 'Ganti Banner' : 'Pilih Banner' }}</p>
                         </div>
                         <input type="file" @change="handleFileChange" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer z-20" />
                      </div>
                   </div>
                   <div class="space-y-2">
                      <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Deskripsi Promo</label>
                      <textarea v-model="form.description" rows="3" class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-primary transition-all shadow-inner resize-none"></textarea>
                   </div>
                   <div class="flex items-center gap-4">
                      <input type="checkbox" v-model="form.isActive" id="isActive" class="w-5 h-5 accent-primary" />
                      <label for="isActive" class="text-xs font-bold text-gray-600">Terbitkan Kampanye Sekarang</label>
                   </div>
                </div>
                <div v-else class="space-y-6">
                   <div class="space-y-2">
                      <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kode Voucher</label>
                      <input v-model="form.code" required placeholder="E.g. DISKON10" class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-primary transition-all shadow-inner uppercase" />
                   </div>
                   <div class="space-y-2">
                      <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nilai Diskon (Rp)</label>
                      <input type="number" v-model="form.discount" required class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-primary transition-all shadow-inner" />
                   </div>
                   <div class="space-y-2">
                      <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tanggal Kadaluarsa</label>
                      <input type="date" v-model="form.expiredAt" required class="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-primary transition-all shadow-inner" />
                   </div>
                </div>
                <div class="pt-6 border-t border-gray-50">
                   <button type="submit" :disabled="isSubmitting" class="w-full bg-gray-900 text-white py-5 rounded-2xl font-black hover:bg-primary transition-all flex justify-center items-center gap-3 disabled:bg-gray-400 uppercase tracking-widest">
                      <div v-if="isSubmitting" class="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan Data Marketing' }}</span>
                   </button>
                </div>
             </form>
          </div>
       </div>
    </div>

     <!-- Delete Confirmation Modal -->
     <div v-if="deleteModalOpen" class="fixed inset-0 z-[140] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm shadow-2xl" @click="deleteModalOpen = false"></div>
        <div class="bg-white w-full max-w-md rounded-[32px] shadow-2xl relative z-10 overflow-hidden animate-scale-in p-8 text-center">
           <div class="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fa-solid fa-bullhorn text-2xl" v-if="deleteType === 'promo'"></i>
              <i class="fa-solid fa-ticket text-2xl" v-else></i>
           </div>
           <h3 class="text-2xl font-black text-gray-900 tracking-tight mb-2">{{ isBulkDelete ? `Hapus ${currentSelectedIds.length} Item?` : `Hapus ${deleteType === 'promo' ? 'Banner Promo' : 'Voucher'}?` }}</h3>
           <p class="text-sm font-medium text-gray-500 mb-8 leading-relaxed">
              <span v-if="isBulkDelete">Anda akan menghapus <strong>{{ currentSelectedIds.length }} {{ activeTab === 'promos' ? 'promo' : 'voucher' }}</strong> sekaligus secara permanen.</span>
              <span v-else>Apakah Anda yakin ingin menghapus <strong>{{ itemToDelete?.title || itemToDelete?.code }}</strong>?
                 <span class="block mt-2 font-black uppercase text-[10px] text-red-400">Tindakan ini permanen dan tidak dapat dibatalkan.</span>
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
import { ref, onMounted, computed, watch, inject } from 'vue';
import api, { getImageUrl } from '../../services/api';

const activeTab = ref('promos');
const promos = ref([]);
const vouchers = ref([]);
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const deleteModalOpen = ref(false);
const deleteType = ref('');
const itemToDelete = ref(null);
const selectedPromoIds = ref([]);
const selectedVoucherIds = ref([]);
const isBulkDelete = ref(false);

const staffToast = inject('staffToast');

const imagePreview = ref(null);
const selectedFile = ref(null);

const handleFileChange = (e) => {
   const file = e.target.files[0];
   if (file) { selectedFile.value = file; imagePreview.value = URL.createObjectURL(file); }
};

const form = ref({});

const currentSelectedIds = computed(() => activeTab.value === 'promos' ? selectedPromoIds.value : selectedVoucherIds.value);

const allVouchersSelected = computed(() => {
  if (vouchers.value.length === 0) return false;
  return vouchers.value.every(v => selectedVoucherIds.value.includes(v.id));
});

const toggleSelectAllVouchers = () => {
  if (allVouchersSelected.value) { selectedVoucherIds.value = []; }
  else { selectedVoucherIds.value = vouchers.value.map(v => v.id); }
};

const clearSelection = () => {
  if (activeTab.value === 'promos') selectedPromoIds.value = [];
  else selectedVoucherIds.value = [];
};

const fetchData = async () => {
   try {
      if (activeTab.value === 'promos') {
         const res = await api.get('/promos/admin/all');
         promos.value = res.data;
      } else {
         const res = await api.get('/promos/vouchers/admin/all');
         vouchers.value = res.data;
      }
   } catch (err) { console.error(err); }
};

watch(activeTab, fetchData);

const openModal = (data = null) => {
   imagePreview.value = null;
   selectedFile.value = null;
   if (activeTab.value === 'promos') {
      form.value = data ? { ...data } : { id: null, title: '', image: '', description: '', isActive: true };
   } else {
      form.value = data ? { ...data, expiredAt: new Date(data.expiredAt).toISOString().split('T')[0] } : { id: null, code: '', discount: 0, expiredAt: new Date().toISOString().split('T')[0] };
   }
   isModalOpen.value = true;
};

const handleSubmit = async () => {
   isSubmitting.value = true;
   try {
      const endpoint = activeTab.value === 'promos' ? '/promos/admin' : '/promos/vouchers/admin';
      let payload;
      let headers = {};

      if (activeTab.value === 'promos') {
         const formData = new FormData();
         Object.keys(form.value).forEach(key => {
            if (key === 'image' && selectedFile.value) { formData.append('image', selectedFile.value); }
            else if (form.value[key] !== null && form.value[key] !== undefined) { formData.append(key, form.value[key]); }
         });
         payload = formData;
         headers = { 'Content-Type': 'multipart/form-data' };
      } else { payload = form.value; }

      if (form.value.id) {
         await api.put(`${endpoint}/${form.value.id}`, payload, { headers });
         staffToast.value?.display('Data pemasaran berhasil diperbarui', 'success', 'Update Promo');
      } else {
         await api.post(endpoint, payload, { headers });
         staffToast.value?.display('Berhasil menerbitkan kampanye marketing baru', 'success', 'Promo Baru');
      }
      isModalOpen.value = false;
      fetchData();
   } catch (err) {
      console.error(err);
      staffToast.value?.display('Gagal mengirim data pemasaran.', 'error');
   } finally { isSubmitting.value = false; }
};

const confirmDelete = (type, item) => {
   isBulkDelete.value = false;
   deleteType.value = type;
   itemToDelete.value = item;
   deleteModalOpen.value = true;
};

const confirmBulkDelete = () => {
   isBulkDelete.value = true;
   deleteType.value = activeTab.value === 'promos' ? 'promo' : 'voucher';
   deleteModalOpen.value = true;
};

const executeDelete = async () => {
   deleteModalOpen.value = false;
   try {
      if (isBulkDelete.value) {
         const ids = currentSelectedIds.value.map(String);
         if (activeTab.value === 'promos') {
            await api.post('/promos/admin/bulk-delete', { ids });
            selectedPromoIds.value = [];
         } else {
            await api.post('/promos/vouchers/admin/bulk-delete', { ids });
            selectedVoucherIds.value = [];
         }
         staffToast.value?.display(`${ids.length} item berhasil dihapus.`, 'info', 'Bulk Delete');
      } else {
         if (!itemToDelete.value) return;
         const id = itemToDelete.value.id;
         const type = deleteType.value;
         const endpoint = type === 'promo' ? '/promos/admin' : '/promos/vouchers/admin';
         await api.delete(`${endpoint}/${id}`);
         staffToast.value?.display(`Data ${type === 'promo' ? 'promo banner' : 'voucher'} telah dihapus.`, 'info', 'Operasi Selesai');
      }
      fetchData();
   } catch (err) {
      console.error('Delete failed', err);
      staffToast.value?.display('Gagal menghapus data pemasaran.', 'error');
   } finally { itemToDelete.value = null; }
};

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price);
const formatDate = (date) => new Intl.DateTimeFormat('id-ID').format(new Date(date));
const isExpired = (date) => new Date(date) < new Date();

onMounted(fetchData);
</script>

<style scoped>
.animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateX(-50%) translateY(30px); }
</style>
