<template>
  <div class="group bg-white rounded-2xl shadow-card border border-gray-100/50 overflow-hidden flex flex-col transition-all hover:shadow-premium hover:-translate-y-1">
    <!-- Image Wrapper with aspect ratio -->
    <div class="relative aspect-[4/3] overflow-hidden bg-gray-100">
      <img 
        v-if="menu.image" 
        :src="menu.image" 
        :alt="menu.name" 
        class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" 
      />
      <div v-else class="flex items-center justify-center h-full text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>
      
      <!-- Badges -->
      <div v-if="!isAvailable" class="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
        <span class="bg-white/90 px-3 py-1 rounded-full text-gray-900 font-bold text-xs uppercase tracking-wider shadow-lg">Habis</span>
      </div>
      
      <div v-if="menu.isPopular" class="absolute top-3 left-3">
        <span class="bg-secondary text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg">Best Seller</span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex-1 flex flex-col justify-between">
      <div>
        <h3 class="font-bold text-gray-900 text-sm md:text-base leading-snug group-hover:text-primary transition-colors">{{ menu.name }}</h3>
        <p class="text-[11px] md:text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{{ menu.description || 'Kelezatan autentik khas Minang yang menggugah selera.' }}</p>
      </div>
      
      <div class="mt-4 flex items-center justify-between">
        <div class="flex flex-col">
          <span class="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">Harga</span>
          <span class="font-extrabold text-primary text-sm md:text-base">Rp {{ formatPrice(safePrice) }}</span>
        </div>
        
        <button 
          @click="$emit('add-to-cart', menu)"
          :disabled="!isAvailable"
          class="bg-primary text-white p-2 rounded-xl hover:bg-primary-dark disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-md active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  menu: {
    type: Object,
    required: true
  }
});

defineEmits(['add-to-cart']);

const isAvailable = computed(() => {
  // Default to true if the field is missing/null
  if (props.menu.isAvailable === undefined || props.menu.isAvailable === null) return true;
  return props.menu.isAvailable === true || props.menu.isAvailable === 'true';
});

const safePrice = computed(() => {
  const price = props.menu.price;
  if (price === undefined || price === null) return 0;
  
  // Handle the case where price is the mangled {s,e,d} object
  if (typeof price === 'object' && price.d) {
    return Number(price.d[0]) * (price.s || 1);
  }
  
  return typeof price === 'number' ? price : Number(price);
});

const formatPrice = (val) => {
  return new Intl.NumberFormat('id-ID').format(val || 0);
};
</script>
