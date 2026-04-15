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
          <svg v-if="type === 'success'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
           <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
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
