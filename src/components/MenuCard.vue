<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
    <!-- Image Placeholder -->
    <div class="h-32 bg-gray-200 relative">
      <img v-if="menu.imageUrl" :src="menu.imageUrl" :alt="menu.name" class="object-cover w-full h-full" />
      <div v-else class="flex items-center justify-center h-full text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>
      <div v-if="!menu.isAvailable" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <span class="text-white font-bold text-sm">Habis</span>
      </div>
    </div>

    <div class="p-3 flex-1 flex flex-col justify-between">
      <div>
        <h3 class="font-semibold text-gray-800 text-sm mb-1 leading-tight">{{ menu.name }}</h3>
        <p class="text-xs text-gray-500 line-clamp-2">{{ menu.description }}</p>
      </div>
      
      <div class="mt-3 flex items-center justify-between">
        <span class="font-bold text-primary text-sm">Rp {{ formatPrice(menu.price) }}</span>
        
        <button 
          @click="$emit('add-to-cart', menu)"
          :disabled="!menu.isAvailable"
          class="bg-primary text-white p-1.5 rounded-lg hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  menu: {
    type: Object,
    required: true
  }
});

defineEmits(['add-to-cart']);

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price);
};
</script>
