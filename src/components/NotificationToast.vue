<template>
  <transition
    enter-active-class="transform transition duration-500 ease-out"
    enter-from-class="translate-y-10 opacity-0 scale-95"
    enter-to-class="translate-y-0 opacity-100 scale-100"
    leave-active-class="transform transition duration-300 ease-in"
    leave-from-class="translate-y-0 opacity-100 scale-100"
    leave-to-class="translate-y-10 opacity-0 scale-95"
  >
    <div v-if="visible" class="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-48px)] max-w-xs">
      <div 
        class="rounded-2xl p-4 shadow-premium flex items-center gap-3 border backdrop-blur-md"
        :class="type === 'success' ? 'bg-accent/90 border-accent/20 text-white' : 'bg-red-600/90 border-red-500/20 text-white'"
      >
        <div class="bg-white/20 p-1.5 rounded-lg">
          <i v-if="type === 'success'" class="fa-solid fa-check text-sm"></i>
          <i v-else class="fa-solid fa-circle-exclamation text-sm"></i>
        </div>
        <p class="text-xs font-bold tracking-wide uppercase">{{ message }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue';

const visible = ref(false);
const message = ref('');
const type = ref('success');

const display = (msg, t = 'success') => {
  message.value = msg;
  type.value = t;
  visible.value = true;
  
  setTimeout(() => {
    visible.value = false;
  }, 3000);
};

defineExpose({ display });
</script>
