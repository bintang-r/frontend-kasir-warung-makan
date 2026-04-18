<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex justify-between items-center bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
       <div>
          <h2 class="text-2xl font-black text-gray-900 tracking-tight">Moderasi Ulasan</h2>
          <p class="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest">Tinjau dan kelola feedback dari pelanggan</p>
       </div>
       <div class="flex items-center gap-4">
          <div class="bg-amber-50 px-6 py-3 rounded-2xl border border-amber-100">
             <p class="text-[10px] font-black text-amber-600 uppercase tracking-widest">Rating Rata-rata</p>
             <div class="flex items-center gap-2">
                <p class="text-xl font-black text-gray-900">{{ averageRating.toFixed(1) }}</p>
                <div class="flex text-amber-400 text-xs">
                   <i v-for="i in 5" :key="i" class="fa-solid fa-star" :class="i <= Math.round(averageRating) ? '' : 'text-gray-200'"></i>
                </div>
             </div>
          </div>
       </div>
    </div>

    <!-- Reviews Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
       <div v-for="review in reviews" :key="review.id" class="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col group" :class="selectedIds.includes(review.id) ? 'ring-2 ring-primary' : ''">
          <div class="p-8 flex-1">
             <div class="flex justify-between items-start mb-6">
                <div class="flex items-center gap-4">
                   <div class="relative">
                      <input type="checkbox" class="w-4 h-4 accent-primary rounded absolute -top-1 -left-1 z-10" :value="review.id" v-model="selectedIds" />
                      <div class="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 font-black text-lg ml-4">
                         {{ review.user?.name?.charAt(0) || 'G' }}
                      </div>
                   </div>
                   <div>
                      <h4 class="font-black text-gray-900 tracking-tight">{{ review.user?.name || 'Guest Customer' }}</h4>
                      <p class="text-[10px] font-bold text-gray-400">{{ formatDate(review.createdAt) }}</p>
                   </div>
                </div>
                <div class="flex text-amber-400 text-[10px] gap-0.5">
                   <i v-for="i in 5" :key="i" class="fa-solid fa-star" :class="i <= review.rating ? '' : 'text-gray-100'"></i>
                </div>
             </div>

             <div class="bg-gray-50/50 rounded-3xl p-6 relative">
                <i class="fa-solid fa-quote-left absolute -top-2 -left-2 text-primary/20 text-3xl"></i>
                <p class="text-xs font-bold text-gray-600 leading-relaxed italic relative z-10">"{{ review.comment }}"</p>
             </div>

             <div v-if="review.order?.items" class="mt-6 flex flex-wrap gap-2">
                <span v-for="item in review.order.items" :key="item.id" class="px-3 py-1 bg-white border border-gray-100 rounded-lg text-[9px] font-black text-gray-400 uppercase tracking-widest">
                   {{ item.menu?.name }}
                </span>
             </div>
          </div>

          <div class="px-8 py-5 border-t border-gray-50 bg-gray-50/20 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
             <router-link :to="{ name: 'AdminOrderManagement', query: { q: review.orderId } }" class="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">
                Lihat Detail Pesanan #{{ review.orderId }}
             </router-link>
              <button @click="confirmDelete(review)" class="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest flex items-center gap-2">
                 <i class="fa-solid fa-trash-can"></i> Hapus
              </button>
           </div>
        </div>
     </div>

     <!-- Bulk Action Bar -->
     <transition name="slide-up">
       <div v-if="selectedIds.length > 0" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 rounded-[28px] px-8 py-5 flex items-center gap-6 shadow-2xl shadow-gray-900/40 border border-white/10">
         <div class="flex items-center gap-3">
           <div class="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center text-white font-black text-sm">{{ selectedIds.length }}</div>
           <span class="text-white font-bold text-sm">ulasan dipilih</span>
         </div>
         <div class="w-px h-8 bg-white/10"></div>
         <button @click="confirmBulkDelete" class="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95">
           <i class="fa-solid fa-trash-can"></i> Hapus Terpilih
         </button>
         <button @click="selectedIds = []" class="text-gray-400 hover:text-white transition-colors p-2"><i class="fa-solid fa-xmark"></i></button>
       </div>
     </transition>

     <!-- Delete Confirmation Modal -->
     <div v-if="isDeleteModalOpen" class="fixed inset-0 z-[130] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm shadow-2xl" @click="isDeleteModalOpen = false"></div>
        <div class="bg-white w-full max-w-md rounded-[32px] shadow-2xl relative z-10 overflow-hidden animate-scale-in p-8 text-center">
           <div class="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fa-solid fa-comment-slash text-2xl"></i>
           </div>
           <h3 class="text-2xl font-black text-gray-900 tracking-tight mb-2">{{ isBulkDelete ? `Hapus ${selectedIds.length} Ulasan?` : 'Hapus Ulasan?' }}</h3>
           <p class="text-sm font-medium text-gray-500 mb-8 leading-relaxed">
              <span v-if="isBulkDelete">Anda akan menghapus <strong>{{ selectedIds.length }} ulasan</strong> sekaligus secara permanen.</span>
              <span v-else>Apakah Anda yakin ingin menghapus ulasan dari <strong>{{ reviewToDelete?.user?.name || 'Guest' }}</strong>?
                 <span class="block mt-2 text-red-400 font-black uppercase text-[10px]">Tindakan ini permanen dan tidak dapat dibatalkan.</span>
              </span>
           </p>
           <div class="flex gap-4">
              <button @click="isDeleteModalOpen = false" class="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all text-xs uppercase tracking-widest">Batal</button>
              <button @click="executeDelete" class="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl transition-all text-xs uppercase tracking-widest shadow-lg shadow-red-500/30">Ya, Hapus</button>
           </div>
        </div>
     </div>

    <div v-if="reviews.length === 0" class="bg-white rounded-[40px] border-2 border-dashed border-gray-100 p-20 text-center">
       <i class="fa-solid fa-comments text-6xl text-gray-100 mb-6"></i>
       <p class="font-black text-gray-400 uppercase tracking-[0.2em]">Belum ada ulasan masuk</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, inject } from 'vue';
import api from '../../services/api';

const reviews = ref([]);
const staffToast = inject('staffToast');
const isDeleteModalOpen = ref(false);
const reviewToDelete = ref(null);
const selectedIds = ref([]);
const isBulkDelete = ref(false);

const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  const total = reviews.value.reduce((acc, r) => acc + r.rating, 0);
  return total / reviews.value.length;
});

const fetchData = async () => {
  try {
    const response = await api.get('/reviews');
    reviews.value = response.data;
  } catch (err) { console.error('Fetch reviews failed', err); }
};

const confirmDelete = (review) => {
  isBulkDelete.value = false;
  reviewToDelete.value = review;
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
      await api.post('/reviews/bulk-delete', { ids: selectedIds.value.map(String) });
      staffToast.value?.display(`${selectedIds.value.length} ulasan berhasil dihapus.`, 'info', 'Bulk Delete');
      selectedIds.value = [];
    } else {
      if (!reviewToDelete.value) return;
      await api.delete(`/reviews/${reviewToDelete.value.id}`);
      staffToast.value?.display('Ulasan pelanggan telah dihapus secara permanen.', 'info', 'Moderasi Selesai');
    }
    fetchData();
  } catch (err) {
    console.error('Delete review failed', err);
    staffToast.value?.display('Gagal menghapus ulasan.', 'error');
  } finally { reviewToDelete.value = null; }
};

const formatDate = (d) => {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));
};

onMounted(fetchData);
</script>

<style scoped>
.animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateX(-50%) translateY(30px); }
</style>
