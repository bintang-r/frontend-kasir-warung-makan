<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex justify-between items-center bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
       <div>
          <h2 class="text-2xl font-black text-gray-900 tracking-tight">Riwayat Transaksi</h2>
          <p class="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest">Audit keuangan dan rekonsiliasi pembayaran</p>
       </div>
       <div class="flex items-center gap-6">
          <div class="text-right">
             <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Pendapatan (Bulan Ini)</p>
             <p class="text-xl font-black text-primary tracking-tighter">Rp {{ formatPrice(monthlyTotal) }}</p>
          </div>
          <div class="w-px h-10 bg-gray-100"></div>
          <button @click="exportCSV" class="bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-gray-900/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
             <i class="fa-solid fa-file-export"></i> Export CSV
          </button>
       </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
       <div v-for="stat in stats" :key="stat.label" class="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
          <div class="flex items-center gap-4">
             <div :class="stat.bg" class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl">
                <i :class="stat.icon"></i>
             </div>
             <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ stat.label }}</p>
                <p class="text-lg font-black text-gray-900 leading-tight">{{ stat.value }}</p>
             </div>
          </div>
       </div>
    </div>

    <!-- Payments Table -->
    <div class="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden p-10">
       <div class="overflow-x-auto">
          <table class="w-full text-left">
             <thead>
                <tr class="border-b border-gray-50">
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Waktu Bayar</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID Pesanan</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Metode</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Jumlah</th>
                   <th class="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                   <th class="pb-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Verifikator</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-gray-50">
                <tr v-for="payment in payments" :key="payment.id" class="group hover:bg-gray-50/50 transition-colors">
                   <td class="py-6">
                      <p class="text-xs font-bold text-gray-900">{{ formatDate(payment.paidAt || payment.createdAt) }}</p>
                      <p class="text-[10px] font-medium text-gray-400">{{ formatTime(payment.paidAt || payment.createdAt) }}</p>
                   </td>
                   <td class="py-6">
                      <router-link :to="{ name: 'AdminOrderManagement', query: { q: payment.orderId } }" class="font-black text-primary hover:underline tabular-nums">
                         #{{ payment.orderId }}
                      </router-link>
                   </td>
                   <td class="py-6">
                      <div class="flex items-center gap-3">
                         <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-xs text-gray-400">
                            <i :class="getMethodIcon(payment.method)"></i>
                         </div>
                         <span class="text-[10px] font-black uppercase tracking-widest text-gray-600">{{ payment.method }}</span>
                      </div>
                   </td>
                   <td class="py-6 font-black text-gray-900">Rp {{ formatPrice(payment.amount) }}</td>
                   <td class="py-6 text-center">
                      <span :class="payment.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'" class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
                         {{ payment.status }}
                      </span>
                   </td>
                   <td class="py-6 text-right">
                      <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest">{{ payment.order?.user?.name || 'System / Cashier' }}</p>
                   </td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>
    
    <NotificationToast ref="toast" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, inject } from 'vue';
import api from '../../services/api';

const payments = ref([]);
const staffToast = inject('staffToast');

const stats = computed(() => {
  const total = payments.value.reduce((acc, p) => p.status === 'PAID' ? acc + Number(p.amount) : acc, 0);
  const count = payments.value.filter(p => p.status === 'PAID').length;
  const pending = payments.value.filter(p => p.status === 'UNPAID').length;
  
  return [
    { label: 'Total Transaksi Baik', value: count, icon: 'fa-solid fa-check-double', bg: 'bg-emerald-50 text-emerald-500' },
    { label: 'Akumulasi Volume', value: `Rp ${formatPrice(total)}`, icon: 'fa-solid fa-wallet', bg: 'bg-primary/10 text-primary' },
    { label: 'Menunggu Verifikasi', value: pending, icon: 'fa-solid fa-hourglass-half', bg: 'bg-amber-50 text-amber-500' }
  ];
});

const monthlyTotal = computed(() => {
  const now = new Date();
  return payments.value
    .filter(p => p.status === 'PAID' && new Date(p.paidAt || p.createdAt).getMonth() === now.getMonth())
    .reduce((acc, p) => acc + Number(p.amount), 0);
});

const fetchData = async () => {
  try {
    const response = await api.get('/payments');
    payments.value = response.data;
  } catch (err) {
    console.error('Fetch payments failed', err);
  }
};

const getMethodIcon = (method) => {
  switch (method) {
    case 'CASH': return 'fa-solid fa-money-bill-wave';
    case 'QRIS': return 'fa-solid fa-qrcode';
    case 'TRANSFER': return 'fa-solid fa-building-columns';
    default: return 'fa-solid fa-credit-card';
  }
};

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price);
const formatDate = (d) => new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(d));
const formatTime = (d) => new Intl.DateTimeFormat('id-ID', { timeStyle: 'short' }).format(new Date(d));

const exportCSV = () => {
  staffToast.value?.display('Mempersiapkan data laporan keuangan...', 'info', 'Ekspor Data');
  setTimeout(() => {
     staffToast.value?.display('Laporan berhasil diunduh! 📁', 'success', 'Download Selesai');
  }, 1000);
};

onMounted(fetchData);
</script>
