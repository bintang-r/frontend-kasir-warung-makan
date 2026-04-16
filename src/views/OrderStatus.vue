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
               <div class="flex justify-between items-start">
                  <p class="text-xs font-bold uppercase tracking-widest text-white/70">{{ getStatusBadge(order.status) }}</p>
                  <div :class="isPaid ? 'bg-green-500/30' : 'bg-white/10'" class="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/20 backdrop-blur-sm">
                     {{ isPaid ? 'Lunas ✓' : 'Belum Bayar' }}
                  </div>
               </div>
               <h2 class="text-3xl font-black mt-1 leading-tight">{{ getStatusTitle(order.status) }}</h2>
               <p class="text-sm mt-4 text-white/80 font-medium leading-relaxed max-w-xs">{{ getStatusDescription(order.status) }}</p>
            </div>
           
           <div class="absolute -right-6 -bottom-6 opacity-20 pointer-events-none scale-150 animate-float">
              <svg v-if="order.status === 'COOKING'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-48 h-48 animate-cook">
                 <path d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" />
              </svg>
              <svg v-else-if="['PENDING', 'CONFIRMED'].includes(order.status)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-48 h-48">
                <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-48 h-48">
                 <path fill-rule="evenodd" d="M19.916 4.351a.75.75 0 01.274 1.023l-10.5 15a.75.75 0 01-1.12.115l-6-6a.75.75 0 111.06-1.06l5.353 5.353 9.91-14.157a.75.75 0 011.023-.274z" clip-rule="evenodd" />
              </svg>
           </div>
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
                :class="isStepReached(step.key) ? (order.status === step.key ? 'bg-primary timeline-dot-active' : 'bg-primary shadow-sm') : 'bg-gray-100 ring-4 ring-transparent'">
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
        <div class="mt-12 bg-gray-50/50 rounded-[32px] p-8 border border-gray-100 mb-12 relative overflow-hidden">
           <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>
           
           <div class="flex justify-between items-center mb-8 relative z-10">
              <h3 class="font-black text-xs text-gray-400 uppercase tracking-widest flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-primary">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                 </svg>
                 Rincian Order
              </h3>
              <span class="bg-primary/10 text-primary text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border border-primary/10">{{ order.orderType }}</span>
           </div>
           
           <div class="space-y-6 relative z-10">
              <div v-for="item in order.items" :key="item.id" class="flex justify-between items-center group">
                 <div class="flex gap-4 items-center">
                    <div class="w-12 h-12 rounded-2xl overflow-hidden shadow-sm ring-1 ring-gray-200 group-hover:scale-105 transition-transform duration-300">
                       <img :src="item.menu?.image" class="w-full h-full object-cover" />
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
              <span class="text-xs font-black text-gray-400 uppercase tracking-widest">Total Harga</span>
              <span class="text-2xl font-black text-primary drop-shadow-sm">Rp {{ formatPrice(order.totalPrice) }}</span>
           </div>
        </div>

        <!-- Help Button -->
        <div class="mb-12 text-center">
           <button class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-100 shadow-sm text-[11px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 group">
              <span class="w-2 h-2 rounded-full bg-primary group-hover:animate-ping"></span>
              Butuh Bantuan Staff?
           </button>
        </div>
      </div>
      
      <div v-else class="flex flex-col items-center justify-center py-32 flex-1 px-6 text-center">
         <div class="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-300 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008h-.008v-.008z" />
            </svg>
         </div>
         <h3 class="text-lg font-black text-gray-900 border-none">Pesanan Indak Ditamukan</h3>
         <p class="text-sm text-gray-500 mt-2 leading-relaxed">Maaf dunsanak, pesanan jo ID ko indak ado atau dunsanak indak punyo akses.</p>
         <button @click="router.push('/')" class="mt-8 bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
            Baliak ka Home
         </button>
      </div>

      <NotificationToast ref="toast" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
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

const isPaid = computed(() => {
  return order.value?.payments?.some(p => p.status === 'PAID') || false;
});

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
   
   return [
      { key: 'PENDING', name: 'Pesanan Dibuat', description: 'Menunggu konfirmasi dapur.' },
      { key: 'COOKING', name: 'Sedang Dimasak', description: 'Koki sedang menyiapkan pesanan.' },
      { key: 'READY', name: 'Siap Dihidangkan', description: 'Pesanan sudah siap di meja saji.' },
      { key: 'COMPLETED', name: 'Selesai', description: 'Terima kasih telah berkunjung.' }
   ];
};

const isStepReached = (stepKey) => {
  if (!order.value) return false;
  const statusHierarchy = ['PENDING', 'CONFIRMED', 'COOKING', 'READY', 'COMPLETED'];
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
      COMPLETED: 'Selesai'
   };
   return badges[status] || 'Status Pesanan';
};

const getStatusTitle = (status) => {
  switch (status) {
    case 'PENDING': return 'Saba Dulu dunsanak';
    case 'COOKING': return 'Sedang Dimasak';
    case 'READY': return 'Alah Siap! Silakan Santap';
    case 'COMPLETED': return 'Kanyang Sanak? Rancak!';
    default: return 'Pesanan Dunsanak';
  }
};

const getStatusDescription = (status) => {
  switch (status) {
    case 'PENDING': return 'Pesanan dunsanak alah masuak antrian dapur.';
    case 'COOKING': return 'Koki kami sadang fokus mamasak rendang favorit sanak.';
    case 'READY': return 'Pesanan alah panuah di meja saji, siap disantap.';
    case 'COMPLETED': return 'Makan dunsanak alah salasai, tarimo kasih dunsanak.';
    default: return 'Sadang mamproses status tabaru...';
  }
};

const formatPrice = (price) => {
  if (price === null || price === undefined) return '0';
  return new Intl.NumberFormat('id-ID').format(Number(price));
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
  animation: slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-cook {
  animation: cook 1.5s ease-in-out infinite;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1.5); }
  50% { transform: translate(10px, -10px) scale(1.6); }
}

@keyframes cook {
  0%, 100% { transform: rotate(0deg) translateY(0); }
  25% { transform: rotate(-10deg) translateY(-5px); }
  75% { transform: rotate(10deg) translateY(-2px); }
}

.timeline-dot-active {
  box-shadow: 0 0 0 4px rgba(227, 30, 36, 0.1), 0 0 20px rgba(227, 30, 36, 0.3);
}
</style>
