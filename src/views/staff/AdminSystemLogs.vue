<template>
  <div class="space-y-8">
    <!-- Header -->
     <div class="flex justify-between items-center bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
        <div>
           <h2 class="text-2xl font-black text-gray-900 tracking-tight">Audit & System Logs</h2>
           <p class="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest">Pantau aktivitas chatbot, sesi tamu, dan notifikasi</p>
        </div>
        <div class="flex items-center gap-4">
        </div>
     </div>

    <!-- Tabs -->
    <div class="flex gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm w-fit">
       <button 
          v-for="tab in tabs" :key="tab.value"
          @click="currentTab = tab.value"
          class="px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
          :class="currentTab === tab.value ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'"
       >
          {{ tab.label }}
       </button>
    </div>



    <!-- Guest Sessions -->
    <div v-if="currentTab === 'sessions'" class="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden p-10 animate-fade-in">
       <div class="overflow-x-auto">
          <table class="w-full text-left">
             <thead>
                <tr class="border-b border-gray-50">
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID Sesi</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Meja</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Berakhir Pada</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Pesanan</th>
                   <th class="pb-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Aksi</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-gray-50 text-xs">
                <tr v-for="s in guestSessions" :key="s.id">
                   <td class="py-6 font-mono text-[10px] text-gray-400">#{{ s.id.substring(0, 8) }}...</td>
                   <td class="py-6 font-black text-gray-900">{{ s.table?.name || 'Self-Order' }}</td>
                   <td class="py-6 font-bold" :class="isExpired(s.expiresAt) ? 'text-red-400' : 'text-emerald-500'">{{ formatDateTime(s.expiresAt) }}</td>
                   <td class="py-6 text-center">
                      <span class="bg-gray-100 px-2 py-0.5 rounded font-black text-gray-500">{{ s.ordersCount }}</span>
                   </td>
                    <td class="py-6 text-right">
                       <button @click="confirmDelete('session', s)" class="text-red-400 hover:text-red-600 font-black uppercase text-[9px] tracking-widest">Hapus Sesi</button>
                    </td>
                 </tr>
              </tbody>
          </table>
       </div>
    </div>

    <!-- Notifications Log -->
    <div v-if="currentTab === 'notifications'" class="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden p-10 animate-fade-in">
       <div class="overflow-x-auto">
          <table class="w-full text-left">
             <thead>
                <tr class="border-b border-gray-50">
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Waktu Kirim</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Penerima</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Judul</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-gray-50 text-xs text-gray-600">
                <tr v-for="n in notificationLogs" :key="n.id">
                   <td class="py-6 tabular-nums">{{ formatDateTime(n.createdAt) }}</td>
                   <td class="py-6 font-black text-gray-900">{{ n.user?.name || `Tamu (${n.guestSessionId?.substring(0,4)}...)` }}</td>
                   <td class="py-6 font-bold">{{ n.title }}</td>
                   <td class="py-6 text-center">
                      <span :class="n.isRead ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'" class="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">
                         {{ n.isRead ? 'Dibaca' : 'Terkirim' }}
                      </span>
                   </td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>

    <!-- Unified Delete Modal -->
    <div v-if="deleteModalOpen" class="fixed inset-0 z-[140] flex items-center justify-center p-6">
       <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm shadow-2xl" @click="deleteModalOpen = false"></div>
       <div class="bg-white w-full max-w-md rounded-[32px] shadow-2xl relative z-10 overflow-hidden animate-scale-in p-8 text-center">
          <div class="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
             <i class="fa-solid fa-triangle-exclamation text-2xl"></i>
          </div>
          <h3 class="text-2xl font-black text-gray-900 tracking-tight mb-2">Hapus {{ deleteType === 'clearLogs' ? 'Semua Log' : (deleteType === 'log' ? 'Entri Log' : 'Sesi Tamu') }}?</h3>
          <p class="text-sm font-medium text-gray-500 mb-8 leading-relaxed">
             <span v-if="deleteType === 'clearLogs'">Apakah Anda yakin ingin <strong>menghapus seluruh riwayat aktivitas chatbot</strong>? Tindakan ini akan mengosongkan log untuk semua user.</span>
             <span v-else-if="deleteType === 'log'">Hapus log aktivitas dari <strong>{{ itemToDelete?.user?.name || 'Guest' }}</strong>?</span>
             <span v-else>Hapus sesi tamu ini? Akses user ke keranjang belanja saat ini mungkin akan terputus.</span>
             <span class="block mt-2 text-red-400 font-black uppercase text-[10px]">Tindakan ini permanen.</span>
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
import { ref, onMounted, watch, inject } from 'vue';
import api from '../../services/api';

const currentTab = ref('sessions');
const guestSessions = ref([]);
const notificationLogs = ref([]);
const staffToast = inject('staffToast');

const deleteModalOpen = ref(false);
const deleteType = ref(''); // 'session' or 'other'
const itemToDelete = ref(null);

const tabs = [
  { label: 'Active Sessions', value: 'sessions' },
  { label: 'Notification History', value: 'notifications' }
];

const fetchData = async () => {
  try {
    if (currentTab.value === 'sessions') {
      const res = await api.get('/guest/admin');
      guestSessions.value = res.data;
    } else if (currentTab.value === 'notifications') {
      const res = await api.get('/notifications/admin');
      notificationLogs.value = res.data;
    }
  } catch (err) {
    console.error('Fetch system logs failed', err);
  }
};

watch(currentTab, fetchData);

const confirmDelete = (type, item) => {
   deleteType.value = type;
   itemToDelete.value = item;
   deleteModalOpen.value = true;
};

const confirmClearAll = () => {
   deleteType.value = 'clearLogs';
   itemToDelete.value = null;
   deleteModalOpen.value = true;
};

const executeDelete = async () => {
   deleteModalOpen.value = false;
   try {
      if (deleteType.value === 'session') {
         await api.delete(`/guest/session/${itemToDelete.value.id}`);
         staffToast.value?.display('Sesi tamu telah dihapus dari sistem.', 'info');
      }
      fetchData();
   } catch (err) {
      console.error('Operation failed', err);
      staffToast.value?.display('Gagal melakukan tindakan penghapusan.', 'error');
   } finally {
      itemToDelete.value = null;
   }
};

const isExpired = (date) => new Date(date) < new Date();

const formatDateTime = (dateStr) => {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(dateStr));
};

onMounted(fetchData);
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
