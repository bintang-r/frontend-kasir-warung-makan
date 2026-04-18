<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex justify-between items-center bg-white p-8 rounded-[32px] border border-gray-100 shadow-premium">
       <div>
          <h2 class="text-2xl font-black text-gray-900 tracking-tight">System Audit &amp; Logs</h2>
          <p class="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest">Pantau aktivitas sistem dan rekam jejak perubahan data</p>
       </div>
       <div class="flex gap-4">
          <div class="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100 flex items-center gap-3">
             <i class="fa-solid fa-clock-rotate-left text-primary"></i>
             <span class="text-sm font-black text-gray-900">{{ logs.length }} <span class="text-[10px] text-gray-400 uppercase ml-1">Entri Log</span></span>
          </div>
          <button @click="fetchLogs" :disabled="loading" class="p-3.5 bg-gray-900 text-white rounded-2xl hover:bg-primary transition-all active:scale-95 disabled:bg-gray-400 text-xs">
             <i class="fa-solid fa-arrows-rotate" :class="{ 'animate-spin': loading }"></i>
          </button>
       </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center">
       <div class="flex-1 min-w-[200px] relative">
          <i class="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          <input v-model="filters.search" placeholder="Cari aktivitas atau detail..." class="w-full bg-gray-50 border-2 border-gray-50 px-12 py-3.5 rounded-2xl text-xs font-bold focus:bg-white focus:border-primary outline-none transition-all placeholder:text-gray-400" @input="debouncedFetch" />
       </div>
       <div class="flex gap-3">
          <select v-model="filters.type" @change="fetchLogs" class="bg-gray-50 border-2 border-gray-50 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 outline-none focus:border-primary transition-all">
             <option value="">Semua Tipe</option>
             <option value="info">Information</option>
             <option value="success">Success</option>
             <option value="warning">Warning</option>
             <option value="danger">Danger</option>
          </select>
       </div>
    </div>

    <!-- Logs Table -->
    <div class="bg-white rounded-[40px] border border-gray-100 shadow-premium overflow-hidden">
       <div v-if="loading && logs.length === 0" class="p-20 flex flex-col items-center justify-center text-center">
          <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
          <p class="font-black text-gray-900 uppercase tracking-widest text-xs">Menarik Data Log...</p>
       </div>

       <div v-else-if="logs.length === 0" class="p-20 text-center">
          <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <i class="fa-solid fa-box-open text-gray-200 text-3xl"></i>
          </div>
          <h3 class="text-xl font-black text-gray-900 mb-2">Tidak Ada Data Log</h3>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Belum ada aktivitas yang terekam atau filter tidak cocok</p>
       </div>

       <div v-else class="overflow-x-auto">
          <table class="w-full text-left">
             <thead class="bg-gray-50/50">
                <tr>
                   <th class="px-8 py-6 w-10"><input type="checkbox" class="w-4 h-4 accent-primary rounded" :checked="allSelected" @change="toggleSelectAll" /></th>
                   <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Waktu</th>
                   <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Aktor</th>
                   <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Modul</th>
                   <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Aktivitas</th>
                   <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipe</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-gray-50">
                <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50/50 transition-colors" :class="selectedIds.includes(log.id) ? 'bg-primary/5' : ''">
                   <td class="px-8 py-6"><input type="checkbox" class="w-4 h-4 accent-primary rounded" :value="log.id" v-model="selectedIds" /></td>
                   <td class="px-8 py-6 whitespace-nowrap">
                      <div class="text-[10px] font-black text-gray-900 mb-1 capitalize">{{ formatRelativeDate(log.createdAt) }}</div>
                      <div class="text-[9px] font-bold text-gray-400 tracking-tight">{{ formatFullTime(log.createdAt) }}</div>
                   </td>
                   <td class="px-8 py-6">
                      <div class="flex items-center gap-3">
                         <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400 capitalize">{{ log.user?.name?.charAt(0) || 'S' }}</div>
                         <div>
                            <p class="text-[10px] font-black text-gray-900 tracking-tight mb-0.5">{{ log.user?.name || 'System Auto' }}</p>
                            <p class="text-[8px] font-bold text-primary uppercase tracking-widest">{{ log.user?.role || 'SYSTEM' }}</p>
                         </div>
                      </div>
                   </td>
                   <td class="px-8 py-6">
                      <span class="px-3 py-1 bg-gray-100 rounded-lg text-[9px] font-black uppercase text-gray-500 tracking-widest">{{ log.module }}</span>
                   </td>
                   <td class="px-8 py-6">
                      <p class="text-xs font-bold text-gray-700 leading-relaxed">{{ log.action }}</p>
                      <p v-if="log.details" class="text-[9px] font-medium text-gray-400 mt-1 italic">{{ log.details }}</p>
                   </td>
                   <td class="px-8 py-6">
                      <div :class="getTypeBadgeClass(log.type)" class="w-fit flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                         <div class="w-1.5 h-1.5 rounded-full bg-current"></div>
                         {{ log.type }}
                      </div>
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
          <div class="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center text-white font-black text-sm">{{ selectedIds.length }}</div>
          <span class="text-white font-bold text-sm">log dipilih</span>
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
             <i class="fa-solid fa-clock-rotate-left text-2xl"></i>
          </div>
          <h3 class="text-2xl font-black text-gray-900 tracking-tight mb-2">Hapus {{ selectedIds.length }} Log?</h3>
          <p class="text-sm font-medium text-gray-500 mb-8 leading-relaxed">
             Anda akan menghapus <strong>{{ selectedIds.length }} entri log</strong> secara permanen. Riwayat jejak digital ini tidak dapat dikembalikan.
          </p>
          <div class="flex gap-4">
             <button @click="isDeleteModalOpen = false" class="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all text-xs uppercase tracking-widest">Batal</button>
             <button @click="executeBulkDelete" class="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl transition-all text-xs uppercase tracking-widest shadow-lg shadow-red-500/30">Ya, Hapus</button>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue';
import api from '../../services/api';

const logs = ref([]);
const loading = ref(false);
const selectedIds = ref([]);
const isDeleteModalOpen = ref(false);
const filters = ref({ search: '', type: '', module: '' });

const staffToast = inject('staffToast');

const allSelected = computed(() => {
  if (logs.value.length === 0) return false;
  return logs.value.every(l => selectedIds.value.includes(l.id));
});

const toggleSelectAll = () => {
  if (allSelected.value) { selectedIds.value = []; }
  else { selectedIds.value = logs.value.map(l => l.id); }
};

const fetchLogs = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    if (filters.value.search) params.append('search', filters.value.search);
    if (filters.value.type) params.append('type', filters.value.type);
    if (filters.value.module) params.append('module', filters.value.module);

    const res = await api.get(`/audit-logs?${params.toString()}`);
    logs.value = res.data;
  } catch (err) { console.error('Failed to fetch audit logs', err); }
  finally { loading.value = false; }
};

const debounce = (fn, delay) => {
  let timeout;
  return (...args) => { clearTimeout(timeout); timeout = setTimeout(() => fn(...args), delay); };
};

const debouncedFetch = debounce(fetchLogs, 500);

const confirmBulkDelete = () => { isDeleteModalOpen.value = true; };

const executeBulkDelete = async () => {
  isDeleteModalOpen.value = false;
  try {
    await api.post('/audit-logs/bulk-delete', { ids: selectedIds.value.map(String) });
    staffToast.value?.display(`${selectedIds.value.length} entri log berhasil dihapus.`, 'info', 'Bulk Delete');
    selectedIds.value = [];
    fetchLogs();
  } catch (err) {
    console.error('Delete failed', err);
    staffToast.value?.display('Gagal menghapus log.', 'error');
  }
};

const getTypeBadgeClass = (type) => {
  switch (type) {
    case 'success': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
    case 'warning': return 'bg-amber-50 text-amber-600 border border-amber-100';
    case 'danger': return 'bg-red-50 text-red-600 border border-red-100';
    default: return 'bg-blue-50 text-blue-600 border border-blue-100';
  }
};

const formatRelativeDate = (dateStr) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(date);
};

const formatFullTime = (dateStr) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', { timeStyle: 'short' }).format(date);
};

onMounted(() => { fetchLogs(); });
</script>

<style scoped>
.shadow-premium { box-shadow: 0 20px 50px -12px rgba(0,0,0,0.05); }
.animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateX(-50%) translateY(30px); }
</style>
