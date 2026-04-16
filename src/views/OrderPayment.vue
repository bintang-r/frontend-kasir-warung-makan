<template>
  <div class="bg-gray-50 min-h-screen pb-32">
    <!-- Header -->
    <div class="px-6 pt-12 pb-6 bg-white border-b border-gray-100 sticky top-0 z-30 flex items-center gap-4">
      <button @click="router.replace('/')" class="p-2 -ml-2 text-gray-400 hover:text-primary transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <h1 class="text-xl font-black text-gray-900 leading-none">Pembayaran <span class="text-primary">Dunsanak</span></h1>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
       <div class="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
       <p class="mt-4 font-bold text-gray-400 text-sm">Menyiapkan pembayaran...</p>
    </div>

    <div v-else-if="order" class="px-6 mt-8">
      <!-- Info Card -->
      <div class="bg-white rounded-[32px] p-8 border border-gray-100 shadow-premium relative overflow-hidden mb-8">
         <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
         
         <div class="relative z-10">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Bayar</p>
            <h2 class="text-4xl font-black text-gray-900 leading-none">Rp {{ formatPrice(order.totalPrice) }}</h2>
            <div class="mt-4 inline-flex items-center px-3 py-1 bg-primary/10 rounded-lg text-[10px] font-black text-primary uppercase tracking-widest">
               ID: #{{ order.id.toString() }}
            </div>
         </div>
      </div>

      <!-- Instructions based on Method -->
      <div class="space-y-6">
        <h3 class="font-black text-xs text-gray-400 uppercase tracking-widest px-1">Intruksi Pembayaran</h3>
        
        <!-- E-Wallet -->
        <div v-if="method === 'EWALLET'" class="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center">
           <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Scan QRIS Dibawah</p>
           <div class="w-48 h-48 bg-gray-100 rounded-3xl p-4 border-2 border-gray-100 mb-6">
              <!-- Placeholder for QR -->
              <div class="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                   <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                 </svg>
              </div>
           </div>
           <p class="text-[11px] text-gray-500 font-medium px-4">Bisa pakai GoPay, OVO, Dana, atau m-Banking sanak.</p>
        </div>

        <!-- Submit Simulation -->
        <button 
          @click="handlePaymentCompletion"
          :disabled="isProcessing"
          class="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50"
        >
          <span v-if="!isProcessing">Ambo Lah Bayar 👍</span>
          <span v-else class="flex items-center justify-center gap-2">
             <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
             Memverifikasi...
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '../stores/order';

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();

const orderId = route.params.id;
const method = route.query.method || 'TRANSFER';
const order = ref(null);
const loading = ref(true);
const isProcessing = ref(false);

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price || 0);
};

onMounted(async () => {
  try {
    const data = await orderStore.getOrderById(orderId);
    if (!data) {
      router.replace('/');
      return;
    }
    order.value = data;
  } catch (e) {
    console.error(e);
    router.replace('/');
  } finally {
    loading.value = false;
  }
});

const handlePaymentCompletion = async () => {
  isProcessing.value = true;
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Call real backend processPayment
    await orderStore.processPayment(orderId, method, Number(order.value.totalPrice));
    
    router.replace('/order-status?id=' + orderId);
  } catch (e) {
    console.error(e);
    alert('Gagal memverifikasi pembayaran. Cubo baliak nante.');
  } finally {
    isProcessing.value = false;
  }
};

const copyText = (text) => {
  navigator.clipboard.writeText(text);
  alert('Nomor rekening alah disalin!');
};
</script>
