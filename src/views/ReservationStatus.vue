<template>
  <div class="bg-gray-50/30 min-h-screen pb-32 flex flex-col items-center">
    <div class="w-full max-w-md bg-white min-h-screen shadow-premium relative pb-safe-area flex flex-col">
      <!-- Header -->
      <div class="px-6 pt-12 pb-6 flex items-center justify-between bg-white sticky top-0 z-30 border-b border-gray-100">
        <div class="flex items-center gap-4">
          <button @click="router.push('/')" class="p-2 -ml-2 text-gray-400 hover:text-primary transition-colors">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <h1 class="text-xl font-black text-gray-900 leading-none">Status <span class="text-primary">Reservasi</span></h1>
        </div>
        <div class="flex flex-col items-end">
           <span class="text-[10px] font-black text-gray-300 uppercase leading-none">ID Reservasi</span>
           <span class="font-bold text-gray-900 text-xs">#{{ reservationId || '...' }}</span>
        </div>
      </div>

      <div v-if="isLoading" class="flex flex-col items-center justify-center py-32 flex-1">
         <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
         <p class="text-gray-400 text-sm mt-4 font-bold uppercase tracking-widest">Memuat Status...</p>
      </div>

      <div v-else-if="reservation" class="px-6 mt-8 flex-1">
        <!-- Status Hero Card -->
        <div class="bg-primary rounded-3xl p-8 text-white relative overflow-hidden shadow-premium">
            <div class="relative z-10">
               <div class="flex justify-between items-start">
                  <p class="text-xs font-bold uppercase tracking-widest text-white/70">{{ getStatusBadge(reservation.status) }}</p>
               </div>
               <h2 class="text-3xl font-black mt-1 leading-tight">{{ getStatusTitle(reservation.status) }}</h2>
               <p class="text-sm mt-4 text-white/80 font-medium leading-relaxed max-w-xs">{{ getStatusDescription(reservation.status) }}</p>
            </div>
           
            <div class="absolute -right-6 -bottom-6 opacity-20 pointer-events-none scale-150 animate-float">
               <i v-if="reservation.status === 'PENDING'" class="fa-solid fa-clock text-[160px]"></i>
               <i v-else-if="reservation.status === 'APPROVED'" class="fa-solid fa-check-circle text-[160px]"></i>
               <i v-else-if="reservation.status === 'REJECTED' || reservation.status === 'CANCELLED'" class="fa-solid fa-times-circle text-[160px]"></i>
               <i v-else class="fa-solid fa-utensils text-[160px]"></i>
            </div>
        </div>

        <!-- Timeline Section -->
        <div class="mt-12">
          <h3 class="font-black text-xs text-gray-400 uppercase tracking-widest mb-8">Lacak Reservasi</h3>
          
          <div class="relative">
            <div v-for="(step, index) in getTimelineSteps()" :key="index" class="relative pl-8 pb-10 last:pb-0">
              <!-- Line -->
              <div v-if="index < getTimelineSteps().length - 1" 
                class="absolute left-[11px] top-6 w-[2px] h-full"
                :class="isStepReached(step.key) ? (step.isError ? 'bg-red-500' : 'bg-primary') : 'bg-gray-100'"
              ></div>
              
              <!-- Dot -->
              <div class="absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500"
                :class="isStepReached(step.key) ? (reservation.status === step.key ? (step.isError ? 'bg-red-500 timeline-dot-active-error' : 'bg-primary timeline-dot-active') : (step.isError ? 'bg-red-500 shadow-sm' : 'bg-primary shadow-sm')) : 'bg-gray-100 ring-4 ring-transparent'">
                <i v-if="isStepReached(step.key)" class="fa-solid text-[10px] text-white" :class="step.isError ? 'fa-times' : 'fa-check'"></i>
                <div v-else class="w-2 h-2 rounded-full bg-gray-300"></div>
              </div>
              
              <div :class="isStepReached(step.key) ? 'opacity-100' : 'opacity-40'">
                 <h4 class="font-bold text-sm text-gray-900 leading-none">{{ step.name }}</h4>
                 <p class="text-xs text-gray-500 mt-2 font-medium">{{ step.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="mt-12 bg-gray-50/50 rounded-[32px] p-8 border border-gray-100 mb-12 relative overflow-hidden">
           <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>
           
           <div class="flex justify-between items-center mb-8 relative z-10">
              <h3 class="font-black text-xs text-gray-400 uppercase tracking-widest flex items-center gap-2">
                 <i class="fa-solid fa-chair text-primary"></i>
                 Rincian Reservasi
              </h3>
              <div class="flex items-center gap-2">
                 <span v-if="reservation.table" class="bg-primary text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border border-primary/10 shadow-sm shadow-primary/20">MEJA: {{ reservation.table.name }}</span>
                 <span v-else class="bg-gray-400 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border border-gray-100 shadow-sm shadow-gray-200">TANPA MEJA</span>
              </div>
           </div>
           
           <div class="space-y-4 relative z-10">
              <div class="flex justify-between items-center border-b border-gray-100 pb-4">
                 <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Nama Pemesan</span>
                 <span class="text-sm font-black text-gray-900">{{ reservation.name }}</span>
              </div>
              <div class="flex justify-between items-center border-b border-gray-100 pb-4">
                 <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Tanggal</span>
                 <span class="text-sm font-black text-gray-900">{{ formatDateTime(reservation.date) }}</span>
              </div>
              <div class="flex justify-between items-center border-b border-gray-100 pb-4">
                 <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Tamu</span>
                 <span class="text-sm font-black text-gray-900">{{ reservation.guestCount }} Orang</span>
              </div>
              <div v-if="reservation.notes" class="flex flex-col gap-2 pt-2">
                 <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Catatan Tambahan</span>
                 <p class="text-sm font-medium text-gray-700 bg-white p-4 rounded-xl border border-gray-100">{{ reservation.notes }}</p>
              </div>
           </div>

           <!-- Menu Pre-order jika ada -->
           <div v-if="reservation.order && reservation.order.items?.length" class="mt-8 pt-8 border-t border-dashed border-gray-200 relative z-10">
              <h3 class="font-black text-xs text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                 <i class="fa-solid fa-bag-shopping text-primary"></i>
                 Menu Pre-Order
              </h3>
              
              <div class="space-y-6">
                 <div v-for="item in reservation.order.items" :key="item.id" class="flex justify-between items-center group">
                    <div class="flex gap-4 items-center">
                       <div class="w-12 h-12 rounded-2xl overflow-hidden shadow-sm ring-1 ring-gray-200 group-hover:scale-105 transition-transform duration-300">
                          <img :src="getImageUrl(item.menu?.image)" class="w-full h-full object-cover" />
                       </div>
                       <div>
                          <p class="font-bold text-gray-900 text-sm leading-none mb-1 group-hover:text-primary transition-colors">{{ item.menu?.name }}</p>
                          <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{{ item.qty }} x Rp {{ formatPrice(item.price) }}</p>
                       </div>
                    </div>
                    <p class="font-black text-gray-900 text-sm">Rp {{ formatPrice(Number(item.price) * item.qty) }}</p>
                 </div>
              </div>

              <div class="mt-8 pt-6 border-t border-dashed border-gray-200 flex justify-between items-center relative z-10">
                 <span class="text-xs font-black text-gray-400 uppercase tracking-widest">Total Tagihan Pre-Order</span>
                 <span class="text-2xl font-black text-primary drop-shadow-sm">Rp {{ formatPrice(reservation.order.totalPrice) }}</span>
              </div>
           </div>
        </div>

        <!-- Payment Upload Section -->
        <div v-if="reservation.status === 'PENDING' && reservation.order && reservation.paymentType" class="mt-8 bg-white border border-gray-100 shadow-premium rounded-[32px] p-8 mb-12">
           <h3 class="font-black text-xs text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-6">
              <i class="fa-solid fa-money-bill-transfer text-primary"></i>
              Konfirmasi Pembayaran {{ reservation.paymentType === 'DP' ? 'DP (50%)' : 'Lunas' }}
           </h3>
           
           <div class="space-y-6">
              <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                 <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Jumlah yang Harus Ditransfer</p>
                 <p class="text-2xl font-black text-gray-900">
                   Rp {{ formatPrice(reservation.paymentType === 'DP' ? reservation.order.totalPrice / 2 : reservation.order.totalPrice) }}
                 </p>
              </div>

              <!-- Bank Info -->
              <div class="p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50 text-blue-900">
                 <div class="flex items-center justify-between mb-4">
                    <img src="https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/1200px-BNI_logo.svg.png" class="h-5" />
                    <span class="text-[9px] font-black uppercase tracking-widest opacity-60">Bank BNI</span>
                 </div>
                 <div class="flex justify-between items-center bg-white p-4 rounded-xl border border-blue-100 group cursor-pointer active:scale-95 transition-all" @click="copyText('882910283129')">
                    <div>
                       <p class="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1">Nomor Rekening</p>
                       <p class="text-sm font-black text-gray-900 tracking-wider">8829 1028 3129</p>
                    </div>
                    <i class="fa-solid fa-copy text-gray-400 group-hover:text-primary transition-colors"></i>
                 </div>
                 <p class="text-[9px] font-bold text-gray-500 mt-3 text-center">A/N RM SIANTAR MINANG</p>
              </div>

              <!-- Upload File -->
              <div v-if="!reservation.paymentProof" class="space-y-4">
                 <p class="text-xs font-bold text-gray-500 leading-relaxed">Silakan transfer sesuai nominal di atas, lalu unggah bukti transfer di bawah ini.</p>
                 <div class="relative border-2 border-dashed border-gray-200 hover:border-primary rounded-2xl p-6 transition-colors flex flex-col items-center justify-center cursor-pointer bg-gray-50/50">
                    <input type="file" ref="fileInput" @change="onFileSelected" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                    <i class="fa-solid fa-cloud-arrow-up text-3xl text-gray-300 mb-2"></i>
                    <p class="text-xs font-black text-gray-400 uppercase tracking-widest">{{ selectedFile ? selectedFile.name : 'Pilih Foto Bukti' }}</p>
                    <p class="text-[9px] text-gray-400 mt-1">Format: JPG, PNG (Max 5MB)</p>
                 </div>
                 <button 
                    @click="uploadProof"
                    :disabled="!selectedFile || isUploading"
                    class="w-full bg-primary text-white h-12 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all flex items-center justify-center gap-2"
                 >
                    <span v-if="!isUploading">Unggah Bukti</span>
                    <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 </button>
              </div>

              <!-- Already Uploaded Proof -->
              <div v-else class="space-y-4">
                 <div class="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-3 text-emerald-800">
                    <i class="fa-solid fa-circle-check text-xl mt-0.5"></i>
                    <div>
                       <p class="text-xs font-black uppercase tracking-widest">Bukti Berhasil Diunggah!</p>
                       <p class="text-[10px] font-bold opacity-80 mt-1">Tim kami sedang memverifikasi pembayaran Anda. Status akan diperbarui secara otomatis.</p>
                    </div>
                 </div>
                 <div class="rounded-2xl overflow-hidden border border-gray-100 shadow-sm aspect-video max-h-48 bg-gray-100">
                    <img :src="getImageUrl(reservation.paymentProof)" class="w-full h-full object-cover" />
                 </div>
                 <button 
                    @click="triggerFileReupload"
                    class="w-full bg-gray-150 text-gray-600 hover:bg-gray-200 h-10 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                 >
                    <i class="fa-solid fa-arrow-rotate-left"></i> Unggah Ulang Bukti
                 </button>
                 <!-- Hidden input for reupload -->
                 <input type="file" ref="reuploadInput" @change="onReuploadSelected" class="hidden" accept="image/*" />
              </div>
           </div>
        </div>
      </div>
      
      <div v-else class="flex flex-col items-center justify-center py-32 flex-1 px-6 text-center">
          <div class="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-300 mb-6">
             <i class="fa-solid fa-circle-exclamation text-4xl"></i>
          </div>
         <h3 class="text-lg font-black text-gray-900 border-none">Reservasi Tidak Ditemukan</h3>
         <p class="text-sm text-gray-500 mt-2 leading-relaxed">Maaf, data reservasi dengan ID ini tidak ditemukan atau Anda tidak memiliki akses.</p>
         <button @click="router.push('/')" class="mt-8 bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
            Kembali ke Home
         </button>
      </div>

      <NotificationToast ref="toast" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NotificationToast from '../components/NotificationToast.vue';
import { reservationService } from '../services/reservation.service';
import { getImageUrl } from '../services/api';

const route = useRoute();
const router = useRouter();
const toast = ref(null);

const reservationId = ref(route.query.id);
const reservation = ref(null);
const isLoading = ref(true);

const selectedFile = ref(null);
const isUploading = ref(false);
const fileInput = ref(null);
const reuploadInput = ref(null);

const onFileSelected = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB!');
      return;
    }
    selectedFile.value = file;
  }
};

const uploadProof = async () => {
  if (!selectedFile.value || !reservationId.value) return;
  isUploading.value = true;
  try {
    const res = await reservationService.uploadPaymentProof(reservationId.value, selectedFile.value);
    toast.value?.show('Berhasil!', 'Bukti pembayaran berhasil diunggah.', 'success');
    reservation.value.paymentProof = res.paymentProof;
    selectedFile.value = null;
  } catch (error) {
    console.error('Failed to upload proof:', error);
    toast.value?.show('Gagal', 'Gagal mengunggah bukti pembayaran.', 'error');
  } finally {
    isUploading.value = false;
  }
};

const triggerFileReupload = () => {
  reuploadInput.value?.click();
};

const onReuploadSelected = async (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB!');
      return;
    }
    selectedFile.value = file;
    await uploadProof();
  }
};

const copyText = (text) => {
  navigator.clipboard.writeText(text);
  toast.value?.show('Berhasil Salin', 'Nomor rekening disalin ke papan klip.', 'success');
};

let refreshInterval = null;

const fetchReservation = async () => {
  if (!reservationId.value) return;
  try {
    const data = await reservationService.getReservationById(reservationId.value);
    
    // Check if status changed
    if (reservation.value && reservation.value.status !== data.status && toast.value) {
      toast.value.show(
        'Status Reservasi Berubah!', 
        `Status reservasi Anda kini menjadi: ${getStatusTitle(data.status)}`, 
        'success'
      );
    }
    
    reservation.value = data;
  } catch (error) {
    console.error('Failed to fetch reservation:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchReservation();
  refreshInterval = setInterval(fetchReservation, 10000);
});

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval);
});

const getStatusBadge = (status) => {
  const map = {
    'PENDING': 'Menunggu Konfirmasi',
    'APPROVED': 'Disetujui',
    'COMPLETED': 'Selesai',
    'REJECTED': 'Ditolak',
    'CANCELLED': 'Dibatalkan'
  };
  return map[status] || status;
};

const getStatusTitle = (status) => {
  const map = {
    'PENDING': 'Menunggu Konfirmasi Admin',
    'APPROVED': 'Reservasi Disetujui!',
    'COMPLETED': 'Reservasi Selesai',
    'REJECTED': 'Reservasi Ditolak',
    'CANCELLED': 'Reservasi Dibatalkan'
  };
  return map[status] || status;
};

const getStatusDescription = (status) => {
  const map = {
    'PENDING': 'Kami sedang memeriksa ketersediaan meja. Harap tunggu sebentar.',
    'APPROVED': 'Tempat Anda sudah disiapkan. Silakan datang sesuai jadwal ya!',
    'COMPLETED': 'Terima kasih telah berkunjung ke RM Siantar Minang.',
    'REJECTED': 'Mohon maaf, permintaan reservasi Anda tidak dapat kami penuhi saat ini. Mungkin meja sedang penuh.',
    'CANCELLED': 'Reservasi telah dibatalkan.'
  };
  return map[status] || 'Status tidak diketahui.';
};

// Timeline Logic
const getTimelineSteps = () => {
  if (!reservation.value) return [];
  
  const status = reservation.value.status;
  
  if (status === 'REJECTED' || status === 'CANCELLED') {
    return [
      { key: 'PENDING', name: 'Permintaan Diterima', description: 'Permintaan reservasi Anda sudah kami terima.' },
      { key: status, name: status === 'REJECTED' ? 'Ditolak' : 'Dibatalkan', description: getStatusDescription(status), isError: true }
    ];
  }
  
  return [
    { key: 'PENDING', name: 'Menunggu Konfirmasi', description: 'Admin sedang mengecek ketersediaan meja.' },
    { key: 'APPROVED', name: 'Reservasi Disetujui', description: 'Meja sudah disiapkan untuk Anda.' },
    { key: 'COMPLETED', name: 'Selesai', description: 'Terima kasih atas kedatangannya!' }
  ];
};

const isStepReached = (stepKey) => {
  if (!reservation.value) return false;
  const status = reservation.value.status;
  
  if (status === 'REJECTED' || status === 'CANCELLED') {
    return stepKey === 'PENDING' || stepKey === status;
  }
  
  const orderArray = ['PENDING', 'APPROVED', 'COMPLETED'];
  const currentIndex = orderArray.indexOf(status);
  const stepIndex = orderArray.indexOf(stepKey);
  
  return stepIndex <= currentIndex;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(Number(price));
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' });
};
</script>

<style scoped>
.timeline-dot-active {
  animation: pulse-primary 2s infinite;
}
.timeline-dot-active-error {
  animation: pulse-red 2s infinite;
}

@keyframes pulse-primary {
  0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
  100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
}

@keyframes pulse-red {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

.pb-safe-area {
  padding-bottom: env(safe-area-inset-bottom, 1rem);
}
</style>
