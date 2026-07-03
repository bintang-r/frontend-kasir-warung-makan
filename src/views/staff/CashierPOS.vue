<template>
  <div class="cashier-pos-page" style="height: calc(100vh - 64px); overflow: hidden">
    <div class="h-full flex gap-0 bg-white">
      <!-- Left: Menu Selection -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header Actions -->
        <div class="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white flex-shrink-0">
          <div class="flex items-center gap-4">
            <button @click="$router.push('/staff/cashier')" class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
            <div>
              <h2 class="text-xl font-black text-gray-900 leading-none">Buat Pesanan Baru</h2>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Pilih menu dan kategori</p>
            </div>
          </div>
          
          <!-- Categories Filter -->
          <div class="flex gap-2 overflow-x-auto scrollbar-hide max-w-xl">
            <button 
              @click="selectedCategory = null"
              class="flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              :class="selectedCategory === null ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
            >
              Semua
            </button>
            <button 
              v-for="cat in categories" :key="cat.id"
              @click="selectedCategory = cat.id"
              class="flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              :class="String(selectedCategory) === String(cat.id) ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
            >
              {{ cat.name }}
            </button>
          </div>
        </div>

        <!-- Menu Grid -->
        <div class="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          <div v-if="isLoading" class="flex justify-center items-center h-32">
            <div class="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
          <div v-else class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div 
              v-for="menu in filteredMenus" :key="menu.id"
              @click="addToLocalCart(menu)"
              class="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm cursor-pointer hover:border-primary hover:shadow-md transition-all active:scale-95 flex flex-col"
            >
              <div class="aspect-square bg-gray-100 rounded-xl mb-3 overflow-hidden">
                <img v-if="menu.image" :src="getImageUrl(menu.image)" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <i class="fa-solid fa-bowl-food text-gray-300 text-2xl"></i>
                </div>
              </div>
              <h3 class="font-black text-xs text-gray-900 leading-tight mb-1">{{ menu.name }}</h3>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ menu.category?.name }}</p>
              <p class="font-black text-primary text-sm mt-auto pt-2">Rp {{ formatPrice(menu.price) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Cart & Checkout -->
      <div class="w-[360px] bg-white border-l border-gray-100 flex flex-col flex-shrink-0 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)]">
        <div class="px-6 py-5 border-b border-gray-100 bg-gray-900 text-white flex-shrink-0 flex justify-between items-center">
          <h3 class="font-black text-sm uppercase tracking-widest">Detail Pesanan</h3>
          <span class="bg-white/10 px-2 py-1 rounded-md text-[9px] font-black uppercase">{{ localCart.length }} Items</span>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <div v-if="localCart.length === 0" class="flex flex-col items-center justify-center h-full text-gray-300 opacity-50">
            <i class="fa-solid fa-basket-shopping text-5xl mb-4"></i>
            <p class="text-[10px] font-black uppercase tracking-widest">Keranjang Kosong</p>
          </div>
          
          <div v-else v-for="item in localCart" :key="item.menu.id" class="flex flex-col gap-2 bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
            <div class="flex justify-between items-start">
              <p class="text-xs font-black text-gray-900 leading-tight flex-1 pr-2">{{ item.menu.name }}</p>
              <p class="text-xs font-black text-primary tabular-nums">Rp {{ formatPrice(item.menu.price * item.qty) }}</p>
            </div>
            <div class="flex items-center justify-between mt-1">
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">@ Rp {{ formatPrice(item.menu.price) }}</p>
              <div class="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-0.5">
                <button @click="updateLocalQty(item.menu.id, -1)" class="w-6 h-6 rounded-md bg-gray-50 text-gray-500 hover:text-red-500 flex items-center justify-center transition-colors">
                  <i class="fa-solid" :class="item.qty === 1 ? 'fa-trash text-[10px]' : 'fa-minus text-[10px]'"></i>
                </button>
                <span class="text-xs font-black w-4 text-center">{{ item.qty }}</span>
                <button @click="updateLocalQty(item.menu.id, 1)" class="w-6 h-6 rounded-md bg-gray-50 text-gray-500 hover:text-emerald-500 flex items-center justify-center transition-colors">
                  <i class="fa-solid fa-plus text-[10px]"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Checkout Section -->
        <div class="p-6 border-t border-gray-100 bg-white">
          <div class="space-y-4 mb-5">
            <!-- Customer Name -->
            <div>
               <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                 <i class="fa-solid fa-user"></i> Nama Pemesan
               </p>
               <input type="text" v-model="customerNotes" placeholder="Contoh: Atas nama Budi" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-primary transition-all focus:bg-white focus:ring-4 focus:ring-primary/5" />
            </div>

            <!-- Type -->
            <div>
              <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <i class="fa-solid fa-utensils"></i> Tipe Pesanan
              </p>
              <div class="flex gap-2">
                <button @click="orderType = 'DINE_IN'" class="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2" :class="orderType === 'DINE_IN' ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'">Makan Sini</button>
                <button @click="orderType = 'TAKEAWAY'" class="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2" :class="orderType === 'TAKEAWAY' ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'">Bungkus</button>
              </div>
            </div>
            
            <!-- Table Input (if Dine in) -->
            <div v-if="orderType === 'DINE_IN'" class="animate-in fade-in slide-in-from-top-2">
               <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                 <i class="fa-solid fa-chair"></i> Pilih Meja
               </p>
               <select v-model="selectedTableId" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-primary transition-all focus:bg-white focus:ring-4 focus:ring-primary/5">
                  <option :value="null">Pilih Meja...</option>
                  <option v-for="t in tables" :key="t.id" :value="t.id">{{ t.name }}</option>
               </select>
            </div>
          </div>

          <div class="flex justify-between items-end mb-5 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Tagihan</span>
            <span class="text-2xl font-black text-primary tracking-tighter">Rp {{ formatPrice(totalPrice) }}</span>
          </div>

          <div class="flex gap-2">
            <button 
              @click="submitOrder(false)"
              :disabled="localCart.length === 0 || isSubmitting"
              class="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm active:scale-95 border-2 border-gray-200"
              :class="localCart.length > 0 && !isSubmitting ? 'bg-white text-gray-600 hover:border-gray-400' : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'"
            >
              Simpan Antrean
            </button>
            <button 
              @click="submitOrder(true)"
              :disabled="localCart.length === 0 || isSubmitting"
              class="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              :class="localCart.length > 0 && !isSubmitting ? 'bg-gray-900 text-white hover:bg-black shadow-gray-900/20' : 'bg-gray-300 text-white cursor-not-allowed'"
            >
              <div v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <template v-else>
                <i class="fa-solid fa-money-bill-wave text-emerald-400"></i> Bayar Langsung
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Direct Payment Modal -->
  <div v-if="showPaymentModal && currentCreatedOrder" class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-sm transition-all">
    <div class="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
      
      <!-- Payment Header -->
      <div class="bg-gray-900 text-white px-8 pt-8 pb-6 relative">
        <button @click="showPaymentModal = false" class="absolute top-6 right-6 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>
        <p class="text-[10px] font-black text-white/40 uppercase tracking-widest">Total Pembayaran</p>
        <h3 class="text-4xl font-black mt-1 tracking-tighter">Rp {{ formatPrice(currentCreatedOrder.totalPrice) }}</h3>
        <p class="text-white/50 text-[10px] font-bold mt-2 uppercase tracking-widest">
          Order #{{ currentCreatedOrder.id }} · {{ customerNotes || 'Guest' }}
        </p>
      </div>

      <!-- Payment Method -->
      <div class="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
        <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Pilih Metode Pembayaran</p>
        <div class="grid grid-cols-4 gap-2">
          <button 
            v-for="m in paymentMethods" :key="m.value"
            @click="selectedMethod = m.value"
            class="py-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all"
            :class="selectedMethod === m.value ? 'bg-white border-primary shadow-md shadow-primary/10' : 'bg-white border-gray-100 hover:border-gray-200'"
          >
            <i :class="[m.icon, 'text-lg', selectedMethod === m.value ? 'text-primary' : 'text-gray-400']"></i>
            <span class="text-[9px] font-black uppercase tracking-widest" :class="selectedMethod === m.value ? 'text-gray-900' : 'text-gray-400'">{{ m.label }}</span>
          </button>
        </div>
      </div>

      <!-- Cash Calculator -->
      <div v-if="selectedMethod === 'CASH'" class="px-8 py-6">
        <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Uang Diterima (Rp)</p>
        <div class="relative mb-4">
          <input 
            type="number" 
            v-model.number="cashReceived"
            class="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl py-4 pl-4 pr-12 text-2xl font-black outline-none focus:border-emerald-500 focus:bg-white transition-all focus:ring-4 focus:ring-emerald-500/10 text-right tabular-nums"
          />
        </div>
        
        <!-- Quick cash buttons -->
        <div class="grid grid-cols-3 gap-2 mb-4">
          <button v-for="q in quickCashOptions" :key="q" @click="cashReceived = q" class="py-2.5 bg-gray-100 rounded-xl text-xs font-black text-gray-600 hover:bg-gray-200 transition-colors">
            {{ formatPrice(q) }}
          </button>
          <button @click="cashReceived = Number(currentCreatedOrder.totalPrice)" class="py-2.5 bg-emerald-50 rounded-xl text-xs font-black text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-colors">
            Uang Pas
          </button>
        </div>

        <!-- Change Indicator -->
        <div v-if="cashReceived > 0" class="p-4 rounded-2xl flex justify-between items-center transition-all" :class="change >= 0 ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'">
           <span class="text-[10px] font-black uppercase tracking-widest" :class="change >= 0 ? 'text-emerald-600' : 'text-red-500'">
             {{ change >= 0 ? 'Kembalian' : 'Kurang' }}
           </span>
           <span class="text-lg font-black tabular-nums" :class="change >= 0 ? 'text-emerald-600' : 'text-red-500'">
             Rp {{ formatPrice(Math.abs(change)) }}
           </span>
        </div>
      </div>

      <!-- Confirm Button -->
      <div class="p-6 bg-white border-t border-gray-100 mt-auto">
        <button 
          @click="processDirectPayment"
          :disabled="isProcessingPayment || (selectedMethod === 'CASH' && change < 0)"
          class="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
          :class="isProcessingPayment || (selectedMethod === 'CASH' && change < 0) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-emerald-500 text-white shadow-emerald-500/30 hover:bg-emerald-600'"
        >
          <div v-if="isProcessingPayment" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <template v-else>
            <i class="fa-solid fa-check-double"></i> Konfirmasi Pembayaran
          </template>
        </button>
      </div>
    </div>
  </div>

  <!-- ===== RECEIPT MODAL (POPUP) ===== -->
  <div
    v-if="showReceiptModal && lastOrderSnapshot"
    class="fixed inset-0 z-[250] flex items-center justify-center p-6 no-print"
  >
    <div class="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" @click="closeReceipt"></div>

    <div class="relative bg-white w-full max-w-sm rounded-[32px] overflow-hidden flex flex-col items-center animate-in fade-in zoom-in duration-300">
      <div class="p-8 pb-4 text-center">
        <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fa-solid fa-check text-2xl"></i>
        </div>
        <h3 class="text-xl font-black text-gray-900">Pembayaran Selesai</h3>
        <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Struk siap dicetak</p>
      </div>

      <div class="w-full px-8 overflow-y-auto max-h-[40vh] py-2">
        <div class="bg-gray-50 rounded-2xl p-6 border border-dashed border-gray-200 text-[#1a1a1a] font-mono text-[11px] leading-relaxed">
          <div class="text-center mb-4 pb-4 border-b border-dashed border-gray-200">
            <p class="font-bold text-[14px]">RM SIANTAR MINANG</p>
            <p>Jl. Jendral Sudirman No. 123</p>
            <p>Telp: (021) 555-0123</p>
          </div>

          <div class="mb-4">
            <div class="flex justify-between">
              <span>Ref: #{{ lastOrderSnapshot.id }}</span>
              <span>{{ new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) }}</span>
            </div>
            <p>Kasir: {{ authStore.user?.name || "Staff" }}</p>
            <p>Meja: {{ lastOrderSnapshot.table?.name || lastOrderSnapshot.orderType }}</p>
            <p>Pelanggan: {{ lastOrderSnapshot.address || lastOrderSnapshot.user?.name || "Guest" }}</p>
          </div>

          <div class="space-y-1 mb-4 pb-4 border-b border-dashed border-gray-200">
            <div v-for="item in lastOrderSnapshot.items" :key="item.id" class="flex justify-between items-start gap-4">
              <span class="flex-1">{{ item.qty }}x {{ item.menu?.name }}</span>
              <span class="whitespace-nowrap">{{ formatPrice(Number(item.price) * item.qty) }}</span>
            </div>
          </div>

          <div class="space-y-1">
            <div class="flex justify-between font-bold">
              <span>TOTAL</span>
              <span>Rp {{ formatPrice(lastOrderSnapshot.totalPrice) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Metode</span>
              <span>{{ lastPaymentSnapshot?.method }}</span>
            </div>
            <template v-if="lastPaymentSnapshot?.method === 'CASH'">
              <div class="flex justify-between">
                <span>Bayar</span>
                <span>Rp {{ formatPrice(lastPaymentSnapshot.received) }}</span>
              </div>
              <div class="flex justify-between font-bold border-t border-dashed border-gray-200 pt-1 mt-1">
                <span>Kembali</span>
                <span>Rp {{ formatPrice(lastPaymentSnapshot.change) }}</span>
              </div>
            </template>
          </div>

          <div class="mt-6 text-center pt-4 border-t border-dashed border-gray-200 opacity-50">
            <p>TERIMA KASIH</p>
            <p>SELAMAT MENIKMATI</p>
          </div>
        </div>
      </div>

      <div class="w-full p-8 flex flex-col gap-3">
        <button @click="printReceipt" class="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all flex items-center justify-center gap-2">
          <i class="fa-solid fa-print"></i> Cetak Struk
        </button>
        <button @click="closeReceipt" class="w-full bg-gray-50 text-gray-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-gray-600 transition-all">
          Selesai & Tutup
        </button>
      </div>
    </div>
  </div>

  <!-- PRINTABLE RECEIPT HIDDEN DOM -->
  <div id="printable-receipt" class="hidden">
    <div class="print-wrapper">
      <div v-if="lastOrderSnapshot" class="receipt">
        <div class="center bold title">RM SIANTAR MINANG</div>
        <div class="center small">Cita Rasa Autentik Minang</div>
        <div class="center small">Jl. Jendral Sudirman No. 123</div>
        <div class="center small">(021) 555-0123</div>
        <div class="divider">--------------------------------</div>
        
        <div class="row">
          <span>ID</span><span>#{{ lastOrderSnapshot.id }}</span>
        </div>
        <div class="row">
          <span>Tanggal</span><span>{{ new Date().toLocaleString("id-ID") }}</span>
        </div>
        <div class="row">
          <span>Meja</span><span>{{ lastOrderSnapshot.table?.name || lastOrderSnapshot.orderType }}</span>
        </div>
        <div class="row">
          <span>Kasir</span><span>{{ authStore.user?.name || "Staff" }}</span>
        </div>
        <div class="row">
          <span>Pelanggan</span><span>{{ lastOrderSnapshot.address || lastOrderSnapshot.user?.name || "Guest" }}</span>
        </div>

        <div class="divider">--------------------------------</div>

        <div class="items">
          <div v-for="item in lastOrderSnapshot.items" :key="item.id" class="item">
            <div class="item-name">{{ item.menu?.name }}</div>
            <div class="row">
              <span>{{ item.qty }} x {{ formatPrice(item.price) }}</span>
              <span>{{ formatPrice(item.qty * item.price) }}</span>
            </div>
          </div>
        </div>

        <div class="divider">--------------------------------</div>

        <div class="row bold total">
          <span>TOTAL</span><span>Rp {{ formatPrice(lastOrderSnapshot.totalPrice) }}</span>
        </div>
        <div class="row">
          <span>Metode</span><span>{{ lastPaymentSnapshot?.method }}</span>
        </div>
        <template v-if="lastPaymentSnapshot?.method === 'CASH'">
          <div class="row">
            <span>Bayar</span><span>Rp {{ formatPrice(lastPaymentSnapshot.received) }}</span>
          </div>
          <div class="row bold">
            <span>Kembali</span><span>Rp {{ formatPrice(lastPaymentSnapshot.change) }}</span>
          </div>
        </template>

        <div class="divider">--------------------------------</div>
        <div class="center small">Terima kasih 🙏</div>
        <div class="center small">Selamat menikmati</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import api, { getImageUrl } from '../../services/api';
import { useOrderStore } from '../../stores/order';
import { useAuthStore } from '../../stores/auth';
import printJS from 'print-js';

const router = useRouter();
const authStore = useAuthStore();
const orderStore = useOrderStore();
const cashierToast = inject('cashierToast', ref(null));

const menus = ref([]);
const categories = ref([]);
const tables = ref([]);
const isLoading = ref(true);

const selectedCategory = ref(null);
const orderType = ref('DINE_IN');
const selectedTableId = ref(null);
const customerNotes = ref('');

const localCart = ref([]);
const isSubmitting = ref(false);

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price || 0);

const fetchInitialData = async () => {
  try {
    isLoading.value = true;
    const [menuRes, catRes, tablesRes] = await Promise.all([
      api.get('/menus'),
      api.get('/categories'),
      api.get('/tables')
    ]);
    menus.value = menuRes.data;
    categories.value = catRes.data;
    tables.value = tablesRes.data.filter(t => t.status === 'AKTIF');
  } catch (error) {
    console.error('Failed to fetch data:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchInitialData();
});

const filteredMenus = computed(() => {
  if (!selectedCategory.value) return menus.value;
  return menus.value.filter(m => String(m.categoryId) === String(selectedCategory.value));
});

const addToLocalCart = (menu) => {
  const existing = localCart.value.find(i => i.menu.id === menu.id);
  if (existing) {
    existing.qty += 1;
  } else {
    localCart.value.push({ menu, qty: 1 });
  }
};

const updateLocalQty = (menuId, change) => {
  const index = localCart.value.findIndex(i => i.menu.id === menuId);
  if (index !== -1) {
    localCart.value[index].qty += change;
    if (localCart.value[index].qty <= 0) {
      localCart.value.splice(index, 1);
    }
  }
};

const totalPrice = computed(() => {
  return localCart.value.reduce((total, item) => total + (item.menu.price * item.qty), 0);
});

// Direct Payment State
const showPaymentModal = ref(false);
const currentCreatedOrder = ref(null);
const selectedMethod = ref('CASH');
const cashReceived = ref(0);
const isProcessingPayment = ref(false);

const paymentMethods = [
  { value: 'CASH', label: 'Tunai', icon: 'fa-solid fa-money-bill-wave' },
  { value: 'QRIS', label: 'QRIS', icon: 'fa-solid fa-qrcode' },
  { value: 'TRANSFER', label: 'Transfer', icon: 'fa-solid fa-building-columns' },
  { value: 'EDC', label: 'Mesin EDC', icon: 'fa-solid fa-credit-card' },
];

const change = computed(() => {
  if (!currentCreatedOrder.value) return 0;
  return cashReceived.value - Number(currentCreatedOrder.value.totalPrice);
});

const quickCashOptions = computed(() => {
  if (!currentCreatedOrder.value) return [];
  const total = Number(currentCreatedOrder.value.totalPrice);
  const options = [];
  
  if (total <= 50000) options.push(50000);
  if (total <= 100000) options.push(100000);
  if (total <= 150000) options.push(150000);
  if (total <= 200000) options.push(200000);
  
  // Calculate nearest rounding (e.g. 83.000 -> 85.000, 90.000)
  const round5k = Math.ceil(total / 5000) * 5000;
  const round10k = Math.ceil(total / 10000) * 10000;
  
  if (round5k > total && !options.includes(round5k)) options.unshift(round5k);
  if (round10k > total && !options.includes(round10k)) options.unshift(round10k);
  
  return Array.from(new Set(options)).sort((a,b)=>a-b).slice(0,2); // Keep only 2 quick options + exact cash
});

const submitOrder = async (payDirectly = false) => {
  if (localCart.value.length === 0) return;
  if (orderType.value === 'DINE_IN' && !selectedTableId.value) {
    if (cashierToast?.value) cashierToast.value.display('Pilih meja terlebih dahulu', 'error');
    else alert('Pilih meja terlebih dahulu');
    return;
  }
  if (!customerNotes.value.trim()) {
    if (cashierToast?.value) cashierToast.value.display('Silakan isi Nama Pemesan', 'error');
    else alert('Silakan isi Nama Pemesan');
    return;
  }

  isSubmitting.value = true;
  try {
    // 1. Clear any existing backend cart for this staff member
    try {
      const cartRes = await api.get('/cart');
      if (cartRes.data && cartRes.data.items?.length > 0) {
         for(let item of cartRes.data.items) {
           await api.delete(`/cart/remove/${item.id}`);
         }
      }
    } catch (e) {
      console.log('Error clearing backend cart, ignoring');
    }
    
    // 2. Sync local cart items to backend cart
    for (const item of localCart.value) {
      await api.post('/cart/add', { menuId: item.menu.id.toString(), qty: item.qty });
    }
    
    // 3. Fetch the cart to get its ID
    const newCartRes = await api.get('/cart');
    const cartId = newCartRes.data.id;
    
    // 4. Place Order (customerNotes is stored in address field for now so it shows up)
    const newOrder = await orderStore.placeOrder(
      cartId.toString(),
      orderType.value,
      customerNotes.value, 
      selectedTableId.value
    );
    
    if (payDirectly) {
      // Store created order and open modal
      currentCreatedOrder.value = newOrder;
      showPaymentModal.value = true;
      cashReceived.value = Number(newOrder.totalPrice); // default to exact amount
    } else {
      // Just save to queue
      if (cashierToast?.value) cashierToast.value.display('Pesanan berhasil masuk antrean!', 'success');
      router.push('/staff/cashier');
    }

  } catch (error) {
    console.error('Checkout error:', error);
    if (cashierToast?.value) cashierToast.value.display('Gagal membuat pesanan', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const processDirectPayment = async () => {
  if (!currentCreatedOrder.value) return;
  if (selectedMethod.value === 'CASH' && change.value < 0) return;

  isProcessingPayment.value = true;
  try {
    await api.post('/payments', {
      orderId: currentCreatedOrder.value.id.toString(),
      method: selectedMethod.value,
      amount: currentCreatedOrder.value.totalPrice
    });

    // Save snapshots for receipt
    lastOrderSnapshot.value = JSON.parse(JSON.stringify(currentCreatedOrder.value));
    lastPaymentSnapshot.value = {
      method: selectedMethod.value,
      received: cashReceived.value,
      change: selectedMethod.value === 'CASH' ? cashReceived.value - Number(currentCreatedOrder.value.totalPrice) : 0
    };

    if (cashierToast?.value) cashierToast.value.display(`Pembayaran Order #${currentCreatedOrder.value.id} Berhasil!`, 'success');
    
    showPaymentModal.value = false;
    showReceiptModal.value = true;
  } catch (e) {
    console.error('Payment error', e);
    if (cashierToast?.value) cashierToast.value.display('Gagal memproses pembayaran', 'error');
  } finally {
    isProcessingPayment.value = false;
  }
};

const showReceiptModal = ref(false);
const lastOrderSnapshot = ref(null);
const lastPaymentSnapshot = ref(null);

const printReceipt = async () => {
  await nextTick();
  setTimeout(() => {
    printJS({
      printable: "printable-receipt",
      type: "html",
      targetStyles: ["*"],
      scanStyles: false,
      style: `
        @page { size: 72mm auto; margin: 0; }
        html, body { margin: 0; padding: 0; width: 72mm; display: flex; justify-content: center; background: white; }
        #printable-receipt { width: 72mm; margin: 0 auto; padding: 8px; font-family: 'Courier New', monospace; font-size: 11px; color: black; display: block !important; }
        .center { text-align: center; }
        .row { display: flex; justify-content: space-between; }
        .bold { font-weight: bold; }
        .divider { text-align: center; margin: 6px 0; }
        .hidden { display: none; }
      `,
    });
  }, 300);
};

const closeReceipt = () => {
  showReceiptModal.value = false;
  currentCreatedOrder.value = null;
  localCart.value = [];
  customerNotes.value = '';
  router.push('/staff/cashier');
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
