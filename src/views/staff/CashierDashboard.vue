<template>
  <div class="space-y-10">
    <!-- Header Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-gray-900 p-8 rounded-[32px] text-white shadow-2xl overflow-hidden relative group">
           <i class="fa-solid fa-receipt absolute -right-4 -bottom-4 text-white/5 text-8xl"></i>
           <p class="text-[10px] font-black uppercase tracking-widest opacity-60">Tertunda</p>
           <h3 class="text-3xl font-black mt-1">{{ pendingPayments.length }} <span class="text-xs text-gray-500 font-bold">Pesanan</span></h3>
        </div>
        <div class="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-center">
           <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Tunai (Hari Ini)</p>
           <h3 class="text-xl font-black text-gray-900 mt-1">Rp {{ formatPrice(totalCashToday) }}</h3>
        </div>
        <div class="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-center">
           <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total QRIS/Bank (Hari Ini)</p>
           <h3 class="text-xl font-black text-primary mt-1">Rp {{ formatPrice(totalNonCashToday) }}</h3>
        </div>
        <div class="bg-emerald-500 p-8 rounded-[32px] text-white shadow-lg overflow-hidden relative">
           <i class="fa-solid fa-square-check absolute -right-4 -bottom-4 text-white/5 text-8xl"></i>
           <p class="text-[10px] font-black uppercase tracking-widest opacity-60">Lunas</p>
           <h3 class="text-3xl font-black mt-1">{{ paidCountToday }} <span class="text-xs text-emerald-100 font-bold">Total</span></h3>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
       <!-- Pending Verification Table -->
       <div class="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden p-10 flex flex-col min-h-[600px]">
          <div class="flex justify-between items-center mb-10">
             <div>
                <h3 class="text-2xl font-black text-gray-900 tracking-tight">Antrian Pelunasan</h3>
                <p class="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest">Verifikasi pembayaran pelanggan</p>
             </div>
             <button @click="fetchOrders" class="p-3 bg-gray-50 text-gray-400 hover:text-primary rounded-xl transition-all border border-gray-50">
                <i class="fa-solid fa-arrows-rotate" :class="{ 'animate-spin': isRefreshing }"></i>
             </button>
          </div>

          <div class="flex-1 overflow-x-auto overflow-y-auto scrollbar-hide">
             <table class="w-full text-left">
                <thead>
                   <tr class="border-b border-gray-50">
                      <th class="pb-5 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">ID</th>
                      <th class="pb-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pelanggan / Meja</th>
                      <th class="pb-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tagihan</th>
                      <th class="pb-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Metode</th>
                      <th class="pb-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Aksi</th>
                   </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                   <tr v-for="order in pendingPayments" :key="order.id" class="group hover:bg-gray-50/50 transition-all">
                      <td class="py-6 px-4">
                         <span class="font-black text-gray-900 text-sm tabular-nums">#{{ order.id }}</span>
                      </td>
                      <td class="py-6">
                         <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400 uppercase shadow-inner">
                               {{ order.user?.name?.charAt(0) || 'G' }}
                            </div>
                            <div>
                               <p class="text-[11px] font-black text-gray-900 truncate max-w-[120px]">{{ order.user?.name || 'Guest' }}</p>
                               <span class="text-[9px] font-black text-primary uppercase tracking-[0.1em]">{{ order.table?.name || order.orderType }}</span>
                            </div>
                         </div>
                      </td>
                      <td class="py-6 font-black text-gray-900 text-sm italic">Rp {{ formatPrice(order.totalPrice) }}</td>
                      <td class="py-6 text-center">
                         <span class="px-3 py-1 bg-white border border-gray-100 rounded-lg font-black text-[9px] uppercase tracking-widest text-gray-400">
                            {{ order.payments?.find(p => p.status === 'UNPAID')?.method || 'CASH' }}
                         </span>
                      </td>
                      <td class="py-6 text-right px-4">
                         <button 
                            @click="openPaymentModal(order)"
                            class="bg-gray-900 text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-gray-200 active:scale-95 transition-all hover:bg-primary"
                         >
                            VERIFIKASI
                         </button>
                      </td>
                   </tr>
                   <tr v-if="pendingPayments.length === 0">
                      <td colspan="5" class="py-20 text-center opacity-20">
                         <i class="fa-solid fa-mug-hot text-6xl mb-4"></i>
                         <p class="text-[10px] font-black uppercase tracking-[0.2em]">Semua beres, tidak ada antrian pelunasan</p>
                      </td>
                   </tr>
                </tbody>
             </table>
          </div>
       </div>

       <!-- Recent Transactions Sidebar -->
       <div class="bg-gray-50/50 rounded-[40px] border border-gray-100 p-8 flex flex-col h-[600px]">
          <h4 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Baru Saja Lunas</h4>
          <div class="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
             <div v-for="order in recentPaidOrders" :key="order.id" class="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-3 group hover:border-emerald-200 transition-all">
                <div class="flex justify-between items-center">
                   <p class="text-[10px] font-black text-gray-400">#{{ order.id }}</p>
                   <span class="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">PAID</span>
                </div>
                <div class="flex justify-between items-end">
                   <div>
                      <p class="text-xs font-black text-gray-900 truncate w-32">{{ order.user?.name || 'Guest' }}</p>
                      <p class="text-[10px] font-bold text-gray-400">{{ formatTime(order.updatedAt) }} &bull; {{ order.table?.name || 'T.Away' }}</p>
                   </div>
                   <p class="text-xs font-black text-emerald-600 tracking-tighter">Rp {{ formatPrice(order.totalPrice) }}</p>
                </div>
             </div>
             <div v-if="recentPaidOrders.length === 0" class="h-full flex items-center justify-center text-center opacity-10">
                <p class="text-[10px] font-black uppercase tracking-widest">Belum ada history hari ini</p>
             </div>
          </div>
       </div>
    </div>

    <!-- Payment Verification Modal -->
    <div v-if="selectedOrder" class="fixed inset-0 z-[120] flex items-center justify-center p-6 sm:p-0">
       <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="selectedOrder = null"></div>
       <div class="bg-white w-full max-w-md rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-scale-in">
          <div class="p-10">
             <div class="flex justify-between items-start mb-10">
                <div>
                   <h4 class="text-3xl font-black text-gray-900 tracking-tight">Pelunasan Dana</h4>
                   <p class="text-xs font-bold text-primary uppercase tracking-widest mt-1 italic">Audit Billing Order #{{ selectedOrder.id }}</p>
                </div>
                <button @click="selectedOrder = null" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                   <i class="fa-solid fa-xmark"></i>
                </button>
             </div>

             <div class="space-y-6">
                <!-- Bill Summary -->
                <div class="p-8 rounded-[32px] bg-gray-900 text-white shadow-2xl relative overflow-hidden">
                   <div class="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                   <p class="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2 relative z-10">TOTAL TAGIHAN</p>
                   <h3 class="text-4xl font-black tracking-tighter relative z-10">Rp {{ formatPrice(selectedOrder.totalPrice) }}</h3>
                </div>

                <!-- Method Picker -->
                <div class="space-y-4">
                   <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Konfirmasi Metode</p>
                   <div class="grid grid-cols-2 gap-4">
                      <button 
                        v-for="method in ['CASH', 'QRIS', 'TRANSFER', 'EWALLET']" :key="method"
                        @click="paymentMethod = method"
                        :class="paymentMethod === method ? 'border-primary bg-primary/5 text-primary' : 'border-gray-50 bg-gray-50 text-gray-400'"
                        class="p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all font-black text-[9px] uppercase tracking-widest"
                      >
                         <i :class="getMethodIcon(method)" class="text-xl"></i>
                         {{ method }}
                      </button>
                   </div>
                </div>

                <div class="pt-6 border-t border-gray-50 flex flex-col gap-4">
                   <div class="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 text-amber-700">
                      <i class="fa-solid fa-circle-exclamation text-sm mt-0.5"></i>
                      <p class="text-[10px] font-bold leading-relaxed">Harap pastikan uang fisik atau mutasi bank sudah diterima sebelum mengklik tombol verifikasi.</p>
                   </div>
                   <button 
                      @click="processPayment"
                      :disabled="isSubmitting"
                      class="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black shadow-2xl hover:bg-emerald-600 transition-all flex justify-center items-center gap-3 disabled:bg-gray-400 active:scale-95 uppercase tracking-[0.2em] text-xs"
                   >
                      <i v-if="!isSubmitting" class="fa-solid fa-check-double text-emerald-400"></i>
                      <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>{{ isSubmitting ? 'Memverifikasi...' : 'Verifikasi & Tutup Billing' }}</span>
                   </button>
                </div>
             </div>
          </div>
       </div>
    </div>

    <NotificationToast ref="toast" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import api from '../../services/api';
import NotificationToast from '../../components/NotificationToast.vue';

const orders = ref([]);
const isRefreshing = ref(false);
const isSubmitting = ref(false);
const selectedOrder = ref(null);
const paymentMethod = ref('CASH');
const toast = ref(null);
let pollInterval = null;

const pendingPayments = computed(() => {
  return orders.value.filter(o => 
    o.status !== 'CANCELLED' && 
    o.payments.some(p => p.status === 'UNPAID')
  );
});

const recentPaidOrders = computed(() => {
   return orders.value
    .filter(o => 
       o.payments.some(p => p.status === 'PAID') && 
       new Date(o.updatedAt).toDateString() === new Date().toDateString()
    )
    .sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 10);
});

const totalCashToday = computed(() => {
   return orders.value
    .filter(o => o.payments.some(p => p.status === 'PAID' && p.method === 'CASH') && isToday(o.updatedAt))
    .reduce((acc, o) => acc + Number(o.totalPrice), 0);
});

const totalNonCashToday = computed(() => {
   return orders.value
    .filter(o => o.payments.some(p => p.status === 'PAID' && p.method !== 'CASH') && isToday(o.updatedAt))
    .reduce((acc, o) => acc + Number(o.totalPrice), 0);
});

const paidCountToday = computed(() => {
   return orders.value.filter(o => 
      o.payments.some(p => p.status === 'PAID') && isToday(o.updatedAt)
   ).length;
});

const fetchOrders = async () => {
  if (isSubmitting.value) return;
  if (!isRefreshing.value) isRefreshing.value = true;
  try {
    const res = await api.get('/orders/all');
    orders.value = res.data;
  } catch (err) {
    console.error('Failed to fetch orders for cashier', err);
  } finally {
    isRefreshing.value = false;
  }
};

const openPaymentModal = (order) => {
   selectedOrder.value = order;
   const unp = order.payments?.find(p => p.status === 'UNPAID');
   paymentMethod.value = unp?.method || 'CASH';
};

const processPayment = async () => {
   if (!selectedOrder.value) return;
   isSubmitting.value = true;
   try {
      // 1. Process payment via verified status
      await api.post('/payments', {
         orderId: selectedOrder.value.id.toString(),
         method: paymentMethod.value,
         amount: selectedOrder.value.totalPrice
      });
      
      // 2. Refresh local data
      toast.value?.display(`Order #${selectedOrder.value.id} berhasil diverifikasi! 💳`);
      selectedOrder.value = null;
      await fetchOrders();
   } catch (err) {
      console.error('Payment verification failed', err);
      toast.value?.display('Gagal memproses verifikasi', 'error');
   } finally {
      isSubmitting.value = false;
   }
};

const getMethodIcon = (method) => {
  switch (method) {
    case 'CASH': return 'fa-solid fa-money-bill-wave';
    case 'QRIS': return 'fa-solid fa-qrcode';
    case 'TRANSFER': return 'fa-solid fa-building-columns';
    default: return 'fa-solid fa-wallet';
  }
};

const isToday = (dateStr) => new Date(dateStr).toDateString() === new Date().toDateString();
const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price);
const formatTime = (dateStr) => new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date(dateStr));

onMounted(() => {
  fetchOrders();
  pollInterval = setInterval(fetchOrders, 15000);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});
</script>

<style scoped>
.animate-scale-in {
  animation: scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
