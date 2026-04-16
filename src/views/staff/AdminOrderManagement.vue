<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex justify-between items-center bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
       <div>
          <h2 class="text-2xl font-black text-gray-900 tracking-tight">Pantau Pesanan</h2>
          <p class="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest">Manajemen status dan audit seluruh transaksi</p>
       </div>
       <div class="flex gap-4">
          <div class="relative group">
             <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"></i>
             <input 
               v-model="searchQuery"
               type="text" 
               placeholder="Cari ID pesanan..." 
               class="bg-gray-50 border-2 border-gray-50 rounded-2xl py-3 pl-12 pr-6 text-xs font-bold focus:bg-white focus:border-primary outline-none transition-all w-64 shadow-inner"
             />
          </div>
       </div>
    </div>

    <!-- Filters -->
    <div class="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
       <button 
          v-for="status in statusFilters" :key="status.value"
          class="flex-shrink-0 px-6 py-3 rounded-2xl border-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all"
          :class="selectedStatus === status.value ? 'border-primary bg-primary/5 text-primary' : 'border-white bg-white text-gray-400 hover:border-gray-100'"
          @click="selectedStatus = status.value"
       >
          {{ status.label }}
       </button>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden p-10">
       <div class="overflow-x-auto text-sm">
          <table class="w-full text-left">
             <thead>
                <tr class="border-b border-gray-50">
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID Pesanan</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pelanggan / Meja</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Waktu</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Tipe</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                   <th class="pb-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Aksi</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-gray-50">
                <tr v-for="order in filteredOrders" :key="order.id" class="group hover:bg-gray-50/50 transition-colors">
                   <td class="py-6">
                      <p class="font-black text-gray-900 tracking-tight">#{{ order.id }}</p>
                      <span class="text-[9px] font-black bg-gray-100 text-gray-400 px-2 py-0.5 rounded-md uppercase tracking-widest">{{ order.orderSource }}</span>
                   </td>
                   <td class="py-6">
                      <p class="font-bold text-gray-700">{{ order.user?.name || 'Guest' }}</p>
                      <p v-if="order.table" class="text-[10px] font-bold text-primary italic">{{ order.table.name }}</p>
                      <p v-else-if="order.address" class="text-[10px] font-bold text-gray-400 truncate max-w-[150px]">{{ order.address }}</p>
                   </td>
                   <td class="py-6">
                      <p class="text-xs font-medium text-gray-600">{{ formatDateTime(order.createdAt) }}</p>
                   </td>
                   <td class="py-6 text-center">
                      <span class="text-[10px] font-black uppercase tracking-widest text-gray-500">{{ order.orderType }}</span>
                   </td>
                   <td class="py-6 font-black text-gray-900">Rp {{ formatPrice(order.totalPrice) }}</td>
                   <td class="py-6 text-center">
                      <select 
                         @change="updateStatus(order.id, $event.target.value)"
                         :class="getStatusClass(order.status)"
                         class="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest outline-none border-none cursor-pointer appearance-none text-center"
                         :value="order.status"
                      >
                         <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
                      </select>
                   </td>
                   <td class="py-6 text-right space-x-2">
                       <button @click="viewDetail(order)" class="p-2.5 bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                          <i class="fa-solid fa-eye"></i>
                       </button>
                       <button @click="confirmDelete(order.id)" class="p-2.5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                          <i class="fa-solid fa-trash-can"></i>
                       </button>
                   </td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="selectedOrder" class="fixed inset-0 z-[120] flex items-center justify-center p-6">
       <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm shadow-2xl" @click="selectedOrder = null"></div>
       <div class="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-scale-in">
          <div class="p-12">
             <div class="flex justify-between items-start mb-10">
                <div>
                   <h3 class="text-3xl font-black text-gray-900 tracking-tight">Detail Pesanan #{{ selectedOrder.id }}</h3>
                   <p class="text-xs font-bold text-primary uppercase tracking-widest mt-1">Audit rincian item dan pembayaran</p>
                </div>
                <button @click="selectedOrder = null" class="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                   <i class="fa-solid fa-xmark"></i>
                </button>
             </div>

             <div class="grid grid-cols-2 gap-10">
                <!-- Items list -->
                <div class="space-y-6">
                   <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Item Pesanan</h4>
                   <div class="space-y-4 max-h-[300px] overflow-y-auto pr-4 scrollbar-hide">
                      <div v-for="item in selectedOrder.items" :key="item.id" class="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                         <img :src="item.menu?.image" class="w-12 h-12 rounded-xl object-cover" />
                         <div class="flex-1">
                            <p class="text-xs font-black text-gray-900">{{ item.menu?.name }}</p>
                            <p class="text-[10px] font-bold text-gray-400">Rp {{ formatPrice(item.price) }} x {{ item.qty }}</p>
                         </div>
                         <p class="text-xs font-black text-gray-900">Rp {{ formatPrice(item.price * item.qty) }}</p>
                      </div>
                   </div>
                   <div class="pt-4 border-t border-gray-100 flex justify-between items-baseline">
                      <span class="text-[10px] font-black text-gray-400 uppercase">Subtotal</span>
                      <span class="text-xl font-black text-gray-900">Rp {{ formatPrice(selectedOrder.totalPrice) }}</span>
                   </div>
                </div>

                <!-- Info Side -->
                <div class="space-y-8">
                   <div class="space-y-4">
                      <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Informasi Pengiriman</h4>
                      <div class="bg-gray-50 p-6 rounded-3xl space-y-3">
                         <p class="text-xs font-bold text-gray-700 flex justify-between">
                            <span class="text-gray-400">Metode:</span>
                            {{ selectedOrder.orderType }}
                         </p>
                         <p v-if="selectedOrder.address" class="text-xs font-bold text-gray-700 flex flex-col gap-1">
                            <span class="text-gray-400">Alamat:</span>
                            <span class="text-[10px] border-l-2 border-primary pl-2 italic">{{ selectedOrder.address }}</span>
                         </p>
                      </div>
                   </div>

                   <div class="space-y-4">
                      <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Log Status</h4>
                      <div class="flex items-center gap-4 p-4 rounded-2xl border-2" :class="getStatusClass(selectedOrder.status, true)">
                         <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs">
                            <i class="fa-solid fa-clock-rotate-left"></i>
                         </div>
                         <p class="text-[10px] font-black uppercase tracking-widest">{{ selectedOrder.status }}</p>
                      </div>
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
import { ref, onMounted, computed } from 'vue';
import api from '../../services/api';
import NotificationToast from '../../components/NotificationToast.vue';

const orders = ref([]);
const searchQuery = ref('');
const selectedStatus = ref('ALL');
const selectedOrder = ref(null);
const toast = ref(null);

const statusFilters = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Dimasak', value: 'COOKING' },
  { label: 'Siap', value: 'READY' },
  { label: 'Selesai', value: 'COMPLETED' },
  { label: 'Batal', value: 'CANCELLED' }
];

const statusOptions = ['PENDING', 'CONFIRMED', 'COOKING', 'READY', 'COMPLETED', 'CANCELLED'];

const filteredOrders = computed(() => {
  let result = orders.value;
  
  if (selectedStatus.value !== 'ALL') {
    result = result.filter(o => o.status === selectedStatus.value);
  }
  
  if (searchQuery.value) {
    result = result.filter(o => o.id.toString().includes(searchQuery.value));
  }
  
  return result;
});

const fetchOrders = async () => {
  try {
    const response = await api.get('/orders/all');
    orders.value = response.data;
  } catch (err) {
    console.error('Fetch orders failed', err);
  }
};

const updateStatus = async (orderId, status) => {
  try {
    await api.put(`/orders/${orderId}/status`, { status });
    toast.value?.display(`Status pesanan #${orderId} diperbarui ke ${status}`);
    fetchOrders();
    if (selectedOrder.value?.id === orderId) {
      selectedOrder.value.status = status;
    }
  } catch (err) {
    toast.value?.display('Gagal memperbarui status', 'error');
  }
};

const viewDetail = (order) => {
  selectedOrder.value = order;
};

const confirmDelete = async (id) => {
  if (!confirm('Hapus log pesanan ini secara permanen? Catatan keuangan terkait juga akan dihapus.')) return;
  try {
    await api.delete(`/orders/${id}`);
    toast.value?.display('Pesanan dihapus secara permanen');
    fetchOrders();
  } catch (err) {
    toast.value?.display('Gagal menghapus pesanan', 'error');
  }
};

const getStatusClass = (status, isBorder = false) => {
  const base = isBorder ? 'border-' : 'bg-';
  switch (status) {
    case 'PENDING': return `${base}amber-100 text-amber-600`;
    case 'CONFIRMED': return `${base}blue-100 text-blue-600`;
    case 'COOKING': return `${base}indigo-100 text-indigo-600`;
    case 'READY': return `${base}emerald-100 text-emerald-600`;
    case 'COMPLETED': return `${base}gray-100 text-gray-600`;
    case 'CANCELLED': return `${base}red-100 text-red-600`;
    default: return `${base}gray-100 text-gray-600`;
  }
};

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price);
const formatDateTime = (dateStr) => {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(dateStr));
};

onMounted(fetchOrders);
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.animate-scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
