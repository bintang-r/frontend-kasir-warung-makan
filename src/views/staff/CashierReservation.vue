<template>
  <div class="p-6 h-full flex flex-col gap-6" style="min-height: calc(100vh - 64px)">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-black text-gray-900 leading-none">Manajemen Reservasi</h2>
        <p class="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">
          Kelola pesanan tempat dari pelanggan
        </p>
      </div>
      <button
        @click="fetchReservations"
        class="p-2.5 bg-white rounded-xl text-gray-400 hover:text-primary hover:bg-primary/5 transition-all border border-gray-100 shadow-sm"
      >
        <i class="fa-solid fa-arrows-rotate text-sm" :class="{ 'animate-spin': loading }"></i>
      </button>
    </div>

    <!-- Content -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm flex-1 flex flex-col overflow-hidden">
      <!-- Tabs -->
      <div class="flex items-center gap-2 px-8 py-4 border-b border-gray-50 bg-gray-50/50">
        <button
          v-for="status in ['ALL', 'PENDING', 'APPROVED', 'COMPLETED', 'REJECTED']"
          :key="status"
          @click="statusFilter = status"
          class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          :class="statusFilter === status ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-white hover:text-gray-800'"
        >
          {{ status }}
        </button>
      </div>

      <!-- Table -->
      <div class="flex-1 overflow-x-auto">
        <table class="w-full text-left whitespace-nowrap min-w-[800px]">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="px-8 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Waktu / Tgl</th>
              <th class="py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Pelanggan</th>
              <th class="py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Kontak</th>
              <th class="py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Detail Pesanan</th>
              <th class="py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th class="px-8 py-4 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="res in filteredReservations" :key="res.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-8 py-4">
                <p class="text-xs font-black text-gray-900">{{ formatDate(res.date) }}</p>
                <p class="text-[10px] font-bold text-gray-400">{{ formatTime(res.date) }}</p>
              </td>
              <td class="py-4">
                <p class="text-sm font-black text-gray-900">{{ res.name }}</p>
                <p v-if="res.notes" class="text-[9px] font-bold text-gray-400 mt-1 flex items-center gap-1">
                  <i class="fa-solid fa-comment-dots text-primary/50"></i> {{ res.notes }}
                </p>
              </td>
              <td class="py-4">
                <span class="text-xs font-bold text-gray-600">{{ res.phone || '-' }}</span>
              </td>
              <td class="py-4">
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-[10px]">
                      <i class="fa-solid fa-users"></i>
                    </div>
                    <span class="text-xs font-black text-gray-900">{{ res.guestCount }} Org</span>
                  </div>
                  <div v-if="res.table" class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center text-[10px]">
                      <i class="fa-solid fa-chair"></i>
                    </div>
                    <span class="text-xs font-black text-gray-900">{{ res.table.name }}</span>
                  </div>
                  <div v-if="res.order" class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center text-[10px]">
                      <i class="fa-solid fa-utensils"></i>
                    </div>
                    <span class="text-[10px] font-black text-gray-900">{{ res.order.items?.length || 0 }} Menu</span>
                    <span v-if="res.order.payments?.length" class="text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-1">
                      {{ formatPrice(res.order.payments.reduce((sum, p) => sum + Number(p.amount), 0)) }} Dibayar
                    </span>
                  </div>
                  
                  <!-- Proof of Payment Thumbnail -->
                  <div v-if="res.paymentProof" class="mt-2 flex items-center gap-2">
                    <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Bukti ({{ res.paymentType }}):</span>
                    <div 
                      @click="previewImage = res.paymentProof"
                      class="w-12 h-8 rounded border border-gray-200 overflow-hidden shadow-sm cursor-pointer hover:border-primary transition-colors bg-gray-50 flex items-center justify-center relative group"
                    >
                      <img :src="getImageUrl(res.paymentProof)" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[8px]">
                        <i class="fa-solid fa-eye"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="py-4">
                <span
                  class="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest"
                  :class="getStatusClass(res.status)"
                >
                  {{ res.status }}
                </span>
              </td>
              <td class="px-8 py-4 text-right">
                <div v-if="res.status === 'PENDING'" class="flex items-center justify-end gap-2">
                  <button
                    @click="updateStatus(res.id, 'APPROVED')"
                    class="h-8 px-3 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
                    :title="res.paymentType === 'DP' ? 'Konfirmasi DP & Masukkan Dapur' : (res.paymentType === 'FULL' ? 'Konfirmasi Lunas & Masukkan Dapur' : 'Terima Reservasi')"
                  >
                    <i class="fa-solid fa-check"></i> 
                    {{ res.paymentType === 'DP' ? 'Konfirmasi DP' : (res.paymentType === 'FULL' ? 'Konfirmasi Lunas' : 'Setujui') }}
                  </button>
                  <button
                    @click="updateStatus(res.id, 'REJECTED')"
                    class="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                    title="Tolak"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
                <div v-else-if="res.status === 'APPROVED'" class="flex items-center justify-end gap-2">
                  <button
                    @click="printReceipt(res)"
                    class="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
                    title="Cetak Struk DP/Pelunasan"
                  >
                    <i class="fa-solid fa-print mr-1"></i> Struk
                  </button>
                  <button
                    @click="updateStatus(res.id, 'COMPLETED')"
                    class="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all"
                  >
                    Tandai Selesai
                  </button>
                </div>
                <span v-else class="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  -
                </span>
              </td>
            </tr>
            <tr v-if="filteredReservations.length === 0">
              <td colspan="6" class="py-24 text-center">
                <div class="flex flex-col items-center opacity-20">
                  <i class="fa-regular fa-calendar-xmark text-5xl mb-4 text-gray-400"></i>
                  <p class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    Tidak ada reservasi
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div v-if="previewImage" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" @click="previewImage = null">
      <div class="relative bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl p-6 flex flex-col gap-4" @click.stop>
        <div class="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 class="text-sm font-black text-gray-900 uppercase tracking-widest">Bukti Pembayaran</h3>
          <button @click="previewImage = null" class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <i class="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>
        <div class="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 max-h-[60vh] flex items-center justify-center">
          <img :src="getImageUrl(previewImage)" class="max-w-full max-h-full object-contain" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { reservationService } from '../../services/reservation.service';
import { getImageUrl } from '../../services/api';

const reservations = ref([]);
const loading = ref(false);
const statusFilter = ref('ALL');
const previewImage = ref(null);

const fetchReservations = async () => {
  loading.value = true;
  try {
    const data = await reservationService.getAllReservations();
    reservations.value = data;
  } catch (error) {
    console.error('Failed to fetch reservations', error);
  } finally {
    loading.value = false;
  }
};

const filteredReservations = computed(() => {
  if (statusFilter.value === 'ALL') return reservations.value;
  return reservations.value.filter((r) => r.status === statusFilter.value);
});

const updateStatus = async (id, status) => {
  try {
    await reservationService.updateReservationStatus(id, status);
    // update local state optimistically or re-fetch
    const index = reservations.value.findIndex(r => String(r.id) === String(id));
    if (index !== -1) {
      reservations.value[index].status = status;
    }
  } catch (error) {
    console.error('Failed to update status', error);
    alert('Gagal mengupdate status reservasi');
  }
};

const printReceipt = (res) => {
  const receiptWindow = window.open('', '_blank', 'width=400,height=600');
  let itemsHtml = '';
  let subtotal = 0;
  
  if (res.order && res.order.items) {
    res.order.items.forEach(item => {
      const price = Number(item.price);
      subtotal += price * item.qty;
      itemsHtml += `
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
          <span>${item.qty}x ${item.menu?.name || 'Item'}</span>
          <span>${formatPrice(price * item.qty)}</span>
        </div>
      `;
    });
  }

  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  const html = `
    <html>
      <head>
        <title>Struk Reservasi #${res.id}</title>
        <style>
          body { font-family: monospace; padding: 20px; color: #000; }
          .header { text-align: center; margin-bottom: 20px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
          .title { font-size: 16px; font-weight: bold; margin-bottom: 4px; }
          .subtitle { font-size: 12px; }
          .info { font-size: 12px; margin-bottom: 20px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
          .items { margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
          .total { display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; }
          .footer { text-align: center; font-size: 10px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">RM SIANTAR MINANG</div>
          <div class="subtitle">Jl. Contoh No. 123, Kota</div>
          <div class="subtitle">STRUK RESERVASI / DP</div>
        </div>
        <div class="info">
          <div>ID: RES-${res.id}</div>
          <div>Nama: ${res.name}</div>
          <div>Meja: ${res.table?.name || '-'}</div>
          <div>Waktu: ${formatDate(res.date)} ${formatTime(res.date)}</div>
        </div>
        ${itemsHtml ? `<div class="items">${itemsHtml}</div>` : ''}
        ${itemsHtml ? `
        <div style="font-size:12px; display:flex; justify-content:space-between; margin-bottom:4px;">
          <span>Subtotal</span><span>${formatPrice(subtotal)}</span>
        </div>
        <div style="font-size:12px; display:flex; justify-content:space-between; margin-bottom:4px;">
          <span>PB1 (11%)</span><span>${formatPrice(tax)}</span>
        </div>
        <div class="total" style="margin-top:10px;">
          <span>TOTAL</span><span>${formatPrice(total)}</span>
        </div>
        ` : '<div style="text-align:center;font-size:12px;margin:20px 0;">(Hanya Pemesanan Tempat)</div>'}
        <div class="footer">
          Terima kasih atas reservasi Anda!<br/>
          Harap tunjukkan struk ini saat kedatangan.
        </div>
      </body>
    </html>
  `;
  receiptWindow.document.write(html);
  receiptWindow.document.close();
  setTimeout(() => {
    receiptWindow.print();
  }, 500);
};

onMounted(() => {
  fetchReservations();
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
};

const getStatusClass = (status) => {
  switch (status) {
    case 'PENDING': return 'bg-yellow-50 text-yellow-600 border border-yellow-100';
    case 'APPROVED': return 'bg-blue-50 text-blue-600 border border-blue-100';
    case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
    case 'REJECTED': 
    case 'CANCELLED': return 'bg-red-50 text-red-500 border border-red-100';
    default: return 'bg-gray-100 text-gray-500 border border-gray-200';
  }
};

const formatDate = (ds) => {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(ds));
};

const formatTime = (ds) => {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(ds));
};
</script>
