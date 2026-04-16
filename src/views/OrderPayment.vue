<template>
  <div class="bg-[#fafafa] min-h-screen pb-40">
    <!-- Header -->
    <div class="px-6 pt-12 pb-6 flex items-center gap-4 bg-white/80 backdrop-blur-xl sticky top-0 z-30 border-b border-gray-100">
      <button @click="router.replace('/menu')" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all active:scale-90">
         <i class="fa-solid fa-chevron-left"></i>
      </button>
      <div>
         <h1 class="text-xl font-black text-gray-900 leading-none">Verifikasi <span class="text-primary">Bayar</span></h1>
         <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Selesaikan instruksi dibawah ini</p>
      </div>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-32">
        <div class="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p class="mt-6 font-black text-gray-300 text-[10px] uppercase tracking-widest">Sinkronisasi Data...</p>
    </div>

    <div v-else-if="order" class="px-6 mt-8 max-w-lg mx-auto">
      <!-- Amount Card -->
      <div class="bg-gray-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden mb-10">
         <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
         <p class="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-3">Total Tagihan Pesanan</p>
         <div class="flex items-baseline gap-2">
            <span class="text-4xl font-black tracking-tighter">Rp {{ formatPrice(order.totalPrice) }}</span>
         </div>
         <div class="mt-8 flex items-center gap-3">
            <div class="px-3 py-1.5 bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10">Order #{{ order.id }}</div>
            <div class="px-3 py-1.5 bg-primary rounded-xl text-[9px] font-black uppercase tracking-widest">{{ method }}</div>
         </div>
      </div>

      <!-- Instructions Section -->
      <div class="space-y-6">
        <h3 class="font-black text-[10px] text-gray-400 uppercase tracking-[0.2em] px-2 mb-4">Instruksi Pembayaran</h3>

        <!-- QRIS Logic -->
        <div v-if="method === 'QRIS' || method === 'EWALLET'" class="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col items-center text-center">
           <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" class="h-8 mb-8" />
           <div class="w-full aspect-square max-w-[240px] bg-white rounded-3xl p-4 border-2 border-gray-50 mb-8 shadow-inner relative group">
              <div class="absolute inset-0 bg-gray-900/5 group-hover:bg-transparent transition-colors rounded-3xl flex items-center justify-center">
                 <i class="fa-solid fa-expand text-gray-400/20 text-4xl group-hover:hidden"></i>
              </div>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=RM_SIANTAR_MINANG_QR_SIMULATION" class="w-full h-full object-contain" />
           </div>
           <p class="text-xs font-bold text-gray-600 px-4 leading-relaxed tracking-tight">Scan kode di atas menggunakan GoPay, OVO, Dana, LinkAja atau m-Banking Anda.</p>
        </div>

        <!-- Bank Transfer Logic -->
        <div v-if="method === 'TRANSFER'" class="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-gray-200/50 space-y-8">
           <div class="flex items-center justify-between">
              <img src="https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/1200px-BNI_logo.svg.png" class="h-6" />
              <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Bank BNI</span>
           </div>
           <div class="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex justify-between items-center group active:scale-[0.98] transition-all" @click="copyText('88291028312931')">
              <div>
                 <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Nomor Rekening</p>
                 <p class="text-lg font-black text-gray-900 tracking-widest">8829 1028 3129</p>
              </div>
              <div class="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                 <i class="fa-solid fa-copy"></i>
              </div>
           </div>
           <div class="space-y-2 px-2">
              <p class="text-[10px] font-black text-gray-900 flex justify-between uppercase tracking-widest">
                 <span>Nama Penerima:</span>
                 <span class="text-primary truncate ml-4">RM SIANTAR MINANG</span>
              </p>
           </div>
        </div>

        <!-- Important Note -->
        <div class="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4 text-amber-700">
           <i class="fa-solid fa-money-bill-transfer text-xl mt-1"></i>
           <p class="text-[11px] font-bold leading-relaxed">Setelah melakukan pembayaran, mohon klik tombol "Konfirmasi Pembayaran" di bawah ini. Tim kami akan segera memverifikasi pesanan Anda.</p>
        </div>
      </div>
    </div>

    <!-- Final Action -->
    <div v-if="order" class="fixed bottom-0 left-0 right-0 p-8 pt-4 bg-gradient-to-t from-white via-white/90 to-transparent z-[110]">
       <div class="max-w-md mx-auto">
          <button 
             @click="handlePaymentCompletion"
             :disabled="isProcessing"
             class="w-full bg-primary text-white h-16 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 hover:bg-gray-900"
          >
             <span v-if="!isProcessing">Kirim Bukti & Konfirmasi</span>
             <div v-else class="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
          </button>
       </div>
    </div>

    <NotificationToast ref="toast" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '../stores/order';
import NotificationToast from '../components/NotificationToast.vue';

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();

const toast = ref(null);
const orderId = route.params.id;
const method = route.query.method || 'TRANSFER';
const order = ref(null);
const loading = ref(true);
const isProcessing = ref(false);

const fetchData = async () => {
   try {
      const data = await orderStore.getOrderById(orderId);
      if (!data) {
         router.replace('/');
         return;
      }
      order.value = data;
   } catch (e) {
      router.replace('/');
   } finally {
      loading.value = false;
   }
};

const handlePaymentCompletion = async () => {
   isProcessing.value = true;
   try {
      // Small simulated delay for verification feel
      await new Promise(r => setTimeout(r, 2000));
      
      await orderStore.processPayment(orderId, method, Number(order.value.totalPrice));
      
      toast.value?.display('Konfirmasi terkirim! Menuju halaman status...');
      setTimeout(() => {
         router.replace('/order-status?id=' + orderId);
      }, 1500);
   } catch (err) {
      toast.value?.display('Gagal mengirim konfirmasi', 'error');
   } finally {
      isProcessing.value = false;
   }
};

const copyText = (text) => {
   navigator.clipboard.writeText(text);
   toast.value?.display('Nomor rekening berhasil disalin! 📋');
};

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price || 0);

onMounted(fetchData);
</script>
