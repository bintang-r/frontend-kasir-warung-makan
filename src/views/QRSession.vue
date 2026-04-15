<template>
  <div class="p-4 flex flex-col items-center justify-center min-h-[70vh]">
    <h2 class="text-xl font-bold mb-4 text-center text-primary">Menyiapkan Meja...</h2>
    <div class="animate-pulse flex items-center justify-center p-8 bg-red-50 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-primary animate-bounce">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
      </svg>
    </div>
    <p class="text-gray-500 mt-4 max-w-xs text-center">Mohon tunggu sebentar, kami sedang memproses sesi Anda.</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  const tableId = route.query.table_id;
  if (!tableId) {
    router.push('/');
    return;
  }

  try {
    const response = await api.post('/guest/scan', { tableId });
    if (response.data && response.data.guest_token) {
      authStore.setGuestSession(response.data.guest_token, tableId);
      router.push('/menu');
    } else {
      router.push('/');
    }
  } catch (error) {
    console.error('Failed to create guest session', error);
    alert('Gagal mendeteksi QRCode meja.');
    router.push('/');
  }
});
</script>

