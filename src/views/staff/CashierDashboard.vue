<template>
  <div class="space-y-10">
    <!-- Payment Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       <div class="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
          <div class="bg-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center text-accent">
             <i class="fa-solid fa-hourglass-half text-2xl"></i>
          </div>
          <div>
             <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Menunggu Bayar</p>
             <h3 class="text-3xl font-black text-gray-900 leading-none mt-1">{{ pendingPayments.length }}</h3>
          </div>
       </div>
       <div class="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
          <div class="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center text-green-600">
             <i class="fa-solid fa-money-bill-wave text-2xl"></i>
          </div>
          <div>
             <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lunas Hari Ini</p>
             <h3 class="text-3xl font-black text-gray-900 leading-none mt-1">{{ paidCountToday }}</h3>
          </div>
       </div>
    </div>

    <!-- Main Table -->
    <div class="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden p-10">
       <div class="flex justify-between items-center mb-10">
          <div>
            <h3 class="text-2xl font-black text-gray-900 tracking-tight">Verifikasi Pembayaran</h3>
            <p class="text-xs font-medium text-gray-400 mt-1">Daftar pesanan yang belum menyelesaikan pembayaran</p>
          </div>
          <button @click="fetchOrders" class="p-3 bg-gray-50 text-gray-400 hover:text-primary rounded-xl transition-all border border-gray-100">
             <i class="fa-solid fa-arrows-rotate" :class="{ 'animate-spin': isRefreshing }"></i>
          </button>
       </div>

       <div class="overflow-x-auto">
          <table class="w-full text-left">
             <thead>
                <tr class="border-b border-gray-50">
                   <th class="pb-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID Pesanan</th>
                   <th class="pb-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pelanggan / Meja</th>
                   <th class="pb-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Tagihan</th>
                   <th class="pb-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Metode</th>
                   <th class="pb-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Aksi</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-gray-50">
                <tr v-for="order in pendingPayments" :key="order.id" class="group hover:bg-gray-50/50 transition-colors">
                   <td class="py-6 font-black text-gray-900 text-sm">#{{ order.id }}</td>
                   <td class="py-6">
                      <p class="text-sm font-bold text-gray-700 leading-none mb-1">{{ order.user?.name || 'Guest' }}</p>
                      <p class="text-[9px] font-black text-primary uppercase tracking-widest">{{ order.table?.name || 'Takeaway' }}</p>
                   </td>
                   <td class="py-6 font-black text-gray-900 text-sm">Rp {{ formatPrice(order.totalPrice) }}</td>
                   <td class="py-6">
                      <span class="px-3 py-1 bg-gray-100 rounded-lg font-black text-[9px] uppercase tracking-widest text-gray-500">
                         {{ order.payments[0]?.method || 'UNSET' }}
                      </span>
                   </td>
                   <td class="py-6 text-right">
                      <button 
                         @click="openPaymentModal(order)"
                         class="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-gray-200 active:scale-95 transition-all hover:bg-primary"
                      >
                         Proses Bayar
                      </button>
                   </td>
                </tr>
                <tr v-if="pendingPayments.length === 0">
                   <td colspan="5" class="py-20 text-center opacity-20">
                      <i class="fa-solid fa-mug-hot text-6xl mb-4"></i>
                      <p class="text-sm font-black uppercase tracking-widest">Semua pembayaran sudah beres!</p>
                   </td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>

    <!-- Payment Modal Component -->
    <div v-if="selectedOrder" class="fixed inset-0 z-[120] flex items-center justify-center p-6 sm:p-0">
       <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="selectedOrder = null"></div>
       <div class="bg-white w-full max-w-md rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-scale-in">
          <div class="p-10">
             <div class="flex justify-between items-start mb-8">
                <div>
                   <h4 class="text-2xl font-black text-gray-900 tracking-tight">Proses Pelunasan</h4>
                   <p class="text-xs font-bold text-primary uppercase tracking-widest mt-1">Order #{{ selectedOrder.id }}</p>
                </div>
                <button @click="selectedOrder = null" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                   <i class="fa-solid fa-xmark"></i>
                </button>
             </div>

             <div class="space-y-6">
                <div class="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex justify-between items-center">
                   <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Tagihan</span>
                   <span class="text-2xl font-black text-gray-900 tracking-tighter">Rp {{ formatPrice(selectedOrder.totalPrice) }}</span>
                </div>

                <div class="space-y-4">
                   <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pilih Metode Pembayaran</p>
                   <div class="grid grid-cols-2 gap-4">
                      <button 
                        @click="paymentMethod = 'CASH'"
                        :class="paymentMethod === 'CASH' ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white'"
                        class="p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all group"
                      >
                         <i class="fa-solid fa-money-bill-wave text-xl" :class="paymentMethod === 'CASH' ? 'text-primary' : 'text-gray-300'"></i>
                         <span class="text-[10px] font-black uppercase tracking-widest" :class="paymentMethod === 'CASH' ? 'text-primary' : 'text-gray-400'">Tunai</span>
                      </button>
                      <button 
                        @click="paymentMethod = 'EWALLET'"
                        :class="paymentMethod === 'EWALLET' ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white'"
                        class="p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all group"
                      >
                         <i class="fa-solid fa-wallet text-xl" :class="paymentMethod === 'EWALLET' ? 'text-primary' : 'text-gray-300'"></i>
                         <span class="text-[10px] font-black uppercase tracking-widest" :class="paymentMethod === 'EWALLET' ? 'text-primary' : 'text-gray-400'">E-Wallet</span>
                      </button>
                   </div>
                </div>

                <div class="pt-6 border-t border-gray-50">
                   <button 
                      @click="processPayment"
                      :disabled="isSubmitting"
                      class="w-full bg-primary text-white py-5 rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all flex justify-center items-center gap-3 disabled:bg-gray-400 active:scale-95"
                   >
                      <div v-if="isSubmitting" class="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{{ isSubmitting ? 'Memproses...' : '💰 Selesaikan Pembayaran' }}</span>
                   </button>
                </div>
             </div>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../../services/api';

const orders = ref([]);
const isRefreshing = ref(false);
const isSubmitting = ref(false);
const selectedOrder = ref(null);
const paymentMethod = ref('CASH');

const pendingPayments = computed(() => {
  return orders.value.filter(o => 
    o.payments.some(p => p.status === 'UNPAID')
  );
});

const paidCountToday = computed(() => {
   return orders.value.filter(o => 
      o.payments.some(p => p.status === 'PAID') && 
      new Date(o.updatedAt).toDateString() === new Date().toDateString()
   ).length;
});

const fetchOrders = async () => {
  isRefreshing.value = true;
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
   paymentMethod.value = order.payments[0]?.method || 'CASH';
};

const processPayment = async () => {
   if (!selectedOrder.value) return;
   isSubmitting.value = true;
   try {
      await api.post('/payments', {
         orderId: selectedOrder.value.id.toString(),
         method: paymentMethod.value,
         amount: selectedOrder.value.totalPrice
      });
      
      // Also automatically mark order as COMPLETED if it was READY or set to ready
      await api.put(`/orders/${selectedOrder.value.id}/status`, { status: 'COMPLETED' });
      
      selectedOrder.value = null;
      fetchOrders();
   } catch (err) {
      console.error('Payment processing failed', err);
   } finally {
      isSubmitting.value = false;
   }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price);
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.animate-scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
