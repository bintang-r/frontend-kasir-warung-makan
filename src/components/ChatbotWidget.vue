<template>
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Chat Popup -->
    <div v-if="isOpen" class="mb-4 bg-white w-72 rounded-xl shadow-xl border border-gray-200 overflow-hidden flex flex-col h-96">
      <div class="bg-primary text-white p-3 flex justify-between items-center">
        <h3 class="font-bold">CS RM Siantar Minang</h3>
        <button @click="toggleChat" class="text-white hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="flex-1 p-3 overflow-y-auto bg-gray-50 flex flex-col gap-2">
        <!-- Messages -->
        <div v-for="(msg, idx) in messages" :key="idx" 
          class="max-w-[85%] rounded-lg p-2 text-sm"
          :class="msg.sender === 'user' ? 'bg-primary text-white self-end rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 self-start rounded-tl-none'">
          {{ msg.text }}
        </div>
      </div>
      
      <form @submit.prevent="sendMessage" class="p-2 border-t border-gray-200 bg-white flex gap-2">
        <input v-model="inputText" type="text" placeholder="Ketik pesan..." class="flex-1 bg-gray-100 rounded-full px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary text-sm" />
        <button type="submit" class="bg-primary text-white rounded-full p-1.5 hover:bg-primary-hover" :disabled="!inputText.trim()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </form>
    </div>

    <!-- Toggle Button -->
    <button @click="toggleChat" class="bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-hover hover:-translate-y-1 transition-all duration-200">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../services/api';

const isOpen = ref(false);
const inputText = ref('');
const messages = ref([
  { sender: 'bot', text: 'Halo! Ada yang bisa saya bantu dengan pesanan Anda hari ini?' }
]);

const toggleChat = () => {
  isOpen.value = !isOpen.value;
};

const sendMessage = async () => {
  if (!inputText.value.trim()) return;
  
  const text = inputText.value;
  messages.value.push({ sender: 'user', text });
  inputText.value = '';
  
  try {
    const response = await api.post('/chatbot/message', { message: text });
    messages.value.push({ sender: 'bot', text: response.data.response });
  } catch (e) {
    console.error('Failed to send text', e);
    messages.value.push({ sender: 'bot', text: 'Maaf, layanan chatbot sedang tidak aktif.' });
  }
};
</script>
