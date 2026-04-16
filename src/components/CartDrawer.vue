<template>
  <div class="relative">
    <!-- Overlay Backdrop -->
    <transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="cartStore.isCartOpen" 
        @click="cartStore.closeCart"
        class="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[150]"
      ></div>
    </transition>

    <!-- Bottom Sheet -->
    <transition
      enter-active-class="transition-all duration-500 cubic-bezier(0.32, 0.72, 0, 1)"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition-all duration-400 cubic-bezier(0.32, 0.72, 0, 1)"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div 
        v-if="cartStore.isCartOpen" 
        class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white rounded-t-[32px] shadow-2xl z-[160] flex flex-col max-h-[85vh] overflow-hidden border-t-4 border-primary/10"
      >
        <!-- Pull Handle -->
        <div class="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-2"></div>

        <!-- Header -->
        <div class="px-6 py-4 flex items-center justify-between border-b border-gray-50">
          <div>
            <h2 class="text-xl font-black text-gray-900 leading-none">Keranjang Saya</h2>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{{ cartStore.totalItems }} Items</p>
          </div>
          <button 
            @click="cartStore.closeCart"
            class="p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 transition-colors"
          >
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Items List -->
        <div class="flex-1 overflow-y-auto px-6 py-4 space-y-6 scrollbar-hide">
          <div 
            v-for="item in cartStore.items" 
            :key="item.id"
            class="flex items-center gap-4 group"
          >
            <!-- Image -->
            <div class="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
              <img 
                :src="item.menu?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200'" 
                :alt="item.menu?.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-gray-900 text-sm truncate">{{ item.menu?.name }}</h3>
              <p class="text-xs font-extrabold text-primary mt-0.5">Rp {{ formatPrice(item.menu?.price) }}</p>
              
              <!-- Controls -->
              <div class="flex items-center justify-between mt-3">
                <div class="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                  <button 
                    @click="cartStore.updateQuantity(item.id, cartStore.getQty(item) - 1)"
                    class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary transition-colors active:scale-90"
                  >
                    <i class="fa-solid fa-minus text-[10px]"></i>
                  </button>
                  <span class="w-8 text-center text-xs font-black text-gray-900">{{ cartStore.getQty(item) }}</span>
                  <button 
                    @click="cartStore.updateQuantity(item.id, cartStore.getQty(item) + 1)"
                    class="w-8 h-8 flex items-center justify-center text-primary hover:bg-white hover:shadow-sm rounded-lg transition-all active:scale-90"
                  >
                    <i class="fa-solid fa-plus text-[10px]"></i>
                  </button>
                </div>
                
                <button 
                  @click="cartStore.removeItem(item.id)"
                  class="text-gray-300 hover:text-red-500 transition-colors p-2"
                >
                  <i class="fa-solid fa-trash-can text-sm"></i>
                </button>
              </div>
            </div>
          </div>

          <div v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-4">
               <i class="fa-solid fa-bag-shopping text-5xl"></i>
            </div>
            <p class="font-bold text-gray-800">Keranjang Kosong</p>
            <p class="text-xs text-gray-400 mt-1">Silakan cari menu pilihan Anda.</p>
          </div>
        </div>

        <!-- Footer Checkout -->
        <div class="px-6 py-6 bg-white border-t border-gray-50 pb-safe-area shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
          <div class="flex items-center justify-between mb-6">
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Grand Total</p>
              <p class="text-2xl font-black text-gray-900 leading-none mt-1">Rp {{ formatPrice(cartStore.totalPrice) }}</p>
            </div>
            <div class="text-right">
               <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Potongan</p>
               <p class="text-sm font-bold text-green-500 mt-1">Rp 0</p>
            </div>
          </div>

          <button 
            @click="handleCheckout"
            :disabled="cartStore.items.length === 0"
            class="w-full bg-primary text-white py-4 rounded-[20px] font-black text-sm uppercase tracking-widest shadow-premium active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none hover:shadow-premium-hover relative overflow-hidden group"
          >
            <span class="relative z-10">Pesan Sekarang</span>
            <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const router = useRouter();

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price || 0);
};

const handleCheckout = () => {
  cartStore.closeCart();
  router.push('/checkout');
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.pb-safe-area {
  padding-bottom: calc(1.5rem + env(safe-area-inset-bottom));
}
</style>
