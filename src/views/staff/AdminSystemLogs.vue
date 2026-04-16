<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex justify-between items-center bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
       <div>
          <h2 class="text-2xl font-black text-gray-900 tracking-tight">Audit & System Logs</h2>
          <p class="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest">Pantau aktivitas chatbot, sesi tamu, dan notifikasi</p>
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

    <!-- Chatbot Logs -->
    <div v-if="currentTab === 'chatbot'" class="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden p-10 animate-fade-in">
       <div class="overflow-x-auto">
          <table class="w-full text-left">
             <thead>
                <tr class="border-b border-gray-50">
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Waktu</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pesan Masuk</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Respon AI</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-gray-50">
                <tr v-for="log in chatbotLogs" :key="log.id" class="group hover:bg-gray-50/50 transition-colors text-xs">
                   <td class="py-6 whitespace-nowrap text-gray-400 font-medium tabular-nums">{{ formatDateTime(log.createdAt) }}</td>
                   <td class="py-6 font-black text-gray-900">{{ log.user?.name || 'Guest Guest' }}</td>
                   <td class="py-6 font-bold text-gray-600 max-w-xs truncate">{{ log.message }}</td>
                   <td class="py-6 italic text-primary/80 max-w-xs truncate">{{ log.response }}</td>
                </tr>
             </tbody>
          </table>
       </div>
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
                      <button class="text-red-400 hover:text-red-600 font-black uppercase text-[9px] tracking-widest">Paksa Selesai</button>
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

    <NotificationToast ref="toast" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import api from '../../services/api';
import NotificationToast from '../../components/NotificationToast.vue';

const currentTab = ref('chatbot');
const chatbotLogs = ref([]);
const guestSessions = ref([]);
const notificationLogs = ref([]);
const toast = ref(null);

const tabs = [
  { label: 'Chatbot Logs', value: 'chatbot' },
  { label: 'Active Sessions', value: 'sessions' },
  { label: 'Notification History', value: 'notifications' }
];

const fetchData = async () => {
  try {
    if (currentTab.value === 'chatbot') {
      const res = await api.get('/chatbot/logs');
      chatbotLogs.value = res.data;
    } else if (currentTab.value === 'sessions') {
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
