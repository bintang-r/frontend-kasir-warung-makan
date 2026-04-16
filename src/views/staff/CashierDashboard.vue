<template>
  <div class="cashier-app" style="height: calc(100vh - 64px); overflow: hidden;">

    <!-- ===== SEMUA TAGIHAN VIEW ===== -->
    <div v-if="!selectedOrderId" class="h-full flex flex-col p-6 gap-6">
      <!-- Summary Stats -->
      <div class="grid grid-cols-4 gap-4 flex-shrink-0">
        <div class="stat-card bg-white">
          <i class="fa-solid fa-receipt text-2xl text-gray-200 mb-3"></i>
          <p class="stat-label">Menunggu Bayar</p>
          <p class="stat-value text-gray-900">{{ pendingOrders.length }}</p>
        </div>
        <div class="stat-card bg-white">
          <i class="fa-solid fa-money-bill-wave text-2xl text-emerald-200 mb-3"></i>
          <p class="stat-label">Tunai Hari Ini</p>
          <p class="stat-value text-emerald-600">Rp {{ formatPrice(totalCashToday) }}</p>
        </div>
        <div class="stat-card bg-white">
          <i class="fa-solid fa-wallet text-2xl text-blue-200 mb-3"></i>
          <p class="stat-label">Non-Tunai Hari Ini</p>
          <p class="stat-value text-blue-600">Rp {{ formatPrice(totalNonCashToday) }}</p>
        </div>
        <div class="stat-card bg-gray-900 text-white">
          <i class="fa-solid fa-chart-line text-2xl text-white/20 mb-3"></i>
          <p class="stat-label opacity-50">Total Hari Ini</p>
          <p class="stat-value">Rp {{ formatPrice(totalCashToday + totalNonCashToday) }}</p>
        </div>
      </div>

      <!-- Orders List Table -->
      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm flex-1 overflow-hidden flex flex-col">
        <div class="flex items-center justify-between px-8 py-6 border-b border-gray-50">
          <div>
            <h2 class="text-lg font-black text-gray-900">Antrian Pembayaran</h2>
            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Klik baris untuk buka kasir</p>
          </div>
          <button @click="$emit('refresh')" class="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-primary hover:bg-primary/5 transition-all border border-gray-100">
            <i class="fa-solid fa-arrows-rotate text-sm"></i>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto">
          <table class="w-full text-left">
            <thead class="sticky top-0 bg-gray-50 z-10">
              <tr>
                <th class="px-8 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                <th class="py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Pelanggan</th>
                <th class="py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Meja / Tipe</th>
                <th class="py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Items</th>
                <th class="py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                <th class="py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th class="px-8 py-4 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr
                v-for="order in props.orders"
                :key="order.id"
                @click="$emit('select-order', order.id)"
                class="group hover:bg-gray-50/70 transition-all cursor-pointer"
              >
                <td class="px-8 py-5">
                  <span class="font-black text-gray-900 text-sm tabular-nums">#{{ order.id }}</span>
                </td>
                <td class="py-5">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center font-black text-xs text-gray-500">
                      {{ (order.user?.name || 'G').charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <p class="font-black text-gray-900 text-xs">{{ order.user?.name || 'Guest' }}</p>
                      <p class="text-[9px] text-gray-400 font-bold mt-0.5">{{ formatTime(order.createdAt) }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-5">
                  <span class="text-xs font-bold text-gray-600">{{ order.table?.name || order.orderType }}</span>
                </td>
                <td class="py-5">
                  <span class="text-xs font-bold text-gray-600">{{ order.items?.length }} item</span>
                </td>
                <td class="py-5">
                  <span class="font-black text-gray-900 text-sm">Rp {{ formatPrice(order.totalPrice) }}</span>
                </td>
                <td class="py-5">
                  <span
                    class="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest"
                    :class="hasUnpaid(order)
                      ? 'bg-red-50 text-red-500 border border-red-100'
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-100'"
                  >
                    {{ hasUnpaid(order) ? 'Belum Bayar' : 'Lunas' }}
                  </span>
                </td>
                <td class="px-8 py-5 text-right">
                  <button
                    v-if="hasUnpaid(order)"
                    @click.stop="$emit('select-order', order.id)"
                    class="bg-gray-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-sm active:scale-95"
                  >
                    Proses
                  </button>
                  <span v-else class="text-[9px] font-black text-emerald-500 uppercase tracking-widest">✓ Selesai</span>
                </td>
              </tr>
              <tr v-if="props.orders.length === 0">
                <td colspan="7" class="py-24 text-center">
                  <div class="flex flex-col items-center opacity-20">
                    <i class="fa-solid fa-mug-hot text-5xl mb-4 text-gray-400"></i>
                    <p class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Semua tagihan sudah beres!</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===== POS / CASHIER MACHINE VIEW ===== -->
    <div v-else-if="currentOrder" class="h-full flex gap-0 overflow-hidden">

      <!-- LEFT: Order Items Panel -->
      <div class="flex-1 flex flex-col bg-white border-r border-gray-100 overflow-hidden">
        <!-- Order Header -->
        <div class="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <button
              @click="$emit('select-order', null)"
              class="text-[9px] font-black text-gray-400 hover:text-primary uppercase tracking-widest transition-colors mb-2 flex items-center gap-1.5"
            >
              <i class="fa-solid fa-chevron-left"></i> Kembali ke daftar
            </button>
            <h2 class="text-2xl font-black text-gray-900 leading-none">
              Order <span class="text-primary">#{{ currentOrder.id }}</span>
            </h2>
            <p class="text-xs text-gray-400 font-bold mt-1.5">
              {{ currentOrder.user?.name || 'Guest' }}
              <span class="mx-2 text-gray-200">·</span>
              {{ currentOrder.table?.name || currentOrder.orderType }}
              <span class="mx-2 text-gray-200">·</span>
              {{ formatTime(currentOrder.createdAt) }}
            </p>
          </div>
          <div
            class="px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest"
            :class="hasUnpaid(currentOrder)
              ? 'bg-red-50 text-red-500 border border-red-100'
              : 'bg-emerald-50 text-emerald-600 border border-emerald-100'"
          >
            <i :class="hasUnpaid(currentOrder) ? 'fa-solid fa-clock mr-1' : 'fa-solid fa-check mr-1'"></i>
            {{ hasUnpaid(currentOrder) ? 'Menunggu Pembayaran' : 'Sudah Lunas' }}
          </div>
        </div>

        <!-- Order Status Bar -->
        <div class="px-8 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
          <span class="text-[9px] font-black uppercase tracking-widest text-gray-400">Status Pesanan:</span>
          <span
            class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border"
            :class="orderStatusClass(currentOrder.status)"
          >
            {{ orderStatusLabel(currentOrder.status) }}
          </span>
        </div>

        <!-- Items List -->
        <div class="flex-1 overflow-y-auto px-6 py-4">
          <!-- Column headers -->
          <div class="grid items-center gap-3 mb-2 px-3" style="grid-template-columns: 1fr 60px 80px 80px;">
            <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Menu</span>
            <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Qty</span>
            <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Harga</span>
            <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Subtotal</span>
          </div>

          <div class="space-y-1">
            <div
              v-for="item in currentOrder.items"
              :key="item.id"
              class="pos-item-row"
            >
              <div class="grid items-center gap-3" style="grid-template-columns: 1fr 60px 80px 80px;">
                <!-- Item info -->
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                    <img v-if="item.menu?.image" :src="getImageUrl(item.menu.image)" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <i class="fa-solid fa-bowl-food text-gray-300 text-sm"></i>
                    </div>
                  </div>
                  <div>
                    <p class="font-black text-gray-900 text-sm leading-snug">{{ item.menu?.name }}</p>
                    <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{{ item.menu?.category?.name }}</p>
                  </div>
                </div>
                <!-- Qty -->
                <div class="text-center">
                  <span class="bg-gray-100 text-gray-700 font-black text-sm px-3 py-1.5 rounded-lg inline-block">{{ item.qty }}</span>
                </div>
                <!-- Unit price -->
                <p class="text-right font-bold text-gray-500 text-sm">Rp {{ formatPrice(item.price) }}</p>
                <!-- Subtotal -->
                <p class="text-right font-black text-gray-900 text-sm">Rp {{ formatPrice(Number(item.price) * item.qty) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Totals Footer -->
        <div class="border-t border-dashed border-gray-200 px-8 py-5 space-y-3 bg-gray-50/50">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-gray-400">Subtotal</span>
            <span class="text-sm font-black text-gray-900">Rp {{ formatPrice(currentOrder.totalPrice) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-gray-400">PPN (0%)</span>
            <span class="text-sm font-bold text-gray-400">Rp 0</span>
          </div>
          <div class="flex justify-between items-center pt-3 border-t border-gray-200">
            <span class="text-sm font-black text-gray-900 uppercase tracking-tight">TOTAL</span>
            <span class="text-2xl font-black text-gray-900">Rp {{ formatPrice(currentOrder.totalPrice) }}</span>
          </div>
        </div>
      </div>

      <!-- RIGHT: Payment Panel (POS Machine) -->
      <div class="w-96 flex-shrink-0 flex flex-col bg-gray-900 text-white overflow-y-auto">

        <!-- Already paid state -->
        <div v-if="!hasUnpaid(currentOrder)" class="flex-1 flex flex-col items-center justify-center p-10 text-center">
          <div class="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-6">
            <i class="fa-solid fa-check text-emerald-400 text-4xl"></i>
          </div>
          <h3 class="text-2xl font-black text-white">Lunas!</h3>
          <p class="text-white/40 text-xs font-bold mt-2 uppercase tracking-widest">Pembayaran telah diterima</p>
          <p class="text-white/60 text-sm font-bold mt-4">
            Rp {{ formatPrice(currentOrder.totalPrice) }}
          </p>
          <div class="mt-8 p-4 bg-white/5 border border-white/10 rounded-2xl text-left w-full">
            <p class="text-[9px] font-black text-white/30 uppercase tracking-widest mb-3">Detail Pembayaran</p>
            <div v-for="p in currentOrder.payments?.filter(pm => pm.status === 'PAID')" :key="p.id" class="flex justify-between items-center">
              <span class="text-xs font-bold text-white/60">{{ p.method }}</span>
              <span class="text-xs font-black text-white">Rp {{ formatPrice(p.amount) }}</span>
            </div>
          </div>
        </div>

        <!-- Payment form state -->
        <template v-else>
          <!-- Header -->
          <div class="px-8 pt-8 pb-6 border-b border-white/10">
            <p class="text-[9px] font-black text-white/30 uppercase tracking-widest">Pembayaran</p>
            <h3 class="text-3xl font-black mt-1 tracking-tighter">
              Rp {{ formatPrice(currentOrder.totalPrice) }}
            </h3>
            <p class="text-white/30 text-[10px] font-bold mt-2">Order #{{ currentOrder.id }} · {{ currentOrder.user?.name || 'Guest' }}</p>
          </div>

          <!-- Payment Method Picker -->
          <div class="px-6 py-6 border-b border-white/10">
            <p class="text-[9px] font-black text-white/30 uppercase tracking-widest mb-4">Metode Pembayaran</p>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="m in paymentMethods"
                :key="m.value"
                @click="selectedMethod = m.value"
                class="pos-method-btn"
                :class="{ 'active': selectedMethod === m.value }"
              >
                <i :class="m.icon + ' text-2xl mb-2'"></i>
                <span class="text-[10px] font-black uppercase tracking-widest">{{ m.label }}</span>
              </button>
            </div>
          </div>

          <!-- Cash Calculator (only for CASH) -->
          <div v-if="selectedMethod === 'CASH'" class="px-6 py-4 border-b border-white/10">
            <p class="text-[9px] font-black text-white/30 uppercase tracking-widest mb-3">Uang Diterima</p>
            <div class="bg-white/5 border border-white/10 rounded-2xl p-4 text-right mb-3">
              <p class="text-3xl font-black text-white tracking-tighter">
                Rp {{ formatPrice(cashReceived || 0) }}
              </p>
            </div>
            <!-- Numpad -->
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="key in numpadKeys"
                :key="key"
                @click="handleNumpad(key)"
                class="numpad-key"
              >
                <span v-if="key === 'del'"><i class="fa-solid fa-delete-left"></i></span>
                <span v-else>{{ key }}</span>
              </button>
            </div>
            <!-- Quick cash -->
            <div class="grid grid-cols-2 gap-2 mt-3">
              <button
                v-for="q in quickCash"
                :key="q"
                @click="cashReceived = q"
                class="quick-cash-btn"
              >
                Rp {{ formatPrice(q) }}
              </button>
            </div>
            <!-- Change -->
            <div v-if="cashReceived > 0" class="mt-4 p-3 rounded-xl" :class="change >= 0 ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'">
              <div class="flex justify-between items-center">
                <span class="text-[9px] font-black uppercase tracking-widest" :class="change >= 0 ? 'text-emerald-400' : 'text-red-400'">
                  {{ change >= 0 ? 'Kembalian' : 'Kurang' }}
                </span>
                <span class="font-black text-sm" :class="change >= 0 ? 'text-emerald-400' : 'text-red-400'">
                  Rp {{ formatPrice(Math.abs(change)) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Confirm Button -->
          <div class="px-6 py-6 mt-auto">
            <div v-if="selectedMethod === 'CASH' && cashReceived > 0 && change >= 0" class="mb-4 p-4 bg-white/5 rounded-2xl">
              <div class="flex justify-between text-xs font-bold text-white/60 mb-2">
                <span>Dibayar</span>
                <span>Rp {{ formatPrice(cashReceived) }}</span>
              </div>
              <div class="flex justify-between text-xs font-black text-emerald-400">
                <span>Kembalian</span>
                <span>Rp {{ formatPrice(change) }}</span>
              </div>
            </div>

            <button
              @click="processPayment"
              :disabled="isProcessing || (selectedMethod === 'CASH' && change < 0)"
              class="pos-confirm-btn w-full"
              :class="{ 'opacity-50 cursor-not-allowed': isProcessing || (selectedMethod === 'CASH' && change < 0) }"
            >
              <div v-if="isProcessing" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <template v-else>
                <i class="fa-solid fa-check-double text-emerald-300 mr-2"></i>
                {{ selectedMethod === 'CASH' ? 'Konfirmasi & Cetak Struk' : `Konfirmasi ${selectedMethod}` }}
              </template>
            </button>

            <p class="text-center text-white/20 text-[9px] font-bold mt-3 uppercase tracking-widest">
              Pastikan pembayaran sudah diterima sebelum konfirmasi
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>

  <NotificationToast ref="toast" />
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import api from '../../services/api';
import { getImageUrl } from '../../services/api';
import NotificationToast from '../../components/NotificationToast.vue';

const props = defineProps({
  selectedOrderId: { default: null },
  orders: { type: Array, default: () => [] },
});

const emit = defineEmits(['refresh', 'select-order']);
const toast = ref(null);
const cashierToast = inject('cashierToast', null);

const isProcessing = ref(false);
const selectedMethod = ref('CASH');
const cashReceived = ref(0);
const cashInput = ref('');

// ── Current order ──────────────────────────────────────────────────────
const currentOrder = computed(() =>
  props.orders.find(o => String(o.id) === String(props.selectedOrderId)) || null
);

// ── Summary stats ──────────────────────────────────────────────────────
const pendingOrders = computed(() =>
  props.orders.filter(o => o.payments?.some(p => p.status === 'UNPAID'))
);

const isToday = (ds) => new Date(ds).toDateString() === new Date().toDateString();

const totalCashToday = computed(() =>
  props.orders
    .filter(o => o.payments?.some(p => p.status === 'PAID' && p.method === 'CASH') && isToday(o.updatedAt))
    .reduce((acc, o) => acc + Number(o.totalPrice), 0)
);

const totalNonCashToday = computed(() =>
  props.orders
    .filter(o => o.payments?.some(p => p.status === 'PAID' && p.method !== 'CASH') && isToday(o.updatedAt))
    .reduce((acc, o) => acc + Number(o.totalPrice), 0)
);

// ── Payment helpers ────────────────────────────────────────────────────
const hasUnpaid = (order) => order?.payments?.some(p => p.status === 'UNPAID');

const change = computed(() => cashReceived.value - Number(currentOrder.value?.totalPrice || 0));

const paymentMethods = [
  { value: 'CASH', label: 'Tunai', icon: 'fa-solid fa-money-bill-wave' },
  { value: 'QRIS', label: 'QRIS', icon: 'fa-solid fa-qrcode' },
  { value: 'EWALLET', label: 'E-Wallet', icon: 'fa-solid fa-wallet' },
  { value: 'TRANSFER', label: 'Transfer', icon: 'fa-solid fa-building-columns' },
];

const numpadKeys = ['1','2','3','4','5','6','7','8','9','000','0','del'];

const quickCash = computed(() => {
  const t = Number(currentOrder.value?.totalPrice || 0);
  const round = (v) => Math.ceil(v / 10000) * 10000;
  return [round(t), round(t) + 10000, round(t) + 20000, round(t) + 50000].filter(v => v >= t);
});

const handleNumpad = (key) => {
  if (key === 'del') {
    cashInput.value = cashInput.value.slice(0, -1);
  } else {
    cashInput.value += key;
  }
  cashReceived.value = parseInt(cashInput.value || '0');
};

// ── Status helpers ─────────────────────────────────────────────────────
const orderStatusLabel = (s) => ({ PENDING:'Menunggu', CONFIRMED:'Antrian', COOKING:'Dimasak', READY:'Siap Saji', COMPLETED:'Selesai', CANCELLED:'Dibatalkan' }[s] || s);
const orderStatusClass = (s) => ({
  'PENDING':   'bg-yellow-50 text-yellow-600 border-yellow-100',
  'CONFIRMED': 'bg-blue-50 text-blue-600 border-blue-100',
  'COOKING':   'bg-orange-50 text-orange-600 border-orange-100',
  'READY':     'bg-emerald-50 text-emerald-600 border-emerald-100',
  'COMPLETED': 'bg-gray-50 text-gray-500 border-gray-100',
  'CANCELLED': 'bg-red-50 text-red-500 border-red-100',
}[s]);

// ── Process payment ────────────────────────────────────────────────────
const processPayment = async () => {
  if (!currentOrder.value) return;
  if (selectedMethod.value === 'CASH' && change.value < 0) return;

  isProcessing.value = true;
  try {
    await api.post('/payments', {
      orderId: currentOrder.value.id.toString(),
      method: selectedMethod.value,
      amount: currentOrder.value.totalPrice,
    });

    const notify = cashierToast || toast;
    notify.value?.display(`✅ Pembayaran Order #${currentOrder.value.id} berhasil!`);
    
    cashReceived.value = 0;
    cashInput.value = '';
    selectedMethod.value = 'CASH';
    emit('refresh');
  } catch (e) {
    console.error('Payment error', e);
    const notify = cashierToast || toast;
    notify.value?.display('Gagal memproses pembayaran', 'error');
  } finally {
    isProcessing.value = false;
  }
};

// ── Helpers ────────────────────────────────────────────────────────────
const formatPrice = (v) => new Intl.NumberFormat('id-ID').format(v || 0);
const formatTime = (ds) => new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date(ds));
</script>

<style scoped>
.cashier-app { background: #f8f9fb; }

/* Summary stat cards */
.stat-card {
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #f0f0f3;
  box-shadow: 0 1px 3px rgba(0,0,0,.04);
}
.stat-label { font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: .1em; color: #9ca3af; margin-bottom: 4px; }
.stat-value { font-size: 20px; font-weight: 900; color: inherit; line-height: 1.2; }

/* Item row */
.pos-item-row {
  padding: 12px 12px;
  border-radius: 14px;
  transition: background .15s;
}
.pos-item-row:hover { background: #f8f9fb; }

/* Payment method buttons */
.pos-method-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  border-radius: 16px;
  border: 1.5px solid rgba(255,255,255,.08);
  background: rgba(255,255,255,.04);
  color: rgba(255,255,255,.3);
  cursor: pointer;
  transition: all .2s ease;
}
.pos-method-btn:hover { border-color: rgba(255,255,255,.2); color: #fff; background: rgba(255,255,255,.07); }
.pos-method-btn.active { border-color: var(--color-primary, #e31e24); background: rgba(227,30,36,.12); color: #fff; box-shadow: 0 0 0 3px rgba(227,30,36,.15); }

/* Numpad */
.numpad-key {
  padding: 14px;
  border-radius: 12px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.08);
  color: #fff;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
  transition: all .15s ease;
  text-align: center;
}
.numpad-key:hover { background: rgba(255,255,255,.12); }
.numpad-key:active { transform: scale(.95); }

.quick-cash-btn {
  padding: 10px;
  border-radius: 10px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.08);
  color: rgba(255,255,255,.5);
  font-size: 10px;
  font-weight: 900;
  cursor: pointer;
  transition: all .15s ease;
  text-align: center;
}
.quick-cash-btn:hover { background: rgba(255,255,255,.1); color: #fff; }

/* Confirm button */
.pos-confirm-btn {
  padding: 18px;
  border-radius: 20px;
  background: linear-gradient(135deg, #e31e24, #c41920);
  color: #fff;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .1em;
  cursor: pointer;
  transition: all .2s ease;
  box-shadow: 0 8px 24px rgba(227,30,36,.3);
  display: flex;
  align-items: center;
  justify-content: center;
}
.pos-confirm-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 32px rgba(227,30,36,.4); }
.pos-confirm-btn:active:not(:disabled) { transform: scale(.98); }
</style>
