<template>
  <div class="space-y-8">
    <!-- Header Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
       <div class="bg-blue-600 p-8 rounded-[32px] text-white shadow-lg overflow-hidden relative">
          <i class="fa-solid fa-list-check absolute -right-4 -bottom-4 text-white/5 text-8xl"></i>
          <p class="text-[10px] font-black uppercase tracking-widest opacity-60">Pesanan Baru</p>
          <h3 class="text-4xl font-black mt-2">{{ ordersByStatus.CONFIRMED.length }}</h3>
       </div>
       <div class="bg-orange-500 p-8 rounded-[32px] text-white shadow-lg overflow-hidden relative">
          <i class="fa-solid fa-fire-burner absolute -right-4 -bottom-4 text-white/5 text-8xl"></i>
          <p class="text-[10px] font-black uppercase tracking-widest opacity-60">Sedang Dimasak</p>
          <h3 class="text-4xl font-black mt-2">{{ ordersByStatus.COOKING.length }}</h3>
       </div>
       <div class="bg-accent p-8 rounded-[32px] text-white shadow-lg overflow-hidden relative">
          <i class="fa-solid fa-bell-concierge absolute -right-4 -bottom-4 text-white/5 text-8xl"></i>
          <p class="text-[10px] font-black uppercase tracking-widest opacity-60">Siap Saji</p>
          <h3 class="text-4xl font-black mt-2">{{ ordersByStatus.READY.length }}</h3>
       </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Confirmed Queue -->
      <div class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col h-[700px]">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-black text-gray-900 tracking-tight">Antrian Pesanan Baru</h3>
          <span class="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-widest">{{ ordersByStatus.CONFIRMED.length }} Order</span>
        </div>

        <div class="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
          <div v-for="order in ordersByStatus.CONFIRMED" :key="order.id" class="bg-gray-50 p-6 rounded-3xl border border-gray-100 hover:border-blue-200 transition-all flex flex-col gap-4">
             <div class="flex justify-between items-start">
                <div>
                   <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Order #{{ order.id }}</p>
                   <h4 class="text-lg font-black text-gray-900 mt-1">{{ order.table?.name || 'Takeaway' }}</h4>
                </div>
                <button 
                  @click="updateStatus(order.id, 'COOKING')"
                  class="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-200 active:scale-95 transition-all"
                >
                  Mulai Masak
                </button>
             </div>
             <div class="space-y-2">
                <div v-for="item in order.items" :key="item.id" class="flex justify-between items-center">
                   <p class="text-sm font-bold text-gray-700"><span class="text-blue-600 font-black mr-2">{{ item.qty }}x</span> {{ item.menu?.name }}</p>
                </div>
             </div>
          </div>
          <div v-if="ordersByStatus.CONFIRMED.length === 0" class="h-full flex flex-col items-center justify-center text-center opacity-30">
             <i class="fa-solid fa-mug-hot text-6xl mb-4"></i>
             <p class="text-sm font-black uppercase tracking-widest">Belum ada pesanan baru</p>
          </div>
        </div>
      </div>

      <!-- Cooking Queue -->
      <div class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col h-[700px]">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-black text-gray-900 tracking-tight">Sedang Diproses</h3>
          <span class="bg-orange-50 text-orange-600 px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-widest">{{ ordersByStatus.COOKING.length }} Cooking</span>
        </div>

        <div class="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
          <div v-for="order in ordersByStatus.COOKING" :key="order.id" class="bg-orange-50/50 p-6 rounded-3xl border border-orange-100 hover:border-orange-200 transition-all flex flex-col gap-4">
             <div class="flex justify-between items-start">
                <div>
                   <p class="text-[10px] font-black text-orange-400 uppercase tracking-widest leading-none">Order #{{ order.id }}</p>
                   <h4 class="text-lg font-black text-gray-900 mt-1">{{ order.table?.name || 'Takeaway' }}</h4>
                </div>
                <button 
                  @click="updateStatus(order.id, 'READY')"
                  class="bg-accent text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-accent/20 active:scale-95 transition-all"
                >
                  Siap Saji
                </button>
             </div>
             <div class="space-y-2">
                <div v-for="item in order.items" :key="item.id" class="flex justify-between items-center">
                   <p class="text-sm font-bold text-gray-700 text-orange-950/80"><span class="text-orange-600 font-black mr-2">{{ item.qty }}x</span> {{ item.menu?.name }}</p>
                </div>
             </div>
          </div>
          <div v-if="ordersByStatus.COOKING.length === 0" class="h-full flex flex-col items-center justify-center text-center opacity-30">
             <i class="fa-solid fa-fire text-6xl mb-4"></i>
             <p class="text-sm font-black uppercase tracking-widest">Belum ada yang dimasak</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import api from '../../services/api';

const orders = ref([]);
let pollInterval = null;

const ordersByStatus = computed(() => {
  const groups = { CONFIRMED: [], COOKING: [], READY: [] };
  orders.value.forEach(order => {
    if (groups[order.status]) groups[order.status].push(order);
  });
  return groups;
});

const fetchOrders = async () => {
  try {
    const res = await api.get('/orders/all'); // Need all orders for staff
    orders.value = res.data;
  } catch (err) {
    console.error('Failed to fetch kitchen orders', err);
  }
};

const updateStatus = async (orderId, status) => {
  try {
    await api.put(`/orders/${orderId}/status`, { status });
    fetchOrders(); // refresh
  } catch (err) {
    console.error('Status update failed', err);
  }
};

onMounted(() => {
  fetchOrders();
  // Poll every 10s for real-time feel without full socket setup yet
  pollInterval = setInterval(fetchOrders, 10000);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
