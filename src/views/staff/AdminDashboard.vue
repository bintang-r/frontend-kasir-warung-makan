<template>
  <div class="space-y-10">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in summaryStats" :key="stat.label" class="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
        <div class="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 transition-all">
           <i :class="stat.icon" class="text-[100px]"></i>
        </div>
        <div class="flex items-center gap-4 mb-4">
          <div :class="stat.bgClass" class="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg">
             <i :class="stat.icon"></i>
          </div>
          <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ stat.label }}</span>
        </div>
        <h3 class="text-3xl font-black text-gray-900 tracking-tighter">{{ stat.value }}</h3>
        <p class="text-xs font-bold mt-2" :class="stat.trendClass">{{ stat.trend }} <span class="text-gray-400 font-medium">dibanding kemarin</span></p>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Revenue Chart -->
      <div class="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div class="flex justify-between items-center mb-8">
           <div>
             <h3 class="text-xl font-black text-gray-900 tracking-tight">Tren Pendapatan</h3>
             <p class="text-xs font-medium text-gray-400 mt-1">Akumulasi 7 hari terakhir</p>
           </div>
           <div class="bg-gray-50 px-4 py-2 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">Weekly View</div>
        </div>
        <div class="h-[300px]">
          <Line v-if="revenueChartData" :data="revenueChartData" :options="chartOptions" />
          <div v-else class="h-full flex items-center justify-center bg-gray-50 rounded-3xl animate-pulse text-gray-400 font-bold uppercase tracking-widest text-xs">Menyiapkan Grafik...</div>
        </div>
      </div>

      <!-- Popular Menus Chart -->
      <div class="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div class="flex justify-between items-center mb-8">
           <div>
             <h3 class="text-xl font-black text-gray-900 tracking-tight">Menu Terlaris</h3>
             <p class="text-xs font-medium text-gray-400 mt-1">Berdasarkan jumlah kuantitas pesanan</p>
           </div>
           <div class="bg-gray-50 px-4 py-2 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">Live Ranking</div>
        </div>
        <div class="h-[300px]">
          <Bar v-if="popularChartData" :data="popularChartData" :options="chartOptions" />
          <div v-else class="h-full flex items-center justify-center bg-gray-50 rounded-3xl animate-pulse text-gray-400 font-bold uppercase tracking-widest text-xs">Menyiapkan Grafik...</div>
        </div>
      </div>
    </div>

    <!-- Bottom Row: Recent Orders & Order Distribution -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
       <!-- Order Status Distribution -->
       <div class="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
         <h3 class="text-xl font-black text-gray-900 tracking-tight mb-8">Sebaran Status</h3>
         <div class="h-[250px] flex items-center justify-center">
            <Doughnut v-if="statusChartData" :data="statusChartData" :options="doughnutOptions" />
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-50 rounded-3xl animate-pulse text-gray-400 font-bold uppercase tracking-widest text-xs">Menyiapkan Grafik...</div>
         </div>
         <div class="mt-8 grid grid-cols-2 gap-4">
            <div v-for="item in stats?.orderStatusCount" :key="item.status" class="flex items-center gap-2">
               <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: getStatusColor(item.status) }"></div>
               <span class="text-[10px] font-black text-gray-500 uppercase tracking-tighter">{{ item.status }}: {{ item._count.status }}</span>
            </div>
         </div>
       </div>

       <!-- Recent Orders Table -->
       <div class="lg:col-span-2 bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
          <div class="flex justify-between items-center mb-8">
            <h3 class="text-xl font-black text-gray-900 tracking-tight">Aktivitas Pesanan Terkini</h3>
            <router-link to="/staff/admin/orders" class="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Lihat Semua</router-link>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-gray-50">
                  <th class="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                  <th class="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pelanggan</th>
                  <th class="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th class="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                  <th class="pb-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Waktu</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="order in stats?.recentOrders" :key="order.id" class="group hover:bg-gray-50 transition-colors">
                  <td class="py-4 font-black text-gray-900 text-sm">#{{ order.id }}</td>
                  <td class="py-4 text-sm font-bold text-gray-600">{{ order.user?.name || 'Guest' }}</td>
                  <td class="py-4 text-xs">
                     <span :class="getStatusClass(order.status)" class="px-3 py-1 rounded-lg font-black uppercase tracking-widest text-[9px]">
                        {{ order.status }}
                     </span>
                  </td>
                  <td class="py-4 font-black text-gray-900 text-sm">Rp {{ formatPrice(order.totalPrice) }}</td>
                  <td class="py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-tighter">{{ formatTime(order.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../../services/api';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  BarElement,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'vue-chartjs';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  BarElement,
  ArcElement
);

const stats = ref(null);

const fetchStats = async () => {
  try {
    const res = await api.get('/dashboard/stats');
    stats.value = res.data;
  } catch (err) {
    console.error('Failed to fetch stats', err);
  }
};

onMounted(() => {
  fetchStats();
});

const summaryStats = computed(() => [
  { label: 'Total Omzet (7 Hari)', value: `Rp ${formatPrice(stats.value?.revenueByDay.reduce((a, b) => a + b.amount, 0) || 0)}`, trend: '+12.4%', trendClass: 'text-green-500', icon: 'fa-solid fa-money-bill-trend-up', bgClass: 'bg-primary' },
  { label: 'Pesanan Selesai', value: stats.value?.orderStatusCount.find(s => s.status === 'COMPLETED')?._count.status || 0, trend: '+8.2%', trendClass: 'text-green-500', icon: 'fa-solid fa-circle-check', bgClass: 'bg-accent' },
  { label: 'Dalam Proses Dapur', value: stats.value?.orderStatusCount.find(s => s.status === 'COOKING')?._count.status || 0, trend: '-2.1%', trendClass: 'text-orange-500', icon: 'fa-solid fa-utensils', bgClass: 'bg-orange-500' },
  { label: 'Review Pelanggan', value: '4.9/5.0', trend: 'Stabil', trendClass: 'text-gray-400', icon: 'fa-solid fa-star', bgClass: 'bg-yellow-400' }
]);

// Chart Configurations
const revenueChartData = computed(() => {
  if (!stats.value) return null;
  return {
    labels: stats.value.revenueByDay.map(d => d.date),
    datasets: [{
      label: 'Pendapatan',
      data: stats.value.revenueByDay.map(d => d.amount),
      borderColor: '#d8222a', // primary
      backgroundColor: 'rgba(216, 34, 42, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 6,
      pointBackgroundColor: '#fff',
      pointBorderWidth: 3
    }]
  };
});

const popularChartData = computed(() => {
  if (!stats.value) return null;
  return {
    labels: stats.value.topMenus.map(m => m.name),
    datasets: [{
      label: 'Kuantitas Terjual',
      data: stats.value.topMenus.map(m => m.qty),
      backgroundColor: '#0061e0', // secondary
      borderRadius: 12
    }]
  };
});

const statusChartData = computed(() => {
  if (!stats.value) return null;
  return {
    labels: stats.value.orderStatusCount.map(s => s.status),
    datasets: [{
      data: stats.value.orderStatusCount.map(s => s._count.status),
      backgroundColor: stats.value.orderStatusCount.map(s => getStatusColor(s.status)),
      borderWidth: 0
    }]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: { grid: { display: false }, ticks: { font: { size: 10, weight: 'bold' } } },
    x: { grid: { display: false }, ticks: { font: { size: 10, weight: 'bold' } } }
  }
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: { legend: { display: false } }
};

const getStatusColor = (status) => {
  const colors = {
    PENDING: '#9ca3af',
    CONFIRMED: '#0061e0',
    COOKING: '#f97316',
    READY: '#10b981',
    COMPLETED: '#22c55e',
    CANCELLED: '#ef4444'
  };
  return colors[status] || '#eee';
};

const getStatusClass = (status) => {
  const classes = {
    PENDING: 'bg-gray-100 text-gray-500',
    CONFIRMED: 'bg-blue-100 text-blue-500',
    COOKING: 'bg-orange-100 text-orange-500',
    READY: 'bg-green-100 text-green-500',
    COMPLETED: 'bg-accent/10 text-accent',
    CANCELLED: 'bg-red-100 text-red-500'
  };
  return classes[status] || 'bg-gray-50';
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price);
};

const formatTime = (dateStr) => {
  return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};
</script>
