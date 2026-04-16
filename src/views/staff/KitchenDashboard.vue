<template>
  <div class="space-y-8">
    <!-- Header Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-gray-900 p-8 rounded-[32px] text-white shadow-2xl overflow-hidden relative group">
           <div class="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
           <i class="fa-solid fa-list-check absolute -right-4 -bottom-4 text-white/5 text-8xl"></i>
           <p class="text-[10px] font-black uppercase tracking-widest opacity-60 relative z-10">Antrian Masuk</p>
           <h3 class="text-4xl font-black mt-2 relative z-10">{{ ordersByStatus.CONFIRMED.length }}</h3>
        </div>
        <div class="bg-orange-500 p-8 rounded-[32px] text-white shadow-lg overflow-hidden relative group">
           <i class="fa-solid fa-fire-burner absolute -right-4 -bottom-4 text-white/5 text-8xl"></i>
           <p class="text-[10px] font-black uppercase tracking-widest opacity-60 relative z-10">Proses Masak</p>
           <h3 class="text-4xl font-black mt-2 relative z-10">{{ ordersByStatus.COOKING.length }}</h3>
        </div>
        <div class="bg-emerald-500 p-8 rounded-[32px] text-white shadow-lg overflow-hidden relative group">
           <i class="fa-solid fa-utensils absolute -right-4 -bottom-4 text-white/5 text-8xl"></i>
           <p class="text-[10px] font-black uppercase tracking-widest opacity-60 relative z-10">Siap Saji</p>
           <h3 class="text-4xl font-black mt-2 relative z-10">{{ ordersByStatus.READY.length }}</h3>
        </div>
        <div class="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-center">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Waktu Rata-rata</p>
            <p class="text-xl font-black text-gray-900 mt-1">12 <span class="text-xs text-gray-400 font-bold">Menit/Order</span></p>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 1. QUEUE (Confirmed) -->
      <div class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col h-[750px]">
        <div class="flex justify-between items-center mb-8">
           <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <h3 class="text-lg font-black text-gray-900 tracking-tight">Antrian Baru</h3>
           </div>
           <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ ordersByStatus.CONFIRMED.length }} Unit</span>
        </div>

        <div class="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
           <div v-for="order in ordersByStatus.CONFIRMED" :key="order.id" class="bg-blue-50/30 p-6 rounded-[32px] border-2 border-transparent hover:border-blue-100 transition-all flex flex-col gap-5 group">
              <div class="flex justify-between items-start">
                 <div>
                    <p class="text-[9px] font-black text-blue-400 uppercase tracking-widest leading-none">#{{ order.id }} &bull; {{ formatTime(order.createdAt) }}</p>
                    <h4 class="text-xl font-black text-gray-900 mt-2">{{ order.table?.name || 'Area Takeaway' }}</h4>
                 </div>
                 <button 
                   @click="updateStatus(order.id, 'COOKING')"
                   class="bg-blue-600 text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all"
                 >
                   Masak
                 </button>
              </div>
              <div class="space-y-3 bg-white/60 p-4 rounded-2xl">
                 <div v-for="item in order.items" :key="item.id" class="flex justify-between items-center">
                    <p class="text-xs font-bold text-gray-700">
                      <span class="text-blue-600 font-black mr-3 text-sm">{{ item.qty }}x</span> 
                      {{ item.menu?.name }}
                    </p>
                 </div>
              </div>
              <div v-if="order.address" class="text-[10px] font-bold text-gray-400 italic">
                 Catatan: {{ order.address }}
              </div>
           </div>
           <div v-if="ordersByStatus.CONFIRMED.length === 0" class="h-full flex flex-col items-center justify-center text-center opacity-20">
              <i class="fa-solid fa-receipt text-6xl mb-4"></i>
              <p class="text-xs font-black uppercase tracking-widest">Santai sejenak,<br/>antrian sedang kosong</p>
           </div>
        </div>
      </div>

      <!-- 2. PROCESSING (Cooking) -->
      <div class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col h-[750px]">
        <div class="flex justify-between items-center mb-8">
           <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full bg-orange-500 animate-bounce"></div>
              <h3 class="text-lg font-black text-gray-900 tracking-tight">Sedang Dimasak</h3>
           </div>
           <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ ordersByStatus.COOKING.length }} Unit</span>
        </div>

        <div class="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
           <div v-for="order in ordersByStatus.COOKING" :key="order.id" class="bg-orange-50/30 p-6 rounded-[32px] border-2 border-transparent hover:border-orange-100 transition-all flex flex-col gap-5 group">
              <div class="flex justify-between items-start">
                 <div>
                    <p class="text-[9px] font-black text-orange-400 uppercase tracking-widest leading-none">#{{ order.id }} &bull; {{ formatTime(order.createdAt) }}</p>
                    <h4 class="text-xl font-black text-gray-900 mt-2">{{ order.table?.name || 'Area Takeaway' }}</h4>
                 </div>
                 <button 
                   @click="updateStatus(order.id, 'READY')"
                   class="bg-accent text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all"
                 >
                   Siap
                 </button>
              </div>
              <div class="space-y-3 bg-white/60 p-4 rounded-2xl">
                 <div v-for="item in order.items" :key="item.id" class="flex justify-between items-center">
                    <p class="text-xs font-bold text-gray-700">
                      <span class="text-orange-600 font-black mr-3 text-sm">{{ item.qty }}x</span> 
                      {{ item.menu?.name }}
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <!-- 3. READY (Ready) -->
      <div class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col h-[750px]">
        <div class="flex justify-between items-center mb-8">
           <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
              <h3 class="text-lg font-black text-gray-900 tracking-tight">Siap Saji</h3>
           </div>
           <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ ordersByStatus.READY.length }} Unit</span>
        </div>

        <div class="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
           <div v-for="order in ordersByStatus.READY" :key="order.id" class="bg-emerald-50/20 p-6 rounded-[32px] border border-gray-50 flex flex-col gap-4">
              <div class="flex justify-between items-center">
                 <div>
                    <p class="text-[9px] font-black text-emerald-400 uppercase tracking-widest leading-none">#{{ order.id }}</p>
                    <h4 class="text-sm font-black text-gray-900 mt-1">{{ order.table?.name || 'Takeaway' }}</h4>
                 </div>
                 <button 
                   @click="updateStatus(order.id, 'COMPLETED')"
                   class="text-[9px] font-black uppercase text-emerald-600 hover:underline tracking-widest"
                 >
                   Selesaikan
                 </button>
              </div>
              <div class="flex -space-x-2">
                 <div v-for="item in order.items.slice(0,3)" :key="item.id" class="w-8 h-8 rounded-lg border-2 border-white overflow-hidden shadow-sm">
                    <img :src="item.menu?.image" class="w-full h-full object-cover grayscale" />
                 </div>
                 <div v-if="order.items.length > 3" class="w-8 h-8 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400">
                   +{{ order.items.length - 3 }}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>

    <NotificationToast ref="toast" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue';
import api from '../../services/api';
import NotificationToast from '../../components/NotificationToast.vue';

const orders = ref([]);
const toast = ref(null);
let pollInterval = null;

const ordersByStatus = computed(() => {
  const groups = { CONFIRMED: [], COOKING: [], READY: [] };
  orders.value.forEach(order => {
    if (groups[order.status]) groups[order.status].push(order);
  });
  return groups;
});

// Sound notification for new orders
watch(() => ordersByStatus.value.CONFIRMED.length, (newCount, oldCount) => {
  if (newCount > oldCount) {
    playNotificationSound();
    toast.value?.display(`Ada ${newCount - oldCount} pesanan baru masuk! 🥟`, 'info');
  }
});

const fetchOrders = async () => {
  try {
    const res = await api.get('/orders/all');
    orders.value = res.data;
  } catch (err) {
    console.error('Failed to fetch kitchen orders', err);
  }
};

const updateStatus = async (orderId, status) => {
  try {
    await api.put(`/orders/${orderId}/status`, { status });
    toast.value?.display(`Pesanan #${orderId} kini ${status === 'COOKING' ? 'sedang dimasak' : 'siap diantar'}`);
    fetchOrders(); // refresh
  } catch (err) {
    console.error('Status update failed', err);
    toast.value?.display('Gagal memperbarui status', 'error');
  }
};

const playNotificationSound = () => {
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
  audio.volume = 0.5;
  audio.play().catch(e => console.log('Audio play blocked'));
};

const formatTime = (dateStr) => {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateStr));
};

onMounted(() => {
  fetchOrders();
  pollInterval = setInterval(fetchOrders, 10000);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
