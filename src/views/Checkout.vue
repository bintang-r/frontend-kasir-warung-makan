<template>
  <div class="bg-gray-50/30 min-h-screen pb-32">
    <!-- Header -->
    <div class="px-6 pt-12 pb-6 flex items-center gap-4 bg-white sticky top-0 z-30 border-b border-gray-100">
      <button @click="router.back()" class="p-2 -ml-2 text-gray-400 hover:text-primary transition-colors">
         <i class="fa-solid fa-arrow-left"></i>
      </button>
      <h1 class="text-xl font-black text-gray-900 leading-none">Selesaikan <span class="text-primary">Order</span></h1>
    </div>

    <div class="px-6 mt-6">
      <!-- Order Type Selection -->
      <section class="mb-8">
        <h3 class="font-black text-xs text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <i class="fa-solid fa-utensils"></i>
           Metode Makan
        </h3>
        <div class="grid grid-cols-2 gap-3">
           <div 
             @click="orderType = 'DINE_IN'"
             class="relative bg-white p-4 rounded-2xl border-2 transition-all cursor-pointer group active:scale-95"
             :class="orderType === 'DINE_IN' ? 'border-primary shadow-premium' : 'border-gray-100 opacity-60'"
           >
              <div class="bg-primary/10 w-8 h-8 rounded-xl flex items-center justify-center text-primary mb-2">
                 <i class="fa-solid fa-shop text-xl"></i>
              </div>
              <p class="font-bold text-gray-900 text-[10px]">Dine-In</p>
              <div v-if="orderType === 'DINE_IN'" class="absolute -top-1 -right-1 bg-primary text-white p-1 rounded-full shadow-lg">
                 <i class="fa-solid fa-check text-[8px]"></i>
              </div>
           </div>
           
           <div 
             @click="orderType = 'TAKEAWAY'"
             class="relative bg-white p-4 rounded-2xl border-2 transition-all cursor-pointer group active:scale-95"
             :class="orderType === 'TAKEAWAY' ? 'border-primary shadow-premium' : 'border-gray-100 opacity-60'"
           >
              <div class="bg-secondary/10 w-8 h-8 rounded-xl flex items-center justify-center text-secondary mb-2">
                 <i class="fa-solid fa-bag-shopping text-xl"></i>
              </div>
              <p class="font-bold text-gray-900 text-[10px]">Bungkus</p>
              <div v-if="orderType === 'TAKEAWAY'" class="absolute -top-1 -right-1 bg-primary text-white p-1 rounded-full shadow-lg">
                 <i class="fa-solid fa-check text-[8px]"></i>
              </div>
           </div>

           </div>
      </section>

      <!-- Payment Method -->
      <section class="mb-8">
        <h3 class="font-black text-xs text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <i class="fa-solid fa-credit-card"></i>
           Metode Pembayaran
        </h3>
        <div class="space-y-3">
          <div 
            @click="paymentMethod = 'CASH'"
            class="flex items-center justify-between p-4 bg-white rounded-2xl border-2 transition-all cursor-pointer group active:scale-[0.98]"
            :class="paymentMethod === 'CASH' ? 'border-primary shadow-premium' : 'border-gray-50 opacity-60'"
          >
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                <i class="fa-solid fa-money-bill-wave text-xl"></i>
              </div>
              <div>
                <p class="font-bold text-gray-900 text-sm">Tunai / Bayar Ditempat</p>
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Dibayar waktu pesanan sampai</p>
              </div>
            </div>
            <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center" :class="paymentMethod === 'CASH' ? 'border-primary ring-4 ring-primary/10' : 'border-gray-200'">
              <div v-if="paymentMethod === 'CASH'" class="w-3 h-3 bg-primary rounded-full animate-scale-in"></div>
            </div>
          </div>

          <div 
            @click="paymentMethod = 'EWALLET'"
            class="flex items-center justify-between p-4 bg-white rounded-2xl border-2 transition-all cursor-pointer group active:scale-[0.98]"
            :class="paymentMethod === 'EWALLET' ? 'border-primary shadow-premium' : 'border-gray-50 opacity-60'"
          >
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <i class="fa-solid fa-wallet text-xl"></i>
              </div>
              <div>
                <p class="font-bold text-gray-900 text-sm">e-Wallet</p>
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">GOPAY, OVO, DANA, QRIS</p>
              </div>
            </div>
            <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center" :class="paymentMethod === 'EWALLET' ? 'border-primary ring-4 ring-primary/10' : 'border-gray-200'">
              <div v-if="paymentMethod === 'EWALLET'" class="w-3 h-3 bg-primary rounded-full animate-scale-in"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Bill Card -->
      <section class="mb-8">
         <div class="bg-white rounded-3xl p-6 shadow-premium border border-gray-100 overflow-hidden relative">
            <div class="absolute top-0 right-0 p-6 opacity-5 rotate-12 pointer-events-none">
               <i class="fa-solid fa-receipt text-[120px]"></i>
            </div>

            <!-- Detailed Item List -->
            <div class="mb-8 relative z-10">
              <h3 class="font-black text-xs text-gray-400 uppercase tracking-widest mb-4">Rincian Pesanan</h3>
              <div class="space-y-4 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
                <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between items-center text-sm">
                  <div class="flex items-center gap-3">
                    <img :src="item.menu?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=80'" class="w-10 h-10 rounded-xl object-cover shadow-sm" />
                    <div>
                      <p class="font-bold text-gray-900 leading-none mb-1">{{ item.menu?.name }}</p>
                      <p class="text-[10px] font-black text-primary uppercase tracking-widest">{{ cartStore.getQty(item) }}x @ Rp {{ formatPrice(item.menu?.price) }}</p>
                    </div>
                  </div>
                  <p class="font-black text-gray-900">Rp {{ formatPrice(Number(item.menu?.price || 0) * cartStore.getQty(item)) }}</p>
                </div>
              </div>
            </div>

            <h3 class="font-black text-xs text-gray-400 uppercase tracking-widest mb-4">Ringkasan Biaya</h3>
            <div class="flex justify-between items-end">
               <div>
                  <p class="text-[10px] font-black text-gray-300 uppercase leading-none">Subtotal Pesanan</p>
                  <p class="text-2xl font-black text-gray-900 mt-1">Rp {{ formatPrice(cartStore.totalPrice) }}</p>
               </div>
               <div class="bg-gray-100 px-3 py-1.5 rounded-xl font-bold text-[10px] text-gray-500">
                  {{ cartStore.totalItems }} Item
               </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-50 flex gap-4 text-xs">
               <span class="text-accent font-bold">✓ Biaya Layanan Gratis</span>
               <span class="text-accent font-bold">✓ PPN Termasuk</span>
            </div>
         </div>
      </section>

      <!-- Tip Info -->
      <div class="bg-primary/5 rounded-2xl p-4 flex gap-4 items-start border border-primary/10">
         <div class="bg-primary/10 p-2 rounded-xl text-primary">
            <i class="fa-solid fa-circle-info text-2xl"></i>
         </div>
         <p class="text-[11px] text-primary/80 font-medium leading-relaxed">Pastikan pesanan Anda sudah benar. Tekan tombol di bawah untuk masuk ke dapur RM Siantar Minang secara otomatis.</p>
      </div>
    </div>

    <!-- Final CTA -->
    <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/80 backdrop-blur-xl border-t border-gray-100 p-6 z-[110]">
      <button 
        @click="submitOrder" 
        :disabled="isSubmitting" 
        class="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-premium hover:bg-primary-dark transition-all flex justify-center items-center gap-3 disabled:bg-gray-400 active:scale-95"
      >
        <div v-if="isSubmitting" class="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
        <span>{{ isSubmitting ? 'Mengirim Pesanan...' : '🚀 Buat Pesanan Sekarang' }}</span>
      </button>
    </div>
    
    <NotificationToast ref="toast" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { useOrderStore } from '../stores/order';
import NotificationToast from '../components/NotificationToast.vue';

const cartStore = useCartStore();
const authStore = useAuthStore();
const orderStore = useOrderStore();
const router = useRouter();
const route = useRoute();

const toast = ref(null);
const orderType = ref(route.query.orderType || 'DINE_IN');
const paymentMethod = ref('CASH');
const address = ref('');
const voucherCode = ref('');
const voucherMessage = ref('');
const voucherSuccess = ref(false);
const isSubmitting = ref(false);

const totalPrice = computed(() => {
  return cartStore.items.reduce((sum, item) => sum + (Number(item.menu?.price || 0) * cartStore.getQty(item)), 0);
});

const applyVoucher = () => {
  if (!voucherCode.value) return;
  
  if (voucherCode.value.toUpperCase() === 'PROMO10') {
    voucherSuccess.value = true;
    voucherMessage.value = 'Hore! Diskon 10% barusan dipakai.';
  } else {
    voucherSuccess.value = false;
    voucherMessage.value = 'Maaf, kode promo ini tidak berlaku.';
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price);
};

onMounted(() => {
  if (cartStore.items.length === 0) {
    router.push('/cart');
    return;
  }
});

const submitOrder = async () => {
  if (!cartStore.id) {
    toast.value?.display('Keranjang Anda belum memiliki ID. Silakan segarkan halaman.', 'error');
    return;
  }
  
  // 1. Check Auth logic removed since Delivery is removed

  isSubmitting.value = true;
  try {
    const order = await orderStore.placeOrder(
      cartStore.id, 
      orderType.value, 
      address.value || ''
    );
    
    // Clear cart locally
    cartStore.clearCartLocally();
    
    // Success State
    toast.value?.display('Pesanan Anda sedang diproses!');
    
    setTimeout(() => {
      if (paymentMethod.value === 'CASH') {
        router.replace('/order-status?id=' + order.id);
      } else {
        router.replace({ 
          path: '/payment/' + order.id, 
          query: { method: paymentMethod.value } 
        });
      }
    }, 1500);
  } catch (err) {
    console.error('Checkout error:', err);
    toast.value?.display('Gagal mengirim pesanan, silakan coba kembali nanti.', 'error');
    isSubmitting.value = false;
  }
};
</script>
