<template>
  <div class="bg-gray-50/30 min-h-screen pb-32">
    <!-- Header -->
    <div class="px-6 pt-12 pb-6 flex items-center gap-4 bg-white sticky top-0 z-30 border-b border-gray-100">
      <button @click="router.back()" class="p-2 -ml-2 text-gray-400 hover:text-primary transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <h1 class="text-xl font-black text-gray-900 leading-none">Selesaikan <span class="text-primary">Order</span></h1>
    </div>

    <div class="px-6 mt-6">
      <!-- Order Type Selection -->
      <section class="mb-8">
        <h3 class="font-black text-xs text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a2.25 2.25 0 003.182 0l4.318-4.318a2.25 2.25 0 000-3.182L11.159 3.659A2.25 2.25 0 009.568 3z" />
          </svg>
           Metode Makan
        </h3>
        <div class="grid grid-cols-3 gap-3">
           <div 
             @click="orderType = 'DINE_IN'"
             class="relative bg-white p-4 rounded-2xl border-2 transition-all cursor-pointer group active:scale-95"
             :class="orderType === 'DINE_IN' ? 'border-primary shadow-premium' : 'border-gray-100 opacity-60'"
           >
              <div class="bg-primary/10 w-8 h-8 rounded-xl flex items-center justify-center text-primary mb-2">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                 </svg>
              </div>
              <p class="font-bold text-gray-900 text-[10px]">Dine-In</p>
              <div v-if="orderType === 'DINE_IN'" class="absolute -top-1 -right-1 bg-primary text-white p-1 rounded-full shadow-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-2.5 h-2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
           </div>
           
           <div 
             @click="orderType = 'TAKEAWAY'"
             class="relative bg-white p-4 rounded-2xl border-2 transition-all cursor-pointer group active:scale-95"
             :class="orderType === 'TAKEAWAY' ? 'border-primary shadow-premium' : 'border-gray-100 opacity-60'"
           >
              <div class="bg-secondary/10 w-8 h-8 rounded-xl flex items-center justify-center text-secondary mb-2">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <p class="font-bold text-gray-900 text-[10px]">Bungkus</p>
              <div v-if="orderType === 'TAKEAWAY'" class="absolute -top-1 -right-1 bg-primary text-white p-1 rounded-full shadow-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-2.5 h-2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
           </div>

           <div 
             @click="orderType = 'DELIVERY'"
             class="relative bg-white p-4 rounded-2xl border-2 transition-all cursor-pointer group active:scale-95"
             :class="orderType === 'DELIVERY' ? 'border-primary shadow-premium' : 'border-gray-100 opacity-60'"
           >
              <div class="bg-blue-50 w-8 h-8 rounded-xl flex items-center justify-center text-blue-600 mb-2">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <p class="font-bold text-gray-900 text-[10px]">Antar</p>
              <div v-if="orderType === 'DELIVERY'" class="absolute -top-1 -right-1 bg-primary text-white p-1 rounded-full shadow-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-2.5 h-2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
           </div>
        </div>

        <div v-if="orderType === 'DELIVERY'" class="mt-6 transition-all animate-down">
           <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Alamat Pengiriman</h4>
           <textarea 
             v-model="address" 
             placeholder="Masukkan alamat lengkap dunsanak..."
             class="w-full bg-white border-2 border-gray-100 rounded-2xl p-4 text-sm focus:border-primary outline-none transition-all h-24"
           ></textarea>
        </div>
      </section>

      <!-- Payment Method -->
      <section class="mb-8">
        <h3 class="font-black text-xs text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75-3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5h15a2.25 2.25 0 002.25-2.25V14.25" />
          </svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75m0 0a1.5 1.5 0 01-1.5 1.5H2.25M3.75 4.5h1.125c.621 0 1.125.504 1.125 1.125V6M3.75 4.5A1.5 1.5 0 002.25 6m10.5 0h.75m0 0a1.5 1.5 0 011.5 1.5V6m-1.5 0c-.621 0-1.125.504-1.125 1.125v.75m1.5-1.875a1.5 1.5 0 011.5 1.5v.75m-1.5-2.25H12m1.125 11.25c.621 0 1.125.504 1.125 1.125v.75m-1.125-1.875a1.5 1.5 0 00-1.5-1.5H12m1.125 3.375a1.5 1.5 0 011.5-1.5h1.125m-1.125 1.5v-.75m0 0a1.5 1.5 0 00-1.5-1.5H12" />
                </svg>
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
            @click="paymentMethod = 'TRANSFER'"
            class="flex items-center justify-between p-4 bg-white rounded-2xl border-2 transition-all cursor-pointer group active:scale-[0.98]"
            :class="paymentMethod === 'TRANSFER' ? 'border-primary shadow-premium' : 'border-gray-50 opacity-60'"
          >
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                </svg>
              </div>
              <div>
                <p class="font-bold text-gray-900 text-sm">Transfer Bank</p>
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">BCA, Mandiri, BRI</p>
              </div>
            </div>
            <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center" :class="paymentMethod === 'TRANSFER' ? 'border-primary ring-4 ring-primary/10' : 'border-gray-200'">
              <div v-if="paymentMethod === 'TRANSFER'" class="w-3 h-3 bg-primary rounded-full animate-scale-in"></div>
            </div>
          </div>

          <div 
            @click="paymentMethod = 'EWALLET'"
            class="flex items-center justify-between p-4 bg-white rounded-2xl border-2 transition-all cursor-pointer group active:scale-[0.98]"
            :class="paymentMethod === 'EWALLET' ? 'border-primary shadow-premium' : 'border-gray-50 opacity-60'"
          >
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
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
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-40 h-40">
                <path d="M4.5 3.75a.75.75 0 000 1.5h15a.75.75 0 000-1.5h-15zM4.5 18.75a.75.75 0 000 1.5h15a.75.75 0 000-1.5h-15zM4.5 11.25a.75.75 0 000 1.5h15a.75.75 0 000-1.5h-15z" />
              </svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
         </div>
         <p class="text-[11px] text-primary/80 font-medium leading-relaxed">Pastikan pesanan Anda sudah benar. Tekan tombol di bawah untuk masuk ke dapur RM Siantar Minang secara otomatis.</p>
      </div>
    </div>

    <!-- Final CTA -->
    <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/80 backdrop-blur-xl border-t border-gray-100 p-6 z-40">
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
    voucherMessage.value = 'Maaf, kode promo ko indak balaku.';
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
    toast.value?.display('Keranjang dunsanak alun ta-ID. Cubo refresh nante.', 'error');
    return;
  }
  
  // 1. Enforcement for Delivery (Check Auth)
  if (orderType.value === 'DELIVERY') {
    if (!authStore.isAuthenticated) {
       toast.value?.display('Silakan masuak (login) talabiah dahulu untuak layanan Antar.', 'warning');
       setTimeout(() => {
         router.push({ path: '/login', query: { redirect: 'checkout', orderType: 'DELIVERY' } });
       }, 1500);
       return;
    }
    if (!address.value.trim()) {
      toast.value?.display('Alamat pengiriman harus diisi dunsanak.', 'error');
      return;
    }
  }

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
    toast.value?.display('Pesanan dunsanak sadang diproses!');
    
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
    toast.value?.display('Gagal mengirim pesanan, cubo baliak nante.', 'error');
    isSubmitting.value = false;
  }
};
</script>
