<template>
  <div class="bg-gray-50/30 min-h-screen pb-32">
    <!-- Header -->
    <div class="px-6 pt-12 pb-6 bg-white sticky top-0 z-30 border-b border-gray-100 flex items-center justify-between">
      <div>
         <h1 class="text-xl font-black text-gray-900 leading-none">Pesanan <span class="text-primary">Saya</span></h1>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Riwayat Makan Anda</p>
      </div>
      <button @click="fetchOrders" :disabled="loading" class="bg-primary/10 p-2 rounded-xl text-primary active:scale-90 transition-all">
         <i class="fa-solid fa-rotate" :class="{'animate-spin': loading}"></i>
      </button>
    </div>

    <!-- Content -->
    <div class="px-6 mt-6">
      <div v-if="loading && orders.length === 0" class="flex flex-col items-center justify-center py-20">
         <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
         <p class="text-xs font-bold text-gray-400 mt-4 uppercase tracking-widest">Mancari Data...</p>
      </div>

      <div v-else-if="!loading && orders.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
         <div class="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-300 mb-6">
             <i class="fa-solid fa-receipt text-6xl text-gray-300 mb-6"></i>
         </div>
         <h3 class="font-black text-gray-900 border-none">Belum ada pesanan</h3>
         <p class="text-xs text-gray-500 mt-2 max-w-[200px] leading-relaxed">Anda belum memesan makanan apa pun. Silakan lihat menu kami dulu.</p>
         <router-link to="/menu" class="mt-8 bg-primary text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-premium active:scale-95 transition-all">
            Lihat Menu
         </router-link>
      </div>

      <div v-else class="space-y-4">
        <div 
          v-for="order in orders" 
          :key="order.id"
          @click="viewDetails(order.id)"
          class="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer group"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-[10px] font-black text-gray-300 uppercase leading-none">ID Pesanan</p>
              <p class="font-black text-gray-900 mt-1">#{{ order.id.toString() }}</p>
            </div>
            <div class="flex flex-col items-end gap-1.5">
              <div :class="getStatusClass(order.status)" class="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                {{ formatStatus(order.status) }}
              </div>
              <!-- Payment status badge -->
              <div v-if="getPaymentStatus(order)" :class="getPaymentBadgeClass(order)" class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                {{ getPaymentStatus(order) }}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
             <div class="flex -space-x-4 overflow-hidden">
                <div v-for="(item, idx) in order.items.slice(0, 3)" :key="idx" class="w-10 h-10 rounded-xl border-2 border-white overflow-hidden bg-gray-50 shadow-sm">
                   <img 
                     :src="item.menu?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=80'" 
                     :alt="item.menu?.name"
                     class="w-full h-full object-cover" 
                   />
                </div>
                <div v-if="order.items.length > 3" class="w-10 h-10 rounded-xl border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400">
                   +{{ order.items.length - 3 }}
                </div>
             </div>
             <div class="flex-1">
                <p class="text-xs font-bold text-gray-900 truncate">
                   {{ order.items.map(i => i.menu?.name).join(', ') }}
                </p>
                <p class="text-[10px] text-gray-400 mt-0.5">{{ formatDate(order.createdAt) }}</p>
             </div>
          </div>

          <div class="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
             <div>
                <p class="text-[9px] font-bold text-gray-400 uppercase">Total Pembayaran</p>
                <p class="text-base font-black text-primary leading-none mt-1">Rp {{ formatPrice(order.totalPrice) }}</p>
             </div>
             <div class="flex items-center gap-2">
               <span class="text-[9px] font-black text-gray-300 uppercase tracking-widest">{{ order.orderType }}</span>
               <div class="text-primary group-hover:translate-x-1 transition-transform">
                  <i class="fa-solid fa-chevron-right text-sm"></i>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue';
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
    orders.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(fetchOrders);
// Re-fetch when navigating back to this page (keep-alive scenarios)
onActivated(fetchOrders);

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price || 0);
};

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

const formatStatus = (status) => {
  const statuses = {
    PENDING: 'Menunggu',
    CONFIRMED: 'Dikonfirmasi',
    COOKING: 'Dimasak',
    READY: 'Siap Saji',
    COMPLETED: 'Selesai',
    CANCELLED: 'Dibatalkan'
  };
  return statuses[status] || status;
};

const getStatusClass = (status) => {
  const classes = {
    PENDING: 'bg-orange-50 text-orange-600',
    CONFIRMED: 'bg-blue-50 text-blue-600',
    COOKING: 'bg-yellow-50 text-yellow-600',
    READY: 'bg-green-50 text-green-600',
    COMPLETED: 'bg-green-50 text-green-600',
    CANCELLED: 'bg-red-50 text-red-600'
  };
  return classes[status] || 'bg-gray-50 text-gray-600';
};

const getPaymentStatus = (order) => {
  if (!order.payments || order.payments.length === 0) return null;
  const payment = order.payments[0];
  if (payment.status === 'PAID') return 'Lunas ✓';
  if (payment.status === 'UNPAID') return 'Belum Dibayar';
  if (payment.status === 'REFUNDED') return 'Refund';
  return null;
};

const getPaymentBadgeClass = (order) => {
  const payment = order.payments?.[0];
  if (!payment) return '';
  if (payment.status === 'PAID') return 'bg-green-50 text-green-600';
  if (payment.status === 'UNPAID') return 'bg-red-50 text-red-500';
  return 'bg-gray-50 text-gray-500';
};

const viewDetails = (id) => {
  router.push(`/order-status?id=${id}`);
};
</script>

<style scoped>
.shadow-premium {
  box-shadow: 0 20px 40px -15px rgba(0,0,0,0.05);
}
</style>
