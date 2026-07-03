<template>
  <div class="p-6 h-full flex flex-col gap-6" style="min-height: calc(100vh - 64px)">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-black text-gray-900 leading-none">Daftar Reservasi & Pengaturan</h2>
        <p class="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">
          Kelola histori reservasi dan pengaturan DP
        </p>
      </div>
      <button
        @click="fetchData"
        class="p-2.5 bg-white rounded-xl text-gray-400 hover:text-primary hover:bg-primary/5 transition-all border border-gray-100 shadow-sm"
      >
        <i class="fa-solid fa-arrows-rotate text-sm" :class="{ 'animate-spin': loading }"></i>
      </button>
    </div>

    <!-- DP Settings Card -->
    <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-xl">
          <i class="fa-solid fa-percent"></i>
        </div>
        <div>
          <h3 class="font-black text-gray-900">Persentase Down Payment (DP)</h3>
          <p class="text-xs text-gray-500 font-bold">Tentukan persentase DP yang harus dibayar pelanggan untuk pesanan reservasi.</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div class="relative">
          <input 
            v-model="dpPercent" 
            type="number" 
            min="0" 
            max="100" 
            class="w-24 bg-gray-50 border-none rounded-xl px-4 py-2 font-black text-gray-900 focus:ring-2 focus:ring-primary/30"
          />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">%</span>
        </div>
        <button 
          @click="saveDpSettings"
          :disabled="savingDp"
          class="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <i v-if="savingDp" class="fa-solid fa-circle-notch fa-spin"></i>
          <i v-else class="fa-solid fa-save"></i>
          Simpan
        </button>
      </div>
    </div>

    <!-- Table Availability Check Card -->
    <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center text-xl">
            <i class="fa-solid fa-calendar-check"></i>
          </div>
          <div>
            <h3 class="font-black text-gray-900">Cek Ketersediaan Meja</h3>
            <p class="text-xs text-gray-500 font-bold">Pilih tanggal untuk melihat meja mana saja yang kosong.</p>
          </div>
        </div>
        <div>
          <input 
            type="date" 
            v-model="availabilityDate" 
            @change="checkAvailability"
            class="bg-gray-50 border-none rounded-xl px-4 py-3 font-black text-gray-900 focus:ring-2 focus:ring-blue-500/30 outline-none"
          />
        </div>
      </div>
      
      <div v-if="availabilityDate" class="grid grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
        <div 
          v-for="t in tablesAvailability" 
          :key="t.id"
          class="p-3 rounded-xl border-2 text-center"
          :class="t.isBooked ? 'border-red-100 bg-red-50' : 'border-emerald-100 bg-emerald-50'"
        >
          <div class="font-black text-sm" :class="t.isBooked ? 'text-red-600' : 'text-emerald-600'">{{ t.name }}</div>
          <div class="text-[10px] font-bold mt-1" :class="t.isBooked ? 'text-red-400' : 'text-emerald-500'">
            <span v-if="t.isBooked">Terisi</span>
            <span v-else>Kosong ({{ t.capacity || 4 }} Org)</span>
          </div>
        </div>
        <div v-if="tablesAvailability.length === 0" class="col-span-full text-center text-xs text-gray-400 font-bold py-4">
          Tidak ada meja yang tersedia.
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm flex-1 flex flex-col overflow-hidden">
      <!-- Tabs -->
      <div class="flex items-center gap-2 px-8 py-4 border-b border-gray-50 bg-gray-50/50">
        <button
          v-for="status in ['ALL', 'PENDING', 'APPROVED', 'COMPLETED', 'REJECTED']"
          :key="status"
          @click="statusFilter = status"
          class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          :class="statusFilter === status ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-white hover:text-gray-800'"
        >
          {{ status }}
        </button>
      </div>

      <!-- Table -->
      <div class="flex-1 overflow-x-auto">
        <table class="w-full text-left whitespace-nowrap min-w-[800px]">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="px-8 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Waktu / Tgl</th>
              <th class="py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Pelanggan</th>
              <th class="py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Detail Pesanan</th>
              <th class="py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="res in filteredReservations" :key="res.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-8 py-4">
                <p class="text-xs font-black text-gray-900">{{ formatDate(res.date) }}</p>
                <p class="text-[10px] font-bold text-gray-400">{{ formatTime(res.date) }}</p>
              </td>
              <td class="py-4">
                <p class="text-sm font-black text-gray-900">{{ res.name }}</p>
                <p class="text-xs font-bold text-gray-600 mt-0.5">{{ res.phone || '-' }}</p>
                <p v-if="res.notes" class="text-[9px] font-bold text-gray-400 mt-1 flex items-center gap-1">
                  <i class="fa-solid fa-comment-dots text-primary/50"></i> {{ res.notes }}
                </p>
              </td>
              <td class="py-4">
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-[10px]">
                      <i class="fa-solid fa-users"></i>
                    </div>
                    <span class="text-xs font-black text-gray-900">{{ res.guestCount }} Org</span>
                  </div>
                  <div v-if="res.table" class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center text-[10px]">
                      <i class="fa-solid fa-chair"></i>
                    </div>
                    <span class="text-xs font-black text-gray-900">{{ res.table.name }}</span>
                  </div>
                  <div v-if="res.order" class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center text-[10px]">
                      <i class="fa-solid fa-utensils"></i>
                    </div>
                    <span class="text-[10px] font-black text-gray-900">{{ res.order.items?.length || 0 }} Menu</span>
                    <span v-if="res.order.payments?.length" class="text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-1">
                      {{ formatPrice(res.order.payments[0].amount) }} Dibayar
                    </span>
                  </div>
                </div>
              </td>
              <td class="py-4">
                <span
                  class="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest"
                  :class="getStatusClass(res.status)"
                >
                  {{ res.status }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredReservations.length === 0">
              <td colspan="4" class="py-24 text-center">
                <div class="flex flex-col items-center opacity-20">
                  <i class="fa-regular fa-calendar-xmark text-5xl mb-4 text-gray-400"></i>
                  <p class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    Tidak ada reservasi
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { reservationService } from '../../services/reservation.service';
import api from '../../services/api';

const reservations = ref([]);
const loading = ref(false);
const statusFilter = ref('ALL');
const dpPercent = ref(50);
const savingDp = ref(false);

const availabilityDate = ref('');
const tablesAvailability = ref([]);

const checkAvailability = async () => {
  if (!availabilityDate.value) return;
  try {
    const res = await api.get(`/reservations/availability?date=${availabilityDate.value}`);
    tablesAvailability.value = res.data;
  } catch (error) {
    console.error('Failed to check availability', error);
  }
};

const fetchData = async () => {
  loading.value = true;
  try {
    const [resData, settingsRes] = await Promise.all([
      reservationService.getAllReservations(),
      api.get('/infrastructure/settings').catch(() => ({ data: {} }))
    ]);
    reservations.value = resData;
    if (settingsRes.data && settingsRes.data.reservation_dp_percent) {
      dpPercent.value = Number(settingsRes.data.reservation_dp_percent);
    }
  } catch (error) {
    console.error('Failed to fetch data', error);
  } finally {
    loading.value = false;
  }
};

const saveDpSettings = async () => {
  savingDp.value = true;
  try {
    await api.patch('/infrastructure/settings', {
      key: 'reservation_dp_percent',
      value: String(dpPercent.value)
    });
    alert('Pengaturan DP berhasil disimpan.');
  } catch (error) {
    console.error('Failed to save DP settings', error);
    alert('Gagal menyimpan pengaturan.');
  } finally {
    savingDp.value = false;
  }
};

onMounted(() => {
  fetchData();
});

const filteredReservations = computed(() => {
  if (statusFilter.value === 'ALL') return reservations.value;
  return reservations.value.filter((r) => r.status === statusFilter.value);
});

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatTime = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
};

const getStatusClass = (status) => {
  switch (status) {
    case 'PENDING': return 'bg-yellow-50 text-yellow-600';
    case 'APPROVED': return 'bg-emerald-50 text-emerald-600';
    case 'COMPLETED': return 'bg-gray-100 text-gray-500';
    case 'REJECTED': return 'bg-red-50 text-red-600';
    default: return 'bg-gray-50 text-gray-500';
  }
};
</script>
