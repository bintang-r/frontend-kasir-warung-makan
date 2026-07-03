<template>
  <div>
    <!-- The Floating Bar at the bottom (above standard bottom nav) -->
    <transition name="slide-up">
      <div v-if="reservationStore.isReservationMode && !createdReservation" 
           class="fixed bottom-24 left-0 right-0 z-40 px-4 pointer-events-none"
      >
        <div class="bg-gray-900 rounded-2xl shadow-premium p-4 flex items-center justify-between pointer-events-auto">
          <div class="flex flex-col flex-1" @click="showSlide = true">
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sedang Reservasi</span>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-white font-black text-sm line-clamp-1">Meja {{ tableName }}</span>
              <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            </div>
            <span class="text-primary text-xs font-bold mt-1">{{ reservationStore.totalItems }} Menu Dipilih</span>
          </div>
          <div class="flex gap-2">
            <button @click="cancelReservation" class="w-10 h-10 rounded-xl bg-gray-800 text-gray-400 flex items-center justify-center hover:text-red-400 transition-colors">
              <i class="fa-solid fa-xmark"></i>
            </button>
            <button @click="showSlide = true" class="px-4 h-10 rounded-xl bg-primary text-white text-xs font-black transition-all shadow-md active:scale-95">
              Bayar
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Slide Carousel / Bottom Sheet for Reservation Menus -->
    <transition name="fade">
      <div v-if="(showSlide && reservationStore.isReservationMode) || createdReservation" class="fixed inset-0 z-[100] flex flex-col justify-end">
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="!createdReservation && (showSlide = false)"></div>
        <div class="bg-white rounded-t-3xl w-full max-h-[85vh] flex flex-col relative z-10 animate-slide-up shadow-up">
          
          <!-- ======= STEP 1: Menu & Pilih Pembayaran ======= -->
          <template v-if="!createdReservation">
            <!-- Header -->
            <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-3xl sticky top-0 z-20">
              <div>
                <h3 class="text-lg font-black text-gray-900 leading-none">Reservasi Meja {{ tableName }}</h3>
                <p class="text-xs text-gray-500 font-bold mt-1">{{ formatDateTime(reservationStore.reservationData.date) }} • {{ reservationStore.reservationData.guestCount }} Orang</p>
              </div>
              <button @click="showSlide = false" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                <i class="fa-solid fa-chevron-down"></i>
              </button>
            </div>

            <!-- Body -->
            <div class="p-6 overflow-y-auto flex-1 bg-gray-50/50">
              <!-- Selected Menus -->
              <div v-if="reservationStore.cartItems.length > 0" class="space-y-4">
                <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Menu Pre-Order</h4>
                <div v-for="item in reservationStore.cartItems" :key="item.menuId" class="flex gap-4 items-center bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                  <img :src="getImageUrl(item.image)" class="w-16 h-16 object-cover rounded-xl shadow-sm bg-gray-100" @error="e => e.target.src='https://placehold.co/100x100?text=No+Image'" />
                  <div class="flex-1">
                    <h3 class="text-sm font-black text-gray-900 line-clamp-1">{{ item.name }}</h3>
                    <span class="text-xs font-bold text-primary">{{ formatPrice(item.price) }}</span>
                  </div>
                  <div class="flex items-center gap-3 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 shadow-sm">
                    <button @click="reservationStore.removeItem(item.menuId)" class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
                      <i class="fa-solid fa-minus text-[10px]"></i>
                    </button>
                    <span class="text-sm font-black text-gray-900 min-w-[20px] text-center">{{ item.qty }}</span>
                    <button @click="reservationStore.addItem({id: item.menuId, name: item.name, price: item.price, image: item.image})" class="w-6 h-6 flex items-center justify-center text-primary hover:text-primary-dark transition-colors">
                      <i class="fa-solid fa-plus text-[10px]"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-10 bg-white rounded-3xl border border-dashed border-gray-200">
                <i class="fa-solid fa-utensils text-4xl text-gray-300 mb-3"></i>
                <p class="text-sm font-bold text-gray-500">Belum ada menu yang dipilih.</p>
                <p class="text-xs text-gray-400 mt-1">Anda bisa memesan tempat saja, atau tambah menu.</p>
              </div>

              <!-- Payment Methods -->
              <div class="mt-6 space-y-4">
                <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Opsi Pembayaran</h4>
                <div class="grid grid-cols-2 gap-3">
                  <button 
                    @click="paymentType = 'DP'"
                    :class="paymentType === 'DP' ? 'bg-primary/10 border-primary shadow-sm' : 'bg-white border-transparent shadow-sm'"
                    class="p-4 rounded-2xl border-2 transition-all text-left"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs font-black" :class="paymentType === 'DP' ? 'text-primary' : 'text-gray-900'">Bayar DP 50%</span>
                      <i v-if="paymentType === 'DP'" class="fa-solid fa-circle-check text-primary"></i>
                    </div>
                    <span class="block text-lg font-black text-gray-900">{{ formatPrice(reservationStore.totalPrice / 2) }}</span>
                  </button>

                  <button 
                    @click="paymentType = 'FULL'"
                    :class="paymentType === 'FULL' ? 'bg-primary/10 border-primary shadow-sm' : 'bg-white border-transparent shadow-sm'"
                    class="p-4 rounded-2xl border-2 transition-all text-left"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs font-black" :class="paymentType === 'FULL' ? 'text-primary' : 'text-gray-900'">Bayar Lunas</span>
                      <i v-if="paymentType === 'FULL'" class="fa-solid fa-circle-check text-primary"></i>
                    </div>
                    <span class="block text-lg font-black text-gray-900">{{ formatPrice(reservationStore.totalPrice) }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Footer Action -->
            <div class="p-6 pb-10 bg-white border-t border-gray-100 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] relative z-20">
              <div class="flex justify-between items-center mb-4">
                <span class="text-xs font-black text-gray-500">Total Harus Dibayar</span>
                <span class="text-xl font-black text-primary">{{ formatPrice(paymentType === 'DP' ? reservationStore.totalPrice / 2 : reservationStore.totalPrice) }}</span>
              </div>
              <button 
                @click="submitReservation"
                :disabled="loading"
                class="w-full bg-primary text-white font-black py-4 rounded-xl shadow-lg shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
                <i v-else class="fa-solid fa-check"></i>
                {{ loading ? 'Memproses...' : 'Konfirmasi & Bayar' }}
              </button>
            </div>
          </template>

          <!-- ======= STEP 2: Upload Bukti Pembayaran ======= -->
          <template v-else>
            <!-- Header -->
            <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-3xl sticky top-0 z-20">
              <div>
                <h3 class="text-lg font-black text-gray-900 leading-none">Upload Bukti Pembayaran</h3>
                <p class="text-xs text-gray-500 font-bold mt-1">
                  Reservasi #{{ createdReservation.id }} • 
                  <span class="text-primary">{{ paymentType === 'DP' ? 'DP 50%' : 'Lunas' }}</span>
                </p>
              </div>
              <!-- No close button here — user must upload or skip -->
            </div>

            <!-- Body -->
            <div class="p-6 overflow-y-auto flex-1 bg-gray-50/50 space-y-5">
              <!-- Success Banner -->
              <div class="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                <div class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <i class="fa-solid fa-check text-sm"></i>
                </div>
                <div>
                  <p class="text-xs font-black text-emerald-800 uppercase tracking-widest">Reservasi Berhasil Dibuat!</p>
                  <p class="text-[10px] text-emerald-700 font-bold mt-0.5">Sekarang unggah bukti transfer untuk konfirmasi pembayaran.</p>
                </div>
              </div>

              <!-- Amount Info -->
              <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Jumlah Yang Harus Ditransfer</p>
                <p class="text-2xl font-black text-gray-900">
                  {{ formatPrice(paymentType === 'DP' ? reservationStore.lastTotalPrice / 2 : reservationStore.lastTotalPrice) }}
                </p>
                <p class="text-[9px] font-bold text-gray-400 mt-1">
                  {{ paymentType === 'DP' ? 'DP 50% dari total tagihan' : 'Pembayaran penuh' }}
                </p>
              </div>

              <!-- Bank Info -->
              <div class="p-5 bg-blue-50/60 rounded-2xl border border-blue-100/60 text-blue-900">
                <div class="flex items-center justify-between mb-3">
                  <img src="https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/1200px-BNI_logo.svg.png" class="h-5" />
                  <span class="text-[9px] font-black uppercase tracking-widest opacity-60">Bank BNI</span>
                </div>
                <div class="flex justify-between items-center bg-white p-4 rounded-xl border border-blue-100 cursor-pointer active:scale-95 transition-all" @click="copyBankNumber">
                  <div>
                    <p class="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1">Nomor Rekening</p>
                    <p class="text-sm font-black text-gray-900 tracking-wider">8829 1028 3129</p>
                  </div>
                  <div class="flex items-center gap-1.5 text-blue-500">
                    <i v-if="copied" class="fa-solid fa-check text-emerald-500"></i>
                    <i v-else class="fa-solid fa-copy"></i>
                    <span class="text-[9px] font-bold">{{ copied ? 'Tersalin!' : 'Salin' }}</span>
                  </div>
                </div>
                <p class="text-[9px] font-bold text-gray-500 mt-2 text-center">A/N RM SIANTAR MINANG</p>
              </div>

              <!-- Upload Proof -->
              <div class="space-y-3">
                <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bukti Transfer</h4>

                <!-- File preview if selected -->
                <div v-if="proofPreviewUrl" class="rounded-2xl overflow-hidden border border-gray-100 shadow-sm aspect-video max-h-48 bg-gray-100 relative">
                  <img :src="proofPreviewUrl" class="w-full h-full object-cover" />
                  <button @click="clearSelectedFile" class="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center text-xs hover:bg-black/70 transition-colors">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>

                <!-- Dropzone -->
                <div class="relative border-2 border-dashed border-gray-200 hover:border-primary rounded-2xl p-6 transition-colors flex flex-col items-center justify-center cursor-pointer bg-gray-50/50">
                  <input type="file" ref="proofFileInput" @change="onProofFileSelected" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" accept="image/*" />
                  <i class="fa-solid fa-cloud-arrow-up text-3xl text-gray-300 mb-2"></i>
                  <p class="text-xs font-black text-gray-400 uppercase tracking-widest">
                    {{ selectedProofFile ? selectedProofFile.name : 'Pilih Foto Bukti Transfer' }}
                  </p>
                  <p class="text-[9px] text-gray-400 mt-1">Format: JPG, PNG (Max 5MB)</p>
                </div>
              </div>
            </div>

            <!-- Footer Actions -->
            <div class="p-6 pb-10 bg-white border-t border-gray-100 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] relative z-20 space-y-3">
              <button 
                @click="uploadAndFinish"
                :disabled="!selectedProofFile || isUploading"
                class="w-full bg-primary text-white font-black py-4 rounded-xl shadow-lg shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:scale-100"
              >
                <i v-if="isUploading" class="fa-solid fa-circle-notch fa-spin"></i>
                <i v-else class="fa-solid fa-upload"></i>
                {{ isUploading ? 'Mengunggah...' : 'Unggah & Selesai' }}
              </button>
              <button 
                @click="skipAndFinish"
                class="w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-xl text-xs uppercase tracking-widest transition-all hover:bg-gray-200 flex items-center justify-center gap-2"
              >
                <i class="fa-solid fa-forward"></i> Lewati, Upload Nanti
              </button>
            </div>
          </template>

        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useReservationStore } from '../stores/reservation';
import api, { getImageUrl } from '../services/api';
import { reservationService } from '../services/reservation.service';
import { useRouter } from 'vue-router';

const reservationStore = useReservationStore();
const showSlide = ref(false);
const loading = ref(false);
const paymentType = ref('DP');
const tables = ref([]);
const router = useRouter();

// Step 2 state
const createdReservation = ref(null);
const selectedProofFile = ref(null);
const proofPreviewUrl = ref(null);
const proofFileInput = ref(null);
const isUploading = ref(false);
const copied = ref(false);

onMounted(async () => {
  try {
    const res = await api.get('/tables');
    tables.value = res.data;
  } catch (error) {
    console.error('Failed to load tables', error);
  }
});

const tableName = computed(() => {
  const t = tables.value.find(x => x.id === reservationStore.reservationData.tableId);
  return t ? t.name : 'Dipilih';
});

const cancelReservation = () => {
  if (confirm('Yakin ingin membatalkan proses reservasi?')) {
    reservationStore.cancelReservation();
    createdReservation.value = null;
    selectedProofFile.value = null;
    proofPreviewUrl.value = null;
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price || 0);
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
};

const copyBankNumber = () => {
  navigator.clipboard.writeText('882910283129').then(() => {
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  });
};

const onProofFileSelected = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    alert('Ukuran file maksimal 5MB!');
    return;
  }
  selectedProofFile.value = file;
  proofPreviewUrl.value = URL.createObjectURL(file);
};

const clearSelectedFile = () => {
  selectedProofFile.value = null;
  proofPreviewUrl.value = null;
  if (proofFileInput.value) proofFileInput.value.value = '';
};

const submitReservation = async () => {
  loading.value = true;
  try {
    const data = reservationStore.reservationData;
    const payload = {
      name: data.name,
      phone: data.phone,
      date: new Date(data.date).toISOString(),
      guestCount: Number(data.guestCount),
      tableId: data.tableId ? Number(data.tableId) : undefined,
      notes: data.notes,
      paymentType: paymentType.value,
      items: reservationStore.cartItems.map(i => ({
        menuId: i.menuId,
        qty: i.qty,
        price: i.price
      }))
    };
    
    const response = await reservationService.createReservation(payload);
    
    // Save to local store for guest tracking
    if (response && response.id) {
      if (typeof reservationStore.addReservationId === 'function') {
        reservationStore.addReservationId(response.id);
      } else {
        const currentIds = JSON.parse(localStorage.getItem('myReservationIds') || '[]');
        if (!currentIds.includes(response.id)) {
          currentIds.push(response.id);
          localStorage.setItem('myReservationIds', JSON.stringify(currentIds));
        }
      }
      // Save last total price before clearing store
      if (typeof reservationStore.saveTotalPrice === 'function') {
        reservationStore.saveTotalPrice();
      }
    }

    // Move to step 2 — upload proof
    createdReservation.value = response;
    // Keep showSlide open but don't cancel reservation mode yet

  } catch (error) {
    console.error(error);
    alert('Terjadi kesalahan saat memproses reservasi.');
  } finally {
    loading.value = false;
  }
};

const uploadAndFinish = async () => {
  if (!selectedProofFile.value || !createdReservation.value) return;
  isUploading.value = true;
  try {
    await reservationService.uploadPaymentProof(createdReservation.value.id, selectedProofFile.value);
  } catch (err) {
    console.error('Upload proof failed', err);
    alert('Gagal mengunggah bukti. Anda bisa upload lagi di halaman status reservasi.');
  } finally {
    isUploading.value = false;
  }
  finishFlow();
};

const skipAndFinish = () => {
  finishFlow();
};

const finishFlow = () => {
  const resId = createdReservation.value?.id;
  showSlide.value = false;
  createdReservation.value = null;
  selectedProofFile.value = null;
  proofPreviewUrl.value = null;
  reservationStore.cancelReservation();
  if (resId) router.push(`/reservation-status?id=${resId}`);
};
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.shadow-up {
  box-shadow: 0 -10px 40px -10px rgba(0,0,0,0.2);
}
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 1rem);
}
</style>
