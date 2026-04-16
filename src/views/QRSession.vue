<template>
  <div class="bg-white min-h-screen flex flex-col items-center justify-center p-8 text-center overflow-hidden relative">
    <!-- Background Decor -->
    <div class="absolute inset-0 opacity-[0.03] pointer-events-none scale-150 rotate-12">
        <i class="fa-solid fa-star text-[100px]"></i>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 flex flex-col items-center">
       <div class="relative mb-12">
          <div class="bg-primary/10 p-10 rounded-full animate-pulse">
             <div class="bg-primary p-6 rounded-[2rem] text-white shadow-premium rotate-12 scale-110">
                <i class="fa-solid fa-qrcode text-4xl"></i>
             </div>
          </div>
          <div class="absolute -bottom-2 right-0 bg-accent text-white p-2 rounded-xl shadow-lg rotate-[-12deg]">
             <i class="fa-solid fa-check"></i>
          </div>
       </div>

       <h2 class="text-3xl font-black text-gray-900 leading-tight">Membuka Sesi<br/>Untuk <span class="text-primary">Anda</span></h2>
       <p class="text-gray-400 text-sm mt-4 leading-relaxed max-w-[240px]">Saya sedang mengenali meja tempat Anda duduk...</p>

       <!-- Scanning Progress (Mock) -->
       <div class="mt-12 w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-50 shadow-inner">
          <div class="h-full bg-primary animate-[progressBar_2s_ease-in-out_infinite]"></div>
       </div>
       
       <p class="mt-20 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">RM Siantar Minang App</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import NotificationToast from '../components/NotificationToast.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  const tableId = route.query.table_id;
  
  if (tableId) {
    try {
      // Simulate slow loading for "premium" feel
      setTimeout(async () => {
        await authStore.scanTable(tableId);
        router.push('/menu');
      }, 2000);
    } catch (err) {
      console.error('QR activation failed:', err);
      router.push('/');
    }
  } else {
    router.push('/');
  }
});
</script>

<style>
@keyframes progressBar {
  0% { width: 0%; transform: translateX(-100%); }
  50% { width: 100%; transform: translateX(0); }
  100% { width: 0%; transform: translateX(100%); }
}
</style>
