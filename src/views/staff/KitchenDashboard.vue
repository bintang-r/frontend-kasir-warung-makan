<template>
  <div class="kitchen-app p-6 min-h-screen">

    <!-- ===== SEMUA (Overview Board) ===== -->
    <div v-if="!selectedOrderId" class="h-full">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-black text-white tracking-tight">Papan Dapur</h1>
          <div class="flex gap-2 mt-2">
            <button 
              @click="orderFilter = 'ALL'" 
              class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
              :class="orderFilter === 'ALL' ? 'bg-primary text-white' : 'bg-white/10 text-white/50 hover:bg-white/20'"
            >Semua Pesanan</button>
            <button 
              @click="orderFilter = 'RESERVASI'" 
              class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
              :class="orderFilter === 'RESERVASI' ? 'bg-red-500 text-white' : 'bg-white/10 text-white/50 hover:bg-white/20'"
            >
              Reservasi 
              <span v-if="reservationCount > 0" class="ml-1 bg-white text-red-500 px-1.5 py-0.5 rounded-full text-[8px]">{{ reservationCount }}</span>
            </button>
          </div>
        </div>
        
        <!-- Filter Tanggal Reservasi -->
        <div v-if="orderFilter === 'RESERVASI' && reservationDateCounts.length > 0" class="flex gap-2 mt-4 items-center">
          <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mr-2"><i class="fa-regular fa-calendar mr-1"></i> Tanggal Reservasi:</span>
          <select 
            v-model="selectedDate"
            class="bg-[#1a1a1a] border border-white/10 text-white text-xs font-bold rounded-xl px-3 py-1.5 outline-none focus:border-red-500 transition-colors"
          >
            <option value="" disabled selected>-- Pilih Tanggal --</option>
            <option v-for="d in reservationDateCounts" :key="d.date" :value="d.date">
              {{ formatDateLabel(d.date) }} ({{ d.count }} Pesanan)
            </option>
          </select>
        </div>

        <div class="flex gap-3 mt-4">
          <div class="stat-chip bg-blue-500/10 border-blue-500/30 text-blue-400">
            <i class="fa-solid fa-clock-rotate-left"></i>
            {{ grouped.CONFIRMED.length }} Antri
          </div>
          <div class="stat-chip bg-orange-500/10 border-orange-500/30 text-orange-400">
            <i class="fa-solid fa-fire-burner"></i>
            {{ grouped.COOKING.length }} Masak
          </div>
          <div class="stat-chip bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
            <i class="fa-solid fa-utensils"></i>
            {{ grouped.READY.length }} Siap
          </div>
        </div>
      </div>

      <!-- Kanban Board -->
      <div class="grid grid-cols-3 gap-6" style="height: calc(100vh - 160px);">
        <!-- Col: CONFIRMED (Antrian Baru) -->
        <div
          class="kanban-col"
          @dragover.prevent="onDragOver($event, 'CONFIRMED')"
          @dragleave="onDragLeave"
          @drop="onDrop($event, 'CONFIRMED')"
          :class="{ 'drop-target': dragTarget === 'CONFIRMED' }"
        >
          <div class="kanban-col-header">
            <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span>Antrian Baru</span>
            <span class="col-count">{{ grouped.CONFIRMED.length }}</span>
          </div>
          <div class="kanban-cards">
            <div
              v-for="order in grouped.CONFIRMED"
              :key="order.id"
              class="order-card"
              draggable="true"
              @dragstart="onDragStart($event, order)"
              @dragend="onDragEnd"
            >
              <!-- Order Card -->  
              <div class="order-card-inner">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                  <div>
                    <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                      <p style="font-size:9px; font-weight:900; opacity:.4; letter-spacing:.1em; text-transform:uppercase; color:#fff;">#{{ order.id }} · {{ order.table?.name || 'Takeaway' }}</p>
                      <span v-if="order.reservation" style="background:#ef4444; color:#fff; font-size:8px; font-weight:900; padding:2px 4px; border-radius:4px; letter-spacing:.1em;">RESERVASI</span>
                    </div>
                    <p style="font-size:12px; font-weight:900; color:#fff;">{{ order.user?.name || 'Guest' }}</p>
                  </div>
                  <i class="fa-solid fa-grip-dots-vertical" style="color:rgba(255,255,255,.15); font-size:14px;"></i>
                </div>
                <div style="display:flex; flex-direction:column; gap:6px; background:rgba(255,255,255,.03); padding:10px; border-radius:12px;">
                  <div v-for="item in order.items" :key="item.id" style="display:flex; gap:8px; align-items:center;">
                    <span style="font-size:11px; font-weight:900; color:#3b82f6; min-width:20px;">{{ item.qty }}x</span>
                    <span style="font-size:11px; font-weight:700; color:rgba(255,255,255,.7);">{{ item.menu?.name }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Empty state -->
            <div v-if="orderFilter === 'RESERVASI' && !selectedDate" class="empty-col-state">
              <i class="fa-solid fa-calendar-day" style="font-size:36px; margin-bottom:12px;"></i>
              <p>Pilih tanggal reservasi<br/>terlebih dahulu</p>
            </div>
            <div v-else-if="grouped.CONFIRMED.length === 0" class="empty-col-state">
              <i class="fa-solid fa-inbox" style="font-size:36px; margin-bottom:12px;"></i>
              <p>Santai dulu,<br/>belum ada antrian</p>
            </div>
          </div>
        </div>

        <!-- Col: COOKING -->
        <div
          class="kanban-col"
          @dragover.prevent="onDragOver($event, 'COOKING')"
          @dragleave="onDragLeave"
          @drop="onDrop($event, 'COOKING')"
          :class="{ 'drop-target drop-target--orange': dragTarget === 'COOKING' }"
        >
          <div class="kanban-col-header">
            <div class="w-2 h-2 rounded-full bg-orange-500 animate-bounce"></div>
            <span>Sedang Dimasak</span>
            <span class="col-count">{{ grouped.COOKING.length }}</span>
          </div>
          <div class="kanban-cards">
            <div
              v-for="order in grouped.COOKING"
              :key="order.id"
              class="order-card"
              draggable="true"
              @dragstart="onDragStart($event, order)"
              @dragend="onDragEnd"
            >
              <!-- Order Card -->
              <div class="order-card-inner">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                  <div>
                    <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                      <p style="font-size:9px; font-weight:900; opacity:.4; letter-spacing:.1em; text-transform:uppercase; color:#fff;">#{{ order.id }} · {{ order.table?.name || 'Takeaway' }}</p>
                      <span v-if="order.reservation" style="background:#ef4444; color:#fff; font-size:8px; font-weight:900; padding:2px 4px; border-radius:4px; letter-spacing:.1em;">RESERVASI</span>
                    </div>
                    <p style="font-size:12px; font-weight:900; color:#fff;">{{ order.user?.name || 'Guest' }}</p>
                  </div>
                  <i class="fa-solid fa-grip-dots-vertical" style="color:rgba(255,255,255,.15); font-size:14px;"></i>
                </div>
                <div style="display:flex; flex-direction:column; gap:6px; background:rgba(255,255,255,.03); padding:10px; border-radius:12px;">
                  <div v-for="item in order.items" :key="item.id" style="display:flex; gap:8px; align-items:center;">
                    <span style="font-size:11px; font-weight:900; color:#f97316; min-width:20px;">{{ item.qty }}x</span>
                    <span style="font-size:11px; font-weight:700; color:rgba(255,255,255,.7);">{{ item.menu?.name }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="orderFilter === 'RESERVASI' && !selectedDate" class="empty-col-state">
              <i class="fa-solid fa-calendar-day" style="font-size:36px; margin-bottom:12px;"></i>
              <p>Pilih tanggal reservasi<br/>terlebih dahulu</p>
            </div>
            <div v-else-if="grouped.COOKING.length === 0" class="empty-col-state">
              <i class="fa-solid fa-fire" style="font-size:36px; margin-bottom:12px;"></i>
              <p>Seret pesanan ke sini<br/>untuk mulai masak</p>
            </div>
          </div>
        </div>

        <!-- Col: READY -->
        <div
          class="kanban-col"
          @dragover.prevent="onDragOver($event, 'READY')"
          @dragleave="onDragLeave"
          @drop="onDrop($event, 'READY')"
          :class="{ 'drop-target drop-target--green': dragTarget === 'READY' }"
        >
          <div class="kanban-col-header">
            <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>Siap Saji</span>
            <span class="col-count">{{ grouped.READY.length }}</span>
          </div>
          <div class="kanban-cards">
            <div
              v-for="order in grouped.READY"
              :key="order.id"
              class="order-card"
              draggable="true"
              @dragstart="onDragStart($event, order)"
              @dragend="onDragEnd"
            >
              <!-- Order Card -->
              <div class="order-card-inner">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                  <div>
                    <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                      <p style="font-size:9px; font-weight:900; opacity:.4; letter-spacing:.1em; text-transform:uppercase; color:#fff;">#{{ order.id }} · {{ order.table?.name || 'Takeaway' }}</p>
                      <span v-if="order.reservation" style="background:#ef4444; color:#fff; font-size:8px; font-weight:900; padding:2px 4px; border-radius:4px; letter-spacing:.1em;">RESERVASI</span>
                    </div>
                    <p style="font-size:12px; font-weight:900; color:#fff;">{{ order.user?.name || 'Guest' }}</p>
                  </div>
                  <i class="fa-solid fa-grip-dots-vertical" style="color:rgba(255,255,255,.15); font-size:14px;"></i>
                </div>
                <div style="display:flex; flex-direction:column; gap:6px; background:rgba(255,255,255,.03); padding:10px; border-radius:12px;">
                  <div v-for="item in order.items" :key="item.id" style="display:flex; gap:8px; align-items:center;">
                    <span style="font-size:11px; font-weight:900; color:#10b981; min-width:20px;">{{ item.qty }}x</span>
                    <span style="font-size:11px; font-weight:700; color:rgba(255,255,255,.7);">{{ item.menu?.name }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="orderFilter === 'RESERVASI' && !selectedDate" class="empty-col-state">
              <i class="fa-solid fa-calendar-day" style="font-size:36px; margin-bottom:12px;"></i>
              <p>Pilih tanggal reservasi<br/>terlebih dahulu</p>
            </div>
            <div v-else-if="grouped.READY.length === 0" class="empty-col-state">
              <i class="fa-solid fa-check-circle" style="font-size:36px; margin-bottom:12px;"></i>
              <p>Belum ada hidangan<br/>yang siap saji</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== DETAIL VIEW (single order selected from navbar) ===== -->
    <div v-else-if="currentOrder" class="max-w-2xl mx-auto pt-4">
      <!-- Back hint -->
      <p class="text-white/20 text-[10px] font-black uppercase tracking-widest mb-6">
        <i class="fa-solid fa-arrow-left mr-2"></i>Pilih "Semua Pesanan" di navbar untuk kembali ke papan
      </p>

      <!-- Order Detail Card -->
      <div class="detail-card">
        <!-- Header -->
        <div class="flex items-start justify-between mb-8">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest mb-2" :class="statusTextColor(currentOrder.status)">
              ● {{ statusLabel(currentOrder.status) }}
            </p>
            <h2 class="text-3xl font-black text-white tracking-tight">
              Order #{{ currentOrder.id }}
            </h2>
            <p class="text-white/40 text-xs font-bold mt-1">
              {{ currentOrder.table?.name || 'Takeaway' }} · {{ formatTime(currentOrder.createdAt) }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-white/30 text-[9px] font-black uppercase tracking-widest">Pelanggan</p>
            <p class="text-white font-black text-sm mt-1">{{ currentOrder.user?.name || 'Guest' }}</p>
          </div>
        </div>

        <!-- Item List -->
        <div class="space-y-3 mb-8">
          <p class="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">Daftar Menu</p>
          <div
            v-for="item in currentOrder.items"
            :key="item.id"
            class="item-row"
          >
            <div class="item-qty">{{ item.qty }}x</div>
            <div class="flex-1">
              <p class="text-white font-black text-sm">{{ item.menu?.name }}</p>
              <p class="text-white/30 text-[10px] font-bold">{{ item.menu?.category?.name }}</p>
            </div>
          </div>
        </div>

        <!-- Status Progression — Drag or Click Buttons -->
        <div>
          <p class="text-[10px] font-black text-white/30 uppercase tracking-widest mb-5">Ubah Status Pesanan</p>
          <div class="flex items-center gap-2">
            <button
              v-for="(step, idx) in statusSteps"
              :key="step.value"
              @click="confirmStatusChange(currentOrder, step.value)"
              :disabled="!canTransitionTo(currentOrder.status, step.value)"
              class="status-step-btn"
              :class="{
                'active': currentOrder.status === step.value,
                'done': isStatusBefore(step.value, currentOrder.status),
                'disabled': !canTransitionTo(currentOrder.status, step.value) && currentOrder.status !== step.value
              }"
            >
              <i :class="step.icon + ' mb-1'"></i>
              <span>{{ step.label }}</span>
            </button>
          </div>
          <p class="text-white/20 text-[9px] font-bold mt-4 uppercase tracking-widest">
            <i class="fa-solid fa-circle-info mr-1"></i>
            Klik status berikutnya untuk memperbarui, atau seret kartu di papan utama
          </p>
        </div>
      </div>
    </div>

    <NotificationToast ref="toast" />
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import api from '../../services/api';
import NotificationToast from '../../components/NotificationToast.vue';

// ── Props from KitchenLayout ──────────────────────────────────────────────
const props = defineProps({
  selectedOrderId: { default: null },
  orders: { type: Array, default: () => [] }
});

const emit = defineEmits(['refresh']);
const toast = ref(null);
const orderFilter = ref('ALL');
const selectedDate = ref('');

// ── Computed helpers ──────────────────────────────────────────────────────
const baseActiveOrders = computed(() =>
  props.orders.filter(o => ['PENDING', 'CONFIRMED', 'COOKING', 'READY'].includes(o.status))
);

const reservationCount = computed(() => 
  baseActiveOrders.value.filter(o => o.reservation).length
);

const reservationDateCounts = computed(() => {
  const counts = {};
  baseActiveOrders.value.forEach(o => {
    if (o.reservation?.date) {
      const dateStr = new Date(o.reservation.date).toISOString().split('T')[0];
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    }
  });
  return Object.keys(counts).sort().map(date => ({
    date,
    count: counts[date]
  }));
});

const formatDateLabel = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: '2-digit', month: 'short' }).format(date);
};

const activeOrders = computed(() => {
  if (orderFilter.value === 'RESERVASI') {
    if (!selectedDate.value) return []; // Jangan tampilkan sebelum dipilih
    return baseActiveOrders.value.filter(o => {
      if (!o.reservation) return false;
      if (!o.reservation.date) return true;
      const dateStr = new Date(o.reservation.date).toISOString().split('T')[0];
      return dateStr === selectedDate.value;
    });
  }
  return baseActiveOrders.value;
});

const grouped = computed(() => {
  const g = { CONFIRMED: [], COOKING: [], READY: [] };
  activeOrders.value.forEach(o => {
    const key = o.status === 'PENDING' ? 'CONFIRMED' : o.status;
    if (g[key] !== undefined) g[key].push(o);
  });
  return g;
});

const currentOrder = computed(() =>
  props.orders.find(o => String(o.id) === String(props.selectedOrderId)) || null
);

// ── Status logic ──────────────────────────────────────────────────────────
const statusSteps = [
  { value: 'CONFIRMED', label: 'Antrian', icon: 'fa-solid fa-clock-rotate-left' },
  { value: 'COOKING',   label: 'Dimasak', icon: 'fa-solid fa-fire-burner' },
  { value: 'READY',     label: 'Siap Saji', icon: 'fa-solid fa-utensils' },
  { value: 'COMPLETED', label: 'Selesai', icon: 'fa-solid fa-check' },
];
const statusOrder = ['PENDING', 'CONFIRMED', 'COOKING', 'READY', 'COMPLETED'];

const canTransitionTo = (current, target) => {
  const ci = statusOrder.indexOf(current);
  const ti = statusOrder.indexOf(target);
  return ti === ci + 1;
};

const isStatusBefore = (step, current) => {
  return statusOrder.indexOf(step) < statusOrder.indexOf(current);
};

const statusLabel = (status) => ({
  PENDING: 'Menunggu', CONFIRMED: 'Antrian', COOKING: 'Dimasak', READY: 'Siap Saji', COMPLETED: 'Selesai'
}[status] || status);

const statusTextColor = (status) => ({
  PENDING: 'text-yellow-400', CONFIRMED: 'text-blue-400',
  COOKING: 'text-orange-400', READY: 'text-emerald-400', COMPLETED: 'text-gray-400'
}[status]);

// ── Update status ─────────────────────────────────────────────────────────
const handleStatusUpdate = async (orderId, newStatus) => {
  try {
    await api.put(`/orders/${orderId}/status`, { status: newStatus });
    toast.value?.display(`Pesanan #${orderId} → ${statusLabel(newStatus)} 🍽️`);
    emit('refresh');
  } catch (e) {
    toast.value?.display('Gagal mengubah status pesanan', 'error');
  }
};

const confirmStatusChange = (order, newStatus) => {
  if (!canTransitionTo(order.status, newStatus)) return;
  handleStatusUpdate(order.id, newStatus);
};

// ── Drag and Drop ─────────────────────────────────────────────────────────
const draggingOrder = ref(null);
const dragTarget = ref(null);

const onDragStart = (event, order) => {
  draggingOrder.value = order;
  event.dataTransfer.effectAllowed = 'move';
  event.currentTarget.classList.add('dragging');
};

const onDragEnd = (event) => {
  event.currentTarget.classList.remove('dragging');
  dragTarget.value = null;
  draggingOrder.value = null;
};

const onDragOver = (event, col) => {
  dragTarget.value = col;
  event.dataTransfer.dropEffect = 'move';
};

const onDragLeave = () => {
  dragTarget.value = null;
};

const onDrop = async (event, targetStatus) => {
  dragTarget.value = null;
  if (!draggingOrder.value) return;

  const order = draggingOrder.value;
  draggingOrder.value = null;

  const statusMap = { CONFIRMED: 'CONFIRMED', COOKING: 'COOKING', READY: 'READY' };
  const newStatus = statusMap[targetStatus];

  if (!newStatus || order.status === newStatus) return;

  const ci = statusOrder.indexOf(order.status === 'PENDING' ? 'CONFIRMED' : order.status);
  const ti = statusOrder.indexOf(newStatus);

  if (ti !== ci + 1) {
    toast.value?.display('Status hanya bisa maju satu langkah', 'error');
    return;
  }

  await handleStatusUpdate(order.id, newStatus);
};

// ── Helpers ───────────────────────────────────────────────────────────────
const formatTime = (dateStr) =>
  new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date(dateStr));
</script>

<style scoped>
.kitchen-app {
  background: #0f0f0f;
  color: #fff;
}

/* Stats chips */
.stat-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .08em;
}

/* Kanban board */
.kanban-col {
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.06);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all .2s ease;
}

.kanban-col.drop-target {
  border-color: rgba(59,130,246,.5);
  background: rgba(59,130,246,.06);
  box-shadow: 0 0 0 2px rgba(59,130,246,.15);
}
.kanban-col.drop-target--orange {
  border-color: rgba(249,115,22,.5);
  background: rgba(249,115,22,.06);
  box-shadow: 0 0 0 2px rgba(249,115,22,.15);
}
.kanban-col.drop-target--green {
  border-color: rgba(16,185,129,.5);
  background: rgba(16,185,129,.06);
  box-shadow: 0 0 0 2px rgba(16,185,129,.15);
}

.kanban-col-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 20px;
  border-bottom: 1px solid rgba(255,255,255,.06);
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .12em;
  color: rgba(255,255,255,.7);
  flex-shrink: 0;
}
.col-count {
  margin-left: auto;
  background: rgba(255,255,255,.08);
  width: 24px;
  height: 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 900;
}

.kanban-cards {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scrollbar-width: none;
}
.kanban-cards::-webkit-scrollbar { display: none; }

.order-card {
  transition: all .2s ease;
}
.order-card.dragging {
  opacity: .4;
  transform: scale(.97);
}

.order-card-inner {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 16px;
  padding: 14px 16px;
  transition: all .2s ease;
}
.order-card-inner:hover {
  background: rgba(255,255,255,.06);
  border-color: rgba(255,255,255,.12);
}

/* Detail view */
.detail-card {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 32px;
  padding: 40px;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255,255,255,.03);
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.05);
}
.item-qty {
  font-size: 16px;
  font-weight: 900;
  color: #f97316;
  min-width: 28px;
}

/* Status step buttons */
.status-step-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 8px;
  border-radius: 16px;
  border: 1.5px solid rgba(255,255,255,.08);
  background: rgba(255,255,255,.03);
  color: rgba(255,255,255,.25);
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .1em;
  cursor: pointer;
  transition: all .2s ease;
}
.status-step-btn.done {
  background: rgba(16,185,129,.1);
  border-color: rgba(16,185,129,.2);
  color: rgba(16,185,129,.6);
}
.status-step-btn.active {
  background: rgba(255,255,255,.1);
  border-color: rgba(255,255,255,.3);
  color: #fff;
}
.status-step-btn:not(.disabled):not(.active):not(.done):hover {
  border-color: rgba(255,255,255,.3);
  color: #fff;
  background: rgba(255,255,255,.07);
  transform: translateY(-1px);
}
.status-step-btn.disabled {
  opacity: .25;
  cursor: not-allowed;
}

.empty-col-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  opacity: .15;
  padding: 40px 20px;
  color: #fff;
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .15em;
  line-height: 1.8;
}
</style>
