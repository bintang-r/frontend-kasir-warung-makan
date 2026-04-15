<template>
  <div class="bg-white min-h-screen pb-32">
    <!-- Header -->
    <div class="px-6 pt-12 pb-6 flex items-center gap-4 bg-white sticky top-0 z-30">
      <button @click="router.back()" class="p-2 -ml-2 text-gray-400 hover:text-primary transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <h1 class="text-xl font-black text-gray-900 leading-none">Keranjang <span class="text-primary">Saya</span></h1>
    </div>

    <!-- Cart Content -->
    <div v-if="cartStore.items.length > 0" class="px-6">
      <div class="flex flex-col gap-6 mt-4">
        <div v-for="item in cartStore.items" :key="item.id" class="flex gap-4 group">
          <!-- Item Image -->
          <div class="w-24 h-24 bg-gray-100 rounded-3xl overflow-hidden flex-shrink-0 shadow-card border border-gray-100/50">
             <img v-if="item.menu?.image" :src="item.menu.image" class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
             <div v-else class="flex items-center justify-center h-full text-gray-300">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
              </svg>
             </div>
          </div>
          
          <!-- Item Details -->
          <div class="flex-1 flex flex-col justify-between py-1">
            <div class="flex justify-between items-start gap-2">
               <div>
                  <h3 class="font-bold text-gray-900 text-sm leading-snug">{{ item.menu?.name || 'Menu tidak tersedia' }}</h3>
                  <p class="text-[10px] text-gray-400 font-medium uppercase tracking-tighter mt-1">{{ item.menu?.category?.name || 'Makanan' }}</p>
               </div>
               <button @click="removeItem(item.id)" class="text-gray-300 hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
               </button>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="font-extrabold text-primary text-base">Rp {{ formatPrice(item.menu?.price || 0) }}</span>
              
              <div class="flex items-center bg-gray-100 rounded-xl px-2 py-1">
                <span class="text-xs font-black text-gray-600 px-2">{{ item.quantity }}x</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bill Summary Card -->
      <div class="bg-gray-50 rounded-3xl p-6 mt-12 border border-gray-100">
        <h3 class="font-black text-gray-900 text-sm uppercase tracking-widest mb-4">Ringkasan Pesanan</h3>
        
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 font-medium">Subtotal</span>
            <span class="text-sm font-bold text-gray-800">Rp {{ formatPrice(cartStore.totalPrice) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 font-medium">PPN (11%)</span>
            <span class="text-sm font-bold text-gray-800">Rp 0</span>
          </div>
          <div class="pt-3 mt-3 border-t border-gray-200 flex justify-between items-center">
            <span class="font-black text-xs uppercase tracking-widest text-gray-900">Total Pembayaran</span>
            <span class="font-black text-xl text-primary">Rp {{ formatPrice(cartStore.totalPrice) }}</span>
          </div>
        </div>
      </div>
      
      <div class="mt-8">
        <button @click="router.push('/checkout')" class="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-premium hover:bg-primary-dark transition-all active:scale-95 flex items-center justify-center gap-3">
          <span>Lanjut ke Checkout</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </button>
        <p class="text-center text-[10px] text-gray-400 mt-4 px-8 font-medium">Dengan menekan tombol di atas, Anda menyetujui syarat & ketentuan pesanan di RM Siantar Minang.</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center px-10 py-32 text-center">
      <div class="relative mb-10">
        <div class="bg-primary-surface p-10 rounded-full text-primary scale-125">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-20 h-20 opacity-20">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <div class="absolute inset-0 flex items-center justify-center text-primary font-black text-4xl mt-2 opacity-60">?</div>
      </div>
      <h2 class="text-2xl font-black text-gray-900 leading-tight">Ups, Keranjang<br/>Masih Kosong!</h2>
      <p class="text-gray-400 text-sm mt-3 leading-relaxed">Paru goreng, sambal ijo, dan rendang empuk sudah menunggu dunsanak. Ayo mulai pilih menu!</p>
      <button @click="router.push('/menu')" class="btn-primary mt-8">Cari Menu Terenak</button>
    </div>

    <NotificationToast ref="toast" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import NotificationToast from '../components/NotificationToast.vue';

const cartStore = useCartStore();
const router = useRouter();
const toast = ref(null);

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price);
};

const removeItem = async (itemId) => {
  try {
    await cartStore.removeItem(itemId);
    toast.value?.display('Menu dihapus dari keranjang');
  } catch (err) {
    toast.value?.display('Gagal menghapus menu', 'error');
  }
};

onMounted(() => {
  cartStore.fetchCart();
});
</script>
