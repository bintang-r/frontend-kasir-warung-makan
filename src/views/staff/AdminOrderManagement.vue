<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/40">
       <div>
          <h2 class="text-3xl font-black text-gray-900 tracking-tight">Pantau <span class="text-primary">Pesanan</span></h2>
          <p class="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-[0.2em]">Pusat Kendali Operasional & Audit Transaksi</p>
       </div>
       <div class="flex items-center gap-4 w-full md:w-auto">
          <div class="relative group flex-1 md:flex-none">
             <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors"></i>
             <input 
               v-model="searchQuery"
               type="text" 
               placeholder="Cari ID pesanan..." 
               class="bg-gray-50 border-2 border-transparent focus:border-primary rounded-2xl py-3 pl-12 pr-6 text-sm font-bold focus:bg-white outline-none transition-all w-full md:w-64"
             />
          </div>
          <button @click="fetchOrders" :disabled="loading" class="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 hover:text-primary transition-all active:scale-95 flex items-center justify-center">
             <i class="fa-solid fa-rotate" :class="{'animate-spin': loading}"></i>
          </button>
       </div>
    </div>

    <!-- Filters -->
    <div class="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
       <button 
          v-for="status in statusFilters" :key="status.value"
          class="flex-shrink-0 px-8 py-4 rounded-[20px] border-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all whitespace-nowrap"
          :class="selectedStatus === status.value ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20' : 'border-white bg-white text-gray-400 hover:border-gray-100 shadow-sm'"
          @click="selectedStatus = status.value"
       >
          {{ status.label }}
       </button>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden">
       <div class="overflow-x-auto">
          <table class="w-full text-left">
             <thead>
                <tr class="bg-gray-50/50">
                   <th class="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID Pesanan</th>
                   <th class="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pelanggan / Lokasi</th>
                   <th class="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Waktu</th>
                   <th class="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Bayar</th>
                   <th class="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                   <th class="px-10 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Kontrol</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-gray-50">
                <tr v-for="order in filteredOrders" :key="order.id" class="group hover:bg-gray-50/50 transition-colors">
                   <td class="px-10 py-8">
                      <p class="font-black text-gray-900 tracking-tight text-lg leading-none">#{{ order.id }}</p>
                      <div class="flex items-center gap-2 mt-2">
                         <span class="text-[8px] font-black bg-gray-900 text-white px-2 py-0.5 rounded uppercase tracking-widest">{{ order.orderSource }}</span>
                         <span class="text-[8px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded uppercase tracking-widest">{{ order.orderType }}</span>
                      </div>
                   </td>
                   <td class="px-10 py-8">
                      <p class="font-black text-gray-700 leading-none">{{ order.user?.name || 'Guest User' }}</p>
                      <p v-if="order.table" class="text-[10px] font-black text-primary uppercase mt-1 tracking-widest italic">{{ order.table.name }}</p>
                      <p v-else-if="order.address" class="text-[10px] font-bold text-gray-400 mt-1 truncate max-w-[150px]">{{ order.address }}</p>
                   </td>
                   <td class="px-10 py-8">
                      <p class="text-[10px] font-black text-gray-500 uppercase tracking-tighter">{{ formatDateTime(order.createdAt) }}</p>
                   </td>
                   <td class="px-10 py-8">
                      <p class="font-black text-gray-900 text-lg tabular-nums">Rp {{ formatPrice(order.totalPrice) }}</p>
                      <p class="text-[9px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest">{{ order.items?.length || 0 }} Items</p>
                   </td>
                   <td class="px-10 py-8 text-center">
                      <select 
                         @change="updateStatus(order.id, $event.target.value)"
                         :class="getStatusClass(order.status)"
                         class="px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none border-2 border-transparent transition-all cursor-pointer appearance-none text-center shadow-sm"
                         :value="order.status"
                      >
                         <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
                      </select>
                   </td>
                   <td class="px-10 py-8 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <button @click="viewDetail(order)" class="w-10 h-10 bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all shadow-sm">
                           <i class="fa-solid fa-eye text-sm"></i>
                        </button>
                        <button @click="confirmDelete(order.id)" class="w-10 h-10 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm">
                           <i class="fa-solid fa-trash-can text-sm"></i>
                        </button>
                      </div>
                   </td>
                </tr>
                <tr v-if="!loading && filteredOrders.length === 0">
                   <td colspan="6" class="py-32 text-center">
                      <div class="flex flex-col items-center opacity-20">
                         <i class="fa-solid fa-box-open text-6xl mb-6"></i>
                         <p class="font-black uppercase tracking-[0.3em] text-xs">Belum ada data pesanan</p>
                      </div>
                   </td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>

    <!-- Detail Modal -->
    <teleport to="body">
      <div v-if="selectedOrder" class="fixed inset-0 z-[1200] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-md transition-all duration-500">
         <div class="absolute inset-0" @click="selectedOrder = null"></div>
         <div class="bg-white w-full max-w-4xl rounded-[50px] shadow-2xl relative z-10 overflow-hidden animate-scale-in border border-gray-100">
            <div class="p-16">
               <div class="flex justify-between items-start mb-12">
                  <div>
                     <h3 class="text-4xl font-black text-gray-900 tracking-tight">Pesanan <span class="text-primary">#{{ selectedOrder.id }}</span></h3>
                     <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">Audit Rincian Akuntansi & Operasional</p>
                  </div>
                  <button @click="selectedOrder = null" class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all hover:rotate-90">
                     <i class="fa-solid fa-xmark text-xl"></i>
                  </button>
               </div>

               <div class="grid grid-cols-1 lg:grid-cols-5 gap-16">
                  <!-- Items list -->
                  <div class="lg:col-span-3 space-y-8">
                     <h4 class="text-[10px] font-black text-gray-300 uppercase tracking-widest border-b border-gray-50 pb-4">Manifest Item</h4>
                     <div class="space-y-4 max-h-[400px] overflow-y-auto pr-6 scrollbar-hide">
                        <div v-for="item in selectedOrder.items" :key="item.id" class="flex items-center gap-6 bg-gray-50/50 p-6 rounded-[32px] border border-transparent hover:border-primary/10 transition-all group">
                           <div class="w-20 h-20 rounded-[24px] overflow-hidden shadow-lg transform group-hover:scale-105 transition-transform">
                              <img :src="item.menu?.image" class="w-full h-full object-cover" />
                           </div>
                           <div class="flex-1">
                              <p class="text-lg font-black text-gray-900 leading-tight">{{ item.menu?.name }}</p>
                              <p class="text-xs font-bold text-gray-400 mt-1">Rp {{ formatPrice(item.price) }} <span class="mx-2 text-gray-200">|</span> Qty: {{ item.qty }}</p>
                           </div>
                           <p class="text-xl font-black text-gray-900 tabular-nums text-right">Rp {{ formatPrice(item.price * item.qty) }}</p>
                        </div>
                     </div>
                     <div class="pt-8 flex justify-between items-center px-6">
                        <span class="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Total Revenue</span>
                        <span class="text-4xl font-black text-primary tabular-nums tracking-tighter">Rp {{ formatPrice(selectedOrder.totalPrice) }}</span>
                     </div>
                  </div>

                  <!-- Info Side -->
                  <div class="lg:col-span-2 space-y-10">
                     <div class="space-y-6">
                        <h4 class="text-[10px] font-black text-gray-300 uppercase tracking-widest border-b border-gray-50 pb-4">Distribusi & Logistik</h4>
                        <div class="bg-gray-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                           <div class="absolute -right-8 -top-8 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
                           <div class="relative z-10 space-y-6">
                              <div class="flex justify-between items-center">
                                 <p class="text-white/40 text-[9px] font-black uppercase tracking-widest">Metode Antar</p>
                                 <span class="bg-primary text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase shadow-lg shadow-primary/20">{{ selectedOrder.orderType }}</span>
                              </div>
                              <div v-if="selectedOrder.address" class="space-y-2">
                                 <p class="text-white/40 text-[9px] font-black uppercase tracking-widest">Alamat Tujuan</p>
                                 <p class="text-xs font-bold leading-relaxed">{{ selectedOrder.address }}</p>
                              </div>
                              <div v-if="selectedOrder.table" class="space-y-2">
                                 <p class="text-white/40 text-[9px] font-black uppercase tracking-widest">Nomor Meja</p>
                                 <p class="text-2xl font-black">{{ selectedOrder.table.name }}</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div class="space-y-6">
                        <h4 class="text-[10px] font-black text-gray-300 uppercase tracking-widest border-b border-gray-50 pb-4">Operasional Status</h4>
                        <div class="grid grid-cols-1 gap-4">
                           <div v-for="s in statusOptions" :key="s" 
                              @click="updateStatus(selectedOrder.id, s)"
                              class="p-5 rounded-3xl border-2 flex items-center justify-between cursor-pointer transition-all active:scale-95"
                              :class="selectedOrder.status === s ? 'border-primary bg-primary/5' : 'border-gray-50 bg-gray-50/30 grayscale opacity-60 hover:grayscale-0 hover:opacity-100'"
                           >
                              <p class="text-xs font-black uppercase tracking-widest" :class="selectedOrder.status === s ? 'text-primary' : 'text-gray-400'">{{ s }}</p>
                              <i v-if="selectedOrder.status === s" class="fa-solid fa-circle-check text-primary"></i>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </teleport>

    <!-- Delete Confirmation Modal -->
    <div v-if="isDeleteModalOpen" class="fixed inset-0 z-[1500] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-md">
       <div class="absolute inset-0" @click="isDeleteModalOpen = false"></div>
       <div class="bg-white w-full max-w-md rounded-[32px] shadow-2xl relative z-10 overflow-hidden animate-scale-in p-10 text-center">
          <div class="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
             <i class="fa-solid fa-file-invoice-dollar text-2xl"></i>
          </div>
          <h3 class="text-2xl font-black text-gray-900 tracking-tight mb-2">Hapus Pesanan?</h3>
          <p class="text-sm font-medium text-gray-500 mb-8 leading-relaxed">
             Yakin ingin menghapus permanen pesanan <strong>#{{ orderToDelete }}</strong>? 
             <span class="block mt-2 text-red-400 font-black uppercase text-[10px]">Laporan keuangan akan terpengaruh secara permanen.</span>
          </p>
          <div class="flex gap-4">
             <button @click="isDeleteModalOpen = false" class="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all text-xs uppercase tracking-widest">Batal</button>
             <button @click="executeStoreDelete" class="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl transition-all text-xs uppercase tracking-widest shadow-lg shadow-red-500/30">Ya, Hapus</button>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, inject } from 'vue';
import api from '../../services/api';

const orders = ref([]);
const searchQuery = ref('');
const selectedStatus = ref('ALL');
const selectedOrder = ref(null);
const loading = ref(false);
const isDeleteModalOpen = ref(false);
const orderToDelete = ref(null);

const staffToast = inject('staffToast');

const statusFilters = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Dapur', value: 'CONFIRMED' },
  { label: 'Masak', value: 'COOKING' },
  { label: 'Siap', value: 'READY' },
  { label: 'Selesai', value: 'COMPLETED' },
  { label: 'Batal', value: 'CANCELLED' }
];

const statusOptions = ['PENDING', 'CONFIRMED', 'COOKING', 'READY', 'COMPLETED', 'CANCELLED'];

const filteredOrders = computed(() => {
  let result = orders.value;
  if (!result || !Array.isArray(result)) return [];
  
  if (selectedStatus.value !== 'ALL') {
    result = result.filter(o => o.status === selectedStatus.value);
  }
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(o => o.id.toString().includes(q));
  }
  
  return result;
});

const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await api.get('/orders/all');
    orders.value = response.data;
  } catch (err) {
    console.error('Fetch orders failed', err);
    staffToast.value?.display('Gagal menyinkronkan data pesanan.', 'error');
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (orderId, status) => {
  try {
    await api.put(`/orders/${orderId}/status`, { status });
    
    // Optimistic update for visual UI feedback
    const orderIndex = orders.value.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = status;
    }
    if (selectedOrder.value?.id === orderId) {
      selectedOrder.value.status = status;
    }

    staffToast.value?.display(`Status Pesanan #${orderId} kini: ${status}`, 'success', 'Operasi Berhasil');
  } catch (err) {
    staffToast.value?.display('Gagal memperbarui status operasional.', 'error');
  }
};

const viewDetail = (order) => {
  selectedOrder.value = order;
};

const confirmDelete = (id) => {
  orderToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const executeStoreDelete = async () => {
  const id = orderToDelete.value;
  isDeleteModalOpen.value = false;
  
  try {
    await api.delete(`/orders/${id}`);
    staffToast.value?.display(`Pesanan #${id} telah dihapus selamanya.`, 'info', 'Audit Alert');
    fetchOrders();
  } catch (err) {
    staffToast.value?.display('Gagal menghapus entitas pesanan.', 'error');
  } finally {
    orderToDelete.value = null;
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'CONFIRMED': return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'COOKING': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    case 'READY': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'COMPLETED': return 'bg-gray-50 text-gray-500 border-gray-100';
    case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-100';
    default: return 'bg-gray-50 text-gray-600 border-gray-100';
  }
};

const formatPrice = (p) => new Intl.NumberFormat('id-ID').format(Number(p) || 0);
const formatDateTime = (dateStr) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  }).format(new Date(dateStr));
};

onMounted(fetchOrders);
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
.animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
</style>
