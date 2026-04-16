<template>
  <div class="bg-[#fafafa] min-h-screen pb-40">
    <!-- Header -->
    <div class="px-6 pt-12 pb-6 bg-white/80 backdrop-blur-xl sticky top-0 z-30 border-b border-gray-100 flex items-center justify-between">
      <div class="flex items-center gap-4">
         <button @click="router.push('/menu')" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all active:scale-90">
            <i class="fa-solid fa-chevron-left"></i>
         </button>
         <div>
            <h1 class="text-xl font-black text-gray-900 leading-none">Riwayat <span class="text-primary">Makan</span></h1>
            <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Daftar pesanan anda di RM Siantar Minang</p>
         </div>
      </div>
      <button @click="fetchOrders" :disabled="loading" class="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center active:scale-95 transition-all">
         <i class="fa-solid fa-rotate" :class="{'animate-spin': loading}"></i>
      </button>
    </div>

    <!-- Content -->
    <div class="px-6 mt-8 max-w-lg mx-auto">
      <div v-if="loading && orders.length === 0" class="flex flex-col items-center justify-center py-32 opacity-30">
         <div class="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
         <p class="text-[10px] font-black text-gray-500 mt-4 uppercase tracking-[0.2em]">Sinkronisasi Data...</p>
      </div>

      <div v-else-if="!loading && orders.length === 0" class="flex flex-col items-center justify-center py-32 text-center animate-fade-in">
         <div class="w-24 h-24 bg-white rounded-[40px] shadow-xl shadow-gray-200/50 flex items-center justify-center text-gray-200 mb-8 overflow-hidden relative border border-gray-50">
             <i class="fa-solid fa-receipt text-6xl"></i>
             <div class="absolute inset-0 bg-primary/5"></div>
         </div>
         <h3 class="font-black text-gray-900 text-lg">Belum Ada Pesanan</h3>
         <p class="text-xs text-gray-400 mt-2 max-w-[220px] leading-relaxed font-medium">Kamu belum memesan hidangan legendaris kami hari ini.</p>
         <router-link to="/menu" class="mt-10 bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all hover:bg-primary">
            Mulai Pesan
         </router-link>
      </div>

      <div v-else class="space-y-6">
        <div 
          v-for="order in orders" 
          :key="order.id"
          @click="viewDetails(order.id)"
          class="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 active:scale-[0.98] transition-all cursor-pointer group hover:border-primary/20 relative overflow-hidden"
        >
          <div class="flex justify-between items-start mb-6 relative z-10">
             <div class="flex items-center gap-3">
                <div class="w-2 h-8 bg-primary rounded-full group-hover:scale-y-125 transition-transform duration-500"></div>
                <div>
                   <p class="text-[9px] font-black text-gray-300 uppercase leading-none tracking-widest">ORDER #{{ order.id.toString() }}</p>
                   <p class="text-[10px] font-bold text-gray-400 mt-1">{{ formatDate(order.createdAt) }}</p>
                </div>
             </div>
             <div class="flex flex-col items-end gap-2">
                <span :class="getStatusClass(order.status)" class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
                   {{ formatStatus(order.status) }}
                </span>
                <span v-if="getPaymentStatus(order)" :class="getPaymentBadgeClass(order)" class="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-current/10">
                   {{ getPaymentStatus(order) }}
                </span>
             </div>
          </div>

          <div class="flex items-center gap-4 relative z-10">
             <div class="flex -space-x-4">
                <div v-for="(item, idx) in order.items.slice(0, 3)" :key="idx" class="w-12 h-12 rounded-2xl border-2 border-white overflow-hidden bg-gray-50 shadow-md transform group-hover:rotate-6 transition-transform">
                   <img 
                     :src="item.menu?.image" 
                     class="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500" 
                   />
                </div>
                <div v-if="order.items.length > 3" class="w-12 h-12 rounded-2xl border-2 border-white bg-gray-900 flex items-center justify-center text-[10px] font-black text-white shadow-md relative z-10">
                   +{{ order.items.length - 3 }}
                </div>
             </div>
             <div class="flex-1">
                <p class="text-xs font-black text-gray-900 truncate tracking-tight">
                   {{ order.items.map(i => i.menu?.name).join(', ') }}
                </p>
                <div class="flex items-center gap-2 mt-1">
                   <span class="text-[8px] font-black text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded uppercase">{{ order.orderType }}</span>
                   <p class="text-[9px] font-bold text-gray-400">&bull; {{ order.items.length }} Item</p>
                </div>
             </div>
          </div>

          <div class="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between relative z-10">
             <div>
                <p class="text-lg font-black text-primary tabular-nums">Rp {{ formatPrice(order.totalPrice) }}</p>
             </div>
             <div class="text-[10px] font-black text-gray-400 group-hover:text-primary transition-colors flex items-center gap-2 uppercase tracking-widest">
                Detail
                <i class="fa-solid fa-arrow-right-long"></i>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const orders = ref([]);
const loading = ref(true);

const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await api.get('/orders');
    orders.value = Array.isArray(response.data) ? response.data : [];
  } catch (e) {
    console.error('Error fetching orders', e);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchOrders);

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price || 0);
const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  }).format(new Date(dateString));
};

const formatStatus = (s) => {
  const map = { PENDING: 'Antre', CONFIRMED: 'Dapur', COOKING: 'Masak', READY: 'Saji', COMPLETED: 'Selesai', CANCELLED: 'Batal' };
  return map[s] || s;
};

const getStatusClass = (s) => {
  if (s === 'PENDING') return 'bg-orange-50 text-orange-600';
  if (s === 'CONFIRMED' || s === 'COOKING') return 'bg-blue-50 text-blue-600';
  if (s === 'READY') return 'bg-emerald-50 text-emerald-600';
  if (s === 'COMPLETED') return 'bg-gray-100 text-gray-500';
  return 'bg-red-50 text-red-600';
};

const getPaymentStatus = (order) => {
  const p = order.payments?.[0];
  if (!p) return null;
  return p.status === 'PAID' ? 'Lunas' : 'Tertunda';
};

const getPaymentBadgeClass = (order) => {
  const p = order.payments?.[0];
  return p?.status === 'PAID' ? 'text-emerald-500' : 'text-red-400';
};

const viewDetails = (id) => router.push(`/order-status?id=${id}`);
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
