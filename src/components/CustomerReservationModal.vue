<template>
  <transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[110] flex items-end sm:items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="close"></div>
      
      <!-- Modal Content -->
      <div class="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 relative z-10 max-h-[90vh] overflow-y-auto animate-slide-up sm:animate-scale-in">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-black text-gray-900">Reservasi Meja</h3>
            <p class="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Pesan tempat Anda sekarang</p>
          </div>
          <button @click="close" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form @submit.prevent="submitReservation" class="space-y-4">
          <div>
            <label class="block text-xs font-black text-gray-900 uppercase tracking-widest mb-1.5">Nama Pemesan *</label>
            <input v-model="form.name" type="text" required class="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold border-none focus:ring-2 focus:ring-primary/30 outline-none" placeholder="Masukkan nama Anda" />
          </div>

          <div>
            <label class="block text-xs font-black text-gray-900 uppercase tracking-widest mb-1.5">Nomor Telepon / WA</label>
            <input v-model="form.phone" type="text" class="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold border-none focus:ring-2 focus:ring-primary/30 outline-none" placeholder="08xxxxxxxxxx" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-black text-gray-900 uppercase tracking-widest mb-1.5">Tanggal & Waktu *</label>
              <input v-model="form.date" type="datetime-local" required class="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold border-none focus:ring-2 focus:ring-primary/30 outline-none" />
            </div>
            <div>
              <label class="block text-xs font-black text-gray-900 uppercase tracking-widest mb-1.5">Jumlah Orang *</label>
              <input v-model="form.guestCount" type="number" min="1" required class="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold border-none focus:ring-2 focus:ring-primary/30 outline-none" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-black text-gray-900 uppercase tracking-widest mb-1.5">Pilih Meja (Opsional)</label>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="t in tables" 
                :key="t.id"
                type="button"
                @click="!t.isBooked ? form.tableId = t.id : null"
                :disabled="t.isBooked"
                :class="[
                  'p-3 rounded-xl border-2 transition-all text-center',
                  form.tableId === t.id ? 'border-primary bg-primary/10 text-primary' : 'border-gray-100 bg-gray-50 text-gray-600',
                  t.isBooked ? 'opacity-50 cursor-not-allowed border-red-200 bg-red-50 text-red-500' : 'hover:border-primary/50'
                ]"
              >
                <div class="font-black text-sm">{{ t.name }}</div>
                <div class="text-[10px] font-bold mt-1" :class="t.isBooked ? 'text-red-400' : 'text-gray-400'">
                  <span v-if="t.isBooked">Penuh</span>
                  <span v-else>{{ t.capacity || 4 }} Org</span>
                </div>
              </button>
            </div>
            <p v-if="!form.date" class="text-[10px] text-gray-400 font-bold mt-2"><i class="fa-solid fa-circle-info text-blue-400 mr-1"></i> Pilih tanggal terlebih dahulu untuk melihat ketersediaan meja.</p>
          </div>

          <div>
            <label class="block text-xs font-black text-gray-900 uppercase tracking-widest mb-1.5">Catatan (Opsional)</label>
            <textarea v-model="form.notes" rows="2" class="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold border-none focus:ring-2 focus:ring-primary/30 outline-none" placeholder="Misal: Mohon meja dekat jendela"></textarea>
          </div>

          <div class="pt-4">
            <button type="submit" :disabled="loading" class="w-full bg-primary text-white font-black py-4 rounded-xl shadow-lg shadow-primary/30 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
              <i v-else class="fa-solid fa-calendar-check"></i>
              {{ loading ? 'Memproses...' : 'Buat Reservasi' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useReservationStore } from '../stores/reservation';
import api from '../services/api';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close', 'success']);

const reservationStore = useReservationStore();
const loading = ref(false);
const tables = ref([]);
const form = reactive({
  name: '',
  phone: '',
  date: '',
  guestCount: 1,
  tableId: null,
  notes: ''
});

onMounted(async () => {
  try {
    const res = await api.get('/tables');
    tables.value = res.data.map(t => ({ ...t, isBooked: false }));
  } catch (error) {
    console.error(error);
  }
});

watch(() => form.date, async (newDate) => {
  if (newDate) {
    try {
      const dateString = newDate.split('T')[0];
      const res = await api.get(`/reservations/availability?date=${dateString}`);
      tables.value = res.data;
      
      // Jika meja yang dipilih ternyata sudah dibooking di tanggal baru, reset
      const selectedTable = tables.value.find(t => t.id === form.tableId);
      if (selectedTable && selectedTable.isBooked) {
        form.tableId = null;
      }
    } catch (error) {
      console.error('Gagal mengecek ketersediaan meja:', error);
    }
  } else {
    tables.value.forEach(t => t.isBooked = false);
  }
});

const close = () => {
  emit('close');
};

const submitReservation = async () => {
  loading.value = true;
  try {
    reservationStore.startReservation(form);
    emit('success');
    // Reset form
    form.name = '';
    form.phone = '';
    form.date = '';
    form.guestCount = 1;
    form.tableId = null;
    form.notes = '';
    close();
  } catch (error) {
    console.error('Failed to start reservation', error);
    alert('Terjadi kesalahan');
  } finally {
    loading.value = false;
  }
};
</script>
