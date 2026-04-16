<template>
  <div class="bg-gray-50/30 min-h-screen pb-32 flex flex-col items-center">
    <div class="w-full max-w-md bg-white min-h-screen shadow-premium relative pb-safe-area flex flex-col">
      <!-- Header -->
      <div class="px-6 pt-12 pb-6 flex items-center justify-between bg-white sticky top-0 z-30 border-b border-gray-100">
        <div class="flex items-center gap-4">
          <button @click="router.push('/')" class="p-2 -ml-2 text-gray-400 hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h1 class="text-xl font-black text-gray-900 leading-none">Status <span class="text-primary">Order</span></h1>
        </div>
        <div class="flex flex-col items-end">
           <span class="text-[10px] font-black text-gray-300 uppercase leading-none">ID Pesanan</span>
           <span class="font-bold text-gray-900 text-xs">#{{ orderId || '...' }}</span>
        </div>
      </div>

      <div v-if="isLoading" class="flex flex-col items-center justify-center py-32 flex-1">
         <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
         <p class="text-gray-400 text-sm mt-4 font-bold uppercase tracking-widest">Memuat Status...</p>
      </div>

      <div v-else-if="order" class="px-6 mt-8 flex-1">
        <!-- Status Hero Card -->
        <div class="bg-primary rounded-3xl p-8 text-white relative overflow-hidden shadow-premium">
           <div class="relative z-10">
              <p class="text-xs font-bold uppercase tracking-widest text-white/70">{{ getStatusBadge(order.status) }}</p>
              <h2 class="text-3xl font-black mt-1 leading-tight">{{ getStatusTitle(order.status) }}</h2>
              <p class="text-sm mt-4 text-white/80 font-medium leading-relaxed max-w-xs">{{ getStatusDescription(order.status) }}</p>
           </div>
           
           <div class="absolute -right-6 -bottom-6 opacity-20 pointer-events-none scale-150">
              <svg v-if="['PENDING', 'CONFIRMED', 'COOKING'].includes(order.status)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-48 h-48">
                <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-48 h-48">
                 <path fill-rule="evenodd" d="M19.916 4.351a.75.75 0 01.274 1.023l-10.5 15a.75.75 0 01-1.12.115l-6-6a.75.75 0 111.06-1.06l5.353 5.353 9.91-14.157a.75.75 0 011.023-.274z" clip-rule="evenodd" />
              </svg>
           </div>
        </div>

        <!-- Confirmed Received Button -->
        <div v-if="order.orderType === 'DELIVERY' && order.status !== 'COMPLETED' && !order.isReceived" class="mt-8">
           <button 
             @click="handleReceived" 
             :disabled="isUpdating"
             class="w-full bg-secondary text-white py-4 rounded-2xl font-black text-lg shadow-premium hover:bg-secondary-dark transition-all flex justify-center items-center gap-3 active:scale-95"
           >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12A9 9 0 113 12a9 9 0 0121 12z" />
             </svg>
             <span>{{ isUpdating ? 'Sedang Memproses...' : 'Suda Diterima' }}</span>
           </button>
        </div>

        <!-- Review Section -->
        <div v-if="order.status === 'COMPLETED' && !order.reviews?.length" class="mt-8 animate-down">
           <div class="bg-gray-50 rounded-3xl p-8 border-2 border-primary/10">
              <h3 class="text-xl font-black text-gray-900 text-center">Rancak Bana!</h3>
              <p class="text-sm text-gray-500 text-center mt-2 font-medium">Ba'a rasonyo makan dunsanak? Kasiah ulasan untuak kami.</p>
              
              <!-- Stars -->
              <div class="flex justify-center gap-2 mt-6">
                 <button v-for="i in 5" :key="i" @click="rating = i" class="transition-transform active:scale-125">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="i <= rating ? '#E31E24' : '#E5E7EB'" class="w-10 h-10">
                       <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                    </svg>
                 </button>
              </div>

              <!-- Comment -->
              <textarea 
                v-model="comment" 
                placeholder="Kasiah komentar menarik dunsanak di siko..."
                class="w-full bg-white border-2 border-gray-100 rounded-2xl p-4 text-sm focus:border-primary outline-none transition-all h-24 mt-6 font-medium"
              ></textarea>

              <button 
                @click="submitReview" 
                :disabled="!rating || isUpdating"
                class="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm shadow-premium hover:bg-primary-dark transition-all flex justify-center items-center gap-3 disabled:bg-gray-400 mt-4 active:scale-95"
              >
                <span>{{ isUpdating ? 'Mengirim...' : 'Kirim Ulasan' }}</span>
              </button>
           </div>
        </div>

        <div v-if="order.reviews?.length" class="mt-8 bg-accent/5 rounded-3xl p-6 border border-accent/10 flex items-center gap-4">
           <div class="bg-accent/10 p-3 rounded-2xl text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
              </svg>
           </div>
           <div>
              <p class="font-black text-gray-900 text-sm">Tarimo kasih ulasannyo!</p>
              <p class="text-xs text-gray-500 font-medium">Ulasan dunsanak alah kami tarimo.</p>
           </div>
        </div>

        <!-- Timeline Section -->
        <div class="mt-12">
          <h3 class="font-black text-xs text-gray-400 uppercase tracking-widest mb-8">Lacak Pesanan</h3>
          
          <div class="relative">
            <div v-for="(step, index) in getTimelineSteps()" :key="index" class="relative pl-8 pb-10 last:pb-0">
              <!-- Line -->
              <div v-if="index < getTimelineSteps().length - 1" 
                class="absolute left-[11px] top-6 w-[2px] h-full"
                :class="isStepReached(step.key) ? 'bg-primary' : 'bg-gray-100'"
              ></div>
              
              <!-- Dot -->
              <div class="absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500"
                :class="isStepReached(step.key) ? 'bg-primary shadow-lg shadow-primary/30 ring-4 ring-primary/10' : 'bg-gray-100 ring-4 ring-transparent'">
                <svg v-if="isStepReached(step.key)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3.5" stroke="currentColor" class="w-3 h-3 text-white">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
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
        <div class="mt-12 bg-gray-50 rounded-3xl p-6 border border-gray-100 mb-12">
           <div class="flex justify-between items-center mb-6">
              <h3 class="font-black text-xs text-gray-400 uppercase tracking-widest">Rincian Order</h3>
              <span class="bg-gray-200 text-gray-600 text-[9px] font-black uppercase px-2 py-0.5 rounded-lg">{{ order.orderType }}</span>
           </div>
           
           <div class="space-y-4">
              <div v-for="item in order.items" :key="item.id" class="flex justify-between items-center">
                 <div class="flex gap-3 items-center">
                    <img :src="item.menu?.image" class="w-10 h-10 object-cover rounded-xl" />
                    <div>
                       <p class="font-bold text-gray-900 text-sm leading-none">{{ item.menu?.name }}</p>
                       <p class="text-[10px] text-gray-400 font-bold mt-1">{{ item.qty }} x Rp {{ formatPrice(item.price) }}</p>
                    </div>
                 </div>
                 <p class="font-black text-gray-900 text-sm">Rp {{ formatPrice(Number(item.price) * item.qty) }}</p>
              </div>
           </div>

           <div class="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
              <span class="text-xs font-black text-gray-400 uppercase tracking-widest">Total Harga</span>
              <span class="text-xl font-black text-primary">Rp {{ formatPrice(order.totalPrice) }}</span>
           </div>
        </div>
      </div>
      
      <NotificationToast ref="toast" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '../stores/order';
import NotificationToast from '../components/NotificationToast.vue';
import api from '../services/api';

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();
const toast = ref(null);

const orderId = ref(route.query.id);
const order = ref(null);
const isLoading = ref(true);
const isUpdating = ref(false);

const rating = ref(0);
const comment = ref('');

let refreshInterval = null;

const fetchOrder = async () => {
  if (!orderId.value) return;
  try {
    const data = await orderStore.getOrderById(orderId.value);
    order.value = data;
  } catch (error) {
    console.error('Failed to fetch order:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleReceived = async () => {
  isUpdating.value = true;
  try {
    await orderStore.confirmReceived(orderId.value);
    toast.value?.display('Salamaik manikmati dunsanak!');
    await fetchOrder();
  } catch (err) {
    toast.value?.display('Gagal mengonfirmasi pesanan.', 'error');
  } finally {
    isUpdating.value = false;
  }
};

const submitReview = async () => {
  if (!rating.value) return;
  isUpdating.value = true;
  try {
    await orderStore.submitReview(orderId.value, rating.value, comment.value);
    toast.value?.display('Tarimo kasih atas ulasannyo!');
    await fetchOrder();
  } catch (err) {
    toast.value?.display('Gagal mengirim ulasan.', 'error');
  } finally {
    isUpdating.value = false;
  }
};

const getTimelineSteps = () => {
   if (!order.value) return [];
   
   const commonSteps = [
      { key: 'PENDING', name: 'Pesanan Dibuat', description: 'Menunggu konfirmasi dapur.' },
      { key: 'COOKING', name: 'Sedang Dimasak', description: 'Koki sedang menyiapkan pesanan.' },
   ];

   if (order.value.orderType === 'DELIVERY') {
      return [
         ...commonSteps,
         { key: 'DELIVERING', name: 'Sedang Diantar', description: 'Kurir kami sedang menuju alamat dunsanak.' },
         { key: 'COMPLETED', name: 'Sampai di Tujuan', description: 'Pesanan telah sampai. Selamat makan!' }
      ];
   }

   return [
      ...commonSteps,
      { key: 'READY', name: 'Siap Dihidangkan', description: 'Pesanan sudah siap di meja saji.' },
      { key: 'COMPLETED', name: 'Selesai', description: 'Terima kasih telah berkunjung.' }
   ];
};

const isStepReached = (stepKey) => {
  if (!order.value) return false;
  const statusHierarchy = ['PENDING', 'CONFIRMED', 'COOKING', 'READY', 'DELIVERING', 'COMPLETED'];
  const currentIdx = statusHierarchy.indexOf(order.value.status);
  const stepIdx = statusHierarchy.indexOf(stepKey);
  return stepIdx <= currentIdx;
};

const getStatusBadge = (status) => {
   const badges = {
      PENDING: 'Sedang Antre',
      CONFIRMED: 'Dikonfirmasi',
      COOKING: 'Sedang Dimasak',
      READY: 'Siap Saji',
      DELIVERING: 'Sedang Diantar',
      COMPLETED: 'Selesai'
   };
   return badges[status] || 'Status Pesanan';
};

const getStatusTitle = (status) => {
  switch (status) {
    case 'PENDING': return 'Saba Dulu dunsanak';
    case 'COOKING': return 'Sedang Dimasak';
    case 'READY': return 'Alah Siap! Silakan Santap';
    case 'DELIVERING': return 'Pesanan Sadang Jalan';
    case 'COMPLETED': return 'Kanyang Sanak? Rancak!';
    default: return 'Pesanan Dunsanak';
  }
};

const getStatusDescription = (status) => {
  switch (status) {
    case 'PENDING': return 'Pesanan dunsanak alah masuak antrian dapur.';
    case 'COOKING': return 'Koki kami sadang fokus mamasak rendang favorit sanak.';
    case 'READY': return 'Pesanan alah panuah di meja saji, siap disantap.';
    case 'DELIVERING': return 'Kurir kami sedang meluncur kencang ke tempat dunsanak.';
    case 'COMPLETED': return 'Makan dunsanak alah salasai, tarimo kasih dunsanak.';
    default: return 'Sadang mamproses status tabaru...';
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price);
};

onMounted(() => {
  fetchOrder();
  refreshInterval = setInterval(fetchOrder, 10000);
});

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval);
});
</script>

<style scoped>
.animate-down {
  animation: slideDown 0.4s ease-out;
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
