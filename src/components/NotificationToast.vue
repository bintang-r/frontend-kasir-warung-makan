<template>
  <transition-group
    enter-active-class="transform transition duration-500 ease-out"
    enter-from-class="translate-y-4 opacity-0 scale-95"
    enter-to-class="translate-y-0 opacity-100 scale-100"
    leave-active-class="transform transition duration-300 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-90"
    tag="div"
    :class="containerClasses"
  >
    <div 
      v-for="toast in activeToasts" 
      :key="toast.id"
      class="w-80 rounded-[24px] overflow-hidden shadow-2xl backdrop-blur-xl border pointer-events-auto group"
      :class="toastClasses(toast)"
    >
      <div class="p-5 flex items-start gap-4">
        <div class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg overflow-hidden relative">
           <div class="absolute inset-0 bg-white/20"></div>
           <i :class="iconClasses(toast)" class="relative z-10 text-lg"></i>
        </div>
        <div class="flex-1">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">{{ toast.title || 'Notification' }}</p>
          <p class="text-xs font-bold leading-relaxed tracking-tight">{{ toast.message }}</p>
        </div>
        <button @click="removeToast(toast.id)" class="text-current opacity-20 hover:opacity-100 transition-opacity">
           <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      
      <!-- Progress Bar -->
      <div class="h-1 bg-white/10 w-full relative">
         <div 
           class="absolute top-0 left-0 h-full bg-white/40 transition-all duration-100 ease-linear"
           :style="{ width: `${toast.progress}%` }"
         ></div>
      </div>
    </div>
  </transition-group>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';

const props = defineProps({
  position: {
    type: String,
    default: 'bottom-center' // 'top-right', 'bottom-center'
  }
});

const activeToasts = ref([]);
let toastCounter = 0;

const containerClasses = computed(() => {
  const base = "fixed z-[1000] flex flex-col gap-4 p-6 pointer-events-none w-full max-w-none items-center";
  if (props.position === 'top-right') {
    return `${base} top-0 right-0 items-end`;
  }
  return `${base} bottom-20 left-1/2 -translate-x-1/2`;
});

const toastClasses = (toast) => {
  if (toast.type === 'error') return 'bg-red-600 border-red-500/20 text-white';
  if (toast.type === 'info') return 'bg-blue-600 border-blue-500/20 text-white';
  return 'bg-gray-900 border-white/5 text-white';
};

const iconClasses = (toast) => {
  if (toast.type === 'error') return 'fa-solid fa-triangle-exclamation';
  if (toast.type === 'info') return 'fa-solid fa-circle-info';
  return 'fa-solid fa-check-double';
};

const display = (msg, t = 'success', title = '', duration = 4000) => {
  const id = ++toastCounter;
  const newToast = {
    id,
    message: msg,
    type: t,
    title: title || (t === 'success' ? 'Berhasil' : t === 'error' ? 'Peringatan' : 'Informasi'),
    progress: 100,
    duration
  };

  activeToasts.value.push(newToast);

  const startTime = Date.now();
  const interval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const toastIndex = activeToasts.value.findIndex(t => t.id === id);
    
    if (toastIndex === -1) {
      clearInterval(interval);
      return;
    }

    const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
    activeToasts.value[toastIndex].progress = remaining;

    if (remaining <= 0) {
      clearInterval(interval);
      removeToast(id);
    }
  }, 50);
};

const removeToast = (id) => {
  activeToasts.value = activeToasts.value.filter(t => t.id !== id);
};

onUnmounted(() => {
  activeToasts.value = [];
});

defineExpose({ display });
</script>

<style scoped>
/* Scoped styles if needed */
</style>
