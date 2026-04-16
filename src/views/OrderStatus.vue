<template>
  <div class="bg-gray-50/30 min-h-screen pb-32 flex flex-col items-center">
    <div class="w-full max-w-md bg-white min-h-screen shadow-premium relative pb-safe-area flex flex-col">
      <!-- Header -->
      <div class="px-6 pt-12 pb-6 flex items-center justify-between bg-white sticky top-0 z-30 border-b border-gray-100">
        <div class="flex items-center gap-4">
          <button @click="router.push('/')" class="p-2 -ml-2 text-gray-400 hover:text-primary transition-colors">
            <i class="fa-solid fa-arrow-left"></i>
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
               <i v-if="order.status === 'COOKING'" class="fa-solid fa-fire-burner text-[160px] animate-cook"></i>
               <i v-else-if="['PENDING', 'CONFIRMED'].includes(order.status)" class="fa-solid fa-clock text-[160px]"></i>
               <i v-else class="fa-solid fa-check-circle text-[160px]"></i>
            </div>
        </div>

        <!-- Review Section -->
        <div v-if="order.status === 'COMPLETED' && !order.reviews?.length" class="mt-8 animate-down">
           <div class="bg-gray-50 rounded-3xl p-8 border-2 border-primary/10">
              <h3 class="text-xl font-black text-gray-900 text-center">Mantap Sekali!</h3>
              <p class="text-sm text-gray-500 text-center mt-2 font-medium">Bagaimana rasa makanannya? Berikan ulasan bagi kami.</p>
              
              <!-- Stars -->
              <div class="flex justify-center gap-2 mt-6">
                 <button v-for="i in 5" :key="i" @click="rating = i" class="transition-transform active:scale-125">
                    <i class="fa-solid fa-star text-4xl" :class="i <= rating ? 'text-primary' : 'text-gray-200'"></i>
                 </button>
              </div>

              <!-- Comment -->
              <textarea 
                v-model="comment" 
                placeholder="Berikan komentar menarik Anda di sini..."
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
              <i class="fa-solid fa-star text-xl"></i>
           </div>
           <div>
              <p class="font-black text-gray-900 text-sm">Terima kasih ulasannya!</p>
              <p class="text-xs text-gray-500 font-medium">Ulasan Anda sudah kami terima.</p>
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
                <i v-if="isStepReached(step.key)" class="fa-solid fa-check text-[10px] text-white"></i>
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
                 <i class="fa-solid fa-bag-shopping text-primary"></i>
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
      </div>
      
      <div v-else class="flex flex-col items-center justify-center py-32 flex-1 px-6 text-center">
          <div class="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-300 mb-6">
             <i class="fa-solid fa-circle-exclamation text-4xl"></i>
          </div>
         <h3 class="text-lg font-black text-gray-900 border-none">Pesanan Tidak Ditemukan</h3>
         <p class="text-sm text-gray-500 mt-2 leading-relaxed">Maaf, pesanan dengan ID ini tidak ditemukan atau Anda tidak memiliki akses.</p>
         <button @click="router.push('/')" class="mt-8 bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
            Kembali ke Home
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
    toast.value?.display('Terima kasih atas ulasannya!');
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
    case 'PENDING': return 'Mohon Tunggu Sebentar';
    case 'COOKING': return 'Sedang Dimasak';
    case 'READY': return 'Sudah Siap! Silakan Santap';
    case 'COMPLETED': return 'Kenyang? Mantap!';
    default: return 'Pesanan Anda';
  }
};

const getStatusDescription = (status) => {
  switch (status) {
    case 'PENDING': return 'Pesanan Anda sudah masuk antrean dapur.';
    case 'COOKING': return 'Koki kami sedang fokus memasak hidangan favorit Anda.';
    case 'READY': return 'Pesanan sudah siap di meja saji, siap disantap.';
    case 'COMPLETED': return 'Makan Anda sudah selesai, terima kasih.';
    default: return 'Sedang memproses status terbaru...';
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
