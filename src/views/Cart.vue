<template>
  <div class="p-4 bg-gray-50 min-h-screen">
    <div class="flex items-center mb-6 pt-2">
      <router-link to="/menu" class="p-2 -ml-2 text-gray-500 hover:text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </router-link>
      <h2 class="text-xl font-bold ml-2">Keranjang Pesanan</h2>
    </div>

    <div v-if="cartStore.items.length > 0" class="flex flex-col gap-4">
      <!-- Item List -->
      <div v-for="item in cartStore.items" :key="item.id" class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
        <!-- Mock image if menu doesn't have one -->
        <div class="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
           <img v-if="item.menu?.imageUrl" :src="item.menu.imageUrl" class="object-cover w-full h-full" />
           <div v-else class="flex items-center justify-center h-full text-gray-300">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
               <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
             </svg>
           </div>
        </div>
        
        <div class="flex-1 flex flex-col justify-between">
          <div>
             <h3 class="font-semibold text-gray-800 text-sm">{{ item.menu?.name || 'Menu tidak tersedia' }}</h3>
             <p class="text-primary font-bold text-sm mt-1">Rp {{ formatPrice(item.menu?.price || 0) }}</p>
          </div>
          
          <div class="flex items-center justify-between mt-2">
            <button @click="removeItem(item.id)" class="text-red-400 text-xs hover:text-red-600 font-medium tracking-wide">
              HAPUS
            </button>
            <div class="flex items-center gap-3 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
              <span class="text-sm font-semibold w-6 text-center">{{ item.quantity }}x</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bill Detail -->
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-4">
        <h3 class="font-bold text-gray-800 mb-3 border-b pb-2">Rincian Pembayaran</h3>
        <div class="flex justify-between text-sm text-gray-600 mb-2">
          <span>Subtotal Menu</span>
          <span>Rp {{ formatPrice(cartStore.totalPrice) }}</span>
        </div>
        <div class="flex justify-between font-bold text-lg text-gray-800 mt-3 pt-3 border-t">
          <span>Total</span>
          <span class="text-primary">Rp {{ formatPrice(cartStore.totalPrice) }}</span>
        </div>
      </div>

      <button @click="router.push('/checkout')" class="w-full bg-primary text-white py-3.5 rounded-xl mt-4 font-semibold hover:bg-primary-hover shadow-md transition-colors">
        Lanjut ke Pembayaran
      </button>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col flex-1 items-center justify-center p-8 mt-12 text-center">
      <div class="bg-red-50 p-6 rounded-full text-primary/30 mb-4">
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>
      <h3 class="font-bold text-gray-800 text-lg mb-1">Keranjang Masih Kosong</h3>
      <p class="text-gray-500 text-sm mb-6">Pilih menu terenak dari RM Siantar Minang favoritmu!</p>
      <router-link to="/menu" class="bg-primary text-white px-6 py-2.5 rounded-full font-medium hover:bg-primary-hover transition-colors shadow-sm">
        Mulai Belanja
      </router-link>
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
