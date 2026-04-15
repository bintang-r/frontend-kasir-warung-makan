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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
                    </svg>
                  </button>
                  <span class="w-8 text-center text-xs font-black text-gray-900">{{ cartStore.getQty(item) }}</span>
                  <button 
                    @click="cartStore.updateQuantity(item.id, cartStore.getQty(item) + 1)"
                    class="w-8 h-8 flex items-center justify-center text-primary hover:bg-white hover:shadow-sm rounded-lg transition-all active:scale-90"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>
                
                <button 
                  @click="cartStore.removeItem(item.id)"
                  class="text-gray-300 hover:text-red-500 transition-colors p-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <p class="font-bold text-gray-800">Keranjang Kosong</p>
            <p class="text-xs text-gray-400 mt-1">Silekan cari menu pilihan dunsanak.</p>
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
