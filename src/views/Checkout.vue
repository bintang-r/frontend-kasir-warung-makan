<template>
  <div class="bg-[#fafafa] min-h-screen pb-40">
    <!-- Header -->
    <div class="px-6 pt-12 pb-6 flex items-center gap-4 bg-white/80 backdrop-blur-xl sticky top-0 z-30 border-b border-gray-100">
      <button @click="router.back()" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all active:scale-90">
         <i class="fa-solid fa-chevron-left"></i>
      </button>
      <div>
         <h1 class="text-xl font-black text-gray-900 leading-none">Checkout <span class="text-primary">Order</span></h1>
         <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Selesaikan rincian pesanan anda</p>
      </div>
    </div>

    <div class="px-6 mt-8 max-w-lg mx-auto">
      <!-- Dining Option -->
      <section class="mb-10">
        <h3 class="font-black text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 px-1">
            <i class="fa-solid fa-utensils text-primary"></i>
            Metode Penyajian
        </h3>
        <div class="grid grid-cols-2 gap-4">
           <button 
             v-for="type in ['DINE_IN', 'TAKEAWAY']" :key="type"
             @click="orderType = type"
             class="relative bg-white p-6 rounded-3xl border-2 transition-all group active:scale-95 text-left overflow-hidden"
             :class="orderType === type ? 'border-primary shadow-xl shadow-primary/5' : 'border-white px-5 opacity-60 grayscale-[0.5]'"
           >
              <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-500">
                 <i :class="type === 'DINE_IN' ? 'fa-solid fa-chair' : 'fa-solid fa-box-archive'" class="text-6xl text-primary"></i>
              </div>
              <div :class="orderType === type ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'" class="w-10 h-10 rounded-2xl flex items-center justify-center mb-3">
                 <i :class="type === 'DINE_IN' ? 'fa-solid fa-shop' : 'fa-solid fa-bag-shopping'" class="text-lg"></i>
              </div>
              <p class="font-black text-gray-900 text-xs tracking-tight">{{ type === 'DINE_IN' ? 'Makan Sini' : 'Bawa Pulang' }}</p>
              <p class="text-[9px] font-bold text-gray-400 mt-0.5">{{ type === 'DINE_IN' ? 'Fresh dari dapur' : 'Kemasan higienis' }}</p>
              <div v-if="orderType === type" class="absolute top-4 right-4 text-primary animate-scale-in">
                 <i class="fa-solid fa-circle-check text-sm"></i>
              </div>
           </button>
        </div>
      </section>

      <!-- Vouchers Section -->
      <section class="mb-10">
         <h3 class="font-black text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 px-1">
             <i class="fa-solid fa-ticket text-primary"></i>
             Kode Voucher (Opsional)
         </h3>
         <div class="flex gap-3">
            <div class="relative flex-1">
               <i class="fa-solid fa-tag absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"></i>
               <input 
                 v-model="voucherCode"
                 placeholder="Masukkan kode promo..."
                 class="w-full bg-white border-2 border-white rounded-3xl py-4 pl-12 pr-6 text-xs font-black placeholder:text-gray-300 outline-none focus:border-primary transition-all shadow-sm shadow-gray-200/50 uppercase tracking-widest"
               />
            </div>
            <button 
               @click="applyVoucher"
               :disabled="!voucherCode || isValidatingVoucher"
               class="px-8 bg-gray-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center min-w-[100px]"
            >
               <span v-if="!isValidatingVoucher">Klaim</span>
               <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </button>
         </div>
         <p v-if="voucherMessage" :class="voucherSuccess ? 'text-emerald-500' : 'text-red-500'" class="text-[10px] font-black uppercase tracking-widest mt-3 ml-2 flex items-center gap-2">
            <i :class="voucherSuccess ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"></i>
            {{ voucherMessage }}
         </p>
      </section>

      <!-- Order Summary Card -->
      <section class="mb-10">
         <div class="bg-white rounded-[40px] p-10 shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
            <div class="absolute -right-10 -top-10 w-48 h-48 bg-gray-50 rounded-full blur-3xl"></div>
            <h3 class="font-black text-xs text-gray-400 uppercase tracking-[0.2em] mb-8 relative z-10">Ringkasan Billing</h3>
            
            <div class="space-y-6 mb-10 relative z-10">
               <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between items-center group">
                  <div class="flex items-center gap-4">
                     <div class="relative">
                        <img :src="item.menu?.image" class="w-12 h-12 rounded-2xl object-cover shadow-sm grayscale group-hover:grayscale-0 transition-all duration-500" />
                        <span class="absolute -top-1 -right-1 bg-gray-900 text-white w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-black border-2 border-white">{{ cartStore.getQty(item) }}</span>
                     </div>
                     <div>
                        <p class="text-xs font-black text-gray-900 leading-tight">{{ item.menu?.name }}</p>
                        <p class="text-[10px] font-bold text-gray-400">@ Rp {{ formatPrice(item.menu?.price) }}</p>
                     </div>
                  </div>
                  <p class="text-xs font-black text-gray-900 tabular-nums">Rp {{ formatPrice(item.menu?.price * cartStore.getQty(item)) }}</p>
               </div>
            </div>

            <div class="space-y-3 pt-6 border-t border-gray-50 relative z-10">
               <div class="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span class="text-gray-600">Rp {{ formatPrice(cartStore.totalPrice) }}</span>
               </div>
               <div v-if="discountAmount > 0" class="flex justify-between text-xs font-black text-emerald-500 uppercase tracking-widest">
                  <span>Potongan Promo</span>
                  <span>- Rp {{ formatPrice(discountAmount) }}</span>
               </div>
               <div class="flex justify-between items-baseline pt-4">
                  <span class="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Total Tagihan</span>
                  <span class="text-3xl font-black text-primary tracking-tighter">Rp {{ formatPrice(finalTotal) }}</span>
               </div>
            </div>
         </div>
      </section>

      <!-- Simple Address/Note -->
      <section class="mb-10">
         <h3 class="font-black text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 px-1">
             <i class="fa-solid fa-comment-dots text-primary"></i>
             Catatan Khusus
         </h3>
         <textarea 
           v-model="address" 
           rows="3" 
           placeholder="E.g. Tanpa pedas, alamat pengantaran, dll..."
           class="w-full bg-white border-2 border-white rounded-[24px] p-6 text-xs font-bold placeholder:text-gray-300 outline-none focus:border-primary transition-all shadow-sm shadow-gray-200/50 resize-none"
         ></textarea>
      </section>

      <!-- Secure Payment Badge -->
      <div class="flex items-center justify-center gap-3 opacity-30 mt-4 h-10 grayscale">
         <img src="https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg" class="h-4" />
         <img src="https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg" class="h-4" />
         <img src="https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg" class="h-4" />
         <div class="w-px h-3 bg-gray-400"></div>
         <span class="text-[8px] font-black uppercase tracking-widest">Secure 256-Bit SSL</span>
      </div>
    </div>

    <!-- Payment Method Selector Sheet (Fixed Bottom) -->
    <div class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-gray-100 p-8 z-[110] rounded-t-[40px] shadow-2xl">
       <div class="max-w-md mx-auto space-y-6">
          <div class="flex items-center justify-between px-2">
             <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Metode Bayar</p>
             <div class="flex gap-2">
                <button 
                   v-for="m in methods" :key="m.val"
                   @click="paymentMethod = m.val"
                   :class="paymentMethod === m.val ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-400'"
                   class="w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90"
                   :title="m.label"
                >
                   <i :class="m.icon"></i>
                </button>
             </div>
          </div>

          <button 
             @click="submitOrder"
             :disabled="isSubmitting"
             class="w-full bg-gray-900 text-white h-16 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 hover:bg-primary"
          >
             <span v-if="!isSubmitting">Buat Pesanan &bull; Rp {{ formatPrice(finalTotal) }}</span>
             <div v-else class="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
          </button>
       </div>
    </div>

    <NotificationToast ref="toast" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useOrderStore } from '../stores/order';
import NotificationToast from '../components/NotificationToast.vue';

const cartStore = useCartStore();
const orderStore = useOrderStore();
const router = useRouter();

const toast = ref(null);
const orderType = ref('DINE_IN');
const paymentMethod = ref('CASH');
const address = ref('');
const voucherCode = ref('');
const voucherMessage = ref('');
const voucherSuccess = ref(false);
const discountAmount = ref(0);
const isValidatingVoucher = ref(false);
const isSubmitting = ref(false);

const methods = [
   { val: 'CASH', icon: 'fa-solid fa-money-bill-wave', label: 'Tunai' },
   { val: 'QRIS', icon: 'fa-solid fa-qrcode', label: 'QRIS' },
   { val: 'TRANSFER', icon: 'fa-solid fa-bank', label: 'Transfer' },
   { val: 'EWALLET', icon: 'fa-solid fa-wallet', label: 'e-Wallet' }
];

const finalTotal = computed(() => {
  return Math.max(0, cartStore.totalPrice - discountAmount.value);
});

const applyVoucher = async () => {
  if (!voucherCode.value) return;
  isValidatingVoucher.value = true;
  voucherMessage.value = '';
  
  try {
    const vc = await orderStore.verifyVoucher(voucherCode.value.toUpperCase());
    if (vc && vc.discount) {
      discountAmount.value = Number(vc.discount);
      voucherSuccess.value = true;
      voucherMessage.value = `Berhasil! Kamu hemat Rp ${formatPrice(discountAmount.value)}`;
    } else {
      throw new Error('Invalid');
    }
  } catch (err) {
    discountAmount.value = 0;
    voucherSuccess.value = false;
    voucherMessage.value = 'Kode voucher tidak valid atau sudah kadaluarsa.';
  } finally {
    isValidatingVoucher.value = false;
  }
};

const submitOrder = async () => {
  if (!cartStore.id) return;
  
  isSubmitting.value = true;
  try {
    const order = await orderStore.placeOrder(
      cartStore.id.toString(), 
      orderType.value, 
      address.value
    );
    
    // Clear and Toast
    cartStore.clearCartLocally();
    toast.value?.display('Pesanan Diterima Dapur! 🥘');
    
    setTimeout(() => {
      if (paymentMethod.value === 'CASH') {
        router.replace('/order-status?id=' + order.id);
      } else {
        router.replace({ 
          path: '/payment/' + order.id, 
          query: { method: paymentMethod.value } 
        });
      }
    }, 2000);
  } catch (err) {
    toast.value?.display('Gagal mengirim pesanan. Silakan periksa koneksi Anda.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price || 0);

onMounted(() => {
  if (cartStore.items.length === 0) router.push('/menu');
});
</script>

<style scoped>
.animate-scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.shadow-premium {
   box-shadow: 0 25px 50px -12px rgba(216, 34, 42, 0.08);
}
.scrollbar-hide::-webkit-scrollbar { display: none; }
</style>
