<template>
  <div class="space-y-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Settings Form -->
      <div class="lg:col-span-1 space-y-8">
        <div class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-premium">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shadow-lg">
              <i class="fa-brands fa-whatsapp text-xl"></i>
            </div>
            <div>
              <h3 class="font-black text-gray-900 tracking-tight">Konfigurasi WA</h3>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pengaturan Bot Notifikasi</p>
            </div>
          </div>

          <form @submit.prevent="saveSettings" class="space-y-6">
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-4">Nomor WhatsApp Admin</label>
              <input 
                v-model="form.number" 
                type="text" 
                placeholder="Contoh: 628123456789"
                class="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-3xl font-bold text-gray-900 transition-all outline-none"
              />
              <p class="text-[10px] text-gray-400 mt-2 px-4 italic">*Gunakan kode negara (62) tanpa tanda +</p>
            </div>

            <div class="flex gap-3">
              <button 
                type="submit" 
                :disabled="saving"
                class="flex-1 bg-gray-900 text-white py-4 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:shadow-xl hover:shadow-primary/20 transition-all disabled:opacity-50"
              >
                {{ saving ? 'Menyimpan...' : 'Simpan Nomor' }}
              </button>
              <button 
                @click="sendTestMessage" 
                type="button"
                :disabled="!status.isReady || testing"
                class="bg-green-500 text-white px-6 rounded-3xl hover:bg-green-600 transition-all disabled:opacity-30"
                title="Kirim Pesan Tes"
              >
                <i class="fa-solid fa-paper-plane" v-if="!testing"></i>
                <i class="fa-solid fa-circle-notch fa-spin" v-else></i>
              </button>
            </div>
          </form>
        </div>

        <!-- Connection Status & QR -->
        <div class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-premium overflow-hidden relative">
          <div class="flex justify-between items-center mb-6">
            <h4 class="text-xs font-black text-gray-900 uppercase tracking-widest">Status Koneksi</h4>
            <span 
              :class="status.isReady ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'"
              class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest"
            >
              {{ status.isReady ? 'Terhubung' : 'Terputus' }}
            </span>
          </div>

          <div v-if="!status.isReady" class="flex flex-col items-center py-6">
            <template v-if="status.qrCode">
              <div class="p-4 bg-white border-2 border-primary/20 rounded-3xl shadow-lg mb-6">
                <img :src="status.qrCode" alt="WA QR Code" class="w-48 h-48" />
              </div>
              <p class="text-[10px] font-bold text-gray-500 text-center px-4 uppercase tracking-widest leading-relaxed">
                Scan kode QR di atas menggunakan WhatsApp Anda untuk menghubungkan sistem
              </p>
            </template>
            <template v-else>
              <div class="w-48 h-48 bg-gray-50 rounded-3xl flex items-center justify-center border-2 border-dashed border-gray-200 mb-6">
                <i class="fa-solid fa-circle-notch fa-spin text-primary text-3xl"></i>
              </div>
              <p class="text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest">Menunggu Kode QR...</p>
            </template>
          </div>
          
          <div v-else class="flex flex-col items-center py-10">
             <div class="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center shadow-inner mb-6">
                <i class="fa-solid fa-check-double text-4xl"></i>
             </div>
             <p class="text-xs font-black text-gray-900 uppercase tracking-tight">Sistem Siap</p>
             <p class="text-[10px] text-gray-400 mt-1 font-bold">Bot berjalan di latar belakang</p>
          </div>

          <button 
            @click="fetchStatus" 
            class="w-full mt-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-2xl text-[9px] font-black text-gray-500 uppercase tracking-widest transition-all"
          >
            Segarkan Status
          </button>
        </div>
      </div>

      <!-- Logs Section -->
      <div class="lg:col-span-2">
        <div class="bg-white p-10 rounded-[40px] border border-gray-100 shadow-premium h-full flex flex-col">
          <div class="flex justify-between items-center mb-8">
            <div>
              <h3 class="text-xl font-black text-gray-900 tracking-tight">Log Aktivitas WhatsApp</h3>
              <p class="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">50 Pesan Terakhir</p>
            </div>
            <button @click="fetchLogs" class="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:text-primary transition-all">
              <i class="fa-solid fa-arrows-rotate"></i>
            </button>
          </div>

          <div class="flex-1 overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-gray-50">
                  <th class="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Penerima</th>
                  <th class="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pesan</th>
                  <th class="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th class="pb-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Waktu</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 text-sm">
                <tr v-for="log in logs" :key="log.id" class="group hover:bg-gray-50 transition-colors">
                  <td class="py-4 font-black text-gray-900">{{ log.recipient }}</td>
                  <td class="py-4 text-gray-500 max-w-xs truncate font-medium">{{ log.message }}</td>
                  <td class="py-4">
                    <span 
                      :class="log.status === 'SENT' ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'"
                      class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest"
                    >
                      {{ log.status }}
                    </span>
                  </td>
                  <td class="py-4 text-right text-gray-400 text-xs font-bold uppercase tracking-tighter">{{ formatDateTime(log.createdAt) }}</td>
                </tr>
                <tr v-if="logs.length === 0">
                   <td colspan="4" class="py-20 text-center">
                      <div class="opacity-20 mb-4 scale-150"><i class="fa-solid fa-box-open text-4xl"></i></div>
                      <p class="text-xs font-black text-gray-300 uppercase tracking-widest">Belum ada riwayat pesan</p>
                   </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import api from '../../services/api';

const staffToast = inject('staffToast');
const status = ref({ isReady: false, qrCode: null });
const logs = ref([]);
const form = ref({ number: '' });
const saving = ref(false);
const testing = ref(false);

const fetchStatus = async () => {
  try {
    const res = await api.get('/whatsapp/status');
    status.value = res.data;
  } catch (err) {
    console.error('Failed to fetch status', err);
  }
};

const fetchSettings = async () => {
  try {
    const res = await api.get('/whatsapp/settings');
    form.value.number = res.data.admin_whatsapp_number || '';
  } catch (err) {
    console.error('Failed to fetch settings', err);
  }
};

const fetchLogs = async () => {
  try {
    const res = await api.get('/whatsapp/logs');
    logs.value = res.data;
  } catch (err) {
    console.error('Failed to fetch logs', err);
  }
};

const saveSettings = async () => {
  saving.value = true;
  try {
    await api.post('/whatsapp/settings', { number: form.value.number });
    staffToast.value.show('Pengaturan disimpan!', 'success');
  } catch (err) {
    staffToast.value.show('Gagal menyimpan pengaturan', 'error');
  } finally {
    saving.value = false;
  }
};

const sendTestMessage = async () => {
  if (!form.value.number) return;
  testing.value = true;
  try {
    await api.post('/whatsapp/test', { number: form.value.number });
    staffToast.value.show('Pesan tes terkirim!', 'success');
    fetchLogs();
  } catch (err) {
    staffToast.value.show('Gagal mengirim pesan tes', 'error');
  } finally {
    testing.value = false;
  }
};

const formatDateTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' - ' + 
         date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
};

onMounted(() => {
  fetchStatus();
  fetchSettings();
  fetchLogs();
  
  // Poll status every 5s while waiting for QR
  const interval = setInterval(() => {
    if (!status.value.isReady) {
      fetchStatus();
    }
  }, 5000);
  
  onUnmounted(() => clearInterval(interval));
});

import { onUnmounted } from 'vue';
</script>
