<template>
  <div class="bg-white min-h-screen flex flex-col items-center justify-center p-8 text-center overflow-hidden relative">
    <!-- Background Decor -->
    <div class="absolute inset-0 opacity-[0.03] pointer-events-none scale-150 rotate-12">
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
         <path fill-rule="evenodd" d="M12.964 2.815a.75.75 0 00-1.928 0l-2.43 6.925H3.25a.75.75 0 00-.51 1.348l5.302 4.458-2.02 6.54a.75.75 0 001.157.841L12 19.012l4.82 3.911a.75.75 0 001.159-.84l-2.022-6.54 5.303-4.459a.75.75 0 00-.51-1.347h-5.356l-2.43-6.926z" clip-rule="evenodd" />
       </svg>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 flex flex-col items-center">
       <div class="relative mb-12">
          <div class="bg-primary/10 p-10 rounded-full animate-pulse">
             <div class="bg-primary p-6 rounded-[2rem] text-white shadow-premium rotate-12 scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 16.5h.75v.75h-.75v-.75zM16.5 13.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75zM18.75 13.5h.75v.75h-.75v-.75zM18.75 16.5h.75v.75h-.75v-.75zM13.5 18.75h.75v.75h-.75v-.75zM16.5 18.75h.75v.75h-.75v-.75zM18.75 18.75h.75v.75h-.75v-.75z" />
                </svg>
             </div>
          </div>
          <div class="absolute -bottom-2 right-0 bg-accent text-white p-2 rounded-xl shadow-lg rotate-[-12deg]">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
       </div>

       <h2 class="text-3xl font-black text-gray-900 leading-tight">Mambuka Sesi<br/>Untuak <span class="text-primary">Dunsanak</span></h2>
       <p class="text-gray-400 text-sm mt-4 leading-relaxed max-w-[240px]">Ambo sadang mangenal meja tampek dunsanak duduak...</p>

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
