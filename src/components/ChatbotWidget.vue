<template>
  <div class="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-4 pointer-events-none mb-10">
    <!-- Chat Window -->
    <transition
      enter-active-class="transition duration-300 ease-out transform"
      enter-from-class="scale-95 opacity-0 translate-y-10"
      enter-to-class="scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in transform"
      leave-from-class="scale-100 opacity-100 translate-y-0"
      leave-to-class="scale-95 opacity-0 translate-y-10"
    >
      <div v-if="isOpen" class="pointer-events-auto bg-white w-[300px] h-[450px] rounded-3xl shadow-premium border border-gray-100 overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="bg-primary p-4 text-white flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
              <i class="fa-solid fa-robot text-xl"></i>
            </div>
            <div>
              <p class="font-bold text-sm">CS Siantar Minang</p>
              <p class="text-[10px] text-white/70">Online • Bot Cerdas</p>
            </div>
          </div>
          <button @click="toggleChat" class="hover:bg-white/10 p-1.5 rounded-xl transition-colors">
            <i class="fa-solid fa-chevron-down"></i>
          </button>
        </div>
        
        <!-- Messages Area -->
        <div class="flex-1 p-4 overflow-y-auto bg-gray-50/50 flex flex-col gap-4 scrollbar-hide" id="chat-messages">
          <div v-for="(msg, idx) in messages" :key="idx" 
            class="max-w-[85%] rounded-2xl p-3 text-sm shadow-sm"
            :class="msg.sender === 'user' 
              ? 'bg-primary text-white self-end rounded-tr-none' 
              : 'bg-white border border-gray-100 text-gray-800 self-start rounded-tl-none'">
            {{ msg.text }}
          </div>
          <div v-if="isTyping" class="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none self-start flex gap-1">
            <span class="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
            <span class="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></span>
            <span class="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-300"></span>
          </div>
        </div>
        
        <!-- Input Area -->
        <form @submit.prevent="sendMessage" class="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
          <input 
            v-model="inputText" 
            type="text" 
            placeholder="Tanya menu hari ini..." 
            class="flex-1 bg-gray-100 rounded-2xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all" 
          />
          <button 
            type="submit" 
            class="bg-primary text-white rounded-2xl p-2.5 hover:bg-primary-dark transition-all disabled:opacity-50 active:scale-90" 
            :disabled="!inputText.trim() || isTyping"
          >
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </transition>

    <!-- Toggle Button -->
    <button 
      @click="toggleChat" 
      class="pointer-events-auto bg-primary text-white p-4 rounded-3xl shadow-premium hover:bg-primary-dark hover:-translate-y-1 transition-all duration-300 group ring-4 ring-white"
    >
      <div class="relative">
        <i v-if="!isOpen" class="fa-solid fa-comments text-2xl"></i>
        <i v-else class="fa-solid fa-xmark text-2xl"></i>
        <span v-if="!isOpen" class="absolute -top-1 -right-1 flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
        </span>
      </div>
    </button>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import api from '../services/api';

const isOpen = ref(false);
const inputText = ref('');
const isTyping = ref(false);
const messages = ref([
  { sender: 'bot', text: 'Halo! Senang bertemu dengan Anda. Ada yang bisa saya bantu untuk memilih menu hari ini?' }
]);

const toggleChat = () => {
  isOpen.value = !isOpen.value;
};

const scrollToBottom = async () => {
  await nextTick();
  const container = document.getElementById('chat-messages');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
};

const sendMessage = async () => {
  if (!inputText.value.trim()) return;
  
  const text = inputText.value;
  messages.value.push({ sender: 'user', text });
  inputText.value = '';
  isTyping.value = true;
  await scrollToBottom();
  
  try {
    const response = await api.post('/chatbot/message', { message: text });
    setTimeout(() => {
      messages.value.push({ sender: 'bot', text: response.data.response });
      isTyping.value = false;
      scrollToBottom();
    }, 800);
  } catch (e) {
    console.error('Failed to send text', e);
    messages.value.push({ sender: 'bot', text: 'Maaf, layanan chatbot sedang gangguan. Coba lagi nanti.' });
    isTyping.value = false;
    scrollToBottom();
  }
};
</script>
