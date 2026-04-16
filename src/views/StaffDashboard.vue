<template>
  <div class="bg-gray-900 min-h-screen pb-32">
    <!-- Header -->
    <div class="px-6 pt-12 pb-6 bg-gray-800 sticky top-0 z-30 border-b border-gray-700 flex items-center justify-between">
      <div>
        <h1 class="text-xl font-black text-white leading-none">Staff <span class="text-primary">Dashboard</span></h1>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Kelola Pesanan Masuk</p>
      </div>
      <div class="flex items-center gap-2">
         <button @click="fetchOrders" class="p-2 bg-gray-700 text-gray-300 rounded-xl active:rotate-180 transition-all duration-500">
            <i class="fa-solid fa-rotate"></i>
         </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="px-6 grid grid-cols-2 gap-4 mt-6">
       <div class="bg-gray-800 p-4 rounded-3xl border border-gray-700">
          <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Aktif</p>
          <p class="text-2xl font-black text-white mt-1">{{ activeOrdersCount }}</p>
       </div>
       <div class="bg-gray-800 p-4 rounded-3xl border border-gray-700 text-right">
          <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Hari Ini</p>
          <p class="text-2xl font-black text-primary mt-1">{{ todayOrdersCount }}</p>
       </div>
    </div>

    <!-- Orders Feed -->
    <div class="px-6 mt-8">
      <h3 class="font-black text-xs text-gray-500 uppercase tracking-widest mb-4">Daftar Pesanan</h3>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
         <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-20">
         <p class="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Belum ada pesanan aktif</p>
      </div>

      <div v-else class="space-y-6">
        <div 
          v-for="order in orders" 
          :key="order.id"
          class="bg-gray-800/50 rounded-[32px] p-6 border border-gray-700 transition-all hover:bg-gray-800"
        >
          <!-- Order Header -->
          <div class="flex justify-between items-start mb-4">
             <div>
                <div class="flex items-center gap-2">
                   <span class="text-lg font-black text-white">#{{ order.id.toString() }}</span>
                   <span :class="getTypeClass(order.orderType)" class="px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-tighter">
                      {{ order.orderType }}
                   </span>
                </div>
                <p class="text-[10px] text-gray-500 mt-1 font-bold">
                   {{ order.user?.name || 'Guest' }} • {{ formatDate(order.createdAt) }}
                </p>
             </div>
             <div :class="getStatusClass(order.status)" class="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                {{ formatStatus(order.status) }}
             </div>
          </div>

          <!-- Items -->
          <div class="space-y-3 mb-6">
             <div v-for="item in order.items" :key="item.id" class="flex justify-between items-center bg-gray-900/40 p-3 rounded-2xl border border-gray-700/50">
                <div class="flex items-center gap-3">
                   <div class="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                      <img :src="item.menu?.image" class="w-full h-full object-cover" />
                   </div>
                   <span class="text-xs font-bold text-gray-200">{{ item.menu?.name }}</span>
                </div>
                <span class="text-xs font-black text-primary">x{{ item.qty }}</span>
             </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-2">
             <button 
               v-if="order.status === 'PENDING'"
               @click="updateStatus(order.id, 'CONFIRMED')"
               class="flex-1 bg-blue-600 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
             >
               Konfirmasi
             </button>
             
             <button 
               v-if="order.status === 'CONFIRMED'"
               @click="updateStatus(order.id, 'COOKING')"
               class="flex-1 bg-yellow-600 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
             >
               Mulai Masak
             </button>

             <button 
               v-if="order.status === 'COOKING'"
               @click="updateStatus(order.id, 'READY')"
               class="flex-1 bg-green-600 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
             >
               Siap Saji
             </button>

             <button 
               v-if="order.status === 'READY'"
               @click="updateStatus(order.id, 'COMPLETED')"
               class="flex-1 bg-primary text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
             >
               Selesaikan
             </button>

             <button 
               v-if="['PENDING', 'CONFIRMED'].includes(order.status)"
               @click="updateStatus(order.id, 'CANCELLED')"
               class="bg-red-500/10 text-red-500 px-4 rounded-2xl font-black text-[10px] uppercase transition-all"
             >
               Batal
             </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api';

const orders = ref([]);
const loading = ref(true);

const activeOrdersCount = computed(() => {
  return orders.value.filter(o => !['COMPLETED', 'CANCELLED'].includes(o.status)).length;
});

const todayOrdersCount = computed(() => {
  const today = new Date().toDateString();
  return orders.value.filter(o => new Date(o.createdAt).toDateString() === today).length;
});

const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await api.get('/orders/all');
    orders.value = response.data;
  } catch (e) {
    console.error('Error fetching staff orders', e);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchOrders);

const updateStatus = async (id, status) => {
  try {
    await api.put(`/orders/${id}/status`, { status });
    await fetchOrders();
  } catch (e) {
    console.error('Error updating status', e);
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price);
};

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

const formatStatus = (status) => {
  const statuses = {
    PENDING: 'Baru',
    CONFIRMED: 'Dikonfirmasi',
    COOKING: 'Dimasak',
    READY: 'Siap',
    COMPLETED: 'Selesai',
    CANCELLED: 'Batal'
  };
  return statuses[status] || status;
};

const getStatusClass = (status) => {
  const classes = {
    PENDING: 'bg-orange-500/10 text-orange-500',
    CONFIRMED: 'bg-blue-500/10 text-blue-500',
    COOKING: 'bg-yellow-500/10 text-yellow-500',
    READY: 'bg-green-500/10 text-green-500',
    COMPLETED: 'bg-gray-500/10 text-gray-500',
    CANCELLED: 'bg-red-500/10 text-red-500'
  };
  return classes[status] || 'bg-gray-700 text-gray-400';
};

const getTypeClass = (type) => {
  const classes = {
    DINE_IN: 'bg-primary/20 text-primary',
    TAKEAWAY: 'bg-secondary/20 text-secondary'
  };
  return classes[type] || 'bg-gray-700 text-gray-400';
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
